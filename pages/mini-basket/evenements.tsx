import * as React from 'react';
import Head from 'next/head';
import { Layout } from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import { supabase } from '../../lib/supabaseClient';

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : '';

// Les évènements du Mini-Basket.
export default function EvenementsMini() {
  const [events, setEvents] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('mini_evenement')
        .select('*')
        .eq('actif', true)
        .order('date_event', { ascending: true });
      setEvents(data || []);
    }
    load();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Les évènements — Mini-Basket RUC</title>
        <meta name="description" content="Les évènements du Mini-Basket du RUC Basket Reims." />
      </Head>

      <PageHeader kicker="Mini-Basket" title="Les évènements" variant="club" />

      <section style={{ padding: '48px 26px 70px', maxWidth: 900, margin: '0 auto' }}>
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', fontWeight: 500 }}>Aucun évènement à venir pour le moment.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {events.map((ev) => (
              <div key={ev.id} style={{ display: 'flex', gap: 18, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 14px 34px -26px rgba(23,18,43,.5)' }}>
                {ev.image_url ? (
                  <div style={{ width: 180, flexShrink: 0, backgroundImage: `url('${ev.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                ) : null}
                <div style={{ padding: '20px 22px', flex: 1, minWidth: 0 }}>
                  {ev.date_event ? <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase', color: '#dc8d32' }}>{formatDate(ev.date_event)}</div> : null}
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)', margin: '4px 0 6px', lineHeight: 1.15 }}>{ev.titre}</div>
                  {ev.lieu ? <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--brand-fg)' }}>📍 {ev.lieu}</div> : null}
                  {ev.description ? <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-soft)', fontWeight: 500, marginTop: 8, whiteSpace: 'pre-wrap' }}>{ev.description}</div> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
