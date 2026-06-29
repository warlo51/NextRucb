import React from "react";

type Props = {
  kicker?: string;
  title: string;
  // dégradé violet par défaut ; "club" ajoute une touche orange.
  variant?: "violet" | "club";
};

// En-tête de page : bande dégradée + kicker + H1 (reprend la maquette refonte).
export default function PageHeader({ kicker, title, variant = "violet" }: Props) {
  const background =
    variant === "club"
      ? "linear-gradient(105deg,#2a1457,#3d1e7b 55%,rgba(220,141,50,.85))"
      : "linear-gradient(115deg,#2a1457,#3d1e7b 60%,#5a2f9e)";
  return (
    <section style={{ background, color: "#fff", padding: "56px 26px" }}>
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
