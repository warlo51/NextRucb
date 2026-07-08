import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import {
  resolveActiveTheme,
  ThemeKey,
  ThemeSettings,
  ThemeSchedule,
} from './themes';

// Lit Supabase côté client (même pattern que planning/actus) et calcule le
// thème saisonnier actif. Fallback gracieux : si Supabase n'est pas configuré
// ou si les tables sont absentes, theme reste null (site nu, charte seule).
export function useSeasonalTheme() {
  const [theme, setTheme] = useState<ThemeKey | null>(null);
  const [animations, setAnimations] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [{ data: st }, { data: sch }] = await Promise.all([
          supabase.from('theme_settings').select('*').eq('id', 1).maybeSingle(),
          supabase.from('theme_schedules').select('*'),
        ]);
        if (!alive) return;
        const settings = (st as ThemeSettings) ?? null;
        setTheme(resolveActiveTheme(settings, (sch as ThemeSchedule[]) || []));
        // prefers-reduced-motion force le décor statique (particules coupées).
        const reduce =
          typeof window !== 'undefined' &&
          window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        setAnimations((settings?.animations ?? true) && !reduce);
      } catch {
        // Supabase non configuré / tables absentes → pas de décor.
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { theme, animations, ready };
}
