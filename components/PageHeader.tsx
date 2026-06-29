import React from "react";

type Props = {
  kicker?: string;
  title: string;
  // dégradé violet par défaut ; "club" ajoute une touche orange.
  variant?: "violet" | "club";
};

// En-tête de page : bande dégradée + kicker + H1 (reprend la maquette refonte).
export default function PageHeader({ kicker, title, variant = "violet" }: Props) {
  // Bandeau anthracite + halo/bande orange (cohérent avec le hero et la maquette).
  const accent =
    variant === "club"
      ? "radial-gradient(120% 140% at 100% 0%,rgba(220,141,50,.28),transparent 55%)"
      : "radial-gradient(120% 140% at 0% 100%,rgba(220,141,50,.22),transparent 55%)";
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: `${accent},#15141b`,
        color: "#fff",
        padding: "56px 26px",
        borderBottom: "3px solid #dc8d32",
      }}
    >
      {kicker ? (
        <div
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontSize: 13,
            letterSpacing: ".28em",
            textTransform: "uppercase",
            color: "#f0b968",
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <h1
        style={{
          fontFamily: "'Oswald',sans-serif",
          fontSize: "clamp(34px,5vw,56px)",
          fontWeight: 700,
          textTransform: "uppercase",
          margin: 0,
          letterSpacing: "-.01em",
        }}
      >
        {title}
      </h1>
    </section>
  );
}
