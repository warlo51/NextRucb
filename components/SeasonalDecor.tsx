import React, { useEffect, useRef, useState } from 'react';
import {
  FaTree, FaGift, FaSnowflake, FaStar, FaGlassCheers, FaClock, FaEgg, FaCarrot,
  FaSeedling, FaLeaf, FaGhost, FaSpider, FaHatWizard, FaSkull, FaBasketballBall,
  FaGraduationCap, FaClipboardList, FaUmbrellaBeach, FaIceCream, FaPlane,
  FaTrophy, FaFire, FaMedal, FaBirthdayCake, FaMusic, FaSun,
} from 'react-icons/fa';
import { ThemeKey, THEME_DECOR } from '../lib/themes';

// Couche de décor saisonnier affichée par-dessus tout le site (montée une seule
// fois dans Layout). Purement décorative : `pointer-events:none` + `aria-hidden`
// pour ne jamais gêner clics ni lecteurs d'écran. La charte UI reste inchangée.

type Props = { theme: ThemeKey | null; animations: boolean };

const C: React.CSSProperties = { position: 'absolute' }; // raccourci position:absolute

// Encart orange charte « Spécial … » : badge texte désactivé (« MODE ÉTÉ »,
// « SPÉCIAL NOËL », etc.). On ne veut plus afficher cette pastille sur le front ;
// le reste du décor saisonnier (icônes, filigranes, particules) est conservé.
// Les appels <Encart …/> restent en place mais ne rendent rien.
function Encart(_props: { icon: React.ReactNode; text: string }) {
  return null;
}

// Filigrane : grande icône translucide, calée en haut à droite (jamais sur le texte).
function Filigrane({ icon, color, top = 238, right = 40, size = 120, opacity = 0.15 }: any) {
  return (
    <span
      className="decor-filigrane"
      style={{ ...C, top, right, zIndex: 0, fontSize: size, color, opacity, lineHeight: 1 }}
    >
      {icon}
    </span>
  );
}

// --- Décor structurel + icônes signature, un rendu par thème ---------------

