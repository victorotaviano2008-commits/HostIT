import axios from 'axios';

const runtimeBaseURL = (() => {
  // Use Vite injected variable if present (build-time)
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;

  // Runtime heuristics to derive backend URL when frontend is deployed separately
  try {
    const host = window.location.hostname || '';
    const protocol = window.location.protocol || 'https:';

    // If running on Railway frontend domain, point to server domain
    if (host.endsWith('hostit.up.railway.app')) return `${protocol}//hostit-server.up.railway.app`;

    // Local development fallback
    if (host === 'localhost' || host === '127.0.0.1') return 'http://localhost:3000';

    // Default to same origin
    return `${protocol}//${host}`;
  } catch (e) {
    return 'http://localhost:3000';
  }
})();

const api = axios.create({
  baseURL: runtimeBaseURL,
  timeout: 5000,
  headers: {
    'Accept': 'application/json'
  }
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;