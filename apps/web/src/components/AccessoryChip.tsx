// ══════════════════════════════════════════════
//  AccessoryChip — petite pastille pour les accessoires véhicule
//  Remorque, Plateau, Grappin (conditionnel grue)
// ══════════════════════════════════════════════

import type { CSSProperties } from 'react';

interface Props {
  label: string;
  onRemove?: () => void;
}

const chipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '3px 10px',
  borderRadius: 12,
  fontSize: 11,
  fontWeight: 500,
  background: '#ede9fe',
  color: '#5b21b6',
  lineHeight: 1,
  whiteSpace: 'nowrap',
};

const removeStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: '#7c3aed',
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
};

export default function AccessoryChip({ label, onRemove }: Props) {
  return (
    <span style={chipStyle}>
      {label}
      {onRemove && (
        <button
          type="button"
          style={removeStyle}
          onClick={onRemove}
          aria-label={`Retirer ${label}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}
    </span>
  );
}
