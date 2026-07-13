// ══════════════════════════════════════════════
//  AssignmentTable — tableau d'affectation central
//  Groupes : internes actifs, réserve, sous-traitants
//  Chaque ligne = camion + chauffeur + missions
// ══════════════════════════════════════════════

import { type CSSProperties } from 'react';
import Icon from '../Icons';

interface Mission {
  id: string;
  siteCode: string;
  siteName: string;
  startTime: string;
  endTime?: string;
  description: string;
  source: 'manual' | 'auto_renewed' | 'copilot';
}

interface TruckRow {
  vehicleCode: string;
  vehicleType: string;
  driverName: string;
  driverType: 'internal' | 'temporary' | 'subcontractor';
  missions: Mission[];
  hasConflict?: boolean;
  conflictMessage?: string;
  availableSlot?: string; // ex: "Disponible après 10h"
}

interface TruckGroup {
  label: string;
  type: 'active' | 'reserve' | 'subcontractor';
  trucks: TruckRow[];
}

interface Props {
  groups: TruckGroup[];
}

const GROUP_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  active:        { bg: '#eef2ff', border: '#c7d2fe', text: '#4338ca' },
  reserve:       { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' },
  subcontractor: { bg: '#f3e8ff', border: '#d8b4fe', text: '#6b21a8' },
};

const SOURCE_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  auto_renewed: { label: 'Reconduit', bg: '#dbeafe', color: '#1e40af' },
  manual:       { label: 'Manuel',    bg: '#d1fae5', color: '#065f46' },
  copilot:      { label: 'Copilot',   bg: '#ede9fe', color: '#5b21b6' },
};

export default function AssignmentTable({ groups }: Props) {
  return (
    <div style={tableS}>
      {groups.map((group) => {
        const gc = GROUP_COLORS[group.type];
        return (
          <div key={group.label} style={{ marginBottom: 20 }}>
            {/* En-tête de groupe */}
            <div style={{ ...groupHeaderS, background: gc.bg, borderColor: gc.border }}>
              <span style={{ ...groupLabelS, color: gc.text }}>{group.label}</span>
              <span style={{ fontSize: 11, color: gc.text }}>{group.trucks.length} camion{group.trucks.length > 1 ? 's' : ''}</span>
            </div>

            {/* Lignes camion */}
            {group.trucks.map((truck) => (
              <div key={truck.vehicleCode}
                style={{ ...rowS, ...(truck.hasConflict ? conflictRowS : {}) }}>

                {/* Identité camion */}
                <div style={truckIdS}>
                  <span style={vcodeS}>{truck.vehicleCode}</span>
                  <div style={truckInfoS}>
                    <span style={truckTypeS}>{truck.vehicleType}</span>
                    <span style={driverS}>
                      <Icon name="user" size={11} color="#9ca3af" />
                      {truck.driverName}
                      {truck.driverType === 'temporary' && <span style={tempBadgeS}>Intérim.</span>}
                    </span>
                  </div>
                </div>

                {/* Missions */}
                <div style={missionsS}>
                  {truck.missions.map((m) => {
                    const src = SOURCE_BADGE[m.source];
                    return (
                      <div key={m.id} style={missionS}>
                        <div style={missionTopS}>
                          <span style={mCodeS}>{m.siteCode}</span>
                          <span style={mSiteS}>{m.siteName}</span>
                          <span style={{ ...srcBadgeS, background: src.bg, color: src.color }}>{src.label}</span>
                        </div>
                        <div style={mDetailS}>
                          <span>{m.startTime}{m.endTime ? `–${m.endTime}` : ''}</span>
                          <span>{m.description}</span>
                        </div>
                      </div>
                    );
                  })}

                  {truck.availableSlot && (
                    <div style={emptySlotS}>
                      <Icon name="plus" size={14} color="#9ca3af" />
                      {truck.availableSlot}
                    </div>
                  )}

                  {truck.missions.length === 0 && !truck.availableSlot && (
                    <div style={emptySlotS}>
                      <Icon name="plus" size={14} color="#9ca3af" />
                      Aucune mission — glisser une demande ici
                    </div>
                  )}
                </div>

                {/* Indicateur conflit */}
                {truck.hasConflict && (
                  <div style={conflictTagS}>
                    <Icon name="alert-triangle" size={13} />
                    <span>{truck.conflictMessage}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

const tableS: CSSProperties = { flex: 1, overflowY: 'auto', padding: '16px 20px' };
const groupHeaderS: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '8px 14px', borderRadius: 8, border: '1px solid',
  marginBottom: 8,
};
const groupLabelS: CSSProperties = { fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 };
const rowS: CSSProperties = {
  display: 'flex', alignItems: 'flex-start', gap: 14,
  padding: '10px 14px', background: '#fff', borderRadius: 10,
  border: '1px solid #e5e7eb', marginBottom: 6, position: 'relative',
};
const conflictRowS: CSSProperties = {
  borderColor: '#fca5a5', background: '#fef2f2',
};
const truckIdS: CSSProperties = { width: 130, flexShrink: 0 };
const vcodeS: CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700,
  color: '#111827', display: 'block', marginBottom: 2,
};
const truckInfoS: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2 };
const truckTypeS: CSSProperties = { fontSize: 11, color: '#6b7280' };
const driverS: CSSProperties = {
  fontSize: 12, color: '#374151', display: 'flex', alignItems: 'center', gap: 4,
};
const tempBadgeS: CSSProperties = {
  fontSize: 9, fontWeight: 600, background: '#fef3c7', color: '#92400e',
  padding: '1px 6px', borderRadius: 6,
};
const missionsS: CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 };
const missionS: CSSProperties = {
  padding: '6px 10px', background: '#f9fafb', borderRadius: 6, border: '1px solid #f3f4f6',
};
const missionTopS: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3,
};
const mCodeS: CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700,
  color: '#374151', background: '#e5e7eb', padding: '0 5px', borderRadius: 3,
};
const mSiteS: CSSProperties = { fontSize: 12, fontWeight: 500, color: '#111827', flex: 1 };
const srcBadgeS: CSSProperties = {
  fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 6,
};
const mDetailS: CSSProperties = { display: 'flex', gap: 10, fontSize: 11, color: '#6b7280' };
const emptySlotS: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px',
  border: '1px dashed #d1d5db', borderRadius: 6, color: '#9ca3af',
  fontSize: 12, cursor: 'pointer',
};
const conflictTagS: CSSProperties = {
  position: 'absolute', top: 8, right: 10,
  display: 'flex', alignItems: 'center', gap: 4,
  fontSize: 10, fontWeight: 600, color: '#dc2626',
  background: '#fee2e2', padding: '3px 8px', borderRadius: 6,
};
