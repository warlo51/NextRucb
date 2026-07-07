import * as React from 'react';
import Head from 'next/head';
import { supabase } from '../../lib/supabaseClient';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const JOUR_COURT: Record<string, string> = { Lundi: 'Lun', Mardi: 'Mar', Mercredi: 'Mer', Jeudi: 'Jeu', Vendredi: 'Ven' };
// Code couleur PAR CATÉGORIE d'équipe (charte conservée, teintes harmonisées)
const CAT_PALETTE: { test: RegExp; label: string; color: string }[] = [
  { test: /U18|U17/, label: 'U18', color: '#b5532a' },
  { test: /U15|U16/, label: 'U15', color: '#dc8d32' },
  { test: /U13/, label: 'U13', color: '#c2417a' },
  { test: /U11/, label: 'U11', color: '#5a35a0' },
  { test: /U9/, label: 'U9', color: '#1f8a5b' },
  { test: /U7|BABY|ECOLE|ÉCOLE/, label: 'U7 / École', color: '#2a6fdb' },
  { test: /SM|SENIOR|\bPR\b|\bD2\b|\bD3\b|\bNM\b/, label: 'Seniors', color: '#3d1e7b' },
  { test: /LOISIR/, label: 'Loisirs', color: '#4a7a8c' },
];
function slotColor(label?: string): string {
  const c = (label || '').toUpperCase();
  const hit = CAT_PALETTE.find((p) => p.test.test(c));
  return hit ? hit.color : '#3d1e7b';
}
function slotTint(hex: string): string {
  const n = parseInt(hex.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const mix = (ch: number) => Math.round(ch + (255 - ch) * 0.88);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

const CATEGORIES = ['Compétition', 'Club', 'Partenaires', 'Événement'];
const SECTIONS = [
  { key: 'planning', label: 'Planning' },
  { key: 'actus', label: 'Actualités' },
  { key: 'partenaires', label: 'Partenaires' },
  { key: 'comite', label: 'Comité' },
  { key: 'entraineurs', label: 'Entraîneurs' },
  { key: 'formation', label: 'Formation' },
  { key: 'historique', label: 'Historique' },
  { key: 'complexe', label: 'Complexe' },
  { key: 'minibasket', label: 'Mini-Basket' },
  { key: 'mecenat', label: 'Mécénat' },
  { key: 'equipe', label: 'Équipes' },
  { key: 'resultats', label: 'Résultats' },
  { key: 'bandeau', label: 'Accueil' },
];

const input: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #e1dcec', borderRadius: 10, fontFamily: "'Manrope',sans-serif", fontSize: 14, color: '#1d1730', background: '#faf9fc' };
const label: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#726b86', marginBottom: 6 };
const btnPrimary: React.CSSProperties = { background: '#3d1e7b', color: '#fff', border: 'none', fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 999, cursor: 'pointer' };
const btnOrange: React.CSSProperties = { background: '#dc8d32', color: '#fff', border: 'none', fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 14, padding: '12px 20px', borderRadius: 999, cursor: 'pointer' };
const btnGhost: React.CSSProperties = { background: 'none', color: '#726b86', border: '1.5px solid #e1dcec', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 999, cursor: 'pointer' };
const card: React.CSSProperties = { background: '#fff', border: '1px solid #eee9f4', borderTop: '3px solid #dc8d32', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 18px 40px -28px rgba(23,18,43,.5)' };
const h2: React.CSSProperties = { fontFamily: "'Oswald',sans-serif", fontSize: 26, fontWeight: 700, textTransform: 'uppercase', margin: 0, color: '#1d1730' };
const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function uploadTo(bucket: string, file?: File | null): Promise<string | null> {
  if (!file) return null;
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) { alert(error.message); return null; }
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export default function Admin() {
  const [session, setSession] = React.useState<any>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authError, setAuthError] = React.useState('');
  const [section, setSection] = React.useState('planning');
  const [isMobile, setIsMobile] = React.useState(false);
  const [vidUploading, setVidUploading] = React.useState(false); // upload vidéo d'actu en cours

  const [creneaux, setCreneaux] = React.useState<any[]>([]);
  const [gymnases, setGymnases] = React.useState<any[]>([]);
  const [actus, setActus] = React.useState<any[]>([]);
  const [partenaires, setPartenaires] = React.useState<any[]>([]);
  const [sponsorFiles, setSponsorFiles] = React.useState<any[]>([]);
  const [licenceFiles, setLicenceFiles] = React.useState<any[]>([]);
  const [comite, setComite] = React.useState<any[]>([]);
  const [entraineurs, setEntraineurs] = React.useState<any[]>([]);
  const [formations, setFormations] = React.useState<any[]>([]);
  const [historiques, setHistoriques] = React.useState<any[]>([]);
  const [complexePhotos, setComplexePhotos] = React.useState<any[]>([]);
  const [mecenats, setMecenats] = React.useState<any[]>([]);
  const [equipes, setEquipes] = React.useState<any[]>([]);
  const [bandeaux, setBandeaux] = React.useState<any[]>([]);
  const [resultats, setResultats] = React.useState<any[]>([]);
  const [miniBasket, setMiniBasket] = React.useState<any[]>([]);

  const [cForm, setCForm] = React.useState<any>(null);   // créneau
  const [planDay, setPlanDay] = React.useState('Lundi'); // jour sélectionné (vue mobile)
  const [aForm, setAForm] = React.useState<any>(null);   // actu
  const [mForm, setMForm] = React.useState<any>(null);   // membre comité
  const [eForm, setEForm] = React.useState<any>(null);   // entraîneur
  const [fForm, setFForm] = React.useState<any>(null);   // formation
  const [hForm, setHForm] = React.useState<any>(null);   // historique
  const [gForm, setGForm] = React.useState<any>(null);   // photo complexe (galerie)
  const [meForm, setMeForm] = React.useState<any>(null); // article mécénat
  const [eqForm, setEqForm] = React.useState<any>(null); // équipe
  const [rForm, setRForm] = React.useState<any>(null);   // résultats (widgets équipe)
  const [mbForm, setMbForm] = React.useState<any>(null); // page mini-basket

  // --- Auth ---
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }: any) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e: any, s: any) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // --- Responsive : sidebar -> barre horizontale en haut sous 768px ---
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  async function load() {
    const [{ data: cr }, { data: gy }, { data: ac }, { data: pa }, { data: co }, { data: en }, { data: fo }, { data: hi }, { data: sf }, { data: cp }, { data: me }, { data: eq }, { data: lf }, { data: bn }, { data: rs }, { data: mb }] = await Promise.all([
      supabase.from('creneau').select('*, equipes:equipe(id, nom)').order('heure_debut'),
      supabase.from('gymnase').select('id, titre').order('titre'),
      supabase.from('actu').select('*').order('date_publication', { ascending: false }),
      supabase.from('partenaire').select('*').order('ordre'),
      supabase.from('comite').select('*').order('ordre'),
      supabase.from('entraineur').select('*, equipes:equipe(id, nom)').order('ordre'),
      supabase.from('formation').select('*').order('ordre'),
      supabase.from('historique').select('*').order('ordre'),
      supabase.from('sponsor_file').select('*').order('created_at', { ascending: false }),
      supabase.from('complexe_photo').select('*').order('ordre'),
      supabase.from('mecenat').select('*').order('ordre'),
      supabase.from('equipe').select('*').order('ordre'),
      supabase.from('licence_file').select('*').order('created_at', { ascending: false }),
      supabase.from('bandeau').select('*').order('created_at', { ascending: false }),
      supabase.from('equipe_resultat').select('*').order('ordre'),
      supabase.from('mini_basket').select('*').order('ordre'),
    ]);
    setCreneaux(cr || []); setGymnases(gy || []); setActus(ac || []);
    setPartenaires(pa || []); setComite(co || []); setEntraineurs(en || []);
    setFormations(fo || []); setHistoriques(hi || []); setSponsorFiles(sf || []);
    setComplexePhotos(cp || []); setMecenats(me || []); setEquipes(eq || []);
    setLicenceFiles(lf || []); setBandeaux(bn || []); setResultats(rs || []);
    setMiniBasket(mb || []);
  }
  React.useEffect(() => { if (session) load(); }, [session]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault(); setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  }

  // --- CRUD créneaux ---
  const venueName = (id?: string) => gymnases.find((g) => g.id === id)?.titre || '';
  const creneauEquipes = (r: any) => (r.equipes || []).map((e: any) => e.nom).join(' · ');
  async function saveCreneau() {
    if (!cForm.equipe_ids?.length) { alert('Sélectionne au moins une équipe concernée.'); return; }
    // On retire les champs relationnels du payload de la table creneau.
    const { equipe_ids, equipes, ...rest } = cForm;
    const p = { ...rest, heure_debut: parseFloat(String(cForm.heure_debut)) || 0 };
    let creneauId = cForm.id;
    if (cForm.id) {
      await supabase.from('creneau').update(p).eq('id', cForm.id);
    } else {
      const { data } = await supabase.from('creneau').insert(p).select('id').single();
      creneauId = data?.id;
    }
    if (creneauId) {
      // Synchronise la table de liaison : on remplace toutes les équipes du créneau.
      await supabase.from('creneau_equipe').delete().eq('creneau_id', creneauId);
      await supabase.from('creneau_equipe').insert(equipe_ids.map((eid: string) => ({ creneau_id: creneauId, equipe_id: eid })));
    }
    setCForm(null); load();
  }
  async function delCreneau(id: string) { if (confirm('Supprimer ce créneau ?')) { await supabase.from('creneau').delete().eq('id', id); load(); } }

  // --- CRUD actus ---
  async function saveActu() {
    const p = { ...aForm, slug: aForm.slug || slugify(aForm.titre), date_fin_publication: aForm.date_fin_publication || null };
    if (aForm.id) await supabase.from('actu').update(p).eq('id', aForm.id);
    else await supabase.from('actu').insert(p);
    setAForm(null); load();
  }
  async function delActu(id: string) { if (confirm('Supprimer cette actualité ?')) { await supabase.from('actu').delete().eq('id', id); load(); } }

  // --- Partenaires ---
  async function addLogo(file: File) {
    const url = await uploadTo('partenaires', file);
    if (!url) return;
    await supabase.from('partenaire').insert({ nom: file.name.replace(/\.[^.]+$/, ''), logo_url: url, ordre: partenaires.length + 1 });
    load();
  }
  async function delPartenaire(id: string) { if (confirm('Retirer ce partenaire ?')) { await supabase.from('partenaire').delete().eq('id', id); load(); } }

  // --- Dossier de partenariat (sponsor_file) ---
  async function addDossier(file: File) {
    const url = await uploadTo('dossiers', file);
    if (!url) return;
    await supabase.from('sponsor_file').insert({ nom: file.name, file_url: url, actif: true });
    load();
  }
  async function delDossier(id: string) { if (confirm('Supprimer ce dossier ?')) { await supabase.from('sponsor_file').delete().eq('id', id); load(); } }

  // --- Dossier de licence (licence_file) ---
  async function addLicence(file: File) {
    const url = await uploadTo('dossiers', file);
    if (!url) return;
    await supabase.from('licence_file').insert({ nom: file.name, file_url: url, actif: true });
    load();
  }
  async function delLicence(id: string) { if (confirm('Supprimer ce dossier ?')) { await supabase.from('licence_file').delete().eq('id', id); load(); } }

  // --- Bandeau d'accueil (bandeau) ---
  async function addBandeau(file: File) {
    const url = await uploadTo('bandeau', file);
    if (!url) return;
    await supabase.from('bandeau').insert({ image_url: url, actif: true });
    load();
  }
  async function delBandeau(id: string) { if (confirm('Supprimer ce bandeau ?')) { await supabase.from('bandeau').delete().eq('id', id); load(); } }

  // --- CRUD comité ---
  async function saveMembre() {
    if (mForm.id) await supabase.from('comite').update(mForm).eq('id', mForm.id);
    else await supabase.from('comite').insert(mForm);
    setMForm(null); load();
  }
  async function delMembre(id: string) { if (confirm('Supprimer ce membre ?')) { await supabase.from('comite').delete().eq('id', id); load(); } }

  // --- CRUD entraîneurs ---
  async function saveEntraineur() {
    // On retire les champs relationnels du payload de la table entraineur.
    const { equipe_ids, equipes, equipe, equipe_id, ...rest } = eForm;
    let entraineurId = eForm.id;
    if (eForm.id) {
      await supabase.from('entraineur').update(rest).eq('id', eForm.id);
    } else {
      const { data } = await supabase.from('entraineur').insert(rest).select('id').single();
      entraineurId = data?.id;
    }
    if (entraineurId) {
      // Synchronise la table de liaison : on remplace toutes les équipes de l'entraîneur.
      await supabase.from('entraineur_equipe').delete().eq('entraineur_id', entraineurId);
      if (equipe_ids?.length) await supabase.from('entraineur_equipe').insert(equipe_ids.map((eid: string) => ({ entraineur_id: entraineurId, equipe_id: eid })));
    }
    setEForm(null); load();
  }
  async function delEntraineur(id: string) { if (confirm('Supprimer cet entraîneur ?')) { await supabase.from('entraineur').delete().eq('id', id); load(); } }

  // --- CRUD formation ---
  async function saveFormation() {
    if (fForm.id) await supabase.from('formation').update(fForm).eq('id', fForm.id);
    else await supabase.from('formation').insert(fForm);
    setFForm(null); load();
  }
  async function delFormation(id: string) { if (confirm('Supprimer cette formation ?')) { await supabase.from('formation').delete().eq('id', id); load(); } }

  // --- CRUD historique ---
  async function saveHistorique() {
    if (hForm.id) await supabase.from('historique').update(hForm).eq('id', hForm.id);
    else await supabase.from('historique').insert(hForm);
    setHForm(null); load();
  }
  async function delHistorique(id: string) { if (confirm('Supprimer cet article ?')) { await supabase.from('historique').delete().eq('id', id); load(); } }

  // --- CRUD photos du complexe (galerie) ---
  async function saveComplexePhoto() {
    if (!gForm.image_url) { alert('Ajoute une photo.'); return; }
    if (gForm.id) await supabase.from('complexe_photo').update(gForm).eq('id', gForm.id);
    else await supabase.from('complexe_photo').insert(gForm);
    setGForm(null); load();
  }
  async function delComplexePhoto(id: string) { if (confirm('Supprimer cette photo ?')) { await supabase.from('complexe_photo').delete().eq('id', id); load(); } }

  // --- CRUD mécénat ---
  async function saveMecenat() {
    if (meForm.id) await supabase.from('mecenat').update(meForm).eq('id', meForm.id);
    else await supabase.from('mecenat').insert(meForm);
    setMeForm(null); load();
  }
  async function delMecenat(id: string) { if (confirm('Supprimer cet article ?')) { await supabase.from('mecenat').delete().eq('id', id); load(); } }

  // --- CRUD équipes ---
  async function saveEquipe() {
    if (!eqForm.categorie || !eqForm.nom) { alert('Catégorie et nom sont requis.'); return; }
    if (eqForm.id) await supabase.from('equipe').update(eqForm).eq('id', eqForm.id);
    else await supabase.from('equipe').insert(eqForm);
    setEqForm(null); load();
  }
  async function delEquipe(id: string) { if (confirm('Supprimer cette équipe ?')) { await supabase.from('equipe').delete().eq('id', id); load(); } }

  // --- CRUD résultats (widgets Score'n'co par équipe) ---
  async function saveResultat() {
    if (!rForm.equipe) { alert("Le nom de l'équipe est requis."); return; }
    if (rForm.id) await supabase.from('equipe_resultat').update(rForm).eq('id', rForm.id);
    else await supabase.from('equipe_resultat').insert(rForm);
    setRForm(null); load();
  }
  async function delResultat(id: string) { if (confirm('Retirer cette équipe des résultats ?')) { await supabase.from('equipe_resultat').delete().eq('id', id); load(); } }

  // --- CRUD Mini-Basket (sous-menus = pages /mini-basket/[slug]) ---
  async function saveMiniBasket() {
    if (!mbForm.titre) { alert('Le titre est requis.'); return; }
    const p = { ...mbForm, slug: mbForm.slug || slugify(mbForm.titre) };
    if (mbForm.id) await supabase.from('mini_basket').update(p).eq('id', mbForm.id);
    else await supabase.from('mini_basket').insert(p);
    setMbForm(null); load();
  }
  async function delMiniBasket(id: string) { if (confirm('Supprimer cette page Mini-Basket ?')) { await supabase.from('mini_basket').delete().eq('id', id); load(); } }

  // ===================== LOGIN =====================
  if (!session) {
    return (
      <>
        <Head><title>Admin — Connexion</title></Head>
        <div style={{ minHeight: '100vh', background: 'linear-gradient(115deg,#2a1457,#3d1e7b 60%,#5a2f9e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 26px', fontFamily: "'Manrope',sans-serif" }}>
          <form onSubmit={signIn} style={{ background: '#fff', borderRadius: 20, padding: '38px 34px', width: '100%', maxWidth: 380, boxShadow: '0 30px 70px -30px rgba(0,0,0,.5)' }}>
            <img src="/logoruc.png" alt="RUCB" style={{ height: 62, display: 'block', margin: '0 auto 18px' }} />
            <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', color: '#1d1730' }}>Espace admin</div>
            <div style={{ fontSize: 13, color: '#726b86', textAlign: 'center', margin: '6px 0 26px', fontWeight: 500 }}>Connecte-toi pour gérer le site</div>
            <label style={label}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...input, marginBottom: 16 }} required />
            <label style={label}>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...input, marginBottom: 16 }} required />
            {authError ? <div style={{ color: '#c0392b', fontSize: 13, marginBottom: 14 }}>{authError}</div> : null}
            <button type="submit" style={{ ...btnOrange, width: '100%', padding: 13 }}>Se connecter</button>
          </form>
        </div>
      </>
    );
  }

  // ===================== DASHBOARD =====================
  return (
    <>
      <Head><title>Admin — RUC Basket</title></Head>
      <div style={{ fontFamily: "'Manrope',sans-serif", display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'stretch', minHeight: '100vh', background: '#f4f2f8' }}>
        {/* SIDEBAR / TOPBAR */}
        <aside style={{ width: isMobile ? '100%' : 240, flexShrink: 0, background: '#17122b', color: '#fff', padding: isMobile ? '14px 16px' : '22px 16px', display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 4, position: isMobile ? 'sticky' : 'static', top: 0, zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: isMobile ? 0 : '0 6px 18px', borderBottom: isMobile ? 'none' : '1px solid rgba(255,255,255,.12)', marginBottom: isMobile ? 0 : 14 }}>
            <img src="/logoruc.png" alt="RUCB" style={{ height: 38 }} />
            <div>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: '.04em' }}>ADMIN</div>
              <div style={{ fontSize: 11, color: '#b9a9d8', fontWeight: 600 }}>RUC Basket</div>
            </div>
            {isMobile && (
              <button onClick={() => supabase.auth.signOut()} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', color: '#fff', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 13, padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>Déconnexion</button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? 8 : 4, overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? 4 : 0 }}>
            {SECTIONS.map((s) => {
              const on = section === s.key;
              return (
                <button key={s.key} onClick={() => setSection(s.key)} style={{ display: 'block', width: isMobile ? 'auto' : '100%', flexShrink: 0, textAlign: 'left', whiteSpace: 'nowrap', background: on ? 'rgba(220,141,50,.18)' : (isMobile ? 'rgba(255,255,255,.06)' : 'transparent'), border: 'none', borderLeft: isMobile ? 'none' : `3px solid ${on ? '#dc8d32' : 'transparent'}`, borderBottom: isMobile ? `3px solid ${on ? '#dc8d32' : 'transparent'}` : 'none', color: on ? '#fff' : '#b9a9d8', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 14.5, padding: '12px 14px', borderRadius: 8, cursor: 'pointer' }}>{s.label}</button>
              );
            })}
          </div>
          {!isMobile && (
            <button onClick={() => supabase.auth.signOut()} style={{ marginTop: 'auto', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', color: '#fff', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 13, padding: 10, borderRadius: 8, cursor: 'pointer' }}>Déconnexion</button>
          )}
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, minWidth: 0, padding: isMobile ? '22px 16px 50px' : '32px 26px 60px' }}>

          {/* ---------- PLANNING ---------- */}
          {section === 'planning' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
                <div><h2 style={h2}>Créneaux d'entraînement</h2><div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>{creneaux.length} séances</div></div>
                <button onClick={() => setCForm({ jour: 'Lundi', heure_debut: 18, horaire: '', annees: '', detail: '', gymnase_id: gymnases[0]?.id, equipe_ids: [], actif: true })} style={btnOrange}>+ Nouveau créneau</button>
              </div>

              {/* Dossier de licence — fichier servi par le bouton "Télécharger le dossier de licence" */}
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, textTransform: 'uppercase', color: '#1d1730' }}>Dossier de licence</div>
                    <div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>Le plus récent est proposé au téléchargement sur le site.</div>
                  </div>
                  <label style={{ ...btnPrimary, display: 'inline-block' }}>+ Téléverser un PDF<input type="file" accept="application/pdf,.pdf" onChange={(e) => e.target.files?.[0] && addLicence(e.target.files[0])} style={{ display: 'none' }} /></label>
                </div>
                {licenceFiles.length > 0 && (
                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {licenceFiles.map((s, i) => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', border: '1px solid #eee9f4', borderRadius: 10, background: '#faf9fc' }}>
                        <a href={s.file_url} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 0, fontWeight: 700, fontSize: 14, color: '#3d1e7b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.nom || 'dossier.pdf'}</a>
                        {i === 0 ? <span style={{ fontSize: 11, fontWeight: 800, color: '#dc8d32', letterSpacing: '.04em', textTransform: 'uppercase' }}>En ligne</span> : null}
                        <button onClick={() => delLicence(s.id)} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '7px 12px', borderRadius: 8, cursor: 'pointer' }}>Suppr.</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cForm && (
                <div style={card}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16 }}>
                    <div><label style={label}>Jour</label><select value={cForm.jour} onChange={(e) => setCForm({ ...cForm, jour: e.target.value })} style={input}>{JOURS.map((j) => <option key={j}>{j}</option>)}</select></div>
                    <div><label style={label}>Horaire</label><input value={cForm.horaire} onChange={(e) => setCForm({ ...cForm, horaire: e.target.value })} placeholder="18h00 – 20h00" style={input} /></div>
                    <div><label style={label}>Années</label><input value={cForm.annees || ''} onChange={(e) => setCForm({ ...cForm, annees: e.target.value })} style={input} /></div>
                    <div><label style={label}>Lieu</label><select value={cForm.gymnase_id || ''} onChange={(e) => setCForm({ ...cForm, gymnase_id: e.target.value })} style={input}>{gymnases.map((g) => <option key={g.id} value={g.id}>{g.titre}</option>)}</select></div>
                    <div><label style={label}>Heure début (tri)</label><input type="number" step="0.5" value={cForm.heure_debut} onChange={(e) => setCForm({ ...cForm, heure_debut: e.target.value })} style={input} /></div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={label}>Équipes concernées</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, padding: '12px 14px', border: '1px solid #e1dcec', borderRadius: 10, background: '#faf9fc' }}>
                      {equipes.length === 0 ? <span style={{ fontSize: 13, color: '#726b86' }}>Ajoute d'abord des équipes dans l'onglet Équipes.</span> : Array.from(new Set(equipes.map((x) => x.categorie))).map((cat) => (
                        <div key={cat}>
                          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', color: '#dc8d32', marginBottom: 7 }}>{cat}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {equipes.filter((x) => x.categorie === cat).map((eq) => {
                              const checked = (cForm.equipe_ids || []).includes(eq.id);
                              return (
                                <label key={eq.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#1d1730', cursor: 'pointer' }}>
                                  <input type="checkbox" checked={checked} onChange={() => { const cur = cForm.equipe_ids || []; setCForm({ ...cForm, equipe_ids: checked ? cur.filter((id: string) => id !== eq.id) : [...cur, eq.id] }); }} />
                                  {eq.nom}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}><label style={label}>Détail (optionnel)</label><textarea value={cForm.detail || ''} onChange={(e) => setCForm({ ...cForm, detail: e.target.value })} rows={2} style={{ ...input, resize: 'vertical' }} /></div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}><button onClick={saveCreneau} style={btnPrimary}>Enregistrer</button><button onClick={() => setCForm(null)} style={btnGhost}>Annuler</button></div>
                </div>
              )}
              {(() => {
                const newSlot = (jour: string) => ({ jour, heure_debut: 18, horaire: '', annees: '', detail: '', gymnase_id: gymnases[0]?.id, equipe_ids: [], actif: true });
                const itemsOf = (jour: string) => [...creneaux].filter((c) => c.jour === jour).sort((a, b) => a.heure_debut - b.heure_debut);
                const labelOf = (r: any) => creneauEquipes(r) || r.categorie || '—';
                const Card = ({ r, compact }: { r: any; compact?: boolean }) => {
                  const col = slotColor(labelOf(r));
                  return (
                      <div style={{ background: slotTint(col), border: '1px solid #eee9f4', borderLeft: `4px solid ${col}`, borderRadius: 10, padding: compact ? '10px 11px' : '12px 14px' }}>
                        <div style={{ fontWeight: 800, fontSize: compact ? 12.5 : 15, color: '#1d1730' }}>{r.horaire || '—'}</div>
                        <div style={{ fontWeight: 800, fontSize: compact ? 13 : 14, marginTop: 2, color: col, lineHeight: 1.25 }}>{labelOf(r)}</div>
                        <div style={{ fontSize: compact ? 11 : 12.5, color: '#726b86', marginTop: 3, lineHeight: 1.3 }}>{venueName(r.gymnase_id)}</div>
                        {!compact && r.annees ? <div style={{ fontSize: 12, color: '#9a93ad', marginTop: 2 }}>{r.annees}</div> : null}
                        <div style={{ display: 'flex', gap: 6, marginTop: compact ? 9 : 12 }}>
                          <button onClick={() => setCForm({ ...r, equipe_ids: (r.equipes || []).map((e: any) => e.id) })} style={{ flex: 1, background: '#fff', color: '#3d1e7b', border: '1px solid #e4dcf3', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: compact ? 11 : 13, padding: compact ? 5 : 10, borderRadius: compact ? 7 : 9, cursor: 'pointer' }}>Éditer</button>
                          <button onClick={() => delCreneau(r.id)} style={{ flex: 1, background: '#fff', color: '#c0392b', border: '1px solid #f6d6d6', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: compact ? 11 : 13, padding: compact ? 5 : 10, borderRadius: compact ? 7 : 9, cursor: 'pointer' }}>Suppr.</button>
                        </div>
                      </div>
                  );
                };
                const Legend = () => (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 18px', marginTop: 18, padding: '14px 16px', background: '#fff', border: '1px solid #eee9f4', borderRadius: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: '#9a93ad', marginRight: 4 }}>Catégories</span>
                      {CAT_PALETTE.map((p) => (
                          <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: '#1d1730' }}><span style={{ width: 14, height: 14, borderRadius: 4, background: p.color, display: 'inline-block', flexShrink: 0 }} />{p.label}</div>
                      ))}
                    </div>
                );

                if (isMobile) {
                  return (
                      <div>
                        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10 }}>
                          {JOURS.map((jour) => { const on = planDay === jour; return <button key={jour} onClick={() => setPlanDay(jour)} style={{ flexShrink: 0, fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 13, padding: '9px 15px', borderRadius: 999, cursor: 'pointer', border: `1.5px solid ${on ? '#3d1e7b' : '#e1dcec'}`, background: on ? '#3d1e7b' : '#fff', color: on ? '#fff' : '#3d1e7b' }}>{JOUR_COURT[jour]}</button>; })}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 14px' }}>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, textTransform: 'uppercase', fontSize: 20, color: '#1d1730' }}>{planDay}</div>
                          <button onClick={() => setCForm(newSlot(planDay))} style={btnOrange}>+ Ajouter</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {itemsOf(planDay).map((r) => <Card key={r.id} r={r} />)}
                          {itemsOf(planDay).length === 0 && (<button onClick={() => setCForm(newSlot(planDay))} style={{ minHeight: 90, background: '#fff', border: '1.5px dashed #e1dcec', borderRadius: 14, color: '#b5adc6', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Aucun créneau ce jour — + Ajouter</button>)}
                        </div>
                        <Legend />
                      </div>
                  );
                }
                return (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: 10, alignItems: 'start' }}>
                        {JOURS.map((jour) => {
                          const items = itemsOf(jour);
                          return (
                              <div key={jour} style={{ background: '#fff', border: '1px solid #eee9f4', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 230, boxShadow: '0 12px 28px -26px rgba(23,18,43,.5)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: 10, background: '#faf9fc', borderBottom: '1px solid #eee9f4' }}>
                                  <div>
                                    <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, textTransform: 'uppercase', fontSize: 13, color: '#1d1730', letterSpacing: '.05em' }}>{JOUR_COURT[jour]}</div>
                                    <div style={{ fontSize: 10.5, color: '#9a93ad', fontWeight: 600 }}>{items.length}</div>
                                  </div>
                                  <button onClick={() => setCForm(newSlot(jour))} title="Ajouter un créneau" style={{ width: 26, height: 26, borderRadius: 8, background: '#3d1e7b', color: '#fff', border: 'none', fontSize: 17, lineHeight: 1, cursor: 'pointer', flexShrink: 0 }}>+</button>
                                </div>
                                <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                                  {items.map((r) => <Card key={r.id} r={r} compact />)}
                                  {items.length === 0 && (<button onClick={() => setCForm(newSlot(jour))} style={{ flex: 1, minHeight: 64, background: 'none', border: '1.5px dashed #e1dcec', borderRadius: 10, color: '#b5adc6', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>+</button>)}
                                </div>
                              </div>
                          );
                        })}
                      </div>
                      <Legend />
                    </>
                );
              })()}
            </div>
          )}

          {/* ---------- ACTUALITÉS ---------- */}
          {section === 'actus' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
                <div><h2 style={h2}>Actualités</h2><div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>{actus.length} article(s)</div></div>
                <button onClick={() => setAForm({ titre: '', categorie: CATEGORIES[0], date_publication: new Date().toISOString().slice(0, 10), date_fin_publication: '', extrait: '', contenu: '', image_url: '', video_url: '', actif: true })} style={btnOrange}>+ Nouvel article</button>
              </div>
              {aForm && (
                <div style={card}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                    <div><label style={label}>Titre</label><input value={aForm.titre} onChange={(e) => setAForm({ ...aForm, titre: e.target.value })} style={input} /></div>
                    <div><label style={label}>Catégorie</label><select value={aForm.categorie} onChange={(e) => setAForm({ ...aForm, categorie: e.target.value })} style={input}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
                    <div><label style={label}>Date de publication</label><input type="date" value={aForm.date_publication || ''} onChange={(e) => setAForm({ ...aForm, date_publication: e.target.value })} style={input} /></div>
                    <div><label style={label}>Date de fin (optionnel)</label><input type="date" value={aForm.date_fin_publication || ''} onChange={(e) => setAForm({ ...aForm, date_fin_publication: e.target.value })} style={input} /></div>
                    <div><label style={label}>Image</label><input type="file" accept="image/*" onChange={async (e) => { if (e.target.files?.[0]) { const u = await uploadTo('actus', e.target.files[0]); if (u) setAForm((f: any) => ({ ...f, image_url: u })); } }} style={{ ...input, padding: 8 }} />{aForm.image_url ? <img src={aForm.image_url} alt="" style={{ marginTop: 8, height: 60, borderRadius: 8 }} /> : null}</div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={label}>Vidéo (MP4, optionnel)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                      <label style={{ ...btnPrimary, display: 'inline-block', opacity: vidUploading ? .6 : 1, pointerEvents: vidUploading ? 'none' : 'auto' }}>
                        {vidUploading ? 'Envoi en cours…' : '+ Téléverser un MP4'}
                        <input type="file" accept="video/mp4,video/*" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setVidUploading(true); const u = await uploadTo('actus', file); setVidUploading(false); if (u) setAForm((f: any) => ({ ...f, video_url: u })); }} style={{ display: 'none' }} />
                      </label>
                      <span style={{ fontSize: 12, color: '#9a93ad', fontWeight: 700 }}>ou</span>
                      <input value={aForm.video_url || ''} onChange={(e) => setAForm({ ...aForm, video_url: e.target.value })} placeholder="Colle une URL (YouTube, Vimeo, .mp4)" style={{ ...input, flex: 1, minWidth: 200 }} />
                    </div>
                    {aForm.video_url ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, padding: '10px 14px', border: '1px solid #eee9f4', borderRadius: 10, background: '#faf9fc' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#1f7a4d', whiteSpace: 'nowrap' }}>✓ Vidéo</span>
                        <a href={aForm.video_url} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 0, fontSize: 13, color: '#3d1e7b', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{aForm.video_url}</a>
                        <button onClick={() => setAForm({ ...aForm, video_url: '' })} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '7px 12px', borderRadius: 8, cursor: 'pointer' }}>Retirer</button>
                      </div>
                    ) : null}
                  </div>
                  <div style={{ marginTop: 16 }}><label style={label}>Extrait</label><textarea value={aForm.extrait || ''} onChange={(e) => setAForm({ ...aForm, extrait: e.target.value })} rows={2} style={{ ...input, resize: 'vertical' }} /></div>
                  <div style={{ marginTop: 16 }}><label style={label}>Contenu</label><textarea value={aForm.contenu || ''} onChange={(e) => setAForm({ ...aForm, contenu: e.target.value })} rows={6} style={{ ...input, resize: 'vertical' }} /></div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16, fontSize: 14, fontWeight: 700, color: '#1d1730', cursor: 'pointer' }}>
                    <input type="checkbox" checked={aForm.actif !== false} onChange={(e) => setAForm({ ...aForm, actif: e.target.checked })} />
                    Article actif (visible sur le site)
                  </label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}><button onClick={saveActu} style={btnPrimary}>Enregistrer</button><button onClick={() => setAForm(null)} style={btnGhost}>Annuler</button></div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {actus.map((a) => (
                  <div key={a.id} style={{ background: '#fff', border: '1px solid #eee9f4', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 84, height: 60, borderRadius: 10, flexShrink: 0, backgroundImage: a.image_url ? `url('${a.image_url}')` : 'repeating-linear-gradient(45deg,#efeaf6,#efeaf6 8px,#e7e0f1 8px,#e7e0f1 16px)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: '#dc8d32' }}>{a.categorie}</div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#1d1730', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.titre}</div>
                      <div style={{ fontSize: 12, color: '#726b86' }}>{a.date_publication}{a.date_fin_publication ? ` → ${a.date_fin_publication}` : ''}{a.actif === false ? ' · ' : ''}{a.actif === false ? <span style={{ color: '#c0392b', fontWeight: 700 }}>désactivé</span> : null}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setAForm({ ...a })} style={{ background: '#f1edf8', color: '#3d1e7b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Éditer</button>
                      <button onClick={() => delActu(a.id)} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Suppr.</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- PARTENAIRES ---------- */}
          {section === 'partenaires' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
                <div><h2 style={h2}>Partenaires</h2><div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>{partenaires.length} logo(s)</div></div>
                <label style={{ ...btnOrange, display: 'inline-block' }}>+ Ajouter un logo<input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && addLogo(e.target.files[0])} style={{ display: 'none' }} /></label>
              </div>

              {/* Dossier de partenariat — fichier servi par le bouton "Demander le dossier" */}
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, textTransform: 'uppercase', color: '#1d1730' }}>Dossier de partenariat</div>
                    <div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>Le plus récent est proposé par le bouton « Demander le dossier ».</div>
                  </div>
                  <label style={{ ...btnPrimary, display: 'inline-block' }}>+ Téléverser un PDF<input type="file" accept="application/pdf,.pdf" onChange={(e) => e.target.files?.[0] && addDossier(e.target.files[0])} style={{ display: 'none' }} /></label>
                </div>
                {sponsorFiles.length > 0 && (
                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sponsorFiles.map((s, i) => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', border: '1px solid #eee9f4', borderRadius: 10, background: '#faf9fc' }}>
                        <a href={s.file_url} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 0, fontWeight: 700, fontSize: 14, color: '#3d1e7b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.nom || 'dossier.pdf'}</a>
                        {i === 0 ? <span style={{ fontSize: 11, fontWeight: 800, color: '#dc8d32', letterSpacing: '.04em', textTransform: 'uppercase' }}>En ligne</span> : null}
                        <button onClick={() => delDossier(s.id)} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '7px 12px', borderRadius: 8, cursor: 'pointer' }}>Suppr.</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16 }}>
                {partenaires.map((p) => (
                  <div key={p.id} style={{ position: 'relative', height: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', border: '1px solid #eee9f4', borderRadius: 16, padding: 18 }}>
                    <button onClick={() => delPartenaire(p.id)} title="Retirer" style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%', background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 800, fontSize: 15, lineHeight: 1, cursor: 'pointer' }}>×</button>
                    {p.logo_url
                      ? <img src={p.logo_url} alt={p.nom} style={{ maxHeight: 64, maxWidth: '100%', objectFit: 'contain' }} />
                      : <div style={{ height: 64, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'repeating-linear-gradient(45deg,#efeaf6,#efeaf6 8px,#e7e0f1 8px,#e7e0f1 16px)', borderRadius: 8, fontFamily: 'monospace', fontSize: 11, color: '#8a7fa6' }}>logo</div>}
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#726b86', textAlign: 'center' }}>{p.nom}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- COMITÉ ---------- */}
          {section === 'comite' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
                <div><h2 style={h2}>Comité directeur</h2><div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>{comite.length} membre(s)</div></div>
                <button onClick={() => setMForm({ nom: '', role: '', telephone: '', email: '', photo_url: '', ordre: comite.length + 1, actif: true })} style={btnOrange}>+ Nouveau membre</button>
              </div>
              {mForm && (
                <div style={card}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                    <div><label style={label}>Nom</label><input value={mForm.nom} onChange={(e) => setMForm({ ...mForm, nom: e.target.value })} placeholder="Prénom Nom" style={input} /></div>
                    <div><label style={label}>Fonction</label><input value={mForm.role || ''} onChange={(e) => setMForm({ ...mForm, role: e.target.value })} placeholder="Président, Trésorier..." style={input} /></div>
                    <div><label style={label}>Téléphone</label><input value={mForm.telephone || ''} onChange={(e) => setMForm({ ...mForm, telephone: e.target.value })} placeholder="06 00 00 00 00" style={input} /></div>
                    <div><label style={label}>E-mail</label><input type="email" value={mForm.email || ''} onChange={(e) => setMForm({ ...mForm, email: e.target.value })} placeholder="contact@rucb.fr" style={input} /></div>
                    <div><label style={label}>Photo (optionnel)</label><input type="file" accept="image/*" onChange={async (e) => { if (e.target.files?.[0]) { const u = await uploadTo('comite', e.target.files[0]); if (u) setMForm((f: any) => ({ ...f, photo_url: u })); } }} style={{ ...input, padding: 8 }} />{mForm.photo_url ? <img src={mForm.photo_url} alt="" style={{ marginTop: 8, height: 52, borderRadius: '50%' }} /> : null}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}><button onClick={saveMembre} style={btnPrimary}>Enregistrer</button><button onClick={() => setMForm(null)} style={btnGhost}>Annuler</button></div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
                {comite.map((m) => (
                  <div key={m.id} style={{ background: '#fff', border: '1px solid #eee9f4', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                    {m.photo_url
                      ? <img src={m.photo_url} alt={m.nom} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      : <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#3d1e7b,#5a35a0)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 20, flexShrink: 0 }}>{(m.nom || '?').trim().charAt(0).toUpperCase()}</div>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#1d1730' }}>{m.nom}</div>
                      {m.role ? <div style={{ fontSize: 13, color: '#dc8d32', fontWeight: 700 }}>{m.role}</div> : null}
                      {m.telephone ? <div style={{ fontSize: 12, color: '#726b86' }}>{m.telephone}</div> : null}
                      {m.email ? <div style={{ fontSize: 12, color: '#726b86', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div> : null}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setMForm({ ...m })} style={{ background: '#f1edf8', color: '#3d1e7b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Éditer</button>
                      <button onClick={() => delMembre(m.id)} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Suppr.</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- ENTRAÎNEURS ---------- */}
          {section === 'entraineurs' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
                <div><h2 style={h2}>Entraîneurs</h2><div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>{entraineurs.length} entraîneur(s)</div></div>
                <button onClick={() => setEForm({ nom: '', role: '', equipe_ids: [], email: '', telephone: '', photo_url: '', ordre: entraineurs.length + 1, actif: true })} style={btnOrange}>+ Nouvel entraîneur</button>
              </div>
              {eForm && (
                <div style={card}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                    <div><label style={label}>Nom</label><input value={eForm.nom} onChange={(e) => setEForm({ ...eForm, nom: e.target.value })} placeholder="Prénom Nom" style={input} /></div>
                    <div><label style={label}>Rôle / fonction</label><input value={eForm.role || ''} onChange={(e) => setEForm({ ...eForm, role: e.target.value })} placeholder="Entraîneur principal, Assistant..." style={input} /></div>
                    <div><label style={label}>Téléphone</label><input value={eForm.telephone || ''} onChange={(e) => setEForm({ ...eForm, telephone: e.target.value })} placeholder="06 00 00 00 00" style={input} /></div>
                    <div><label style={label}>E-mail</label><input type="email" value={eForm.email || ''} onChange={(e) => setEForm({ ...eForm, email: e.target.value })} placeholder="contact@rucb.fr" style={input} /></div>
                    <div><label style={label}>Photo (optionnel)</label><input type="file" accept="image/*" onChange={async (e) => { if (e.target.files?.[0]) { const u = await uploadTo('entraineurs', e.target.files[0]); if (u) setEForm((f: any) => ({ ...f, photo_url: u })); } }} style={{ ...input, padding: 8 }} />{eForm.photo_url ? <img src={eForm.photo_url} alt="" style={{ marginTop: 8, height: 52, borderRadius: '50%' }} /> : null}</div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={label}>Équipes encadrées</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, padding: '12px 14px', border: '1px solid #e1dcec', borderRadius: 10, background: '#faf9fc' }}>
                      {equipes.length === 0 ? <span style={{ fontSize: 13, color: '#726b86' }}>Ajoute d'abord des équipes dans l'onglet Équipes.</span> : Array.from(new Set(equipes.map((x) => x.categorie))).map((cat) => (
                        <div key={cat}>
                          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', color: '#dc8d32', marginBottom: 7 }}>{cat}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {equipes.filter((x) => x.categorie === cat).map((eq) => {
                              const checked = (eForm.equipe_ids || []).includes(eq.id);
                              return (
                                <label key={eq.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#1d1730', cursor: 'pointer' }}>
                                  <input type="checkbox" checked={checked} onChange={() => { const cur = eForm.equipe_ids || []; setEForm({ ...eForm, equipe_ids: checked ? cur.filter((id: string) => id !== eq.id) : [...cur, eq.id] }); }} />
                                  {eq.nom}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}><button onClick={saveEntraineur} style={btnPrimary}>Enregistrer</button><button onClick={() => setEForm(null)} style={btnGhost}>Annuler</button></div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
                {entraineurs.map((en) => (
                  <div key={en.id} style={{ background: '#fff', border: '1px solid #eee9f4', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                    {en.photo_url
                      ? <img src={en.photo_url} alt={en.nom} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      : <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#3d1e7b,#5a35a0)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 20, flexShrink: 0 }}>{(en.nom || '?').trim().charAt(0).toUpperCase()}</div>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#1d1730' }}>{en.nom}</div>
                      {en.role ? <div style={{ fontSize: 13, color: '#dc8d32', fontWeight: 700 }}>{en.role}</div> : null}
                      {(en.equipes || []).length ? <div style={{ fontSize: 12, color: '#726b86', marginTop: 2 }}>{(en.equipes || []).map((e: any) => e.nom).join(' · ')}</div> : null}
                      {en.telephone ? <div style={{ fontSize: 12, color: '#726b86' }}>{en.telephone}</div> : null}
                      {en.email ? <div style={{ fontSize: 12, color: '#726b86', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{en.email}</div> : null}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setEForm({ ...en, equipe_ids: (en.equipes || []).map((e: any) => e.id) })} style={{ background: '#f1edf8', color: '#3d1e7b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Éditer</button>
                      <button onClick={() => delEntraineur(en.id)} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Suppr.</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- FORMATION ---------- */}
          {section === 'formation' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
                <div><h2 style={h2}>Formation</h2><div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>{formations.length} article(s)</div></div>
                <button onClick={() => setFForm({ titre: '', texte: '', video_url: '', ordre: formations.length + 1, actif: true })} style={btnOrange}>+ Nouvel article</button>
              </div>
              {fForm && (
                <div style={card}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                    <div><label style={label}>Titre</label><input value={fForm.titre} onChange={(e) => setFForm({ ...fForm, titre: e.target.value })} style={input} /></div>
                    <div><label style={label}>Lien YouTube (optionnel)</label><input value={fForm.video_url || ''} onChange={(e) => setFForm({ ...fForm, video_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." style={input} /></div>
                  </div>
                  <div style={{ marginTop: 16 }}><label style={label}>Texte</label><textarea value={fForm.texte || ''} onChange={(e) => setFForm({ ...fForm, texte: e.target.value })} rows={6} style={{ ...input, resize: 'vertical' }} /></div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}><button onClick={saveFormation} style={btnPrimary}>Enregistrer</button><button onClick={() => setFForm(null)} style={btnGhost}>Annuler</button></div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {formations.map((f) => (
                  <div key={f.id} style={{ background: '#fff', border: '1px solid #eee9f4', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#1d1730' }}>{f.titre}</div>
                      {f.texte ? <div style={{ fontSize: 13, color: '#726b86', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.texte}</div> : null}
                      {f.video_url ? <div style={{ fontSize: 11, color: '#dc8d32', fontWeight: 700, marginTop: 2 }}>▶ vidéo</div> : null}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setFForm({ ...f })} style={{ background: '#f1edf8', color: '#3d1e7b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Éditer</button>
                      <button onClick={() => delFormation(f.id)} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Suppr.</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- HISTORIQUE ---------- */}
          {section === 'historique' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
                <div><h2 style={h2}>Historique</h2><div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>{historiques.length} article(s)</div></div>
                <button onClick={() => setHForm({ titre: '', texte: '', ordre: historiques.length + 1, actif: true })} style={btnOrange}>+ Nouvel article</button>
              </div>
              {hForm && (
                <div style={card}>
                  <div><label style={label}>Titre</label><input value={hForm.titre} onChange={(e) => setHForm({ ...hForm, titre: e.target.value })} placeholder="2003 — La création" style={input} /></div>
                  <div style={{ marginTop: 16 }}><label style={label}>Texte</label><textarea value={hForm.texte || ''} onChange={(e) => setHForm({ ...hForm, texte: e.target.value })} rows={6} style={{ ...input, resize: 'vertical' }} /></div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}><button onClick={saveHistorique} style={btnPrimary}>Enregistrer</button><button onClick={() => setHForm(null)} style={btnGhost}>Annuler</button></div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {historiques.map((a) => (
                  <div key={a.id} style={{ background: '#fff', border: '1px solid #eee9f4', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#1d1730' }}>{a.titre}</div>
                      {a.texte ? <div style={{ fontSize: 13, color: '#726b86', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.texte}</div> : null}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setHForm({ ...a })} style={{ background: '#f1edf8', color: '#3d1e7b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Éditer</button>
                      <button onClick={() => delHistorique(a.id)} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Suppr.</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- COMPLEXE (galerie) ---------- */}
          {section === 'complexe' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
                <div><h2 style={h2}>Galerie du complexe</h2><div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>{complexePhotos.length} photo(s)</div></div>
                <button onClick={() => setGForm({ image_url: '', legende: '', ordre: complexePhotos.length + 1, actif: true })} style={btnOrange}>+ Nouvelle photo</button>
              </div>
              {gForm && (
                <div style={card}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                    <div><label style={label}>Légende</label><input value={gForm.legende || ''} onChange={(e) => setGForm({ ...gForm, legende: e.target.value })} placeholder="La grande salle" style={input} /></div>
                    <div><label style={label}>Ordre</label><input type="number" value={gForm.ordre} onChange={(e) => setGForm({ ...gForm, ordre: parseInt(e.target.value, 10) || 0 })} style={input} /></div>
                    <div><label style={label}>Photo</label><input type="file" accept="image/*" onChange={async (e) => { if (e.target.files?.[0]) { const u = await uploadTo('complexe', e.target.files[0]); if (u) setGForm((f: any) => ({ ...f, image_url: u })); } }} style={{ ...input, padding: 8 }} />{gForm.image_url ? <img src={gForm.image_url} alt="" style={{ marginTop: 8, height: 60, borderRadius: 8 }} /> : null}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}><button onClick={saveComplexePhoto} style={btnPrimary}>Enregistrer</button><button onClick={() => setGForm(null)} style={btnGhost}>Annuler</button></div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
                {complexePhotos.map((p) => (
                  <div key={p.id} style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid #eee9f4', background: '#fff' }}>
                    <div style={{ height: 150, backgroundImage: p.image_url ? `url('${p.image_url}')` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#efeaf6' }} />
                    <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: '#1d1730', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.legende || '—'}</div>
                      <button onClick={() => setGForm({ ...p })} style={{ background: '#f1edf8', color: '#3d1e7b', border: 'none', fontWeight: 700, fontSize: 12, padding: '7px 10px', borderRadius: 8, cursor: 'pointer' }}>Éditer</button>
                      <button onClick={() => delComplexePhoto(p.id)} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '7px 10px', borderRadius: 8, cursor: 'pointer' }}>Suppr.</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- MÉCÉNAT ---------- */}
          {section === 'mecenat' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
                <div><h2 style={h2}>Mécénat</h2><div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>{mecenats.length} article(s)</div></div>
                <button onClick={() => setMeForm({ titre: '', texte: '', ordre: mecenats.length + 1, actif: true })} style={btnOrange}>+ Nouvel article</button>
              </div>
              {meForm && (
                <div style={card}>
                  <div><label style={label}>Titre</label><input value={meForm.titre} onChange={(e) => setMeForm({ ...meForm, titre: e.target.value })} placeholder="Le mécénat, comment ça marche ?" style={input} /></div>
                  <div style={{ marginTop: 16 }}><label style={label}>Texte</label><textarea value={meForm.texte || ''} onChange={(e) => setMeForm({ ...meForm, texte: e.target.value })} rows={6} style={{ ...input, resize: 'vertical' }} /></div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}><button onClick={saveMecenat} style={btnPrimary}>Enregistrer</button><button onClick={() => setMeForm(null)} style={btnGhost}>Annuler</button></div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {mecenats.map((a) => (
                  <div key={a.id} style={{ background: '#fff', border: '1px solid #eee9f4', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#1d1730' }}>{a.titre}</div>
                      {a.texte ? <div style={{ fontSize: 13, color: '#726b86', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.texte}</div> : null}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setMeForm({ ...a })} style={{ background: '#f1edf8', color: '#3d1e7b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Éditer</button>
                      <button onClick={() => delMecenat(a.id)} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Suppr.</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- ÉQUIPES ---------- */}
          {section === 'equipe' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
                <div><h2 style={h2}>Équipes</h2><div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>{equipes.length} équipe(s)</div></div>
                <button onClick={() => setEqForm({ categorie: '', nom: '', ordre: equipes.length + 1, actif: true })} style={btnOrange}>+ Nouvelle équipe</button>
              </div>
              {eqForm && (
                <div style={card}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16 }}>
                    <div><label style={label}>Catégorie</label><input list="equipe-categories" value={eqForm.categorie} onChange={(e) => setEqForm({ ...eqForm, categorie: e.target.value })} placeholder="École de basket" style={input} /><datalist id="equipe-categories">{Array.from(new Set(equipes.map((x) => x.categorie).filter(Boolean))).map((c) => <option key={c} value={c} />)}</datalist></div>
                    <div><label style={label}>Nom</label><input value={eqForm.nom} onChange={(e) => setEqForm({ ...eqForm, nom: e.target.value })} placeholder="U13 (2 équipes)" style={input} /></div>
                    <div><label style={label}>Ordre</label><input type="number" value={eqForm.ordre} onChange={(e) => setEqForm({ ...eqForm, ordre: parseInt(e.target.value, 10) || 0 })} style={input} /></div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}><button onClick={saveEquipe} style={btnPrimary}>Enregistrer</button><button onClick={() => setEqForm(null)} style={btnGhost}>Annuler</button></div>
                </div>
              )}
              {Array.from(new Set(equipes.map((x) => x.categorie))).map((cat) => (
                <div key={cat} style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#3d1e7b', margin: '0 0 10px' }}>{cat}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {equipes.filter((x) => x.categorie === cat).map((eq) => (
                      <div key={eq.id} style={{ background: '#fff', border: '1px solid #eee9f4', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#dc8d32', minWidth: 24 }}>#{eq.ordre}</span>
                        <div style={{ flex: 1, minWidth: 0, fontWeight: 700, fontSize: 14.5, color: '#1d1730' }}>{eq.nom}</div>
                        <button onClick={() => setEqForm({ ...eq })} style={{ background: '#f1edf8', color: '#3d1e7b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Éditer</button>
                        <button onClick={() => delEquipe(eq.id)} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Suppr.</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---------- ACCUEIL (bandeau) ---------- */}
          {section === 'bandeau' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
                <div><h2 style={h2}>Bandeau d'accueil</h2><div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>Image de fond du hero de la page d'accueil.</div></div>
                <label style={{ ...btnOrange, display: 'inline-block' }}>+ Téléverser une image<input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && addBandeau(e.target.files[0])} style={{ display: 'none' }} /></label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
                {bandeaux.map((b, i) => (
                  <div key={b.id} style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid #eee9f4', background: '#fff' }}>
                    <div style={{ height: 150, backgroundImage: b.image_url ? `url('${b.image_url}')` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#efeaf6' }} />
                    <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {i === 0 ? <span style={{ flex: 1, fontSize: 11, fontWeight: 800, color: '#dc8d32', letterSpacing: '.04em', textTransform: 'uppercase' }}>En ligne</span> : <span style={{ flex: 1, fontSize: 12, color: '#726b86', fontWeight: 600 }}>Ancien</span>}
                      <button onClick={() => delBandeau(b.id)} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '7px 12px', borderRadius: 8, cursor: 'pointer' }}>Suppr.</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- RÉSULTATS ---------- */}
          {section === 'resultats' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
                <div><h2 style={h2}>Résultats par équipe</h2><div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>{resultats.length} équipe(s)</div></div>
                <button onClick={() => setRForm({ equipe: '', categorie: '', ordre: resultats.length + 1, widget: '', direct: '', actif: true })} style={btnOrange}>+ Nouvelle équipe</button>
              </div>

              <div style={{ ...card, borderTopColor: '#3d1e7b' }}>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: '#1d1730' }}>Comment ça marche</div>
                <div style={{ fontSize: 13.5, color: '#726b86', fontWeight: 600, marginTop: 6, lineHeight: 1.6 }}>
                  Crée tes widgets sur <a href="https://scorenco.com/clubs/widgets" target="_blank" rel="noreferrer" style={{ color: '#3d1e7b', fontWeight: 800 }}>Score&apos;n&apos;co</a> (partenaire officiel FFBB),
                  puis colle le code d&apos;intégration dans la case correspondante.
                  Astuce : préfère le code <strong>« script »</strong> (avec <code>data-widget-id</code> + <code>widgets.js</code>) — il <strong>s&apos;adapte tout seul en hauteur</strong>. Le code « iframe » fonctionne aussi mais garde sa hauteur fixe. Une URL seule marche également.
                  Laisse vide les widgets non créés ; seules les cases remplies apparaissent en onglets sur la page Résultats.
                </div>
              </div>

              {rForm && (
                <div style={card}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16 }}>
                    <div><label style={label}>Équipe (libellé affiché)</label><input value={rForm.equipe} onChange={(e) => setRForm({ ...rForm, equipe: e.target.value })} placeholder="U13 Féminines 2" style={input} /></div>
                    <div><label style={label}>Catégorie (regroupement)</label><input list="resultat-categories" value={rForm.categorie || ''} onChange={(e) => setRForm({ ...rForm, categorie: e.target.value })} placeholder="U13" style={input} /><datalist id="resultat-categories">{Array.from(new Set(resultats.map((x) => x.categorie).filter(Boolean))).map((c) => <option key={c} value={c} />)}</datalist></div>
                    <div><label style={label}>Ordre</label><input type="number" value={rForm.ordre} onChange={(e) => setRForm({ ...rForm, ordre: parseInt(e.target.value, 10) || 0 })} style={input} /></div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={label}>Widget combiné (classement + résultats + calendrier) — code d&apos;intégration ou URL</label>
                    <textarea value={rForm.widget || ''} onChange={(e) => setRForm({ ...rForm, widget: e.target.value })} rows={3} placeholder={'<div class="scorenco-widget" data-widget-id="123456" ...></div><script ... src="https://widgets.scorenco.com/host/widgets.js"></script>'} style={{ ...input, resize: 'vertical', fontFamily: 'monospace', fontSize: 12.5 }} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={label}>Match en direct (optionnel) — code d&apos;intégration ou URL</label>
                    <textarea value={rForm.direct || ''} onChange={(e) => setRForm({ ...rForm, direct: e.target.value })} rows={2} placeholder={'<div class="scorenco-widget" data-widget-id="123456" ...></div><script ... src="https://widgets.scorenco.com/host/widgets.js"></script>'} style={{ ...input, resize: 'vertical', fontFamily: 'monospace', fontSize: 12.5 }} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16, fontSize: 14, fontWeight: 700, color: '#1d1730', cursor: 'pointer' }}>
                    <input type="checkbox" checked={rForm.actif !== false} onChange={(e) => setRForm({ ...rForm, actif: e.target.checked })} />
                    Équipe visible sur le site
                  </label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}><button onClick={saveResultat} style={btnPrimary}>Enregistrer</button><button onClick={() => setRForm(null)} style={btnGhost}>Annuler</button></div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {resultats.map((r) => (
                  <div key={r.id} style={{ background: '#fff', border: '1px solid #eee9f4', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#dc8d32', minWidth: 24 }}>#{r.ordre}</span>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#1d1730' }}>{r.equipe}{r.actif === false ? <span style={{ color: '#c0392b', fontWeight: 700, fontSize: 12 }}> · masqué</span> : null}</div>
                      {r.categorie ? <div style={{ fontSize: 12, color: '#726b86', fontWeight: 700 }}>{r.categorie}</div> : null}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.03em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: 6, background: r.widget ? '#e6f3ec' : '#fdecea', color: r.widget ? '#1f7a4d' : '#c0392b' }}>{r.widget ? 'Widget OK' : 'widget manquant'}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.03em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: 6, background: r.direct ? '#e6f3ec' : '#f4f2f8', color: r.direct ? '#1f7a4d' : '#c3bdd2' }}>Direct</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setRForm({ ...r })} style={{ background: '#f1edf8', color: '#3d1e7b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Éditer</button>
                      <button onClick={() => delResultat(r.id)} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Suppr.</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- MINI-BASKET ---------- */}
          {section === 'minibasket' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
                <div><h2 style={h2}>Mini-Basket</h2><div style={{ fontSize: 13, color: '#726b86', fontWeight: 600, marginTop: 4 }}>{miniBasket.length} page(s) · chaque page est un sous-menu de l&apos;onglet « Mini-Basket ».</div></div>
                <button onClick={() => setMbForm({ titre: '', slug: '', extrait: '', contenu: '', image_url: '', ordre: miniBasket.length + 1, actif: true })} style={btnOrange}>+ Nouvelle page</button>
              </div>
              {mbForm && (
                <div style={card}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                    <div><label style={label}>Titre (libellé du menu)</label><input value={mbForm.titre} onChange={(e) => setMbForm({ ...mbForm, titre: e.target.value })} placeholder="Baby Basket" style={input} /></div>
                    <div><label style={label}>Lien (slug)</label><input value={mbForm.slug || ''} onChange={(e) => setMbForm({ ...mbForm, slug: slugify(e.target.value) })} placeholder="auto depuis le titre" style={input} /><div style={{ fontSize: 11, color: '#9a93ad', marginTop: 4 }}>/mini-basket/{mbForm.slug || slugify(mbForm.titre || '') || '…'}</div></div>
                    <div><label style={label}>Ordre (dans le menu)</label><input type="number" value={mbForm.ordre} onChange={(e) => setMbForm({ ...mbForm, ordre: parseInt(e.target.value, 10) || 0 })} style={input} /></div>
                    <div><label style={label}>Image (optionnel)</label><input type="file" accept="image/*" onChange={async (e) => { if (e.target.files?.[0]) { const u = await uploadTo('mini-basket', e.target.files[0]); if (u) setMbForm((f: any) => ({ ...f, image_url: u })); } }} style={{ ...input, padding: 8 }} />{mbForm.image_url ? <img src={mbForm.image_url} alt="" style={{ marginTop: 8, height: 60, borderRadius: 8 }} /> : null}</div>
                  </div>
                  <div style={{ marginTop: 16 }}><label style={label}>Extrait (chapô, optionnel)</label><textarea value={mbForm.extrait || ''} onChange={(e) => setMbForm({ ...mbForm, extrait: e.target.value })} rows={2} style={{ ...input, resize: 'vertical' }} /></div>
                  <div style={{ marginTop: 16 }}><label style={label}>Contenu</label><textarea value={mbForm.contenu || ''} onChange={(e) => setMbForm({ ...mbForm, contenu: e.target.value })} rows={6} style={{ ...input, resize: 'vertical' }} /></div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16, fontSize: 14, fontWeight: 700, color: '#1d1730', cursor: 'pointer' }}>
                    <input type="checkbox" checked={mbForm.actif !== false} onChange={(e) => setMbForm({ ...mbForm, actif: e.target.checked })} />
                    Page active (visible dans le menu)
                  </label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}><button onClick={saveMiniBasket} style={btnPrimary}>Enregistrer</button><button onClick={() => setMbForm(null)} style={btnGhost}>Annuler</button></div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {miniBasket.map((m) => (
                  <div key={m.id} style={{ background: '#fff', border: '1px solid #eee9f4', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#dc8d32', minWidth: 24 }}>#{m.ordre}</span>
                    <div style={{ width: 84, height: 60, borderRadius: 10, flexShrink: 0, backgroundImage: m.image_url ? `url('${m.image_url}')` : 'repeating-linear-gradient(45deg,#efeaf6,#efeaf6 8px,#e7e0f1 8px,#e7e0f1 16px)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#1d1730', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.titre}{m.actif === false ? <span style={{ color: '#c0392b', fontWeight: 700, fontSize: 12 }}> · masqué</span> : null}</div>
                      <div style={{ fontSize: 12, color: '#726b86' }}>/mini-basket/{m.slug}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setMbForm({ ...m })} style={{ background: '#f1edf8', color: '#3d1e7b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Éditer</button>
                      <button onClick={() => delMiniBasket(m.id)} style={{ background: '#fbeaea', color: '#c0392b', border: 'none', fontWeight: 700, fontSize: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Suppr.</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
