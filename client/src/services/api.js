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

// A rejected token (expired, or signed with a different JWT_SECRET) logs the user out
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthToken(null);
      window.location.replace('/');
    }
    return Promise.reject(err);
  },
);

export default API;
