import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Layout } from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

// Galerie de repli (utilisée tant que la table complexe_photo est vide).
// Mets `ph: true` pour afficher un placeholder rayé en attendant une image.
const IMAGES = [
  { src: '/complexe/facade.jpg', cap: 'Façade — Complexe Endy Miyem', ph: true },
  { src: '/gymnase3.jpg', cap: 'La grande salle' },
  { src: '/gymnase2.jpg', cap: 'Les coursives' },
  { src: '/complexe/terrain.jpg', cap: 'Terrain principal', ph: true },
  { src: '/complexe/vestiaires.jpg', cap: 'Vestiaires', ph: true },
];

const FACTS = [
  'Parking gratuit sur place',
  'Desservi par les transports en commun',
  'Salle homologuée FFBB',
  'Vestiaires et douches',
];

const ADRESSE = 'Rue Henri Barbusse, 51100 Reims';

export default function Complexe() {
  const [photos, setPhotos] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('complexe_photo')
        .select('*')
        .eq('actif', true)
        .order('ordre');
      setPhotos(data || []);
    }
    load().catch(() => undefined);
  }, []);

  // Photos Supabase si disponibles, sinon galerie de repli statique.
  const gallery = photos.length
    ? photos.map((p) => ({ src: p.image_url, cap: p.legende || '', ph: false }))
    : IMAGES;

  return (
    <Layout>
      <Head>
        <title>Complexe sportif</title>
        <meta name="description" content="Le complexe sportif Endy Miyem, salle du RUC Basket Reims." />
      </Head>

      {/* En-tête */}
      <section style={{ background: 'radial-gradient(120% 140% at 100% 0%,rgba(220,141,50,.28),transparent 55%),#15141b', color: '#fff', padding: '56px 26px', borderBottom: '3px solid #dc8d32' }}>
        <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 13, letterSpacing: '.28em', textTransform: 'uppercase', color: '#f0b968', fontWeight: 600, marginBottom: 10 }}>Qui sommes-nous</div>
        <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 'clamp(34px,5vw,56px)', fontWeight: 700, textTransform: 'uppercase', margin: 0, letterSpacing: '-.01em' }}>Complexe sportif</h1>
      </section>

      {/* Accès */}
      <section style={{ padding: '54px 26px 24px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 36, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 'clamp(24px,3vw,34px)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-fg)', margin: '0 0 14px' }}>Complexe Endy Miyem</h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--paper-2)', color: 'var(--brand-fg)', fontWeight: 700, fontSize: 14, padding: '9px 15px', borderRadius: 999, marginBottom: 18 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#dc8d32', display: 'inline-block' }} />{ADRESSE}
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--text-soft)', fontWeight: 500, margin: '0 0 22px' }}>
              Le RUC Basket évolue au complexe sportif Endy Miyem : une salle moderne et homologuée, au cœur de Reims, où s'entraînent et jouent toutes nos équipes, de l'école de basket aux seniors.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10, marginBottom: 26 }}>
              {FACTS.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5, fontWeight: 600, color: 'var(--text)' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#dc8d32', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>✓</span>{f}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(ADRESSE)}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#dc8d32', color: '#fff', fontWeight: 800, fontSize: 15, padding: '14px 24px', borderRadius: 999, boxShadow: '0 10px 24px -12px rgba(220,141,50,.8)' }}>Ouvrir dans Google Maps</a>
              <Link href="/planning" style={{ textDecoration: 'none', background: 'none', color: 'var(--brand-fg)', border: '1.5px solid var(--orange)', fontWeight: 800, fontSize: 15, padding: '14px 24px', borderRadius: 999 }}>Voir le planning</Link>
            </div>
          </div>

          {/* Carte Google Maps (embed) */}
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--line)', boxShadow: '0 20px 44px -26px rgba(23,18,43,.55)', minHeight: 360 }}>
            <iframe
              title="Plan d'accès"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(ADRESSE)}&output=embed`}
              width="100%"
              height="360"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section style={{ padding: '34px 26px 70px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 13, letterSpacing: '.26em', textTransform: 'uppercase', color: '#dc8d32', fontWeight: 600 }}>Visite</div>
        <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 'clamp(24px,3vw,34px)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)', margin: '6px 0 24px' }}>En images</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {gallery.map((im: any, i: number) => (
            <div key={i} style={{ position: 'relative', height: 230, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--line)', boxShadow: '0 14px 34px -26px rgba(23,18,43,.5)' }}>
              {im.ph ? (
                <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg,var(--paper-2),var(--paper-2) 11px,var(--line) 11px,var(--line) 22px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: 12, color: 'var(--muted)' }}>photo</div>
              ) : (
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${im.src}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              )}
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '24px 14px 12px', background: 'linear-gradient(to top,rgba(23,18,43,.75),transparent)', color: '#fff', fontSize: 13, fontWeight: 700 }}>{im.cap}</div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
