// ══════════════════════════════════════════════
//  ActionBar — compteur + actions du gestionnaire
// ══════════════════════════════════════════════

import { type CSSProperties } from 'react';
import Icon from '../Icons';

interface Props {
  pendingCount: number;
  conflictCount: number;
}

export default function ActionBar({ pendingCount, conflictCount }: Props) {
  return (
    <div style={barS}>
      <div style={infoS}>
        {pendingCount > 0 && <span><strong>{pendingCount} demande{pendingCount > 1 ? 's' : ''}</strong> à affecter</span>}
        {pendingCount > 0 && conflictCount > 0 && <span> · </span>}
        {conflictCount > 0 && <span style={{ color: '#dc2626' }}><strong>{conflictCount} conflit{conflictCount > 1 ? 's' : ''}</strong> à résoudre</span>}
      </div>
      <div style={btnsS}>
        <button type="button" style={secBtnS}><Icon name="repeat" size={14} /> Reconduire tout J-1</button>
        <button type="button" style={secBtnS}><Icon name="file-text" size={14} /> Exporter PDF</button>
        <button type="button" style={pubBtnS}><Icon name="check" size={16} color="#fff" /> Valider le programme</button>
      </div>
    </div>
  );
}

const barS: CSSProperties = {
  background: '#fff', borderTop: '1px solid #e5e7eb', padding: '10px 24px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  flexShrink: 0,
};
const infoS: CSSProperties = { fontSize: 13, color: '#6b7280' };
const btnsS: CSSProperties = { display: 'flex', gap: 8 };
const secBtnS: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
  borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff',
  color: '#374151', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
};
const pubBtnS: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px',
  borderRadius: 8, border: 'none', background: '#4f46e5', color: '#fff',
  fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
};
