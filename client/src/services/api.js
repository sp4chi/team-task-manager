import axios from 'axios';

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://taskmanager-api.duckdns.org/api',
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = token;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export default API;
