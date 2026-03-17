// ═══════════════════════════════════════════════════════════════════════════════
// GLASS CARD - Carte avec effet glassmorphism
// ═══════════════════════════════════════════════════════════════════════════════

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  borderColor?: 'default' | 'green' | 'red' | 'orange' | 'blue' | 'purple';
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  title,
  icon,
  action,
  borderColor = 'default',
  onClick
}: GlassCardProps) {
  const borderColors = {
    default: 'border-slate-700/50',
    green: 'border-emerald-500/30',
    red: 'border-rose-500/30',
    orange: 'border-amber-500/30',
    blue: 'border-blue-500/30',
    purple: 'border-violet-500/30',
  };

  return (
    <div
      className={cn(
        "relative bg-slate-800/40 backdrop-blur-sm border rounded-xl overflow-hidden",
        borderColors[borderColor],
        className
      )}
      onClick={onClick}
    >
      {/* Ligne lumineuse top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-50" />

      {/* Header */}
      {(title || icon) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/30">
          <div className="flex items-center gap-3">
            {icon && <span className="text-slate-400">{icon}</span>}
            {title && <h3 className="font-semibold text-slate-200">{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}
