// ══════════════════════════════════════════════
//  Écran 2 — Détail mission chauffeur
//  Instructions, contact CDT, boutons d'action
// ══════════════════════════════════════════════

import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icons';
import SiteCodeChip from '../../components/SiteCodeChip';

const mission = {
  id: 'ms-2', siteCode: '40320', siteName: 'Belval Résidence C',
  address: "12 Av. du Rock'n'Roll, Esch-sur-Alzette",
  startTime: '14:30', endTime: '17:00',
  description: '2 voyages — Apport remblai compacté\nDépart : carrière Folschette\nAccès chantier par la rue du Brill, portail B',
  cdtName: 'P. Dupont', cdtPhone: '+352 621 123 456',
  status: 'in_progress' as const, actualStart: '14:35',
};

export default function MissionDetailPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(mission.status);

  return (
    <div style={shellS}>
      <header style={headerS}>
        <button type="button" style={backS} onClick={() => navigate('/chauffeur')}>
          <Icon name="arrow-left" size={20} />
        </button>
        <span style={titleS}>Mission</span>
      </header>

      <main style={contentS}>
        {/* En-tête mission */}
        <div style={heroS}>
          <div style={heroTopS}>
            <SiteCodeChip code={mission.siteCode} />
            <span style={{ fontSize: 13, fontWeight: 600, color: status === 'completed' ? '#22c55e' : '#3b82f6' }}>
              {status === 'completed' ? 'Terminée' : status === 'in_progress' ? 'En cours' : 'À venir'}
            </span>
          </div>
          <h2 style={siteNameS}>{mission.siteName}</h2>
          <p style={addrS}><Icon name="map-pin" size={13} color="#9ca3af" /> {mission.address}</p>
        </div>

        {/* Horaires */}
        <div style={infoBlockS}>
          <div style={infoRowS}>
            <Icon name="clock" size={16} color="#6b7280" />
            <div>
              <div style={infoLabelS}>Horaire prévu</div>
              <div style={infoValS}>{mission.startTime} → {mission.endTime}</div>
            </div>
          </div>
          {mission.actualStart && (
            <div style={infoRowS}>
              <Icon name="play" size={16} color="#22c55e" />
              <div>
                <div style={infoLabelS}>Démarré à</div>
                <div style={infoValS}>{mission.actualStart}</div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div style={instrBlockS}>
          <div style={instrTitleS}>Instructions</div>
          <p style={instrTextS}>{mission.description}</p>
        </div>

        {/* Contact CDT */}
        <div style={contactBlockS}>
          <div style={{ flex: 1 }}>
            <div style={contactLabelS}>Conducteur de travaux</div>
            <div style={contactNameS}>{mission.cdtName}</div>
          </div>
          <a href={`tel:${mission.cdtPhone}`} style={callBtnS}>
            <Icon name="send" size={16} color="#fff" />
            Appeler
          </a>
        </div>

        {/* Actions */}
        <div style={actionsS}>
          {status === 'in_progress' && (
            <button type="button" style={mainBtnS} onClick={() => setStatus('completed')}>
              <Icon name="check" size={20} color="#fff" />
              Marquer terminée
            </button>
          )}
          {status === 'planned' && (
            <button type="button" style={{ ...mainBtnS, background: '#3b82f6' }} onClick={() => setStatus('in_progress')}>
              <Icon name="play" size={20} color="#fff" />
              Démarrer
            </button>
          )}
          {status === 'completed' && (
            <div style={doneBannerS}>
              <Icon name="circle-check" size={24} color="#22c55e" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#065f46' }}>Mission terminée</span>
            </div>
          )}

          <div style={secActionsS}>
            <button type="button" style={secBtnS}>
              <Icon name="map-pin" size={16} />
              Naviguer
            </button>
            <button type="button" style={dangerBtnS} onClick={() => navigate('/chauffeur/probleme')}>
              <Icon name="alert-triangle" size={16} />
              Problème
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const shellS: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100dvh', maxWidth: 480, margin: '0 auto', background: '#f8f9fb' };
const headerS: CSSProperties = { background: '#fff', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 12, paddingTop: 'max(12px, env(safe-area-inset-top))' };
const backS: CSSProperties = { background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#374151', display: 'flex' };
const titleS: CSSProperties = { fontSize: 17, fontWeight: 600, color: '#111827' };
const contentS: CSSProperties = { flex: 1, overflowY: 'auto', padding: '0 16px 30px' };
const heroS: CSSProperties = { padding: '16px 0 14px', borderBottom: '1px solid #e5e7eb', marginBottom: 16 };
const heroTopS: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 };
const siteNameS: CSSProperties = { fontSize: 20, fontWeight: 700, color: '#111827', margin: '4px 0' };
const addrS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9ca3af' };
const infoBlockS: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 };
const infoRowS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#fff', borderRadius: 10, border: '1px solid #f3f4f6' };
const infoLabelS: CSSProperties = { fontSize: 11, color: '#9ca3af' };
const infoValS: CSSProperties = { fontSize: 14, fontWeight: 600, color: '#111827' };
const instrBlockS: CSSProperties = { padding: '12px 14px', background: '#fffbeb', borderRadius: 10, borderLeft: '3px solid #f59e0b', marginBottom: 16 };
const instrTitleS: CSSProperties = { fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 };
const instrTextS: CSSProperties = { fontSize: 13, color: '#78350f', lineHeight: 1.5, whiteSpace: 'pre-line', margin: 0 };
const contactBlockS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', marginBottom: 20 };
const contactLabelS: CSSProperties = { fontSize: 11, color: '#9ca3af' };
const contactNameS: CSSProperties = { fontSize: 14, fontWeight: 600, color: '#111827' };
const callBtnS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, background: '#22c55e', color: '#fff', fontSize: 12, fontWeight: 600, textDecoration: 'none' };
const actionsS: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10 };
const mainBtnS: CSSProperties = { width: '100%', padding: '14px 20px', borderRadius: 12, border: 'none', background: '#22c55e', color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 };
const doneBannerS: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' };
const secActionsS: CSSProperties = { display: 'flex', gap: 8 };
const secBtnS: CSSProperties = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' };
const dangerBtnS: CSSProperties = { ...secBtnS, borderColor: '#fca5a5', color: '#dc2626', background: '#fff' };
