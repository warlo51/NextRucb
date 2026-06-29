import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

export default function NavBar() {
  const [fix, setFix] = useState(false);

  useEffect(() => {
    function setFixed() {
      setFix(window.scrollY >= 50);
    }
    window.addEventListener("scroll", setFixed);
    return () => window.removeEventListener("scroll", setFixed);
  }, []);

  return (
    <Navbar bg="" expand="lg">
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
            <Nav.Link href="/">Accueil</Nav.Link>
            <Nav.Link href="/actus">Actualités</Nav.Link>
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
