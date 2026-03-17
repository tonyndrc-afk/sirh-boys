// ═══════════════════════════════════════════════════════════════════════════════
// SECTION TEMPS & ACTIVITÉS - Congés et télétravail (OPTIMISÉ)
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
  Calendar as CalendarIcon,
  Plus,
  Home,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp
} from 'lucide-react';
import type { TypeConge, Pole } from '@/types';
import { format, differenceInDays } from 'date-fns';

const TYPES_CONGE: { value: TypeConge; label: string; color: string }[] = [
  { value: 'CP', label: 'Congés payés', color: 'bg-sky-500/20 text-sky-400' },
  { value: 'RTT', label: 'RTT', color: 'bg-emerald-500/20 text-emerald-400' },
  { value: 'Maladie', label: 'Maladie', color: 'bg-rose-500/20 text-rose-400' },
  { value: 'Sans solde', label: 'Sans solde', color: 'bg-amber-500/20 text-amber-400' },
  { value: 'Formation', label: 'Formation', color: 'bg-violet-500/20 text-violet-400' },
];

const POLES: Pole[] = ['Tech', 'Produit', 'Business', 'Support', 'Direction'];

// Composant Carte Congé - memoïsé
const CongeCard = memo(function CongeCard({
  conge,
  getSalarieName,
  onValider,
  showActions = false
}: {
  conge: { id: string; salarieId: string; type: TypeConge; dateDebut: string; dateFin: string; nbJours: number; statut: string };
  getSalarieName: (id: string) => string;
  onValider?: (id: string, approuve: boolean) => void;
  showActions?: boolean;
}) {
  const typeInfo = TYPES_CONGE.find(t => t.value === conge.type);

  return (
    <div className="bg-[#0B1121]/50 border border-slate-700/20 rounded-lg p-3 hover:border-slate-700/30 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-slate-200">{getSalarieName(conge.salarieId)}</p>
          <p className="text-sm text-slate-400">
            {format(new Date(conge.dateDebut), 'dd/MM/yyyy')} → {format(new Date(conge.dateFin), 'dd/MM/yyyy')}
          </p>
          <p className="text-sm text-slate-400">{conge.nbJours} jour(s)</p>
        </div>
        <Badge className={typeInfo?.color}>
          {showActions ? typeInfo?.label : `${conge.nbJours}j`}
        </Badge>
      </div>
      {showActions && onValider && (
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
            onClick={() => onValider(conge.id, true)}
          >
            <CheckCircle className="w-3 h-3" />
            Approuver
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-rose-500/50 text-rose-400 hover:bg-rose-500/10 gap-1"
            onClick={() => onValider(conge.id, false)}
          >
            <XCircle className="w-3 h-3" />
            Refuser
          </Button>
        </div>
      )}
    </div>
  );
});

// Composant Carte Télétravail - memoïsé
const TeletravailCard = memo(function TeletravailCard({
  salarie
}: {
  salarie: { id: string; prenom: string; nom: string; pole: string; teletravailJours: number };
}) {
  return (
    <div className="bg-[#0B1121]/50 border border-slate-700/20 rounded-lg p-4 hover:border-slate-700/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-medium text-slate-200">{salarie.prenom} {salarie.nom}</p>
          <p className="text-sm text-slate-400">{salarie.pole}</p>
        </div>
        <Badge variant="secondary" className="bg-slate-800/30 text-slate-200">
          {salarie.teletravailJours}j/sem
        </Badge>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 bg-slate-800/20 rounded-lg p-2 text-center">
          <Home className="w-4 h-4 mx-auto mb-1 text-slate-400" />
          <p className="text-xs text-slate-400">TT</p>
        </div>
        <div className="flex-1 bg-slate-800/20 rounded-lg p-2 text-center">
          <Building2 className="w-4 h-4 mx-auto mb-1 text-slate-400" />
          <p className="text-xs text-slate-400">Bureau</p>
        </div>
      </div>
    </div>
  );
});

