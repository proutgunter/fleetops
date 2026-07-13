// ══════════════════════════════════════════════
//  FleetOps — Données de démonstration
//  Utilisées quand l'API n'est pas disponible.
//  Reproduit exactement les données des mockups validés.
// ══════════════════════════════════════════════

import type {
  TransportRequest,
  Site,
  VehicleType,
  VehicleAccessory,
  DailyAssignment,
  PlanningTruckRow,
  User,
} from '../types';

// ── Utilisateur connecté (CDT) ─────────────

export const currentUser: User = {
  id: 'usr-1',
  email: 'p.dupont@entreprise.lu',
  firstName: 'Pierre',
  lastName: 'Dupont',
  role: 'conducteur_travaux',
  initials: 'PD',
};

// ── Types de véhicules ─────────────────────

export const vehicleTypes: VehicleType[] = [
  { id: 'vt-1', code: '2AX', label: '2 axes benne', category: 'benne' },
  { id: 'vt-2', code: '3AX', label: '3 axes', category: 'benne' },
  { id: 'vt-3', code: '4AX', label: '4 axes benne', category: 'benne' },
  { id: 'vt-4', code: '4AG', label: '4 axes grue', category: 'grue' },
  { id: 'vt-5', code: 'BIB', label: 'Bi-benne', category: 'benne' },
  { id: 'vt-6', code: 'CAI', label: 'Caisse', category: 'caisse' },
];

// ── Accessoires ────────────────────────────

export const vehicleAccessories: VehicleAccessory[] = [
  { id: 'acc-1', code: 'REM', label: 'Remorque', compatibleVehicleTypeIds: ['vt-1', 'vt-2', 'vt-3', 'vt-4', 'vt-5'] },
  { id: 'acc-2', code: 'PLT', label: 'Plateau', compatibleVehicleTypeIds: ['vt-1', 'vt-2', 'vt-3', 'vt-4', 'vt-5', 'vt-6'] },
  { id: 'acc-3', code: 'GRP', label: 'Grappin', compatibleVehicleTypeIds: ['vt-4'] }, // Grappin → grue uniquement
];

// ── Chantiers ──────────────────────────────

export const sites: Site[] = [
  {
    id: 'site-1', code: '40215', name: 'Kirchberg T2',
    address: '2 Rue du Fort Thüngen', city: 'Luxembourg',
    supervisorId: 'usr-1', supervisorName: 'P. Dupont', isActive: true,
  },
  {
    id: 'site-2', code: '40320', name: 'Belval Résidence C',
    address: '12 Avenue du Rock\'n\'Roll', city: 'Esch-sur-Alzette',
    supervisorId: 'usr-1', supervisorName: 'P. Dupont', isActive: true,
  },
  {
    id: 'site-3', code: '40412', name: 'Strassen Lot 12',
    address: '45 Route d\'Arlon', city: 'Strassen',
    supervisorId: 'usr-2', supervisorName: 'J. Klein', isActive: true,
  },
  {
    id: 'site-4', code: '40510', name: 'Gasperich Bureau A',
    address: '1 Rue de Gasperich', city: 'Luxembourg',
    supervisorId: 'usr-1', supervisorName: 'P. Dupont', isActive: true,
  },
  {
    id: 'site-5', code: '40612', name: 'Mersch Pont Rail',
    address: '8 Rue de la Gare', city: 'Mersch',
    supervisorId: 'usr-2', supervisorName: 'J. Klein', isActive: true,
  },
];

// ── Demandes de transport ──────────────────

export const requests: TransportRequest[] = [
  {
    id: 'req-1',
    siteId: 'site-1', site: sites[0],
    vehicleTypeId: 'vt-3', vehicleType: vehicleTypes[2],
    accessoryIds: [], accessories: [],
    quantity: 2,
    missionMode: 'duration',
    startTime: '07:00', endTime: '12:00',
    tripCount: null,
    description: 'Évacuation terre niv. -2 parking',
    priority: 'urgent',
    recurrenceType: 'recurring',
    recurrenceStart: '2026-06-01', recurrenceEnd: '2026-08-31',
    status: 'assigned',
    requestedById: 'usr-1', requestedByName: 'P. Dupont',
    createdAt: '2026-07-12T16:42:00Z', updatedAt: '2026-07-12T17:30:00Z',
  },
  {
    id: 'req-2',
    siteId: 'site-2', site: sites[1],
    vehicleTypeId: 'vt-4', vehicleType: vehicleTypes[3],
    accessoryIds: ['acc-3'], accessories: [vehicleAccessories[2]],
    quantity: 1,
    missionMode: 'trips',
    startTime: '08:30', endTime: null,
    tripCount: 1,
    description: 'Livraison palettes béton préfabriqué',
    priority: 'normal',
    recurrenceType: 'one_time',
    recurrenceStart: null, recurrenceEnd: null,
    status: 'submitted',
    requestedById: 'usr-1', requestedByName: 'P. Dupont',
    createdAt: '2026-07-12T16:50:00Z', updatedAt: '2026-07-12T16:50:00Z',
  },
  {
    id: 'req-3',
    siteId: 'site-4', site: sites[3],
    vehicleTypeId: 'vt-5', vehicleType: vehicleTypes[4],
    accessoryIds: ['acc-1'], accessories: [vehicleAccessories[0]],
    quantity: 1,
    missionMode: 'duration',
    startTime: '07:00', endTime: '12:00',
    tripCount: null,
    description: 'Apport remblai terrain stabilisé',
    priority: 'normal',
    recurrenceType: 'recurring',
    recurrenceStart: '2026-07-01', recurrenceEnd: '2026-07-31',
    status: 'assigned',
    requestedById: 'usr-1', requestedByName: 'P. Dupont',
    createdAt: '2026-07-01T09:00:00Z', updatedAt: '2026-07-12T14:00:00Z',
  },
  {
    id: 'req-4',
    siteId: 'site-1', site: sites[0],
    vehicleTypeId: 'vt-2', vehicleType: vehicleTypes[1],
    accessoryIds: [], accessories: [],
    quantity: 1,
    missionMode: 'trips',
    startTime: '09:00', endTime: null,
    tripCount: 4,
    description: 'Apport tout-venant pour sous-couche',
    priority: 'normal',
    recurrenceType: 'one_time',
    recurrenceStart: null, recurrenceEnd: null,
    status: 'completed',
    requestedById: 'usr-1', requestedByName: 'P. Dupont',
    createdAt: '2026-07-10T08:00:00Z', updatedAt: '2026-07-11T17:00:00Z',
  },
  {
    id: 'req-5',
    siteId: 'site-2', site: sites[1],
    vehicleTypeId: 'vt-3', vehicleType: vehicleTypes[2],
    accessoryIds: [], accessories: [],
    quantity: 1,
    missionMode: 'duration',
    startTime: '13:00', endTime: '17:00',
    tripCount: null,
    description: 'Évacuation déblais fouilles réseau',
    priority: 'normal',
    recurrenceType: 'one_time',
    recurrenceStart: null, recurrenceEnd: null,
    status: 'cancelled',
    requestedById: 'usr-1', requestedByName: 'P. Dupont',
    createdAt: '2026-07-09T10:00:00Z', updatedAt: '2026-07-09T14:00:00Z',
  },
];

