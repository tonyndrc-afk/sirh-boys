// ═══════════════════════════════════════════════════════════════════════════════
// HEADER - Topbar avec breadcrumb, alertes et actions
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSIRHStore } from '@/store/sirhStore';
import {
  Bell,
  Presentation,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HeaderProps {
  activeSection: string;
  presentationMode: boolean;
  onTogglePresentation: () => void;
  collapsed: boolean;
}

const sectionLabels: Record<string, string> = {
  dashboard: 'Dashboard Entreprise',
  'admin-rh': 'Administration RH',
  temps: 'Temps & Activités',
  competences: 'Cartographie des Compétences',
  recrutement: 'Plan de Recrutement',
  prepaie: 'Pré-Paie',
  swot: 'SWOT Recrutement',
  pestel: 'PESTEL Recrutement',
  bsc: 'Balanced Scorecard',
  risk: 'Key Person Risk',
};

export function Header({ activeSection, presentationMode, onTogglePresentation, collapsed }: HeaderProps) {
  const [showAlerts, setShowAlerts] = useState(false);
  const alertes = useSIRHStore(state => state.alertes);
  const markAlerteLue = useSIRHStore(state => state.markAlerteLue);

  const alertesNonLues = alertes.filter(a => !a.lue);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'Risque': return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'Warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'Success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default: return <Info className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-[#0F1729]/95 backdrop-blur-xl border-b border-slate-700/50 z-40 transition-all duration-300",
        collapsed ? "left-16" : "left-64"
      )}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">SonicShelf</span>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-200 font-medium">{sectionLabels[activeSection] || activeSection}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Alertes */}
          <Popover open={showAlerts} onOpenChange={setShowAlerts}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              >
                <Bell className="w-5 h-5" />
                {alertesNonLues.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-xs flex items-center justify-center text-white font-medium">
                    {alertesNonLues.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-96 p-0 bg-[#0F1729] border-slate-700/50"
              align="end"
            >
              <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
                <span className="font-medium text-slate-200">Alertes</span>
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                  {alertesNonLues.length} non lues
                </Badge>
              </div>
              <ScrollArea className="h-80">
                {alertes.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Aucune alerte</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700/30">
                    {alertes.map((alerte) => (
                      <div
                        key={alerte.id}
                        className={cn(
                          "p-3 hover:bg-slate-800/30 transition-colors group",
                          !alerte.lue && "bg-blue-600/5"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alerte.type)}
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-medium",
                              !alerte.lue ? "text-slate-200" : "text-slate-400"
                            )}>
                              {alerte.titre}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                              {alerte.message}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              {new Date(alerte.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          {!alerte.lue && (
                            <button
                              onClick={() => markAlerteLue(alerte.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700/50 rounded transition-all"
                            >
                              <X className="w-3 h-3 text-slate-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* Mode Présentation */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePresentation}
            className={cn(
              "gap-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
              presentationMode && "text-emerald-400 hover:text-emerald-400 bg-emerald-400/10"
            )}
          >
            <span className={cn(
              "w-2 h-2 rounded-full",
              presentationMode ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
            )} />
            <Presentation className="w-4 h-4" />
            <span className="hidden sm:inline">Mode Présentation</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
