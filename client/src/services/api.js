import axios from 'axios';

const API = axios.create({
  baseURL: 'team-task-manager-production-d9a5.up.railway.app/api',
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = token;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export default API;
