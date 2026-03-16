// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR - Navigation principale
// ═══════════════════════════════════════════════════════════════════════════════

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  UserPlus,
  Wallet,
  TrendingUp,
  Globe,
  Target,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'admin-rh', label: 'Administration RH', icon: Users },
  { id: 'temps', label: 'Temps & Activités', icon: Calendar },
  { id: 'competences', label: 'Compétences', icon: Briefcase },
  { id: 'recrutement', label: 'Plan Recrutement', icon: UserPlus },
  { id: 'prepaie', label: 'Pré-Paie', icon: Wallet },
  { id: 'separator1', label: '', icon: null, separator: true },
  { id: 'swot', label: 'SWOT Recrutement', icon: TrendingUp },
  { id: 'pestel', label: 'PESTEL Recrutement', icon: Globe },
  { id: 'bsc', label: 'Balanced Scorecard', icon: Target },
  { id: 'risk', label: 'Key Person Risk', icon: ShieldAlert },
];

export function Sidebar({ activeSection, onSectionChange, collapsed }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#0F1729]/95 backdrop-blur-xl border-r border-slate-700/50 z-50 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-700/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
          <span className="text-white font-bold text-sm">SB</span>
        </div>
        {!collapsed && (
          <span className="ml-3 font-bold text-white text-lg tracking-wide">
            SIRH Boys
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {menuItems.map((item) => {
          if (item.separator) {
            return <div key={item.id} className="h-px bg-slate-700/50 my-3" />;
          }

          const Icon = item.icon!;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform",
                isActive && "scale-110"
              )} />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
