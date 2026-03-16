// ═══════════════════════════════════════════════════════════════════════
// LANDING PAGE — SIRH BOYS
// Boot → Hero → Vision → Cas → Piliers → Modules → Stack → Synthèse → CTA
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

function useInView(ref: React.RefObject<Element | null>, threshold = 0.1) {
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
          timers.push(setTimeout(() => { setFading(true); setTimeout(onDone, 520); }, 450));
        }
      }, line.delay + 120));
    });
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className={cn(
      'fixed inset-0 z-[200] flex items-center justify-center transition-all duration-500',
      fading ? 'opacity-0 scale-[1.012] pointer-events-none' : 'opacity-100',
      'bg-[#020810]',
    )}>
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <div className="w-full max-w-lg px-6 sm:px-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500/50" /><div className="w-3 h-3 rounded-full bg-yellow-500/50" /><div className="w-3 h-3 rounded-full bg-green-500/50" />
          <span className="font-mono text-slate-700 text-xs ml-3 tracking-wider">sirh-boys — bash</span>
        </div>
        <div className="space-y-[9px]">
          {BOOT_LINES.map((line, i) => (
            <div key={i} className={cn('font-mono text-[13px] leading-relaxed transition-all duration-300', shown.has(i) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3', line.highlight ? 'text-blue-400 font-semibold' : 'text-slate-400')}>
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
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.18) 1px, transparent 1px)', backgroundSize: '38px 38px' }} />
      <div className="absolute left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.4) 40%, rgba(96,165,250,0.5) 50%, rgba(59,130,246,0.4) 60%, transparent 100%)', animation: 'lp-scan 7s linear infinite' }} />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px]" style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.065) 0%, transparent 70%)' }} />
      <div className="absolute top-5 left-5 w-8 h-8 border-l-2 border-t-2 border-blue-500/10" />
      <div className="absolute top-5 right-5 w-8 h-8 border-r-2 border-t-2 border-blue-500/10" />
      <div className="absolute bottom-5 left-5 w-8 h-8 border-l-2 border-b-2 border-blue-500/10" />
      <div className="absolute bottom-5 right-5 w-8 h-8 border-r-2 border-b-2 border-blue-500/10" />
    </div>
  );
});

// ─── METRIC CARD ───────────────────────────────────────────────────────────

const MetricCard = memo(function MetricCard({ label, value, sub, delay, visible }: { label: string; value: string; sub: string; delay: number; visible: boolean }) {
  return (
    <div className={cn('border-l-2 border-blue-500/25 pl-3 sm:pl-4 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')} style={{ transitionDelay: `${delay}ms` }}>
      <div className="text-[9px] sm:text-[10px] font-mono text-blue-400/45 tracking-[0.3em] uppercase mb-0.5">{label}</div>
      <div className="text-xl sm:text-[1.6rem] font-black text-white font-mono tracking-tight leading-none">{value}</div>
      <div className="text-[10px] sm:text-[11px] text-slate-700 font-mono mt-1">{sub}</div>
    </div>
  );
});

// ─── SECTION LABEL ─────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px w-8 sm:w-10 bg-blue-500/45" />
      <span className="font-mono text-[10px] sm:text-[11px] text-blue-400/55 tracking-[0.35em] uppercase">{text}</span>
    </div>
  );
}

// ─── MODULES LIST ──────────────────────────────────────────────────────────

