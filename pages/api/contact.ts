import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

// Destinataire des messages du formulaire de contact (surchargeable par env).
const CONTACT_TO = process.env.CONTACT_TO || "rucb.contact@gmail.com";

// Motifs proposés dans le <select> de /contact — on refuse tout le reste.
export const MOTIFS = [
  "Demande d'essai",
  "Inscription / licence",
  "Mini-basket",
  "Partenariat / mécénat",
  "Autre",
] as const;

const MAX = { nom: 100, email: 150, telephone: 30, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Anti-spam basique : 3 envois max par IP et par quart d'heure. La mémoire
// n'est pas partagée entre instances serverless, ça ne bloque donc qu'un
// bourrinage simple — le honeypot fait le reste.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now: number) {
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) hits.clear(); // garde-fou mémoire
  return false;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Empêche l'injection d'en-têtes via les champs repris dans Subject / Reply-To.
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

/* --- Envoi ---------------------------------------------------------------
 * Deux backends, dans cet ordre : le relais SMTP via Nodemailer, puis la Send
 * API de Mailjet en repli. Le SMTP passe devant parce qu'on expédie depuis la
 * boîte Gmail du club : c'est Google qui signe alors le message (DKIM/SPF
 * alignés avec gmail.com), là où un relais tiers réclamant une adresse
 * @gmail.com se fait classer en spam. */

type Courriel = {
  subject: string;
  text: string;
  html: string;
  replyTo: { name: string; email: string };
};

// L'expéditeur doit être une adresse validée chez le fournisseur d'envoi
// (Mailjet → Expéditeurs et domaines) : c'est elle qui porte SPF/DKIM.
// L'adresse du visiteur, elle, part en Reply-To.
// NB : SMTP_USER n'est pas dans ce repli — chez Mailjet c'est la clé API, pas
// une adresse email (contrairement à un SMTP Gmail où les deux coïncident).
let expediteurSignale = false;
const expediteur = () => {
  const from = process.env.CONTACT_FROM || process.env.SMTP_FROM;
  if (from) return from;
  // Dernier recours : on s'écrit à soi-même — Gmail affiche alors « moi », et
  // via un relais tiers le message part en spam (un @gmail.com expédié par un
  // autre que Google ne peut pas aligner DKIM/SPF).
  if (!expediteurSignale) {
    expediteurSignale = true;
    console.warn(
      `[contact] CONTACT_FROM non défini : envoi depuis ${CONTACT_TO}, affiché « moi » dans Gmail.`
    );
  }
  return CONTACT_TO;
};

const configure = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) ||
  Boolean(process.env.MAILJET_API_KEY && process.env.MAILJET_API_SECRET);

async function envoyerViaMailjet(cle: string, secret: string, mail: Courriel) {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 10000);
  try {
    const rep = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        // Mailjet authentifie en Basic : Clé API = login, Clé secrète = mot de passe.
        authorization: "Basic " + Buffer.from(`${cle}:${secret}`).toString("base64"),
        "content-type": "application/json",
      },
      body: JSON.stringify({
        Messages: [
          {
            From: { Email: expediteur(), Name: "Site RUCB" },
            To: [{ Email: CONTACT_TO }],
            ReplyTo: { Email: mail.replyTo.email, Name: mail.replyTo.name },
            Subject: mail.subject,
            TextPart: mail.text,
            HTMLPart: mail.html,
          },
        ],
      }),
      signal: ctrl.signal,
    });

    // Mailjet détaille la cause dans le corps (expéditeur non validé, clés
    // invalides…) : on la garde pour les logs.
    const corps = await rep.text();
    if (!rep.ok) throw new Error(`Mailjet a répondu ${rep.status} : ${corps}`);

    // Et il peut répondre 200 en signalant l'échec message par message.
    let statut: string | undefined;
    try {
      statut = JSON.parse(corps)?.Messages?.[0]?.Status;
    } catch {
      /* corps non JSON : traité comme un échec juste en dessous */
    }
    if (statut !== "success") throw new Error(`Mailjet a refusé l'envoi : ${corps}`);
  } finally {
    clearTimeout(timeout);
  }
}

