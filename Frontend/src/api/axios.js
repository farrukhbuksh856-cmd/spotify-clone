import axios from 'axios';

// In production on Netlify (single site), API requests are routed to /api via Netlify redirects.
// In local development, Vite dev server proxies /api to http://localhost:3000, or VITE_API_BASE_URL can override.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
