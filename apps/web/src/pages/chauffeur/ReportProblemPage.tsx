// ══════════════════════════════════════════════
//  Écran 3 — Signaler un problème
//  6 types prédéfinis, texte libre, option photo
// ══════════════════════════════════════════════

import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon, { type IconName } from '../../components/Icons';

interface ProblemType {
  id: string;
  label: string;
  icon: IconName;
  color: string;
}

const PROBLEM_TYPES: ProblemType[] = [
  { id: 'panne',      label: 'Panne',          icon: 'tool',           color: '#dc2626' },
  { id: 'retard',     label: 'Retard',         icon: 'clock',          color: '#f59e0b' },
  { id: 'acces',      label: 'Accès bloqué',   icon: 'x',             color: '#ef4444' },
  { id: 'chargement', label: 'Chargement',     icon: 'truck',          color: '#3b82f6' },
  { id: 'securite',   label: 'Sécurité',       icon: 'alert-triangle', color: '#7c3aed' },
  { id: 'autre',      label: 'Autre',          icon: 'flag',           color: '#6b7280' },
];

export default function ReportProblemPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedType) return;
    console.log('Problème signalé :', { type: selectedType, description });
    setSubmitted(true);
    setTimeout(() => navigate('/chauffeur'), 1500);
  };

  if (submitted) {
    return (
      <div style={shellS}>
        <div style={successS}>
          <Icon name="check" size={48} color="#22c55e" />
          <p style={{ fontSize: 16, fontWeight: 600, color: '#065f46', marginTop: 12 }}>Signalement envoyé</p>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Le gestionnaire transport a été notifié.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={shellS}>
      <header style={headerS}>
        <button type="button" style={backS} onClick={() => navigate(-1)}>
          <Icon name="arrow-left" size={20} />
        </button>
        <span style={titleS}>Signaler un problème</span>
      </header>

      <main style={contentS}>
        {/* Type de problème */}
        <div style={sectionS}>
          <div style={secTitleS}>Type de problème</div>
          <div style={gridS}>
            {PROBLEM_TYPES.map((pt) => (
              <button key={pt.id} type="button"
                style={selectedType === pt.id ? { ...typeCardS, borderColor: pt.color, background: `${pt.color}0a` } : typeCardS}
                onClick={() => setSelectedType(pt.id)}>
                <div style={{ ...typeIconS, background: `${pt.color}15`, color: pt.color }}>
                  <Icon name={pt.icon} size={20} />
                </div>
                <span style={typeLabelS}>{pt.label}</span>
                {selectedType === pt.id && (
                  <div style={{ ...checkCircleS, background: pt.color }}>
                    <Icon name="check" size={12} color="#fff" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={sectionS}>
          <div style={secTitleS}>Description (optionnel)</div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détaillez le problème..."
            style={textareaS}
            rows={4}
          />
        </div>

        {/* Photo */}
        <div style={sectionS}>
          <button type="button" style={photoBtnS}>
            <Icon name="plus" size={18} color="#6b7280" />
            <span>Ajouter une photo</span>
          </button>
        </div>

        {/* Envoyer */}
        <button type="button" style={{ ...submitS, opacity: selectedType ? 1 : 0.4 }}
          onClick={handleSubmit} disabled={!selectedType}>
          <Icon name="send" size={18} color="#fff" />
          Envoyer le signalement
        </button>
      </main>
    </div>
  );
}

const shellS: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100dvh', maxWidth: 480, margin: '0 auto', background: '#f8f9fb' };
const headerS: CSSProperties = { background: '#fff', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 12, paddingTop: 'max(12px, env(safe-area-inset-top))' };
const backS: CSSProperties = { background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#374151', display: 'flex' };
const titleS: CSSProperties = { fontSize: 17, fontWeight: 600, color: '#111827' };
const contentS: CSSProperties = { flex: 1, overflowY: 'auto', padding: '16px 16px 30px' };
const sectionS: CSSProperties = { marginBottom: 20 };
const secTitleS: CSSProperties = { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 };
const gridS: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 };
const typeCardS: CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
  padding: '16px 8px', borderRadius: 12, border: '2px solid #e5e7eb',
  background: '#fff', cursor: 'pointer', fontFamily: 'inherit', position: 'relative',
};
const typeIconS: CSSProperties = {
  width: 44, height: 44, borderRadius: 12, display: 'flex',
  alignItems: 'center', justifyContent: 'center',
};
const typeLabelS: CSSProperties = { fontSize: 12, fontWeight: 500, color: '#374151' };
const checkCircleS: CSSProperties = {
  position: 'absolute', top: 6, right: 6, width: 20, height: 20,
  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const textareaS: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #d1d5db',
  fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#111827',
  outline: 'none', resize: 'vertical', minHeight: 100,
};
const photoBtnS: CSSProperties = {
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: 8, padding: '14px', borderRadius: 10, border: '1px dashed #d1d5db',
  background: '#fff', color: '#6b7280', fontSize: 13, fontWeight: 500,
  fontFamily: 'inherit', cursor: 'pointer',
};
const submitS: CSSProperties = {
  width: '100%', padding: '14px 20px', borderRadius: 12, border: 'none',
  background: '#dc2626', color: '#fff', fontSize: 15, fontWeight: 600,
  fontFamily: 'inherit', cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center', gap: 8,
};
const successS: CSSProperties = {
  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', padding: 40,
};
