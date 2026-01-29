import { create } from 'zustand';
import { UserProfile, ListingSummary, ChatThread, NotificationPreference, SellerStore } from '@shared/index';
import { setAuthToken } from '@api/client';

interface PortalState {
  profile?: UserProfile;
  listings: ListingSummary[];
  stores: SellerStore[];
  chatThreads: ChatThread[];
  notificationPrefs: NotificationPreference[];
  setProfile: (profile: UserProfile) => void;
  setListings: (listings: ListingSummary[]) => void;
  setStores: (stores: SellerStore[]) => void;
  upsertNotificationPref: (pref: NotificationPreference) => void;
  logout: () => void;
}

const usePortalStore = create<PortalState>((set) => ({
  listings: [],
  stores: [],
  chatThreads: [],
  notificationPrefs: [],
  setProfile: (profile) => set({ profile }),
  setListings: (listings) => set({ listings }),
  setStores: (stores) => set({ stores }),
  upsertNotificationPref: (pref) =>
    set((state) => {
      const next = state.notificationPrefs.filter((p) => p.id !== pref.id);
      next.push(pref);
      return { notificationPrefs: next };
    }),
  logout: () => {
    setAuthToken(null);
    set({ profile: undefined, listings: [], stores: [], chatThreads: [], notificationPrefs: [] });
  },
}));

export default usePortalStore;




