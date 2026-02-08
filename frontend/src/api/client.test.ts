import { describe, expect, it, vi } from 'vitest';
import client from './client';

const updateTokenMock = vi.fn().mockResolvedValue(true);

vi.mock('@auth/keycloak', () => ({
  default: {
    authenticated: true,
    token: 'token',
    updateToken: updateTokenMock
  }
}));

describe('api client', () => {
  it('ajoute le header Authorization quand Keycloak est authentifié', async () => {
    const handler = client.interceptors.request.handlers[0]?.fulfilled;
    const config = await handler?.({ headers: {} });

    expect(updateTokenMock).toHaveBeenCalled();
    expect(config?.headers?.Authorization).toBe('Bearer token');
  });

  it("n’ajoute rien quand Keycloak n'est pas authentifié", async () => {
    const keycloak = (await import('@auth/keycloak')).default;
    keycloak.authenticated = false;
    keycloak.token = undefined;

    const handler = client.interceptors.request.handlers[0]?.fulfilled;
    const config = await handler?.({});

    expect(config?.headers?.Authorization).toBeUndefined();
  });
});
