// ══════════════════════════════════════════════
//  Écran 3 — Détail d'une demande
// ══════════════════════════════════════════════

import { type CSSProperties } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import SiteCodeChip from '../../components/SiteCodeChip';
import StatusBadge from '../../components/StatusBadge';
import AccessoryChip from '../../components/AccessoryChip';
import Icon, { type IconName } from '../../components/Icons';
import { requests as mockRequests, planningRows } from '../../services/mockData';

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const request = mockRequests.find(r => r.id === id);

  if (!request) {
    return (
      <MobileShell title="Demande" onBack={() => navigate('/demandes')}>
        <div style={emptyS}><Icon name="x" size={40} color="#d1d5db" /><p style={{ color: '#9ca3af', fontSize: 14, marginTop: 8 }}>Demande introuvable</p></div>
      </MobileShell>
    );
  }

  const relatedAssignments = planningRows.flatMap(r => r.assignments).filter(a => a.requestId === request.id);
  const isEditable = ['draft', 'submitted'].includes(request.status);

  return (
    <MobileShell title="Détail demande" onBack={() => navigate('/demandes')} hideNav
      headerRight={isEditable ? <button type="button" style={editBtnS} aria-label="Modifier"><Icon name="edit" size={20} /></button> : undefined}>
      <div style={{ padding: '0 16px 16px' }}>
        <div style={heroS}>
          <div style={heroTopS}><SiteCodeChip code={request.site.code} /><StatusBadge status={request.status} priority={request.priority} /></div>
          <h2 style={siteNameS}>{request.site.name}</h2>
          <p style={addrS}><Icon name="map-pin" size={13} /> {request.site.address}, {request.site.city}</p>
        </div>

        <section style={secS}>
          <h3 style={secTitleS}>Demande</h3>
          <InfoRow icon="truck" label="Type de camion" value={`${request.vehicleType.label}${request.quantity > 1 ? ` ×${request.quantity}` : ''}`} />
          <InfoRow icon="clock" label="Mobilisation" value={request.missionMode === 'duration' ? `${request.startTime}–${request.endTime}` : `${request.startTime} — ${request.tripCount} voyage${(request.tripCount || 0) > 1 ? 's' : ''}`} />
          {request.recurrenceType === 'recurring' && <InfoRow icon="repeat" label="Récurrence" value={`${request.recurrenceStart} → ${request.recurrenceEnd}`} />}
          <InfoRow icon="user" label="Demandé par" value={request.requestedByName} />
          {request.accessories.length > 0 && <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>{request.accessories.map(acc => <AccessoryChip key={acc.id} label={acc.label} />)}</div>}
          {request.description && <div style={descBlockS}><p style={descTextS}>{request.description}</p></div>}
        </section>

        {relatedAssignments.length > 0 && (
          <section style={secS}>
            <h3 style={secTitleS}>Affectation</h3>
            {relatedAssignments.map(asg => (
              <div key={asg.id} style={asgCardS}>
                <div style={asgTopS}>
                  <span style={vcodeS}>{asg.vehicleCode}</span>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>{asg.vehicleTypeLabel}</span>
                  <SourceBadge source={asg.source} />
                </div>
                <div style={asgDetailS}><Icon name="user" size={14} color="#6b7280" /> {asg.driverName}{asg.driverType !== 'internal' && <DriverTypeBadge type={asg.driverType} />}</div>
                {asg.missionDetails && <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6, lineHeight: 1.3 }}>{asg.missionDetails}</p>}
              </div>
            ))}
          </section>
        )}

        {relatedAssignments.length === 0 && ['submitted', 'draft'].includes(request.status) && (
          <section style={secS}>
            <div style={waitingS}><Icon name="clock" size={28} color="#f59e0b" /><p style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>En attente d'affectation par le gestionnaire transport</p></div>
          </section>
        )}

        {isEditable && (
          <button type="button" style={cancelBtnS}><Icon name="x" size={16} /> Annuler la demande</button>
        )}
        <div style={{ height: 40 }} />
      </div>
    </MobileShell>
  );
}

function InfoRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div style={infoRowS}>
      <span style={infoLabelS}><Icon name={icon} size={14} /> {label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{value}</span>
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  const cfg: Record<string, { label: string; bg: string; color: string }> = {
    manual: { label: 'Manuel', bg: '#f3f4f6', color: '#6b7280' },
    auto_renewed: { label: 'Reconduit', bg: '#dbeafe', color: '#1e40af' },
    copilot: { label: 'Copilot', bg: '#ede9fe', color: '#5b21b6' },
  };
  const c = cfg[source] || cfg.manual;
  return <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 8, background: c.bg, color: c.color, marginLeft: 'auto' }}>{c.label}</span>;
}

function DriverTypeBadge({ type }: { type: string }) {
  if (type === 'internal') return null;
  const cfg: Record<string, { label: string; bg: string; color: string }> = {
    temporary: { label: 'Intérimaire', bg: '#fef3c7', color: '#92400e' },
    subcontractor: { label: 'Sous-traitant', bg: '#fee2e2', color: '#991b1b' },
  };
  const c = cfg[type] || cfg.temporary;
  return <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 8, background: c.bg, color: c.color }}>{c.label}</span>;
}

const heroS: CSSProperties = { padding: '16px 0 12px', borderBottom: '1px solid #e5e7eb', marginBottom: 16 };
const heroTopS: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 };
const siteNameS: CSSProperties = { fontSize: 18, fontWeight: 700, color: '#111827', margin: '4px 0' };
const addrS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9ca3af' };
const secS: CSSProperties = { marginBottom: 20 };
const secTitleS: CSSProperties = { fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 12 };
const infoRowS: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fff', borderRadius: 8, border: '1px solid #f3f4f6', marginBottom: 6 };
const infoLabelS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' };
const descBlockS: CSSProperties = { marginTop: 12, padding: '10px 12px', background: '#fffbeb', borderRadius: 8, borderLeft: '3px solid #f59e0b' };
const descTextS: CSSProperties = { fontSize: 13, color: '#92400e', lineHeight: 1.4, margin: 0 };
const asgCardS: CSSProperties = { padding: '12px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', marginBottom: 8 };
const asgTopS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 };
const vcodeS: CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: '#111827', background: '#f3f4f6', padding: '2px 8px', borderRadius: 6 };
const asgDetailS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' };
const waitingS: CSSProperties = { textAlign: 'center', padding: '24px 20px', background: '#fffbeb', borderRadius: 12, border: '1px solid #fef3c7' };
const cancelBtnS: CSSProperties = { width: '100%', padding: '12px 20px', borderRadius: 10, border: '1px solid #fca5a5', background: '#fff', color: '#dc2626', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 };
const editBtnS: CSSProperties = { background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#4f46e5', display: 'flex' };
const emptyS: CSSProperties = { textAlign: 'center', padding: '80px 20px' };
