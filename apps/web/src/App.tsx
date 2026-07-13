// ══════════════════════════════════════════════
//  FleetOps — Routeur avec auth
//  Redirige vers /login si pas connecté.
//  Redirige vers l'écran du rôle après connexion.
// ══════════════════════════════════════════════

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import type { ReactNode } from 'react';

// Auth
import LoginPage from './pages/auth/LoginPage';

// CDT
import RequestListPage from './pages/cdt/RequestListPage';
import RequestCreatePage from './pages/cdt/RequestCreatePage';
import RequestDetailPage from './pages/cdt/RequestDetailPage';
import CdtPlanningPage from './pages/cdt/PlanningPage';

// Gestionnaire
import GestionnairePlanningPage from './pages/gestionnaire/PlanningPage';

// Chauffeur
import DriverRoutePage from './pages/chauffeur/DriverRoutePage';
import MissionDetailPage from './pages/chauffeur/MissionDetailPage';
import ReportProblemPage from './pages/chauffeur/ReportProblemPage';

import MobileShell from './components/MobileShell';
import Icon from './components/Icons';
import type { IconName } from './components/Icons';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#6b7280', fontSize: 14 }}>
        Chargement...
      </div>
    );
  }

  return (
    <Routes>
      {/* Login — accessible sans auth */}
      <Route path="/login" element={user ? <RoleRedirect role={user.role} /> : <LoginPage />} />

      {/* CDT */}
      <Route path="/demandes" element={<Protected><RequestListPage /></Protected>} />
      <Route path="/demandes/nouvelle" element={<Protected><RequestCreatePage /></Protected>} />
      <Route path="/demandes/:id" element={<Protected><RequestDetailPage /></Protected>} />
      <Route path="/planning" element={<Protected><CdtPlanningPage /></Protected>} />

      {/* Gestionnaire */}
      <Route path="/gestionnaire/planning" element={<Protected><GestionnairePlanningPage /></Protected>} />

      {/* Chauffeur */}
      <Route path="/chauffeur" element={<Protected><DriverRoutePage /></Protected>} />
      <Route path="/chauffeur/mission/:id" element={<Protected><MissionDetailPage /></Protected>} />
      <Route path="/chauffeur/probleme" element={<Protected><ReportProblemPage /></Protected>} />

      {/* Pages placeholder */}
      <Route path="/alertes" element={<Protected><PlaceholderPage title="Alertes" icon="bell" /></Protected>} />
      <Route path="/plus" element={<Protected><PlaceholderPage title="Plus" icon="menu" /></Protected>} />

      {/* Redirection par défaut */}
      <Route path="*" element={user ? <RoleRedirect role={user.role} /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

/** Protège une route — redirige vers /login si pas connecté */
function Protected({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Redirige vers l'écran principal du rôle */
function RoleRedirect({ role }: { role: string }) {
  switch (role) {
    case 'admin':
    case 'gestionnaire_transport':
      return <Navigate to="/gestionnaire/planning" replace />;
    case 'chauffeur':
      return <Navigate to="/chauffeur" replace />;
    case 'conducteur_travaux':
    default:
      return <Navigate to="/demandes" replace />;
  }
}

function PlaceholderPage({ title, icon }: { title: string; icon: IconName }) {
  return (
    <MobileShell title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', color: '#9ca3af' }}>
        <Icon name={icon} size={48} />
        <p style={{ fontSize: 14, marginTop: 12 }}>{title} — à venir</p>
      </div>
    </MobileShell>
  );
}
