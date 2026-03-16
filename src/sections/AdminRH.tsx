// ═══════════════════════════════════════════════════════════════════════════════
// SECTION ADMINISTRATION RH - Gestion des salariés et contrats
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useSIRHStore } from '@/store/sirhStore';
import { GlassCard } from '@/components/ui-custom/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Search,
  Plus,
  FileSignature,
  Mail,
  Briefcase,
  Euro,
  CheckCircle,
  AlertCircle,
  Download
} from 'lucide-react';
import type { Salarie, Pole, TypeContrat } from '@/types';

const poles: Pole[] = ['Tech', 'Produit', 'Business', 'Support', 'Direction'];
const typesContrat: TypeContrat[] = ['CDI', 'CDD', 'Freelance', 'Stage'];

export function AdminRH() {
  const { salaries, addSalarie, signerContrat } = useSIRHStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSalarie, setSelectedSalarie] = useState<Salarie | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSignature, setShowSignature] = useState(false);

  // Formulaire nouveau salarié
  const [newSalarie, setNewSalarie] = useState<Partial<Salarie>>({
    pole: 'Tech',
    typeContrat: 'CDI',
    teletravailJours: 2,
    congesAcquis: 25,
    congesPris: 0,
    rttAcquis: 12,
    rttPris: 0,
    competences: [],
    contratSigne: false,
    statut: 'Actif',
  });

  const filteredSalaries = salaries.filter(s =>
    s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.pole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSalarie = () => {
    if (newSalarie.nom && newSalarie.prenom && newSalarie.email && newSalarie.salaireBrutMensuel) {
      addSalarie(newSalarie as Omit<Salarie, 'id' | 'salaireAnnuel'>);
      setNewSalarie({
        pole: 'Tech',
        typeContrat: 'CDI',
        teletravailJours: 2,
        congesAcquis: 25,
        congesPris: 0,
        rttAcquis: 12,
        rttPris: 0,
        competences: [],
        contratSigne: false,
        statut: 'Actif',
      });
      setIsEditing(false);
    }
  };

  const handleSignature = () => {
    if (selectedSalarie) {
      signerContrat(selectedSalarie.id, new Date().toISOString().split('T')[0]);
      setShowSignature(false);
      setSelectedSalarie(null);
    }
  };

  const handleExportFiche = (salarie: Salarie) => {
    const fiche = {
      ...salarie,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(fiche, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiche-${salarie.nom.toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">Administration RH</h1>
          <p className="text-slate-400 mt-1">Gestion des dossiers salariés et contrats</p>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-slate-800 hover:bg-slate-800/80 text-slate-200">
              <Plus className="w-4 h-4" />
              Nouveau salarié
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0B1121] border-slate-700/20 text-slate-200 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau salarié</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input
                  value={newSalarie.prenom || ''}
                  onChange={e => setNewSalarie({...newSalarie, prenom: e.target.value})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  value={newSalarie.nom || ''}
                  onChange={e => setNewSalarie({...newSalarie, nom: e.target.value})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newSalarie.email || ''}
                  onChange={e => setNewSalarie({...newSalarie, email: e.target.value})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  value={newSalarie.telephone || ''}
                  onChange={e => setNewSalarie({...newSalarie, telephone: e.target.value})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Poste</Label>
                <Input
                  value={newSalarie.poste || ''}
                  onChange={e => setNewSalarie({...newSalarie, poste: e.target.value})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Pôle</Label>
                <Select
                  value={newSalarie.pole}
                  onValueChange={v => setNewSalarie({...newSalarie, pole: v as Pole})}
                >
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
                <Label>Type de contrat</Label>
                <Select
                  value={newSalarie.typeContrat}
                  onValueChange={v => setNewSalarie({...newSalarie, typeContrat: v as TypeContrat})}
                >
                  <SelectTrigger className="bg-slate-800/20 border-slate-700/30 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0B1121] border-slate-700/20">
                    {typesContrat.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Salaire brut mensuel (€)</Label>
                <Input
                  type="number"
                  value={newSalarie.salaireBrutMensuel || ''}
                  onChange={e => setNewSalarie({...newSalarie, salaireBrutMensuel: Number(e.target.value)})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Date d'entrée</Label>
                <Input
                  type="date"
                  value={newSalarie.dateEntree || ''}
                  onChange={e => setNewSalarie({...newSalarie, dateEntree: e.target.value})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Date de naissance</Label>
                <Input
                  type="date"
                  value={newSalarie.dateNaissance || ''}
                  onChange={e => setNewSalarie({...newSalarie, dateNaissance: e.target.value})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Jours de télétravail / semaine</Label>
                <Input
                  type="number"
                  min={0}
                  max={5}
                  value={newSalarie.teletravailJours}
                  onChange={e => setNewSalarie({...newSalarie, teletravailJours: Number(e.target.value)})}
                  className="bg-slate-800/20 border-slate-700/30 text-slate-200"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="border-slate-700/30 text-slate-200">
                Annuler
              </Button>
              <Button onClick={handleAddSalarie} className="bg-slate-800 hover:bg-slate-800/80 text-slate-200">
                Créer le salarié
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des salariés */}
      <GlassCard>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Rechercher un salarié..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/20 border-slate-700/30 text-slate-200"
            />
          </div>
          <Badge variant="secondary" className="bg-slate-800/30 text-slate-200">
            {filteredSalaries.length} salarié(s)
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSalaries.map(salarie => (
            <div
              key={salarie.id}
              className="bg-[#0B1121]/50 border border-slate-700/20 rounded-lg p-4 hover:border-slate-700/40 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-slate-200">{salarie.prenom} {salarie.nom}</h4>
                  <p className="text-sm text-slate-400">{salarie.poste}</p>
                </div>
                <div className="flex gap-1">
                  {!salarie.contratSigne && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-amber-400 hover:text-amber-400 hover:bg-amber-400/10"
                      onClick={() => {
                        setSelectedSalarie(salarie);
                        setShowSignature(true);
                      }}
                      title="Signer le contrat"
                    >
                      <FileSignature className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-slate-200 hover:bg-slate-800/20"
                    onClick={() => handleExportFiche(salarie)}
                    title="Exporter la fiche"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{salarie.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{salarie.pole}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Euro className="w-3.5 h-3.5" />
                  <span>{salarie.salaireBrutMensuel.toLocaleString('fr-FR')} €/mois</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={salarie.contratSigne
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/20 text-amber-400"
                  }
                >
                  {salarie.contratSigne ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Signé</>
                  ) : (
                    <><AlertCircle className="w-3 h-3 mr-1" /> En attente</>
                  )}
                </Badge>
                <Badge variant="secondary" className="bg-slate-800/30 text-slate-200">
                  {salarie.typeContrat}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Dialog Signature */}
      <Dialog open={showSignature} onOpenChange={setShowSignature}>
        <DialogContent className="bg-[#0B1121] border-slate-700/20 text-slate-200">
          <DialogHeader>
            <DialogTitle>Signature électronique du contrat</DialogTitle>
          </DialogHeader>
          {selectedSalarie && (
            <div className="py-4">
              <p className="text-slate-400 mb-4">
                Vous êtes sur le point de signer le contrat de travail de :
              </p>
              <div className="bg-slate-800/20 rounded-lg p-4 mb-4">
                <p className="font-semibold text-slate-200">{selectedSalarie.prenom} {selectedSalarie.nom}</p>
                <p className="text-sm text-slate-400">{selectedSalarie.poste}</p>
                <p className="text-sm text-slate-400">Salaire: {selectedSalarie.salaireBrutMensuel.toLocaleString('fr-FR')} € brut/mois</p>
              </div>
              <div className="bg-slate-800/10 border border-slate-700/20 rounded-lg p-4 mb-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Zone de signature</p>
                <div className="h-24 border-2 border-dashed border-slate-700/30 rounded flex items-center justify-center">
                  <p className="text-slate-500 text-sm">Cliquez pour signer</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSignature(false)} className="border-slate-700/30 text-slate-200">
                  Annuler
                </Button>
                <Button onClick={handleSignature} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <FileSignature className="w-4 h-4" />
                  Signer le contrat
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
