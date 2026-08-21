import React, { useCallback, useEffect, useState } from "react";
import Script from "next/script";
import {
  ConsentChoice,
  GA_MEASUREMENT_ID,
  REOPEN_EVENT,
  deleteAnalyticsCookies,
  readConsent,
  updateGtagConsent,
  writeConsent,
} from "../lib/gtag";

/**
 * Bandeau de consentement + chargement conditionnel de Google Analytics 4.
 *
 * Tant que le visiteur n'a pas cliqué « Accepter », aucun script Google n'est
 * injecté et aucun cookie n'est déposé. Sans NEXT_PUBLIC_GA_MEASUREMENT_ID
 * (dev local, preview), le composant ne rend rien du tout.
 */
const CookieConsent = () => {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [visible, setVisible] = useState(false);
  // Le localStorage n'existe pas au SSR : on n'affiche qu'après hydratation.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setChoice(stored);
    setVisible(stored === null);
    setReady(true);

    const reopen = () => setVisible(true);
    window.addEventListener(REOPEN_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_EVENT, reopen);
  }, []);

  const decide = useCallback((next: ConsentChoice) => {
    writeConsent(next);
    setChoice(next);
    setVisible(false);
    updateGtagConsent(next);
    if (next === "denied") deleteAnalyticsCookies();
  }, []);

  if (!GA_MEASUREMENT_ID) return null;

  const loadAnalytics = ready && choice === "granted";

  return (
    <>
      {loadAnalytics && (
        <>
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'granted'
});
gtag('js', new Date());
gtag('config','${GA_MEASUREMENT_ID}');`,
            }}
          />
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
        </>
      )}

      {ready && visible && (
        <div className="cookieBanner" role="dialog" aria-label="Gestion des cookies">
          <div className="cookieBanner__text">
            <strong>Cookies &amp; mesure d&apos;audience</strong>
            <p>
              Nous utilisons Google Analytics pour compter les visites et savoir quelles pages
              vous intéressent. Aucune publicité, aucune revente de données. Vous pouvez refuser :
              le site fonctionne exactement pareil.
            </p>
          </div>
          <div className="cookieBanner__actions">
            <button type="button" className="cookieBtn cookieBtn--ghost" onClick={() => decide("denied")}>
              Refuser
            </button>
            <button type="button" className="cookieBtn cookieBtn--primary" onClick={() => decide("granted")}>
              Accepter
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
