import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout } from "../components/Layout";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabaseClient";

// =====================================================================
// RÉSULTATS — lit la table Supabase `equipe_resultat` (gérée dans /admin →
// Résultats). Chaque ligne = une équipe ; ses widgets Score'n'co (classement,
// résultats, prochain match, match en direct) sont collés depuis l'admin et
// affichés ici en onglets. Aucune modif de code pour ajouter/changer une équipe.
// =====================================================================

// Colonnes Supabase -> onglets (ordre d'affichage).
const SLOTS: { key: "classement" | "resultat" | "prochain" | "direct"; label: string; live?: boolean }[] = [
  { key: "classement", label: "Classement" },
  { key: "resultat", label: "Résultats" },
  { key: "prochain", label: "Prochain match" },
  { key: "direct", label: "En direct", live: true },
];

// Page club officielle FFBB (repli « voir tous les résultats »).
const FFBB_CLUB_URL =
  "https://competitions.ffbb.com/ligues/ges/comites/0051/clubs/ges0051003";

// Extrait le src d'un <iframe> collé dans l'admin, ou renvoie la valeur telle
// quelle si c'est déjà une URL. Vide sinon.
function widgetSrc(v?: string | null): string {
  if (!v) return "";
  const m = v.match(/src=["']([^"']+)["']/i);
  if (m) return m[1];
  const t = v.trim();
  return /^https?:\/\//i.test(t) ? t : "";
}

type Widget = { key: string; label: string; live?: boolean; src: string };
type EquipeCarte = { id: string; equipe: string; categorie?: string; widgets: Widget[] };

export default function Resultats() {
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("equipe_resultat")
        .select("*")
        .eq("actif", true)
        .order("ordre");
      setRows(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const cartes: EquipeCarte[] = rows
    .map((r) => ({
      id: r.id,
      equipe: r.equipe,
      categorie: r.categorie,
      widgets: SLOTS.map((s) => ({ ...s, src: widgetSrc(r[s.key]) })).filter((w) => w.src),
    }))
    .filter((c) => c.widgets.length > 0);

  return (
    <Layout>
      <Head>
        <title>Derniers résultats — RUC Basket Reims</title>
        <meta
          name="description"
          content="Résultats, classements, prochains matchs et matchs en direct des équipes du RUC Basket Reims, par catégorie."
        />
      </Head>

      <PageHeader kicker="Saison en cours" title="Derniers résultats" variant="club" />

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 26px 80px" }}>
        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "#726b86", fontWeight: 600 }}>
            Chargement des résultats…
          </div>
        ) : cartes.length > 0 ? (
          <>
            <p
              style={{
                fontSize: 15.5,
                lineHeight: 1.6,
                color: "#4a4360",
                fontWeight: 500,
                margin: "0 0 28px",
                maxWidth: 760,
              }}
            >
              Classement, résultats, prochain match et match en direct de chaque
              équipe, mis à jour automatiquement via la fédération
              (Score&apos;n&apos;co · partenaire officiel FFBB).
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              {cartes.map((c) => (
                <EquipeCard key={c.id} carte={c} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}

        <div style={{ marginTop: 36, textAlign: "center" }}>
          <a
            href={FFBB_CLUB_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14.5,
              fontWeight: 700,
              color: "#3d1e7b",
              textDecoration: "none",
              borderBottom: "2px solid #dc8d32",
              paddingBottom: 2,
            }}
          >
            Voir tous les résultats sur le site officiel FFBB →
          </a>
        </div>
      </section>
    </Layout>
  );
}

