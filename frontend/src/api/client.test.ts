import { beforeEach, describe, expect, it } from 'vitest';
import client, { getAuthToken, setAuthToken } from './client';

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stocke et supprime le token', () => {
    setAuthToken('abc');
    expect(getAuthToken()).toBe('abc');

    setAuthToken(null);
    expect(getAuthToken()).toBeNull();
  });

  it('ajoute le header Authorization quand un token existe', async () => {
    setAuthToken('token');
    const handler = client.interceptors.request.handlers[0]?.fulfilled;
    const config = await handler?.({ headers: {} });

    expect(config?.headers?.Authorization).toBe('Bearer token');
  });

  it('n’ajoute rien sans token', async () => {
    setAuthToken(null);
    const handler = client.interceptors.request.handlers[0]?.fulfilled;
    const config = await handler?.({});

    expect(config?.headers?.Authorization).toBeUndefined();
  });
});
