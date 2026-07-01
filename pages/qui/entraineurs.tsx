import * as React from 'react';
import Head from 'next/head';
import { Layout } from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

export default function Entraineurs() {
  const [entraineurs, setEntraineurs] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('entraineur')
        .select('*, equipes:equipe (nom, categorie)')
        .eq('actif', true)
        .order('ordre');
      setEntraineurs(data || []);
    }
    load();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Entraineurs</title>
        <meta name="description" content="Les entraineurs du RUCB basket" />
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
      </Head>

      <section style={{ background: 'radial-gradient(120% 140% at 0% 100%,rgba(220,141,50,.22),transparent 55%),#15141b', color: '#fff', padding: '56px 26px', borderBottom: '3px solid #dc8d32' }}>
        <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 13, letterSpacing: '.28em', textTransform: 'uppercase', color: '#f0b968', fontWeight: 600, marginBottom: 10 }}>Qui sommes-nous</div>
        <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 'clamp(34px,5vw,56px)', fontWeight: 700, textTransform: 'uppercase', margin: 0, letterSpacing: '-.01em' }}>Nos entraîneurs</h1>
      </section>

      <section style={{ padding: '48px 26px 70px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
          {entraineurs.map((e) => (
            <div key={e.id} style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 18, padding: 24, textAlign: 'center', boxShadow: '0 14px 34px -26px rgba(23,18,43,.5)' }}>
              {e.photo_url
                ? <img src={e.photo_url} alt={e.nom} style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 14px', display: 'block' }} />
                : <div style={{ width: 90, height: 90, borderRadius: '50%', margin: '0 auto 14px', background: 'linear-gradient(135deg,#dc8d32,#f0a93f)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 34 }}>{(e.nom || '?').trim().charAt(0).toUpperCase()}</div>}
              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 19, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase' }}>{e.nom}</div>
              {e.role && <div style={{ fontSize: 14, color: '#dc8d32', fontWeight: 700, marginTop: 4 }}>{e.role}</div>}
              {(e.equipes || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 8 }}>
                  {e.equipes.map((eq: any) => (
                    <span key={eq.nom} style={{ display: 'inline-block', background: 'var(--paper-2)', color: 'var(--brand-fg)', fontWeight: 700, fontSize: 12.5, padding: '5px 12px', borderRadius: 999 }}>{eq.nom}</span>
                  ))}
                </div>
              )}
              {(e.telephone || e.email) && (
                <div style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
                  {e.telephone && <div>Tél. : {e.telephone}</div>}
                  {e.email && <div>E-mail : <a href={`mailto:${e.email}`} style={{ color: 'var(--brand-fg)', fontWeight: 600 }}>{e.email}</a></div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
