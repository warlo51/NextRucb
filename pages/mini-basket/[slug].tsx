import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import { supabase } from '../../lib/supabaseClient';

// Page d'un sous-menu Mini-Basket. Le contenu (titre, image, texte) est géré
// dans l'admin (section « Mini-Basket ») et lu ici par `slug`.
export default function MiniBasketPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [page, setPage] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!slug) return;
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('mini_basket')
        .select('*')
        .eq('slug', slug)
        .eq('actif', true)
        .maybeSingle();
      setPage(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <PageHeader kicker="Mini-Basket" title="Chargement…" variant="club" />
        <div style={{ padding: '80px 26px', textAlign: 'center', color: 'var(--muted)' }}>Chargement…</div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout>
        <PageHeader kicker="Mini-Basket" title="Page introuvable" variant="club" />
        <div style={{ padding: '80px 26px', textAlign: 'center', color: 'var(--muted)' }}>Cette page n&apos;est pas disponible.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{page.titre} — Mini-Basket RUC</title>
        <meta name="description" content={page.extrait || page.titre} />
      </Head>

      <PageHeader kicker="Mini-Basket" title={page.titre} variant="club" />

      <article style={{ maxWidth: 820, margin: '0 auto', padding: '48px 26px 80px' }}>
        {page.image_url ? (
          <img src={page.image_url} alt={page.titre} style={{ width: '100%', borderRadius: 18, marginBottom: 28, boxShadow: '0 20px 44px -24px rgba(23,18,43,.5)' }} />
        ) : null}
        {page.extrait ? <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--brand-fg)', fontWeight: 600, margin: '0 0 20px' }}>{page.extrait}</p> : null}
        <div style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-soft)', fontWeight: 500, whiteSpace: 'pre-wrap' }}>{page.contenu}</div>
      </article>
    </Layout>
  );
}
