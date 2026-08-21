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

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.error("[contact] SMTP non configuré (SMTP_HOST / SMTP_USER / SMTP_PASSWORD).");
    return res
      .status(503)
      .json({ error: "L'envoi d'email n'est pas encore configuré. Écris-nous directement à " + CONTACT_TO });
  }

  const port = Number(SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = TLS implicite, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  const lignes: [string, string][] = [
    ["Nom", nom],
    ["Email", email],
    ["Téléphone", telephone || "—"],
    ["Motif", motifOk],
  ];

  try {
    await transporter.sendMail({
      // L'expéditeur doit rester une boîte qu'on possède (SPF/DKIM) : on met
      // l'adresse du visiteur en Reply-To pour pouvoir répondre d'un clic.
      from: `"Site RUCB" <${SMTP_FROM || SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: `"${nom.replace(/"/g, "")}" <${email}>`,
      subject: `[Site RUCB] ${motifOk} — ${nom}`,
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
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact] échec de l'envoi :", err);
    return res.status(502).json({ error: "L'envoi a échoué. Réessaie plus tard ou écris-nous à " + CONTACT_TO });
  }
}