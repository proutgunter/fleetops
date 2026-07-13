// ══════════════════════════════════════════════
//  PendingSidebar — demandes en attente groupées par CDT
// ══════════════════════════════════════════════

import { type CSSProperties } from 'react';
import Icon from '../Icons';

interface PendingRequest {
  id: string;
  siteCode: string;
  siteName: string;
  startTime: string;
  endTime?: string;
  tripCount?: number;
  missionMode: 'duration' | 'trips';
  vehicleTypeLabel: string;
  quantity: number;
  description: string;
  priority: 'normal' | 'urgent';
  createdLabel: string;
}

interface CdtGroup {
  id: string;
  initials: string;
  name: string;
  color: string;
  requests: PendingRequest[];
}

interface Props {
  groups: CdtGroup[];
}

export default function PendingSidebar({ groups }: Props) {
  const total = groups.reduce((s, g) => s + g.requests.length, 0);

  return (
    <div style={sidebarS}>
      <div style={headerS}>
        <span style={titleS}>Demandes à affecter</span>
        <span style={countS}>{total}</span>
      </div>
      <div style={scrollS}>
        {groups.map((g) => (
          <div key={g.id} style={groupS}>
            <div style={cdtHeaderS}>
              <div style={{ ...avatarS, background: g.color }}>{g.initials}</div>
              <span style={cdtNameS}>{g.name}</span>
              <span style={cdtCountS}>{g.requests.length}</span>
            </div>
            {g.requests.map((r) => (
              <div key={r.id} style={{ ...cardS, ...(r.priority === 'urgent' ? urgentBorderS : {}) }}>
                <div style={cardTopS}>
                  <div style={siteRowS}>
                    <span style={codeS}>{r.siteCode}</span>
                    <span style={siteNameS}>{r.siteName}</span>
                  </div>
                  {r.priority === 'urgent' && (
                    <span style={urgentS}><Icon name="alert-triangle" size={11} /> Urgent</span>
                  )}
                </div>
                <div style={detailsS}>
                  <span>
                    {r.missionMode === 'duration'
                      ? `${r.startTime}–${r.endTime}`
                      : `${r.startTime} · ${r.tripCount} voy.`}
                  </span>
                  <span>{r.vehicleTypeLabel}{r.quantity > 1 ? ` ×${r.quantity}` : ''}</span>
                </div>
                <div style={descS}>{r.description}</div>
                <div style={metaS}>{r.createdLabel}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const sidebarS: CSSProperties = {
  width: 280, flexShrink: 0, background: '#fff', borderRight: '1px solid #e5e7eb',
  display: 'flex', flexDirection: 'column', height: '100%',
};
const headerS: CSSProperties = {
  padding: '14px 16px', borderBottom: '1px solid #e5e7eb',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
};
const titleS: CSSProperties = { fontSize: 14, fontWeight: 600, color: '#111827' };
const countS: CSSProperties = {
  fontSize: 12, fontWeight: 700, background: '#fef3c7', color: '#92400e',
  padding: '2px 10px', borderRadius: 10,
};
const scrollS: CSSProperties = { flex: 1, overflowY: 'auto', padding: '8px 12px' };
const groupS: CSSProperties = { marginBottom: 14 };
const cdtHeaderS: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px', marginBottom: 6,
};
const avatarS: CSSProperties = {
  width: 26, height: 26, borderRadius: '50%', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0,
};
const cdtNameS: CSSProperties = { fontSize: 13, fontWeight: 600, color: '#111827', flex: 1 };
const cdtCountS: CSSProperties = {
  fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 8,
  background: '#fef3c7', color: '#92400e',
};
const cardS: CSSProperties = {
  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
  padding: '10px 12px', marginBottom: 8, cursor: 'grab',
};
const urgentBorderS: CSSProperties = { borderColor: '#fca5a5', background: '#fef2f2' };
const cardTopS: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6,
};
const siteRowS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 5, flex: 1, minWidth: 0 };
const codeS: CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700,
  color: '#374151', background: '#f3f4f6', padding: '1px 6px', borderRadius: 4, letterSpacing: 0.5,
};
const siteNameS: CSSProperties = {
  fontSize: 13, fontWeight: 500, color: '#111827',
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
};
const urgentS: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600,
  color: '#dc2626', background: '#fee2e2', padding: '2px 7px', borderRadius: 8, flexShrink: 0,
};
const detailsS: CSSProperties = {
  display: 'flex', gap: 10, fontSize: 11, color: '#6b7280', marginBottom: 4,
};
const descS: CSSProperties = { fontSize: 11, color: '#92400e', lineHeight: 1.3 };
const metaS: CSSProperties = { fontSize: 10, color: '#9ca3af', marginTop: 4 };
