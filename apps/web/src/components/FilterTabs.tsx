// ══════════════════════════════════════════════
//  FilterTabs — barre d'onglets horizontale
//  Utilisée sur la liste des demandes : Toutes / Jour J / Long terme
// ══════════════════════════════════════════════

import type { CSSProperties } from 'react';

interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface Props {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
}

const containerStyle: CSSProperties = {
  display: 'flex',
  gap: 6,
  padding: '0 16px 12px',
  overflowX: 'auto',
};

const tabBase: CSSProperties = {
  padding: '7px 14px',
  borderRadius: 20,
  border: '1px solid #e5e7eb',
  background: 'transparent',
  color: '#6b7280',
  fontSize: 12,
  fontWeight: 500,
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'all 0.15s',
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  whiteSpace: 'nowrap',
};

const tabActive: CSSProperties = {
  ...tabBase,
  background: '#1e293b',
  borderColor: '#1e293b',
  color: '#fff',
};

const countStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  padding: '1px 6px',
  borderRadius: 8,
  background: 'rgba(255,255,255,0.2)',
  minWidth: 18,
  textAlign: 'center',
};

const countInactiveStyle: CSSProperties = {
  ...countStyle,
  background: '#f3f4f6',
  color: '#6b7280',
};

export default function FilterTabs({ tabs, activeKey, onChange }: Props) {
  return (
    <div style={containerStyle}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            type="button"
            style={isActive ? tabActive : tabBase}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span style={isActive ? countStyle : countInactiveStyle}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
