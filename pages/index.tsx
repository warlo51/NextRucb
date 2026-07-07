import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout } from "../components/Layout";
import { supabase } from "../lib/supabaseClient";
import { forceDownload } from "../lib/forceDownload";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const VALEURS = [
  { num: "01", t: "Accueil", d: "Une place pour chacun, du loisir à la compétition." },
  { num: "02", t: "Respect", d: "Des partenaires, des adversaires et des arbitres." },
  { num: "03", t: "Compétition", d: "Progresser et se dépasser, match après match." },
  { num: "04", t: "Convivialité", d: "Un club, une famille, des moments partagés." },
];

const EQUIPES = [
  { groupe: "École de basket", cats: ["U7", "U9", "U11 fém.", "U11"] },
  { groupe: "Académie", cats: ["U13", "U15"] },
  { groupe: "Secteur seniors", cats: ["U17", "D2", "PR1"] },
];

// Visuels Instagram de repli (assets du club) si aucun flux Behold n'est
// configuré. Dès que NEXT_PUBLIC_INSTAGRAM_FEED_URL est renseigné, ils sont
// remplacés par les vrais derniers posts — le markup de la grille reste identique.
const INSTA = [
  { img: "/gymnase3.jpg", likes: 132 },
  { img: "/gymnase2.jpg", likes: 98 },
  { img: "/bandeau1.jpg", likes: 76 },
  { img: "/gymnase1.jpg", likes: 154 },
  { img: "/gymnase4.jpg", likes: 63 },
  { img: "/gymnase5.jpg", likes: 201 },
];

const IG_HANDLE = "reims_universite_club_basket";
const IG_URL = `https://www.instagram.com/${IG_HANDLE}/`;
// Flux JSON Behold.so (https://behold.so) : à renseigner dans .env.local.
// Vide => repli sur les visuels statiques ci-dessus.
const IG_FEED_URL = process.env.NEXT_PUBLIC_INSTAGRAM_FEED_URL || "";

// Repli si la table partenaire Supabase est vide / non configurée.
const FALLBACK_SPONSORS = [
  { logo_url: "/sponsors/logocarrefour.png", site_url: "", nom: "Carrefour" },
  { logo_url: "/sponsors/NouveauLogoNorauto.jpg", site_url: "", nom: "Norauto" },
  { logo_url: "/sponsors/logoBuffaloGrill.png", site_url: "", nom: "Buffalo Grill" },
  { logo_url: "/sponsors/logoCIC.jpg", site_url: "", nom: "CIC" },
  { logo_url: "/sponsors/LogoVilledeReims.jpg", site_url: "", nom: "Ville de Reims" },
  { logo_url: "/sponsors/CD51.png", site_url: "", nom: "Département 51" },
];

const formatDate = (d: string) =>
  d
    ? new Date(d)
        .toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
        .toUpperCase()
    : "";

