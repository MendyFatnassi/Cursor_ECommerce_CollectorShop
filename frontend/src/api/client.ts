import axios from 'axios';
import keycloak from '@auth/keycloak';

const client = axios.create({
  baseURL: '/api',
  timeout: 8000
});

client.interceptors.request.use(async (config) => {
  if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30);
    } catch (error) {
      console.warn('Impossible de rafraîchir le token Keycloak', error);
    }
    if (keycloak.token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
  }
  return config;
});

export default client;