const MODULES = [
  {
    label: 'Dashboard',
    icon: '⬡',
    desc: 'Vue centrale',
    detail: "KPIs en temps réel : burn rate, runway, effectif, alertes actives. Toutes les données RH convergent ici pour une lecture immédiate de la santé de l'organisation.",
  },
  {
    label: 'Admin RH',
    icon: '◎',
    desc: 'Gestion des effectifs',
    detail: 'Fiches collaborateurs complètes (contrat, poste, pôle, salaire), suivi des statuts (actif, congé, sorti), signature de contrat et calcul automatique du coût total chargé.',
  },
  {
    label: 'Temps & Activités',
    icon: '◷',
    desc: 'Absences & présence',
    detail: "Demandes de congés (CP, RTT, maladie, sans solde, formation), workflow de validation avec alertes key person risk si un pôle dépasse 30 % d'absences simultanées.",
  },
  {
    label: 'Compétences',
    icon: '◈',
    desc: 'Skills matrix',
    detail: 'Cartographie des compétences par collaborateur et par pôle. Identification des gaps, visualisation des niveaux de maîtrise et planification des besoins en formation.',
  },
  {
    label: 'Recrutement',
    icon: '◉',
    desc: 'Pipeline candidats',
    detail: "Gestion des postes ouverts (priorité, budget, pôle), suivi des candidats de la candidature à l'offre. Intégration à l'onboarding dès la signature.",
  },
  {
    label: 'Pré-Paie',
    icon: '◇',
    desc: 'Variables & export',
    detail: 'Saisie et validation des variables mensuelles (primes, heures sup., avantages, absences). Export JSON prêt à transmettre au cabinet comptable, avec total brut + charges.',
  },
  {
    label: 'SWOT',
    icon: '◫',
    desc: 'Forces & faiblesses',
    detail: 'Matrice SWOT dynamique appliquée à la fonction RH : forces internes (rétention, compétences), faiblesses (dépendances), opportunités de marché, menaces (concurrence talents).',
  },
  {
    label: 'PESTEL',
    icon: '◻',
    desc: 'Environnement macro',
    detail: 'Analyse des facteurs Politiques, Économiques, Sociaux, Technologiques, Environnementaux et Légaux qui impactent la stratégie RH de SonicShelf à moyen terme.',
  },
  {
    label: 'Balanced Scorecard',
    icon: '◈',
    desc: 'Objectifs stratégiques',
    detail: '4 perspectives interconnectées : Finance (maîtrise du burn rate), Client (satisfaction interne), Processus (efficacité opérationnelle), Innovation (développement des talents).',
  },
  {
    label: 'Gestion des Risques',
    icon: '⬟',
    desc: 'Key person risk',
    detail: 'Cartographie des risques RH critiques : dépendance à des profils clés, concentration des compétences, alertes automatiques sur les absences à fort impact opérationnel.',
  },
];

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────

interface LandingPageProps { onEnter: () => void; }

