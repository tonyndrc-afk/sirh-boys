// ═══════════════════════════════════════════════════════════════════════
// LANDING PAGE — SIRH BOYS
// Boot terminal → Hero cinématique → Modules grid → Enter CTA
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

function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
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
            setTimeout(onDone, 550);
          }, 450));
        }
      }, line.delay + 120));
    });
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className={cn(
      'fixed inset-0 z-[200] flex items-center justify-center transition-all duration-550',
      fading ? 'opacity-0 scale-[1.015] pointer-events-none' : 'opacity-100 scale-100',
      'bg-[#020810]',
    )}>
      {/* Subtle noise */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      <div className="w-full max-w-lg px-8">
        {/* Fake window chrome */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
          <span className="font-mono text-slate-700 text-xs ml-3 tracking-wider">sirh-boys — bash</span>
        </div>

        {/* Lines */}
        <div className="space-y-[9px]">
          {BOOT_LINES.map((line, i) => (
            <div
              key={i}
              className={cn(
                'font-mono text-[13px] leading-relaxed transition-all duration-350',
                shown.has(i) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3',
                line.highlight ? 'text-blue-400 font-semibold' : 'text-slate-400',
              )}
            >
              {line.text}
            </div>
          ))}
          {/* Blinking cursor */}
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
      {/* Dot grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.22) 1px, transparent 1px)',
        backgroundSize: '38px 38px',
      }} />

      {/* Animated scan line */}
      <div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.45) 40%, rgba(96,165,250,0.5) 50%, rgba(59,130,246,0.45) 60%, transparent 100%)',
          animation: 'lp-scan 7s linear infinite',
        }}
      />

      {/* Top glow */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
        style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
      />
      {/* Bottom right glow */}
      <div
        className="absolute -bottom-40 -right-20 w-[700px] h-[500px]"
        style={{ background: 'radial-gradient(ellipse, rgba(96,165,250,0.04) 0%, transparent 70%)' }}
      />

      {/* Corner brackets */}
      <div className="absolute top-5 left-5 w-8 h-8 border-l-2 border-t-2 border-blue-500/12" />
      <div className="absolute top-5 right-5 w-8 h-8 border-r-2 border-t-2 border-blue-500/12" />
      <div className="absolute bottom-5 left-5 w-8 h-8 border-l-2 border-b-2 border-blue-500/12" />
      <div className="absolute bottom-5 right-5 w-8 h-8 border-r-2 border-b-2 border-blue-500/12" />
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
    <div
      className={cn(
        'border-l-2 border-blue-500/25 pl-4 transition-all duration-700',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-[10px] font-mono text-blue-400/45 tracking-[0.3em] uppercase mb-0.5">{label}</div>
      <div className="text-[1.6rem] font-black text-white font-mono tracking-tight leading-none">{value}</div>
      <div className="text-[11px] text-slate-700 font-mono mt-1">{sub}</div>
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
  const [booted, setBooted] = useState(false);
  const [heroIn, setHeroIn] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const modulesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const modulesInView = useInView(modulesRef as React.RefObject<Element>);
  const ctaInView = useInView(ctaRef as React.RefObject<Element>, 0.3);

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

  return (
    <>
      {/* ── Boot terminal ── */}
      <BootTerminal onDone={() => setBooted(true)} />

      {/* ── Main landing ── */}
      {booted && (
        <div
          className={cn(
            'min-h-screen bg-[#020810] text-white overflow-x-hidden',
            'transition-all duration-700',
            isExiting ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100 scale-100',
          )}
        >
          <GridBg />

          {/* ════ HERO ════ */}
          <section className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32">
            {/* Top bar */}
            <div className={cn(
              'absolute top-8 inset-x-0 px-8 md:px-16 lg:px-24 xl:px-32',
              'flex items-center justify-between',
              'transition-all duration-700 delay-100',
              heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3',
            )}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="font-mono text-blue-400/65 text-[11px] tracking-[0.35em] uppercase">Sirh Boys</span>
              </div>
              <span className="font-mono text-slate-700 text-[11px] tracking-widest hidden md:block">
                SonicShelf Strategic HR — v2.0
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 pt-20">
              {/* Eyebrow */}
              <div className={cn(
                'flex items-center gap-3 mb-7 transition-all duration-700 delay-150',
                heroIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6',
              )}>
                <div className="h-px w-10 bg-blue-500/45" />
                <span className="font-mono text-[11px] text-blue-400/55 tracking-[0.35em] uppercase">
                  Plateforme RH Opérationnelle
                </span>
              </div>

              {/* Giant headline */}
              <h1 className="landing-headline">
                <span className={cn(
                  'block text-[clamp(3rem,11vw,10.5rem)] font-black leading-[0.88] tracking-[-0.03em] text-white',
                  'transition-all duration-700 delay-200',
                  heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                )}>
                  INTELLIGENCE
                </span>
                <span
                  className={cn(
                    'block text-[clamp(3rem,11vw,10.5rem)] font-black leading-[0.88] tracking-[-0.03em]',
                    'transition-all duration-700 delay-[320ms]',
                    heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                  )}
                  style={{
                    WebkitTextStroke: '1.5px rgba(59,130,246,0.4)',
                    color: 'transparent',
                    textShadow: '0 0 100px rgba(59,130,246,0.12)',
                  }}
                >
                  STRATÉGIQUE
                </span>
              </h1>

              {/* Subtitle */}
              <p className={cn(
                'mt-8 text-slate-400 text-base md:text-[1.05rem] max-w-md leading-[1.65]',
                'transition-all duration-700 delay-[420ms]',
                heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
              )}>
                Pilotez vos ressources humaines avec la précision d'un quant.{' '}
                <span className="text-slate-600">Burn rate, runway, compétences — tout en temps réel.</span>
              </p>

              {/* CTA */}
              <div className={cn(
                'mt-10 flex items-center gap-5 flex-wrap',
                'transition-all duration-700 delay-500',
                heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
              )}>
                <button
                  onClick={handleEnter}
                  className="group relative px-7 py-3.5 bg-blue-600 text-white text-[11px] font-mono tracking-[0.22em] uppercase overflow-hidden hover:bg-blue-500 active:scale-[0.98] transition-all duration-300"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                  }}
                >
                  <span className="relative z-10">Accéder à la plateforme →</span>
                  <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-[-18deg]" />
                </button>
                <span className="text-slate-700 text-[11px] font-mono tracking-wider">10 modules actifs</span>
              </div>
            </div>

            {/* Metrics strip */}
            <div className={cn(
              'absolute bottom-10 inset-x-0 px-8 md:px-16 lg:px-24 xl:px-32',
              'transition-all duration-700 delay-[620ms]',
              heroIn ? 'opacity-100' : 'opacity-0',
            )}>
              <div className="h-px bg-gradient-to-r from-blue-500/18 via-blue-500/7 to-transparent mb-6" />
              <div className="flex gap-10 flex-wrap">
                <MetricCard label="Effectif"   value={String(employees)}                            sub="salariés actifs"          delay={700} visible={heroIn} />
                <MetricCard label="Burn Rate"  value={`€${burnRate.toLocaleString('fr-FR')}`}     sub="charges / mois"           delay={820} visible={heroIn} />
                <MetricCard label="Runway"     value={`${runway} mois`}                            sub="sur seed levé"            delay={940} visible={heroIn} />
                <MetricCard label="Modules"    value="10"                                          sub="interconnectés"           delay={1060} visible={heroIn} />
              </div>
            </div>

            {/* Right scroll hint */}
            <div className={cn(
              'absolute right-8 md:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3',
              'transition-all duration-700 delay-700',
              heroIn ? 'opacity-100' : 'opacity-0',
            )}>
              <span className="font-mono text-[10px] text-slate-800 tracking-[0.35em] [writing-mode:vertical-lr]">SCROLL</span>
              <div className="w-px h-16 bg-gradient-to-b from-blue-500/25 to-transparent" />
            </div>
          </section>

          {/* ════ MODULES ════ */}
          <section className="relative py-28 px-8 md:px-16 lg:px-24 xl:px-32">
            {/* Header */}
            <div
              ref={modulesRef}
              className={cn(
                'mb-14 transition-all duration-700',
                modulesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              )}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-blue-500/45" />
                <span className="font-mono text-[11px] text-blue-400/55 tracking-[0.35em] uppercase">Modules</span>
              </div>
              <h2 className="landing-headline text-5xl md:text-7xl font-black tracking-[-0.03em] leading-none">
                <span className="text-white">10 MODULES</span>
                <br />
                <span className="text-slate-800">INTERCONNECTÉS</span>
              </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {MODULES.map((mod, i) => (
                <div
                  key={mod.label}
                  className={cn(
                    'group border border-slate-800/70 p-5',
                    'hover:border-blue-500/35 hover:bg-blue-950/15',
                    'transition-all duration-400 cursor-default',
                    modulesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                  )}
                  style={{ transitionDelay: modulesInView ? `${i * 55}ms` : '0ms' }}
                >
                  <div className="text-xl text-slate-700 group-hover:text-blue-400 transition-colors duration-300 mb-3 leading-none">
                    {mod.icon}
                  </div>
                  <div className="text-[13px] font-semibold text-slate-400 group-hover:text-white transition-colors duration-300 mb-1 leading-snug">
                    {mod.label}
                  </div>
                  <div className="text-[11px] font-mono text-slate-700 group-hover:text-slate-500 transition-colors duration-300 leading-snug">
                    {mod.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ════ FINAL CTA ════ */}
          <section
            ref={ctaRef}
            className="relative py-36 px-8 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
              <div
                className="w-[700px] h-[400px] rounded-full"
                style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.055) 0%, transparent 70%)' }}
              />
            </div>

            <p className={cn(
              'font-mono text-[11px] text-slate-700 tracking-[0.45em] uppercase mb-12',
              'transition-all duration-700',
              ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )}>
              Prêt à piloter votre stratégie RH
            </p>

            <button
              onClick={handleEnter}
              className={cn(
                'group relative font-black tracking-[-0.03em]',
                'text-[clamp(3.5rem,10vw,8.5rem)]',
                'text-white hover:text-blue-400',
                'transition-all duration-700',
                ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
              )}
              style={{ fontFamily: 'inherit', transitionDelay: '100ms' }}
            >
              <span className="landing-headline">ENTER →</span>
              <div className="absolute -bottom-2 left-0 h-[2px] w-0 bg-blue-400 group-hover:w-full transition-all duration-500" />
            </button>

            <p className={cn(
              'font-mono text-[10px] text-slate-800 tracking-[0.5em] uppercase mt-14',
              'transition-all duration-700',
              ctaInView ? 'opacity-100' : 'opacity-0',
            )}
              style={{ transitionDelay: '200ms' }}
            >
              SIRH BOYS // SONICSHELF // STRATEGIC HR
            </p>
          </section>

          {/* ── Keyframes + Font ── */}
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');

            .landing-headline {
              font-family: 'Syne', sans-serif !important;
            }

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
