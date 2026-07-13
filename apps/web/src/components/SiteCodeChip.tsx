// ══════════════════════════════════════════════
//  SiteCodeChip — affiche le code chantier XXXXX
//  Style monospace, fond gris, toujours visible en premier
// ══════════════════════════════════════════════

import type { CSSProperties } from 'react';

interface Props {
  code: string;
  size?: 'sm' | 'md';
}

const styles: Record<string, CSSProperties> = {
  base: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontWeight: 700,
    letterSpacing: '0.5px',
    borderRadius: 4,
    display: 'inline-block',
  },
  md: {
    fontSize: 13,
    padding: '2px 8px',
    background: '#f3f4f6',
    color: '#374151',
  },
  sm: {
    fontSize: 11,
    padding: '1px 6px',
    background: 'rgba(0,0,0,0.05)',
    color: '#6b7280',
  },
};

export default function SiteCodeChip({ code, size = 'md' }: Props) {
  return (
    <span style={{ ...styles.base, ...styles[size] }}>
      {code}
    </span>
  );
}
