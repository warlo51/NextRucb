import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

// Média vidéo d'une actu : iframe pour YouTube/Vimeo, balise <video> sinon (MP4…).
function ActuVideo({ url, poster }: { url: string; poster?: string }) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  const box: React.CSSProperties = { borderRadius: 18, marginBottom: 28, overflow: 'hidden', boxShadow: '0 20px 44px -24px rgba(23,18,43,.5)' };
  if (yt || vimeo) {
    const src = yt ? `https://www.youtube.com/embed/${yt[1]}` : `https://player.vimeo.com/video/${vimeo![1]}`;
    return (
      <div style={{ ...box, position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe src={src} title="Vidéo de l'actualité" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} />
      </div>
    );
  }
  return (
    <video controls playsInline poster={poster} style={{ ...box, width: '100%', display: 'block', background: '#000' }}>
      <source src={url} />
      Votre navigateur ne peut pas lire cette vidéo.
    </video>
  );
}

export default function ActuDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [actu, setActu] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!slug) return;
    async function load() {
      setLoading(true);
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from('actu')
        .select('*')
        .eq('slug', slug)
        .eq('actif', true)
        .lte('date_publication', today)
        .or(`date_fin_publication.is.null,date_fin_publication.gte.${today}`)
        .maybeSingle();
      setActu(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: '80px 26px', textAlign: 'center', color: 'var(--muted)' }}>Chargement…</div>
      </Layout>
    );
  }

  if (!actu) {
    return (
      <Layout>
        <div style={{ padding: '80px 26px', textAlign: 'center', color: 'var(--muted)' }}>Cette actualité n&apos;est pas disponible.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{actu.titre}</title>
        <meta name="description" content={actu.extrait || actu.titre} />
      </Head>

      <article style={{ maxWidth: 820, margin: '0 auto', padding: '48px 26px 80px' }}>
        {actu.categorie ? (
          <span style={{ display: 'inline-block', background: 'var(--orange)', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', padding: '6px 12px', borderRadius: 999 }}>{actu.categorie}</span>
        ) : null}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#dc8d32', letterSpacing: '.05em', margin: '16px 0 8px' }}>{formatDate(actu.date_publication)}</div>
        <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)', margin: '0 0 24px', lineHeight: 1.1 }}>{actu.titre}</h1>
        {actu.video_url ? (
          <ActuVideo url={actu.video_url} poster={actu.image_url || undefined} />
        ) : actu.image_url ? (
          <img src={actu.image_url} alt={actu.titre} style={{ width: '100%', borderRadius: 18, marginBottom: 28, boxShadow: '0 20px 44px -24px rgba(23,18,43,.5)' }} />
        ) : null}
        {actu.extrait ? <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--brand-fg)', fontWeight: 600, margin: '0 0 20px' }}>{actu.extrait}</p> : null}
        <div style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-soft)', fontWeight: 500, whiteSpace: 'pre-wrap' }}>{actu.contenu}</div>
      </article>
    </Layout>
  );
}
