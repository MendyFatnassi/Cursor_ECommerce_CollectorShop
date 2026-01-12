import usePortalStore from '@store/usePortalStore';
import client from '@api/client';

const NotificationSettings = () => {
  const { notificationPrefs, upsertNotificationPref } = usePortalStore();

  const togglePreference = async (prefId: string, enabled: boolean) => {
    const response = await client.patch(`/notifications/preferences/${prefId}`, { enabled });
    upsertNotificationPref(response.data);
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl">⚙️</span>
        </div>
        <h3 className="text-lg font-bold text-slate-800">Préférences</h3>
      </div>
      <div className="space-y-3">
        {notificationPrefs.map((pref) => (
          <label
            key={pref.id}
            className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-xl hover:border-cyan-300 transition-all cursor-pointer group"
          >
            <div className="flex-1">
              <p className="font-semibold text-slate-800 group-hover:text-cyan-600 transition-colors">
                {pref.trigger}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{pref.channel}</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={pref.enabled}
                onChange={(event) => togglePreference(pref.id, event.target.checked)}
                className="w-11 h-6 rounded-full appearance-none bg-slate-300 checked:bg-gradient-to-r checked:from-cyan-500 checked:to-blue-500 transition-all duration-200 cursor-pointer relative"
              />
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                  pref.enabled ? 'translate-x-5' : ''
                }`}
              ></span>
            </div>
          </label>
        ))}
        {!notificationPrefs.length && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">📋</span>
            </div>
            <p className="text-sm text-slate-500">Aucun canal configuré.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;




