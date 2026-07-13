// ══════════════════════════════════════════════
//  Écran 4 — Planning du jour (lecture seule)
// ══════════════════════════════════════════════

import { useState, useMemo, type CSSProperties } from 'react';
import MobileShell from '../../components/MobileShell';
import SiteCodeChip from '../../components/SiteCodeChip';
import Icon from '../../components/Icons';
import { planningRows, currentUser, sites } from '../../services/mockData';
import type { DailyAssignment, PlanningTruckRow } from '../../types';

function formatDateFr(dateStr: string): string {
  const d = new Date(dateStr);
  const jours = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  const mois = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
  return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]}`;
}

export default function PlanningPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);
  const mySiteIds = useMemo(() => sites.filter(s => s.supervisorId === currentUser.id).map(s => s.id), []);

  const prevDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().slice(0, 10)); };
  const nextDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().slice(0, 10)); };

  const { assigned, available } = useMemo(() => {
    const a: PlanningTruckRow[] = []; const b: PlanningTruckRow[] = [];
    for (const row of planningRows) { if (row.assignments.length > 0) a.push(row); else b.push(row); }
    return { assigned: a, available: b };
  }, []);

  return (
    <MobileShell title="Planning du jour">
      <div style={dateBarS}>
        <button type="button" style={dateNavS} onClick={prevDay}><Icon name="chevron-left" size={18} /></button>
        <button type="button" style={dateLabelS} onClick={() => setSelectedDate(today)}>
          {selectedDate === today ? "Aujourd'hui" : formatDateFr(selectedDate)}
        </button>
        <button type="button" style={dateNavS} onClick={nextDay}><Icon name="chevron-right" size={18} /></button>
      </div>
      <div style={{ padding: '12px 16px 80px' }}>
        <div style={summaryS}><span><strong>{assigned.length}</strong> camions affectés</span><span style={{ color: '#22c55e' }}><strong>{available.length}</strong> disponibles</span></div>
        {assigned.map(row => <TruckCard key={row.vehicleId} row={row} mySiteIds={mySiteIds} />)}
        {available.length > 0 && (
          <>
            <div style={dividerS}>Camions disponibles</div>
            {available.map(row => (
              <div key={row.vehicleId} style={availS}>
                <span style={vcodeS}>{row.vehicleCode}</span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{row.vehicleTypeLabel}</span>
                {row.vehicleStatus === 'reserve' && <span style={reserveS}>Réserve</span>}
              </div>
            ))}
          </>
        )}
      </div>
    </MobileShell>
  );
}

function TruckCard({ row, mySiteIds }: { row: PlanningTruckRow; mySiteIds: string[] }) {
  const isMySite = row.assignments.some(a => mySiteIds.includes(a.request?.siteId || ''));
  return (
    <div style={{ ...truckCardS, ...(isMySite ? highlightS : {}) }}>
      <div style={truckHeaderS}>
        <span style={vcodeS}>{row.vehicleCode}</span>
        <span style={{ fontSize: 12, color: '#6b7280', flex: 1 }}>{row.vehicleTypeLabel}</span>
        {isMySite && <span style={myBadgeS}><Icon name="star" size={11} /> Mon chantier</span>}
      </div>
      {row.assignments.map(asg => <MissionBlock key={asg.id} assignment={asg} isMySite={mySiteIds.includes(asg.request?.siteId || '')} />)}
    </div>
  );
}

function MissionBlock({ assignment, isMySite }: { assignment: DailyAssignment; isMySite: boolean }) {
  const req = assignment.request;
  return (
    <div style={{ ...missionS, ...(isMySite ? missionMineS : {}) }}>
      <div style={missionTopS}>{req && <SiteCodeChip code={req.site.code} size="sm" />}<span style={{ fontSize: 13, fontWeight: 500, color: '#111827', flex: 1 }}>{req?.site.name || 'Site inconnu'}</span></div>
      <div style={missionDetailS}>
        <span><Icon name="clock" size={12} /> {assignment.startTime || '—'}{assignment.endTime ? `–${assignment.endTime}` : ''}</span>
        <span><Icon name="user" size={12} /> {assignment.driverName}</span>
      </div>
      {assignment.missionDetails && <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, lineHeight: 1.3 }}>{assignment.missionDetails}</p>}
    </div>
  );
}

const dateBarS: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '12px 16px', background: '#fff', borderBottom: '1px solid #e5e7eb' };
const dateNavS: CSSProperties = { width: 36, height: 36, borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const dateLabelS: CSSProperties = { fontSize: 15, fontWeight: 600, color: '#111827', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '6px 16px', borderRadius: 8 };
const summaryS: CSSProperties = { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 12, padding: '0 4px' };
const truckCardS: CSSProperties = { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '12px 14px', marginBottom: 10 };
const highlightS: CSSProperties = { borderColor: '#818cf8', boxShadow: '0 0 0 1px #818cf8' };
const truckHeaderS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 };
const vcodeS: CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: '#111827', background: '#f3f4f6', padding: '2px 8px', borderRadius: 6 };
const myBadgeS: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600, color: '#4f46e5', background: '#eef2ff', padding: '2px 8px', borderRadius: 8 };
const missionS: CSSProperties = { padding: '8px 10px', borderRadius: 8, background: '#f9fafb', marginBottom: 4 };
const missionMineS: CSSProperties = { background: '#eef2ff' };
const missionTopS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 };
const missionDetailS: CSSProperties = { display: 'flex', gap: 12, fontSize: 12, color: '#6b7280' };
const dividerS: CSSProperties = { fontSize: 12, fontWeight: 600, color: '#6b7280', padding: '16px 4px 8px', textTransform: 'uppercase', letterSpacing: 0.5 };
const availS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', marginBottom: 6 };
const reserveS: CSSProperties = { fontSize: 10, fontWeight: 600, color: '#92400e', background: '#fef3c7', padding: '2px 8px', borderRadius: 8, marginLeft: 'auto' };
