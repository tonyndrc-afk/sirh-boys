// ═══════════════════════════════════════════════════════════════════════════════
// SECTION BALANCED SCORECARD - Alignement stratégique
// ═══════════════════════════════════════════════════════════════════════════════

import { GlassCard } from '@/components/ui-custom/GlassCard';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Target, Settings, Sprout, TrendingUp, Users } from 'lucide-react';

interface BSCData {
  icon: React.ReactNode;
  title: string;
  color: string;
  objectif: string;
  kpis: string[];
  cibles: string;
  recrutements: string[];
}

const bscData: BSCData[] = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: 'Financier',
    color: 'green',
    objectif: 'Atteindre 6 M€ ARR en 24 mois\nPréparer la Série A (12-18 M€)',
    kpis: ['ARR Studio / Masse salariale', 'CAC B2B créateurs', 'CA généré par recrue Sales'],
    cibles: 'Ratio MS/ARR < 40% à 24 mois',
    recrutements: ['Head of Sales B2B', 'Customer Success', 'Product Manager B2B'],
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Client / Marché',
    color: 'blue',
    objectif: '50 000 créateurs inscrits / 12 mois\nPositionner Studio comme référence',
    kpis: ['NPS créateurs', 'Taux d\'activation créateurs', 'Taux de rétention à 6 mois'],
    cibles: 'NPS > 40 | Activation > 60% | Rétention > 70%',
    recrutements: ['Customer Success Manager', 'Product Manager B2B', 'Data Engineer'],
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: 'Processus Internes',
    color: 'orange',
    objectif: 'Livrer Studio dans les délais\nScaler sans dysfonctionnement',
    kpis: ['Vélocité sprints (livrés/planifiés)', 'Time-to-market nouvelles features', 'Incidents critiques post-déploiement'],
    cibles: 'Vélocité > 85% | TTM < 4 sem. | 0 incident P0/mois',
    recrutements: ['Dev Backend SaaS Senior', 'Tech Lead', 'Product Manager B2B'],
  },
  {
    icon: <Sprout className="w-6 h-6" />,
    title: 'Apprentissage & Croissance',
    color: 'purple',
    objectif: 'Organisation scalable sans casse humaine\nDistribuer la prise de décision',
    kpis: ['Taux rétention collaborateurs', 'Score engagement interne', 'Délai moyen recrutement', 'Key Person Risk coverage'],
    cibles: 'Rétention > 90% | Engagement > 7/10 | Recrutement < 6 sem.',
    recrutements: ['People Manager / RH', 'Tech Lead', 'Head of Sales'],
  },
];

const colorClasses: Record<string, { border: string; bg: string; text: string }> = {
  green: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  blue: { border: 'border-sky-500/30', bg: 'bg-sky-500/10', text: 'text-sky-400' },
  orange: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  purple: { border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400' },
};

export function BSC() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-200">Balanced Scorecard</h1>
        <p className="text-slate-400 mt-1">Alignement Recrutements / Stratégie Business</p>
      </div>

      {/* Grille BSC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bscData.map((axe) => (
          <GlassCard
            key={axe.title}
            className={colorClasses[axe.color].border}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl ${colorClasses[axe.color].bg} flex items-center justify-center`}>
                <span className={colorClasses[axe.color].text}>{axe.icon}</span>
              </div>
              <div>
                <h3 className={`font-bold text-lg ${colorClasses[axe.color].text}`}>{axe.title}</h3>
              </div>
            </div>

            {/* Objectif */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Objectif stratégique</p>
              <p className="text-sm text-slate-300 whitespace-pre-line">{axe.objectif}</p>
            </div>

            {/* KPIs */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">KPIs principaux</p>
              <ul className="space-y-1">
                {axe.kpis.map((kpi, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                    <TrendingUp className="w-3 h-3 text-slate-500" />
                    {kpi}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cibles */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Cibles</p>
              <Badge className={`${colorClasses[axe.color].bg} ${colorClasses[axe.color].text} border ${colorClasses[axe.color].border}`}>
                {axe.cibles}
              </Badge>
            </div>

            {/* Recrutements */}
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Recrutements alignés</p>
              <div className="flex flex-wrap gap-2">
                {axe.recrutements.map((rec, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-slate-800/30 text-slate-200 cursor-pointer hover:bg-slate-800/50 transition-colors"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {rec}
                  </Badge>
                ))}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
