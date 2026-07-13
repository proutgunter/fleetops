// ══════════════════════════════════════════════
//  Écran 1 — Liste des demandes de transport
// ══════════════════════════════════════════════

import { useState, useMemo, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import FilterTabs from '../../components/FilterTabs';
import RequestCard from '../../components/RequestCard';
import Icon from '../../components/Icons';
import { requests as mockRequests } from '../../services/mockData';

type FilterKey = 'all' | 'today' | 'recurring';

export default function RequestListPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const requests = mockRequests;

  const counts = useMemo(() => ({
    all: requests.length,
    today: requests.filter((r) => r.recurrenceType === 'one_time').length,
    recurring: requests.filter((r) => r.recurrenceType === 'recurring').length,
  }), [requests]);

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case 'today': return requests.filter((r) => r.recurrenceType === 'one_time');
      case 'recurring': return requests.filter((r) => r.recurrenceType === 'recurring');
      default: return requests;
    }
  }, [requests, activeFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
      if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filtered]);

  const tabs = [
    { key: 'all', label: 'Toutes', count: counts.all },
    { key: 'today', label: 'Jour J', count: counts.today },
    { key: 'recurring', label: 'Long terme', count: counts.recurring },
  ];

  return (
    <MobileShell title="Mes demandes"
      headerRight={
        <button type="button" style={searchBtnStyle} aria-label="Rechercher">
          <Icon name="search" size={20} />
        </button>
      }>
      <div style={{ paddingTop: 12 }}>
        <FilterTabs tabs={tabs} activeKey={activeFilter}
          onChange={(key) => setActiveFilter(key as FilterKey)} />
      </div>
      <div style={listStyle}>
        {sorted.length === 0 ? (
          <div style={emptyStyle}>
            <Icon name="file-text" size={40} color="#d1d5db" />
            <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 8 }}>
              Aucune demande pour ce filtre
            </p>
          </div>
        ) : (
          sorted.map((req) => (
            <RequestCard key={req.id} request={req}
              onClick={() => navigate(`/demandes/${req.id}`)} />
          ))
        )}
      </div>
      <button type="button" style={fabStyle}
        onClick={() => navigate('/demandes/nouvelle')} aria-label="Nouvelle demande">
        <Icon name="plus" size={24} color="#fff" />
      </button>
    </MobileShell>
  );
}

const searchBtnStyle: CSSProperties = {
  background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#6b7280', display: 'flex',
};
const listStyle: CSSProperties = { padding: '4px 16px 100px' };
const emptyStyle: CSSProperties = { textAlign: 'center', padding: '60px 20px' };
const fabStyle: CSSProperties = {
  position: 'fixed', bottom: 'max(80px, calc(60px + env(safe-area-inset-bottom)))',
  right: 20, width: 56, height: 56, borderRadius: 16, background: '#4f46e5',
  color: '#fff', border: 'none', cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 4px 16px rgba(79,70,229,0.35)', zIndex: 10,
};
