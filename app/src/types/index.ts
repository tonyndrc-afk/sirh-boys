// ═══════════════════════════════════════════════════════════════════════════════
// TYPES SIRH BOYS - Plateforme RH Opérationnelle
// ═══════════════════════════════════════════════════════════════════════════════

// ─── ENUMS ───
export type Pole = 'Tech' | 'Produit' | 'Business' | 'Support' | 'Direction';
export type TypeContrat = 'CDI' | 'CDD' | 'Freelance' | 'Stage';
export type StatutSalarie = 'Actif' | 'En congé' | 'En attente' | 'Sorti';
export type TypeConge = 'CP' | 'RTT' | 'Maladie' | 'Sans solde' | 'Formation';
export type StatutConge = 'En attente' | 'Approuvé' | 'Refusé' | 'Annulé';
export type PrioriteRecrutement = 'Critique' | 'Élevé' | 'Moyen' | 'Faible';
export type StatutRecrutement = 'En cours' | 'Publié' | 'En sélection' | 'Pourvu' | 'Annulé' | 'En attente';
export type EtapeOnboarding = 'Signature' | 'Matériel' | 'Accès IT' | 'Formation' | 'Intégré';

// ─── SALARIÉ ───
export interface Salarie {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateNaissance: string;
  dateEntree: string;
  poste: string;
  pole: Pole;
  typeContrat: TypeContrat;
  salaireBrutMensuel: number;
  salaireAnnuel: number;
  statut: StatutSalarie;
  managerId?: string;
  teletravailJours: number; // Nombre de jours de TT autorisés par semaine
  congesAcquis: number; // CP acquis
  congesPris: number;
  rttAcquis: number;
  rttPris: number;
  photo?: string;
  competences: string[];
  notes?: string;
  // Contrat
  contratSigne: boolean;
  dateSignature?: string;
  documentContrat?: string;
}

// ─── CONGÉ ───
export interface Conge {
  id: string;
  salarieId: string;
  type: TypeConge;
  dateDebut: string;
  dateFin: string;
  nbJours: number;
  motif?: string;
  statut: StatutConge;
  dateDemande: string;
  dateValidation?: string;
  validePar?: string;
  commentaire?: string;
}

// ─── TÉLÉTRAVAIL ───
export interface Teletravail {
  id: string;
  salarieId: string;
  date: string;
  presentiel: boolean; // false = télétravail
  commentaire?: string;
}

// ─── PRIME / VARIABLE ───
export interface VariablePaie {
  id: string;
  salarieId: string;
  mois: number;
  annee: number;
  type: 'Prime' | 'Heures sup.' | 'Absence' | 'Avantage' | 'Autre';
  montant: number;
  description: string;
  dateValidation?: string;
  validePar?: string;
}

// ─── RECRUTEMENT ───
export interface PosteARecruter {
  id: string;
  titre: string;
  pole: Pole;
  description: string;
  profilAttendu: string;
  salaireBudget: number;
  priorite: PrioriteRecrutement;
  statut: StatutRecrutement;
  dateOuverture: string;
  dateObjectif?: string;
  candidats: Candidat[];
  justification: string;
  competencesRequises: string[];
  // Lien SWOT
  opportuniteSwot?: string;
}

export interface Candidat {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateCandidature: string;
  statut: 'Nouveau' | 'En cours' | 'Entretien' | 'Test' | 'Refusé' | 'Accepté';
  notes?: string;
  cv?: string;
}

// ─── ONBOARDING ───
export interface Onboarding {
  id: string;
  salarieId: string;
  posteId: string;
  etape: EtapeOnboarding;
  checklist: ChecklistItem[];
  dateDebut: string;
  dateFinPrevue: string;
  dateFinReelle?: string;
  mentorId?: string;
}

export interface ChecklistItem {
  id: string;
  titre: string;
  description: string;
  complete: boolean;
  dateCompletion?: string;
}

// ─── KPIs ENTREPRISE ───
export interface KPIsEntreprise {
  telechargements: number;
  mau: number;
  abonnesPayants: number;
  arr: number;
  burnRateMensuel: number;
  runwayMois: number;
  seedLeve: number;
  nbSalaries: number;
  masseSalarialeAnnuelle: number;
}

