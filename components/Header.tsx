import React from "react";
import Link from "next/link";
import { Container } from "react-bootstrap";

// Barre utilitaire fine (violet profond) : lieu à gauche, contact à droite.
export default function Header() {
  return (
    <Container fluid className="Header">
      <ul>
        <li>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#dc8d32",
              display: "inline-block",
            }}
          />
          Reims · Complexe sportif René Tys
        </li>
        <li>
          <Link href="/qui/complexe">Contact</Link>
        </li>
      </ul>
    </Container>
  );
}
