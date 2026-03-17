// ═══════════════════════════════════════════════════════════════════════════════
// SECTION COMPÉTENCES - Cartographie des compétences stratégiques
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { GlassCard } from '@/components/ui-custom/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Filter,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Users
} from 'lucide-react';

interface Competence {
  id: number;
  type: 'Hard' | 'Soft';
  categorie: string;
  nom: string;
  criticite: number;
  niveauActuel: number;
  niveauRequis: number;
  gap: number;
  score: number;
  action: 'Recruter' | 'Internaliser' | 'Externaliser';
  keyRisk: boolean;
  justification: string;
}

const competencesData: Competence[] = [
  { id: 1, type: 'Hard', categorie: 'Technologique', nom: 'Fine-tuning & évaluation LLM', criticite: 5, niveauActuel: 4, niveauRequis: 5, gap: 1, score: 5, action: 'Internaliser', keyRisk: true, justification: 'Cœur du moteur IA – seul le CTO maîtrise' },
  { id: 2, type: 'Hard', categorie: 'Technologique', nom: 'Synthèse vocale émotionnelle (TTS)', criticite: 5, niveauActuel: 3, niveauRequis: 5, gap: 2, score: 10, action: 'Recruter', keyRisk: true, justification: 'Différenciant produit – recrutement urgent' },
  { id: 3, type: 'Hard', categorie: 'Technologique', nom: 'Sound design adaptatif', criticite: 4, niveauActuel: 3, niveauRequis: 4, gap: 1, score: 4, action: 'Internaliser', keyRisk: false, justification: 'Composante immersive clé' },
  { id: 4, type: 'Hard', categorie: 'Technologique', nom: 'Architecture SaaS multi-tenant', criticite: 5, niveauActuel: 1, niveauRequis: 5, gap: 4, score: 20, action: 'Recruter', keyRisk: false, justification: 'Prérequis technique absolu au lancement Studio' },
  { id: 5, type: 'Hard', categorie: 'Technologique', nom: 'Data engineering & pipeline', criticite: 4, niveauActuel: 2, niveauRequis: 5, gap: 3, score: 12, action: 'Recruter', keyRisk: false, justification: 'Indispensable pour piloter KPIs SaaS' },
  { id: 6, type: 'Hard', categorie: 'Technologique', nom: 'Sécurité, cloud & DevOps', criticite: 3, niveauActuel: 2, niveauRequis: 4, gap: 2, score: 6, action: 'Externaliser', keyRisk: false, justification: 'Compétence externalisable en phase initiale' },
  { id: 7, type: 'Hard', categorie: 'Technologique', nom: 'Conformité IA & RGPD voix', criticite: 3, niveauActuel: 1, niveauRequis: 4, gap: 3, score: 9, action: 'Externaliser', keyRisk: false, justification: 'Cabinet externe spécialisé recommandé' },
  { id: 8, type: 'Hard', categorie: 'Business', nom: 'Vente B2B SaaS', criticite: 5, niveauActuel: 1, niveauRequis: 5, gap: 4, score: 20, action: 'Recruter', keyRisk: false, justification: 'Aucun profil sales actuellement – bloquant' },
  { id: 9, type: 'Hard', categorie: 'Business', nom: 'Product Management B2B SaaS', criticite: 5, niveauActuel: 2, niveauRequis: 5, gap: 3, score: 15, action: 'Recruter', keyRisk: false, justification: 'Transition B2C→B2B exige PM dédié' },
  { id: 10, type: 'Hard', categorie: 'Business', nom: 'Customer Success Management', criticite: 4, niveauActuel: 1, niveauRequis: 5, gap: 4, score: 16, action: 'Recruter', keyRisk: false, justification: 'Activation et rétention = levier ARR direct' },
  { id: 11, type: 'Hard', categorie: 'Business', nom: 'Growth B2B', criticite: 4, niveauActuel: 2, niveauRequis: 4, gap: 2, score: 8, action: 'Recruter', keyRisk: false, justification: 'Acquisition créateurs à grande échelle' },
  { id: 12, type: 'Hard', categorie: 'Business', nom: 'Analytics SaaS', criticite: 4, niveauActuel: 2, niveauRequis: 4, gap: 2, score: 8, action: 'Recruter', keyRisk: false, justification: 'Pilotage KPIs pour préparer Série A' },
  { id: 13, type: 'Hard', categorie: 'Business', nom: 'Partenariats créateurs', criticite: 4, niveauActuel: 2, niveauRequis: 4, gap: 2, score: 8, action: 'Internaliser', keyRisk: true, justification: 'Head of Content = Key Person unique' },
  { id: 14, type: 'Hard', categorie: 'Business', nom: 'Modélisation financière', criticite: 3, niveauActuel: 2, niveauRequis: 3, gap: 1, score: 3, action: 'Externaliser', keyRisk: false, justification: 'Besoin ponctuel pour Série A' },
  { id: 15, type: 'Hard', categorie: 'Support', nom: 'Structuration RH', criticite: 3, niveauActuel: 1, niveauRequis: 4, gap: 3, score: 9, action: 'Recruter', keyRisk: false, justification: 'Passage à 30+ collaborateurs impossible sans RH' },
  { id: 16, type: 'Hard', categorie: 'Support', nom: 'Droit social & conformité', criticite: 3, niveauActuel: 1, niveauRequis: 3, gap: 2, score: 6, action: 'Externaliser', keyRisk: false, justification: 'CSE déjà requis légalement' },
  { id: 17, type: 'Hard', categorie: 'Support', nom: 'Juridique droits d\'auteur IA', criticite: 3, niveauActuel: 1, niveauRequis: 3, gap: 2, score: 6, action: 'Externaliser', keyRisk: false, justification: 'Cabinet IP spécialisé indispensable' },
  { id: 18, type: 'Hard', categorie: 'Support', nom: 'Management intermédiaire', criticite: 4, niveauActuel: 1, niveauRequis: 5, gap: 4, score: 16, action: 'Recruter', keyRisk: true, justification: 'Fondateurs seuls décisionnaires → goulot' },
  { id: 19, type: 'Hard', categorie: 'Support', nom: 'Recrutement tech & sourcing', criticite: 3, niveauActuel: 1, niveauRequis: 4, gap: 3, score: 9, action: 'Recruter', keyRisk: false, justification: 'Délais recrutement IA/ML longs' },
  { id: 20, type: 'Soft', categorie: 'Soft Skills', nom: 'Leadership de proximité', criticite: 5, niveauActuel: 1, niveauRequis: 5, gap: 4, score: 20, action: 'Recruter', keyRisk: true, justification: 'Aucun manager intermédiaire → 2 devs en tension' },
  { id: 21, type: 'Soft', categorie: 'Soft Skills', nom: 'Communication interpersonnelle', criticite: 5, niveauActuel: 2, niveauRequis: 5, gap: 3, score: 15, action: 'Internaliser', keyRisk: true, justification: 'Silos entre tech et business → malentendus fréquents' },
  { id: 22, type: 'Soft', categorie: 'Soft Skills', nom: 'Gestion du stress & résilience', criticite: 4, niveauActuel: 2, niveauRequis: 5, gap: 3, score: 12, action: 'Internaliser', keyRisk: true, justification: 'Rythme startup intense → risque de burnout équipe' },
  { id: 23, type: 'Soft', categorie: 'Soft Skills', nom: 'Adaptabilité & agilité', criticite: 5, niveauActuel: 3, niveauRequis: 5, gap: 2, score: 10, action: 'Internaliser', keyRisk: false, justification: 'Pivots fréquents B2C→B2B exigent flexibilité' },
  { id: 24, type: 'Soft', categorie: 'Soft Skills', nom: 'Intelligence émotionnelle', criticite: 4, niveauActuel: 2, niveauRequis: 4, gap: 2, score: 8, action: 'Internaliser', keyRisk: false, justification: 'Cohésion d\'équipe fragile en hypercroissance' },
  { id: 25, type: 'Soft', categorie: 'Soft Skills', nom: 'Esprit critique & prise de décision', criticite: 5, niveauActuel: 3, niveauRequis: 5, gap: 2, score: 10, action: 'Internaliser', keyRisk: false, justification: 'Arbitrages produit/tech rapides nécessaires' },
  { id: 26, type: 'Soft', categorie: 'Soft Skills', nom: 'Négociation & influence', criticite: 4, niveauActuel: 1, niveauRequis: 4, gap: 3, score: 12, action: 'Recruter', keyRisk: false, justification: 'Indispensable pour closing B2B et levée Série A' },
  { id: 27, type: 'Soft', categorie: 'Soft Skills', nom: 'Travail en équipe & collaboration', criticite: 4, niveauActuel: 3, niveauRequis: 5, gap: 2, score: 8, action: 'Internaliser', keyRisk: false, justification: 'Passage de 10 à 30+ requiert culture collaborative' },
  { id: 28, type: 'Soft', categorie: 'Soft Skills', nom: 'Créativité & innovation', criticite: 4, niveauActuel: 4, niveauRequis: 5, gap: 1, score: 4, action: 'Internaliser', keyRisk: false, justification: 'ADN startup à préserver malgré la structuration' },
  { id: 29, type: 'Soft', categorie: 'Soft Skills', nom: 'Gestion des conflits', criticite: 4, niveauActuel: 1, niveauRequis: 4, gap: 3, score: 12, action: 'Recruter', keyRisk: true, justification: 'Tensions non-résolues → départs silencieux' },
  { id: 30, type: 'Soft', categorie: 'Soft Skills', nom: 'Orientation résultats & ownership', criticite: 5, niveauActuel: 3, niveauRequis: 5, gap: 2, score: 10, action: 'Internaliser', keyRisk: false, justification: 'Culture OKR à déployer pour aligner les équipes' },
];

