// ══════════════════════════════════════════════
//  DateBar — sélecteur de date + alerte conflits
// ══════════════════════════════════════════════

import { type CSSProperties } from 'react';
import Icon from '../Icons';

interface Conflict {
  id: string;
  message: string;
}

interface Props {
  dateLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  conflicts: Conflict[];
  pendingCount: number;
}

export default function DateBar({ dateLabel, onPrev, onNext, onToday, conflicts, pendingCount }: Props) {
  return (
    <div>
      <div style={barS}>
        <div style={dateGroupS}>
          <button type="button" style={dateNavS} onClick={onPrev}><Icon name="chevron-left" size={18} /></button>
          <button type="button" style={dateLabelS} onClick={onToday}>{dateLabel}</button>
          <button type="button" style={dateNavS} onClick={onNext}><Icon name="chevron-right" size={18} /></button>
        </div>
        <div style={statsS}>
          {pendingCount > 0 && (
            <span style={statBadgeS}>
              <span style={statDotAmber} />{pendingCount} demande{pendingCount > 1 ? 's' : ''} à affecter
            </span>
          )}
          {conflicts.length > 0 && (
            <span style={statBadgeRedS}>
              <Icon name="alert-triangle" size={13} /> {conflicts.length} conflit{conflicts.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
      {conflicts.length > 0 && (
        <div style={alertBarS}>
          <Icon name="alert-triangle" size={16} />
          <span style={{ flex: 1 }}>{conflicts[0].message}</span>
          <button type="button" style={resolveS}>Résoudre</button>
        </div>
      )}
    </div>
  );
}

const barS: CSSProperties = {
  background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 24px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
};
const dateGroupS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12 };
const dateNavS: CSSProperties = {
  width: 34, height: 34, borderRadius: 8, border: '1px solid #e5e7eb',
  background: '#fff', color: '#374151', display: 'flex', alignItems: 'center',
  justifyContent: 'center', cursor: 'pointer',
};
const dateLabelS: CSSProperties = {
  fontSize: 16, fontWeight: 700, color: '#111827', background: 'none',
  border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 12px',
};
const statsS: CSSProperties = { display: 'flex', gap: 12, alignItems: 'center' };
const statBadgeS: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500,
  color: '#92400e', background: '#fef3c7', padding: '5px 12px', borderRadius: 8,
};
const statDotAmber: CSSProperties = { width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' };
const statBadgeRedS: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500,
  color: '#dc2626', background: '#fef2f2', padding: '5px 12px', borderRadius: 8,
};
const alertBarS: CSSProperties = {
  background: '#fef2f2', borderBottom: '1px solid #fecaca', padding: '8px 24px',
  display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#991b1b',
};
const resolveS: CSSProperties = {
  background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6,
  padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
};