// Composant Carte Absence Pole - memoïsé
const AbsencePoleCard = memo(function AbsencePoleCard({
  pole,
  taux,
  count
}: {
  pole: string;
  taux: number;
  count: number;
}) {
  return (
    <div
      className={`bg-[#0B1121]/50 border rounded-lg p-4 ${
        taux > 30 ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-700/20'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-slate-200">{pole}</p>
        {taux > 30 && <AlertTriangle className="w-4 h-4 text-rose-400" />}
      </div>
      <p className="text-3xl font-bold text-slate-200 font-mono">{taux}%</p>
      <p className="text-sm text-slate-400 mt-1">
        {count} salarié(s)
      </p>
      <div className="mt-3 h-2 bg-slate-800/30 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            taux > 30 ? 'bg-rose-400' : taux > 20 ? 'bg-amber-400' : 'bg-emerald-400'
          }`}
          style={{ width: `${Math.min(taux, 100)}%` }}
        />
      </div>
    </div>
  );
});

// Composant principal - memoïsé
export const TempsActivites = memo(function TempsActivites() {
  const { salaries, conges, demanderConge, validerConge, getTauxAbsencePole } = useSIRHStore();

  const [selectedDates, setSelectedDates] = useState<{ from?: Date; to?: Date }>({});
  const [selectedSalarie, setSelectedSalarie] = useState('');
  const [selectedType, setSelectedType] = useState<TypeConge>('CP');
  const [motif, setMotif] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  // Memoization des listes filtrées
  const congesEnAttente = useMemo(() =>
    conges.filter(c => c.statut === 'En attente'),
    [conges]
  );

  const congesApprouves = useMemo(() =>
    conges.filter(c => c.statut === 'Approuvé'),
    [conges]
  );

  const salariesActifs = useMemo(() =>
    salaries.filter(s => s.statut === 'Actif'),
    [salaries]
  );

  // Memoization du handler
  const handleDemandeConge = useCallback(() => {
    if (selectedSalarie && selectedDates.from && selectedDates.to) {
      const nbJours = differenceInDays(selectedDates.to, selectedDates.from) + 1;
      demanderConge({
        salarieId: selectedSalarie,
        type: selectedType,
        dateDebut: format(selectedDates.from, 'yyyy-MM-dd'),
        dateFin: format(selectedDates.to, 'yyyy-MM-dd'),
        nbJours,
        motif: motif || undefined,
      });
      setShowDialog(false);
      setSelectedDates({});
      setSelectedSalarie('');
      setMotif('');
    }
  }, [selectedSalarie, selectedDates, selectedType, motif, demanderConge]);

  const handleValiderConge = useCallback((congeId: string, approuve: boolean) => {
    validerConge(congeId, 'manager', approuve);
  }, [validerConge]);

  const getSalarieName = useCallback((id: string) => {
    const s = salaries.find(sal => sal.id === id);
    return s ? `${s.prenom} ${s.nom}` : 'Inconnu';
  }, [salaries]);

  // Vérification des alertes de risque - memoïsée
  const polesEnRisque = useMemo(() =>
    POLES.filter(pole => getTauxAbsencePole(pole) > 30),
    [getTauxAbsencePole]
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">Temps & Activités</h1>
          <p className="text-slate-400 mt-1">Gestion des congés et télétravail</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-slate-800 hover:bg-slate-800/80 text-slate-200">
              <Plus className="w-4 h-4" />
              Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0B1121] border-slate-700/20 text-slate-200 max-w-lg">
            <DialogHeader>
              <DialogTitle>Nouvelle demande de congé</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Salarié</Label>
                <Select value={selectedSalarie} onValueChange={setSelectedSalarie}>
                  <SelectTrigger className="bg-slate-800/20 border-slate-700/30 text-slate-200">
                    <SelectValue placeholder="Sélectionner un salarié" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0B1121] border-slate-700/20">
                    {salariesActifs.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.prenom} {s.nom} — {s.poste}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type de congé</Label>
                <Select value={selectedType} onValueChange={v => setSelectedType(v as TypeConge)}>
                  <SelectTrigger className="bg-slate-800/20 border-slate-700/30 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0B1121] border-slate-700/20">
                    {TYPES_CONGE.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Période</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={selectedDates.from ? format(selectedDates.from, 'yyyy-MM-dd') : ''}
                    onChange={e => setSelectedDates({...selectedDates, from: e.target.value ? new Date(e.target.value) : undefined})}
                    className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                  />
                  <Input
                    type="date"
                    value={selectedDates.to ? format(selectedDates.to, 'yyyy-MM-dd') : ''}
                    onChange={e => setSelectedDates({...selectedDates, to: e.target.value ? new Date(e.target.value) : undefined})}
                    className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                  />
                </div>
                {selectedDates.from && selectedDates.to && (
                  <p className="text-sm text-slate-400">
                    Durée: {differenceInDays(selectedDates.to, selectedDates.from) + 1} jour(s)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Motif (optionnel)</Label>
                <Input
                  value={motif}
                  onChange={e => setMotif(e.target.value)}
                  placeholder="Motif de l'absence..."
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)} className="border-slate-700/30 text-slate-200">
                Annuler
              </Button>
              <Button onClick={handleDemandeConge} className="bg-slate-800 hover:bg-slate-800/80 text-slate-200">
                Soumettre la demande
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alertes de risque */}
      {polesEnRisque.length > 0 && (
        <GlassCard borderColor="red" className="bg-rose-500/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h4 className="font-semibold text-rose-400 mb-1">Alerte Key Person Risk</h4>
              <p className="text-sm text-slate-300">
                {polesEnRisque.map(pole => (
                  <span key={pole}>Le pôle <strong>{pole}</strong> a plus de 30% d'absences. </span>
                ))}
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      <Tabs defaultValue="conges" className="w-full">
        <TabsList className="bg-slate-800/20 border border-slate-700/20">
          <TabsTrigger value="conges" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-200">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Congés
          </TabsTrigger>
          <TabsTrigger value="teletravail" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-200">
            <Home className="w-4 h-4 mr-2" />
            Télétravail
          </TabsTrigger>
          <TabsTrigger value="absences-pole" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-200">
            <Users className="w-4 h-4 mr-2" />
            Absences par pôle
          </TabsTrigger>
        </TabsList>

        {/* Onglet Congés */}
        <TabsContent value="conges" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Demandes en attente */}
            <GlassCard title={`Demandes en attente (${congesEnAttente.length})`} icon={<Clock className="w-5 h-5" />}>
              <div className="space-y-3">
                {congesEnAttente.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Aucune demande en attente</p>
                ) : (
                  congesEnAttente.map(conge => (
                    <CongeCard
                      key={conge.id}
                      conge={conge}
                      getSalarieName={getSalarieName}
                      onValider={handleValiderConge}
                      showActions
                    />
                  ))
                )}
              </div>
            </GlassCard>

            {/* Congés approuvés */}
            <GlassCard title="Congés approuvés" icon={<CheckCircle className="w-5 h-5" />}>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {congesApprouves.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Aucun congé approuvé</p>
                ) : (
                  congesApprouves.slice(0, 10).map(conge => (
                    <CongeCard
                      key={conge.id}
                      conge={conge}
                      getSalarieName={getSalarieName}
                    />
                  ))
                )}
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Onglet Télétravail */}
        <TabsContent value="teletravail">
          <GlassCard title="Suivi du télétravail" icon={<Home className="w-5 h-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {salariesActifs.map(salarie => (
                <TeletravailCard key={salarie.id} salarie={salarie} />
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        {/* Onglet Absences par pôle */}
        <TabsContent value="absences-pole">
          <GlassCard title="Taux d'absence par pôle" icon={<TrendingUp className="w-5 h-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {POLES.map(pole => {
                const taux = getTauxAbsencePole(pole);
                const salariesPole = salaries.filter(s => s.pole === pole && s.statut === 'Actif');

                return (
                  <AbsencePoleCard
                    key={pole}
                    pole={pole}
                    taux={taux}
                    count={salariesPole.length}
                  />
                );
              })}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
});