const categories = ['Tout', 'Technologique', 'Business', 'Support', 'Soft Skills'];

export function Competences() {
  const [filter, setFilter] = useState('Tout');

  const filteredCompetences = filter === 'Tout'
    ? competencesData
    : competencesData.filter(c => c.categorie === filter);

  const stats = {
    recruter: competencesData.filter(c => c.action === 'Recruter').length,
    internaliser: competencesData.filter(c => c.action === 'Internaliser').length,
    externaliser: competencesData.filter(c => c.action === 'Externaliser').length,
  };

  const renderScoreDots = (score: number) => {
    const maxDots = 5;
    const filledDots = score >= 20 ? 5 : score >= 15 ? 4 : score >= 10 ? 3 : score >= 6 ? 2 : score >= 1 ? 1 : 0;

    return (
      <div className="flex gap-1">
        {Array.from({ length: maxDots }).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < filledDots
                ? score >= 20 ? 'bg-rose-400' : score >= 10 ? 'bg-amber-400' : 'bg-sky-400'
                : 'bg-slate-800/30'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-200">Cartographie des Compétences</h1>
        <p className="text-slate-400 mt-1">Analyse stratégique des 30 compétences — Phase de scale SonicShelf</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard className="border-sky-500/30 bg-sky-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase">À Recruter</p>
              <p className="text-2xl font-bold text-sky-400 font-mono">{stats.recruter}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase">À Internaliser</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono">{stats.internaliser}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-200" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase">À Externaliser</p>
              <p className="text-2xl font-bold text-slate-200 font-mono">{stats.externaliser}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        <Filter className="w-5 h-5 text-slate-500 mr-2" />
        {categories.map(cat => (
          <Button
            key={cat}
            variant={filter === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(cat)}
            className={filter === cat
              ? 'bg-slate-800 text-slate-200'
              : 'border-slate-700/30 text-slate-400 hover:bg-slate-800/20'
            }
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Tableau */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/20">
                <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-slate-400">#</th>
                <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-slate-400">Type</th>
                <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-slate-400">Catégorie</th>
                <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-slate-400">Compétence</th>
                <th className="text-center py-3 px-2 text-xs uppercase tracking-wider text-slate-400">Score</th>
                <th className="text-center py-3 px-2 text-xs uppercase tracking-wider text-slate-400">Action</th>
                <th className="text-center py-3 px-2 text-xs uppercase tracking-wider text-slate-400">Risk</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompetences.map((comp) => (
                <tr
                  key={comp.id}
                  className={`border-b border-slate-700/10 hover:bg-slate-800/10 transition-colors ${
                    comp.score >= 20 ? 'bg-rose-500/5' : comp.score >= 10 ? 'bg-amber-500/5' : ''
                  }`}
                >
                  <td className="py-3 px-2 text-sm text-slate-400">{comp.id}</td>
                  <td className="py-3 px-2">
                    <Badge className={comp.type === 'Hard'
                      ? 'bg-sky-500/20 text-sky-400'
                      : 'bg-slate-800/30 text-slate-200'
                    }>
                      {comp.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-sm text-slate-400">{comp.categorie}</td>
                  <td className="py-3 px-2 text-sm text-slate-200">{comp.nom}</td>
                  <td className="py-3 px-2 text-center">
                    {renderScoreDots(comp.score)}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <Badge className={
                      comp.action === 'Recruter' ? 'bg-sky-500/20 text-sky-400' :
                      comp.action === 'Internaliser' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-slate-800/30 text-slate-200'
                    }>
                      {comp.action}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-center">
                    {comp.keyRisk && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
