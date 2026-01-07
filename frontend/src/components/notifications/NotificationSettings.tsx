import usePortalStore from '@store/usePortalStore';
import client from '@api/client';

const NotificationSettings = () => {
  const { notificationPrefs, upsertNotificationPref } = usePortalStore();

  const togglePreference = async (prefId: string, enabled: boolean) => {
    const response = await client.patch(`/notifications/preferences/${prefId}`, { enabled });
    upsertNotificationPref(response.data);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
      <h3 className="text-lg font-semibold">Préférences</h3>
      {notificationPrefs.map((pref) => (
        <label key={pref.id} className="flex items-center justify-between text-sm">
          <div>
            <p className="font-medium">{pref.trigger}</p>
            <p className="text-slate-500">{pref.channel}</p>
          </div>
          <input
            type="checkbox"
            checked={pref.enabled}
            onChange={(event) => togglePreference(pref.id, event.target.checked)}
          />
        </label>
      ))}
      {!notificationPrefs.length && <p className="text-sm text-slate-500">Aucun canal configuré.</p>}
    </div>
  );
};

export default NotificationSettings;




