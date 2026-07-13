// ══════════════════════════════════════════════
//  Écran 2 — Nouvelle demande de transport
// ══════════════════════════════════════════════

import { useState, useMemo, type CSSProperties, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import SiteCodeChip from '../../components/SiteCodeChip';
import Icon from '../../components/Icons';
import type { MissionMode, RecurrenceType } from '../../types';
import { sites as mockSites, vehicleTypes as mockVehicleTypes, vehicleAccessories as mockAccessories } from '../../services/mockData';

export default function RequestCreatePage() {
  const navigate = useNavigate();
  const [siteId, setSiteId] = useState('');
  const [vehicleTypeId, setVehicleTypeId] = useState('');
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [missionMode, setMissionMode] = useState<MissionMode>('duration');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('12:00');
  const [tripCount, setTripCount] = useState(1);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('one_time');
  const [recurrenceStart, setRecurrenceStart] = useState('');
  const [recurrenceEnd, setRecurrenceEnd] = useState('');
  const [siteSearch, setSiteSearch] = useState('');

  const filteredSites = useMemo(() => {
    if (!siteSearch) return mockSites;
    const q = siteSearch.toLowerCase();
    return mockSites.filter(s => s.code.includes(q) || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q));
  }, [siteSearch]);

  const compatibleAccessories = useMemo(() => {
    if (!vehicleTypeId) return [];
    return mockAccessories.filter(a => a.compatibleVehicleTypeIds.includes(vehicleTypeId));
  }, [vehicleTypeId]);

  const toggleAccessory = (accId: string) => {
    setSelectedAccessoryIds(prev => prev.includes(accId) ? prev.filter(id => id !== accId) : [...prev, accId]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Nouvelle demande :', { siteId, vehicleTypeId, selectedAccessoryIds, quantity, missionMode, startTime, endTime, tripCount, description, priority, recurrenceType, recurrenceStart, recurrenceEnd });
    navigate('/demandes');
  };

  const selectedSite = mockSites.find(s => s.id === siteId);

  return (
    <MobileShell title="Nouvelle demande" onBack={() => navigate('/demandes')} hideNav>
      <form onSubmit={handleSubmit} style={{ padding: '12px 16px' }}>

        <fieldset style={secS}>
          <legend style={legS}><Icon name="map-pin" size={16} color="#6b7280" /> Chantier</legend>
          {selectedSite ? (
            <div style={selSiteS}>
              <SiteCodeChip code={selectedSite.code} />
              <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{selectedSite.name}</span>
              <span style={changeS} onClick={() => { setSiteId(''); setSiteSearch(''); }}>Changer</span>
            </div>
          ) : (
            <>
              <input type="text" placeholder="Rechercher par code ou nom..." value={siteSearch}
                onChange={e => setSiteSearch(e.target.value)} style={inputS} autoFocus />
              <div style={siteListS}>
                {filteredSites.map(site => (
                  <button key={site.id} type="button" style={siteOptS}
                    onClick={() => { setSiteId(site.id); setSiteSearch(''); }}>
                    <SiteCodeChip code={site.code} size="sm" />
                    <span style={{ fontSize: 13, color: '#111827' }}>{site.name}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 'auto' }}>{site.city}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </fieldset>

        <fieldset style={secS}>
          <legend style={legS}><Icon name="truck" size={16} color="#6b7280" /> Type de camion</legend>
          <div style={vGridS}>
            {mockVehicleTypes.map(vt => (
              <button key={vt.id} type="button"
                style={vehicleTypeId === vt.id ? vBtnAct : vBtnS}
                onClick={() => { setVehicleTypeId(vt.id); setSelectedAccessoryIds(prev => prev.filter(accId => { const acc = mockAccessories.find(a => a.id === accId); return acc?.compatibleVehicleTypeIds.includes(vt.id); })); }}>
                {vt.label}
              </button>
            ))}
          </div>
          <div style={rowS}>
            <span style={{ fontSize: 13, color: '#374151' }}>Nombre de camions</span>
            <div style={stepperS}>
              <button type="button" style={stepBtnS} onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                <Icon name="minus" size={14} />
              </button>
              <span style={stepValS}>{quantity}</span>
              <button type="button" style={stepBtnS} onClick={() => setQuantity(quantity + 1)}>
                <Icon name="plus" size={14} />
              </button>
            </div>
          </div>
        </fieldset>

        {vehicleTypeId && compatibleAccessories.length > 0 && (
          <fieldset style={secS}>
            <legend style={legS}><Icon name="tool" size={16} color="#6b7280" /> Accessoires</legend>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {compatibleAccessories.map(acc => {
                const sel = selectedAccessoryIds.includes(acc.id);
                return (
                  <button key={acc.id} type="button" style={sel ? accAct : accS} onClick={() => toggleAccessory(acc.id)}>
                    {sel && <Icon name="check" size={13} />}
                    {acc.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <fieldset style={secS}>
          <legend style={legS}><Icon name="clock" size={16} color="#6b7280" /> Mobilisation</legend>
          <div style={tglGroupS}>
            <button type="button" style={missionMode === 'duration' ? tglAct : tglS} onClick={() => setMissionMode('duration')}>Créneau horaire</button>
            <button type="button" style={missionMode === 'trips' ? tglAct : tglS} onClick={() => setMissionMode('trips')}>Nombre de voyages</button>
          </div>
          {missionMode === 'duration' ? (
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <div style={{ flex: 1 }}><label style={lblS}>De</label><input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={inputS} /></div>
              <div style={{ flex: 1 }}><label style={lblS}>À</label><input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={inputS} /></div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}><label style={lblS}>Heure d'arrivée</label><input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={inputS} /></div>
              <div>
                <label style={lblS}>Voyages</label>
                <div style={stepperS}>
                  <button type="button" style={stepBtnS} onClick={() => setTripCount(Math.max(1, tripCount - 1))} disabled={tripCount <= 1}><Icon name="minus" size={14} /></button>
                  <span style={stepValS}>{tripCount}</span>
                  <button type="button" style={stepBtnS} onClick={() => setTripCount(tripCount + 1)}><Icon name="plus" size={14} /></button>
                </div>
              </div>
            </div>
          )}
        </fieldset>

        <fieldset style={secS}>
          <legend style={legS}><Icon name="align-left" size={16} color="#6b7280" /> Description</legend>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Ex: Évacuation terre niv. -2 parking" style={{ ...inputS, resize: 'vertical', minHeight: 80 }} rows={3} />
        </fieldset>

        <fieldset style={secS}>
          <legend style={legS}><Icon name="flag" size={16} color="#6b7280" /> Priorité</legend>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" style={priority === 'normal' ? prioAct : accS} onClick={() => setPriority('normal')}>Normale</button>
            <button type="button" style={priority === 'urgent' ? prioUrgAct : accS} onClick={() => setPriority('urgent')}>
              <Icon name="alert-triangle" size={13} /> Urgente
            </button>
          </div>
        </fieldset>

        <fieldset style={secS}>
          <legend style={legS}><Icon name="repeat" size={16} color="#6b7280" /> Récurrence</legend>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button type="button" style={recurrenceType === 'one_time' ? tglAct : tglS} onClick={() => setRecurrenceType('one_time')}>Ponctuelle (J-1)</button>
            <button type="button" style={recurrenceType === 'recurring' ? tglAct : tglS} onClick={() => setRecurrenceType('recurring')}>Long terme</button>
          </div>
          {recurrenceType === 'recurring' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}><label style={lblS}>Du</label><input type="date" value={recurrenceStart} onChange={e => setRecurrenceStart(e.target.value)} style={inputS} /></div>
              <div style={{ flex: 1 }}><label style={lblS}>Au</label><input type="date" value={recurrenceEnd} onChange={e => setRecurrenceEnd(e.target.value)} style={inputS} /></div>
            </div>
          )}
        </fieldset>

        <button type="submit" style={submitS}><Icon name="send" size={18} color="#fff" /> Envoyer la demande</button>
        <div style={{ height: 40 }} />
      </form>
    </MobileShell>
  );
}

// Styles
const secS: CSSProperties = { border: 'none', padding: 0, margin: '0 0 20px' };
const legS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10, padding: 0 };
const inputS: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#111827', outline: 'none' };
const lblS: CSSProperties = { fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' };
const rowS: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 };
const vGridS: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 };
const vBtnS: CSSProperties = { padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'center' };
const vBtnAct: CSSProperties = { ...vBtnS, border: '2px solid #4f46e5', background: '#eef2ff', color: '#4338ca', fontWeight: 600 };
const accS: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 14px', borderRadius: 20, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' };
const accAct: CSSProperties = { ...accS, border: '1px solid #7c3aed', background: '#ede9fe', color: '#5b21b6' };
const tglGroupS: CSSProperties = { display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb' };
const tglS: CSSProperties = { flex: 1, padding: '10px 12px', border: 'none', background: '#fff', color: '#6b7280', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' };
const tglAct: CSSProperties = { ...tglS, background: '#1e293b', color: '#fff', fontWeight: 600 };
const stepperS: CSSProperties = { display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: 10, overflow: 'hidden' };
const stepBtnS: CSSProperties = { width: 38, height: 38, background: '#f9fafb', border: 'none', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const stepValS: CSSProperties = { width: 44, textAlign: 'center', fontSize: 16, fontWeight: 600, color: '#111827', borderLeft: '1px solid #d1d5db', borderRight: '1px solid #d1d5db', lineHeight: '38px' };
const prioAct: CSSProperties = { ...accS, border: '1px solid #1e293b', background: '#1e293b', color: '#fff' };
const prioUrgAct: CSSProperties = { ...accS, border: '1px solid #dc2626', background: '#fef2f2', color: '#dc2626' };
const submitS: CSSProperties = { width: '100%', padding: '14px 20px', borderRadius: 12, border: 'none', background: '#4f46e5', color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 };
const selSiteS: CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb' };
const changeS: CSSProperties = { fontSize: 12, fontWeight: 600, color: '#4f46e5', cursor: 'pointer' };
const siteListS: CSSProperties = { maxHeight: 200, overflowY: 'auto', marginTop: 8, borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff' };
const siteOptS: CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'none', border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' };
