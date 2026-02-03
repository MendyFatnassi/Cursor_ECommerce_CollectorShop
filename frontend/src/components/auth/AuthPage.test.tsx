import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AuthPage from './AuthPage';

vi.mock('@api/client', () => ({
  default: {
    post: vi.fn()
  },
  setAuthToken: vi.fn()
}));

describe('AuthPage', () => {
  it('affiche une erreur si les conditions ne sont pas acceptées', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Inscription' }));
    await user.type(screen.getByLabelText('Nom complet'), 'Jean Dupont');
    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'Password1');
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'Password1');

    await user.click(screen.getByRole('button', { name: "S'inscrire" }));

    expect(screen.getByText('Vous devez accepter les conditions')).toBeInTheDocument();
  });
});
