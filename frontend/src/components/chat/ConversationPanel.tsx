import { useEffect, useState } from 'react';
import usePortalStore from '@store/usePortalStore';
import client from '@api/client';
import { ChatThread } from '@types/index';

interface ConversationPanelProps {
  context: 'buyer' | 'seller';
}

const ConversationPanel = ({ context }: ConversationPanelProps) => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const profile = usePortalStore((state) => state.profile);

  useEffect(() => {
    if (!profile) return;
    const fetchThreads = async () => {
      const response = await client.get<ChatThread[]>(`/chat/threads`, {
        params: { context }
      });
      setThreads(response.data);
    };
    fetchThreads();
  }, [context, profile]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Conversations</h3>
        <span className="text-sm text-slate-500 capitalize">{context}</span>
      </div>
      <div className="space-y-3">
        {threads.map((thread) => (
          <article key={thread.id} className="p-3 border border-slate-100 rounded-xl">
            <p className="font-medium">Annonce #{thread.listingId}</p>
            <p className="text-sm text-slate-500">{thread.lastMessagePreview}</p>
            <p className="text-xs text-slate-400">
              {thread.unreadCount} non lus • {new Date(thread.updatedAt).toLocaleString()}
            </p>
          </article>
        ))}
        {!threads.length && <p className="text-sm text-slate-500">Aucune conversation active.</p>}
      </div>
    </div>
  );
};

export default ConversationPanel;




