// ══════════════════════════════════════════════
//  StatusBadge — pastille de statut colorée
// ══════════════════════════════════════════════

import type { RequestStatus, RequestPriority } from '../types';
import type { CSSProperties } from 'react';
import Icon, { type IconName } from './Icons';

interface Props {
  status: RequestStatus;
  priority?: RequestPriority;
}

const STATUS_CONFIG: Record<RequestStatus, { label: string; bg: string; color: string; icon: IconName }> = {
  draft:              { label: 'Brouillon',   bg: '#f3f4f6', color: '#6b7280', icon: 'pencil' },
  submitted:          { label: 'En attente',  bg: '#fef3c7', color: '#92400e', icon: 'clock' },
  assigned:           { label: 'Affectée',    bg: '#d1fae5', color: '#065f46', icon: 'check' },
  partially_assigned: { label: 'Partielle',   bg: '#dbeafe', color: '#1e40af', icon: 'adjustments' },
  in_progress:        { label: 'En cours',    bg: '#dbeafe', color: '#1e40af', icon: 'play' },
  completed:          { label: 'Terminée',    bg: '#e5e7eb', color: '#6b7280', icon: 'circle-check' },
  cancelled:          { label: 'Annulée',     bg: '#fee2e2', color: '#991b1b', icon: 'x' },
};

const badgeStyle: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '3px 10px', borderRadius: 12, fontSize: 11,
  fontWeight: 600, lineHeight: 1, whiteSpace: 'nowrap',
};

export default function StatusBadge({ status, priority }: Props) {
  if (priority === 'urgent') {
    return (
      <span style={{ ...badgeStyle, background: '#fef2f2', color: '#dc2626' }}>
        <Icon name="alert-triangle" size={12} />
        Urgent
      </span>
    );
  }
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{ ...badgeStyle, background: cfg.bg, color: cfg.color }}>
      <Icon name={cfg.icon} size={12} />
      {cfg.label}
    </span>
  );
}
