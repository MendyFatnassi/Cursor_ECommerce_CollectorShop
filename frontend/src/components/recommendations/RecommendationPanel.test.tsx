import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RecommendationPanel from './RecommendationPanel';
import client from '@api/client';

vi.mock('@api/client', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('RecommendationPanel', () => {
  it('affiche une recommandation', async () => {
    const clientMock = vi.mocked(client);
    clientMock.get.mockResolvedValue({
      data: [
        {
          id: 'listing-1',
          title: 'Objet',
          price: 120,
          currency: 'EUR',
          status: 'PUBLISHED'
        }
      ]
    });

    render(<RecommendationPanel />);

    await waitFor(() => {
      expect(screen.getByText('Objet')).toBeInTheDocument();
    });
    expect(screen.getByText('120 EUR')).toBeInTheDocument();
  });
});
