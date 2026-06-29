import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { Layout } from "../components/Layout";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabaseClient";

// =====================================================================
// RÉSULTATS — lit la table Supabase `equipe_resultat` (gérée dans /admin →
// Résultats). 1 ligne = 1 équipe, avec 2 widgets Score'n'co :
//   • widget : combiné (classement + résultats + calendrier)
//   • direct : match en direct (optionnel)
// Le code d'intégration collé est rendu TEL QUEL : avec le code « script »
// Score'n'co (loader chargé plus bas), l'iframe s'auto-redimensionne — donc
// aucune hauteur imposée. La page affiche une carte/équipe (onglets si les 2
// widgets sont remplis), filtrable par catégorie.
// =====================================================================

// Ordre logique des catégories pour la barre de filtres (le reste suit en alpha).
const CAT_ORDER = ["U7", "U9", "U11", "U13", "U15", "U17", "U18", "U20", "Seniors", "SE", "Séniors", "Vétérans"];
const catRank = (c: string) => {
  const i = CAT_ORDER.findIndex((x) => x.toLowerCase() === c.toLowerCase());
  return i === -1 ? 999 : i;
};
const triCategories = (cats: string[]) =>
  [...cats].sort((a, b) => catRank(a) - catRank(b) || a.localeCompare(b, "fr"));

// Page club officielle FFBB (repli « voir tous les résultats »).
const FFBB_CLUB_URL =
  "https://competitions.ffbb.com/ligues/ges/comites/0051/clubs/ges0051003";

// Transforme la valeur collée dans l'admin en HTML à injecter :
//  - code d'intégration complet (script-embed ou iframe) : rendu tel quel
//    (on retire les <script>, inertes via innerHTML — le loader est chargé une
//    seule fois sur la page) ;
//  - URL seule : iframe responsive de repli.
function renderEmbed(v?: string | null): string {
  const t = (v || "").trim();
  if (!t) return "";
  if (/<iframe|<div/i.test(t)) {
    return t.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  }
  if (/^https?:\/\//i.test(t)) {
    return `<iframe src="${t}" style="width:100%;height:640px;border:0" referrerpolicy="unsafe-url" loading="lazy"></iframe>`;
  }
  return "";
}

type Widget = { key: string; label: string; live?: boolean; html: string };
type EquipeCarte = { id: string; equipe: string; categorie?: string; widgets: Widget[] };

