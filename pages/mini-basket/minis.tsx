import * as React from 'react';
import Head from 'next/head';
import { Layout } from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import { supabase } from '../../lib/supabaseClient';

// Les minis : galerie photos, regroupées par nom d'équipe.
export default function LesMinis() {
  const [photos, setPhotos] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('mini_photo')
        .select('*')
        .eq('actif', true)
        .order('ordre');
      setPhotos(data || []);
    }
    load();
  }, []);

  // Regroupe par équipe (l'ordre des groupes suit la première photo rencontrée).
  const groupes = React.useMemo(() => {
    const map = new Map<string, any[]>();
    photos.forEach((p) => {
      const key = (p.equipe || '').trim() || 'Nos minis';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return Array.from(map.entries());
  }, [photos]);

  return (
    <Layout>
      <Head>
        <title>Les minis — Mini-Basket RUC</title>
        <meta name="description" content="Les photos des équipes du Mini-Basket du RUC Basket Reims." />
      </Head>

      <PageHeader kicker="Mini-Basket" title="Les minis" variant="club" />

      <section style={{ padding: '48px 26px 70px', maxWidth: 1240, margin: '0 auto' }}>
        {groupes.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', fontWeight: 500 }}>Les photos seront bientôt disponibles.</div>
        ) : (
          groupes.map(([equipe, items]) => (
            <div key={equipe} style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)', margin: '0 0 16px', paddingBottom: 8, borderBottom: '2px solid #dc8d32' }}>{equipe}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
                {items.map((p) => (
                  <div key={p.id} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--paper)', boxShadow: '0 14px 34px -26px rgba(23,18,43,.5)' }}>
                    <div style={{ height: 190, backgroundImage: `url('${p.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </Layout>
  );
}
