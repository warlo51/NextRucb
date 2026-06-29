import React from "react";
import Link from "next/link";

const FB =
  "https://fr-fr.facebook.com/pages/category/Amateur-Sports-Team/Reims-Universit%C3%A9-Club-Basket-150181285527456/";
const IG = "https://www.instagram.com/reims_universite_club_basket/";
const FFBB = "http://www.ffbb.com/accueil";

const FooterPage = () => {
  return (
    <footer className="footer" style={{ paddingTop: 54 }}>
      <div className="footerGrid">
        {/* Logo + baseline */}
        <div className="footerCol">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <img alt="logo RUC Basket" src="../logoruc.png" style={{ height: 52, width: "auto" }} />
            <span
              style={{
                fontFamily: "var(--display)",
                fontWeight: 700,
                fontSize: 18,
                color: "#fff",
                letterSpacing: ".04em",
                lineHeight: 1.2,
              }}
            >
              RUC BASKET
              <br />
              <span style={{ fontSize: 11, color: "#dc8d32", letterSpacing: ".2em" }}>
                REIMS · DEPUIS 2003
              </span>
            </span>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, maxWidth: 280, fontWeight: 500 }}>
            Accueil · Respect · Compétition · Convivialité. Le basket à Reims pour toutes et tous.
          </p>
        </div>

        {/* Le club */}
        <div className="footerCol">
          <h4>Le club</h4>
          <Link href="/qui/historique">Histoire du RUC</Link>
          <Link href="/qui/entraineurs">Nos entraîneurs</Link>
          <Link href="/planning">Créneaux</Link>
          <Link href="/actus">Actualités</Link>
        </div>

        {/* Partenaires */}
        <div className="footerCol">
          <h4>Partenaires</h4>
          <Link href="/partenaires/info">Ils nous soutiennent</Link>
          <Link href="/partenaires/mecenat">Mécénat</Link>
          <Link href="/partenaires/info">Devenir partenaire</Link>
        </div>

        {/* Contact / réseaux */}
        <div className="footerCol">
          <h4>Contact</h4>
          <div style={{ fontSize: 14, lineHeight: 1.7, fontWeight: 600, marginBottom: 12 }}>
            Complexe René Tys
            <br />
            Reims (51100)
          </div>
          <a href={FB} target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href={IG} target="_blank" rel="noreferrer">
            Instagram @reims_universite_club_basket
          </a>
          <a href={FFBB} target="_blank" rel="noreferrer">
            FFBB
          </a>
        </div>
      </div>

      <div className="footerCopyright footer-copyright">
        <span>© {new Date().getFullYear()} RUC Basket Reims — Tous droits réservés</span>
        <span>
          Développé par Mansuy Maxime · <Link href="/admin">Espace admin</Link>
        </span>
      </div>
    </footer>
  );
};

export default FooterPage;
