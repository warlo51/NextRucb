/**
 * Suivi local des actualités déjà consultées — sert à masquer la pastille du
 * CTA « Voir les actualités » de l'accueil quand il n'y a plus rien de neuf.
 *
 * Stocké dans le localStorage plutôt que dans un cookie : l'information ne sert
 * qu'au navigateur, inutile de l'envoyer au serveur à chaque requête. C'est un
 * stockage strictement fonctionnel (aucun identifiant, aucun traçage, aucun
 * tiers), il n'est donc pas soumis au bandeau de consentement — contrairement à
 * Google Analytics, cf. lib/gtag.ts.
 *
 * Toute erreur d'accès (navigation privée, stockage désactivé) est avalée : on
 * retombe alors sur le comportement par défaut, la pastille reste affichée.
 */
const STORAGE_KEY = "rucb-actus-vues-v1";

// Borne la taille du stockage. Les entrées sont rangées de la plus récemment
// vue à la plus ancienne, on coupe donc la queue de liste.
const MAX_ENTREES = 100;

export function readActusVues(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function markActusVues(ids: Array<string | number | undefined | null>): void {
  if (typeof window === "undefined") return;
  const nouveaux = ids.filter((id) => id !== undefined && id !== null).map(String);
  if (!nouveaux.length) return;
  try {
    // Nouveaux en tête : les appelants passent leurs actus de la plus récente à
    // la plus ancienne, ce sont donc les plus récentes qui survivent au découpage.
    const fusion = Array.from(new Set([...nouveaux, ...readActusVues()]));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fusion.slice(0, MAX_ENTREES)));
  } catch {
    /* stockage indisponible : sans effet, la pastille restera visible */
  }
}
