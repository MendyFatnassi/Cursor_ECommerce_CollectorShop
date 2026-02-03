import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ConversationPanel from './ConversationPanel';
import client from '@api/client';
import usePortalStore from '@store/usePortalStore';

vi.mock('@api/client', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('ConversationPanel', () => {
  it('affiche les conversations', async () => {
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
    const clientMock = vi.mocked(client);
    clientMock.get.mockResolvedValue({
      data: [
        {
          id: 'thread-1',
          listingId: 'listing-1',
          buyerId: 'buyer-1',
          sellerId: 'seller-1',
          lastMessagePreview: 'Hello',
          unreadCount: 2,
          updatedAt: new Date().toISOString()
        }
      ]
    });

    render(<ConversationPanel context="buyer" />);

    await waitFor(() => {
      expect(screen.getByText('Annonce #listing-1')).toBeInTheDocument();
    });
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
