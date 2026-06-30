import * as React from 'react';
import Head from 'next/head';
import { Layout } from '../components/Layout';
import { supabase } from '../lib/supabaseClient';
import { forceDownload } from '../lib/forceDownload';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

// Une couleur distincte par lieu. Couleurs claires et vives pour ressortir sur
// le fond sombre du site (--bg #0d0c11 / --paper #15141b) — contraste >= 4.5:1.
const PALETTE = [
  '#e6a24a', // orange (accent charte, --brand-fg)
  '#60a5fa', // bleu ciel
  '#4ade80', // vert
  '#f472b6', // rose
  '#b794f6', // lavande
  '#2dd4bf', // cyan
  '#fb7185', // corail
  '#fcd34d', // ambre
  '#818cf8', // pervenche
  '#a3e635', // citron vert
];

export default function Planning() {
  const [creneaux, setCreneaux] = React.useState<any[]>([]);
  const [gymnases, setGymnases] = React.useState<any[]>([]);
  const [licence, setLicence] = React.useState<{ url: string; nom: string } | null>(null);

  React.useEffect(() => {
    async function load() {
      const { data: cr } = await supabase
        .from('creneau')
        .select('id, jour, heure_debut, horaire, categorie, annees, detail, gymnase:gymnase_id(titre), equipes:equipe(nom)')
        .eq('actif', true);
      setCreneaux(cr || []);

      const { data: gy } = await supabase.from('gymnase').select('titre').order('titre');
      setGymnases(gy || []);

      const { data: lf } = await supabase
        .from('licence_file')
        .select('file_url, nom')
        .eq('actif', true)
        .order('created_at', { ascending: false })
        .limit(1);
      if (lf && lf[0]?.file_url) setLicence({ url: lf[0].file_url, nom: lf[0].nom || 'dossier-licence.pdf' });
    }
    load();
  }, []);

  const colorByLieu = React.useMemo(() => {
    const map: Record<string, string> = {};
    gymnases.forEach((g, i) => {
      map[g.titre] = PALETTE[i % PALETTE.length];
    });
    return map;
  }, [gymnases]);

  const parJour = JOURS.map((jour) => ({
    jour,
    items: creneaux
      .filter((c) => c.jour === jour)
      .sort((a, b) => (a.heure_debut ?? 0) - (b.heure_debut ?? 0)),
  }));

  return (
    <Layout>
      <Head>
        <title>Planning des entraînements</title>
        <meta name="description" content="Planning des entraînements du RUC Basket Reims." />
      </Head>

      <section style={{ background: 'radial-gradient(120% 140% at 0% 100%,rgba(220,141,50,.22),transparent 55%),#15141b', color: '#fff', padding: '56px 26px', borderBottom: '3px solid #dc8d32' }}>
        <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 13, letterSpacing: '.28em', textTransform: 'uppercase', color: '#f0b968', fontWeight: 600, marginBottom: 10 }}>Saison en cours</div>
        <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 'clamp(30px,4.4vw,52px)', fontWeight: 700, textTransform: 'uppercase', margin: 0, letterSpacing: '-.01em' }}>Planning des entraînements</h1>
      </section>

      <section style={{ padding: '40px 26px 70px', maxWidth: 1240, margin: '0 auto' }}>
        {licence && (
          <div style={{ marginBottom: 26 }}>
            <button
              type="button"
              onClick={() => forceDownload(licence.url, licence.nom)}
              className="btnHover"
              style={{ background: '#dc8d32', color: '#fff', border: 'none', fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 14.5, padding: '13px 24px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 10px 24px -12px rgba(220,141,50,.8)' }}
            >
              Télécharger le dossier de licence
            </button>
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 30 }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>Lieux :</span>
          {gymnases.map((g, i) => {
            const color = colorByLieu[g.titre] || '#dc8d32';
            return (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${color}14`, border: `1px solid ${color}`, color, fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 999 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />{g.titre}
              </span>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(215px,1fr))', gap: 18, alignItems: 'start' }}>
          {parJour.map((col) => (
            <div key={col.jour} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', fontSize: 17, fontWeight: 600, color: 'var(--text)', letterSpacing: '.04em', paddingBottom: 10, borderBottom: '2px solid #dc8d32' }}>{col.jour}</div>
              {col.items.map((s) => {
                const color = colorByLieu[s.gymnase?.titre] || '#dc8d32';
                return (
                  <div key={s.id} style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderLeft: `3px solid ${color}`, borderRadius: 12, padding: '13px 15px', boxShadow: '0 10px 24px -22px rgba(23,18,43,.5)' }}>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--brand-fg)', letterSpacing: '.02em' }}>{s.horaire}</div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', marginTop: 3 }}>{(s.equipes || []).map((e: any) => e.nom).join(' · ') || s.categorie}</div>
                    {s.annees ? <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginTop: 2 }}>{s.annees}</div> : null}
                    {s.gymnase?.titre ? (
                      <div style={{ marginTop: 9, display: 'inline-flex', alignItems: 'center', gap: 5, background: `${color}14`, color, fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 999 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />{s.gymnase.titre}
                      </div>
                    ) : null}
                    {s.detail ? <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 9, lineHeight: 1.45, fontWeight: 500 }}>{s.detail}</div> : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