const Home: NextPage = () => {
  const [actus, setActus] = useState<any[]>([]);
  const [creneaux, setCreneaux] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>(FALLBACK_SPONSORS);
  const [equipes, setEquipes] = useState<any[]>([]);
  const [instaPosts, setInstaPosts] = useState<any[]>([]);
  const [licence, setLicence] = useState<{ url: string; nom: string } | null>(null);
  const [bandeau, setBandeau] = useState<string>("");

  useEffect(() => {
    async function loadSupabase() {
      const today = new Date().toISOString().slice(0, 10);
      const { data: ac } = await supabase
        .from("actu")
        .select("id, titre, slug, categorie, date_publication, extrait, image_url, video_url")
        .eq("actif", true)
        .lte("date_publication", today)
        .or(`date_fin_publication.is.null,date_fin_publication.gte.${today}`)
        .order("date_publication", { ascending: false })
        .limit(3);
      setActus(ac || []);

      const { data: cr } = await supabase.from("creneau").select("jour").eq("actif", true);
      setCreneaux(cr || []);

      const { data: pa } = await supabase
        .from("partenaire")
        .select("logo_url, site_url, nom")
        .eq("actif", true)
        .order("ordre");
      const logos = (pa || []).filter((p: any) => p.logo_url);
      if (logos.length) setSponsors(logos);

      const { data: eq } = await supabase
        .from("equipe")
        .select("categorie, nom, ordre")
        .eq("actif", true)
        .order("ordre");
      setEquipes(eq || []);

      const { data: lf } = await supabase
        .from("licence_file")
        .select("file_url, nom")
        .eq("actif", true)
        .order("created_at", { ascending: false })
        .limit(1);
      if (lf && lf[0]?.file_url) setLicence({ url: lf[0].file_url, nom: lf[0].nom || "dossier-licence.pdf" });

      const { data: bn } = await supabase
        .from("bandeau")
        .select("image_url")
        .eq("actif", true)
        .order("created_at", { ascending: false })
        .limit(1);
      if (bn && bn[0]?.image_url) setBandeau(bn[0].image_url);
    }
    loadSupabase().catch(() => undefined);

    async function loadInstagram() {
      if (!IG_FEED_URL) return;
      try {
        const res = await fetch(IG_FEED_URL);
        const json = await res.json();
        // Behold renvoie soit un tableau, soit { posts: [...] }.
        const posts = Array.isArray(json) ? json : json.posts || [];
        setInstaPosts(posts);
      } catch {
        setInstaPosts([]);
      }
    }
    loadInstagram();
  }, []);

  const creneauxParJour = JOURS.map((jour) => ({
    jour,
    count: creneaux.filter((c) => c.jour === jour).length,
  })).filter((j) => j.count > 0);

  // Équipes groupées par catégorie (Supabase) ; repli sur la liste statique si vide.
  const equipesGroupes = equipes.length
    ? Array.from(new Set(equipes.map((e) => e.categorie))).map((cat) => ({
        groupe: cat,
        cats: equipes.filter((e) => e.categorie === cat).map((e) => e.nom),
      }))
    : EQUIPES;

  // Derniers posts Instagram (flux Behold) ; repli sur les visuels statiques.
  const instaImg = (p: any) =>
    p?.sizes?.medium?.mediaUrl || p?.sizes?.small?.mediaUrl || p?.thumbnailUrl || p?.mediaUrl || "";
  const instaCaption = (p: any) =>
    (p?.prunedCaption || p?.caption || "").replace(/\s+/g, " ").trim();
  const instaTiles = instaPosts.length
    ? instaPosts.slice(0, 6).map((p) => ({
        img: instaImg(p),
        link: p.permalink || IG_URL,
        caption: instaCaption(p),
        isVideo: p?.mediaType === "VIDEO",
        real: true,
      }))
    : INSTA.map((p) => ({ img: p.img, link: IG_URL, caption: "", isVideo: false, real: false }));

  return (
    <Layout>
      <Head>
        <title>RUC Basket Reims — Grandir ensemble, gagner ensemble</title>
        <meta
          name="description"
          content="Club de basket formateur à Reims, de l'école de basket aux seniors. Compétition, respect et convivialité."
        />
      </Head>

      {/* ============================ HERO ============================ */}
        <section
            className="homeHero"
            style={{
                position: "relative",
                overflow: "hidden",
                background: "#15141b",
                display: "flex",
                alignItems: "stretch",
                minHeight: 600,
            }}
        >
            {/* halo orange + bande orange diagonale en bas */}
            <div style={{ position: "absolute", left: -140, bottom: -160, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(220,141,50,.42),transparent 62%)", filter: "blur(10px)" }} />
            <div style={{ position: "absolute", right: 0, bottom: 0, left: 0, height: 80, background: "#dc8d32", clipPath: "polygon(0 50%,100% 0,100% 100%,0 100%)", opacity: 0.96 }} />

            {/* Texte */}
            <div className="homeHeroText" style={{ position: "relative", zIndex: 3, flex: 1, minWidth: 0, maxWidth: 720, padding: "64px 30px 80px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "'Oswald',sans-serif", fontSize: 12.5, letterSpacing: ".28em", textTransform: "uppercase", color: "#f0b968", fontWeight: 600, marginBottom: 22 }}>
                    <span style={{ width: 26, height: 2, background: "#dc8d32", display: "inline-block" }} />
                    RUC Basket · Reims · depuis 2003
                </div>
                <h1 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(38px,6.2vw,68px)", lineHeight: 1.02, margin: 0, textTransform: "uppercase" }}>
                    Grandir ensemble,
                    <br />
                    <span style={{ color: "#f0a93f" }}>gagner ensemble.</span>
                </h1>
                <p style={{ color: "#c4bdd4", fontSize: 17, lineHeight: 1.55, fontWeight: 500, maxWidth: 480, margin: "22px 0 30px" }}>
                    Club de basket formateur à Reims — de l'école de basket aux seniors. Compétition, respect et convivialité au cœur du jeu.
                </p>
                <div className="homeHeroBtns" style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                    <Link href="/qui/historique" className="btnHover" style={{ background: "#dc8d32", color: "#fff", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, boxShadow: "0 12px 30px -10px rgba(220,141,50,.8)" }}>
                        Rejoindre le club
                    </Link>
                    <Link href="/actus" className="btnHover" style={{ background: "rgba(255,255,255,.1)", border: "1.5px solid rgba(255,255,255,.45)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 30px", borderRadius: 999 }}>
                        Voir les actualités
                    </Link>
                </div>
            </div>

            {/* Personnage (table `bandeau`) — PNG transparent posé à droite */}
            <div className="homeHeroArt" style={{ position: "relative", zIndex: 3, width: 480, flexShrink: 0, alignSelf: "stretch" }}>
                <img
                    src={bandeau || "/dunk.png"}
                    alt="Joueur RUCB"
                    style={{ position: "absolute", right: 10, bottom: 0, height: "100%", width: "auto", maxWidth: "none", objectFit: "contain", objectPosition: "bottom right", filter: "drop-shadow(0 18px 28px rgba(0,0,0,.55))" }}
                />
            </div>
        </section>

      {/* =========================== VALEURS ========================== */}
      <section style={{ background: "#2a1457" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
          }}
        >
          {VALEURS.map((v) => (
            <div
              key={v.num}
              style={{
                padding: "30px 24px",
                borderTop: "3px solid #dc8d32",
                borderRight: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Oswald',sans-serif",
                  fontSize: 34,
                  fontWeight: 700,
                  color: "#dc8d32",
                  lineHeight: 1,
                }}
              >
                {v.num}
              </div>
              <div
                style={{
                  fontFamily: "'Oswald',sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: ".05em",
                  textTransform: "uppercase",
                  color: "#fff",
                  margin: "10px 0 6px",
                }}
              >
                {v.t}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: "#b9a9d8", fontWeight: 500 }}>
                {v.d}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================= ACTUALITÉS ========================= */}
      <section style={{ padding: "64px 26px 18px", maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 30,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontSize: 13,
                letterSpacing: ".26em",
                textTransform: "uppercase",
                color: "#dc8d32",
                fontWeight: 600,
              }}
            >
              Le club bouge
            </div>
            <h2
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontSize: "clamp(28px,3.4vw,40px)",
                fontWeight: 700,
                textTransform: "uppercase",
                margin: "6px 0 0",
                color: "var(--text)",
                letterSpacing: "-.01em",
              }}
            >
              Actualités
            </h2>
          </div>
          <Link
            href="/actus"
            style={{ color: "var(--brand-fg)", fontWeight: 800, fontSize: 14.5 }}
          >
            Toutes les actus →
          </Link>
        </div>

        {actus.length === 0 ? (
          <p style={{ color: "var(--muted)", fontWeight: 500 }}>
            Les actualités du club arrivent bientôt.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))",
              gap: 22,
            }}
          >
            {actus.map((n) => (
              <Link
                key={n.id}
                href={`/actus/${n.slug}`}
                className="newsCard"
                style={{
                  color: "inherit",
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: "0 14px 34px -22px rgba(23,18,43,.5)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ position: "relative", height: 180, width: "100%" }}>
                  <div
                    style={{
                      height: 180,
                      backgroundImage: n.image_url
                        ? `url('${n.image_url}')`
                        : "repeating-linear-gradient(45deg,var(--paper-2),var(--paper-2) 10px,var(--line) 10px,var(--line) 20px)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  {n.categorie ? (
                    <span
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        background: "var(--orange)",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        padding: "6px 11px",
                        borderRadius: 999,
                      }}
                    >
                      {n.categorie}
                    </span>
                  ) : null}
                  {n.video_url ? (
                    <span
                      style={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        background: "rgba(23,18,43,.82)",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: ".04em",
                        textTransform: "uppercase",
                        padding: "6px 11px",
                        borderRadius: 999,
                      }}
                    >
                      ▶ Vidéo
                    </span>
                  ) : null}
                </div>
                <div
                  style={{
                    padding: "20px 20px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                    flex: 1,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#dc8d32", letterSpacing: ".05em" }}>
                    {formatDate(n.date_publication)}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Oswald',sans-serif",
                      fontSize: 20,
                      fontWeight: 600,
                      lineHeight: 1.18,
                      margin: 0,
                      color: "var(--text)",
                    }}
                  >
                    {n.titre}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--muted)", margin: 0, fontWeight: 500 }}>
                    {n.extrait}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ======================= 3 CARTES INFOS ======================= */}
      <section style={{ padding: "46px 26px 64px", maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 22,
            alignItems: "start",
          }}
        >
          {/* Entraînements */}
          <div
            style={{
              background: "var(--paper)",
              borderRadius: 18,
              border: "1px solid var(--line)",
              boxShadow: "0 14px 34px -26px rgba(23,18,43,.5)",
              overflow: "hidden",
            }}
          >
            <div style={{ background: "transparent", padding: "26px 28px 20px" }}>
              <div
                style={{
                  fontFamily: "'Oswald',sans-serif",
                  fontSize: 23,
                  fontWeight: 600,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                Entraînements
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, marginTop: 3 }}>
                Créneaux de la saison
              </div>
            </div>
            <div style={{ padding: "10px 22px 22px" }}>
              {creneauxParJour.length === 0 ? (
                <div style={{ padding: "13px 0", color: "var(--muted)", fontWeight: 600, fontSize: 14 }}>
                  Planning disponible sur la page dédiée.
                </div>
              ) : (
                creneauxParJour.map((c) => (
                  <div
                    key={c.jour}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "15px 0",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{c.jour}</span>
                    <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 600 }}>
                      {c.count} séance{c.count > 1 ? "s" : ""}
                    </span>
                  </div>
                ))
              )}
              <Link
                href="/planning"
                className="btnOutline"
                style={{
                  display: "block",
                  textAlign: "center",
                  color: "var(--brand-fg)",
                  fontWeight: 800,
                  fontSize: 14,
                  marginTop: 18,
                  border: "1.5px solid var(--orange)",
                  padding: 12,
                  borderRadius: 999,
                  transition: "background .15s,color .15s",
                }}
              >
                Tous les créneaux
              </Link>
            </div>
          </div>

          {/* Nos équipes */}
          <div
            style={{
              background: "var(--paper)",
              borderRadius: 18,
              border: "1px solid var(--line)",
              boxShadow: "0 14px 34px -26px rgba(23,18,43,.5)",
              overflow: "hidden",
            }}
          >
            <div style={{ background: "transparent", padding: "26px 28px 20px" }}>
              <div
                style={{
                  fontFamily: "'Oswald',sans-serif",
                  fontSize: 23,
                  fontWeight: 600,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                Nos équipes
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, marginTop: 3 }}>
                De l'U7 aux seniors
              </div>
            </div>
            <div style={{ padding: "18px 22px 22px" }}>
              {equipesGroupes.map((g) => (
                <div key={g.groupe} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "#dc8d32",
                      marginBottom: 9,
                    }}
                  >
                    {g.groupe}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                    {g.cats.map((cat) => (
                      <span
                        key={cat}
                        style={{
                          background: "rgba(90,53,160,.32)",
                          color: "#e2d6f7",
                          border: "1px solid rgba(124,79,196,.5)",
                          fontWeight: 700,
                          fontSize: 14.5,
                          padding: "9px 16px",
                          borderRadius: 9,
                        }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================= INSTAGRAM ========================== */}
      <section style={{ padding: "58px 26px 64px", maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 30,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontSize: 13,
                letterSpacing: ".26em",
                textTransform: "uppercase",
                color: "#dc8d32",
                fontWeight: 600,
              }}
            >
              Suivez le club
            </div>
            <h2
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontSize: "clamp(28px,3.4vw,40px)",
                fontWeight: 700,
                textTransform: "uppercase",
                margin: "6px 0 0",
                color: "var(--text)",
                letterSpacing: "-.01em",
              }}
            >
              Sur Instagram
            </h2>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--brand-fg)", marginTop: 6 }}>
              @{IG_HANDLE}
            </div>
          </div>
          <a
            href={IG_URL}
            target="_blank"
            rel="noreferrer"
            className="btnHover"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "linear-gradient(45deg,#dc8d32,#c83b6b 55%,#3d1e7b)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 14.5,
              padding: "13px 22px",
              borderRadius: 999,
              boxShadow: "0 10px 24px -10px rgba(200,59,107,.7)",
            }}
          >
            Suivre @{IG_HANDLE}
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
            gap: 14,
          }}
        >
          {instaTiles.map((p, i) => (
            <a
              key={p.link + i}
              href={p.link}
              target="_blank"
              rel="noreferrer"
              aria-label={p.caption ? `Post Instagram : ${p.caption.slice(0, 80)}` : "Voir sur Instagram"}
              className="instaTile"
              style={{
                position: "relative",
                aspectRatio: "1/1",
                borderRadius: 14,
                overflow: "hidden",
                background: "var(--paper-2)",
                display: "block",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: p.img ? `url('${p.img}')` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {p.isVideo ? (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 9,
                    right: 9,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "rgba(23,18,43,.55)",
                    color: "#fff",
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: 2,
                  }}
                >
                  ▶
                </span>
              ) : null}
              <div
                className="instaOverlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(42,20,87,.74)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  color: "#fff",
                  padding: "14px",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>⌾</span>
                {p.real && p.caption ? (
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 500,
                      lineHeight: 1.35,
                      opacity: 0.92,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.caption}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".04em", opacity: 0.85 }}>
                    Voir sur Instagram
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ========================== SPONSORS ========================== */}
      <section
        style={{
          background: "var(--paper)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          padding: "48px 26px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div
            style={{
              fontFamily: "'Oswald',sans-serif",
              fontSize: 13,
              letterSpacing: ".26em",
              textTransform: "uppercase",
              color: "#dc8d32",
              fontWeight: 600,
            }}
          >
            Merci à nos partenaires
          </div>
          <h2
            style={{
              fontFamily: "'Oswald',sans-serif",
              fontSize: "clamp(24px,3vw,34px)",
              fontWeight: 700,
              textTransform: "uppercase",
              margin: "6px 0 0",
              color: "var(--text)",
            }}
          >
            Ils nous soutiennent
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
            gap: 16,
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {sponsors.map((s, i) => {
            const tile = (
              <div
                className="sponsorTile"
                style={{
                  height: 110,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#faf9fc",
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  padding: 18,
                }}
              >
                {/* toutes les tuiles à la même taille ; object-fit:contain => aucun logo rogné */}
                <img
                  src={s.logo_url}
                  alt={s.nom || "partenaire"}
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", display: "block" }}
                />
              </div>
            );
            return s.site_url ? (
              <a key={i} href={s.site_url} target="_blank" rel="noreferrer" title={s.nom || "Voir le site"} style={{ display: "block" }}>
                {tile}
              </a>
            ) : (
              <div key={i}>{tile}</div>
            );
          })}
        </div>
      </section>

      {/* ============================= CTA ============================ */}
      <section
        style={{
          background: "linear-gradient(115deg,#3d1e7b 0%,#5a2f9e 55%,#dc8d32 140%)",
          color: "#fff",
          padding: "60px 26px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontSize: "clamp(28px,4vw,46px)",
            fontWeight: 700,
            textTransform: "uppercase",
            margin: "0 0 14px",
            lineHeight: 1.05,
          }}
        >
          Envie de jouer avec nous ?
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "#e7ddf6",
            maxWidth: 520,
            margin: "0 auto 30px",
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          Essais gratuits toute l'année. Rejoins une équipe à ton niveau et partage l'esprit RUCB.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
          <Link
            href="/qui/historique"
            className="btnHover"
            style={{
              background: "#fff",
              color: "#3d1e7b",
              fontWeight: 800,
              fontSize: 16,
              padding: "16px 34px",
              borderRadius: 999,
              display: "inline-block",
              boxShadow: "0 14px 34px -14px rgba(0,0,0,.5)",
            }}
          >
            Demander un essai
          </Link>
          {licence && (
            <button
              type="button"
              onClick={() => forceDownload(licence.url, licence.nom)}
              className="btnHover"
              style={{
                background: "rgba(255,255,255,.14)",
                color: "#fff",
                border: "1.5px solid rgba(255,255,255,.6)",
                fontWeight: 800,
                fontSize: 16,
                fontFamily: "'Manrope',sans-serif",
                padding: "16px 34px",
                borderRadius: 999,
                cursor: "pointer",
              }}
            >
              Télécharger le dossier de licence
            </button>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Home;
