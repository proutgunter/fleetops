// ══════════════════════════════════════════════
//  MobileShell — coque mobile (header + nav)
// ══════════════════════════════════════════════

import { type CSSProperties, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon, { type IconName } from './Icons';

interface Props {
  title: string;
  onBack?: () => void;
  headerRight?: ReactNode;
  hideNav?: boolean;
  children: ReactNode;
}

interface NavItem { path: string; label: string; icon: IconName; badge?: number; }

const NAV_ITEMS: NavItem[] = [
  { path: '/demandes', label: 'Demandes', icon: 'file-text' },
  { path: '/planning', label: 'Planning', icon: 'calendar' },
  { path: '/alertes',  label: 'Alertes',  icon: 'bell', badge: 2 },
  { path: '/plus',     label: 'Plus',     icon: 'menu' },
];

const shell: CSSProperties = {
  display: 'flex', flexDirection: 'column', height: '100dvh',
  maxWidth: 480, margin: '0 auto', background: '#f8f9fb', position: 'relative',
};
const header: CSSProperties = {
  background: '#fff', padding: '12px 16px', borderBottom: '1px solid #e5e7eb',
  display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
  paddingTop: 'max(12px, env(safe-area-inset-top))',
};
const backBtn: CSSProperties = {
  background: 'none', border: 'none', padding: 4, cursor: 'pointer',
  color: '#374151', display: 'flex', alignItems: 'center',
};
const titleS: CSSProperties = { fontSize: 17, fontWeight: 600, color: '#111827', flex: 1 };
const contentS: CSSProperties = { flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' };
const navS: CSSProperties = {
  display: 'flex', background: '#fff', borderTop: '1px solid #e5e7eb',
  flexShrink: 0, paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
};
const navItemBase: CSSProperties = {
  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
  padding: '8px 0 4px', background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 10, fontWeight: 500, fontFamily: 'inherit', color: '#9ca3af', position: 'relative',
};
const navItemActive: CSSProperties = { ...navItemBase, color: '#4f46e5' };
const badgeS: CSSProperties = {
  position: 'absolute', top: 4, right: '50%', transform: 'translateX(14px)',
  background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700,
  padding: '1px 5px', borderRadius: 8, lineHeight: '1.2',
};

export default function MobileShell({ title, onBack, headerRight, hideNav, children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div style={shell}>
      <header style={header}>
        {onBack && (
          <button type="button" style={backBtn} onClick={onBack} aria-label="Retour">
            <Icon name="arrow-left" size={20} />
          </button>
        )}
        <h1 style={titleS}>{title}</h1>
        {headerRight}
      </header>
      <main style={contentS}>{children}</main>
      {!hideNav && (
        <nav style={navS}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button key={item.path} type="button"
                style={isActive ? navItemActive : navItemBase}
                onClick={() => navigate(item.path)}>
                <Icon name={item.icon} size={22} />
                {item.label}
                {item.badge && item.badge > 0 && <span style={badgeS}>{item.badge}</span>}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