// ─── ALERTES ───
export interface Alerte {
  id: string;
  type: 'Risque' | 'Info' | 'Warning' | 'Success';
  titre: string;
  message: string;
  date: string;
  lue: boolean;
  action?: string;
  actionData?: any;
}

// ─── ÉTAT GLOBAL ───
export interface SIRHState {
  // Données
  salaries: Salarie[];
  conges: Conge[];
  teletravails: Teletravail[];
  variablesPaie: VariablePaie[];
  postesARecruter: PosteARecruter[];
  onboardings: Onboarding[];
  alertes: Alerte[];
  kpis: KPIsEntreprise;
  
  // Actions Salariés
  addSalarie: (salarie: Omit<Salarie, 'id' | 'salaireAnnuel'>) => void;
  updateSalarie: (id: string, data: Partial<Salarie>) => void;
  removeSalarie: (id: string) => void;
  signerContrat: (salarieId: string, dateSignature: string) => void;
  
  // Actions Congés
  demanderConge: (conge: Omit<Conge, 'id' | 'dateDemande' | 'statut'>) => void;
  validerConge: (congeId: string, validePar: string, approuve: boolean, commentaire?: string) => void;
  
  // Actions Télétravail
  enregistrerPresence: (teletravail: Omit<Teletravail, 'id'>) => void;
  
  // Actions Variables
  addVariable: (variable: Omit<VariablePaie, 'id'>) => void;
  validerVariable: (variableId: string, validePar: string) => void;
  
  // Actions Recrutement
  addPoste: (poste: Omit<PosteARecruter, 'id' | 'dateOuverture' | 'candidats'>) => void;
  updatePoste: (id: string, data: Partial<PosteARecruter>) => void;
  addCandidat: (posteId: string, candidat: Omit<Candidat, 'id' | 'dateCandidature'>) => void;
  updateCandidat: (posteId: string, candidatId: string, data: Partial<Candidat>) => void;
  
  // Actions Onboarding
  startOnboarding: (salarieId: string, posteId: string, mentorId?: string) => void;
  completeChecklistItem: (onboardingId: string, itemId: string) => void;
  
  // Alertes
  addAlerte: (alerte: Omit<Alerte, 'id' | 'date' | 'lue'>) => void;
  markAlerteLue: (id: string) => void;
  
  // Calculs
  recalculerKPIs: () => void;
  getAbsencesPole: (pole: Pole, dateDebut: string, dateFin: string) => number;
  getTauxAbsencePole: (pole: Pole) => number;
  
  // Export
  exportPrePaie: (mois: number, annee: number) => string;
}

