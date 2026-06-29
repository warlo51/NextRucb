import * as React from 'react';
import { Layout } from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';

// Normalise n'importe quel lien YouTube (watch, youtu.be, shorts, embed) en URL d'intégration.
function ytEmbed(url?: string): string {
  if (!url) return '';
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

export default function Formation() {
  const [formations, setFormations] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function load() {
      const { data } = await supabase.from('formation').select('*').eq('actif', true).order('ordre');
      setFormations(data || []);
    }
    load();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Formation</title>
        <meta name="description" content="Apprenez les règles du basket ! (RUCB basket)" />
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
      </Head>
      <PageHeader kicker="Le club" title="Formation" />

      <section style={{ padding: '48px 26px 70px', maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {formations.map((f) => (
          <article key={f.id} style={{ background: '#fff', border: '1px solid #eee9f4', borderRadius: 18, padding: 26, boxShadow: '0 14px 34px -26px rgba(23,18,43,.5)' }}>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, textTransform: 'uppercase', color: '#3d1e7b', margin: '0 0 14px' }}>{f.titre}</h2>
            {f.texte && <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 15.5, lineHeight: 1.7, color: '#3a3450', whiteSpace: 'pre-line' }}>{f.texte}</div>}
            {f.video_url && (
              <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: 14, overflow: 'hidden', marginTop: 20 }}>
                <iframe
                  src={ytEmbed(f.video_url)}
                  title={f.titre}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            )}
          </article>
        ))}
      </section>
    </Layout>
  );
}
