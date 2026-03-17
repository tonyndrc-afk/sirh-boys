// ═══════════════════════════════════════════════════════════════════════════════
// SECTION DASHBOARD - Vue d'ensemble de l'entreprise (OPTIMISÉ)
// ═══════════════════════════════════════════════════════════════════════════════

import { useMemo, memo, useCallback } from 'react';
import { useSIRHStore } from '@/store/sirhStore';
import { KPICard } from '@/components/ui-custom/KPICard';
import { GlassCard } from '@/components/ui-custom/GlassCard';
import {
  Users,
  TrendingUp,
  Download,
  Zap,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Poles constant - défini hors composant pour éviter recréation
const POLES = ['Tech', 'Produit', 'Business', 'Support', 'Direction'] as const;

// Composant Organigramme Pole - memoïsé
const PoleCard = memo(function PoleCard({
  pole,
  count,
  keyPersons
}: {
  pole: string;
  count: number;
  keyPersons: { id: string; prenom: string }[];
}) {
  return (
    <div
      className="bg-[#0B1121]/50 border border-slate-700/20 rounded-lg p-3 hover:border-slate-700/40 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-200">{pole}</span>
        <Badge variant="secondary" className="bg-slate-800/30 text-slate-200 text-xs">
          {count}
        </Badge>
      </div>
      {keyPersons.length > 0 && (
        <div className="space-y-1">
          {keyPersons.map(kp => (
            <div key={kp.id} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span className="text-xs text-slate-400 truncate">{kp.prenom}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// Composant principal - memoïsé
export const Dashboard = memo(function Dashboard() {
  const { kpis, salaries, alertes } = useSIRHStore();

  // Memoization des calculs coûteux
  const alertesRisque = useMemo(() =>
    alertes.filter(a => a.type === 'Risque' && !a.lue),
    [alertes]
  );

  const salariesActifs = useMemo(() =>
    salaries.filter(s => s.statut === 'Actif'),
    [salaries]
  );

  const contratsEnAttente = useMemo(() =>
    salaries.filter(s => !s.contratSigne).length,
    [salaries]
  );

  const contratsSignes = useMemo(() =>
    salaries.filter(s => s.contratSigne).length,
    [salaries]
  );

  const teletravailMoyen = useMemo(() =>
    Math.round(salaries.reduce((acc, s) => acc + s.teletravailJours, 0) / (salaries.length || 1)),
    [salaries]
  );

  // Memoization des données par pôle
  const polesData = useMemo(() =>
    POLES.map(pole => {
      const count = salaries.filter(s => s.pole === pole && s.statut === 'Actif').length;
      const keyPersons = salaries
        .filter(s =>
          s.pole === pole &&
          (s.poste.includes('CEO') || s.poste.includes('CTO') || s.poste.includes('Head'))
        )
        .map(s => ({ id: s.id, prenom: s.prenom }));
      return { pole, count, keyPersons };
    }),
    [salaries]
  );

  // Handler d'export memoïsé
  const handleExportData = useCallback(() => {
    const data = {
      kpis,
      salaries: salariesActifs.length,
      dateExport: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sonicshelf-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [kpis, salariesActifs.length]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">Dashboard Entreprise</h1>
          <p className="text-slate-400 mt-1">Vue d'ensemble de SonicShelf — Métriques clés & Organisation</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportData}
          className="gap-2 border-slate-700/30 text-slate-200 hover:bg-slate-800/20"
        >
          <Download className="w-4 h-4" />
          Exporter
        </Button>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPICard
          label="Téléchargements"
          value={kpis.telechargements}
          trend="up"
          trendValue="+12% ce mois"
          color="blue"
        />
        <KPICard
          label="MAU"
          value={kpis.mau}
          trend="up"
          trendValue="+8% ce mois"
          color="blue"
        />
        <KPICard
          label="Abonnés Payants"
          value={kpis.abonnesPayants}
          trend="up"
          trendValue="+15% ce mois"
          color="green"
        />
        <KPICard
          label="ARR"
          value={kpis.arr}
          format="currency"
          trend="up"
          trendValue="Objectif: 6M€"
          color="green"
        />
        <KPICard
          label="Burn Rate"
          value={kpis.burnRateMensuel}
          format="currency"
          unit="/mois"
          trend="down"
          trendValue="Stable"
          color="orange"
        />
      </div>

      {/* Deuxième ligne KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Runway"
          value={kpis.runwayMois}
          unit="mois"
          trend="neutral"
          trendValue="Seed: 2.5M€"
          color={kpis.runwayMois < 12 ? 'red' : kpis.runwayMois < 18 ? 'orange' : 'green'}
        />
        <KPICard
          label="Salariés"
          value={kpis.nbSalaries}
          trend="up"
          trendValue={`${salariesActifs.length} actifs`}
          color="blue"
        />
        <KPICard
          label="Masse Salariale"
          value={kpis.masseSalarialeAnnuelle}
          format="currency"
          unit="/an"
          color="default"
        />
        <KPICard
          label="Seed Levé"
          value={kpis.seedLeve}
          format="currency"
          trend="neutral"
          trendValue="Jan 2025"
          color="green"
        />
      </div>

      {/* Alertes et Statut */}
      {alertesRisque.length > 0 && (
        <GlassCard borderColor="red" className="bg-rose-500/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-rose-400 mb-1">Alertes actives</h4>
              <div className="space-y-2">
                {alertesRisque.slice(0, 3).map(alerte => (
                  <p key={alerte.id} className="text-sm text-slate-300">• {alerte.message}</p>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Organigramme et Absences */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organigramme */}
        <GlassCard title="Organigramme" icon={<Users className="w-5 h-5" />} className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {polesData.map(({ pole, count, keyPersons }) => (
              <PoleCard
                key={pole}
                pole={pole}
                count={count}
                keyPersons={keyPersons}
              />
            ))}
          </div>
        </GlassCard>

        {/* Statut RH */}
        <GlassCard title="Statut RH" icon={<Zap className="w-5 h-5" />}>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-400">Contrats signés</span>
                <span className="text-slate-200">{contratsSignes}/{salaries.length}</span>
              </div>
              <Progress
                value={(contratsSignes / (salaries.length || 1)) * 100}
                className="h-2 bg-slate-800/30"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-400">Télétravail moyen</span>
                <span className="text-slate-200">{teletravailMoyen}j/semaine</span>
              </div>
              <Progress
                value={(teletravailMoyen / 5) * 100}
                className="h-2 bg-slate-800/30"
              />
            </div>

            <div className="pt-2 border-t border-slate-700/10">
              <div className="flex items-center gap-2 text-sm">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">{salariesActifs.length} salariés actifs</span>
              </div>
              {contratsEnAttente > 0 && (
                <div className="flex items-center gap-2 text-sm mt-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400">{contratsEnAttente} contrat(s) en attente</span>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* SonicShelf Studio */}
      <GlassCard title="SonicShelf Studio — Objectifs Board" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Pricing</p>
            <p className="text-lg font-semibold text-slate-200">Freemium → Premium Tiers</p>
            <p className="text-sm text-slate-400 mt-1">
              Starter €9/mois • Pro €29/mois • Enterprise sur mesure
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Objectif 12 mois</p>
            <p className="text-lg font-semibold text-slate-200">50 000 créateurs inscrits</p>
            <p className="text-sm text-slate-400 mt-1">
              Activation &gt; 60% • Rétention &gt; 70%
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">ARR Cible</p>
            <p className="text-lg font-semibold text-slate-200">6 M€ en 24 mois</p>
            <p className="text-sm text-slate-400 mt-1">
              Préparation Série A 12-18 M€
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
});
