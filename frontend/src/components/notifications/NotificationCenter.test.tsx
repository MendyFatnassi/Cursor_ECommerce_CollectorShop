import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import NotificationCenter from './NotificationCenter';
import client from '@api/client';

vi.mock('@api/client', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('NotificationCenter', () => {
  it('affiche les notifications', async () => {
    const clientMock = vi.mocked(client);
    clientMock.get
      .mockResolvedValueOnce({
        data: [
          {
            id: 'event-1',
            message: 'Nouvelle notification',
            createdAt: new Date().toISOString(),
            channel: 'IN_APP'
          }
        ]
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: 'pref-1',
            userId: 'user-1',
            trigger: 'NEW_LISTING',
            channel: 'IN_APP',
            enabled: true
          }
        ]
      });

    render(<NotificationCenter />);

    await waitFor(() => {
      expect(screen.getByText('Nouvelle notification')).toBeInTheDocument();
    });
    expect(screen.getByText('1 préférences actives')).toBeInTheDocument();
  });
});
