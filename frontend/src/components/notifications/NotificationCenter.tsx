import { useEffect, useState } from 'react';
import client from '@api/client';
import { NotificationPreference } from '@shared/index';

interface NotificationEvent {
  id: string;
  message: string;
  createdAt: string;
  channel: 'IN_APP' | 'EMAIL';
}

const NotificationCenter = () => {
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const [prefs, setPrefs] = useState<NotificationPreference[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [eventResponse, prefResponse] = await Promise.all([
        client.get<NotificationEvent[]>('/notifications'),
        client.get<NotificationPreference[]>('/notifications/preferences')
      ]);
      setEvents(eventResponse.data);
      setPrefs(prefResponse.data);
    };
    loadData();
  }, []);

  return (
    <div className="card p-6 space-y-4">
      <header className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl">🔔</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800">Notifications</h3>
          <p className="text-xs text-slate-500">
            {prefs.filter((pref) => pref.enabled).length} préférences actives
          </p>
        </div>
      </header>
      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        {events.map((event) => (
          <article
            key={event.id}
            className="border-2 border-slate-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-amber-50/20"
          >
            <p className="font-medium text-slate-800 mb-2">{event.message}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className={`px-2 py-0.5 rounded-full ${
                event.channel === 'IN_APP' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {event.channel}
              </span>
              <span>•</span>
              <span>{new Date(event.createdAt).toLocaleString()}</span>
            </div>
          </article>
        ))}
        {!events.length && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">📭</span>
            </div>
            <p className="text-sm text-slate-500">Aucune notification récente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;




