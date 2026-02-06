import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SellerDashboard from './SellerDashboard';
import client from '@api/client';
import usePortalStore from '@store/usePortalStore';

vi.mock('@api/client', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('SellerDashboard', () => {
  it('affiche les sections du vendeur', async () => {
    usePortalStore.setState({
      profile: {
        id: '1',
        fullName: 'Jean',
        email: 'user@example.com',
        emailVerified: true,
        roles: ['SELLER'],
        preferredLocales: ['fr-FR'],
        reputation: 0,
        interestTags: []
      }
    });

    const clientMock = vi.mocked(client);
    clientMock.get.mockImplementation((url: string) => {
      if (url === '/seller/listings') {
        return Promise.resolve({
          data: [
            {
              id: 'listing-1',
              title: 'Console rétro',
              price: 260,
              currency: 'EUR',
              status: 'PUBLISHED'
            }
          ]
        });
      }
      if (url === '/chat/threads') {
        return Promise.resolve({
          data: [
            {
              id: 'thread-1',
              listingId: 'listing-1',
              buyerId: 'buyer-1',
              sellerId: 'seller-1',
              lastMessagePreview: 'Salut',
              unreadCount: 1,
              updatedAt: new Date().toISOString()
            }
          ]
        });
      }
      if (url === '/notifications') {
        return Promise.resolve({
          data: [
            {
              id: 'event-1',
              message: 'Alerte notification',
              createdAt: new Date().toISOString(),
              channel: 'IN_APP'
            }
          ]
        });
      }
      if (url === '/notifications/preferences') {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    render(<SellerDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Tableau de bord Vendeur')).toBeInTheDocument();
    });
    expect(screen.getByText('Console rétro')).toBeInTheDocument();
    expect(screen.getByText('Alerte notification')).toBeInTheDocument();
  });
});
