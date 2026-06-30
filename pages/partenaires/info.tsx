import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout } from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import { supabase } from "../../lib/supabaseClient";

// Repli si la table partenaire Supabase est vide / non configurée.
const FALLBACK_LOGOS = [
  { nom: "Carrefour", logo_url: "/sponsors/logocarrefour.png", site_url: "" },
  { nom: "Norauto", logo_url: "/sponsors/NouveauLogoNorauto.jpg", site_url: "" },
  { nom: "Buffalo Grill", logo_url: "/sponsors/logoBuffaloGrill.png", site_url: "" },
  { nom: "CIC", logo_url: "/sponsors/logoCIC.jpg", site_url: "" },
  { nom: "Ville de Reims", logo_url: "/sponsors/LogoVilledeReims.jpg", site_url: "" },
  { nom: "Département 51", logo_url: "/sponsors/CD51.png", site_url: "" },
];

export default function PartenairesInfo() {
  const [partenaires, setPartenaires] = React.useState<any[]>(FALLBACK_LOGOS);
  const [dossierUrl, setDossierUrl] = React.useState<string>("");
  const [dossierName, setDossierName] = React.useState<string>("dossier-partenariat.pdf");

  React.useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("partenaire")
        .select("nom, logo_url, site_url")
        .eq("actif", true)
        .order("ordre");
      const withLogo = (data || []).filter((p: any) => p.logo_url);
      if (withLogo.length) setPartenaires(withLogo);

      const { data: dossier } = await supabase
        .from("sponsor_file")
        .select("file_url, nom")
        .eq("actif", true)
        .order("created_at", { ascending: false })
        .limit(1);
      if (dossier && dossier[0]?.file_url) {
        setDossierUrl(dossier[0].file_url);
        if (dossier[0].nom) setDossierName(dossier[0].nom);
      }
    }
    load().catch(() => undefined);
  }, []);

  // Téléchargement forcé : l'attribut `download` est ignoré en cross-origin (Storage Supabase),
  // on passe donc par un blob local.
  async function downloadDossier() {
    try {
      const res = await fetch(dossierUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = dossierName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(dossierUrl, "_blank");
    }
  }

  const dossierBtnStyle: React.CSSProperties = {
    background: "#dc8d32",
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    fontFamily: "'Manrope',sans-serif",
    padding: "12px 22px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    display: "inline-block",
  };

  return (
    <Layout>
      <Head>
        <title>Nos partenaires</title>
        <meta name="description" content="Les partenaires du RUC Basket Reims." />
        <meta
          name="google-site-verification"
          content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU"
        />
      </Head>

      <PageHeader kicker="Ensemble, plus forts" title="Nos partenaires" />

      <section style={{ padding: "54px 26px 30px", maxWidth: 1240, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.65,
            color: "var(--text-soft)",
            fontWeight: 500,
            maxWidth: 640,
            margin: "0 0 34px",
          }}
        >
          Le RUC Basket remercie chaleureusement les entreprises et collectivités qui soutiennent le
          club et permettent à nos jeunes de pratiquer dans les meilleures conditions.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
            gap: 18,
          }}
        >
          {partenaires.map((p, i) => {
            const tile = (
              <div
                style={{
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#faf9fc",
                  border: "1px solid var(--line)",
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: "0 14px 34px -28px rgba(23,18,43,.5)",
                }}
              >
                <img
                  src={p.logo_url}
                  alt={p.nom || "partenaire"}
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                />
              </div>
            );
            return p.site_url ? (
              <a key={i} href={p.site_url} target="_blank" rel="noreferrer">
                {tile}
              </a>
            ) : (
              <div key={i}>{tile}</div>
            );
          })}
        </div>
      </section>

      <section style={{ padding: "30px 26px 70px", maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 22,
          }}
        >
          <div
            style={{
              background: "var(--paper)",
              borderRadius: 18,
              border: "1px solid var(--line)",
              borderLeft: "4px solid var(--violet-soft)",
              padding: 30,
              boxShadow: "0 14px 34px -28px rgba(23,18,43,.5)",
            }}
          >
            <h3
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontSize: 22,
                fontWeight: 600,
                textTransform: "uppercase",
                color: "var(--brand-fg)",
                margin: "0 0 12px",
              }}
            >
              Mécénat
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-soft)", fontWeight: 500, margin: 0 }}>
              Soutenez un projet associatif local et bénéficiez d'une réduction d'impôt. Votre don
              finance la formation des jeunes et l'achat d'équipements.
            </p>
          </div>
          <div
            style={{
              background: "var(--paper)",
              borderRadius: 18,
              border: "1px solid var(--line)",
              borderLeft: "4px solid var(--orange)",
              padding: 30,
              boxShadow: "0 14px 34px -28px rgba(23,18,43,.5)",
            }}
          >
            <h3
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontSize: 22,
                fontWeight: 600,
                textTransform: "uppercase",
                color: "var(--brand-fg)",
                margin: "0 0 12px",
              }}
            >
              Devenir partenaire
            </h3>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--text-soft)",
                fontWeight: 500,
                margin: "0 0 18px",
              }}
            >
              Visibilité au gymnase, sur le site et les réseaux du club, et association à des valeurs
              fortes : respect, compétition, convivialité.
            </p>
            {dossierUrl ? (
              <button type="button" onClick={downloadDossier} className="btnHover" style={dossierBtnStyle}>
                Télécharger le dossier
              </button>
            ) : (
              <Link href="/partenaires/mecenat" className="btnHover" style={dossierBtnStyle}>
                Demander le dossier
              </Link>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