function DecorNoel() {
  const boules = ['#c62f28', '#2e8b57', '#e8c56a', '#c62f28', '#2e8b57', '#e8c56a', '#c62f28', '#2e8b57', '#e8c56a', '#c62f28', '#2e8b57'];
  const delays = ['0s', '.3s', '.6s', '.9s', '1.2s', '1.5s', '.2s', '.5s', '.8s', '1.1s', '1.4s'];
  return (
    <>
      <Encart icon={<FaTree />} text="SPÉCIAL NOËL" />
      <Filigrane icon={<FaTree />} color="#2e8b57" />
      {/* Guirlande : ligne dorée + boules scintillantes */}
      <div style={{ ...C, top: 16, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#e8c56a,transparent)', opacity: 0.55 }} />
      <div style={{ ...C, top: 15, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', padding: '0 20px' }}>
        {boules.map((c, i) => (
          <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, boxShadow: `0 0 9px ${c}`, animation: `twk 2.2s ease-in-out infinite ${delays[i]}` }} />
        ))}
      </div>
      <span style={{ ...C, bottom: 16, left: 26, fontSize: 40, color: '#2e8b57', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.45))' }}><FaTree /></span>
      <span style={{ ...C, bottom: 18, left: 80, fontSize: 26, color: '#c62f28', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.45))' }}><FaGift /></span>
      <span style={{ ...C, top: 80, right: 56, fontSize: 26, color: '#eaf3ff', filter: 'drop-shadow(0 0 8px rgba(180,210,255,.6))', animation: 'spn 16s linear infinite' }}><FaSnowflake /></span>
      <span style={{ ...C, top: 172, left: 48, fontSize: 16, color: '#eaf3ff', opacity: 0.85, animation: 'spn 22s linear infinite' }}><FaSnowflake /></span>
      <span style={{ ...C, top: 60, left: '52%', fontSize: 18, color: '#e8c56a', animation: 'twk 2.6s ease-in-out infinite' }}><FaStar /></span>
    </>
  );
}

function DecorNouvelan() {
  const year = new Date().getMonth() === 11 ? new Date().getFullYear() + 1 : new Date().getFullYear();
  return (
    <>
      <Encart icon={<FaGlassCheers />} text={`BONNE ANNÉE ${year}`} />
      <Filigrane icon={<FaGlassCheers />} color="#e0b64a" size={116} />
      <span style={{ ...C, bottom: 18, left: 28, fontSize: 38, color: '#e0b64a', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,.5))' }}><FaGlassCheers /></span>
      <span style={{ ...C, top: 72, right: 56, fontSize: 24, color: '#ecc96a', filter: 'drop-shadow(0 0 8px rgba(240,205,106,.5))' }}><FaClock /></span>
      <span style={{ ...C, top: 120, left: 44, fontSize: 16, color: '#ffffff', animation: 'twk 2.2s ease-in-out infinite' }}><FaStar /></span>
      <span style={{ ...C, top: 58, left: '40%', fontSize: 20, color: '#f0cd6a', animation: 'twk 2.8s ease-in-out infinite .5s' }}><FaStar /></span>
      <span style={{ ...C, bottom: 96, right: '16%', fontSize: 14, color: '#c9d2ff', animation: 'twk 2.4s ease-in-out infinite .9s' }}><FaStar /></span>
    </>
  );
}

function DecorPaques() {
  return (
    <>
      <Encart icon={<FaEgg />} text="SPÉCIAL PÂQUES" />
      <Filigrane icon={<FaEgg />} color="#dd8fa8" opacity={0.16} />
      <div style={{ ...C, bottom: 20, left: 26, display: 'flex', gap: 14, alignItems: 'flex-end' }}>
        <span style={{ fontSize: 38, color: '#dd8fa8', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.4))', animation: 'fly 4s ease-in-out infinite' }}><FaEgg /></span>
        <span style={{ fontSize: 30, color: '#8fd0a0', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.4))', animation: 'fly 4s ease-in-out infinite .6s' }}><FaEgg /></span>
        <span style={{ fontSize: 26, color: '#e8d06a', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.4))', animation: 'fly 4s ease-in-out infinite 1.2s' }}><FaEgg /></span>
        <span style={{ fontSize: 24, color: '#ecabc0', transform: 'rotate(12deg)' }}><FaCarrot /></span>
      </div>
      <span style={{ ...C, top: 78, right: 60, fontSize: 24, color: '#8fd0a0', animation: 'fly 5s ease-in-out infinite' }}><FaSeedling /></span>
      <span style={{ ...C, top: 152, left: 46, fontSize: 16, color: '#79c48f', opacity: 0.85, animation: 'fly 6s ease-in-out infinite 1s' }}><FaLeaf /></span>
    </>
  );
}

function DecorHalloween() {
  return (
    <>
      <Encart icon={<FaGhost />} text="SPÉCIAL HALLOWEEN" />
      <Filigrane icon={<FaGhost />} color="#8f45d9" top={236} opacity={0.16} size={118} />
      {/* Lune (halo radial) */}
      <div style={{ ...C, top: 24, right: 44, width: 48, height: 48, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%,#fff2cf,#ffd27a)', boxShadow: '0 0 34px #ffcf6a,0 0 8px #fff' }} />
      {/* Araignée suspendue à un fil */}
      <div style={{ ...C, top: 0, left: '17%', width: 1, height: 88, background: 'rgba(232,224,255,.3)' }} />
      <span style={{ ...C, top: 80, left: '17%', transform: 'translateX(-50%)', fontSize: 22, color: '#e8e0ff' }}><FaSpider /></span>
      <span style={{ ...C, bottom: 84, right: '12%', fontSize: 38, color: '#efeaff', filter: 'drop-shadow(0 0 10px rgba(143,69,217,.5))', animation: 'fly 4.5s ease-in-out infinite' }}><FaGhost /></span>
      <span style={{ ...C, bottom: 18, left: 28, fontSize: 34, color: '#8f45d9', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.5))' }}><FaHatWizard /></span>
      <span style={{ ...C, bottom: 24, right: 26, fontSize: 22, color: '#ff7518' }}><FaSkull /></span>
    </>
  );
}

function DecorRentree() {
  return (
    <>
      <Encart icon={<FaGraduationCap />} text="C’EST LA REPRISE" />
      <Filigrane icon={<FaBasketballBall />} color="#e6642e" top={236} />
      {/* Bandeau oblique « C'EST REPARTI » coin haut-droit */}
      <div style={{ ...C, top: 22, right: -48, transform: 'rotate(35deg)', background: '#e6642e', color: '#fff', fontFamily: "'Oswald',sans-serif", fontWeight: 700, letterSpacing: '.08em', padding: '6px 60px', boxShadow: '0 8px 20px -8px rgba(0,0,0,.6)', fontSize: 13 }}>C&apos;EST REPARTI</div>
      <span style={{ ...C, bottom: 18, left: 28, fontSize: 38, color: '#e6642e', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.45))', animation: 'spn 7s linear infinite' }}><FaBasketballBall /></span>
      <span style={{ ...C, bottom: 24, left: 82, fontSize: 26, color: '#2b6fd6', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.45))' }}><FaGraduationCap /></span>
      <span style={{ ...C, top: 80, left: 46, fontSize: 22, color: '#4d8de6', opacity: 0.9 }}><FaClipboardList /></span>
    </>
  );
}

function DecorEte() {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <>
      <Encart icon={<FaSun />} text="MODE ÉTÉ" />
      <Filigrane icon={<FaUmbrellaBeach />} color="#ff6b5a" top={250} size={118} />
      {/* Soleil à rayons (rotation lente) coin haut-droit */}
      <div style={{ ...C, top: -6, right: -6, width: 130, height: 130 }}>
        <div style={{ ...C, inset: 0, animation: 'spn 42s linear infinite' }}>
          {rays.map((deg) => (
            <span key={deg} style={{ ...C, top: '50%', left: '50%', width: 60, height: 3, background: 'linear-gradient(90deg,#ffd166,transparent)', transformOrigin: '0 50%', transform: `rotate(${deg}deg)` }} />
          ))}
        </div>
        <div style={{ ...C, top: '50%', left: '50%', width: 46, height: 46, margin: '-23px 0 0 -23px', borderRadius: '50%', background: 'radial-gradient(circle,#ffe08a,#ffb54a)', boxShadow: '0 0 30px #ffcf6a' }} />
      </div>
      <span style={{ ...C, bottom: 18, left: 28, fontSize: 40, color: '#ff6b5a', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.4))' }}><FaUmbrellaBeach /></span>
      <span style={{ ...C, bottom: 22, left: 86, fontSize: 26, color: '#ffd166', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.4))' }}><FaIceCream /></span>
      <span style={{ ...C, top: 98, left: '16%', fontSize: 18, color: '#3fc0cf', transform: 'rotate(-8deg)', animation: 'fly 5s ease-in-out infinite' }}><FaPlane /></span>
    </>
  );
}

function DecorPlayoffs() {
  const beam: React.CSSProperties = {
    ...C, top: -40, width: 150, height: 560, background: 'linear-gradient(to bottom,rgba(240,201,90,.35),transparent)',
    clipPath: 'polygon(42% 0,58% 0,100% 100%,0 100%)', transformOrigin: 'top center',
  };
  return (
    <>
      <Encart icon={<FaTrophy />} text="PHASE FINALE" />
      <Filigrane icon={<FaBasketballBall />} color="#e0b64a" top={250} opacity={0.14} size={116} />
      {/* Deux faisceaux de projecteurs */}
      <div style={{ ...beam, left: '12%', animation: 'bm 6s ease-in-out infinite' }} />
      <div style={{ ...beam, right: '12%', animation: 'bm 6s ease-in-out infinite -3s' }} />
      <span style={{ ...C, top: 172, right: 150, fontSize: 42, color: '#f0c95a', filter: 'drop-shadow(0 0 16px rgba(240,201,90,.6))', animation: 'twk 3s ease-in-out infinite' }}><FaTrophy /></span>
      <span style={{ ...C, bottom: 20, left: 30, fontSize: 30, color: '#e0463a', filter: 'drop-shadow(0 0 10px rgba(224,70,58,.5))' }}><FaFire /></span>
      <span style={{ ...C, bottom: 20, right: 30, fontSize: 30, color: '#e0463a', filter: 'drop-shadow(0 0 10px rgba(224,70,58,.5))' }}><FaFire /></span>
      <span style={{ ...C, top: 150, right: '14%', fontSize: 24, color: '#e0b64a' }}><FaMedal /></span>
    </>
  );
}

function DecorFete() {
  const fanions = ['#dc8d32', '#3d1e7b', '#4db6ac', '#e0463f'];
  return (
    <>
      <Encart icon={<FaBirthdayCake />} text="FÊTE DU CLUB" />
      <Filigrane icon={<FaBirthdayCake />} color="#dc8d32" opacity={0.16} size={118} />
      {/* Fanions triangulaires en haut */}
      <div style={{ ...C, top: 8, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', padding: '0 16px' }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} style={{ width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderTop: `19px solid ${fanions[i % 4]}` }} />
        ))}
      </div>
      {/* Deux ballons (baudruches + ficelle) */}
      <div style={{ ...C, top: 70, left: '6%', animation: 'fly 5s ease-in-out infinite' }}>
        <span style={{ display: 'block', width: 34, height: 42, borderRadius: '50%', background: '#e0463f', boxShadow: 'inset -6px -6px 0 rgba(0,0,0,.12)' }} />
        <span style={{ display: 'block', width: 2, height: 38, background: 'rgba(255,255,255,.35)', margin: '0 auto' }} />
      </div>
      <div style={{ ...C, top: 90, right: '7%', animation: 'fly 5s ease-in-out infinite 2.5s' }}>
        <span style={{ display: 'block', width: 32, height: 40, borderRadius: '50%', background: '#3d1e7b', boxShadow: 'inset -6px -6px 0 rgba(0,0,0,.15)' }} />
        <span style={{ display: 'block', width: 2, height: 38, background: 'rgba(255,255,255,.35)', margin: '0 auto' }} />
      </div>
      <span style={{ ...C, bottom: 18, left: 28, fontSize: 34, color: '#dc8d32', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.45))' }}><FaBirthdayCake /></span>
      <span style={{ ...C, bottom: 22, right: 30, fontSize: 28, color: '#e0463f' }}><FaBasketballBall /></span>
      <span style={{ ...C, top: 152, left: '20%', fontSize: 20, color: '#4db6ac', animation: 'fly 4s ease-in-out infinite' }}><FaMusic /></span>
    </>
  );
}

const DECOR: Record<ThemeKey, () => JSX.Element> = {
  noel: DecorNoel, nouvelan: DecorNouvelan, paques: DecorPaques, halloween: DecorHalloween,
  rentree: DecorRentree, ete: DecorEte, playoffs: DecorPlayoffs, fete: DecorFete,
};

// --- Moteur de particules (canvas 2D, repris tel quel du prototype) ---------

type Particle = any;

function makeParticle(mode: string, colors: string[], W: number, H: number): Particle {
  const c = colors[(Math.random() * colors.length) | 0];
  if (mode === 'snow') return { x: Math.random() * W, y: Math.random() * H, r: 1 + Math.random() * 2.4, vy: 0.4 + Math.random() * 0.9, vx: -0.3 + Math.random() * 0.6, d: Math.random() * 6.28, c };
  if (mode === 'confetti') return { x: Math.random() * W, y: Math.random() * H, w: 5 + Math.random() * 5, h: 3 + Math.random() * 4, vy: 0.9 + Math.random() * 1.3, vx: -0.5 + Math.random(), rot: Math.random() * 6.28, vr: -0.12 + Math.random() * 0.24, c };
  if (mode === 'petals') return { x: Math.random() * W, y: Math.random() * H, r: 2.6 + Math.random() * 3, vy: 0.3 + Math.random() * 0.55, d: Math.random() * 6.28, ds: 0.012 + Math.random() * 0.02, c };
  if (mode === 'rise') return { x: Math.random() * W, y: Math.random() * H, r: 8 + Math.random() * 16, vy: -(0.15 + Math.random() * 0.4), a: 0.05 + Math.random() * 0.13, c };
  if (mode === 'sparkle') return { x: Math.random() * W, y: Math.random() * H, r: 0.8 + Math.random() * 1.8, p: Math.random() * 6.28, sp: 0.02 + Math.random() * 0.05, c };
  return { x: 0, y: 0, c };
}

export default function SeasonalDecor({ theme, animations }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shown, setShown] = useState(false);

  // Fondu d'apparition (300 ms) une fois le thème résolu → pas de « flash ».
  useEffect(() => {
    if (!theme) { setShown(false); return; }
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [theme]);

  // Boucle de particules : redémarrée quand le thème ou l'état animations change.
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || !theme || !animations) return;
    const decor = THEME_DECOR[theme];
    const mode = decor.particle;
    const colors = decor.pColors.length ? decor.pColors : ['#ffffff'];
    const mobile = window.innerWidth <= 768;
    const count = Math.round(decor.density * (mobile ? 0.6 : 1)); // ~40 % de moins sur mobile
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, raf = 0;
    let particles: Particle[] = [];

    const resize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
    const spawn = () => { particles = Array.from({ length: count }, () => makeParticle(mode, colors, W, H)); };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, W, H);
      if (document.hidden) return;
      for (const p of particles) {
        if (mode === 'snow') { p.d += 0.01; p.y += p.vy; p.x += p.vx + Math.sin(p.d) * 0.3; if (p.y > H + 4) { p.y = -4; p.x = Math.random() * W; } ctx.globalAlpha = 0.85; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill(); }
        else if (mode === 'confetti') { p.y += p.vy; p.x += p.vx; p.rot += p.vr; if (p.y > H + 6) { p.y = -6; p.x = Math.random() * W; } ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = 0.9; ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); }
        else if (mode === 'petals') { p.d += p.ds; p.y += p.vy; p.x += Math.sin(p.d) * 0.6; if (p.y > H + 6) { p.y = -6; p.x = Math.random() * W; } ctx.globalAlpha = 0.8; ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, p.d, 0, 6.28); ctx.fill(); }
        else if (mode === 'rise') { p.y += p.vy; if (p.y < -24) { p.y = H + 24; p.x = Math.random() * W; } ctx.globalAlpha = p.a; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill(); }
        else if (mode === 'sparkle') { p.p += p.sp; const a = (Math.sin(p.p) + 1) / 2; ctx.globalAlpha = a * 0.9; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + a * 0.8, 0, 6.28); ctx.fill(); if (a > 0.86) { ctx.globalAlpha = a * 0.28; ctx.beginPath(); ctx.arc(p.x, p.y, (p.r + 1) * 3, 0, 6.28); ctx.fill(); } }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    spawn();
    raf = requestAnimationFrame(tick);
    const onResize = () => { resize(); spawn(); };
    // Couper la boucle rAF quand l'onglet est masqué, relancer au retour.
    const onVis = () => {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [theme, animations]);

  if (!theme) return null;
  const Decor = DECOR[theme];

  return (
    <div
      aria-hidden="true"
      className={`seasonal-decor${animations ? '' : ' seasonal-decor--static'}`}
      style={{ opacity: shown ? 1 : 0, transition: 'opacity 300ms ease' }}
    >
      <Decor />
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    </div>
  );
}
