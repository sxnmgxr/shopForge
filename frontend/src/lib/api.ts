import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ── Products ──────────────────────────────────────────────
export const productApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  getBySlug: (slug: string) => api.get(`/products/slug/${slug}`),
};

// ── Categories ────────────────────────────────────────────
export const categoryApi = {
  getAll: () => api.get('/categories'),
};

// ── Cart ──────────────────────────────────────────────────
export const cartApi = {
  get: () => api.get('/cart'),
  addItem: (product_id: string, quantity: number = 1) =>
    api.post('/cart/items', { product_id, quantity }),
  updateItem: (productId: string, quantity: number) =>
    api.put(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId: string) => api.delete(`/cart/items/${productId}`),
  clear: () => api.delete('/cart'),
};

// ── Orders ────────────────────────────────────────────────
export const orderApi = {
  create: (data: unknown) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
};
