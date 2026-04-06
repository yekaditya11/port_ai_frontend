const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Generic fetch wrapper with error handling.
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP Error ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`API Error (${endpoint}):`, err);
    throw err;
  }
}

export const api = {
  // Dashboard
  getDashboardStats: (days = 30) => apiFetch(`/dashboard/stats?days=${days}`),
  getTrendStats: (days = 30) => apiFetch(`/dashboard/trend?days=${days}`),

  // Incidents
  getIncidents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/incidents/?${query}`);
  },
  getIncidentById: (id) => apiFetch(`/incidents/${id}`),
  createIncident: (data) => apiFetch('/incidents/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateIncidentStatus: (id, status) => apiFetch(`/incidents/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),

  // RCA
  getRCAs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/rca/?${query}`);
  },
  getRcaById: (id) => apiFetch(`/rca/${id}`),
  createRca: (data) => apiFetch('/rca/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateRca: (id, data) => apiFetch(`/rca/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Actions
  getActions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/actions/?${query}`);
  },
  createAction: (data) => apiFetch('/actions/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateAction: (id, status) => apiFetch(`/actions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),

  // Workflow
  getWorkflows: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/workflow/?${query}`);
  },
  getWorkflowByIncidentId: (id) => apiFetch(`/workflow/${id}`),

  // Enums & Reference Data
  getEnumsAll: () => apiFetch('/enums/all'),
  getEnumByCategory: (category) => apiFetch(`/enums/${category}`),
  getUsers: () => apiFetch('/enums/reference/users'),
  getDepartments: () => apiFetch('/enums/reference/departments'),
  getSubAreas: (area) => apiFetch(`/enums/reference/sub-areas?area=${encodeURIComponent(area)}`),
  getEquipment: () => apiFetch('/enums/reference/equipment'),
  getShippingLines: () => apiFetch('/enums/reference/shipping-lines'),
  getOperationalActivities: () => apiFetch('/enums/reference/operational-activities'),
};
