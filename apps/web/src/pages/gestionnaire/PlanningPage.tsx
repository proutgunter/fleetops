// ══════════════════════════════════════════════
//  Écran principal — Planning gestionnaire transport
//  Layout desktop 3 colonnes
// ══════════════════════════════════════════════

import { useState, type CSSProperties } from 'react';
import TopNav from '../../components/gestionnaire/TopNav';
import DateBar from '../../components/gestionnaire/DateBar';
import PendingSidebar from '../../components/gestionnaire/PendingSidebar';
import AssignmentTable from '../../components/gestionnaire/AssignmentTable';
import ResourceSidebar from '../../components/gestionnaire/ResourceSidebar';
import ActionBar from '../../components/gestionnaire/ActionBar';

// ── Données de démonstration ──────────────

const pendingGroups = [
  {
    id: 'cdt-1', initials: 'PD', name: 'P. Dupont', color: '#4f46e5',
    requests: [
      {
        id: 'pr-1', siteCode: '40215', siteName: 'Kirchberg T2',
        startTime: '07:00', endTime: '12:00', missionMode: 'duration' as const,
        vehicleTypeLabel: '4 axes benne', quantity: 2,
        description: 'Évacuation terre niv. -2 parking',
        priority: 'urgent' as const, createdLabel: 'Hier 16:42',
      },
      {
        id: 'pr-2', siteCode: '40320', siteName: 'Belval Résidence C',
        startTime: '08:30', missionMode: 'trips' as const, tripCount: 1,
        vehicleTypeLabel: '4 axes grue', quantity: 1,
        description: 'Livraison palettes — 1 voyage',
        priority: 'normal' as const, createdLabel: 'Hier 16:50',
      },
    ],
  },
  {
    id: 'cdt-2', initials: 'JK', name: 'J. Klein', color: '#059669',
    requests: [
      {
        id: 'pr-3', siteCode: '40412', siteName: 'Strassen Lot 12',
        startTime: '09:00', missionMode: 'trips' as const, tripCount: 3,
        vehicleTypeLabel: '3 axes', quantity: 1,
        description: '3 voyages — Apport tout-venant',
        priority: 'normal' as const, createdLabel: 'Hier 15:20',
      },
    ],
  },
];

const truckGroups = [
  {
    label: 'Camions internes', type: 'active' as const,
    trucks: [
      {
        vehicleCode: 'C48', vehicleType: '4 axes benne',
        driverName: 'R. Da Silva', driverType: 'internal' as const,
        hasConflict: true, conflictMessage: 'Chauffeur absent',
        missions: [{
          id: 'm-1', siteCode: '40215', siteName: 'Kirchberg T2',
          startTime: '07:00', endTime: '12:00',
          description: 'Évacuation terre — reconduit automatiquement',
          source: 'auto_renewed' as const,
        }],
      },
      {
        vehicleCode: 'C52', vehicleType: '4 axes benne',
        driverName: 'M. Weber', driverType: 'internal' as const,
        missions: [{
          id: 'm-2', siteCode: '40510', siteName: 'Gasperich Bureau A',
          startTime: '07:00', endTime: '12:00',
          description: 'Apport remblai terrain stabilisé',
          source: 'auto_renewed' as const,
        }],
      },
      {
        vehicleCode: 'C53', vehicleType: '3 axes',
        driverName: 'L. Rodrigues', driverType: 'internal' as const,
        missions: [{
          id: 'm-3', siteCode: '40612', siteName: 'Mersch Pont Rail',
          startTime: '07:00', endTime: '16:00',
          description: 'TTJ — Terrassement voirie',
          source: 'auto_renewed' as const,
        }],
      },
      {
        vehicleCode: 'C55', vehicleType: '4 axes grue',
        driverName: 'N. Schmit', driverType: 'internal' as const,
        missions: [{
          id: 'm-4', siteCode: '40320', siteName: 'Belval Résidence C',
          startTime: '07:00', endTime: '10:00',
          description: 'Pose éléments préfabriqués',
          source: 'manual' as const,
        }],
        availableSlot: 'Disponible après 10h',
      },
      {
        vehicleCode: 'C58', vehicleType: 'Bi-benne',
        driverName: 'T. Kremer', driverType: 'internal' as const,
        missions: [{
          id: 'm-5', siteCode: '40510', siteName: 'Gasperich Bureau A',
          startTime: '07:00', endTime: '12:00',
          description: 'Apport remblai terrain stabilisé',
          source: 'auto_renewed' as const,
        }],
      },
      {
        vehicleCode: 'C60', vehicleType: '4 axes benne',
        driverName: 'A. Ferreira', driverType: 'internal' as const,
        missions: [],
      },
    ],
  },
  {
    label: 'Réserve', type: 'reserve' as const,
    trucks: [
      {
        vehicleCode: 'C65', vehicleType: '4 axes benne',
        driverName: '—', driverType: 'internal' as const,
        missions: [],
        availableSlot: 'Camion de réserve — affecter un chauffeur',
      },
      {
        vehicleCode: 'C68', vehicleType: 'Bi-benne',
        driverName: '—', driverType: 'internal' as const,
        missions: [],
      },
    ],
  },
  {
    label: 'Sous-traitants', type: 'subcontractor' as const,
    trucks: [
      {
        vehicleCode: 'FR01', vehicleType: '4 axes benne',
        driverName: 'Transports Muller', driverType: 'subcontractor' as const,
        missions: [{
          id: 'm-6', siteCode: '40215', siteName: 'Kirchberg T2',
          startTime: '07:00', endTime: '12:00',
          description: 'Renfort évacuation terre',
          source: 'manual' as const,
        }],
      },
    ],
  },
];

