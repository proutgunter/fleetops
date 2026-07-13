// ══════════════════════════════════════════════
//  FleetOps — Point d'entrée
//  Monte l'app avec React Query pour le cache API
// ══════════════════════════════════════════════

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Pas de refetch automatique quand la fenêtre reprend le focus
      // (évite des appels inutiles sur mobile)
      refetchOnWindowFocus: false,
      // Retry une seule fois en cas d'erreur réseau
      retry: 1,
      // Données considérées fraîches pendant 30 secondes
      staleTime: 30 * 1000,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
