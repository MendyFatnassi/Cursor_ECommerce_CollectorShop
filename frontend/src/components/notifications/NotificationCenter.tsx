import { useEffect, useState } from 'react';
import client from '@api/client';
import { NotificationPreference } from '@types/index';

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
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
      <header>
        <h3 className="text-lg font-semibold">Notifications</h3>
        <p className="text-sm text-slate-500">
          {prefs.filter((pref) => pref.enabled).length} préférences actives
        </p>
      </header>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {events.map((event) => (
          <article key={event.id} className="border border-slate-100 rounded-xl p-3">
            <p className="font-medium">{event.message}</p>
            <p className="text-xs text-slate-400">
              {event.channel} • {new Date(event.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
        {!events.length && <p className="text-sm text-slate-500">Aucune notification récente.</p>}
      </div>
    </div>
  );
};

export default NotificationCenter;




