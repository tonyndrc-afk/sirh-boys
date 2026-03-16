// ═══════════════════════════════════════════════════════════════════════════════
// SECTION PRÉ-PAIE - Export des variables et gestion (OPTIMISÉ)
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useMemo, memo, useCallback } from 'react';
import { useSIRHStore } from '@/store/sirhStore';
import { GlassCard } from '@/components/ui-custom/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Download,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Euro,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

const MOIS = [
  { value: 1, label: 'Janvier' },
  { value: 2, label: 'Février' },
  { value: 3, label: 'Mars' },
  { value: 4, label: 'Avril' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Juin' },
  { value: 7, label: 'Juillet' },
  { value: 8, label: 'Août' },
  { value: 9, label: 'Septembre' },
  { value: 10, label: 'Octobre' },
  { value: 11, label: 'Novembre' },
  { value: 12, label: 'Décembre' },
];

const TYPES_VARIABLE = [
  { value: 'Prime', label: 'Prime', color: 'bg-emerald-500/20 text-emerald-400' },
  { value: 'Heures sup.', label: 'Heures sup.', color: 'bg-sky-500/20 text-sky-400' },
  { value: 'Absence', label: 'Absence', color: 'bg-rose-500/20 text-rose-400' },
  { value: 'Avantage', label: 'Avantage', color: 'bg-violet-500/20 text-violet-400' },
  { value: 'Autre', label: 'Autre', color: 'bg-slate-800/30 text-slate-200' },
];

// Composant Carte Variable - memoïsé
const VariableCard = memo(function VariableCard({
  variable,
  getSalarieName,
  onValider,
  showValidation = false
}: {
  variable: {
    id: string;
    salarieId: string;
    type: string;
    montant: number;
    description: string;
    dateValidation?: string;
  };
  getSalarieName: (id: string) => string;
  onValider?: (id: string) => void;
  showValidation?: boolean;
}) {
  const typeInfo = TYPES_VARIABLE.find(t => t.value === variable.type);

  return (
    <div className={`bg-[#0B1121]/50 border rounded-lg p-4 ${
      variable.dateValidation ? 'border-emerald-500/30' : 'border-slate-700/20'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-slate-200">{getSalarieName(variable.salarieId)}</p>
          <p className="text-sm text-slate-400">{variable.description}</p>
        </div>
        <Badge className={typeInfo?.color}>
          {variable.type}
        </Badge>
      </div>
      <div className="flex items-center justify-between mt-3">
        <p className={`text-lg font-bold font-mono ${
          variable.dateValidation ? 'text-emerald-400' : 'text-slate-200'
        }`}>
          {variable.montant > 0 ? '+' : ''}{variable.montant.toLocaleString('fr-FR')} €
        </p>
        {showValidation && onValider ? (
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
            onClick={() => onValider(variable.id)}
          >
            <CheckCircle className="w-3 h-3" />
            Valider
          </Button>
        ) : variable.dateValidation ? (
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            Validé le {format(new Date(variable.dateValidation), 'dd/MM/yyyy')}
          </div>
        ) : null}
      </div>
    </div>
  );
});

// Composant KPI Card - memoïsé
const KPICardPrepaie = memo(function KPICardPrepaie({
  icon,
  label,
  value,
  color = 'default'
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: 'green' | 'red' | 'default';
}) {
  const colorClasses = {
    green: 'border-emerald-500/30 bg-emerald-500/5',
    red: 'border-rose-500/30 bg-rose-500/5',
    default: '',
  };

  const textClasses = {
    green: 'text-emerald-400',
    red: 'text-rose-400',
    default: 'text-slate-200',
  };

  return (
    <GlassCard className={colorClasses[color]}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          color === 'green' ? 'bg-emerald-500/20' :
          color === 'red' ? 'bg-rose-500/20' :
          'bg-slate-800/30'
        }`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase">{label}</p>
          <p className={`text-xl font-bold font-mono ${textClasses[color]}`}>{value}</p>
        </div>
      </div>
    </GlassCard>
  );
});

// Composant principal - memoïsé
export const PrePaie = memo(function PrePaie() {
  const { salaries, variablesPaie, kpis, addVariable, validerVariable, exportPrePaie } = useSIRHStore();

  const [selectedMois, setSelectedMois] = useState(new Date().getMonth() + 1);
  const [selectedAnnee, setSelectedAnnee] = useState(new Date().getFullYear());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Formulaire nouvelle variable
  const [newVariable, setNewVariable] = useState({
    salarieId: '',
    type: 'Prime' as const,
    montant: 0,
    description: '',
  });

  // Memoization des calculs
  const variablesMois = useMemo(() =>
    variablesPaie.filter(v => v.mois === selectedMois && v.annee === selectedAnnee),
    [variablesPaie, selectedMois, selectedAnnee]
  );

  const variablesEnAttente = useMemo(() =>
    variablesMois.filter(v => !v.dateValidation),
    [variablesMois]
  );

  const variablesValidees = useMemo(() =>
    variablesMois.filter(v => v.dateValidation),
    [variablesMois]
  );

  const totalVariables = useMemo(() =>
    variablesMois.reduce((acc, v) => acc + v.montant, 0),
    [variablesMois]
  );

  const totalPrimes = useMemo(() =>
    variablesMois.filter(v => v.type === 'Prime').reduce((acc, v) => acc + v.montant, 0),
    [variablesMois]
  );

  const totalAbsences = useMemo(() =>
    variablesMois.filter(v => v.type === 'Absence').reduce((acc, v) => acc + v.montant, 0),
    [variablesMois]
  );

  const salariesActifs = useMemo(() =>
    salaries.filter(s => s.statut === 'Actif'),
    [salaries]
  );

  // Handlers memoïsés
  const handleAddVariable = useCallback(() => {
    if (newVariable.salarieId && newVariable.montant) {
      addVariable({
        ...newVariable,
        mois: selectedMois,
        annee: selectedAnnee,
      });
      setShowAddDialog(false);
      setNewVariable({
        salarieId: '',
        type: 'Prime',
        montant: 0,
        description: '',
      });
    }
  }, [newVariable, selectedMois, selectedAnnee, addVariable]);

  const handleExport = useCallback(() => {
    const data = exportPrePaie(selectedMois, selectedAnnee);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prepaie-${selectedMois}-${selectedAnnee}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  }, [exportPrePaie, selectedMois, selectedAnnee]);

  const handleValiderVariable = useCallback((variableId: string) => {
    validerVariable(variableId, 'manager');
  }, [validerVariable]);

  const getSalarieName = useCallback((id: string) => {
    const s = salaries.find(sal => sal.id === id);
    return s ? `${s.prenom} ${s.nom}` : 'Inconnu';
  }, [salaries]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">Pré-Paie</h1>
          <p className="text-slate-400 mt-1">Gestion des variables et export comptable</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-slate-800 hover:bg-slate-800/80 text-slate-200">
                <Plus className="w-4 h-4" />
                Ajouter une variable
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0B1121] border-slate-700/20 text-slate-200">
              <DialogHeader>
                <DialogTitle>Nouvelle variable de paie</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Salarié</Label>
                  <Select
                    value={newVariable.salarieId}
                    onValueChange={v => setNewVariable({...newVariable, salarieId: v})}
                  >
                    <SelectTrigger className="bg-slate-800/20 border-slate-700/30 text-slate-200">
                      <SelectValue placeholder="Sélectionner un salarié" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B1121] border-slate-700/20">
                      {salariesActifs.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.prenom} {s.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={newVariable.type}
                    onValueChange={v => setNewVariable({...newVariable, type: v as any})}
                  >
                    <SelectTrigger className="bg-slate-800/20 border-slate-700/30 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B1121] border-slate-700/20">
                      {TYPES_VARIABLE.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Montant (€)</Label>
                  <Input
                    type="number"
                    value={newVariable.montant || ''}
                    onChange={e => setNewVariable({...newVariable, montant: Number(e.target.value)})}
                    className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={newVariable.description}
                    onChange={e => setNewVariable({...newVariable, description: e.target.value})}
                    placeholder="Motif de la variable..."
                    className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="border-slate-700/30 text-slate-200">
                  Annuler
                </Button>
                <Button onClick={handleAddVariable} className="bg-slate-800 hover:bg-slate-800/80 text-slate-200">
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 border-slate-700/30 text-slate-200 hover:bg-slate-800/20">
                <Download className="w-4 h-4" />
                Exporter
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0B1121] border-slate-700/20 text-slate-200">
              <DialogHeader>
                <DialogTitle>Exporter la pré-paie</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mois</Label>
                    <Select value={selectedMois.toString()} onValueChange={v => setSelectedMois(Number(v))}>
                      <SelectTrigger className="bg-slate-800/20 border-slate-700/30 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0B1121] border-slate-700/20">
                        {MOIS.map(m => (
                          <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Année</Label>
                    <Select value={selectedAnnee.toString()} onValueChange={v => setSelectedAnnee(Number(v))}>
                      <SelectTrigger className="bg-slate-800/20 border-slate-700/30 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0B1121] border-slate-700/20">
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-slate-800/20 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-2">Résumé de l'export</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Période:</span>
                      <span className="text-slate-200">{MOIS.find(m => m.value === selectedMois)?.label} {selectedAnnee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Salariés:</span>
                      <span className="text-slate-200">{salariesActifs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Variables:</span>
                      <span className="text-slate-200">{variablesMois.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowExportDialog(false)} className="border-slate-700/30 text-slate-200">
                  Annuler
                </Button>
                <Button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Exporter en JSON
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs Pré-paie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICardPrepaie
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          label="Total Primes"
          value={`${totalPrimes.toLocaleString('fr-FR')} €`}
          color="green"
        />

        <KPICardPrepaie
          icon={<TrendingDown className="w-5 h-5 text-rose-400" />}
          label="Total Absences"
          value={`${totalAbsences.toLocaleString('fr-FR')} €`}
          color="red"
        />

        <KPICardPrepaie
          icon={<Euro className="w-5 h-5 text-slate-200" />}
          label="Total Variables"
          value={`${totalVariables.toLocaleString('fr-FR')} €`}
        />

        <KPICardPrepaie
          icon={<Clock className="w-5 h-5 text-slate-200" />}
          label="En attente"
          value={variablesEnAttente.length.toString()}
        />
      </div>

      {/* Impact Burn Rate */}
      {totalPrimes > 5000 && (
        <GlassCard borderColor="orange" className="bg-amber-500/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-400 mb-1">Impact sur le Burn Rate</h4>
              <p className="text-sm text-slate-300">
                Les primes de ce mois ({totalPrimes.toLocaleString('fr-FR')} €) augmentent le Burn Rate de {' '}
                {Math.round(totalPrimes * 0.45).toLocaleString('fr-FR')} € (charges incluses).
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Runway recalculé: {kpis.runwayMois} mois
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      <Tabs defaultValue="en-attente" className="w-full">
        <TabsList className="bg-slate-800/20 border border-slate-700/20">
          <TabsTrigger value="en-attente" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-200">
            <Clock className="w-4 h-4 mr-2" />
            En attente ({variablesEnAttente.length})
          </TabsTrigger>
          <TabsTrigger value="validees" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-200">
            <CheckCircle className="w-4 h-4 mr-2" />
            Validées ({variablesValidees.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en-attente" className="space-y-4">
          {variablesEnAttente.length === 0 ? (
            <GlassCard>
              <p className="text-slate-500 text-center py-8">Aucune variable en attente</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variablesEnAttente.map(variable => (
                <VariableCard
                  key={variable.id}
                  variable={variable}
                  getSalarieName={getSalarieName}
                  onValider={handleValiderVariable}
                  showValidation
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="validees" className="space-y-4">
          {variablesValidees.length === 0 ? (
            <GlassCard>
              <p className="text-slate-500 text-center py-8">Aucune variable validée</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variablesValidees.map(variable => (
                <VariableCard
                  key={variable.id}
                  variable={variable}
                  getSalarieName={getSalarieName}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
});
