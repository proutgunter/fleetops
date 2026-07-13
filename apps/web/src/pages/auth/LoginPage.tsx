// ══════════════════════════════════════════════
//  LoginPage — connexion email/mot de passe
//  Design sobre, logo FleetOps, gestion d'erreur
// ══════════════════════════════════════════════

import { useState, type CSSProperties, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../../components/Icons';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageS}>
      <div style={cardS}>
        {/* Logo */}
        <div style={logoS}>
          <Icon name="truck" size={32} color="#4f46e5" />
          <span style={logoTextS}>Fleet<span style={{ color: '#111827' }}>Ops</span></span>
        </div>
        <p style={subtitleS}>Gestion de flotte — connexion</p>

        {/* Erreur */}
        {error && (
          <div style={errorS}>
            <Icon name="alert-triangle" size={14} />
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={formS}>
          <div>
            <label style={labelS}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom@fleetops.lu"
              style={inputS}
              required
              autoFocus
              autoComplete="email"
            />
          </div>
          <div>
            <label style={labelS}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              style={inputS}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" style={btnS} disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Aide */}
        <p style={helpS}>
          Comptes de test — mot de passe : <strong>fleetops2026</strong>
        </p>
        <div style={accountsS}>
          <AccountHint email="admin@fleetops.lu" role="Admin" onClick={setEmail} />
          <AccountHint email="gestionnaire@fleetops.lu" role="Gestionnaire" onClick={setEmail} />
          <AccountHint email="dupont@fleetops.lu" role="Conducteur de travaux" onClick={setEmail} />
          <AccountHint email="weber@fleetops.lu" role="Chauffeur" onClick={setEmail} />
        </div>
      </div>
    </div>
  );
}

function AccountHint({ email, role, onClick }: { email: string; role: string; onClick: (e: string) => void }) {
  return (
    <button type="button" style={hintBtnS} onClick={() => onClick(email)}>
      <span style={{ fontSize: 12, fontWeight: 500, color: '#111827' }}>{role}</span>
      <span style={{ fontSize: 11, color: '#6b7280' }}>{email}</span>
    </button>
  );
}

const pageS: CSSProperties = {
  minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#f1f3f8', padding: 16,
};
const cardS: CSSProperties = {
  width: '100%', maxWidth: 400, background: '#fff', borderRadius: 16,
  padding: '40px 32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
};
const logoS: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 4,
};
const logoTextS: CSSProperties = { fontSize: 28, fontWeight: 800, color: '#4f46e5', letterSpacing: -1 };
const subtitleS: CSSProperties = { textAlign: 'center', fontSize: 13, color: '#6b7280', marginBottom: 28 };
const errorS: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px',
  background: '#fef2f2', borderRadius: 8, color: '#dc2626', fontSize: 13,
  fontWeight: 500, marginBottom: 16,
};
const formS: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const labelS: CSSProperties = { fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 };
const inputS: CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #d1d5db',
  fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#111827', outline: 'none',
};
const btnS: CSSProperties = {
  width: '100%', padding: '12px 20px', borderRadius: 10, border: 'none',
  background: '#4f46e5', color: '#fff', fontSize: 15, fontWeight: 600,
  fontFamily: 'inherit', cursor: 'pointer', marginTop: 4,
};
const helpS: CSSProperties = {
  textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 24, marginBottom: 8,
};
const accountsS: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 };
const hintBtnS: CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '8px 12px', borderRadius: 8, border: '1px solid #f3f4f6',
  background: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', width: '100%',
};
