// ═══════════════════════════════════════════════════════════════════════════════
// STORE ZUSTAND - SIRH Boys Opérationnel
// Logique métier interconnectée : Salaires → Burn Rate → Runway
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { 
  SIRHState, 
  Salarie, 
  Conge, 
  Teletravail, 
  VariablePaie, 
  PosteARecruter, 
  Candidat,
  Onboarding,
  Pole,
  Alerte
} from '@/types';
import { 
  SALARIES_INITIAL,
  POSTES_RECRUTEMENT_INITIAL,
  KPIS_INITIAL
} from '@/types';
import { format, addMonths } from 'date-fns';

// ─── UTILITAIRES ───
const generateId = () => Math.random().toString(36).substring(2, 15);

const calculerSalaireAnnuel = (salaireBrutMensuel: number): number => {
  return Math.round(salaireBrutMensuel * 12 * 1.45);
};

const calculerBurnRate = (salaries: Salarie[]): number => {
  const totalMensuel = salaries
    .filter(s => s.statut === 'Actif' || s.statut === 'En congé')
    .reduce((acc, s) => acc + s.salaireBrutMensuel, 0);
  return Math.round(totalMensuel * 1.45);
};

const calculerMasseSalariale = (salaries: Salarie[]): number => {
  return salaries
    .filter(s => s.statut === 'Actif' || s.statut === 'En congé')
    .reduce((acc, s) => acc + s.salaireAnnuel, 0);
};

const calculerRunway = (seedLeve: number, burnRate: number): number => {
  if (burnRate === 0) return 999;
  return Math.floor(seedLeve / burnRate);
};

// ─── DONNÉES INITIALES EXEMPLES ───
const CONGES_INITIAL: Omit<Conge, 'id'>[] = [
  { salarieId: 'placeholder1', type: 'CP', dateDebut: '2025-03-10', dateFin: '2025-03-14', nbJours: 5, motif: 'Vacances printemps', statut: 'Approuvé', dateDemande: '2025-02-15T10:30:00Z', dateValidation: '2025-02-16T09:00:00Z', validePar: 'manager' },
  { salarieId: 'placeholder2', type: 'RTT', dateDebut: '2025-03-20', dateFin: '2025-03-21', nbJours: 2, motif: 'Week-end prolongé', statut: 'Approuvé', dateDemande: '2025-03-01T14:00:00Z', dateValidation: '2025-03-02T10:00:00Z', validePar: 'manager' },
  { salarieId: 'placeholder3', type: 'Maladie', dateDebut: '2025-02-25', dateFin: '2025-02-28', nbJours: 4, motif: 'Arrêt maladie', statut: 'Approuvé', dateDemande: '2025-02-25T08:00:00Z', dateValidation: '2025-02-25T09:30:00Z', validePar: 'manager' },
  { salarieId: 'placeholder4', type: 'Formation', dateDebut: '2025-04-05', dateFin: '2025-04-09', nbJours: 5, motif: 'Conférence IA', statut: 'En attente', dateDemande: '2025-03-10T11:00:00Z' },
  { salarieId: 'placeholder5', type: 'CP', dateDebut: '2025-04-15', dateFin: '2025-04-25', nbJours: 9, motif: 'Vacances Pâques', statut: 'En attente', dateDemande: '2025-03-15T16:30:00Z' },
  { salarieId: 'placeholder6', type: 'Sans solde', dateDebut: '2025-05-01', dateFin: '2025-05-15', nbJours: 11, motif: 'Voyage personnel', statut: 'En attente', dateDemande: '2025-03-20T10:00:00Z' },
];