async function envoyerViaSmtp(mail: Courriel) {
  const port = Number(process.env.SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = TLS implicite, 587 = STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  await transporter.sendMail({
    from: `"Site RUCB" <${expediteur()}>`,
    to: CONTACT_TO,
    replyTo: `"${mail.replyTo.name}" <${mail.replyTo.email}>`,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const body = (typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body) || {};
  const nom = oneLine(String(body.nom || ""));
  const email = oneLine(String(body.email || ""));
  const telephone = oneLine(String(body.telephone || ""));
  const motif = oneLine(String(body.motif || ""));
  const message = String(body.message || "").trim();

  // Honeypot : champ invisible rempli uniquement par les bots → succès factice.
  if (String(body.website || "").trim()) return res.status(200).json({ ok: true });

  if (!nom || !email || !message) {
    return res.status(400).json({ error: "Nom, email et message sont obligatoires." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "L'adresse email n'est pas valide." });
  }
  if (
    nom.length > MAX.nom ||
    email.length > MAX.email ||
    telephone.length > MAX.telephone ||
    message.length > MAX.message
  ) {
    return res.status(400).json({ error: "Un des champs dépasse la longueur autorisée." });
  }
  const motifOk = (MOTIFS as readonly string[]).includes(motif) ? motif : "Autre";

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "local";
  if (rateLimited(ip, Date.now())) {
    return res.status(429).json({ error: "Trop de messages envoyés. Réessaie dans quelques minutes." });
  }

  if (!configure()) {
    console.error(
      "[contact] envoi non configuré (SMTP_HOST / SMTP_USER / SMTP_PASSWORD, ou MAILJET_API_KEY + MAILJET_API_SECRET)."
    );
    return res
      .status(503)
      .json({ error: "L'envoi d'email n'est pas encore configuré. Écris-nous directement à " + CONTACT_TO });
  }

  const lignes: [string, string][] = [
    ["Nom", nom],
    ["Email", email],
    ["Téléphone", telephone || "—"],
    ["Motif", motifOk],
  ];

  const mail: Courriel = {
    subject: `[Site RUCB] ${motifOk} — ${nom}`,
    replyTo: { name: nom.replace(/"/g, ""), email },
    text: lignes.map(([k, v]) => `${k} : ${v}`).join("\n") + `\n\nMessage :\n${message}`,
    html:
      `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1d1730">` +
      `<h2 style="color:#3d1e7b;margin:0 0 12px">Nouveau message depuis le site RUCB</h2>` +
      `<table cellpadding="6" style="border-collapse:collapse;margin-bottom:16px">` +
      lignes
        .map(
          ([k, v]) =>
            `<tr><td style="background:#f5f2fa;font-weight:bold">${k}</td><td>${esc(v)}</td></tr>`
        )
        .join("") +
      `</table>` +
      `<div style="white-space:pre-wrap;border-left:3px solid #dc8d32;padding-left:12px">${esc(
        message
      )}</div></div>`,
  };

  try {
    const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD, MAILJET_API_KEY, MAILJET_API_SECRET } = process.env;
    if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
      await envoyerViaSmtp(mail);
    } else if (MAILJET_API_KEY && MAILJET_API_SECRET) {
      await envoyerViaMailjet(MAILJET_API_KEY, MAILJET_API_SECRET, mail);
    } else {
      // Inatteignable (configure() l'a déjà écarté), mais on ne veut surtout
      // pas répondre 200 sans avoir rien envoyé.
      throw new Error("aucun backend d'envoi configuré");
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact] échec de l'envoi :", err);
    return res.status(502).json({ error: "L'envoi a échoué. Réessaie plus tard ou écris-nous à " + CONTACT_TO });
  }
}
