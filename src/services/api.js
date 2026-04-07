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
  getDashboardStats: (days = 30, startDate = null, endDate = null) => {
    let url = `/dashboard/stats?days=${days}`;
    if (startDate && endDate) {
      url += `&start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`;
    }
    return apiFetch(url);
  },
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
  updateIncident: (id, data) => apiFetch(`/incidents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getIncidentRefs: () => apiFetch('/incidents/refs'),

  // Observations
  getObservations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/observations/?${query}`);
  },
  getObservationById: (ref) => apiFetch(`/observations_details?observation_ref=${encodeURIComponent(ref)}`),
  updateObservationStatus: (ref, data) => apiFetch(`/observations/${ref}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  saveObservationReview: (ref, data) => apiFetch(`/observation_review?observation_ref=${encodeURIComponent(ref)}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getObservationReviewAI: (id) => apiFetch(`/observationReviewAI?observation_id=${encodeURIComponent(id)}`),
  getObservationStats: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/observations/stats/?${query}`);
  },
  createObservation: (data) => apiFetch('/newObservation/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  // AI Analysis — sends multipart/form-data, no JSON header
  analyzeObservation: (formData) => {
    const url = `${API_BASE_URL}/observations/analyze/`;
    return fetch(url, {
      method: 'POST',
      body: formData, // FormData — browser sets correct multipart Content-Type automatically
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || `HTTP ${res.status}`);
      return data;
    });
  },

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
  getObservationEnums: () => apiFetch('/enums/observation-enums/all'),
  getEnumByCategory: (category) => apiFetch(`/enums/${category}`),
  getUsers: () => apiFetch('/enums/reference/users'),
  getDepartments: () => apiFetch('/enums/reference/departments'),
  getSubAreas: (area) => apiFetch(`/enums/reference/sub-areas?area=${encodeURIComponent(area)}`),
  getEquipment: () => apiFetch('/enums/reference/equipment'),
  getShippingLines: () => apiFetch('/enums/reference/shipping-lines'),
  getOperationalActivities: () => apiFetch('/enums/reference/operational-activities'),

  // Observation Review Factors (UNSAFE ABC)
  getPrimaryFactors: () => apiFetch('/observation-factors/primary'),
  getFactorOptions: (primaryId) => apiFetch(`/observation-factors/${primaryId}`),
  // Chatbot
  chatbotQuery: (message) => apiFetch('/chatbot/query', {
    method: 'POST',
    body: JSON.stringify({ message }),
  }),

  // AI Analysis — sends multipart/form-data, no JSON header
  analyzeIncidentMedia: (files, description = '') => {
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach(f => formData.append('files', f));
    } else {
      formData.append('files', files);
    }
    
    if (description) formData.append('description', description);
    
    return fetch(`${API_BASE_URL}/incidents/analyze`, {
      method: 'POST',
      body: formData,
    }).then(res => {
      if (!res.ok) throw new Error('AI analysis failed');
      return res.json();
    });
  },

  auditIncident: (id) => apiFetch(`/incidents/${id}/audit`, { method: 'POST' }),

  // Digital Twin
  getLiveTwinData: () => apiFetch('/digital-twin/live'),
};
