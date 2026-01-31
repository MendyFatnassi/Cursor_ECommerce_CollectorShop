import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AdminModerationConsole from './AdminModerationConsole';
import client from '@api/client';

vi.mock('@api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe('AdminModerationConsole', () => {
  it('affiche les listings en attente et les alertes', async () => {
    const clientMock = vi.mocked(client);
    clientMock.get
      .mockResolvedValueOnce({
        data: [
          {
            id: '1',
            title: 'Objet rare',
            sellerName: 'Boutique X',
            submittedAt: new Date().toISOString()
          }
        ]
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: '2',
            message: 'Alerte fraude',
            severity: 'HIGH',
            createdAt: new Date().toISOString()
          }
        ]
      });

    render(<AdminModerationConsole />);

    await waitFor(() => {
      expect(screen.getByText('Objet rare')).toBeInTheDocument();
    });
    expect(screen.getByText('Alerte fraude')).toBeInTheDocument();
  });
});