// ─── DONNÉES INITIALES ───
export const SALARIES_INITIAL: Omit<Salarie, 'id' | 'salaireAnnuel'>[] = [
  { nom: 'Martin', prenom: 'Thomas', email: 'thomas.martin@sonicshelf.fr', dateNaissance: '1990-03-15', dateEntree: '2024-01-15', poste: 'CEO (Cofondateur)', pole: 'Direction', typeContrat: 'CDI', salaireBrutMensuel: 8000, statut: 'Actif', teletravailJours: 2, congesAcquis: 25, congesPris: 5, rttAcquis: 12, rttPris: 2, competences: ['Leadership', 'Stratégie', 'Fundraising'], contratSigne: true, dateSignature: '2024-01-10' },
  { nom: 'Dubois', prenom: 'Sophie', email: 'sophie.dubois@sonicshelf.fr', dateNaissance: '1988-07-22', dateEntree: '2024-01-15', poste: 'CTO (Cofondateur)', pole: 'Direction', typeContrat: 'CDI', salaireBrutMensuel: 7500, statut: 'Actif', managerId: 'ceo', teletravailJours: 3, congesAcquis: 25, congesPris: 3, rttAcquis: 12, rttPris: 1, competences: ['Architecture IA', 'LLM', 'Management Tech'], contratSigne: true, dateSignature: '2024-01-10' },
  { nom: 'Bernard', prenom: 'Lucas', email: 'lucas.bernard@sonicshelf.fr', dateNaissance: '1992-11-08', dateEntree: '2024-02-01', poste: 'Ingénieur IA Senior', pole: 'Tech', typeContrat: 'CDI', salaireBrutMensuel: 5500, statut: 'Actif', managerId: 'cto', teletravailJours: 3, congesAcquis: 25, congesPris: 8, rttAcquis: 12, rttPris: 3, competences: ['Machine Learning', 'Python', 'PyTorch', 'NLP'], contratSigne: true, dateSignature: '2024-01-25' },
  { nom: 'Petit', prenom: 'Emma', email: 'emma.petit@sonicshelf.fr', dateNaissance: '1994-05-20', dateEntree: '2024-02-01', poste: 'Ingénieur IA', pole: 'Tech', typeContrat: 'CDI', salaireBrutMensuel: 4800, statut: 'Actif', managerId: 'cto', teletravailJours: 3, congesAcquis: 25, congesPris: 6, rttAcquis: 12, rttPris: 2, competences: ['Deep Learning', 'TensorFlow', 'Voice AI'], contratSigne: true, dateSignature: '2024-01-25' },
  { nom: 'Robert', prenom: 'Hugo', email: 'hugo.robert@sonicshelf.fr', dateNaissance: '1993-09-12', dateEntree: '2024-03-01', poste: 'Ingénieur IA', pole: 'Tech', typeContrat: 'CDI', salaireBrutMensuel: 4600, statut: 'Actif', managerId: 'cto', teletravailJours: 2, congesAcquis: 25, congesPris: 4, rttAcquis: 12, rttPris: 1, competences: ['TTS', 'Sound Design', 'Audio ML'], contratSigne: true, dateSignature: '2024-02-20' },
  { nom: 'Richard', prenom: 'Léa', email: 'lea.richard@sonicshelf.fr', dateNaissance: '1995-01-30', dateEntree: '2024-03-15', poste: 'Ingénieur IA Junior', pole: 'Tech', typeContrat: 'CDI', salaireBrutMensuel: 3800, statut: 'Actif', managerId: 'cto', teletravailJours: 2, congesAcquis: 25, congesPris: 2, rttAcquis: 12, rttPris: 0, competences: ['Python', 'Data Processing', 'LLM'], contratSigne: true, dateSignature: '2024-03-01' },
  { nom: 'Moreau', prenom: 'Nathan', email: 'nathan.moreau@sonicshelf.fr', dateNaissance: '1991-06-18', dateEntree: '2024-02-15', poste: 'Développeur Full-stack', pole: 'Tech', typeContrat: 'CDI', salaireBrutMensuel: 5000, statut: 'Actif', managerId: 'cto', teletravailJours: 3, congesAcquis: 25, congesPris: 7, rttAcquis: 12, rttPris: 2, competences: ['React', 'Node.js', 'TypeScript', 'AWS'], contratSigne: true, dateSignature: '2024-02-01' },
  { nom: 'Simon', prenom: 'Chloé', email: 'chloe.simon@sonicshelf.fr', dateNaissance: '1996-04-05', dateEntree: '2024-04-01', poste: 'Développeur Full-stack', pole: 'Tech', typeContrat: 'CDI', salaireBrutMensuel: 4200, statut: 'Actif', managerId: 'cto', teletravailJours: 2, congesAcquis: 25, congesPris: 3, rttAcquis: 12, rttPris: 1, competences: ['Vue.js', 'Python', 'PostgreSQL'], contratSigne: true, dateSignature: '2024-03-15' },
  { nom: 'Laurent', prenom: 'Maxime', email: 'maxime.laurent@sonicshelf.fr', dateNaissance: '1989-12-10', dateEntree: '2024-02-01', poste: 'UX/UI Designer', pole: 'Produit', typeContrat: 'CDI', salaireBrutMensuel: 4500, statut: 'Actif', managerId: 'pm', teletravailJours: 3, congesAcquis: 25, congesPris: 5, rttAcquis: 12, rttPris: 2, competences: ['Figma', 'Design System', 'User Research'], contratSigne: true, dateSignature: '2024-01-20' },
  { nom: 'Lefebvre', prenom: 'Julie', email: 'julie.lefebvre@sonicshelf.fr', dateNaissance: '1990-08-25', dateEntree: '2024-03-01', poste: 'Product Manager', pole: 'Produit', typeContrat: 'CDI', salaireBrutMensuel: 5200, statut: 'Actif', managerId: 'ceo', teletravailJours: 2, congesAcquis: 25, congesPris: 4, rttAcquis: 12, rttPris: 1, competences: ['Product Strategy', 'Agile', 'Data Analytics'], contratSigne: true, dateSignature: '2024-02-15' },
  { nom: 'Michel', prenom: 'Alexandre', email: 'alexandre.michel@sonicshelf.fr', dateNaissance: '1987-02-14', dateEntree: '2024-02-01', poste: 'Head of Content Partnerships', pole: 'Business', typeContrat: 'CDI', salaireBrutMensuel: 5800, statut: 'Actif', managerId: 'ceo', teletravailJours: 2, congesAcquis: 25, congesPris: 6, rttAcquis: 12, rttPris: 2, competences: ['Partnerships', 'Creator Economy', 'Negotiation'], contratSigne: true, dateSignature: '2024-01-20' },
  { nom: 'Garcia', prenom: 'Sarah', email: 'sarah.garcia@sonicshelf.fr', dateNaissance: '1993-10-03', dateEntree: '2024-04-01', poste: 'Growth Manager', pole: 'Business', typeContrat: 'CDI', salaireBrutMensuel: 4500, statut: 'Actif', managerId: 'head-content', teletravailJours: 2, congesAcquis: 25, congesPris: 2, rttAcquis: 12, rttPris: 0, competences: ['Growth Hacking', 'SEO', 'Paid Acquisition'], contratSigne: true, dateSignature: '2024-03-15' },
  { nom: 'Roux', prenom: 'Louis', email: 'louis.roux@sonicshelf.fr', dateNaissance: '1995-07-28', dateEntree: '2024-05-01', poste: 'Community Manager', pole: 'Business', typeContrat: 'CDI', salaireBrutMensuel: 3200, statut: 'Actif', managerId: 'growth', teletravailJours: 2, congesAcquis: 25, congesPris: 1, rttAcquis: 12, rttPris: 0, competences: ['Social Media', 'Content Creation', 'Community'], contratSigne: true, dateSignature: '2024-04-15' },
  { nom: 'Bonnet', prenom: 'Marie', email: 'marie.bonnet@sonicshelf.fr', dateNaissance: '1992-03-17', dateEntree: '2024-02-01', poste: 'Office Manager', pole: 'Support', typeContrat: 'CDI', salaireBrutMensuel: 3200, statut: 'Actif', managerId: 'ceo', teletravailJours: 0, congesAcquis: 25, congesPris: 5, rttAcquis: 12, rttPris: 1, competences: ['Office Management', 'Event Planning', 'Administration'], contratSigne: true, dateSignature: '2024-01-20' },
];

