// ═══════════════════════════════════════════════════════════════════════════════
// SECTION KEY PERSON RISK - Analyse des risques de dépendance
// ═══════════════════════════════════════════════════════════════════════════════

import { GlassCard } from '@/components/ui-custom/GlassCard';
import { Badge } from '@/components/ui/badge';
import { User, ShieldAlert, CheckCircle } from 'lucide-react';

interface RiskData {
  role: string;
  niveau: 'CRITIQUE' | 'ÉLEVÉ';
  color: string;
  competence: string;
  impact: string;
  mitigation: string[];
  riskScore: number;
  position: { x: number; y: number };
}

const riskData: RiskData[] = [
  {
    role: 'CTO (Cofondateur)',
    niveau: 'CRITIQUE',
    color: 'red',
    competence: 'Architecture moteur IA, choix modèles, vision technique globale',
    impact: 'Blocage total développement produit ; perte de la roadmap technique',
    mitigation: [
      'Recruter Tech Lead absorbant partie des responsabilités',
      'Documenter architecture dans wiki interne',
      'Partager décisions techniques avec équipe',
    ],
    riskScore: 95,
    position: { x: 80, y: 50 },
  },
  {
    role: 'CEO (Cofondateur)',
    niveau: 'CRITIQUE',
    color: 'red',
    competence: 'Relations investisseurs, partenariats stratégiques, vision produit',
    impact: 'Perte levée Série A ; désorientation stratégique de l\'équipe',
    mitigation: [
      'Distribuer relations investisseurs entre les deux fondateurs',
      'Formaliser vision dans roadmap écrite',
      'Intégrer Head of Sales pour co-piloter go-to-market',
    ],
    riskScore: 90,
    position: { x: 75, y: 45 },
  },
  {
    role: 'Head of Content',
    niveau: 'ÉLEVÉ',
    color: 'orange',
    competence: 'Réseau créateurs, partenariats contenus, pipeline B2B',
    impact: 'Perte pipeline créateurs au lancement de Studio ; retard objectif 50 000 inscrits',
    mitigation: [
      'Formaliser partenariats dans contrats non liés à une personne',
      'Recruter Customer Success pour diversifier les liens créateurs',
      'Documenter le réseau dans un CRM partagé',
    ],
    riskScore: 70,
    position: { x: 45, y: 30 },
  },
  {
    role: 'Ingénieurs IA (×4)',
    niveau: 'ÉLEVÉ',
    color: 'orange',
    competence: 'Fine-tuning LLM, TTS, sound design adaptatif',
    impact: 'Ralentissement ou arrêt du développement du moteur propriétaire',
    mitigation: [
      'Recruter Tech Lead',
      'Mettre en place pair programming et documentation',
      'Politique de rétention renforcée (BSPCE, plan carrière)',
    ],
    riskScore: 65,
    position: { x: 50, y: 50 },
  },
];

export function Risk() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-200">Key Person Risk</h1>
        <p className="text-slate-400 mt-1">Analyse des risques de dépendance — Impact × Probabilité</p>
      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskData.map((risk) => (
          <GlassCard
            key={risk.role}
            className={risk.color === 'red' ? 'border-rose-500/40' : 'border-amber-500/40'}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${risk.color === 'red' ? 'bg-rose-500/20' : 'bg-amber-500/20'} flex items-center justify-center`}>
                  <User className={`w-5 h-5 ${risk.color === 'red' ? 'text-rose-400' : 'text-amber-400'}`} />
                </div>
                <h3 className="font-semibold text-slate-200">{risk.role}</h3>
              </div>
              <Badge className={risk.color === 'red' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}>
                {risk.niveau} {risk.color === 'red' ? '🔴' : '🟠'}
              </Badge>
            </div>

            {/* Compétence */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Compétence détenue</p>
              <p className="text-sm text-slate-300">{risk.competence}</p>
            </div>

            {/* Impact */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Impact si départ</p>
              <p className={`text-sm ${risk.color === 'red' ? 'text-rose-400' : 'text-amber-400'}`}>
                {risk.impact}
              </p>
            </div>

            {/* Mitigation */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Mesures de mitigation</p>
              <ul className="space-y-1">
                {risk.mitigation.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle className="w-3 h-3 mt-0.5 text-slate-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Jauge de risque */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Niveau de risque</span>
                <span className={risk.color === 'red' ? 'text-rose-400' : 'text-amber-400'}>{risk.riskScore}%</span>
              </div>
              <div className="h-2 bg-slate-800/30 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    risk.color === 'red'
                      ? 'bg-gradient-to-r from-rose-500 to-rose-400'
                      : 'bg-gradient-to-r from-amber-500 to-amber-400'
                  }`}
                  style={{ width: `${risk.riskScore}%` }}
                />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Matrice 2D */}
      <GlassCard title="Matrice Impact × Probabilité" icon={<ShieldAlert className="w-5 h-5" />}>
        <div className="relative w-full max-w-xl mx-auto aspect-square">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Zones de couleur */}
            <rect x="0" y="0" width="133" height="133" fill="rgba(52,211,153,0.1)" stroke="rgba(52,211,153,0.2)" />
            <rect x="133" y="0" width="134" height="133" fill="rgba(56,189,248,0.1)" stroke="rgba(56,189,248,0.2)" />
            <rect x="267" y="0" width="133" height="133" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.2)" />
            <rect x="0" y="133" width="133" height="134" fill="rgba(56,189,248,0.1)" stroke="rgba(56,189,248,0.2)" />
            <rect x="133" y="133" width="134" height="134" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.2)" />
            <rect x="267" y="133" width="133" height="134" fill="rgba(251,113,133,0.1)" stroke="rgba(251,113,133,0.2)" />
            <rect x="0" y="267" width="133" height="133" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.2)" />
            <rect x="133" y="267" width="134" height="133" fill="rgba(251,113,133,0.1)" stroke="rgba(251,113,133,0.2)" />
            <rect x="267" y="267" width="133" height="133" fill="rgba(251,113,133,0.15)" stroke="rgba(251,113,133,0.3)" />

            {/* Lignes de grille */}
            <line x1="133" y1="0" x2="133" y2="400" stroke="rgba(148,163,184,0.2)" />
            <line x1="267" y1="0" x2="267" y2="400" stroke="rgba(148,163,184,0.2)" />
            <line x1="0" y1="133" x2="400" y2="133" stroke="rgba(148,163,184,0.2)" />
            <line x1="0" y1="267" x2="400" y2="267" stroke="rgba(148,163,184,0.2)" />

            {/* Labels axes */}
            <text x="200" y="395" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="Syne">Impact →</text>
            <text x="10" y="200" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="Syne" transform="rotate(-90 10 200)">Probabilité →</text>

            {/* Points de données */}
            {riskData.map((risk) => (
              <g key={risk.role}>
                <circle
                  cx={risk.position.x * 4}
                  cy={400 - risk.position.y * 4}
                  r="14"
                  fill={risk.color === 'red' ? '#FB7185' : '#FBBF24'}
                  opacity="0.8"
                >
                  <animate attributeName="r" values="14;16;14" dur="2s" repeatCount="indefinite" />
                </circle>
                <text
                  x={risk.position.x * 4}
                  y={400 - risk.position.y * 4 + 4}
                  textAnchor="middle"
                  fill="#0B1121"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {risk.role.split(' ')[0]}
                </text>
              </g>
            ))}
          </svg>

          {/* Légende */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-xs text-slate-400">Critique</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-xs text-slate-400">Élevé</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
