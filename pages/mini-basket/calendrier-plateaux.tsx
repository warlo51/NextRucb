import * as React from 'react';
import Head from 'next/head';
import { Layout } from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import { supabase } from '../../lib/supabaseClient';

const fmtJour = (d?: string) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' }) : '';

// Calendrier des plateaux : liste de dates.
export default function CalendrierPlateaux() {
  const [plateaux, setPlateaux] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('mini_plateau')
        .select('*')
        .eq('actif', true)
        .order('date_event', { ascending: true });
      setPlateaux(data || []);
    }
    load();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Calendrier des plateaux — Mini-Basket RUC</title>
        <meta name="description" content="Le calendrier des plateaux du Mini-Basket du RUC Basket Reims." />
      </Head>

      <PageHeader kicker="Mini-Basket" title="Calendrier des plateaux" variant="club" />

      <section style={{ padding: '48px 26px 70px', maxWidth: 900, margin: '0 auto' }}>
        {plateaux.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', fontWeight: 500 }}>Le calendrier sera bientôt disponible.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {plateaux.map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--paper)', border: '1px solid var(--line)', borderLeft: '4px solid #dc8d32', borderRadius: 12, padding: '14px 18px', boxShadow: '0 10px 24px -22px rgba(23,18,43,.5)' }}>
                <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 64 }}>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-fg)', lineHeight: 1.1 }}>{fmtJour(p.date_event)}</div>
                  {p.horaire ? <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, marginTop: 2 }}>{p.horaire}</div> : null}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 15.5, color: 'var(--text)' }}>
                    {p.categorie ? <span style={{ color: '#dc8d32' }}>{p.categorie}</span> : null}
                    {p.categorie && p.lieu ? ' · ' : ''}
                    {p.lieu || (!p.categorie ? 'Plateau' : '')}
                  </div>
                  {p.infos ? <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500, marginTop: 3, whiteSpace: 'pre-wrap' }}>{p.infos}</div> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