export const POSTES_RECRUTEMENT_INITIAL: Omit<PosteARecruter, 'id' | 'dateOuverture' | 'candidats'>[] = [
  { titre: 'Product Manager B2B Senior', pole: 'Produit', description: 'Piloter le développement de SonicShelf Studio', profilAttendu: 'Exp. SaaS, idéalement plateforme créateurs', salaireBudget: 65000, priorite: 'Critique', statut: 'En cours', dateObjectif: '2025-05-01', justification: 'Piloter développement Studio ; roadmap claire réclamée par équipe', competencesRequises: ['Product Management B2B', 'Discovery', 'Roadmap'], opportuniteSwot: 'Jeunes diplômés préfèrent startups IA' },
  { titre: 'Développeur Backend SaaS Senior', pole: 'Tech', description: 'Architecture multi-tenant et API scalable', profilAttendu: 'Architecture multi-tenant, API scalable', salaireBudget: 70000, priorite: 'Critique', statut: 'En cours', dateObjectif: '2025-05-01', justification: 'Prérequis technique au lancement de Studio', competencesRequises: ['Backend SaaS', 'Multi-tenant', 'API Design'], opportuniteSwot: 'Vague de restructurations GAFAM' },
  { titre: 'Tech Lead', pole: 'Tech', description: 'Leadership technique et management équipe', profilAttendu: 'Senior ML/full-stack, leadership équipe', salaireBudget: 75000, priorite: 'Critique', statut: 'En cours', dateObjectif: '2025-05-01', justification: 'Libérer CTO, gérer tension développeurs, réduire Key Person Risk', competencesRequises: ['Management', 'Tech Leadership', 'Full-stack'], opportuniteSwot: 'Course à l\'IA attire les talents' },
  { titre: 'Head of Sales B2B', pole: 'Business', description: 'Développer le canal B2B et acquérir des créateurs', profilAttendu: 'Exp. SaaS marketplace ou plateforme créateurs', salaireBudget: 80000, priorite: 'Élevé', statut: 'Publié', dateObjectif: '2025-08-01', justification: 'Acquérir 50 000 créateurs en 12 mois ; aucun profil sales actuel', competencesRequises: ['Vente B2B SaaS', 'Outbound', 'Inbound'], opportuniteSwot: 'Profils expérimentés disponibles' },
  { titre: 'Customer Success Manager', pole: 'Business', description: 'Onboarding, rétention et upsell des créateurs', profilAttendu: 'Onboarding, rétention, upsell SaaS B2B', salaireBudget: 50000, priorite: 'Élevé', statut: 'En cours', dateObjectif: '2025-08-01', justification: 'Activer et retenir les créateurs inscrits ; piloter NPS Studio', competencesRequises: ['Customer Success', 'Onboarding', 'Churn Management'], opportuniteSwot: 'Flexibilité attendue par Gen Y/Z' },
  { titre: 'Data Engineer', pole: 'Tech', description: 'Pipeline data et analytics narratif temps réel', profilAttendu: 'Pipeline data, analytics narratif temps réel', salaireBudget: 60000, priorite: 'Élevé', statut: 'En cours', dateObjectif: '2025-08-01', justification: 'Alimenter les analytics créateurs, KPIs SaaS (ARR, churn, LTV)', competencesRequises: ['Data Engineering', 'Analytics', 'Pipeline'], opportuniteSwot: 'Profils data disponibles' },
  { titre: 'People Manager / RH', pole: 'Support', description: 'Structuration RH et gestion des talents', profilAttendu: 'Structuration RH, SIRH, grilles salariales', salaireBudget: 55000, priorite: 'Moyen', statut: 'En attente', dateObjectif: '2025-11-01', justification: 'Formaliser processus RH avant expansion équipe à 30 personnes', competencesRequises: ['RH', 'SIRH', 'Grilles salariales'], opportuniteSwot: 'Travail hybride normalisé' },
  { titre: 'Growth Manager B2B', pole: 'Business', description: 'Acquisition créateurs et préparation Série A', profilAttendu: 'SEO, paid, marketing automation, PLG', salaireBudget: 50000, priorite: 'Moyen', statut: 'En attente', dateObjectif: '2025-11-01', justification: 'Accélérer acquisition créateurs et préparer Série A', competencesRequises: ['Growth B2B', 'SEO', 'Paid', 'PLG'], opportuniteSwot: 'Startups IA attractives' },
  { titre: '2e Sales B2B', pole: 'Business', description: 'Scalabilité de la force de vente', profilAttendu: 'Junior à confirmer selon traction', salaireBudget: 45000, priorite: 'Moyen', statut: 'En attente', dateObjectif: '2025-11-01', justification: 'Scaler force de vente si objectif 50 000 créateurs tenu', competencesRequises: ['Vente B2B', 'Prospection', 'Closing'], opportuniteSwot: 'Profils juniors disponibles' },
];

export const KPIS_INITIAL: KPIsEntreprise = {
  telechargements: 85000,
  mau: 18000,
  abonnesPayants: 6200,
  arr: 480000,
  burnRateMensuel: 165000,
  runwayMois: 14,
  seedLeve: 2500000,
  nbSalaries: 14,
  masseSalarialeAnnuelle: 1350000,
};
