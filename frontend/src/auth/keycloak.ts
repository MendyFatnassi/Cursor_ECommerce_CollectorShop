import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
});

if (import.meta.env.VITE_KEYCLOAK_DISABLED === 'true') {
  keycloak.init = async () => false;
  keycloak.login = async () => undefined;
  keycloak.register = async () => undefined;
  keycloak.logout = async () => undefined;
  keycloak.updateToken = async () => false;
  keycloak.authenticated = false;
  keycloak.token = undefined;
}

export default keycloak;
