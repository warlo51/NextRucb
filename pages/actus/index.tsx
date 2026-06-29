import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Layout } from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

export default function Actus() {
  const [actus, setActus] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function load() {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from('actu')
        .select('id, titre, slug, categorie, date_publication, extrait, image_url')
        .eq('actif', true)
        .lte('date_publication', today)
        .or(`date_fin_publication.is.null,date_fin_publication.gte.${today}`)
        .order('date_publication', { ascending: false });
      setActus(data || []);
    }
    load();
  }, []);

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase() : '';

  return (
    <Layout>
      <Head>
        <title>Actualités</title>
        <meta name="description" content="Les actualités du RUC Basket Reims." />
      </Head>

      <section style={{ background: 'radial-gradient(120% 140% at 0% 100%,rgba(220,141,50,.22),transparent 55%),#15141b', color: '#fff', padding: '56px 26px', borderBottom: '3px solid #dc8d32' }}>
        <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 13, letterSpacing: '.28em', textTransform: 'uppercase', color: '#f0b968', fontWeight: 600, marginBottom: 10 }}>Le club bouge</div>
        <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 'clamp(34px,5vw,56px)', fontWeight: 700, textTransform: 'uppercase', margin: 0, letterSpacing: '-.01em' }}>Actualités</h1>
      </section>

      <section style={{ padding: '48px 26px 70px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 22 }}>
          {actus.map((n) => (
            <Link key={n.id} href={`/actus/${n.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: 'var(--paper)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 14px 34px -22px rgba(23,18,43,.5)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ position: 'relative', height: 180 }}>
                  {n.image_url ? (
                    <div style={{ height: 180, backgroundImage: `url('${n.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  ) : (
                    <div style={{ height: 180, background: 'repeating-linear-gradient(45deg,var(--paper-2),var(--paper-2) 10px,var(--line) 10px,var(--line) 20px)' }} />
                  )}
                  {n.categorie ? (
                    <span style={{ position: 'absolute', top: 14, left: 14, background: 'var(--orange)', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', padding: '6px 11px', borderRadius: 999 }}>{n.categorie}</span>
                  ) : null}
                </div>
                <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#dc8d32', letterSpacing: '.05em' }}>{formatDate(n.date_publication)}</span>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 600, lineHeight: 1.18, margin: 0, color: 'var(--text)' }}>{n.titre}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--muted)', margin: 0, fontWeight: 500 }}>{n.extrait}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
