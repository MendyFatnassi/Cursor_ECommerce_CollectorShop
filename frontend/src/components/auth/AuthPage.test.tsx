import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, vi } from 'vitest';
import AuthPage from './AuthPage';

const loginMock = vi.fn();
const registerMock = vi.fn();

vi.mock('@auth/keycloak', () => ({
  default: {
    login: loginMock,
    register: registerMock
  }
}));

describe('AuthPage', () => {
  beforeEach(() => {
    loginMock.mockClear();
    registerMock.mockClear();
  });

  it('redirige vers Keycloak pour la connexion', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(loginMock).toHaveBeenCalled();
  });

  it("redirige vers Keycloak pour l'inscription", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Créer un compte' }));

    expect(registerMock).toHaveBeenCalled();
  });
});
