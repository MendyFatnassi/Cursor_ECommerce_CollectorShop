import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import InterestPreferences from './InterestPreferences';
import client from '@api/client';
import usePortalStore from '@store/usePortalStore';

vi.mock('@api/client', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('InterestPreferences', () => {
  it('affiche un message si aucun profil', () => {
    render(<InterestPreferences />);

    expect(screen.getByText("Connectez-vous pour gérer vos centres d'intérêt.")).toBeInTheDocument();
  });

  it('ajoute un tag via l’API', async () => {
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
    clientMock.post.mockResolvedValue({ data: ['retro'] });

    render(<InterestPreferences />);

    await user.type(screen.getByPlaceholderText('Ajouter un tag...'), 'retro');
    await user.click(screen.getByRole('button', { name: 'Ajouter' }));

    expect(clientMock.post).toHaveBeenCalledWith('/profiles/interests', { tag: 'retro' });
    expect(screen.getByText('retro')).toBeInTheDocument();
  });
});
