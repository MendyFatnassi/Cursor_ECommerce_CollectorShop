import { create } from 'zustand';
import { UserProfile, ListingSummary, ChatThread, NotificationPreference } from '@shared/index';

interface PortalState {
  profile?: UserProfile;
  listings: ListingSummary[];
  chatThreads: ChatThread[];
  notificationPrefs: NotificationPreference[];
  setProfile: (profile: UserProfile) => void;
  setListings: (listings: ListingSummary[]) => void;
  upsertNotificationPref: (pref: NotificationPreference) => void;
}

const usePortalStore = create<PortalState>((set) => ({
  listings: [],
  chatThreads: [],
  notificationPrefs: [],
  setProfile: (profile) => set({ profile }),
  setListings: (listings) => set({ listings }),
  upsertNotificationPref: (pref) =>
    set((state) => {
      const next = state.notificationPrefs.filter((p) => p.id !== pref.id);
      next.push(pref);
      return { notificationPrefs: next };
    })
}));

export default usePortalStore;