const availableDrivers = [
  { name: 'A. Ferreira', license: 'CE', type: 'internal' as const },
  { name: 'P. Pereira', license: 'CE', type: 'temporary' as const, agency: 'Randstad' },
  { name: 'S. Begic', license: 'C', type: 'temporary' as const, agency: 'Manpower' },
];

const absentDrivers = [
  { name: 'R. Da Silva', reason: 'Maladie' },
];

const maintenanceVehicles = [
  { code: 'C63', reason: 'Maintenance préventive' },
];

const conflicts = [
  { id: 'c-1', message: 'C48 — R. Da Silva est absent demain mais affecté par reconduction automatique' },
];

// ── Composant principal ──────────────────

export default function GestionnairePlanningPage() {
  const today = new Date();
  const [dateOffset, setDateOffset] = useState(1); // Demain par défaut

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + dateOffset);

  const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const dateLabel = dateOffset === 1
    ? `Demain — ${jours[targetDate.getDay()]} ${targetDate.getDate()} ${mois[targetDate.getMonth()]}`
    : `${jours[targetDate.getDay()]} ${targetDate.getDate()} ${mois[targetDate.getMonth()]}`;

  const pendingCount = pendingGroups.reduce((s, g) => s + g.requests.length, 0);

  return (
    <div style={pageS}>
      <TopNav />
      <DateBar
        dateLabel={dateLabel}
        onPrev={() => setDateOffset(o => o - 1)}
        onNext={() => setDateOffset(o => o + 1)}
        onToday={() => setDateOffset(1)}
        conflicts={conflicts}
        pendingCount={pendingCount}
      />

      <div style={bodyS}>
        <PendingSidebar groups={pendingGroups} />
        <AssignmentTable groups={truckGroups} />
        <ResourceSidebar
          availableDrivers={availableDrivers}
          absentDrivers={absentDrivers}
          maintenanceVehicles={maintenanceVehicles}
        />
      </div>

      <ActionBar pendingCount={pendingCount} conflictCount={conflicts.length} />
    </div>
  );
}

const pageS: CSSProperties = {
  display: 'flex', flexDirection: 'column', height: '100vh',
  background: '#f1f3f8',
};
const bodyS: CSSProperties = {
  flex: 1, display: 'flex', overflow: 'hidden',
};
