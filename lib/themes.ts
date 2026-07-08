// ============ Thèmes saisonniers ============
// Principe : la charte graphique de l'UI (violet #3d1e7b + orange #dc8d32) ne
// change JAMAIS. Un thème n'ajoute que du décor par-dessus (icônes, particules,
// encart). Ce module ne contient donc que la logique de résolution du thème
// actif + la config « machine » du décor (mode de particules, couleurs…).
// Cf. design_handoff_themes_saisonniers/README.md.

export type ThemeKey =
  | 'noel' | 'nouvelan' | 'paques' | 'halloween'
  | 'rentree' | 'ete' | 'playoffs' | 'fete';

export interface ThemeSettings {
  enabled: boolean;
  manual_override: ThemeKey | null;
  animations: boolean;
}

export interface ThemeSchedule {
  theme: ThemeKey;
  label: string;
  start_month: number | null;
  start_day: number | null;
  end_month: number | null;
  end_day: number | null;
  priority: number;
  enabled: boolean;
  recurring: boolean;
}

export type ParticleMode = 'snow' | 'confetti' | 'petals' | 'rise' | 'sparkle';

export interface ThemeDecor {
  label: string;
  particle: ParticleMode;
  pColors: string[];     // couleurs des particules (décor uniquement)
  density: number;       // nb de particules sur desktop
  encart: string;        // texte de l'encart orange « Spécial … »
  filigraneColor: string; // couleur du filigrane (icône rendue par SeasonalDecor)
}

// Densité des particules par mode (repris tel quel du prototype).
export const PARTICLE_DENSITY: Record<ParticleMode, number> = {
  snow: 92, confetti: 80, petals: 46, rise: 32, sparkle: 92,
};

// Config du décor par thème. Les couleurs sont celles du DÉCOR uniquement
// (jamais appliquées à l'UI). L'encart reste toujours orange charte #dc8d32.
export const THEME_DECOR: Record<ThemeKey, ThemeDecor> = {
  noel:      { label: 'Noël',         particle: 'snow',     density: 92, encart: 'SPÉCIAL NOËL',      filigraneColor: '#2e8b57', pColors: ['#ffffff', '#eaf3ff'] },
  nouvelan:  { label: 'Nouvel an',    particle: 'sparkle',  density: 92, encart: 'BONNE ANNÉE',       filigraneColor: '#e0b64a', pColors: ['#f0cd6a', '#ffffff', '#c9d2ff'] },
  paques:    { label: 'Pâques',       particle: 'petals',   density: 46, encart: 'SPÉCIAL PÂQUES',    filigraneColor: '#dd8fa8', pColors: ['#dd8fa8', '#8fd0a0', '#e8d06a', '#b39ae0'] },
  halloween: { label: 'Halloween',    particle: 'rise',     density: 32, encart: 'SPÉCIAL HALLOWEEN', filigraneColor: '#8f45d9', pColors: ['#ff7518', '#8f45d9', '#e8e0ff'] },
  rentree:   { label: 'Rentrée',      particle: 'confetti', density: 80, encart: 'C’EST LA REPRISE',  filigraneColor: '#e6642e', pColors: ['#e6642e', '#2b6fd6', '#ffffff'] },
  ete:       { label: 'Été',          particle: 'rise',     density: 32, encart: 'MODE ÉTÉ',          filigraneColor: '#ff6b5a', pColors: ['#ffd166', '#ff8a72', '#3fc0cf'] },
  playoffs:  { label: 'Playoffs',     particle: 'sparkle',  density: 92, encart: 'PHASE FINALE',      filigraneColor: '#e0b64a', pColors: ['#f0c95a', '#e0b64a', '#ffffff'] },
  fete:      { label: 'Fête du club', particle: 'confetti', density: 80, encart: 'FÊTE DU CLUB',      filigraneColor: '#dc8d32', pColors: ['#dc8d32', '#3d1e7b', '#4db6ac', '#e0463f', '#e8c56a'] },
};

// Fenêtre récurrente mois/jour, avec gestion du passage d'année (ex. déc → janv).
export function isWithin(now: Date, sm: number, sd: number, em: number, ed: number): boolean {
  const md = (m: number, d: number) => m * 100 + d;
  const cur = md(now.getMonth() + 1, now.getDate());
  const start = md(sm, sd), end = md(em, ed);
  return start <= end ? (cur >= start && cur <= end) : (cur >= start || cur <= end);
}

// Dimanche de Pâques (algorithme de Meeus/Jones/Butcher).
export function easterSunday(y: number): Date {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
    f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
    i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
    m = Math.floor((a + 11 * h + 22 * l) / 451),
    mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(y, mo - 1, da);
}

// Fenêtre « semaine de Pâques » : [dimanche de Pâques − 4 j ; + 2 j].
export function isPaquesWindow(now: Date): boolean {
  const e = easterSunday(now.getFullYear());
  const start = new Date(e.getFullYear(), e.getMonth(), e.getDate() - 4, 0, 0, 0, 0);
  const end = new Date(e.getFullYear(), e.getMonth(), e.getDate() + 2, 23, 59, 59, 999);
  const t = now.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

// Résolution : override manuel > planning (priorité décroissante) > aucun.
// Pâques (date mobile) : si aucune date n'est saisie, on calcule automatiquement
// la fenêtre via le comput ecclésiastique ; sinon on respecte les dates saisies.
export function resolveActiveTheme(
  settings: ThemeSettings | null,
  schedules: ThemeSchedule[],
  now: Date = new Date()
): ThemeKey | null {
  if (!settings?.enabled) return null;
  if (settings.manual_override) return settings.manual_override; // override manuel prioritaire
  return schedules
    .filter((s) => {
      if (!s.enabled) return false;
      if (s.theme === 'paques' && s.start_month == null) return isPaquesWindow(now);
      if (s.start_month == null) return false;
      return isWithin(now, s.start_month, s.start_day!, s.end_month!, s.end_day!);
    })
    .sort((a, b) => b.priority - a.priority)[0]?.theme ?? null;
}
