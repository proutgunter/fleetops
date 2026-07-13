// ══════════════════════════════════════════════
//  ResourceSidebar — pool de ressources
//  Chauffeurs disponibles, absents, véhicules en maintenance
//  Bouton "Appeler un sous-traitant"
// ══════════════════════════════════════════════

import { type CSSProperties } from 'react';
import Icon from '../Icons';

interface Driver {
  name: string;
  license: string;
  type: 'internal' | 'temporary';
  agency?: string;
}

interface AbsentDriver {
  name: string;
  reason: string;
}

interface MaintenanceVehicle {
  code: string;
  reason: string;
}

interface Props {
  availableDrivers: Driver[];
  absentDrivers: AbsentDriver[];
  maintenanceVehicles: MaintenanceVehicle[];
}

export default function ResourceSidebar({ availableDrivers, absentDrivers, maintenanceVehicles }: Props) {
  return (
    <div style={sidebarS}>
      <div style={headerS}><span style={titleS}>Ressources</span></div>
      <div style={scrollS}>
        {/* Chauffeurs disponibles */}
        <Section title="Chauffeurs disponibles" count={availableDrivers.length}>
          {availableDrivers.map((d) => (
            <div key={d.name} style={itemS}>
              <span style={dotGreenS} />
              <span style={nameS}>{d.name}</span>
              <span style={detailS}>
                {d.license}
                {d.type === 'temporary' && d.agency && ` · ${d.agency}`}
              </span>
            </div>
          ))}
        </Section>

        {/* Intérimaires */}
        {availableDrivers.some(d => d.type === 'temporary') && (
          <div style={hintS}>
            Les intérimaires sont affectés après les chauffeurs internes
          </div>
        )}

        {/* Absents */}
        {absentDrivers.length > 0 && (
          <Section title="Absents demain" count={absentDrivers.length}>
            {absentDrivers.map((d) => (
              <div key={d.name} style={{ ...itemS, opacity: 0.6 }}>
                <span style={dotRedS} />
                <span style={nameS}>{d.name}</span>
                <span style={detailS}>{d.reason}</span>
              </div>
            ))}
          </Section>
        )}

        {/* Véhicules en maintenance */}
        {maintenanceVehicles.length > 0 && (
          <Section title="Véhicules indisponibles" count={maintenanceVehicles.length}>
            {maintenanceVehicles.map((v) => (
              <div key={v.code} style={{ ...itemS, opacity: 0.6 }}>
                <span style={dotGrayS} />
                <span style={{ ...nameS, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{v.code}</span>
                <span style={detailS}>{v.reason}</span>
              </div>
            ))}
          </Section>
        )}

        {/* Bouton sous-traitant */}
        <button type="button" style={stBtnS}>
          <Icon name="plus" size={14} /> Appeler un sous-traitant
        </button>
      </div>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div style={sectionS}>
      <div style={secHeaderS}>
        <span style={secTitleS}>{title}</span>
        <span style={secCountS}>{count}</span>
      </div>
      {children}
    </div>
  );
}

const sidebarS: CSSProperties = {
  width: 240, flexShrink: 0, background: '#fff', borderLeft: '1px solid #e5e7eb',
  display: 'flex', flexDirection: 'column', height: '100%',
};
const headerS: CSSProperties = {
  padding: '14px 16px', borderBottom: '1px solid #e5e7eb',
};
const titleS: CSSProperties = { fontSize: 14, fontWeight: 600, color: '#111827' };
const scrollS: CSSProperties = { flex: 1, overflowY: 'auto', padding: '12px 14px' };
const sectionS: CSSProperties = { marginBottom: 16 };
const secHeaderS: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8,
};
const secTitleS: CSSProperties = { fontSize: 12, fontWeight: 600, color: '#374151' };
const secCountS: CSSProperties = {
  fontSize: 10, fontWeight: 700, background: '#f3f4f6', color: '#6b7280',
  padding: '2px 7px', borderRadius: 8,
};
const itemS: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
};
const nameS: CSSProperties = { fontSize: 12, fontWeight: 500, color: '#111827', flex: 1 };
const detailS: CSSProperties = { fontSize: 10, color: '#9ca3af' };
const dotGreenS: CSSProperties = {
  width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0,
};
const dotRedS: CSSProperties = {
  width: 7, height: 7, borderRadius: '50%', background: '#ef4444', flexShrink: 0,
};
const dotGrayS: CSSProperties = {
  width: 7, height: 7, borderRadius: '50%', background: '#9ca3af', flexShrink: 0,
};
const hintS: CSSProperties = {
  fontSize: 10, color: '#9ca3af', fontStyle: 'italic',
  padding: '4px 0 12px', borderBottom: '1px solid #f3f4f6', marginBottom: 12,
};
const stBtnS: CSSProperties = {
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: 6, padding: '10px 16px', borderRadius: 8, border: '1px dashed #c084fc',
  background: '#faf5ff', color: '#7c3aed', fontSize: 12, fontWeight: 600,
  fontFamily: 'inherit', cursor: 'pointer', marginTop: 8,
};
