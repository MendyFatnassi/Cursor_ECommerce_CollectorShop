import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import StoreManager from './StoreManager';
import client from '@api/client';

vi.mock('@api/client', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('StoreManager', () => {
  it('affiche les listings du vendeur', async () => {
    const clientMock = vi.mocked(client);
    clientMock.get.mockResolvedValue({
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

    render(<StoreManager />);

    await waitFor(() => {
      expect(screen.getByText('Console rétro')).toBeInTheDocument();
    });
    expect(screen.getByText('260 EUR')).toBeInTheDocument();
  });
});
