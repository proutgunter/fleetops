// ══════════════════════════════════════════════
//  AuthContext — état d'authentification global
//  Stocke le token JWT et l'utilisateur connecté.
//  Redirige vers /login si pas de token.
// ══════════════════════════════════════════════

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const TOKEN_KEY = 'fleetops_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au démarrage, vérifier si un token existe
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      // Valider le token auprès de l'API
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${stored}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Token invalide');
          return res.json();
        })
        .then((userData) => {
          setToken(stored);
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || 'Erreur de connexion');
    }

    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    setToken(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook pour accéder à l'état d'auth */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return ctx;
}
