import axios from 'axios';

const defaultBackendURL = 'https://hostit-server.up.railway.app';
const runtimeBaseURL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3000' : defaultBackendURL);

const api = axios.create({
  baseURL: runtimeBaseURL,
  timeout: 5000,
  headers: {
    'Accept': 'application/json'
  }
});

const normalizeBackendUrl = (value) => {
  if (typeof value === 'string') {
    return value.replace(/^http:\/\/hostit-server\.up\.railway\.app\//, 'https://hostit-server.up.railway.app/');
  }
  return value;
};

const normalizeResponseData = (data) => {
  if (Array.isArray(data)) {
    return data.map(normalizeResponseData);
  }
  if (data && typeof data === 'object') {
    const normalized = {};
    for (const key of Object.keys(data)) {
      normalized[key] = normalizeResponseData(data[key]);
    }
    return normalized;
  }
  return normalizeBackendUrl(data);
};

api.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      response.data = normalizeResponseData(response.data);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;