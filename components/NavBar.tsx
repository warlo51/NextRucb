import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { supabase } from "../lib/supabaseClient";

export default function NavBar() {
  const [fix, setFix] = useState(false);
  // Sous-menus de l'onglet « Mini-Basket », gérés depuis l'admin.
  const [miniLinks, setMiniLinks] = useState<any[]>([]);
  const { pathname } = useRouter();
  // Onglet actif (soulignement orange) : exact pour l'accueil, par préfixe sinon.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    function setFixed() {
      setFix(window.scrollY >= 50);
    }
    window.addEventListener("scroll", setFixed);
    return () => window.removeEventListener("scroll", setFixed);
  }, []);

  useEffect(() => {
    supabase
      .from("mini_basket")
      .select("titre, slug")
      .eq("actif", true)
      .order("ordre")
      .then(({ data }: any) => setMiniLinks(data || []));
  }, []);

  return (
    <Navbar bg="" expand="lg" className="rucNavbar">
      {/* Barre mobile : logo + hamburger, toujours visible (masquée ≥ lg) */}
      <Link className="navBrandMobile" href="/" aria-label="Accueil RUC Basket">
        <img alt="logo RUC Basket" src="../logoruc.png" />
        <span className="navWordmark">
          RUC<span className="accent">BASKET</span>
        </span>
      </Link>
      <Navbar.Toggle id="buttonToggle" aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav id="nav" className={fix ? "NavBar fixed" : "NavBar"}>
          <Link className="navBrand" href="/">
            <img alt="logo RUC Basket" src="../logoruc.png" />
            <span className="navWordmark">
              RUC<span className="accent">BASKET</span>
              <small>REIMS · 2003</small>
            </span>
          </Link>

          <div className="navLinks">
            <Nav.Link href="/" active={isActive("/")}>Accueil</Nav.Link>
            <Nav.Link href="/actus" active={isActive("/actus")}>Actualités</Nav.Link>
            <Nav.Link href="/resultats" active={isActive("/resultats")}>Résultats</Nav.Link>
            <NavDropdown title="Le club" id="basic-nav-dropdown">
              <NavDropdown.Item id="linkDropdown" href="/qui/historique">
                Histoire du RUC
              </NavDropdown.Item>
              <NavDropdown.Item id="linkDropdown" href="/formation">
                Formation
              </NavDropdown.Item>
              <NavDropdown.Item id="linkDropdown" href="/qui/comite">
                Comité directeur
              </NavDropdown.Item>
              <NavDropdown.Item id="linkDropdown" href="/qui/entraineurs">
                Nos entraîneurs
              </NavDropdown.Item>
              <NavDropdown.Item id="linkDropdown" href="/qui/complexe">
                Complexe sportif
              </NavDropdown.Item>
              <NavDropdown.Item id="linkDropdown" href="/planning">
                Planning des entraînements
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Mini-Basket" id="basic-nav-dropdown">
              {miniLinks.length > 0 ? (
                miniLinks.map((m) => (
                  <NavDropdown.Item key={m.slug} id="linkDropdown" href={`/mini-basket/${m.slug}`}>
                    {m.titre}
                  </NavDropdown.Item>
                ))
              ) : (
                <NavDropdown.Item id="linkDropdown" disabled>
                  Bientôt disponible
                </NavDropdown.Item>
              )}
            </NavDropdown>
            <NavDropdown title="Partenaires" id="basic-nav-dropdown">
              <NavDropdown.Item id="linkDropdown" href="/partenaires/info">
                Nos partenaires
              </NavDropdown.Item>
              <NavDropdown.Item id="linkDropdown" href="/partenaires/mecenat">
                Mécénat
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link className="navCta" href="/planning">
              Nous rejoindre
            </Nav.Link>
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
