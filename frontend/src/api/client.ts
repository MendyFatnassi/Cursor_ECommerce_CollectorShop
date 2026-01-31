import axios from 'axios';

const TOKEN_KEY = 'collector_session';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const setAuthToken = (token?: string | null) => {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
};

const client = axios.create({
  baseURL: '/api',
  timeout: 8000
});

client.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;