const VARIABLES_PAIE_INITIAL: Omit<VariablePaie, 'id'>[] = [
  { salarieId: 'placeholder1', mois: 2, annee: 2025, type: 'Prime', montant: 1500, description: 'Prime performance Q4 2024', dateValidation: '2025-02-25T10:00:00Z', validePar: 'manager' },
  { salarieId: 'placeholder2', mois: 2, annee: 2025, type: 'Heures sup.', montant: 450, description: 'Heures supplémentaires projet Studio', dateValidation: '2025-02-26T14:00:00Z', validePar: 'manager' },
  { salarieId: 'placeholder3', mois: 2, annee: 2025, type: 'Prime', montant: 800, description: 'Prime d\'équipe', dateValidation: '2025-02-24T09:00:00Z', validePar: 'manager' },
  { salarieId: 'placeholder4', mois: 2, annee: 2025, type: 'Absence', montant: -320, description: 'Absence maladie jour 1', dateValidation: '2025-02-25T11:00:00Z', validePar: 'manager' },
  { salarieId: 'placeholder5', mois: 2, annee: 2025, type: 'Avantage', montant: 50, description: 'Forfait télétravail', dateValidation: '2025-02-20T10:00:00Z', validePar: 'manager' },
  { salarieId: 'placeholder6', mois: 3, annee: 2025, type: 'Prime', montant: 2000, description: 'Prime de recommandation' },
  { salarieId: 'placeholder7', mois: 3, annee: 2025, type: 'Heures sup.', montant: 600, description: 'Week-end de déploiement' },
];

const ALERTES_INITIAL: Omit<Alerte, 'id' | 'date'>[] = [
  { type: 'Risque', titre: 'Key Person Risk', message: 'Le pôle Tech a plus de 30% d\'absences prévues en avril. Risque opérationnel sur le lancement Studio.', lue: false, action: 'risk' },
  { type: 'Warning', titre: 'Burn Rate élevé', message: 'Les primes de février augmentent le Burn Rate de 725€. Runway recalculé.', lue: false },
  { type: 'Info', titre: 'Nouveau candidat', message: 'Un candidat a postulé pour le poste de Tech Lead.', lue: true },
  { type: 'Success', titre: 'Contrat signé', message: 'Le contrat de Lucas Bernard a été signé le 25/01/2024.', lue: true },
];