export default function Resultats() {
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filtre, setFiltre] = React.useState<string>("all");

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
      widgets: [
        { key: "widget", label: "Classement & résultats", html: renderEmbed(r.widget) },
        { key: "direct", label: "En direct", live: true, html: renderEmbed(r.direct) },
      ].filter((w) => w.html),
    }))
    .filter((c) => c.widgets.length > 0);

  // Catégories présentes (pour la barre de filtres) + cartes visibles.
  const categories = triCategories(
    Array.from(new Set(cartes.map((c) => c.categorie).filter(Boolean))) as string[]
  );
  const visibles =
    filtre === "all" ? cartes : cartes.filter((c) => (c.categorie || "") === filtre);

  return (
    <Layout>
      <Head>
        <title>Derniers résultats — RUC Basket Reims</title>
        <meta
          name="description"
          content="Classements, résultats et calendrier des équipes du RUC Basket Reims, par catégorie."
        />
      </Head>

      {/* Loader Score'n'co : hydrate et auto-redimensionne les widgets « script ». */}
      <Script src="https://widgets.scorenco.com/host/widgets.js" strategy="afterInteractive" />

      <PageHeader kicker="Saison en cours" title="Derniers résultats" variant="club" />

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 26px 80px" }}>
        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--muted)", fontWeight: 600 }}>
            Chargement des résultats…
          </div>
        ) : cartes.length > 0 ? (
          <>
            <p
              style={{
                fontSize: 15.5,
                lineHeight: 1.6,
                color: "var(--text-soft)",
                fontWeight: 500,
                margin: "0 0 22px",
                maxWidth: 760,
              }}
            >
              Classement, résultats et calendrier de chaque équipe, mis à jour
              automatiquement via la fédération (Score&apos;n&apos;co · partenaire
              officiel FFBB).
            </p>

            {/* Filtre par catégorie */}
            {categories.length > 1 ? (
              <div
                role="tablist"
                aria-label="Filtrer par catégorie"
                style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}
              >
                {[{ k: "all", l: "Toutes" }, ...categories.map((c) => ({ k: c, l: c }))].map((opt) => {
                  const isActive = filtre === opt.k;
                  return (
                    <button
                      key={opt.k}
                      type="button"
                      onClick={() => setFiltre(opt.k)}
                      aria-pressed={isActive}
                      style={{
                        cursor: "pointer",
                        fontWeight: 800,
                        fontSize: 13.5,
                        padding: "9px 17px",
                        borderRadius: 999,
                        border: isActive ? "1.5px solid var(--orange)" : "1.5px solid var(--line)",
                        background: isActive ? "var(--orange)" : "var(--paper-2)",
                        color: isActive ? "#fff" : "var(--brand-fg)",
                        transition: "background .15s,color .15s",
                      }}
                    >
                      {opt.l}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              {visibles.map((c) => (
                <EquipeCard key={c.id} carte={c} />
              ))}
            </div>

            {visibles.length === 0 ? (
              <div style={{ padding: "30px 0", textAlign: "center", color: "var(--muted)", fontWeight: 600 }}>
                Aucune équipe dans cette catégorie.
              </div>
            ) : null}
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
              color: "var(--brand-fg)",
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

// Carte d'une équipe : en-tête + onglets (combiné / en direct) + widget actif.
function EquipeCard({ carte }: { carte: EquipeCarte }) {
  const [active, setActive] = React.useState(0);
  const current = carte.widgets[active] ?? carte.widgets[0];

  return (
    <div
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 14px 34px -24px rgba(23,18,43,.5)",
      }}
    >
      {/* En-tête équipe */}
      <div
        style={{
          background: "radial-gradient(120% 200% at 0% 0%,rgba(220,141,50,.22),transparent 55%),#15141b",
          borderBottom: "2px solid #dc8d32",
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

      {/* Onglets (seulement si combiné + direct sont tous les deux remplis) */}
      {carte.widgets.length > 1 ? (
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            padding: "12px 14px 0",
            borderBottom: "1px solid var(--line)",
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
                  background: isActive ? "var(--orange)" : "var(--paper-2)",
                  color: isActive ? "#fff" : "var(--brand-fg)",
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

      {/* Widget actif — code d'intégration Score'n'co rendu tel quel (auto-resize). */}
      <div key={active} style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: current.html }} />
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
      t: "Créer un widget par équipe",
      d: "Pour « Reims Université Club Basket » : le widget combiné classement + résultats + calendrier. Couleurs #3d1e7b / #dc8d32.",
    },
    {
      t: "Copier le code d'intégration « script »",
      d: "Préfère le code « script » (data-widget-id + widgets.js) : il s'auto-redimensionne.",
    },
    {
      t: "Coller dans l'admin",
      d: "Espace admin → Résultats → Nouvelle équipe, puis colle le code dans la case Widget (et Direct si besoin).",
    },
  ];

  return (
    <div
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
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
          color: "var(--text)",
          margin: "8px 0 10px",
          textTransform: "uppercase",
        }}
      >
        Les résultats par catégorie arrivent
      </h2>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-soft)", fontWeight: 500, maxWidth: 680, margin: "0 0 26px" }}>
        Chaque équipe affichera son <strong>classement</strong>, ses{" "}
        <strong>résultats</strong> et son <strong>calendrier</strong> —
        automatiquement, sans saisie manuelle, grâce aux widgets gratuits de{" "}
        <strong>Score&apos;n&apos;co</strong> (partenaire officiel de la FFBB).
        Voici les 4 étapes :
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
                background: "var(--orange)",
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
              <div style={{ fontWeight: 800, color: "var(--text)", fontSize: 15 }}>{s.t}</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--muted)", fontWeight: 500 }}>{s.d}</div>
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
            color: "var(--brand-fg)",
            border: "1.5px solid var(--orange)",
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
