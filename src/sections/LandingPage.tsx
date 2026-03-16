// ═══════════════════════════════════════════════════════════════════════
// LANDING PAGE — SIRH BOYS
// Boot terminal → Hero → Étude de cas → Modules → Enter CTA
// ═══════════════════════════════════════════════════════════════════════

import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { cn } from '@/lib/utils';

// ─── HOOKS ─────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1600, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return value;
}

function useInView(ref: React.RefObject<Element | null>, threshold = 0.12) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return inView;
}

// ─── BOOT SEQUENCE ─────────────────────────────────────────────────────────

const BOOT_LINES = [
  { text: '> SIRH BOYS v2.0 — DÉMARRAGE...', delay: 0 },
  { text: '> Chargement des modules RH... [██████████] 100%', delay: 280 },
  { text: '> Connexion à SonicShelf datastore... OK', delay: 540 },
  { text: '> 8 employés actifs détectés', delay: 760 },
  { text: '> Burn rate: €47 580 / mois', delay: 960 },
  { text: '> Runway: 14 mois', delay: 1120 },
  { text: '> SYSTÈME OPÉRATIONNEL ✓', delay: 1320, highlight: true },
];

const BootTerminal = memo(function BootTerminal({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState<Set<number>>(new Set());
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setShown(prev => new Set([...prev, i]));
        if (i === BOOT_LINES.length - 1) {
          timers.push(setTimeout(() => {
            setFading(true);
            setTimeout(onDone, 520);
          }, 450));
        }
      }, line.delay + 120));
    });
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className={cn(
      'fixed inset-0 z-[200] flex items-center justify-center transition-all duration-500',
      fading ? 'opacity-0 scale-[1.012] pointer-events-none' : 'opacity-100 scale-100',
      'bg-[#020810]',
    )}>
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      <div className="w-full max-w-lg px-6 sm:px-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
          <span className="font-mono text-slate-700 text-xs ml-3 tracking-wider">sirh-boys — bash</span>
        </div>
        <div className="space-y-[9px]">
          {BOOT_LINES.map((line, i) => (
            <div key={i} className={cn(
              'font-mono text-[13px] leading-relaxed transition-all duration-300',
              shown.has(i) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3',
              line.highlight ? 'text-blue-400 font-semibold' : 'text-slate-400',
            )}>
              {line.text}
            </div>
          ))}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-mono text-slate-500 text-[13px]">{'>'}</span>
            <div className="w-[7px] h-[14px] bg-blue-400/70 animate-[blink_1s_step-end_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
});

// ─── GRID BACKGROUND ───────────────────────────────────────────────────────

const GridBg = memo(function GridBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.2) 1px, transparent 1px)',
        backgroundSize: '38px 38px',
      }} />
      <div className="absolute left-0 right-0 h-[1px]" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.4) 40%, rgba(96,165,250,0.5) 50%, rgba(59,130,246,0.4) 60%, transparent 100%)',
        animation: 'lp-scan 7s linear infinite',
      }} />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
        style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)' }} />
      <div className="absolute top-5 left-5 w-8 h-8 border-l-2 border-t-2 border-blue-500/10" />
      <div className="absolute top-5 right-5 w-8 h-8 border-r-2 border-t-2 border-blue-500/10" />
      <div className="absolute bottom-5 left-5 w-8 h-8 border-l-2 border-b-2 border-blue-500/10" />
      <div className="absolute bottom-5 right-5 w-8 h-8 border-r-2 border-b-2 border-blue-500/10" />
    </div>
  );
});

// ─── METRIC CARD ───────────────────────────────────────────────────────────

const MetricCard = memo(function MetricCard({
  label, value, sub, delay, visible,
}: {
  label: string; value: string; sub: string; delay: number; visible: boolean;
}) {
  return (
    <div className={cn(
      'border-l-2 border-blue-500/25 pl-3 sm:pl-4 transition-all duration-700',
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
    )} style={{ transitionDelay: `${delay}ms` }}>
      <div className="text-[9px] sm:text-[10px] font-mono text-blue-400/45 tracking-[0.3em] uppercase mb-0.5">{label}</div>
      <div className="text-xl sm:text-[1.6rem] font-black text-white font-mono tracking-tight leading-none">{value}</div>
      <div className="text-[10px] sm:text-[11px] text-slate-700 font-mono mt-1">{sub}</div>
    </div>
  );
});

// ─── CASE STUDY CARD ───────────────────────────────────────────────────────

