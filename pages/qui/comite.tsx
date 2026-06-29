import * as React from 'react';
import Head from 'next/head';
import { Layout } from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

export default function Comite() {
  const [membres, setMembres] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function load() {
      const { data } = await supabase.from('comite').select('*').eq('actif', true).order('ordre');
      setMembres(data || []);
    }
    load();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Comité directeur</title>
        <meta name="description" content="Le comité directeur du RUC Basket Reims." />
      </Head>

      <section style={{ background: 'linear-gradient(115deg,#2a1457,#3d1e7b 60%,#5a2f9e)', color: '#fff', padding: '56px 26px' }}>
        <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 13, letterSpacing: '.28em', textTransform: 'uppercase', color: '#f0b968', fontWeight: 600, marginBottom: 10 }}>Qui sommes-nous</div>
        <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 'clamp(34px,5vw,56px)', fontWeight: 700, textTransform: 'uppercase', margin: 0, letterSpacing: '-.01em' }}>Comité directeur</h1>
      </section>

      <section style={{ padding: '48px 26px 70px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
          {membres.map((m) => (
            <div key={m.id} style={{ background: '#fff', border: '1px solid #eee9f4', borderRadius: 18, padding: 24, textAlign: 'center', boxShadow: '0 14px 34px -26px rgba(23,18,43,.5)' }}>
              {m.photo_url
                ? <img src={m.photo_url} alt={m.nom} style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 14px', display: 'block' }} />
                : <div style={{ width: 90, height: 90, borderRadius: '50%', margin: '0 auto 14px', background: 'linear-gradient(135deg,#3d1e7b,#5a35a0)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 34 }}>{(m.nom || '?').trim().charAt(0).toUpperCase()}</div>}
              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 19, fontWeight: 600, color: '#1d1730', textTransform: 'uppercase' }}>{m.nom}</div>
              {m.role && <div style={{ fontSize: 14, color: '#dc8d32', fontWeight: 700, marginTop: 4 }}>{m.role}</div>}
              {(m.telephone || m.email) && (
                <div style={{ marginTop: 12, fontSize: 13, color: '#5a5470', lineHeight: 1.7 }}>
                  {m.telephone && <div>Tél. : {m.telephone}</div>}
                  {m.email && <div>E-mail : <a href={`mailto:${m.email}`} style={{ color: '#3d1e7b', fontWeight: 600 }}>{m.email}</a></div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
