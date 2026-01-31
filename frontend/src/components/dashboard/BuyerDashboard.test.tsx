import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import BuyerDashboard from './BuyerDashboard';
import client from '@api/client';
import usePortalStore from '@store/usePortalStore';

vi.mock('@api/client', () => ({
  default: {
    get: vi.fn()
  }
}));

const clientMock = vi.mocked(client);

beforeEach(() => {
  clientMock.get.mockResolvedValue({ data: [] });
});

describe('BuyerDashboard', () => {
  it('affiche l’écran d’accueil si non connecté', () => {
    render(<BuyerDashboard />);

    expect(screen.getByText('Catalogue Acheteur')).toBeInTheDocument();
    expect(screen.getByText('Créez un compte pour accéder à vos achats, notifications et préférences.')).toBeInTheDocument();
  });

  it('affiche le tableau de bord pour un acheteur connecté', async () => {
    usePortalStore.setState({
      profile: {
        id: '1',
        fullName: 'Jean',
        email: 'user@example.com',
        emailVerified: true,
        roles: ['BUYER'],
        preferredLocales: ['fr-FR'],
        reputation: 0,
        interestTags: ['retro']
      },
      listings: [
        {
          id: 'listing-1',
          title: 'Vinyle',
          price: 95,
          currency: 'EUR',
          status: 'Confirmé'
        }
      ],
      notificationPrefs: [
        {
          id: 'pref-1',
          userId: '1',
          trigger: 'NEW_LISTING',
          channel: 'IN_APP',
          enabled: true
        }
      ]
    });

    clientMock.get.mockImplementation((url: string) => {
      if (url === '/recommendations') {
        return Promise.resolve({ data: [] });
      }
      if (url === '/notifications') {
        return Promise.resolve({
          data: [
            {
              id: 'event-1',
              message: 'Nouvelle notification',
              createdAt: new Date().toISOString(),
              channel: 'IN_APP'
            }
          ]
        });
      }
      if (url === '/notifications/preferences') {
        return Promise.resolve({
          data: [
            {
              id: 'pref-1',
              userId: '1',
              trigger: 'NEW_LISTING',
              channel: 'IN_APP',
              enabled: true
            }
          ]
        });
      }
      return Promise.resolve({ data: [] });
    });

    render(<BuyerDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Tableau de bord Acheteur')).toBeInTheDocument();
    });
    expect(screen.getByText('Vinyle')).toBeInTheDocument();
    expect(screen.getByText('Nouvelle notification')).toBeInTheDocument();
  });
});
