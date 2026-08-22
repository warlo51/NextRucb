// Sections du panel /admin + helpers de droits.
// Source unique partagée par la page admin et la route API de gestion des
// comptes ; les mêmes clés sont utilisées côté base dans `admin_profile.sections`
// et par la fonction SQL `public.admin_can(section)` (supabase/04_admin_roles.sql).

export type SectionKey =
  | 'planning' | 'actus' | 'partenaires' | 'comite' | 'entraineurs'
  | 'formation' | 'historique' | 'complexe' | 'minibasket' | 'mecenat'
  | 'equipe' | 'resultats' | 'bandeau' | 'themes';

export type AdminRole = 'superadmin' | 'editeur';

export type AdminProfile = {
  user_id: string;
  email: string | null;
  nom: string | null;
  role: AdminRole;
  sections: string[];
  actif: boolean;
  created_at?: string;
};

export const ADMIN_SECTIONS: { key: SectionKey; label: string; hint: string }[] = [
  { key: 'planning',    label: 'Planning',    hint: 'Créneaux, gymnases, dossier de licence' },
  { key: 'actus',       label: 'Actualités',  hint: 'Articles du site' },
  { key: 'partenaires', label: 'Partenaires', hint: 'Logos et dossier de partenariat' },
  { key: 'comite',      label: 'Comité',      hint: 'Membres du comité directeur' },
  { key: 'entraineurs', label: 'Entraîneurs', hint: 'Staff technique et équipes encadrées' },
  { key: 'formation',   label: 'Formation',   hint: 'Page Formation' },
  { key: 'historique',  label: 'Historique',  hint: 'Page Historique du club' },
  { key: 'complexe',    label: 'Complexe',    hint: 'Galerie photos du complexe' },
  { key: 'minibasket',  label: 'Mini-Basket', hint: 'Organigramme, minis, évènements, plateaux' },
  { key: 'mecenat',     label: 'Mécénat',     hint: 'Page Mécénat' },
  { key: 'equipe',      label: 'Équipes',     hint: 'Liste des équipes du club' },
  { key: 'resultats',   label: 'Résultats',   hint: 'Widgets de résultats par équipe' },
  { key: 'bandeau',     label: 'Accueil',     hint: 'Bandeau de la page d’accueil' },
  { key: 'themes',      label: 'Thèmes',      hint: 'Thèmes saisonniers du site' },
];

export const SECTION_KEYS: string[] = ADMIN_SECTIONS.map((s) => s.key);

export const SECTION_LABEL: Record<string, string> = ADMIN_SECTIONS.reduce(
  (acc, s) => { acc[s.key] = s.label; return acc; },
  {} as Record<string, string>,
);

/** Un admin actif accède à une section s'il est superadmin ou si elle est cochée. */
export function canAccess(profile: AdminProfile | null, key: string): boolean {
  if (!profile || !profile.actif) return false;
  if (profile.role === 'superadmin') return true;
  return (profile.sections || []).includes(key);
}

/** Sections visibles dans la sidebar, dans l'ordre de ADMIN_SECTIONS. */
export function allowedSections(profile: AdminProfile | null) {
  return ADMIN_SECTIONS.filter((s) => canAccess(profile, s.key));
}
