import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred.';
    console.error('[API Error]', message);
    return Promise.reject(error);
  },
);

// ─── Employees ────────────────────────────────────────────────────────────────
export const employeeAPI = {
  getAll:   ()       => api.get('/employees'),
  getById:  (id)     => api.get(`/employees/${id}`),
  create:   (data)   => api.post('/employees', data),
  update:   (id, data) => api.put(`/employees/${id}`, data),
  delete:   (id)     => api.delete(`/employees/${id}`),
};

// ─── Payroll ──────────────────────────────────────────────────────────────────
export const payrollAPI = {
  getAll:    ()       => api.get('/payroll'),
  getById:   (id)     => api.get(`/payroll/${id}`),
  create:    (data)   => api.post('/payroll', data),
  calculate: (data)   => api.post('/payroll/calculate', data),
  update:    (id, data) => api.put(`/payroll/${id}`, data),
  delete:    (id)     => api.delete(`/payroll/${id}`),
};

// ─── Assets ───────────────────────────────────────────────────────────────────
export const assetAPI = {
  getAll:   ()       => api.get('/assets'),
  getById:  (id)     => api.get(`/assets/${id}`),
  create:   (data)   => api.post('/assets', data),
  update:   (id, data) => api.put(`/assets/${id}`, data),
  delete:   (id)     => api.delete(`/assets/${id}`),
};

// ─── Asset Maintenance ────────────────────────────────────────────────────────
export const maintenanceAPI = {
  getAll:  ()       => api.get('/asset-maintenance'),
  create:  (data)   => api.post('/asset-maintenance', data),
  update:  (id, d)  => api.put(`/asset-maintenance/${id}`, d),
  delete:  (id)     => api.delete(`/asset-maintenance/${id}`),
};

// ─── Asset Transfers ─────────────────────────────────────────────────────────
export const transferAPI = {
  getAll:  ()       => api.get('/asset-transfers'),
  create:  (data)   => api.post('/asset-transfers', data),
  update:  (id, d)  => api.put(`/asset-transfers/${id}`, d),
  delete:  (id)     => api.delete(`/asset-transfers/${id}`),
};

// ─── Asset Disposals ─────────────────────────────────────────────────────────
export const disposalAPI = {
  getAll:  ()       => api.get('/asset-disposals'),
  create:  (data)   => api.post('/asset-disposals', data),
  update:  (id, d)  => api.put(`/asset-disposals/${id}`, d),
  delete:  (id)     => api.delete(`/asset-disposals/${id}`),
};

export default api;