export function LandingPage({ onEnter }: LandingPageProps) {
  const [booted, setBooted]       = useState(false);
  const [heroIn, setHeroIn]       = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const visionRef   = useRef<HTMLDivElement>(null);
  const caseRef     = useRef<HTMLDivElement>(null);
  const pilaRef     = useRef<HTMLDivElement>(null);
  const modulesRef  = useRef<HTMLDivElement>(null);
  const stackRef    = useRef<HTMLDivElement>(null);
  const syntheseRef = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);

  const visionInView   = useInView(visionRef   as React.RefObject<Element>);
  const caseInView     = useInView(caseRef     as React.RefObject<Element>);
  const pilaInView     = useInView(pilaRef     as React.RefObject<Element>);
  const modulesInView  = useInView(modulesRef  as React.RefObject<Element>);
  const stackInView    = useInView(stackRef    as React.RefObject<Element>);
  const syntheseInView = useInView(syntheseRef as React.RefObject<Element>);
  const ctaInView      = useInView(ctaRef      as React.RefObject<Element>, 0.3);

  const employees = useCountUp(8,     1100, heroIn);
  const burnRate  = useCountUp(47580, 1700, heroIn);
  const runway    = useCountUp(14,    900,  heroIn);

  useEffect(() => { if (booted) requestAnimationFrame(() => setHeroIn(true)); }, [booted]);

  const handleEnter = useCallback(() => { setIsExiting(true); setTimeout(onEnter, 680); }, [onEnter]);

  const px = 'px-5 sm:px-8 md:px-14 lg:px-20 xl:px-28';

  const reveal = (inView: boolean, delay = 0) => cn(
    'transition-all duration-700',
    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
  ) + (delay ? ` style` : ''); // helper for class

  void reveal; // used inline below

  return (
    <>
      <BootTerminal onDone={() => setBooted(true)} />

      {booted && (
        <div className={cn('min-h-screen bg-[#020810] text-white overflow-x-hidden transition-all duration-700', isExiting ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100')}>
          <GridBg />

          {/* ════ HERO ════ */}
          <section className={cn('relative min-h-screen flex flex-col', px, 'pt-6 pb-10')}>
            <div className={cn('flex items-center justify-between py-4 mb-4 transition-all duration-700 delay-100', heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3')}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="font-mono text-blue-400/65 text-[11px] tracking-[0.35em] uppercase">Sirh Boys</span>
              </div>
              <span className="font-mono text-slate-700 text-[10px] sm:text-[11px] tracking-widest hidden sm:block">SonicShelf Strategic HR — v2.0</span>
            </div>

            <div className="flex-1 flex flex-col justify-center py-8">
              <div className={cn('flex items-center gap-3 mb-6 transition-all duration-700 delay-150', heroIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6')}>
                <div className="h-px w-8 sm:w-10 bg-blue-500/45" />
                <span className="font-mono text-[10px] sm:text-[11px] text-blue-400/55 tracking-[0.3em] sm:tracking-[0.35em] uppercase">Plateforme RH Opérationnelle</span>
              </div>

              <h1 className="landing-headline overflow-hidden">
                <span className={cn('block font-black leading-[0.88] tracking-[-0.03em] text-white text-[clamp(3rem,14vw,9rem)] transition-all duration-700 delay-200', heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}>SIRH</span>
                <span className={cn('block font-black leading-[0.88] tracking-[-0.03em] text-[clamp(3rem,14vw,9rem)] transition-all duration-700 delay-[320ms]', heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')} style={{ WebkitTextStroke: '1.5px rgba(59,130,246,0.45)', color: 'transparent', textShadow: '0 0 80px rgba(59,130,246,0.15)' }}>BOYS</span>
              </h1>

              <p className={cn('mt-6 sm:mt-8 text-slate-400 text-sm sm:text-base md:text-[1.05rem] max-w-sm sm:max-w-md leading-[1.7] transition-all duration-700 delay-[420ms]', heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}>
                Pilotez vos ressources humaines avec la précision d'un quant.{' '}
                <span className="text-slate-600">Burn rate, runway, compétences — tout en temps réel.</span>
              </p>

              <div className={cn('mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-5 transition-all duration-700 delay-500', heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}>
                <button onClick={handleEnter} className="group relative px-6 sm:px-7 py-3 sm:py-3.5 bg-blue-600 text-white text-[11px] font-mono tracking-[0.22em] uppercase overflow-hidden hover:bg-blue-500 active:scale-[0.98] transition-all duration-300" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
                  <span className="relative z-10">Accéder à la plateforme →</span>
                  <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-[-18deg]" />
                </button>
                <span className="text-slate-700 text-[11px] font-mono tracking-wider">10 modules actifs</span>
              </div>
            </div>

            <div className={cn('transition-all duration-700 delay-[620ms]', heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
              <div className="h-px bg-gradient-to-r from-blue-500/18 via-blue-500/6 to-transparent mb-5 sm:mb-6" />
              <div className="flex flex-wrap gap-6 sm:gap-10">
                <MetricCard label="Effectif"  value={String(employees)}                       sub="salariés actifs"  delay={700}  visible={heroIn} />
                <MetricCard label="Burn Rate" value={`€${burnRate.toLocaleString('fr-FR')}`} sub="charges / mois"   delay={820}  visible={heroIn} />
                <MetricCard label="Runway"    value={`${runway} mois`}                        sub="sur seed levé"    delay={940}  visible={heroIn} />
                <MetricCard label="Modules"   value="10"                                       sub="interconnectés"   delay={1060} visible={heroIn} />
              </div>
            </div>
          </section>

          {/* ════ VISION ════ */}
          <section className={cn('relative py-24 sm:py-32 border-t border-slate-800/50', px)}>
            <div ref={visionRef} className={cn('transition-all duration-700', visionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
              <SectionLabel text="La vision" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Quote */}
              <div className={cn('transition-all duration-700 delay-100', visionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
                <blockquote className="landing-headline text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight text-white">
                  "Dans une startup, chaque euro de masse salariale est une décision stratégique."
                </blockquote>
                <div className="mt-8 flex items-center gap-3">
                  <div className="h-px w-8 bg-blue-500/40" />
                  <span className="font-mono text-[11px] text-blue-400/50 tracking-widest">SIRH BOYS — Manifeste</span>
                </div>
              </div>

              {/* Explanation */}
              <div className={cn('space-y-5 transition-all duration-700 delay-200', visionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
                <p className="text-slate-400 text-sm sm:text-base leading-[1.8]">
                  La masse salariale représente <span className="text-white font-medium">70 à 80 % du burn rate</span> d'une startup early-stage. Pourtant, la plupart des équipes naviguent encore avec des tableurs Excel fragmentés, sans vision consolidée de leur coût réel en temps réel.
                </p>
                <p className="text-slate-500 text-sm sm:text-base leading-[1.8]">
                  SIRH Boys est né d'un constat simple : les outils RH du marché sont soit trop lourds et coûteux pour une startup, soit trop limités pour piloter sérieusement une croissance rapide. Nous avons donc conçu une plateforme <span className="text-slate-300">from scratch</span>, pensée pour les équipes de 5 à 50 personnes.
                </p>
                <p className="text-slate-500 text-sm sm:text-base leading-[1.8]">
                  L'idée directrice : <span className="text-slate-300">connecter la RH à la finance</span>. Chaque salarié, chaque congé, chaque variable de paie se traduit immédiatement en impact sur le burn rate et le runway. La RH n'est plus un centre de coût isolé — c'est un levier stratégique intégré.
                </p>
              </div>
            </div>
          </section>

          {/* ════ ÉTUDE DE CAS ════ */}
          <section className={cn('relative py-24 sm:py-32 border-t border-slate-800/50', px)}>
            <div ref={caseRef} className={cn('mb-14 sm:mb-16 transition-all duration-700', caseInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
              <SectionLabel text="Étude de cas" />
              <h2 className="landing-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-none">
                <span className="text-white">SONICSHELF</span><br />
                <span className="text-slate-800">CASE STUDY</span>
              </h2>
              <p className="mt-6 text-slate-500 text-sm sm:text-base max-w-2xl leading-relaxed">
                SonicShelf est une startup française spécialisée dans la distribution et la monétisation de musique indépendante. Fondée sur une vision : permettre aux artistes indépendants d'accéder aux mêmes leviers de distribution que les majors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12 sm:mb-16">
              {[
                {
                  num: '01 — CONTEXTE',
                  title: "Une startup tech en phase d'accélération",
                  text: "8 collaborateurs répartis sur 5 pôles (Tech, Produit, Business, Support, Direction). Seed levé, produit en phase beta active, 3 postes en recrutement simultané. L'équipe est compétente mais la fonction RH n'est pas encore structurée.",
                },
                {
                  num: '02 — PROBLÉMATIQUE',
                  title: 'Piloter sans visibilité, décider sans données',
                  text: "Aucun suivi centralisé du burn rate salarial, pipeline de recrutement géré par email, compétences non cartographiées, exports pré-paie manuels chaque mois. La direction prend des décisions RH sans disposer d'une vue consolidée en temps réel.",
                },
                {
                  num: '03 — SOLUTION',
                  title: 'Un SIRH sur mesure, opérationnel dès le premier jour',
                  text: "SIRH Boys centralise RH opérationnel et intelligence stratégique dans une interface unique. Les données salariales calculent le burn rate automatiquement, les compétences s'affichent en matrice, et les analyses SWOT, PESTEL et BSC sont directement intégrées au SIRH.",
                },
              ].map((c, i) => (
                <div key={c.num} className={cn('border border-slate-800/80 p-6 sm:p-8 hover:border-blue-500/25 group transition-all duration-700', caseInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')} style={{ transitionDelay: caseInView ? `${i * 100}ms` : '0ms' }}>
                  <div className="font-mono text-[10px] text-blue-500/40 tracking-[0.35em] mb-4">{c.num}</div>
                  <div className="text-white font-bold text-base sm:text-lg mb-3 group-hover:text-blue-300 transition-colors">{c.title}</div>
                  <p className="text-slate-500 text-sm leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Results grid */}
            <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-px border border-slate-800/60 transition-all duration-700', caseInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')} style={{ transitionDelay: '350ms' }}>
              {[
                { value: '8',    label: 'Salariés gérés',       sub: 'sur 5 pôles' },
                { value: '10',   label: 'Modules actifs',        sub: 'interconnectés' },
                { value: '€47K', label: 'Burn rate piloté',      sub: 'en temps réel' },
                { value: '100%', label: 'RH centralisée',        sub: 'zéro tableur' },
              ].map(r => (
                <div key={r.label} className="bg-slate-900/30 p-5 sm:p-7 text-center hover:bg-blue-950/20 transition-colors group">
                  <div className="font-mono text-2xl sm:text-3xl font-black text-white group-hover:text-blue-400 transition-colors mb-1">{r.value}</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-medium">{r.label}</div>
                  <div className="text-[10px] font-mono text-slate-700 mt-0.5">{r.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ════ 3 PILIERS ════ */}
          <section className={cn('relative py-24 sm:py-32 border-t border-slate-800/50', px)}>
            <div ref={pilaRef} className={cn('mb-14 sm:mb-16 transition-all duration-700', pilaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
              <SectionLabel text="Architecture fonctionnelle" />
              <h2 className="landing-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-none">
                <span className="text-white">3 PILIERS</span><br />
                <span className="text-slate-800">INTÉGRÉS</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  num: '01',
                  title: 'Pilotage Financier RH',
                  tag: 'Finance & Contrôle',
                  color: 'border-blue-500/30 hover:border-blue-400/50',
                  items: [
                    'Burn rate calculé automatiquement (salaires bruts × coefficient 1.45 charges patronales)',
                    "Runway en temps réel dès qu'un salaire, une prime ou une variable est modifiée",
                    'Masse salariale annuelle consolidée par pôle et par type de contrat',
                    'Alertes automatiques : augmentation >€500/mois, prime >€500, départ impactant',
                  ],
                },
                {
                  num: '02',
                  title: 'Gestion RH Opérationnelle',
                  tag: 'Processus & Quotidien',
                  color: 'border-cyan-500/30 hover:border-cyan-400/50',
                  items: [
                    'Admin RH : fiches salariés complètes, statuts, contrats, onboarding en 6 étapes',
                    'Congés & absences : workflow complet de demande, validation et décompte (CP, RTT, maladie…)',
                    'Compétences : matrice skills par collaborateur avec niveaux et plans de développement',
                    'Recrutement : pipeline structuré du besoin au contrat + variables pré-paie mensuelles',
                  ],
                },
                {
                  num: '03',
                  title: 'Intelligence Stratégique',
                  tag: 'Stratégie & Analyse',
                  color: 'border-indigo-500/30 hover:border-indigo-400/50',
                  items: [
                    'SWOT RH : forces, faiblesses, opportunités, menaces liées au capital humain de SonicShelf',
                    'PESTEL : facteurs macro qui impactent la stratégie RH (régulations, tendances marché…)',
                    'Balanced Scorecard : 4 perspectives (Finance, Client interne, Process, Innovation/RH)',
                    "Risk management : key person risk, alertes 30%+ d'absences, cartographie des dépendances",
                  ],
                },
              ].map((p, i) => (
                <div key={p.num} className={cn('border p-6 sm:p-8 group transition-all duration-700', p.color, pilaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')} style={{ transitionDelay: pilaInView ? `${i * 120}ms` : '0ms' }}>
                  <div className="font-mono text-[10px] text-blue-500/40 tracking-[0.35em] mb-2">{p.num}</div>
                  <div className="inline-block font-mono text-[10px] text-blue-400/50 tracking-widest border border-blue-500/20 px-2 py-0.5 mb-5">{p.tag}</div>
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-5 leading-snug group-hover:text-blue-200 transition-colors">{p.title}</h3>
                  <ul className="space-y-3">
                    {p.items.map((item, j) => (
                      <li key={j} className="flex gap-3 text-sm text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
                        <span className="text-blue-500/40 mt-1 shrink-0">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ════ MODULES ════ */}
          <section className={cn('relative py-20 sm:py-28 border-t border-slate-800/50', px)}>
            <div ref={modulesRef} className={cn('mb-12 sm:mb-14 transition-all duration-700', modulesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
              <SectionLabel text="Modules" />
              <h2 className="landing-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-none">
                <span className="text-white">10 MODULES</span><br />
                <span className="text-slate-800">DÉTAILLÉS</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
              {MODULES.map((mod, i) => (
                <div key={mod.label} className={cn('group border border-slate-800/70 p-4 sm:p-5 hover:border-blue-500/35 hover:bg-blue-950/15 transition-all duration-500 cursor-default', modulesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')} style={{ transitionDelay: modulesInView ? `${i * 50}ms` : '0ms' }}>
                  <div className="text-lg sm:text-xl text-slate-700 group-hover:text-blue-400 transition-colors duration-300 mb-2 leading-none">{mod.icon}</div>
                  <div className="text-[12px] sm:text-[13px] font-bold text-slate-300 group-hover:text-white transition-colors mb-1 leading-snug">{mod.label}</div>
                  <div className="text-[10px] font-mono text-blue-500/40 mb-2 tracking-widest">{mod.desc}</div>
                  <p className="text-[11px] text-slate-700 group-hover:text-slate-500 transition-colors leading-relaxed">{mod.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ════ STACK TECHNIQUE ════ */}
          <section className={cn('relative py-20 sm:py-28 border-t border-slate-800/50', px)}>
            <div ref={stackRef} className={cn('mb-12 sm:mb-14 transition-all duration-700', stackInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
              <SectionLabel text="Stack technique" />
              <h2 className="landing-headline text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] leading-none">
                <span className="text-white">BUILT WITH</span><br />
                <span className="text-slate-800">PRECISION</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {[
                { name: 'React 19',       role: 'UI Framework',          note: 'Hooks optimisés, memo, RAF' },
                { name: 'TypeScript',     role: 'Typage statique',        note: 'Types stricts, interfaces métier' },
                { name: 'Vite 7',         role: 'Build tool',             note: 'HMR instantané, code splitting' },
                { name: 'Tailwind CSS',   role: 'Styling utility-first',  note: 'Thème dark personnalisé' },
                { name: 'Zustand + Immer','role': 'State management',     note: 'Mutations immuables réactives' },
                { name: 'Recharts',       role: 'Data visualization',     note: 'Charts KPI, radars, courbes' },
                { name: 'shadcn/ui',      role: '40+ composants UI',      note: 'Radix primitives accessibles' },
                { name: 'jsPDF + html2canvas', role: 'Export PDF natif',  note: 'Pré-paie & rapports' },
              ].map((s, i) => (
                <div key={s.name} className={cn('border border-slate-800/60 p-4 sm:p-5 hover:border-blue-500/25 group transition-all duration-600', stackInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')} style={{ transitionDelay: stackInView ? `${i * 60}ms` : '0ms' }}>
                  <div className="text-white font-bold text-sm mb-1 group-hover:text-blue-300 transition-colors">{s.name}</div>
                  <div className="text-[10px] font-mono text-blue-400/45 tracking-widest mb-2">{s.role}</div>
                  <div className="text-[11px] text-slate-700 group-hover:text-slate-500 transition-colors">{s.note}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ════ SYNTHÈSE ════ */}
          <section className={cn('relative py-24 sm:py-32 border-t border-slate-800/50', px)}>
            <div ref={syntheseRef} className={cn('mb-14 transition-all duration-700', syntheseInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
              <SectionLabel text="Synthèse du projet" />
              <h2 className="landing-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-none">
                <span className="text-white">BILAN &</span><br />
                <span className="text-slate-800">PERSPECTIVES</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-16">
              {/* Left: narrative */}
              <div className={cn('space-y-6 transition-all duration-700 delay-100', syntheseInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
                <p className="text-slate-300 text-sm sm:text-base leading-[1.85]">
                  SIRH Boys est une <span className="text-white font-medium">réponse concrète aux défis de la GRH en contexte startup</span>. À travers l'étude de cas SonicShelf, ce projet démontre comment une organisation de 8 collaborateurs peut structurer sa fonction RH de façon professionnelle, sans les contraintes et les coûts des ERPs traditionnels.
                </p>
                <p className="text-slate-500 text-sm sm:text-base leading-[1.85]">
                  La démarche s'articule autour de <span className="text-slate-300">trois enjeux majeurs</span> de la GRH moderne : l'enjeu financier (maîtriser le burn rate en liant chaque décision RH à son impact immédiat sur la trésorerie), l'enjeu opérationnel (structurer les processus essentiels dans un workflow cohérent et automatisé), et l'enjeu stratégique (intégrer les outils d'analyse directement dans le SIRH pour une vue 360°).
                </p>
                <p className="text-slate-500 text-sm sm:text-base leading-[1.85]">
                  Ce projet illustre la convergence entre <span className="text-slate-300">GRH moderne et transformation digitale</span> : la donnée RH n'est plus un stock statique, c'est un flux continu qui informe la stratégie en permanence. Le coefficient de charges patronales (×1.45), les alertes key person risk, les exports pré-paie automatisés — autant de mécanismes qui transforment des données brutes en intelligence décisionnelle.
                </p>
              </div>

              {/* Right: key learnings */}
              <div className={cn('transition-all duration-700 delay-200', syntheseInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
                <div className="font-mono text-[10px] text-blue-400/45 tracking-[0.35em] uppercase mb-6">Points clés du projet</div>
                <div className="space-y-4">
                  {[
                    { label: 'Interconnexion données–finance', text: "Toute modification salariale recalcule instantanément le burn rate, la masse salariale et le runway. La RH et la finance ne font plus qu'un." },
                    { label: 'Alertes intelligentes', text: 'Le système génère automatiquement des alertes contextuelles : absences critiques, augmentations impactantes, profils à risque de départ.' },
                    { label: 'SIRH + Stratégie = vision 360°', text: "L'intégration de SWOT, PESTEL et BSC dans un SIRH est rare sur le marché. Elle permet une prise de décision RH ancrée dans la réalité business." },
                    { label: 'Scalabilité startup', text: 'Architecture légère, sans backend ni base de données externe. Déployable en quelques minutes, adaptable à toute startup de 5 à 50 personnes.' },
                  ].map((item, i) => (
                    <div key={i} className="border-l-2 border-blue-500/20 pl-4 py-1">
                      <div className="text-white text-sm font-semibold mb-1">{item.label}</div>
                      <p className="text-slate-600 text-[13px] leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next steps */}
            <div className={cn('border border-slate-800/60 p-6 sm:p-8 transition-all duration-700 delay-300', syntheseInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
              <div className="font-mono text-[10px] text-blue-400/45 tracking-[0.35em] uppercase mb-5">Évolutions envisagées</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { icon: '◈', title: 'Éditeur de documents', text: 'Génération de contrats, lettres de mission et attestations depuis les fiches salariés (Fabric.js).' },
                  { icon: '◉', title: 'Authentification & rôles', text: 'Connexion Supabase avec gestion des droits par rôle (RH, manager, collaborateur).' },
                  { icon: '⬡', title: 'IA & recommandations', text: 'Analyse prédictive des risques de turnover et suggestions de recrutement basées sur les gaps de compétences.' },
                  { icon: '◇', title: 'Intégration comptable', text: 'Connexion directe avec les logiciels de paie (Silae, PayFit) pour automatiser les exports mensuels.' },
                ].map((e, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-blue-500/40 text-lg mt-0.5 shrink-0">{e.icon}</span>
                    <div>
                      <div className="text-slate-300 text-[13px] font-semibold mb-1">{e.title}</div>
                      <p className="text-slate-700 text-[12px] leading-relaxed">{e.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ════ FINAL CTA ════ */}
          <section ref={ctaRef} className={cn('relative py-28 sm:py-36 flex flex-col items-center text-center overflow-hidden border-t border-slate-800/50', px)}>
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[500px] sm:w-[700px] h-[350px] sm:h-[400px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)' }} />
            </div>

            <p className={cn('font-mono text-[10px] sm:text-[11px] text-slate-700 tracking-[0.45em] uppercase mb-10 sm:mb-12 transition-all duration-700', ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}>
              Prêt à piloter votre stratégie RH
            </p>

            <button onClick={handleEnter} className={cn('group relative font-black tracking-[-0.03em] text-[clamp(3rem,10vw,8rem)] text-white hover:text-blue-400 transition-all duration-700', ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12')} style={{ transitionDelay: '100ms' }}>
              <span className="landing-headline">ENTER →</span>
              <div className="absolute -bottom-2 left-0 h-[2px] w-0 bg-blue-400 group-hover:w-full transition-all duration-500" />
            </button>

            <p className={cn('font-mono text-[9px] sm:text-[10px] text-slate-800 tracking-[0.45em] uppercase mt-12 sm:mt-14 transition-all duration-700', ctaInView ? 'opacity-100' : 'opacity-0')} style={{ transitionDelay: '200ms' }}>
              SIRH BOYS // SONICSHELF // STRATEGIC HR
            </p>
          </section>

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
