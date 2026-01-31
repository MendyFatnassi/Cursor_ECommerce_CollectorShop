import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import NotificationSettings from './NotificationSettings';
import client from '@api/client';
import usePortalStore from '@store/usePortalStore';

vi.mock('@api/client', () => ({
  default: {
    patch: vi.fn()
  }
}));

describe('NotificationSettings', () => {
  it('met à jour une préférence', async () => {
    const user = userEvent.setup();
    usePortalStore.setState({
      notificationPrefs: [
        {
          id: 'pref-1',
          userId: 'user-1',
          trigger: 'NEW_LISTING',
          channel: 'IN_APP',
          enabled: true
        }
      ]
    });
    const clientMock = vi.mocked(client);
    clientMock.patch.mockResolvedValue({
      data: {
        id: 'pref-1',
        userId: 'user-1',
        trigger: 'NEW_LISTING',
        channel: 'IN_APP',
        enabled: false
      }
    });

    render(<NotificationSettings />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(clientMock.patch).toHaveBeenCalledWith('/notifications/preferences/pref-1', { enabled: false });
  });
});
