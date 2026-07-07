import * as React from 'react';
import Head from 'next/head';
import { Layout } from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import { supabase } from '../../lib/supabaseClient';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const PALETTE = ['#e6a24a', '#60a5fa', '#4ade80', '#f472b6', '#b794f6', '#2dd4bf', '#fb7185', '#fcd34d', '#818cf8', '#a3e635'];

// Les entraînements Mini-Basket : sous-ensemble du planning (créneaux marqués `mini`).
export default function EntrainementsMini() {
  const [creneaux, setCreneaux] = React.useState<any[]>([]);
  const [gymnases, setGymnases] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function load() {
      const { data: cr } = await supabase
        .from('creneau')
        .select('id, jour, heure_debut, horaire, categorie, annees, detail, gymnase:gymnase_id(titre), equipes:equipe(nom)')
        .eq('actif', true)
        .eq('mini', true);
      setCreneaux(cr || []);
      const { data: gy } = await supabase.from('gymnase').select('titre').order('titre');
      setGymnases(gy || []);
    }
    load();
  }, []);

  const colorByLieu = React.useMemo(() => {
    const map: Record<string, string> = {};
    gymnases.forEach((g, i) => { map[g.titre] = PALETTE[i % PALETTE.length]; });
    return map;
  }, [gymnases]);

  const parJour = JOURS.map((jour) => ({
    jour,
    items: creneaux.filter((c) => c.jour === jour).sort((a, b) => (a.heure_debut ?? 0) - (b.heure_debut ?? 0)),
  })).filter((col) => col.items.length > 0);

  return (
    <Layout>
      <Head>
        <title>Les entraînements — Mini-Basket RUC</title>
        <meta name="description" content="Les créneaux d'entraînement du Mini-Basket du RUC Basket Reims." />
      </Head>

      <PageHeader kicker="Mini-Basket" title="Les entraînements" variant="club" />

      <section style={{ padding: '40px 26px 70px', maxWidth: 1240, margin: '0 auto' }}>
        {parJour.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', fontWeight: 500 }}>Les créneaux seront bientôt disponibles.</div>
        ) : (
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
        )}
      </section>
    </Layout>
  );
}
