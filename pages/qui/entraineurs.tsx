import * as React from 'react';
import Head from 'next/head';
import { Layout } from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

// Assistant en fin de liste, entraîneur en tête.
const roleRank = (r?: string) => (/assistant/i.test(r || '') ? 1 : 0);

export default function Entraineurs() {
  const [entraineurs, setEntraineurs] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('entraineur')
        .select('*, equipes:equipe (id, nom, categorie, ordre)')
        .eq('actif', true)
        .order('ordre');
      setEntraineurs(data || []);
    }
    load();
  }, []);

  // Regroupe les entraîneurs par équipe (un entraîneur multi-équipes apparaît
  // dans chaque équipe). Les entraîneurs sans équipe vont dans « Encadrement ».
  const { teams, noTeam } = React.useMemo(() => {
    const map = new Map<string, { equipe: any; coaches: any[] }>();
    entraineurs.forEach((e) => {
      (e.equipes || []).forEach((eq: any) => {
        if (!map.has(eq.id)) map.set(eq.id, { equipe: eq, coaches: [] });
        map.get(eq.id)!.coaches.push(e);
      });
    });
    const arr = Array.from(map.values()).sort(
      (a, b) => (a.equipe.ordre ?? 0) - (b.equipe.ordre ?? 0) || String(a.equipe.nom).localeCompare(String(b.equipe.nom))
    );
    arr.forEach((g) => g.coaches.sort((a, b) => roleRank(a.role) - roleRank(b.role) || (a.ordre ?? 0) - (b.ordre ?? 0)));
    const noTeam = entraineurs.filter((e) => !(e.equipes || []).length);
    return { teams: arr, noTeam };
  }, [entraineurs]);

  const Card = ({ e }: { e: any }) => (
    <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 18, padding: 24, textAlign: 'center', boxShadow: '0 14px 34px -26px rgba(23,18,43,.5)' }}>
      {e.photo_url
        ? <img src={e.photo_url} alt={e.nom} style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 14px', display: 'block' }} />
        : <div style={{ width: 90, height: 90, borderRadius: '50%', margin: '0 auto 14px', background: 'linear-gradient(135deg,#dc8d32,#f0a93f)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 34 }}>{(e.nom || '?').trim().charAt(0).toUpperCase()}</div>}
      <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 19, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase' }}>{e.nom}</div>
      {e.role && <div style={{ fontSize: 14, color: '#dc8d32', fontWeight: 700, marginTop: 4 }}>{e.role}</div>}
      {(e.telephone || e.email) && (
        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
          {e.telephone && <div>Tél. : {e.telephone}</div>}
          {e.email && <div>E-mail : <a href={`mailto:${e.email}`} style={{ color: 'var(--brand-fg)', fontWeight: 600 }}>{e.email}</a></div>}
        </div>
      )}
    </div>
  );

  const TeamBlock = ({ titre, kicker, coaches }: { titre: string; kicker?: string; coaches: any[] }) => (
    <div style={{ marginBottom: 44 }}>
      {kicker ? <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 12, letterSpacing: '.22em', textTransform: 'uppercase', color: '#dc8d32', fontWeight: 600, marginBottom: 4 }}>{kicker}</div> : null}
      <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)', margin: '0 0 18px', paddingBottom: 10, borderBottom: '2px solid #dc8d32' }}>{titre}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
        {coaches.map((e) => <Card key={`${titre}-${e.id}`} e={e} />)}
      </div>
    </div>
  );

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
        {teams.length === 0 && noTeam.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', fontWeight: 500 }}>Les entraîneurs seront bientôt présentés ici.</div>
        ) : (
          <>
            {teams.map((g) => (
              <TeamBlock key={g.equipe.id} titre={g.equipe.nom} kicker={g.equipe.categorie} coaches={g.coaches} />
            ))}
            {noTeam.length > 0 && <TeamBlock titre="Encadrement" coaches={noTeam} />}
          </>
        )}
      </section>
    </Layout>
  );
}
