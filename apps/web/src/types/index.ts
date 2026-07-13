// ══════════════════════════════════════════════
//  FleetOps — Types partagés côté frontend
// ══════════════════════════════════════════════

/** Rôles utilisateur */
export type UserRole = 'admin' | 'gestionnaire_transport' | 'conducteur_travaux' | 'chauffeur';

/** Utilisateur connecté */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  initials: string;
}

/** Type de véhicule */
export interface VehicleType {
  id: string;
  code: string;
  label: string;
  category: string;
}

/** Accessoire véhicule */
export interface VehicleAccessory {
  id: string;
  code: string;
  label: string;
  /** Types de véhicules compatibles (ex: grappin → grue uniquement) */
  compatibleVehicleTypeIds: string[];
}

/** Chantier */
export interface Site {
  id: string;
  code: string;          // Format XXXXX (5 chiffres)
  name: string;
  address: string;
  city: string;
  supervisorId: string;  // Conducteur de travaux responsable
  supervisorName: string;
  isActive: boolean;
}

/** Mode de mobilisation */
export type MissionMode = 'duration' | 'trips';

/** Statut de la demande */
export type RequestStatus =
  | 'draft'           // Brouillon
  | 'submitted'       // Soumise, en attente d'affectation
  | 'assigned'        // Affectée (camion + chauffeur)
  | 'partially_assigned' // Partiellement affectée (besoin > 1 camion)
  | 'in_progress'     // En cours d'exécution
  | 'completed'       // Terminée
  | 'cancelled';      // Annulée

/** Priorité */
export type RequestPriority = 'normal' | 'urgent';

/** Type de récurrence */
export type RecurrenceType = 'one_time' | 'recurring';

/** Demande de transport */
export interface TransportRequest {
  id: string;
  siteId: string;
  site: Site;
  vehicleTypeId: string;
  vehicleType: VehicleType;
  accessoryIds: string[];
  accessories: VehicleAccessory[];
  quantity: number;
  missionMode: MissionMode;
  /** Si mode = 'duration' : heure de début */
  startTime: string | null;
  /** Si mode = 'duration' : heure de fin */
  endTime: string | null;
  /** Si mode = 'trips' : nombre de voyages */
  tripCount: number | null;
  description: string;
  priority: RequestPriority;
  recurrenceType: RecurrenceType;
  /** Période de récurrence (début) */
  recurrenceStart: string | null;
  /** Période de récurrence (fin) */
  recurrenceEnd: string | null;
  status: RequestStatus;
  requestedById: string;
  requestedByName: string;
  createdAt: string;
  updatedAt: string;
}

/** Affectation quotidienne */
export interface DailyAssignment {
  id: string;
  date: string;
  requestId: string;
  request: TransportRequest;
  vehicleId: string;
  vehicleCode: string;
  vehicleTypeLabel: string;
  driverId: string;
  driverName: string;
  driverType: 'internal' | 'temporary' | 'subcontractor';
  missionDetails: string | null;
  source: 'manual' | 'auto_renewed' | 'copilot';
  startTime: string | null;
  endTime: string | null;
  status: 'planned' | 'started' | 'completed' | 'cancelled';
}

/** Vue planning — ligne camion pour une journée */
export interface PlanningTruckRow {
  vehicleId: string;
  vehicleCode: string;
  vehicleTypeLabel: string;
  vehicleStatus: 'active' | 'reserve' | 'maintenance';
  assignments: DailyAssignment[];
}

/** Paramètres de filtre pour les demandes */
export interface RequestFilters {
  status?: RequestStatus[];
  recurrenceType?: RecurrenceType;
  dateFrom?: string;
  dateTo?: string;
  siteId?: string;
}

/** Réponse API paginée */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/** Type de mission (table de référence) */
export interface MissionType {
  id: string;
  code: string;
  label: string;
}
