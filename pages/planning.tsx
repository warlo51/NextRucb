import * as React from 'react';
import Head from 'next/head';
import { Layout } from '../components/Layout';
import { supabase } from '../lib/supabaseClient';
import { forceDownload } from '../lib/forceDownload';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

// Une couleur distincte par lieu, en deux variantes : la légende est posée sur
// le fond sombre de la page, les cartes de créneaux sont sur fond blanc — une
// même teinte ne peut pas être lisible sur les deux.
//   clair → chips de la légende (fond --bg #0d0c11)
//   fonce → texte et filet des cartes (fond #fff)
// Chaque variante garde un contraste >= 4.5:1 sur son propre fond.
type CouleurLieu = { clair: string; fonce: string };

const PALETTE: CouleurLieu[] = [
  { clair: '#e6a24a', fonce: '#9a5b0a' }, // orange (accent charte)
  { clair: '#60a5fa', fonce: '#1d4ed8' }, // bleu
  { clair: '#4ade80', fonce: '#15803d' }, // vert
  { clair: '#f472b6', fonce: '#be185d' }, // rose
  { clair: '#b794f6', fonce: '#6d28d9' }, // lavande
  { clair: '#2dd4bf', fonce: '#0f766e' }, // cyan
  { clair: '#fb7185', fonce: '#be123c' }, // corail
  { clair: '#fcd34d', fonce: '#a16207' }, // ambre
  { clair: '#818cf8', fonce: '#4338ca' }, // pervenche
  { clair: '#a3e635', fonce: '#4d7c0f' }, // citron vert
];

const COULEUR_DEFAUT: CouleurLieu = { clair: '#dc8d32', fonce: '#a2600f' };

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
    const map: Record<string, CouleurLieu> = {};
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
            const c = colorByLieu[g.titre] || COULEUR_DEFAUT;
            return (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${c.clair}14`, border: `1px solid ${c.clair}`, color: c.clair, fontSize: 12.5, fontWeight: 700, padding: '6px 12px', borderRadius: 999 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.clair, display: 'inline-block' }} />{g.titre}
              </span>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(215px,1fr))', gap: 18, alignItems: 'start' }}>
          {parJour.map((col) => (
            <div key={col.jour} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', fontSize: 17, fontWeight: 600, color: 'var(--text)', letterSpacing: '.04em', paddingBottom: 10, borderBottom: '2px solid #dc8d32' }}>{col.jour}</div>
              {col.items.map((s) => {
                const c = colorByLieu[s.gymnase?.titre] || COULEUR_DEFAUT;
                return (
                  <div key={s.id} style={{ background: '#fff', border: '1px solid #e5e0ee', borderLeft: `4px solid ${c.fonce}`, borderRadius: 12, padding: '14px 16px', boxShadow: '0 14px 30px -22px rgba(0,0,0,.75)' }}>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 15, color: '#3d1e7b', letterSpacing: '.02em' }}>{s.horaire}</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#17122b', marginTop: 3, lineHeight: 1.3 }}>{(s.equipes || []).map((e: any) => e.nom).join(' · ') || s.categorie}</div>
                    {s.annees ? <div style={{ fontSize: 13, color: '#655d78', fontWeight: 600, marginTop: 3 }}>{s.annees}</div> : null}
                    {s.gymnase?.titre ? (
                      <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, background: `${c.fonce}14`, color: c.fonce, fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 999 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.fonce, display: 'inline-block' }} />{s.gymnase.titre}
                      </div>
                    ) : null}
                    {s.detail ? <div style={{ fontSize: 13, color: '#5c5570', marginTop: 10, lineHeight: 1.5, fontWeight: 500 }}>{s.detail}</div> : null}
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
