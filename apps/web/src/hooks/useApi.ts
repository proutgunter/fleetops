// ══════════════════════════════════════════════
//  FleetOps — Hooks React Query
//  Chaque hook encapsule un appel API avec
//  gestion du cache, du loading et des erreurs.
// ══════════════════════════════════════════════

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi, sitesApi, referenceApi, assignmentsApi } from '../services/api';

// ── Demandes de transport ──────────────────

/** Liste des demandes du CDT connecté */
export function useRequests(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['requests', params],
    queryFn: () => requestsApi.list(params),
  });
}

/** Détail d'une demande */
export function useRequest(id: string | undefined) {
  return useQuery({
    queryKey: ['requests', id],
    queryFn: () => requestsApi.get(id!),
    enabled: !!id,
  });
}

/** Créer une demande */
export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => requestsApi.create(data),
    onSuccess: () => {
      // Invalider la liste pour forcer le rechargement
      qc.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

/** Modifier une demande */
export function useUpdateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      requestsApi.update(id, data),
    onSuccess: (_result, variables) => {
      qc.invalidateQueries({ queryKey: ['requests'] });
      qc.invalidateQueries({ queryKey: ['requests', variables.id] });
    },
  });
}

/** Annuler une demande */
export function useCancelRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => requestsApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

// ── Chantiers ──────────────────────────────

/** Liste des chantiers */
export function useSites() {
  return useQuery({
    queryKey: ['sites'],
    queryFn: sitesApi.list,
    staleTime: 5 * 60 * 1000, // Cache 5 min — les chantiers changent peu
  });
}

// ── Données de référence ──────────────────

/** Types de véhicules */
export function useVehicleTypes() {
  return useQuery({
    queryKey: ['vehicleTypes'],
    queryFn: referenceApi.vehicleTypes,
    staleTime: 30 * 60 * 1000, // Cache 30 min
  });
}

/** Accessoires véhicules */
export function useVehicleAccessories() {
  return useQuery({
    queryKey: ['vehicleAccessories'],
    queryFn: referenceApi.vehicleAccessories,
    staleTime: 30 * 60 * 1000,
  });
}

/** Types de missions */
export function useMissionTypes() {
  return useQuery({
    queryKey: ['missionTypes'],
    queryFn: referenceApi.missionTypes,
    staleTime: 30 * 60 * 1000,
  });
}

// ── Affectations / Planning ───────────────

/** Affectations d'une date */
export function useAssignmentsByDate(date: string) {
  return useQuery({
    queryKey: ['assignments', 'date', date],
    queryFn: () => assignmentsApi.byDate(date),
    enabled: !!date,
  });
}

/** Affectations d'une demande spécifique */
export function useAssignmentsByRequest(requestId: string | undefined) {
  return useQuery({
    queryKey: ['assignments', 'request', requestId],
    queryFn: () => assignmentsApi.byRequest(requestId!),
    enabled: !!requestId,
  });
}

/** Vue planning complète (toutes les lignes camion d'un jour) */
export function usePlanning(date: string) {
  return useQuery({
    queryKey: ['planning', date],
    queryFn: () => assignmentsApi.planning(date),
    enabled: !!date,
  });
}
