import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import HomePage from './HomePage';
import usePortalStore from '@store/usePortalStore';
import client from '@api/client';
vi.mock('@api/client', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('HomePage', () => {
  it('affiche l’appel à connexion pour un visiteur', () => {
    const clientMock = vi.mocked(client);
    clientMock.get.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Se connecter / Créer un compte')).toBeInTheDocument();
  });

  it('cache l’appel à connexion pour un utilisateur connecté', () => {
    const clientMock = vi.mocked(client);
    clientMock.get.mockResolvedValue({ data: [] });
    usePortalStore.setState({
      profile: {
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

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.queryByText('Se connecter / Créer un compte')).not.toBeInTheDocument();
  });
});
