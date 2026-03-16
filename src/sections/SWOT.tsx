// ═══════════════════════════════════════════════════════════════════════════════
// SECTION SWOT - Analyse stratégique
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { GlassCard } from '@/components/ui-custom/GlassCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TrendingUp, AlertTriangle, CheckCircle, XCircle, ArrowRight, Info } from 'lucide-react';

interface SWOTItem {
  id: string;
  text: string;
}

interface SWOTData {
  forces: SWOTItem[];
  faiblesses: SWOTItem[];
  opportunites: SWOTItem[];
  menaces: SWOTItem[];
}

const swotData: SWOTData = {
  forces: [
    { id: 'f1', text: 'Positionnement IA générative différenciant — attractif pour profils tech passionnés' },
    { id: 'f2', text: 'Implantation Station F — visibilité, réseau talents & investisseurs' },
    { id: 'f3', text: 'Levée seed 2,5 M€ = crédibilité startup' },
    { id: 'f4', text: 'Équipe jeune (moy. 29 ans) — culture horizontale séduisant les profils juniors' },
    { id: 'f5', text: 'Turnover nul, témoignant une bonne cohésion de base' },
  ],
  faiblesses: [
    { id: 'w1', text: 'Absence de grille salariale et de plan de carrière formalisés' },
    { id: 'w2', text: 'Décisions centralisées sur les fondateurs → goulot d\'étranglement au scale' },
    { id: 'w3', text: 'Runway 14 mois : incertitude perçue par les candidats seniors' },
    { id: 'w4', text: 'Signaux d\'alerte de 2 développeurs (surcharge, manque de clarté roadmap)' },
    { id: 'w5', text: 'Zéro manager intermédiaire — incompatible avec croissance rapide' },
    { id: 'w6', text: 'Pas de référentiel de compétences structuré' },
  ],
  opportunites: [
    { id: 'o1', text: 'Vague de restructurations GAFAM/scale-ups : profils expérimentés disponibles' },
    { id: 'o2', text: 'Travail hybride normalisé' },
    { id: 'o3', text: 'Jeunes diplômés grandes écoles & universités préfèrent les startups IA à impact' },
    { id: 'o4', text: 'Course à l\'IA → fort appel des talents tech motivés' },
  ],
  menaces: [
    { id: 't1', text: 'Compétition extrême pour talents IA/ML : big tech, labos, startups bien financées' },
    { id: 't2', text: 'Profils Sales B2B aux attentes salariales élevées → tension budgétaire' },
    { id: 't3', text: 'Inflation salariale soutenue dans la tech malgré ralentissement secteur' },
    { id: 't4', text: 'Pivots B2B SaaS de concurrents : guerre des talents sur mêmes profils' },
  ],
};

const quadrantDetails: Record<string, { title: string; description: string }> = {
  forces: {
    title: 'Forces — Détail complet',
    description: 'Les forces internes de SonicShelf constituent des atouts majeurs pour attirer les talents dans un marché compétitif. Le positionnement unique sur l\'IA narrative vocale, combiné à l\'implantation prestigieuse à Station F et la levée de fonds réussie, crée un environnement attractif pour les profils tech.',
  },
  faiblesses: {
    title: 'Faiblesses — Détail complet',
    description: 'Les faiblesses organisationnelles doivent être adressées rapidement pour ne pas freiner le recrutement. L\'absence de structure RH formelle et la centralisation des décisions constituent des risques majeurs pour la scalabilité.',
  },
  opportunites: {
    title: 'Opportunités — Détail complet',
    description: 'Le marché du travail offre des opportunités favorables au recrutement. Les restructurations dans les grandes entreprises tech libèrent des talents expérimentés, tandis que les nouvelles générations privilégient l\'impact et l\'innovation.',
  },
  menaces: {
    title: 'Menaces — Détail complet',
    description: 'Les menaces concurrentielles pesent sur la capacité à recruter. La compétition féroce pour les profils IA/ML et l\'inflation salariale représentent des défis majeurs pour une startup en phase de scale.',
  },
};

export function SWOT() {
  const [selectedQuadrant, setSelectedQuadrant] = useState<keyof SWOTData | null>(null);



  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-200">SWOT Recrutement</h1>
        <p className="text-slate-400 mt-1">Analyse stratégique des forces, faiblesses, opportunités et menaces — Dimension RH</p>
      </div>

      {/* Matrice SWOT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Forces */}
        <GlassCard
          borderColor="green"
          className="cursor-pointer hover:border-emerald-500/50 transition-colors"
          onClick={() => setSelectedQuadrant('forces')}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-400">FORCES</h3>
              <p className="text-xs text-slate-400">Internes attractives</p>
            </div>
          </div>
          <ul className="space-y-3">
            {swotData.forces.map((item, i) => (
              <li
                key={item.id}
                className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Faiblesses */}
        <GlassCard
          borderColor="red"
          className="cursor-pointer hover:border-rose-500/50 transition-colors"
          onClick={() => setSelectedQuadrant('faiblesses')}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-semibold text-rose-400">FAIBLESSES</h3>
              <p className="text-xs text-slate-400">Organisationnelles</p>
            </div>
          </div>
          <ul className="space-y-3">
            {swotData.faiblesses.map((item, i) => (
              <li
                key={item.id}
                className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Opportunités */}
        <GlassCard
          borderColor="blue"
          className="cursor-pointer hover:border-sky-500/50 transition-colors"
          onClick={() => setSelectedQuadrant('opportunites')}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sky-400">OPPORTUNITÉS</h3>
              <p className="text-xs text-slate-400">Marché du travail</p>
            </div>
          </div>
          <ul className="space-y-3">
            {swotData.opportunites.map((item, i) => (
              <li
                key={item.id}
                className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ArrowRight className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Menaces */}
        <GlassCard
          borderColor="orange"
          className="cursor-pointer hover:border-amber-500/50 transition-colors"
          onClick={() => setSelectedQuadrant('menaces')}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-400">MENACES</h3>
              <p className="text-xs text-slate-400">Concurrentielles</p>
            </div>
          </div>
          <ul className="space-y-3">
            {swotData.menaces.map((item, i) => (
              <li
                key={item.id}
                className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Dialog Détails */}
      <Dialog open={!!selectedQuadrant} onOpenChange={() => setSelectedQuadrant(null)}>
        <DialogContent className="bg-[#0B1121] border-slate-700/20 text-slate-200 max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedQuadrant && quadrantDetails[selectedQuadrant].title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-400 mb-4">
              {selectedQuadrant && quadrantDetails[selectedQuadrant].description}
            </p>
            {selectedQuadrant && (
              <ul className="space-y-2">
                {swotData[selectedQuadrant].map(item => (
                  <li key={item.id} className="flex items-start gap-2 text-sm text-slate-300">
                    <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