// Carte d'une équipe : en-tête + onglets (un par widget) + iframe du widget actif.
function EquipeCard({ carte }: { carte: EquipeCarte }) {
  const [active, setActive] = React.useState(0);
  const current = carte.widgets[active] ?? carte.widgets[0];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eee9f4",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 14px 34px -24px rgba(23,18,43,.5)",
      }}
    >
      {/* En-tête équipe */}
      <div
        style={{
          background: "linear-gradient(115deg,#2a1457,#3d1e7b 70%)",
          color: "#fff",
          padding: "14px 20px",
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontSize: 18,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: ".02em",
          }}
        >
          {carte.equipe}
        </span>
        {carte.categorie ? (
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#f0b968", letterSpacing: ".04em" }}>
            {carte.categorie}
          </span>
        ) : null}
      </div>

      {/* Onglets (seulement si plus d'un widget) */}
      {carte.widgets.length > 1 ? (
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            padding: "12px 14px 0",
            borderBottom: "1px solid #f0ecf6",
          }}
        >
          {carte.widgets.map((w, i) => {
            const isActive = i === active;
            return (
              <button
                key={w.key}
                type="button"
                onClick={() => setActive(i)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 13.5,
                  padding: "9px 15px",
                  borderRadius: "10px 10px 0 0",
                  background: isActive ? "#3d1e7b" : "#f4f2f8",
                  color: isActive ? "#fff" : "#3d1e7b",
                  marginBottom: -1,
                }}
              >
                {w.live ? (
                  <span
                    aria-hidden
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#e2483d",
                      boxShadow: "0 0 0 3px rgba(226,72,61,.25)",
                      display: "inline-block",
                    }}
                  />
                ) : null}
                {w.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Widget actif */}
      <iframe
        title={`${carte.equipe} — ${current.label}`}
        src={current.src}
        loading="lazy"
        referrerPolicy="unsafe-url"
        style={{ width: "100%", height: 520, border: "none", display: "block", background: "#fff" }}
      />
    </div>
  );
}

// État vide : mode d'emploi tant qu'aucune équipe n'est saisie dans l'admin.
function EmptyState() {
  const steps = [
    {
      t: "Créer un compte Score'n'co",
      d: "Gratuit. Partenaire officiel FFBB depuis 2017 (données officielles, mises à jour automatiques).",
    },
    {
      t: "Créer les widgets par équipe",
      d: "Pour « Reims Université Club Basket » : Classement, Résultats, Prochain match, En direct. Couleurs #3d1e7b / #dc8d32.",
    },
    {
      t: "Copier le code d'intégration",
      d: "Chaque widget fournit un <iframe>. Copie-le (ou juste son URL).",
    },
    {
      t: "Coller dans l'admin",
      d: "Espace admin → Résultats → Nouvelle équipe, puis colle chaque iframe dans sa case.",
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eee9f4",
        borderRadius: 20,
        padding: "34px 30px",
        boxShadow: "0 18px 40px -28px rgba(23,18,43,.5)",
      }}
    >
      <div
        style={{
          fontFamily: "'Oswald',sans-serif",
          fontSize: 13,
          letterSpacing: ".2em",
          textTransform: "uppercase",
          color: "#dc8d32",
          fontWeight: 600,
        }}
      >
        Bientôt disponible
      </div>
      <h2
        style={{
          fontFamily: "'Oswald',sans-serif",
          fontSize: "clamp(22px,3vw,30px)",
          fontWeight: 700,
          color: "#1d1730",
          margin: "8px 0 10px",
          textTransform: "uppercase",
        }}
      >
        Les résultats par catégorie arrivent
      </h2>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: "#4a4360", fontWeight: 500, maxWidth: 680, margin: "0 0 26px" }}>
        Chaque équipe affichera son <strong>classement</strong>, ses{" "}
        <strong>résultats</strong>, son <strong>prochain match</strong> et le{" "}
        <strong>match en direct</strong> — automatiquement, sans saisie manuelle,
        grâce aux widgets gratuits de <strong>Score&apos;n&apos;co</strong>{" "}
        (partenaire officiel de la FFBB). Voici les 4 étapes :
      </p>

      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14 }}>
        {steps.map((s, i) => (
          <li key={s.t} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span
              style={{
                flexShrink: 0,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#3d1e7b",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </span>
            <div>
              <div style={{ fontWeight: 800, color: "#1d1730", fontSize: 15 }}>{s.t}</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: "#726b86", fontWeight: 500 }}>{s.d}</div>
            </div>
          </li>
        ))}
      </ol>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
        <a
          href="https://scorenco.com/clubs/widgets"
          target="_blank"
          rel="noreferrer"
          style={{
            background: "#dc8d32",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14.5,
            padding: "13px 22px",
            borderRadius: 999,
            textDecoration: "none",
            boxShadow: "0 10px 24px -12px rgba(220,141,50,.8)",
          }}
        >
          Créer les widgets sur Score&apos;n&apos;co
        </a>
        <Link
          href="/admin"
          style={{
            background: "none",
            color: "#3d1e7b",
            border: "1.5px solid #3d1e7b",
            fontWeight: 800,
            fontSize: 14.5,
            padding: "13px 22px",
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          Aller à l&apos;espace admin
        </Link>
      </div>
    </div>
  );
}
