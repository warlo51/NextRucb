import React, { useState } from "react";
import Head from "next/head";
import { Layout } from "../components/Layout";
import PageHeader from "../components/PageHeader";

const MOTIFS = [
  "Demande d'essai",
  "Inscription / licence",
  "Mini-basket",
  "Partenariat / mécénat",
  "Autre",
];

const IG = "https://www.instagram.com/reims_universite_club_basket/";

const label: React.CSSProperties = {
  display: "block",
  fontFamily: "'Oswald',sans-serif",
  fontSize: 12.5,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  fontWeight: 600,
  color: "#3d1e7b",
  marginBottom: 7,
};

const field: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  border: "1.5px solid #e1dcec",
  borderRadius: 12,
  fontFamily: "'Manrope',sans-serif",
  fontSize: 15,
  color: "#1d1730",
  background: "#faf9fc",
};

type Etat = { type: "idle" | "sending" | "ok" | "error"; msg?: string };

const EMPTY = { nom: "", email: "", telephone: "", motif: MOTIFS[0], message: "", website: "" };

const Contact = () => {
  const [form, setForm] = useState(EMPTY);
  const [etat, setEtat] = useState<Etat>({ type: "idle" });

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (etat.type === "sending") return;
    setEtat({ type: "sending" });
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "L'envoi a échoué. Réessaie plus tard.");
      setForm(EMPTY);
      setEtat({ type: "ok", msg: "Message envoyé ! On te répond très vite." });
    } catch (err: any) {
      setEtat({ type: "error", msg: err.message || "L'envoi a échoué. Réessaie plus tard." });
    }
  }

  const sending = etat.type === "sending";

  return (
    <Layout>
      <Head>
        <title>Contact — RUC Basket Reims</title>
        <meta
          name="description"
          content="Contacte le RUC Basket Reims : demande d'essai gratuit, inscription, licence, mini-basket ou partenariat."
        />
      </Head>

      <PageHeader kicker="Nous écrire" title="Formulaire de contact" variant="club" />

      <section style={{ background: "#f7f5fb", padding: "48px 26px 64px" }}>
        <div className="contactGrid">
          {/* Formulaire */}
          <form
            onSubmit={submit}
            style={{
              background: "#fff",
              border: "1px solid #eee9f4",
              borderRadius: 18,
              padding: "28px 26px",
              boxShadow: "0 18px 40px -28px rgba(61,30,123,.45)",
            }}
          >
            <h2 style={{ fontSize: 22, margin: "0 0 6px", color: "#1d1730" }}>Envoie-nous un message</h2>
            <p style={{ fontSize: 14.5, color: "#5c5470", margin: "0 0 24px", lineHeight: 1.6 }}>
              Essai gratuit, inscription, renseignements&nbsp;: remplis le formulaire, un membre du club
              te répond par email.
            </p>

            <div className="contactRow">
              <div>
                <label style={label} htmlFor="nom">
                  Nom et prénom *
                </label>
                <input id="nom" className="contactField" style={field} value={form.nom} onChange={set("nom")} maxLength={100} required />
              </div>
              <div>
                <label style={label} htmlFor="email">
                  Email *
                </label>
                <input id="email" className="contactField" type="email" style={field} value={form.email} onChange={set("email")} maxLength={150} required />
              </div>
            </div>

            <div className="contactRow" style={{ marginTop: 18 }}>
              <div>
                <label style={label} htmlFor="telephone">
                  Téléphone
                </label>
                <input id="telephone" className="contactField" type="tel" style={field} value={form.telephone} onChange={set("telephone")} maxLength={30} />
              </div>
              <div>
                <label style={label} htmlFor="motif">
                  Motif
                </label>
                <select id="motif" className="contactField" style={field} value={form.motif} onChange={set("motif")}>
                  {MOTIFS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <label style={label} htmlFor="message">
                Message *
              </label>
              <textarea
                id="message"
                className="contactField"
                rows={7}
                style={{ ...field, resize: "vertical" }}
                value={form.message}
                onChange={set("message")}
                maxLength={5000}
                placeholder="Âge / catégorie du joueur, niveau, disponibilités…"
                required
              />
            </div>

            {/* Honeypot anti-spam : invisible pour les humains, rempli par les bots. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={form.website}
              onChange={set("website")}
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, marginTop: 24 }}>
              <button
                type="submit"
                className="btnHover"
                disabled={sending}
                style={{
                  background: sending ? "#8a76bd" : "#3d1e7b",
                  color: "#fff",
                  border: "none",
                  fontFamily: "'Manrope',sans-serif",
                  fontWeight: 800,
                  fontSize: 15.5,
                  padding: "14px 32px",
                  borderRadius: 999,
                  cursor: sending ? "default" : "pointer",
                }}
              >
                {sending ? "Envoi en cours…" : "Envoyer le message"}
              </button>
              <span style={{ fontSize: 12.5, color: "#7a7290" }}>* champs obligatoires</span>
            </div>

            {etat.type === "ok" || etat.type === "error" ? (
              <div
                role="status"
                style={{
                  marginTop: 20,
                  padding: "13px 16px",
                  borderRadius: 12,
                  fontSize: 14.5,
                  fontWeight: 600,
                  background: etat.type === "ok" ? "#eaf7ef" : "#fdecec",
                  color: etat.type === "ok" ? "#1c6b3a" : "#a12727",
                  border: `1px solid ${etat.type === "ok" ? "#bfe4cd" : "#f3c4c4"}`,
                }}
              >
                {etat.msg}
              </div>
            ) : null}
          </form>

          {/* Colonne infos */}
          <aside
            style={{
              background: "linear-gradient(160deg,#3d1e7b,#241046)",
              color: "#fff",
              borderRadius: 18,
              padding: "28px 26px",
              alignSelf: "start",
            }}
          >
            <h2 style={{ fontSize: 20, margin: "0 0 18px" }}>Nous joindre autrement</h2>

            <div style={{ fontSize: 14, lineHeight: 1.7, color: "#e7ddf6", fontWeight: 500 }}>
              <div style={{ marginBottom: 18 }}>
                <div style={{ ...label, color: "#f0b968", marginBottom: 4 }}>Email</div>
                <a href="mailto:rucb.contact@gmail.com" style={{ color: "#fff", fontWeight: 700 }}>
                  rucb.contact@gmail.com
                </a>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ ...label, color: "#f0b968", marginBottom: 4 }}>Gymnase</div>
                Gymnase Endy Miyem
                <br />
                Reims (51100)
              </div>
              <div>
                <div style={{ ...label, color: "#f0b968", marginBottom: 4 }}>Réseaux</div>
                <a href={IG} target="_blank" rel="noreferrer" style={{ color: "#fff", fontWeight: 700 }}>
                  Instagram @reims_universite_club_basket
                </a>
              </div>
            </div>

            <div
              style={{
                marginTop: 26,
                paddingTop: 20,
                borderTop: "1px solid rgba(255,255,255,.18)",
                fontSize: 13.5,
                lineHeight: 1.6,
                color: "#d8cbf0",
              }}
            >
              Essais gratuits toute l&apos;année, à tout âge. Consulte aussi le{" "}
              <a href="/planning" style={{ color: "#f0b968", fontWeight: 700 }}>
                planning des entraînements
              </a>{" "}
              pour repérer le créneau de ta catégorie.
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;