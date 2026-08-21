/**
 * Mesure d'audience Google Analytics 4.
 *
 * Règle CNIL : aucun script Google n'est chargé tant que le visiteur n'a pas
 * accepté explicitement (voir components/CookieConsent.tsx). Le choix est
 * conservé dans le localStorage, pas dans un cookie — rien n'est déposé avant
 * consentement.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export type ConsentChoice = "granted" | "denied";

const STORAGE_KEY = "rucb-consent-v1";
/** La CNIL impose de redemander le consentement au moins tous les 13 mois. */
const CONSENT_MAX_AGE_MS = 13 * 30 * 24 * 60 * 60 * 1000;

/** Événement interne : le lien « Cookies » du footer rouvre le bandeau. */
export const REOPEN_EVENT = "rucb:open-cookie-banner";

type StoredConsent = { choice: ConsentChoice; date: number };

/** Choix mémorisé, ou null si absent, illisible ou périmé (> 13 mois). */
export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredConsent;
    if (stored.choice !== "granted" && stored.choice !== "denied") return null;
    if (Date.now() - stored.date > CONSENT_MAX_AGE_MS) return null;
    return stored.choice;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice) {
  try {
    const stored: StoredConsent = { choice, date: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* navigation privée / stockage bloqué : on ne casse pas la page */
  }
}

/** Signale le changement à gtag.js s'il est déjà chargé (Consent Mode v2). */
export function updateGtagConsent(choice: ConsentChoice) {
  const gtag = (window as any).gtag;
  if (typeof gtag === "function") {
    gtag("consent", "update", { analytics_storage: choice });
  }
}

/** Retrait du consentement : on supprime les cookies déjà posés par GA. */
export function deleteAnalyticsCookies() {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  // GA pose ses cookies sur le domaine parent (.rucb-basket.com)
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0].trim();
    if (!/^_ga($|_)|^_gid$|^_gat/.test(name)) return;
    domains.forEach((domain) => {
      const scope = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; path=/${scope}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
  });
}
