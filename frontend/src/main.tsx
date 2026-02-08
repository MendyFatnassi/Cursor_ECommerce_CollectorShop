import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import './index.css';
import App from './App';
import keycloak from './auth/keycloak';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'login-required',
        pkceMethod: 'S256'
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReactKeycloakProvider>
  </React.StrictMode>
);