// ── Affectations pour le planning du jour ──

export const planningRows: PlanningTruckRow[] = [
  {
    vehicleId: 'v-1', vehicleCode: 'C48', vehicleTypeLabel: '4 axes benne',
    vehicleStatus: 'active',
    assignments: [{
      id: 'asg-1', date: '2026-07-14', requestId: 'req-1',
      request: requests[0],
      vehicleId: 'v-1', vehicleCode: 'C48',
      vehicleTypeLabel: '4 axes benne',
      driverId: 'd-1', driverName: 'A. Ferreira', driverType: 'internal',
      missionDetails: 'Évacuation terre niv. -2 parking',
      source: 'auto_renewed',
      startTime: '07:00', endTime: '12:00',
      status: 'planned',
    }],
  },
  {
    vehicleId: 'v-2', vehicleCode: 'C52', vehicleTypeLabel: '4 axes benne',
    vehicleStatus: 'active',
    assignments: [{
      id: 'asg-2', date: '2026-07-14', requestId: 'req-1',
      request: requests[0],
      vehicleId: 'v-2', vehicleCode: 'C52',
      vehicleTypeLabel: '4 axes benne',
      driverId: 'd-2', driverName: 'M. Weber', driverType: 'internal',
      missionDetails: 'Évacuation terre niv. -2 parking',
      source: 'auto_renewed',
      startTime: '07:00', endTime: '12:00',
      status: 'planned',
    }],
  },
  {
    vehicleId: 'v-3', vehicleCode: 'C53', vehicleTypeLabel: '3 axes',
    vehicleStatus: 'active',
    assignments: [{
      id: 'asg-3', date: '2026-07-14', requestId: 'req-4',
      request: requests[3],
      vehicleId: 'v-3', vehicleCode: 'C53',
      vehicleTypeLabel: '3 axes',
      driverId: 'd-3', driverName: 'L. Rodrigues', driverType: 'internal',
      missionDetails: '4 voyages — Apport tout-venant',
      source: 'manual',
      startTime: '09:00', endTime: null,
      status: 'planned',
    }],
  },
  {
    vehicleId: 'v-4', vehicleCode: 'C55', vehicleTypeLabel: '4 axes grue',
    vehicleStatus: 'active',
    assignments: [{
      id: 'asg-4', date: '2026-07-14', requestId: 'req-2',
      request: requests[1],
      vehicleId: 'v-4', vehicleCode: 'C55',
      vehicleTypeLabel: '4 axes grue',
      driverId: 'd-4', driverName: 'N. Schmit', driverType: 'internal',
      missionDetails: 'Livraison palettes — 1 voyage',
      source: 'manual',
      startTime: '08:30', endTime: '10:30',
      status: 'planned',
    }],
  },
  {
    vehicleId: 'v-5', vehicleCode: 'C58', vehicleTypeLabel: 'Bi-benne',
    vehicleStatus: 'active',
    assignments: [{
      id: 'asg-5', date: '2026-07-14', requestId: 'req-3',
      request: requests[2],
      vehicleId: 'v-5', vehicleCode: 'C58',
      vehicleTypeLabel: 'Bi-benne',
      driverId: 'd-5', driverName: 'T. Kremer', driverType: 'internal',
      missionDetails: 'Apport remblai terrain stabilisé',
      source: 'auto_renewed',
      startTime: '07:00', endTime: '12:00',
      status: 'planned',
    }],
  },
  {
    vehicleId: 'v-6', vehicleCode: 'C60', vehicleTypeLabel: '4 axes benne',
    vehicleStatus: 'active',
    assignments: [], // Camion libre
  },
  {
    vehicleId: 'v-7', vehicleCode: 'C65', vehicleTypeLabel: '4 axes benne',
    vehicleStatus: 'reserve',
    assignments: [],
  },
];
