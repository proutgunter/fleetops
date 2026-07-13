// ══════════════════════════════════════════════
//  RequestCard — carte cliquable d'une demande
// ══════════════════════════════════════════════

import type { CSSProperties } from 'react';
import type { TransportRequest } from '../types';
import SiteCodeChip from './SiteCodeChip';
import StatusBadge from './StatusBadge';
import AccessoryChip from './AccessoryChip';
import Icon from './Icons';

interface Props {
  request: TransportRequest;
  onClick?: () => void;
}

const cardStyle: CSSProperties = {
  background: '#fff', borderRadius: 12, padding: '14px 16px',
  marginBottom: 10, cursor: 'pointer', border: '1px solid #e5e7eb',
};
const topRowStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8,
};
const siteNameStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0,
};
const siteTextStyle: CSSProperties = {
  fontSize: 14, fontWeight: 600, color: '#111827',
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
};
const detailsRowStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 12,
  fontSize: 12, color: '#6b7280', marginBottom: 6,
};
const detailSpanStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 3,
};
const descStyle: CSSProperties = {
  fontSize: 13, color: '#4b5563', lineHeight: 1.3, marginBottom: 6,
};
const bottomRowStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
};
const recurringStyle: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10,
  fontWeight: 500, color: '#0369a1', background: '#e0f2fe',
  padding: '2px 8px', borderRadius: 10,
};

function formatTime(req: TransportRequest): string {
  if (req.missionMode === 'trips') {
    return `${req.startTime || ''} — ${req.tripCount} voyage${(req.tripCount || 0) > 1 ? 's' : ''}`;
  }
  if (req.startTime && req.endTime) return `${req.startTime}–${req.endTime}`;
  return req.startTime || '';
}

export default function RequestCard({ request, onClick }: Props) {
  return (
    <div style={cardStyle} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>
      <div style={topRowStyle}>
        <div style={siteNameStyle}>
          <SiteCodeChip code={request.site.code} />
          <span style={siteTextStyle}>{request.site.name}</span>
        </div>
        <StatusBadge status={request.status} priority={request.priority} />
      </div>
      <div style={detailsRowStyle}>
        <span style={detailSpanStyle}><Icon name="clock" size={13} /> {formatTime(request)}</span>
        <span style={detailSpanStyle}>
          <Icon name="truck" size={13} />
          {request.vehicleType.label}
          {request.quantity > 1 && ` ×${request.quantity}`}
        </span>
      </div>
      <div style={descStyle}>{request.description}</div>
      <div style={bottomRowStyle}>
        {request.accessories.map((acc) => (
          <AccessoryChip key={acc.id} label={acc.label} />
        ))}
        {request.recurrenceType === 'recurring' && (
          <span style={recurringStyle}>
            <Icon name="repeat" size={11} /> Long terme
          </span>
        )}
      </div>
    </div>
  );
}
