import * as React from 'react';
import { Layout } from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import Head from 'next/head';
import { supabase } from '../../lib/supabaseClient';

export default function Mecenat() {
  const [articles, setArticles] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function load() {
      const { data } = await supabase.from('mecenat').select('*').eq('actif', true).order('ordre');
      setArticles(data || []);
    }
    load();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Mécénat</title>
        <meta name="description" content="Le mécénat au RUCB basket" />
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
      </Head>
      <PageHeader kicker="Soutenir le club" title="Mécénat" />

      <section style={{ padding: '48px 26px 70px', maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {articles.map((a) => (
          <article key={a.id} style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 18, padding: 26, boxShadow: '0 14px 34px -26px rgba(23,18,43,.5)' }}>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-fg)', margin: '0 0 14px' }}>{a.titre}</h2>
            {a.texte && <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 15.5, lineHeight: 1.7, color: 'var(--text-soft)', whiteSpace: 'pre-line' }}>{a.texte}</div>}
          </article>
        ))}
      </section>
    </Layout>
  );
}
