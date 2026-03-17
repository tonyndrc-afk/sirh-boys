// ═══════════════════════════════════════════════════════════════════════════════
// KPI CARD - Carte de métrique avec animation
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: number;
  unit?: string;
  format?: 'number' | 'currency' | 'percent';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'default' | 'green' | 'red' | 'orange' | 'blue';
  className?: string;
}

export function KPICard({
  label,
  value,
  unit = '',
  format = 'number',
  trend,
  trendValue,
  color = 'default',
  className
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Animation du compteur
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500;
          const steps = 60;
          const increment = value / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setDisplayValue(value);
              clearInterval(timer);
            } else {
              setDisplayValue(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return val.toLocaleString('fr-FR');
      case 'percent':
        return val.toString();
      default:
        return val.toLocaleString('fr-FR');
    }
  };

  const colorClasses = {
    default: 'border-slate-700/50',
    green: 'border-emerald-500/30 bg-emerald-500/5',
    red: 'border-rose-500/30 bg-rose-500/5',
    orange: 'border-amber-500/30 bg-amber-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-500';

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative bg-slate-800/40 backdrop-blur-sm border rounded-xl p-5 overflow-hidden group hover:-translate-y-1 transition-all duration-300",
        colorClasses[color],
        className
      )}
    >
      {/* Ligne lumineuse top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-50" />

      {/* Label */}
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
        {label}
      </p>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        {format === 'currency' && (
          <span className="text-lg text-slate-400">€</span>
        )}
        <span className="text-2xl md:text-3xl font-semibold text-slate-100 font-mono">
          {formatValue(displayValue)}
        </span>
        {unit && (
          <span className="text-sm text-slate-500 ml-1">{unit}</span>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className={cn("flex items-center gap-1 mt-2 text-xs", trendColor)}>
          <TrendIcon className="w-3 h-3" />
          <span>{trendValue}</span>
        </div>
      )}

      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
