// ═══════════════════════════════════════════════════════════════════════════════
// SECTION RECRUTEMENT - Plan de recrutement et workflow
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
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
  Calendar,
  Users,
  UserCheck
} from 'lucide-react';
import type { PosteARecruter, PrioriteRecrutement, Pole, Candidat } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const priorites: { value: PrioriteRecrutement; label: string; color: string }[] = [
  { value: 'Critique', label: 'Critique', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  { value: 'Élevé', label: 'Élevé', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { value: 'Moyen', label: 'Moyen', color: 'bg-slate-800/30 text-slate-200 border-slate-700/30' },
  { value: 'Faible', label: 'Faible', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
];

const poles: Pole[] = ['Tech', 'Produit', 'Business', 'Support', 'Direction'];

export function Recrutement() {
  const { postesARecruter, addPoste, updatePoste, addCandidat, updateCandidat } = useSIRHStore();
  const [selectedPoste, setSelectedPoste] = useState<PosteARecruter | null>(null);
  const [showAddPoste, setShowAddPoste] = useState(false);
  const [showAddCandidat, setShowAddCandidat] = useState(false);

  // Formulaires
  const [newPoste, setNewPoste] = useState<Partial<PosteARecruter>>({
    pole: 'Tech',
    priorite: 'Moyen',
    statut: 'En cours',
  });
  const [newCandidat, setNewCandidat] = useState<Partial<Candidat>>({
    statut: 'Nouveau',
  });

  const postesCritiques = postesARecruter.filter(p => p.priorite === 'Critique');
  const postesEleves = postesARecruter.filter(p => p.priorite === 'Élevé');
  const postesMoyens = postesARecruter.filter(p => p.priorite === 'Moyen');
  const postesPourvus = postesARecruter.filter(p => p.statut === 'Pourvu');

  const handleAddPoste = () => {
    if (newPoste.titre && newPoste.description) {
      addPoste(newPoste as Omit<PosteARecruter, 'id' | 'dateOuverture' | 'candidats'>);
      setShowAddPoste(false);
      setNewPoste({
        pole: 'Tech',
        priorite: 'Moyen',
        statut: 'En cours',
      });
    }
  };

  const handleAddCandidat = () => {
    if (selectedPoste && newCandidat.nom && newCandidat.prenom && newCandidat.email) {
      addCandidat(selectedPoste.id, newCandidat as Omit<Candidat, 'id' | 'dateCandidature'>);
      setShowAddCandidat(false);
      setNewCandidat({ statut: 'Nouveau' });
    }
  };

  const handleStartOnboarding = (candidat: Candidat) => {
    if (selectedPoste) {
      // Mettre à jour le poste comme pourvu
      updatePoste(selectedPoste.id, { statut: 'Pourvu' });
      updateCandidat(selectedPoste.id, candidat.id, { statut: 'Accepté' });
      setSelectedPoste(null);
    }
  };

  const renderPosteCard = (poste: PosteARecruter) => (
    <div
      key={poste.id}
      className="bg-[#0B1121]/50 border border-slate-700/20 rounded-lg p-4 hover:border-slate-700/40 transition-all cursor-pointer"
      onClick={() => setSelectedPoste(poste)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-200">{poste.titre}</h4>
          <p className="text-sm text-slate-400">{poste.pole}</p>
        </div>
        <Badge className={priorites.find(p => p.value === poste.priorite)?.color}>
          {poste.priorite}
        </Badge>
      </div>

      <p className="text-sm text-slate-400 line-clamp-2 mb-3">{poste.description}</p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-slate-400">
            <Users className="w-4 h-4 inline mr-1" />
            {poste.candidats.length} candidat(s)
          </span>
          {poste.dateObjectif && (
            <span className="text-slate-400">
              <Calendar className="w-4 h-4 inline mr-1" />
              {format(new Date(poste.dateObjectif), 'MMM yyyy')}
            </span>
          )}
        </div>
        <span className="font-mono text-slate-200">
          {poste.salaireBudget.toLocaleString('fr-FR')} €
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">Plan de Recrutement</h1>
          <p className="text-slate-400 mt-1">Séquençage 12 mois — 9 recrutements stratégiques</p>
        </div>
        <Dialog open={showAddPoste} onOpenChange={setShowAddPoste}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-slate-800 hover:bg-slate-800/80 text-slate-200">
              <Plus className="w-4 h-4" />
              Nouveau poste
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0B1121] border-slate-700/20 text-slate-200 max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau poste à pourvoir</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Titre du poste</Label>
                <Input
                  value={newPoste.titre || ''}
                  onChange={e => setNewPoste({...newPoste, titre: e.target.value})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pôle</Label>
                  <Select value={newPoste.pole} onValueChange={v => setNewPoste({...newPoste, pole: v as Pole})}>
                    <SelectTrigger className="bg-slate-800/20 border-slate-700/30 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B1121] border-slate-700/20">
                      {poles.map(pole => (
                        <SelectItem key={pole} value={pole}>{pole}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priorité</Label>
                  <Select value={newPoste.priorite} onValueChange={v => setNewPoste({...newPoste, priorite: v as PrioriteRecrutement})}>
                    <SelectTrigger className="bg-slate-800/20 border-slate-700/30 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B1121] border-slate-700/20">
                      {priorites.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newPoste.description || ''}
                  onChange={e => setNewPoste({...newPoste, description: e.target.value})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Profil attendu</Label>
                <Input
                  value={newPoste.profilAttendu || ''}
                  onChange={e => setNewPoste({...newPoste, profilAttendu: e.target.value})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Budget annuel (€)</Label>
                <Input
                  type="number"
                  value={newPoste.salaireBudget || ''}
                  onChange={e => setNewPoste({...newPoste, salaireBudget: Number(e.target.value)})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Date objectif</Label>
                <Input
                  type="date"
                  value={newPoste.dateObjectif || ''}
                  onChange={e => setNewPoste({...newPoste, dateObjectif: e.target.value})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Justification</Label>
                <Input
                  value={newPoste.justification || ''}
                  onChange={e => setNewPoste({...newPoste, justification: e.target.value})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddPoste(false)} className="border-slate-700/30 text-slate-200">
                Annuler
              </Button>
              <Button onClick={handleAddPoste} className="bg-slate-800 hover:bg-slate-800/80 text-slate-200">
                Créer le poste
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Compteur héro */}
      <GlassCard className="text-center py-8">
        <div className="flex items-center justify-center gap-4 text-4xl font-mono font-bold mb-4">
          <span className="text-slate-200">{postesARecruter.length}</span>
          <span className="text-slate-500">·</span>
          <span className="text-rose-400">{postesCritiques.length}</span>
          <span className="text-slate-500">·</span>
          <span className="text-amber-400">{postesEleves.length}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{postesMoyens.length}</span>
        </div>
        <div className="flex items-center justify-center gap-6">
          <Badge className="bg-rose-500/20 text-rose-400">Critique</Badge>
          <Badge className="bg-amber-500/20 text-amber-400">Élevé</Badge>
          <Badge className="bg-slate-800/30 text-slate-200">Moyen</Badge>
        </div>
      </GlassCard>

      {/* Timeline */}
      <Tabs defaultValue="tous" className="w-full">
        <TabsList className="bg-slate-800/20 border border-slate-700/20">
          <TabsTrigger value="tous" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-200">
            Tous ({postesARecruter.length})
          </TabsTrigger>
          <TabsTrigger value="critique" className="data-[state=active]:bg-rose-500/30 data-[state=active]:text-rose-400">
            Critique ({postesCritiques.length})
          </TabsTrigger>
          <TabsTrigger value="eleve" className="data-[state=active]:bg-amber-500/30 data-[state=active]:text-amber-400">
            Élevé ({postesEleves.length})
          </TabsTrigger>
          <TabsTrigger value="moyen" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-200">
            Moyen ({postesMoyens.length})
          </TabsTrigger>
          <TabsTrigger value="pourvu" className="data-[state=active]:bg-emerald-500/30 data-[state=active]:text-emerald-400">
            Pourvu ({postesPourvus.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tous" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {postesARecruter.map(renderPosteCard)}
          </div>
        </TabsContent>

        <TabsContent value="critique" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {postesCritiques.map(renderPosteCard)}
          </div>
        </TabsContent>

        <TabsContent value="eleve" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {postesEleves.map(renderPosteCard)}
          </div>
        </TabsContent>

        <TabsContent value="moyen" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {postesMoyens.map(renderPosteCard)}
          </div>
        </TabsContent>

        <TabsContent value="pourvu" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {postesPourvus.map(renderPosteCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Détails Poste */}
      <Dialog open={!!selectedPoste} onOpenChange={() => setSelectedPoste(null)}>
        <DialogContent className="bg-[#0B1121] border-slate-700/20 text-slate-200 max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedPoste && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{selectedPoste.titre}</DialogTitle>
                  <Badge className={priorites.find(p => p.value === selectedPoste.priorite)?.color}>
                    {selectedPoste.priorite}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Pôle:</span>
                    <span className="ml-2 text-slate-200">{selectedPoste.pole}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Budget:</span>
                    <span className="ml-2 text-slate-200 font-mono">{selectedPoste.salaireBudget.toLocaleString('fr-FR')} €</span>
                  </div>
                  {selectedPoste.dateObjectif && (
                    <div>
                      <span className="text-slate-400">Date objectif:</span>
                      <span className="ml-2 text-slate-200">{format(new Date(selectedPoste.dateObjectif), 'dd MMMM yyyy', { locale: fr })}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-200 mb-2">Description</h4>
                  <p className="text-sm text-slate-400">{selectedPoste.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-200 mb-2">Profil attendu</h4>
                  <p className="text-sm text-slate-400">{selectedPoste.profilAttendu}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-200 mb-2">Justification</h4>
                  <p className="text-sm text-slate-400 italic">"{selectedPoste.justification}"</p>
                </div>

                {/* Candidats */}
                <div className="border-t border-slate-700/20 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-slate-200">
                      Candidats ({selectedPoste.candidats.length})
                    </h4>
                    <Dialog open={showAddCandidat} onOpenChange={setShowAddCandidat}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-1 bg-slate-800 hover:bg-slate-800/80 text-slate-200">
                          <Plus className="w-3 h-3" />
                          Ajouter
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0B1121] border-slate-700/20 text-slate-200">
                        <DialogHeader>
                          <DialogTitle>Nouveau candidat</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Prénom</Label>
                              <Input
                                value={newCandidat.prenom || ''}
                                onChange={e => setNewCandidat({...newCandidat, prenom: e.target.value})}
                                className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Nom</Label>
                              <Input
                                value={newCandidat.nom || ''}
                                onChange={e => setNewCandidat({...newCandidat, nom: e.target.value})}
                                className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                              type="email"
                              value={newCandidat.email || ''}
                              onChange={e => setNewCandidat({...newCandidat, email: e.target.value})}
                              className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Téléphone</Label>
                            <Input
                              value={newCandidat.telephone || ''}
                              onChange={e => setNewCandidat({...newCandidat, telephone: e.target.value})}
                              className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddCandidat(false)} className="border-slate-700/30 text-slate-200">
                            Annuler
                          </Button>
                          <Button onClick={handleAddCandidat} className="bg-slate-800 hover:bg-slate-800/80 text-slate-200">
                            Ajouter
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2">
                    {selectedPoste.candidats.length === 0 ? (
                      <p className="text-slate-500 text-center py-4">Aucun candidat</p>
                    ) : (
                      selectedPoste.candidats.map(candidat => (
                        <div key={candidat.id} className="flex items-center justify-between bg-slate-800/10 rounded-lg p-3">
                          <div>
                            <p className="font-medium text-slate-200">{candidat.prenom} {candidat.nom}</p>
                            <p className="text-sm text-slate-400">{candidat.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-slate-800/30 text-slate-200">
                              {candidat.statut}
                            </Badge>
                            {candidat.statut === 'Accepté' && selectedPoste.statut !== 'Pourvu' && (
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                                onClick={() => handleStartOnboarding(candidat)}
                              >
                                <UserCheck className="w-3 h-3" />
                                Embaucher
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