const CaseCard = memo(function CaseCard({
  num, title, text, delay, visible,
}: {
  num: string; title: string; text: string; delay: number; visible: boolean;
}) {
  return (
    <div className={cn(
      'border border-slate-800/80 p-6 sm:p-8 transition-all duration-700',
      'hover:border-blue-500/25 group',
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    )} style={{ transitionDelay: `${delay}ms` }}>
      <div className="font-mono text-[10px] text-blue-500/40 tracking-[0.35em] mb-4">{num}</div>
      <div className="text-white font-bold text-base sm:text-lg mb-3 group-hover:text-blue-300 transition-colors">{title}</div>
      <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
    </div>
  );
});

// ─── MODULES LIST ──────────────────────────────────────────────────────────

const MODULES = [
  { label: 'Dashboard',           icon: '⬡', desc: 'KPIs & alertes temps réel' },
  { label: 'Admin RH',            icon: '◎', desc: 'Salariés & contrats' },
  { label: 'Temps & Activités',   icon: '◷', desc: 'Congés & présence' },
  { label: 'Compétences',         icon: '◈', desc: 'Skills matrix' },
  { label: 'Recrutement',         icon: '◉', desc: 'Pipeline candidats' },
  { label: 'Pré-Paie',           icon: '◇', desc: 'Variables & export' },
  { label: 'SWOT',                icon: '◫', desc: 'Forces & faiblesses' },
  { label: 'PESTEL',              icon: '◻', desc: 'Facteurs externes' },
  { label: 'Balanced Scorecard',  icon: '◈', desc: 'Objectifs stratégiques' },
  { label: 'Gestion des Risques', icon: '⬟', desc: 'Key person risk' },
];

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const [booted, setBooted]   = useState(false);
  const [heroIn, setHeroIn]   = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const caseRef    = useRef<HTMLDivElement>(null);
  const modulesRef = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);

  const caseInView    = useInView(caseRef    as React.RefObject<Element>);
  const modulesInView = useInView(modulesRef as React.RefObject<Element>);
  const ctaInView     = useInView(ctaRef     as React.RefObject<Element>, 0.3);

  const employees = useCountUp(8,     1100, heroIn);
  const burnRate  = useCountUp(47580, 1700, heroIn);
  const runway    = useCountUp(14,    900,  heroIn);

  useEffect(() => {
    if (booted) requestAnimationFrame(() => setHeroIn(true));
  }, [booted]);

  const handleEnter = useCallback(() => {
    setIsExiting(true);
    setTimeout(onEnter, 680);
  }, [onEnter]);

  const px = 'px-5 sm:px-8 md:px-14 lg:px-20 xl:px-28';

  return (
    <>
      <BootTerminal onDone={() => setBooted(true)} />

      {booted && (
        <div className={cn(
          'min-h-screen bg-[#020810] text-white overflow-x-hidden',
          'transition-all duration-700',
          isExiting ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100',
        )}>
          <GridBg />

          {/* ════ HERO ════ */}
          <section className={cn(
            'relative min-h-screen flex flex-col',
            px, 'pt-6 pb-10',
          )}>
            {/* Nav bar */}
            <div className={cn(
              'flex items-center justify-between py-4 mb-4',
              'transition-all duration-700 delay-100',
              heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3',
            )}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="font-mono text-blue-400/65 text-[11px] tracking-[0.35em] uppercase">Sirh Boys</span>
              </div>
              <span className="font-mono text-slate-700 text-[10px] sm:text-[11px] tracking-widest hidden sm:block">
                SonicShelf Strategic HR — v2.0
              </span>
            </div>

            {/* Main content — flex-1 to push metrics down */}
            <div className="flex-1 flex flex-col justify-center py-8">
              {/* Eyebrow */}
              <div className={cn(
                'flex items-center gap-3 mb-6 transition-all duration-700 delay-150',
                heroIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6',
              )}>
                <div className="h-px w-8 sm:w-10 bg-blue-500/45" />
                <span className="font-mono text-[10px] sm:text-[11px] text-blue-400/55 tracking-[0.3em] sm:tracking-[0.35em] uppercase">
                  Plateforme RH Opérationnelle
                </span>
              </div>

              {/* Giant title: SIRH / BOYS */}
              <h1 className="landing-headline overflow-hidden">
                <span className={cn(
                  'block font-black leading-[0.88] tracking-[-0.03em] text-white',
                  'text-[clamp(3rem,14vw,9rem)]',
                  'transition-all duration-700 delay-200',
                  heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                )}>
                  SIRH
                </span>
                <span
                  className={cn(
                    'block font-black leading-[0.88] tracking-[-0.03em]',
                    'text-[clamp(3rem,14vw,9rem)]',
                    'transition-all duration-700 delay-[320ms]',
                    heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                  )}
                  style={{
                    WebkitTextStroke: '1.5px rgba(59,130,246,0.45)',
                    color: 'transparent',
                    textShadow: '0 0 80px rgba(59,130,246,0.15)',
                  }}
                >
                  BOYS
                </span>
              </h1>

              {/* Subtitle */}
              <p className={cn(
                'mt-6 sm:mt-8 text-slate-400 text-sm sm:text-base md:text-[1.05rem] max-w-sm sm:max-w-md leading-[1.7]',
                'transition-all duration-700 delay-[420ms]',
                heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
              )}>
                Pilotez vos ressources humaines avec la précision d'un quant.{' '}
                <span className="text-slate-600">Burn rate, runway, compétences — tout en temps réel.</span>
              </p>

              {/* CTA */}
              <div className={cn(
                'mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-5',
                'transition-all duration-700 delay-500',
                heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
              )}>
                <button
                  onClick={handleEnter}
                  className="group relative px-6 sm:px-7 py-3 sm:py-3.5 bg-blue-600 text-white text-[11px] font-mono tracking-[0.22em] uppercase overflow-hidden hover:bg-blue-500 active:scale-[0.98] transition-all duration-300"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                >
                  <span className="relative z-10">Accéder à la plateforme →</span>
                  <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-[-18deg]" />
                </button>
                <span className="text-slate-700 text-[11px] font-mono tracking-wider">10 modules actifs</span>
              </div>
            </div>

            {/* Metrics strip — en bas naturellement (pas absolute) */}
            <div className={cn(
              'transition-all duration-700 delay-[620ms]',
              heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
            )}>
              <div className="h-px bg-gradient-to-r from-blue-500/18 via-blue-500/6 to-transparent mb-5 sm:mb-6" />
              <div className="flex flex-wrap gap-6 sm:gap-10">
                <MetricCard label="Effectif"  value={String(employees)}                        sub="salariés actifs"  delay={700}  visible={heroIn} />
                <MetricCard label="Burn Rate" value={`€${burnRate.toLocaleString('fr-FR')}`}  sub="charges / mois"   delay={820}  visible={heroIn} />
                <MetricCard label="Runway"    value={`${runway} mois`}                         sub="sur seed levé"    delay={940}  visible={heroIn} />
                <MetricCard label="Modules"   value="10"                                        sub="interconnectés"   delay={1060} visible={heroIn} />
              </div>
            </div>
          </section>

          {/* ════ ÉTUDE DE CAS ════ */}
          <section className={cn('relative py-24 sm:py-32', px)}>
            {/* Header */}
            <div
              ref={caseRef}
              className={cn(
                'mb-14 sm:mb-16 transition-all duration-700',
                caseInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              )}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 sm:w-10 bg-blue-500/45" />
                <span className="font-mono text-[10px] sm:text-[11px] text-blue-400/55 tracking-[0.35em] uppercase">Étude de cas</span>
              </div>
              <h2 className="landing-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-none">
                <span className="text-white">CONSTRUIRE LE SIRH</span>
                <br />
                <span className="text-slate-800">DE DEMAIN</span>
              </h2>
              <p className="mt-6 text-slate-500 text-sm sm:text-base max-w-xl leading-relaxed">
                SonicShelf est une startup française spécialisée dans la distribution et la monétisation de musique indépendante.
                En pleine phase post-seed, elle devait piloter une équipe de 8 collaborateurs sans SIRH dédié.
              </p>
            </div>

            {/* 3 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12 sm:mb-16">
              <CaseCard
                num="01 — CONTEXTE"
                title="Une startup en croissance sans outillage RH"
                text="8 collaborateurs répartis sur 5 pôles (Tech, Produit, Business, Support, Direction), un seed levé, des recrutements en cours — et une gestion RH encore trop fragmentée entre tableurs et emails."
                delay={0}
                visible={caseInView}
              />
              <CaseCard
                num="02 — PROBLÉMATIQUE"
                title="Aucune visibilité sur le pilotage financier et humain"
                text="Pas de visibilité en temps réel sur le burn rate ni le runway. Les matrices de compétences étaient inexistantes, le pipeline de recrutement non structuré, et les exports de pré-paie réalisés manuellement chaque mois."
                delay={100}
                visible={caseInView}
              />
              <CaseCard
                num="03 — SOLUTION"
                title="Un SIRH sur mesure, pensé pour les startups tech"
                text="SIRH Boys centralise RH opérationnel et intelligence stratégique dans une seule interface. Les données salariales alimentent le burn rate en temps réel, les compétences s'affichent en matrice, et les analyses SWOT, PESTEL et BSC sont directement intégrées."
                delay={200}
                visible={caseInView}
              />
            </div>

            {/* Results strip */}
            <div className={cn(
              'grid grid-cols-2 sm:grid-cols-4 gap-px border border-slate-800/60',
              'transition-all duration-700',
              caseInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )} style={{ transitionDelay: '350ms' }}>
              {[
                { value: '8',      label: 'Salariés gérés',          sub: 'sur 5 pôles' },
                { value: '10',     label: 'Modules opérationnels',    sub: 'interconnectés' },
                { value: '€47K',   label: 'Burn rate piloté',         sub: 'en temps réel' },
                { value: '100%',   label: 'RH centralisée',           sub: 'zéro tableur' },
              ].map((r) => (
                <div key={r.label} className="bg-slate-900/30 p-5 sm:p-7 text-center hover:bg-blue-950/20 transition-colors group">
                  <div className="font-mono text-2xl sm:text-3xl font-black text-white group-hover:text-blue-400 transition-colors mb-1">{r.value}</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-medium">{r.label}</div>
                  <div className="text-[10px] font-mono text-slate-700 mt-0.5">{r.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ════ MODULES ════ */}
          <section className={cn('relative py-20 sm:py-28', px)}>
            <div
              ref={modulesRef}
              className={cn(
                'mb-12 sm:mb-14 transition-all duration-700',
                modulesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              )}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 sm:w-10 bg-blue-500/45" />
                <span className="font-mono text-[10px] sm:text-[11px] text-blue-400/55 tracking-[0.35em] uppercase">Modules</span>
              </div>
              <h2 className="landing-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-none">
                <span className="text-white">10 MODULES</span>
                <br />
                <span className="text-slate-800">INTERCONNECTÉS</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {MODULES.map((mod, i) => (
                <div
                  key={mod.label}
                  className={cn(
                    'group border border-slate-800/70 p-4 sm:p-5',
                    'hover:border-blue-500/35 hover:bg-blue-950/15',
                    'transition-all duration-400 cursor-default',
                    modulesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                  )}
                  style={{ transitionDelay: modulesInView ? `${i * 55}ms` : '0ms' }}
                >
                  <div className="text-lg sm:text-xl text-slate-700 group-hover:text-blue-400 transition-colors duration-300 mb-2 sm:mb-3 leading-none">
                    {mod.icon}
                  </div>
                  <div className="text-[12px] sm:text-[13px] font-semibold text-slate-400 group-hover:text-white transition-colors duration-300 mb-1 leading-snug">
                    {mod.label}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-slate-700 group-hover:text-slate-500 transition-colors duration-300 leading-snug">
                    {mod.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ════ FINAL CTA ════ */}
          <section
            ref={ctaRef}
            className={cn('relative py-28 sm:py-36 flex flex-col items-center text-center overflow-hidden', px)}
          >
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[500px] sm:w-[700px] h-[350px] sm:h-[400px] rounded-full"
                style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)' }} />
            </div>

            <p className={cn(
              'font-mono text-[10px] sm:text-[11px] text-slate-700 tracking-[0.45em] uppercase mb-10 sm:mb-12',
              'transition-all duration-700',
              ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )}>
              Prêt à piloter votre stratégie RH
            </p>

            <button
              onClick={handleEnter}
              className={cn(
                'group relative font-black tracking-[-0.03em]',
                'text-[clamp(3rem,10vw,8rem)]',
                'text-white hover:text-blue-400',
                'transition-all duration-700',
                ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
              )}
              style={{ transitionDelay: '100ms' }}
            >
              <span className="landing-headline">ENTER →</span>
              <div className="absolute -bottom-2 left-0 h-[2px] w-0 bg-blue-400 group-hover:w-full transition-all duration-500" />
            </button>

            <p className={cn(
              'font-mono text-[9px] sm:text-[10px] text-slate-800 tracking-[0.45em] uppercase mt-12 sm:mt-14',
              'transition-all duration-700',
              ctaInView ? 'opacity-100' : 'opacity-0',
            )} style={{ transitionDelay: '200ms' }}>
              SIRH BOYS // SONICSHELF // STRATEGIC HR
            </p>
          </section>

          {/* ── Keyframes + Font ── */}
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');
            .landing-headline { font-family: 'Syne', sans-serif !important; }
            @keyframes lp-scan {
              0%   { top: -1px;   opacity: 0;   }
              5%   {              opacity: 0.9; }
              95%  {              opacity: 0.4; }
              100% { top: 100vh; opacity: 0;   }
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
