import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from './App';
import client, { getAuthToken } from '@api/client';

vi.mock('@api/client', () => ({
  default: {
    get: vi.fn()
  },
  getAuthToken: vi.fn(() => null),
  setAuthToken: vi.fn()
}));

describe('App', () => {
  it('redirige vers l’accueil pour un visiteur', () => {
    const clientMock = vi.mocked(client);
    clientMock.get.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Découvrez les boutiques et les articles')).toBeInTheDocument();
  });

  it('charge le profil si un token existe', async () => {
    const clientMock = vi.mocked(client);
    const getAuthTokenMock = vi.mocked(getAuthToken);
    getAuthTokenMock.mockReturnValue('token');
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
