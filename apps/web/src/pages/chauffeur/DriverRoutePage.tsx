// ══════════════════════════════════════════════
//  Écran 1 — Feuille de route du chauffeur
//  Timeline verticale, véhicule assigné, missions du jour
// ══════════════════════════════════════════════

import { type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icons';
import SiteCodeChip from '../../components/SiteCodeChip';

// Données de démo
const driver = { initials: 'MW', name: 'M. Weber' };
const vehicle = { code: 'C52', type: '4 axes benne', plate: 'LU-AB-1234', accessories: ['Remorque'] };

type MissionStatus = 'completed' | 'in_progress' | 'planned';

interface Mission {
  id: string;
  siteCode: string;
  siteName: string;
  address: string;
  startTime: string;
  endTime: string;
  description: string;
  status: MissionStatus;
  actualStart?: string;
  actualEnd?: string;
}

const missions: Mission[] = [
  { id: 'ms-1', siteCode: '40215', siteName: 'Kirchberg T2', address: 'Av. J.F. Kennedy, Luxembourg', startTime: '06:30', endTime: '14:00', description: 'Évacuation terre niv. -2 parking — TTJ aller-retour carrière Folschette', status: 'completed', actualStart: '06:28', actualEnd: '13:52' },
  { id: 'ms-2', siteCode: '40320', siteName: 'Belval Résidence C', address: "12 Av. du Rock'n'Roll, Esch", startTime: '14:30', endTime: '17:00', description: '2 voyages — Apport remblai compacté', status: 'in_progress', actualStart: '14:35' },
  { id: 'ms-3', siteCode: '40412', siteName: 'Strassen Lot 12', address: "45 Route d'Arlon, Strassen", startTime: '17:30', endTime: '18:30', description: '1 voyage — Apport tout-venant', status: 'planned' },
];

const STATUS_COLORS: Record<MissionStatus, { bar: string; dot: string; bg: string }> = {
  completed:   { bar: '#22c55e', dot: '#22c55e', bg: '#f0fdf4' },
  in_progress: { bar: '#3b82f6', dot: '#3b82f6', bg: '#eff6ff' },
  planned:     { bar: '#d1d5db', dot: '#d1d5db', bg: '#fff' },
};

const STATUS_LABELS: Record<MissionStatus, string> = {
  completed: 'Terminée',
  in_progress: 'En cours',
  planned: 'À venir',
};

export default function DriverRoutePage() {
  const navigate = useNavigate();
  const today = new Date();
  const jours = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const mois = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const dateStr = `${jours[today.getDay()]} ${today.getDate()} ${mois[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <div style={shellS}>
      {/* Header */}
      <header style={headerS}>
        <div>
          <h1 style={titleS}>Ma journée</h1>
          <p style={subtitleS}>{dateStr}</p>
        </div>
        <div style={avatarS}>{driver.initials}</div>
      </header>

      <main style={contentS}>
        {/* Véhicule assigné */}
        <div style={vehicleBannerS}>
          <span style={vCodeS}>{vehicle.code}</span>
          <div style={{ flex: 1 }}>
            <div style={vTypeS}>{vehicle.type}</div>
            <div style={vPlateS}>{vehicle.plate}</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
              {vehicle.accessories.map(a => (
                <span key={a} style={accChipS}>{a}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={timelineS}>
          <div style={timelineLineS} />
          {missions.map((m) => {
            const sc = STATUS_COLORS[m.status];
            return (
              <div key={m.id} style={missionWrapS} onClick={() => navigate(`/chauffeur/mission/${m.id}`)}>
                <div style={{ ...dotS, background: sc.dot }} />
                <div style={{ ...mCardS, background: sc.bg }}>
                  <div style={{ ...mBarS, background: sc.bar }} />
                  <div style={mContentS}>
                    <div style={mTopS}>
                      <span style={mTimeS}>{m.startTime} → {m.endTime}</span>
                      <span style={{ ...mBadgeS, background: sc.bar === '#d1d5db' ? '#f3f4f6' : `${sc.bar}18`, color: sc.bar === '#d1d5db' ? '#6b7280' : sc.bar }}>
                        {STATUS_LABELS[m.status]}
                      </span>
                    </div>
                    <div style={mSiteRowS}>
                      <SiteCodeChip code={m.siteCode} size="sm" />
                      <span style={mSiteNameS}>{m.siteName}</span>
                    </div>
                    <div style={mAddrS}><Icon name="map-pin" size={11} color="#9ca3af" /> {m.address}</div>
                    <div style={mDescS}>{m.description}</div>
                    {m.actualStart && (
                      <div style={mTimestampsS}>
                        <span>Démarré à {m.actualStart}</span>
                        {m.actualEnd && <span> · Terminé à {m.actualEnd}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom nav */}
      <nav style={navS}>
        <button type="button" style={navActiveS}><Icon name="truck" size={22} />Aujourd'hui</button>
        <button type="button" style={navItemS}><Icon name="calendar" size={22} />Semaine</button>
        <button type="button" style={navItemS}><Icon name="user" size={22} />Profil</button>
      </nav>
    </div>
  );
}

const shellS: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100dvh', maxWidth: 480, margin: '0 auto', background: '#f8f9fb' };
const headerS: CSSProperties = { background: '#fff', padding: '14px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'max(14px, env(safe-area-inset-top))' };
const titleS: CSSProperties = { fontSize: 18, fontWeight: 700, color: '#111827' };
const subtitleS: CSSProperties = { fontSize: 12, color: '#6b7280', marginTop: 2 };
const avatarS: CSSProperties = { width: 38, height: 38, borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#fff' };
const contentS: CSSProperties = { flex: 1, overflowY: 'auto', padding: '12px 16px 80px' };
const vehicleBannerS: CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: '#1e293b', borderRadius: 12, marginBottom: 16, color: '#fff' };
const vCodeS: CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: 8 };
const vTypeS: CSSProperties = { fontSize: 14, fontWeight: 600 };
const vPlateS: CSSProperties = { fontSize: 12, color: '#94a3b8', marginTop: 2 };
const accChipS: CSSProperties = { fontSize: 10, fontWeight: 500, background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: 8, color: '#cbd5e1' };
const timelineS: CSSProperties = { position: 'relative', paddingLeft: 20 };
const timelineLineS: CSSProperties = { position: 'absolute', left: 8, top: 12, bottom: 12, width: 2, background: '#e5e7eb', borderRadius: 1 };
const missionWrapS: CSSProperties = { position: 'relative', marginBottom: 12, cursor: 'pointer' };
const dotS: CSSProperties = { position: 'absolute', left: -16, top: 18, width: 10, height: 10, borderRadius: '50%', border: '2px solid #fff', zIndex: 1 };
const mCardS: CSSProperties = { borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' };
const mBarS: CSSProperties = { height: 3 };
const mContentS: CSSProperties = { padding: '10px 14px' };
const mTopS: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 };
const mTimeS: CSSProperties = { fontSize: 13, fontWeight: 600, color: '#111827' };
const mBadgeS: CSSProperties = { fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 8 };
const mSiteRowS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 };
const mSiteNameS: CSSProperties = { fontSize: 14, fontWeight: 500, color: '#111827' };
const mAddrS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#9ca3af', marginBottom: 4 };
const mDescS: CSSProperties = { fontSize: 12, color: '#6b7280', lineHeight: 1.3 };
const mTimestampsS: CSSProperties = { fontSize: 10, color: '#22c55e', marginTop: 6, fontWeight: 500 };
const navS: CSSProperties = { display: 'flex', background: '#fff', borderTop: '1px solid #e5e7eb', flexShrink: 0, paddingBottom: 'max(8px, env(safe-area-inset-bottom))' };
const navItemS: CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 0 4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 500, fontFamily: 'inherit', color: '#9ca3af' };
const navActiveS: CSSProperties = { ...navItemS, color: '#4f46e5' };
