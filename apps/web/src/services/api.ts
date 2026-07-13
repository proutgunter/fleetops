// ══════════════════════════════════════════════
//  FleetOps — Client API
//  Envoie le token JWT dans chaque requête.
// ══════════════════════════════════════════════

const BASE = '/api';
const TOKEN_KEY = 'fleetops_token';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string, public details?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  // Token expiré ou invalide → déconnecter
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/login';
    throw new ApiError(401, 'Session expirée');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || `Erreur ${res.status}`, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Demandes de transport ──────────────────

export const requestsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<import('../types').TransportRequest[]>(`/requests${qs}`);
  },
  get: (id: string) => request<import('../types').TransportRequest>(`/requests/${id}`),
  create: (data: Record<string, unknown>) =>
    request<import('../types').TransportRequest>('/requests', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) =>
    request<import('../types').TransportRequest>(`/requests/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  cancel: (id: string) => request<void>(`/requests/${id}/cancel`, { method: 'POST' }),
};

// ── Chantiers ──────────────────────────────

export const sitesApi = {
  list: () => request<import('../types').Site[]>('/sites'),
  get: (id: string) => request<import('../types').Site>(`/sites/${id}`),
};

// ── Données de référence ──────────────────

export const referenceApi = {
  vehicleTypes: () => request<import('../types').VehicleType[]>('/reference-data/vehicle-types'),
  vehicleAccessories: () => request<import('../types').VehicleAccessory[]>('/reference-data/vehicle-accessories'),
  missionTypes: () => request<import('../types').MissionType[]>('/reference-data/mission-types'),
};

// ── Affectations ──────────────────────────

export const assignmentsApi = {
  byDate: (date: string) => request<import('../types').DailyAssignment[]>(`/assignments?date=${date}`),
  byRequest: (requestId: string) => request<import('../types').DailyAssignment[]>(`/assignments?requestId=${requestId}`),
  planning: (date: string) => request<import('../types').PlanningTruckRow[]>(`/assignments/planning?date=${date}`),
};
