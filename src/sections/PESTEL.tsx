// ═══════════════════════════════════════════════════════════════════════════════
// SECTION PESTEL - Analyse macro-environnementale
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { GlassCard } from '@/components/ui-custom/GlassCard';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Landmark, Euro, Users, Cpu, Leaf, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PESTELItem {
  facteur: string;
  analyse: string;
  impact: string;
  impactColor: string;
}

interface PESTELData {
  [key: string]: {
    icon: React.ReactNode;
    title: string;
    items: PESTELItem[];
  };
}

const pestelData: PESTELData = {
  politique: {
    icon: <Landmark className="w-5 h-5" />,
    title: 'Politique',
    items: [
      {
        facteur: 'AI Act UE',
        analyse: 'Obligations conformité IA pour systèmes interactifs dès 2025-2026 → besoin expertise juridique/conformité IA rare',
        impact: 'Recrutement juridique IA urgent',
        impactColor: 'bg-rose-500/20 text-rose-400',
      },
      {
        facteur: 'Aides publiques',
        analyse: 'BPI France, CIR, statut JEI → soutien capacité recrutement',
        impact: 'Atout financier recrutement',
        impactColor: 'bg-emerald-500/20 text-emerald-400',
      },
    ],
  },
  economique: {
    icon: <Euro className="w-5 h-5" />,
    title: 'Économique',
    items: [
      {
        facteur: 'Inflation salariale',
        analyse: 'Salaires tech en hausse soutenue malgré ralentissement ; tension sur budgets RH seed',
        impact: 'Pression sur packages',
        impactColor: 'bg-amber-500/20 text-amber-400',
      },
      {
        facteur: 'VC resserré',
        analyse: 'Financement VC européen contracté depuis 2023 → candidats méfiants sur solidité financière',
        impact: 'Candidats seniors frileux',
        impactColor: 'bg-amber-500/20 text-amber-400',
      },
    ],
  },
  social: {
    icon: <Users className="w-5 h-5" />,
    title: 'Social',
    items: [
      {
        facteur: 'Attentes Gen Y/Z',
        analyse: 'Flexibilité, sens du projet, transparence managériale, apprentissage rapide valorisés',
        impact: 'Adapter culture & onboarding',
        impactColor: 'bg-sky-500/20 text-sky-400',
      },
      {
        facteur: 'Équilibre vie pro',
        analyse: 'Incompatible avec culture de surcharge non adressée ; risque de turnover',
        impact: 'Urgence manager intermédiaire',
        impactColor: 'bg-rose-500/20 text-rose-400',
      },
    ],
  },
  technologique: {
    icon: <Cpu className="w-5 h-5" />,
    title: 'Technologique',
    items: [
      {
        facteur: 'Évolution LLM',
        analyse: 'Raccourcissement durée de vie des compétences → formation continue & veille obligatoires',
        impact: 'Budget formation à prévoir',
        impactColor: 'bg-sky-500/20 text-sky-400',
      },
      {
        facteur: 'Rareté profils',
        analyse: 'ML engineers, voice AI, product B2B SaaS très sollicités ; délais de recrutement longs',
        impact: 'Anticiper recrutements 6 mois',
        impactColor: 'bg-amber-500/20 text-amber-400',
      },
    ],
  },
  environnemental: {
    icon: <Leaf className="w-5 h-5" />,
    title: 'Environnemental',
    items: [
      {
        facteur: 'Empreinte IA',
        analyse: 'Empreinte énergétique modèles IA : sujet émergent de réputation employeur chez candidats tech sensibilisés',
        impact: 'Anticiper communication RH',
        impactColor: 'bg-emerald-500/20 text-emerald-400',
      },
    ],
  },
  legal: {
    icon: <Scale className="w-5 h-5" />,
    title: 'Légal',
    items: [
      {
        facteur: 'RGPD voix',
        analyse: 'Données interaction vocale = données sensibles → expertise DPO ou conseil externe nécessaire',
        impact: 'Besoin juridique/DPO',
        impactColor: 'bg-rose-500/20 text-rose-400',
      },
      {
        facteur: 'Droits d\'auteur',
        analyse: 'Synthèse vocale et narration : zone grise légale → avocat spécialisé droits d\'auteur IA indispensable',
        impact: 'Externaliser juridique',
        impactColor: 'bg-amber-500/20 text-amber-400',
      },
      {
        facteur: 'CSE obligatoire',
        analyse: 'Plus de 11 salariés → obligation légale CSE déjà atteinte ; processus RH formels requis',
        impact: 'Structurer RH immédiatement',
        impactColor: 'bg-rose-500/20 text-rose-400',
      },
    ],
  },
};

export function PESTEL() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-200">PESTEL Recrutement</h1>
        <p className="text-slate-400 mt-1">Analyse macro-environnementale des facteurs influençant le recrutement</p>
      </div>

      {/* Accordéons PESTEL */}
      <div className="space-y-3">
        {Object.entries(pestelData).map(([key, data]) => (
          <GlassCard key={key} className="overflow-hidden">
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400">{data.icon}</span>
                <span className="font-semibold text-slate-200">{data.title}</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-slate-500 transition-transform duration-300",
                  openSection === key && "rotate-180"
                )}
              />
            </button>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                openSection === key ? "max-h-96" : "max-h-0"
              )}
            >
              <div className="px-4 pb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/20">
                      <th className="text-left py-2 text-xs uppercase tracking-wider text-slate-400">Facteur</th>
                      <th className="text-left py-2 text-xs uppercase tracking-wider text-slate-400">Analyse</th>
                      <th className="text-left py-2 text-xs uppercase tracking-wider text-slate-400">Impact RH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item, index) => (
                      <tr key={index} className="border-b border-slate-700/10 last:border-0">
                        <td className="py-3 text-sm text-slate-200 font-medium">{item.facteur}</td>
                        <td className="py-3 text-sm text-slate-400">{item.analyse}</td>
                        <td className="py-3">
                          <Badge className={item.impactColor}>{item.impact}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
