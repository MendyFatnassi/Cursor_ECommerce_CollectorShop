import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';

afterEach(async () => {
  const { default: usePortalStore } = await import('@store/usePortalStore');
  usePortalStore.setState({
    profile: undefined,
    listings: [],
    stores: [],
    chatThreads: [],
    notificationPrefs: []
  });
  localStorage.clear();
  vi.clearAllMocks();
});