// ─── STORE ───
export const useSIRHStore = create<SIRHState>()(
  immer((set, get) => {
    // Création des salariés avec IDs
    const salariesWithIds = SALARIES_INITIAL.map(s => ({
      ...s,
      id: generateId(),
      salaireAnnuel: calculerSalaireAnnuel(s.salaireBrutMensuel),
    }));

    // Mapping des IDs pour les données initiales
    const getSalarieIdByIndex = (index: number) => salariesWithIds[index]?.id || '';

    // Congés avec vrais IDs
    const congesWithIds = CONGES_INITIAL.map(c => ({
      ...c,
      id: generateId(),
      salarieId: getSalarieIdByIndex(parseInt(c.salarieId.replace('placeholder', '')) - 1),
    })).filter(c => c.salarieId);

    // Variables de paie avec vrais IDs
    const variablesWithIds = VARIABLES_PAIE_INITIAL.map(v => ({
      ...v,
      id: generateId(),
      salarieId: getSalarieIdByIndex(parseInt(v.salarieId.replace('placeholder', '')) - 1),
    })).filter(v => v.salarieId);

    // Alertes initiales
    const alertesWithIds = ALERTES_INITIAL.map(a => ({
      ...a,
      id: generateId(),
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    return {
      // ═══ ÉTAT INITIAL ═══
      salaries: salariesWithIds,
      conges: congesWithIds,
      teletravails: [],
      variablesPaie: variablesWithIds,
      postesARecruter: POSTES_RECRUTEMENT_INITIAL.map(p => ({
        ...p,
        id: generateId(),
        dateOuverture: new Date().toISOString().split('T')[0],
        candidats: [
          ...(Math.random() > 0.5 ? [{
            id: generateId(),
            nom: 'Durand',
            prenom: 'Marie',
            email: 'marie.durand@email.com',
            dateCandidature: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            statut: 'Entretien' as const,
            notes: 'Profil très intéressant, bonne expérience SaaS',
          }] : []),
          ...(Math.random() > 0.7 ? [{
            id: generateId(),
            nom: 'Leroy',
            prenom: 'Pierre',
            email: 'pierre.leroy@email.com',
            dateCandidature: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
            statut: 'Nouveau' as const,
            notes: 'Candidature spontanée',
          }] : []),
        ],
      })),
      onboardings: [],
      alertes: alertesWithIds,
      kpis: KPIS_INITIAL,

      // ═══ ACTIONS SALARIÉS ═══
      addSalarie: (salarieData) => {
        set((state) => {
          const nouveauSalarie: Salarie = {
            ...salarieData,
            id: generateId(),
            salaireAnnuel: calculerSalaireAnnuel(salarieData.salaireBrutMensuel),
          };
          state.salaries.push(nouveauSalarie);
          
          state.kpis.burnRateMensuel = calculerBurnRate(state.salaries);
          state.kpis.masseSalarialeAnnuelle = calculerMasseSalariale(state.salaries);
          state.kpis.runwayMois = calculerRunway(state.kpis.seedLeve, state.kpis.burnRateMensuel);
          state.kpis.nbSalaries = state.salaries.filter(s => s.statut === 'Actif' || s.statut === 'En congé').length;
          
          state.alertes.unshift({
            id: generateId(),
            type: 'Success',
            titre: 'Nouveau salarié',
            message: `${nouveauSalarie.prenom} ${nouveauSalarie.nom} a rejoint l'équipe en tant que ${nouveauSalarie.poste}`,
            date: new Date().toISOString(),
            lue: false,
          });
        });
      },

      updateSalarie: (id, data) => {
        set((state) => {
          const index = state.salaries.findIndex(s => s.id === id);
          if (index === -1) return;
          
          const ancienSalaire = state.salaries[index].salaireBrutMensuel;
          
          Object.assign(state.salaries[index], data);
          
          if (data.salaireBrutMensuel && data.salaireBrutMensuel !== ancienSalaire) {
            state.salaries[index].salaireAnnuel = calculerSalaireAnnuel(data.salaireBrutMensuel);
            
            state.kpis.burnRateMensuel = calculerBurnRate(state.salaries);
            state.kpis.masseSalarialeAnnuelle = calculerMasseSalariale(state.salaries);
            state.kpis.runwayMois = calculerRunway(state.kpis.seedLeve, state.kpis.burnRateMensuel);
            
            const difference = data.salaireBrutMensuel - ancienSalaire;
            if (difference > 500) {
              state.alertes.unshift({
                id: generateId(),
                type: 'Warning',
                titre: 'Augmentation salariale',
                message: `${state.salaries[index].prenom} ${state.salaries[index].nom} : +${difference}€/mois. Burn Rate impacté.`,
                date: new Date().toISOString(),
                lue: false,
              });
            }
          }
        });
      },

      removeSalarie: (id) => {
        set((state) => {
          const salarie = state.salaries.find(s => s.id === id);
          if (!salarie) return;
          
          state.salaries = state.salaries.filter(s => s.id !== id);
          
          state.kpis.burnRateMensuel = calculerBurnRate(state.salaries);
          state.kpis.masseSalarialeAnnuelle = calculerMasseSalariale(state.salaries);
          state.kpis.runwayMois = calculerRunway(state.kpis.seedLeve, state.kpis.burnRateMensuel);
          state.kpis.nbSalaries = state.salaries.filter(s => s.statut === 'Actif' || s.statut === 'En congé').length;
          
          state.alertes.unshift({
            id: generateId(),
            type: 'Info',
            titre: 'Départ salarié',
            message: `${salarie.prenom} ${salarie.nom} n'est plus dans l'effectif`,
            date: new Date().toISOString(),
            lue: false,
          });
        });
      },

      signerContrat: (salarieId, dateSignature) => {
        set((state) => {
          const salarie = state.salaries.find(s => s.id === salarieId);
          if (salarie) {
            salarie.contratSigne = true;
            salarie.dateSignature = dateSignature;
            
            state.alertes.unshift({
              id: generateId(),
              type: 'Success',
              titre: 'Contrat signé',
              message: `Le contrat de ${salarie.prenom} ${salarie.nom} a été signé le ${format(new Date(dateSignature), 'dd/MM/yyyy')}`,
              date: new Date().toISOString(),
              lue: false,
            });
          }
        });
      },

      // ═══ ACTIONS CONGÉS ═══
      demanderConge: (congeData) => {
        set((state) => {
          const nouveauConge: Conge = {
            ...congeData,
            id: generateId(),
            dateDemande: new Date().toISOString(),
            statut: 'En attente',
          };
          state.conges.push(nouveauConge);
          
          const salarie = state.salaries.find(s => s.id === congeData.salarieId);
          if (salarie) {
            state.alertes.unshift({
              id: generateId(),
              type: 'Info',
              titre: 'Nouvelle demande de congé',
              message: `${salarie.prenom} ${salarie.nom} demande ${congeData.nbJours} jours de ${congeData.type}`,
              date: new Date().toISOString(),
              lue: false,
            });
          }
        });
      },

      validerConge: (congeId, validePar, approuve, commentaire) => {
        set((state) => {
          const conge = state.conges.find(c => c.id === congeId);
          if (!conge) return;
          
          conge.statut = approuve ? 'Approuvé' : 'Refusé';
          conge.dateValidation = new Date().toISOString();
          conge.validePar = validePar;
          if (commentaire) conge.commentaire = commentaire;
          
          const salarie = state.salaries.find(s => s.id === conge.salarieId);
          if (salarie && approuve) {
            if (conge.type === 'CP') {
              salarie.congesPris += conge.nbJours;
            } else if (conge.type === 'RTT') {
              salarie.rttPris += conge.nbJours;
            }
            
            const tauxAbsence = get().getTauxAbsencePole(salarie.pole);
            if (tauxAbsence > 30) {
              state.alertes.unshift({
                id: generateId(),
                type: 'Risque',
                titre: 'Alerte Key Person Risk',
                message: `Plus de 30% du pôle ${salarie.pole} sera absent simultanément. Risque opérationnel.`,
                date: new Date().toISOString(),
                lue: false,
                action: 'risk',
              });
            }
          }
        });
      },

      // ═══ ACTIONS TÉLÉTRAVAIL ═══
      enregistrerPresence: (teletravailData) => {
        set((state) => {
          const nouveauTeletravail: Teletravail = {
            ...teletravailData,
            id: generateId(),
          };
          state.teletravails.push(nouveauTeletravail);
        });
      },

      // ═══ ACTIONS VARIABLES ═══
      addVariable: (variableData) => {
        set((state) => {
          const nouvelleVariable: VariablePaie = {
            ...variableData,
            id: generateId(),
          };
          state.variablesPaie.push(nouvelleVariable);
          
          if (variableData.type === 'Prime' && variableData.montant > 500) {
            state.kpis.burnRateMensuel += Math.round(variableData.montant * 0.45);
            state.kpis.runwayMois = calculerRunway(state.kpis.seedLeve, state.kpis.burnRateMensuel);
            
            const salarie = state.salaries.find(s => s.id === variableData.salarieId);
            state.alertes.unshift({
              id: generateId(),
              type: 'Warning',
              titre: 'Prime attribuée',
              message: `${salarie?.prenom} ${salarie?.nom} : Prime de ${variableData.montant}€. Burn Rate impacté.`,
              date: new Date().toISOString(),
              lue: false,
            });
          }
        });
      },

      validerVariable: (variableId, validePar) => {
        set((state) => {
          const variable = state.variablesPaie.find(v => v.id === variableId);
          if (variable) {
            variable.dateValidation = new Date().toISOString();
            variable.validePar = validePar;
          }
        });
      },

      // ═══ ACTIONS RECRUTEMENT ═══
      addPoste: (posteData) => {
        set((state) => {
          const nouveauPoste: PosteARecruter = {
            ...posteData,
            id: generateId(),
            dateOuverture: new Date().toISOString().split('T')[0],
            candidats: [],
          };
          state.postesARecruter.push(nouveauPoste);
          
          state.alertes.unshift({
            id: generateId(),
            type: 'Info',
            titre: 'Nouveau poste ouvert',
            message: `${posteData.titre} - Priorité: ${posteData.priorite}`,
            date: new Date().toISOString(),
            lue: false,
          });
        });
      },

      updatePoste: (id, data) => {
        set((state) => {
          const poste = state.postesARecruter.find(p => p.id === id);
          if (poste) {
            Object.assign(poste, data);
            
            if (data.statut === 'Pourvu' && poste.candidats.some(c => c.statut === 'Accepté')) {
              state.alertes.unshift({
                id: generateId(),
                type: 'Success',
                titre: 'Poste pourvu',
                message: `${poste.titre} a été attribué`,
                date: new Date().toISOString(),
                lue: false,
              });
            }
          }
        });
      },

      addCandidat: (posteId, candidatData) => {
        set((state) => {
          const poste = state.postesARecruter.find(p => p.id === posteId);
          if (poste) {
            const nouveauCandidat: Candidat = {
              ...candidatData,
              id: generateId(),
              dateCandidature: new Date().toISOString(),
            };
            poste.candidats.push(nouveauCandidat);
          }
        });
      },

      updateCandidat: (posteId, candidatId, data) => {
        set((state) => {
          const poste = state.postesARecruter.find(p => p.id === posteId);
          if (poste) {
            const candidat = poste.candidats.find(c => c.id === candidatId);
            if (candidat) {
              Object.assign(candidat, data);
            }
          }
        });
      },

      // ═══ ACTIONS ONBOARDING ═══
      startOnboarding: (salarieId, posteId, mentorId) => {
        set((state) => {
          const salarie = state.salaries.find(s => s.id === salarieId);
          
          if (!salarie) return;
          
          const checklist = [
            { id: generateId(), titre: 'Signature du contrat', description: 'Contrat de travail signé par les deux parties', complete: salarie.contratSigne },
            { id: generateId(), titre: 'Configuration matérielle', description: 'Ordinateur, écran, accessoires', complete: false },
            { id: generateId(), titre: 'Accès IT', description: 'Email, Slack, GitHub, outils internes', complete: false },
            { id: generateId(), titre: 'Présentation équipe', description: 'Rencontre avec le pôle et le mentor', complete: false },
            { id: generateId(), titre: 'Formation produit', description: 'Présentation SonicShelf et Studio', complete: false },
            { id: generateId(), titre: 'Premier sprint', description: 'Intégration à l\'équipe de développement', complete: false },
          ];
          
          const onboarding: Onboarding = {
            id: generateId(),
            salarieId,
            posteId,
            etape: 'Signature',
            checklist,
            dateDebut: new Date().toISOString(),
            dateFinPrevue: addMonths(new Date(), 1).toISOString(),
            mentorId,
          };
          
          state.onboardings.push(onboarding);
          
          state.alertes.unshift({
            id: generateId(),
            type: 'Success',
            titre: 'Onboarding démarré',
            message: `Processus d\'intégration lancé pour ${salarie.prenom} ${salarie.nom}`,
            date: new Date().toISOString(),
            lue: false,
          });
        });
      },

      completeChecklistItem: (onboardingId, itemId) => {
        set((state) => {
          const onboarding = state.onboardings.find(o => o.id === onboardingId);
          if (!onboarding) return;
          
          const item = onboarding.checklist.find(i => i.id === itemId);
          if (item) {
            item.complete = true;
            item.dateCompletion = new Date().toISOString();
            
            const completedCount = onboarding.checklist.filter(i => i.complete).length;
            const total = onboarding.checklist.length;
            const progress = completedCount / total;
            
            if (progress >= 1) {
              onboarding.etape = 'Intégré';
              onboarding.dateFinReelle = new Date().toISOString();
              
              const salarie = state.salaries.find(s => s.id === onboarding.salarieId);
              state.alertes.unshift({
                id: generateId(),
                type: 'Success',
                titre: 'Onboarding terminé',
                message: `${salarie?.prenom} ${salarie?.nom} est maintenant pleinement intégré`,
                date: new Date().toISOString(),
                lue: false,
              });
            } else if (progress >= 0.66) {
              onboarding.etape = 'Formation';
            } else if (progress >= 0.33) {
              onboarding.etape = 'Accès IT';
            }
          }
        });
      },

      // ═══ ALERTES ═══
      addAlerte: (alerteData) => {
        set((state) => {
          state.alertes.unshift({
            ...alerteData,
            id: generateId(),
            date: new Date().toISOString(),
            lue: false,
          });
        });
      },

      markAlerteLue: (id) => {
        set((state) => {
          const alerte = state.alertes.find(a => a.id === id);
          if (alerte) {
            alerte.lue = true;
          }
        });
      },

      // ═══ CALCULS & GETTERS ═══
      recalculerKPIs: () => {
        set((state) => {
          state.kpis.burnRateMensuel = calculerBurnRate(state.salaries);
          state.kpis.masseSalarialeAnnuelle = calculerMasseSalariale(state.salaries);
          state.kpis.runwayMois = calculerRunway(state.kpis.seedLeve, state.kpis.burnRateMensuel);
          state.kpis.nbSalaries = state.salaries.filter(s => s.statut === 'Actif' || s.statut === 'En congé').length;
        });
      },

      getAbsencesPole: (pole: Pole, dateDebut: string, dateFin: string) => {
        const state = get();
        const salariesPole = state.salaries.filter(s => s.pole === pole && s.statut === 'Actif');
        
        const congesApprouves = state.conges.filter(c => {
          if (c.statut !== 'Approuvé') return false;
          const congeDebut = new Date(c.dateDebut);
          const congeFin = new Date(c.dateFin);
          const periodeDebut = new Date(dateDebut);
          const periodeFin = new Date(dateFin);
          
          return congeDebut <= periodeFin && congeFin >= periodeDebut;
        });
        
        return congesApprouves.filter(c => {
          const salarie = salariesPole.find(s => s.id === c.salarieId);
          return salarie !== undefined;
        }).length;
      },

      getTauxAbsencePole: (pole: Pole) => {
        const state = get();
        const salariesPole = state.salaries.filter(s => s.pole === pole && s.statut === 'Actif');
        if (salariesPole.length === 0) return 0;
        
        const today = new Date();
        const congesEnCours = state.conges.filter(c => {
          if (c.statut !== 'Approuvé') return false;
          const debut = new Date(c.dateDebut);
          const fin = new Date(c.dateFin);
          return debut <= today && fin >= today;
        });
        
        const absents = congesEnCours.filter(c => {
          const salarie = salariesPole.find(s => s.id === c.salarieId);
          return salarie !== undefined;
        }).length;
        
        return Math.round((absents / salariesPole.length) * 100);
      },

      // ═══ EXPORT PRÉ-PAIE ═══
      exportPrePaie: (mois: number, annee: number) => {
        const state = get();
        
        const lignes = state.salaries
          .filter(s => s.statut === 'Actif' || s.statut === 'En congé')
          .map(s => {
            const variables = state.variablesPaie.filter(v => 
              v.salarieId === s.id && 
              v.mois === mois && 
              v.annee === annee &&
              v.dateValidation
            );
            
            const totalVariables = variables.reduce((acc, v) => acc + v.montant, 0);
            
            return {
              nom: `${s.prenom} ${s.nom}`,
              poste: s.poste,
              pole: s.pole,
              salaireBrut: s.salaireBrutMensuel,
              variables: totalVariables,
              total: s.salaireBrutMensuel + totalVariables,
            };
          });
        
        const totalGeneral = lignes.reduce((acc, l) => acc + l.total, 0);
        
        return JSON.stringify({
          periode: `${mois}/${annee}`,
          dateExport: new Date().toISOString(),
          nbSalaries: lignes.length,
          totalBrut: totalGeneral,
          totalAvecCharges: Math.round(totalGeneral * 1.45),
          lignes,
        }, null, 2);
      },
    };
  })
);
