// ═══════════════════════════════════════════════════════════════════════════════
// APP SIRH BOYS - Plateforme RH Opérationnelle (OPTIMISÉ)
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/sections/Dashboard';
import { AdminRH } from '@/sections/AdminRH';
import { TempsActivites } from '@/sections/TempsActivites';
import { Competences } from '@/sections/Competences';
import { Recrutement } from '@/sections/Recrutement';
import { PrePaie } from '@/sections/PrePaie';
import { SWOT } from '@/sections/SWOT';
import { PESTEL } from '@/sections/PESTEL';
import { BSC } from '@/sections/BSC';
import { Risk } from '@/sections/Risk';
import './App.css';

// ═══ SPLASH SCREEN COMPONENT (OPTIMISÉ) ═══
const SplashScreen = memo(function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 500);
          }, 300);
          return 100;
        }
        return p + 4; // Incrément plus rapide
      });
    }, 25);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] bg-[#0B1121] flex flex-col items-center justify-center transition-all duration-500",
        progress >= 100 && "opacity-0 scale-105"
      )}
    >
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-wider">
          {'SIRH BOYS'.split('').map((char, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                animation: `fadeInUp 0.3s ease ${i * 50}ms both`,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
        <p className="text-center text-blue-400/60 mt-4 text-sm tracking-widest uppercase">
          SonicShelf Strategic HR
        </p>
      </div>

      <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-slate-500 text-xs mt-2">{progress}%</p>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
});

// ═══ CUSTOM CURSOR (OPTIMISÉ AVEC THROTTLE) ═══
const CustomCursor = memo(function CustomCursor() {
  const positionRef = useRef({ x: 0, y: 0 });
  const ringPositionRef = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [, forceUpdate] = useState({});
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    // Throttle à 60fps max
    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };

      const now = performance.now();
      if (now - lastUpdateRef.current > 16) { // ~60fps
        lastUpdateRef.current = now;
        forceUpdate({});
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Animation du ring avec RAF optimisé
    const animate = () => {
      ringPositionRef.current = {
        x: ringPositionRef.current.x + (positionRef.current.x - ringPositionRef.current.x) * 0.12,
        y: ringPositionRef.current.y + (positionRef.current.y - ringPositionRef.current.y) * 0.12,
      };
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Détection des éléments interactifs avec delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, input, [role="button"], select, textarea')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, input, [role="button"], select, textarea')) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Désactiver sur mobile
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div
        className="fixed w-2.5 h-2.5 bg-blue-400 rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={{
          left: positionRef.current.x,
          top: positionRef.current.y,
          transform: 'translate(-50%, -50%)'
        }}
      />
      <div
        className={cn(
          "fixed rounded-full pointer-events-none z-[9998] border border-blue-400/50 will-change-transform transition-all duration-200",
          isHovering ? "w-14 h-14" : "w-9 h-9"
        )}
        style={{
          left: ringPositionRef.current.x,
          top: ringPositionRef.current.y,
          transform: 'translate(-50%, -50%)'
        }}
      />
    </>
  );
});

// ═══ SCROLL PROGRESS (OPTIMISÉ AVEC THROTTLE) ═══
const ScrollProgress = memo(function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = performance.now();
      if (now - lastScrollRef.current < 50) return; // Throttle 50ms
      lastScrollRef.current = now;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-[60] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 will-change-transform"
        style={{ width: `${progress}%`, transform: 'translateZ(0)' }}
      />
    </div>
  );
});

// ═══ AMBIENT ORBS (OPTIMISÉ AVEC GPU) ═══
const AmbientOrbs = memo(function AmbientOrbs() {
  return (
    <>
      <div
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 will-change-transform"
        style={{
          background: 'rgba(59, 130, 246, 0.12)',
          filter: 'blur(80px)',
          top: '-150px',
          right: '-100px',
          animation: 'float1 12s ease-in-out infinite alternate',
          transform: 'translateZ(0)',
        }}
      />
      <div
        className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0 will-change-transform"
        style={{
          background: 'rgba(96, 165, 250, 0.06)',
          filter: 'blur(80px)',
          bottom: '-100px',
          left: '-100px',
          animation: 'float2 14s ease-in-out infinite alternate',
          transform: 'translateZ(0)',
        }}
      />
    </>
  );
});

// ═══ MAIN APP ═══
function App() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [presentationMode, setPresentationMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Memoize section renderer pour éviter les re-rendus
  const renderSection = useCallback(() => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard />;
      case 'admin-rh': return <AdminRH />;
      case 'temps': return <TempsActivites />;
      case 'competences': return <Competences />;
      case 'recrutement': return <Recrutement />;
      case 'prepaie': return <PrePaie />;
      case 'swot': return <SWOT />;
      case 'pestel': return <PESTEL />;
      case 'bsc': return <BSC />;
      case 'risk': return <Risk />;
      default: return <Dashboard />;
    }
  }, [activeSection]);

  // Memoize handlers
  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  const handleTogglePresentation = useCallback(() => {
    setPresentationMode(prev => {
      const newMode = !prev;
      setSidebarCollapsed(newMode);
      return newMode;
    });
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <SplashScreen onComplete={handleLoadingComplete} />}

      {!loading && (
        <div className={cn(
          "min-h-screen bg-[#0B1121] text-slate-300",
          presentationMode && "text-lg"
        )}>
          {/* Effects - rendus une seule fois */}
          <CustomCursor />
          <ScrollProgress />
          <AmbientOrbs />

          {/* Noise texture overlay - optimisé */}
          <div
            className="fixed inset-0 pointer-events-none z-[1] opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Layout */}
          <Sidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            collapsed={sidebarCollapsed}
          />

          <div className={cn(
            "transition-all duration-200 ease-out",
            sidebarCollapsed ? "ml-16" : "ml-64"
          )}>
            <Header
              activeSection={activeSection}
              presentationMode={presentationMode}
              onTogglePresentation={handleTogglePresentation}
              collapsed={sidebarCollapsed}
            />

            <main className={cn(
              "pt-16 p-6 md:p-8 relative z-10",
              presentationMode && "p-10"
            )}>
              <div className="max-w-7xl mx-auto">
                {renderSection()}
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
