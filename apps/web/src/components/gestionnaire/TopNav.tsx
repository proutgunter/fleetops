// ══════════════════════════════════════════════
//  TopNav — navigation desktop gestionnaire
// ══════════════════════════════════════════════

import { type CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../Icons';

const links = [
  { path: '/gestionnaire/planning', label: 'Planning' },
  { path: '/gestionnaire/vehicules', label: 'Véhicules' },
  { path: '/gestionnaire/chauffeurs', label: 'Chauffeurs' },
  { path: '/gestionnaire/chantiers', label: 'Chantiers' },
  { path: '/gestionnaire/absences', label: 'Absences' },
  { path: '/gestionnaire/rapports', label: 'Rapports' },
];

export default function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={navS}>
      <div style={logoS}>Fleet<span style={{ color: '#111827' }}>Ops</span></div>
      <div style={linksS}>
        {links.map((l) => (
          <button key={l.path} type="button"
            style={location.pathname.startsWith(l.path) ? linkActiveS : linkS}
            onClick={() => navigate(l.path)}>
            {l.label}
          </button>
        ))}
      </div>
      <div style={rightS}>
        <button type="button" style={notifS} aria-label="Notifications">
          <Icon name="bell" size={20} />
          <span style={dotS} />
        </button>
        <div style={avatarS}>GT</div>
      </div>
    </nav>
  );
}

const navS: CSSProperties = {
  background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px',
  height: 56, display: 'flex', alignItems: 'center', gap: 24,
  position: 'sticky', top: 0, zIndex: 100,
};
const logoS: CSSProperties = { fontSize: 18, fontWeight: 800, color: '#4f46e5', letterSpacing: -0.5 };
const linksS: CSSProperties = { display: 'flex', gap: 4, flex: 1 };
const linkS: CSSProperties = {
  padding: '8px 14px', fontSize: 13, fontWeight: 500, color: '#6b7280',
  borderRadius: 8, cursor: 'pointer', border: 'none', background: 'none', fontFamily: 'inherit',
};
const linkActiveS: CSSProperties = { ...linkS, background: '#eef2ff', color: '#4f46e5', fontWeight: 600 };
const rightS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 16 };
const notifS: CSSProperties = {
  position: 'relative', background: 'none', border: 'none', cursor: 'pointer',
  padding: 6, borderRadius: 8, color: '#6b7280', display: 'flex',
};
const dotS: CSSProperties = {
  position: 'absolute', top: 4, right: 4, width: 7, height: 7,
  background: '#dc2626', borderRadius: '50%', border: '2px solid #fff',
};
const avatarS: CSSProperties = {
  width: 34, height: 34, borderRadius: '50%', background: '#4f46e5',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 13, fontWeight: 600, color: '#fff',
};
