import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, vi } from 'vitest';
import App from './App';
import client from '@api/client';

const useKeycloakMock = vi.fn();

vi.mock('@react-keycloak/web', () => ({
  useKeycloak: () => useKeycloakMock()
}));

vi.mock('@api/client', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('App', () => {
  beforeEach(() => {
    useKeycloakMock.mockReset();
  });

  it('redirige vers l’accueil pour un visiteur', () => {
    const clientMock = vi.mocked(client);
    clientMock.get.mockResolvedValue({ data: [] });
    useKeycloakMock.mockReturnValue({
      keycloak: { authenticated: false },
      initialized: true
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Découvrez les boutiques et les articles')).toBeInTheDocument();
  });

  it('charge le profil si un token existe', async () => {
    const clientMock = vi.mocked(client);
    useKeycloakMock.mockReturnValue({
      keycloak: { authenticated: true },
      initialized: true
    });
    clientMock.get.mockImplementation((url: string) => {
      if (url === '/profiles/me') {
        return Promise.resolve({
          data: {
            id: '1',
            fullName: 'Jean',
            email: 'user@example.com',
            emailVerified: true,
            roles: ['BUYER'],
            preferredLocales: ['fr-FR'],
            reputation: 0,
            interestTags: []
          }
        });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <MemoryRouter initialEntries={['/accueil']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(clientMock.get).toHaveBeenCalledWith('/profiles/me');
    });
  });
});
