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
        .select('*, equipe (nom, categorie)')
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

      <section style={{ background: 'linear-gradient(115deg,#2a1457,#3d1e7b 60%,#5a2f9e)', color: '#fff', padding: '56px 26px' }}>
        <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 13, letterSpacing: '.28em', textTransform: 'uppercase', color: '#f0b968', fontWeight: 600, marginBottom: 10 }}>Qui sommes-nous</div>
        <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 'clamp(34px,5vw,56px)', fontWeight: 700, textTransform: 'uppercase', margin: 0, letterSpacing: '-.01em' }}>Nos entraîneurs</h1>
      </section>

      <section style={{ padding: '48px 26px 70px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
          {entraineurs.map((e) => (
            <div key={e.id} style={{ background: '#fff', border: '1px solid #eee9f4', borderRadius: 18, padding: 24, textAlign: 'center', boxShadow: '0 14px 34px -26px rgba(23,18,43,.5)' }}>
              {e.photo_url
                ? <img src={e.photo_url} alt={e.nom} style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 14px', display: 'block' }} />
                : <div style={{ width: 90, height: 90, borderRadius: '50%', margin: '0 auto 14px', background: 'linear-gradient(135deg,#3d1e7b,#5a35a0)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 34 }}>{(e.nom || '?').trim().charAt(0).toUpperCase()}</div>}
              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 19, fontWeight: 600, color: '#1d1730', textTransform: 'uppercase' }}>{e.nom}</div>
              {e.role && <div style={{ fontSize: 14, color: '#dc8d32', fontWeight: 700, marginTop: 4 }}>{e.role}</div>}
              {e.equipe?.nom && <div style={{ display: 'inline-block', marginTop: 8, background: '#f1edf8', color: '#3d1e7b', fontWeight: 700, fontSize: 12.5, padding: '5px 12px', borderRadius: 999 }}>{e.equipe.nom}</div>}
              {(e.telephone || e.email) && (
                <div style={{ marginTop: 12, fontSize: 13, color: '#5a5470', lineHeight: 1.7 }}>
                  {e.telephone && <div>Tél. : {e.telephone}</div>}
                  {e.email && <div>E-mail : <a href={`mailto:${e.email}`} style={{ color: '#3d1e7b', fontWeight: 600 }}>{e.email}</a></div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
