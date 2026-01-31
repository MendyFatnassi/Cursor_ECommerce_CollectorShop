import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ProfilePage from './ProfilePage';
import client from '@api/client';
import usePortalStore from '@store/usePortalStore';

vi.mock('@api/client', () => ({
  default: {
    patch: vi.fn()
  }
}));

describe('ProfilePage', () => {
  it('met à jour le profil', async () => {
    const user = userEvent.setup();
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
    clientMock.patch.mockResolvedValue({
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

    render(<ProfilePage />);

    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));

    await waitFor(() => {
      expect(screen.getByText('Profil mis à jour.')).toBeInTheDocument();
    });
    expect(clientMock.patch).toHaveBeenCalled();
  });
});
