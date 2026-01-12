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
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">💬</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Conversations</h3>
            <p className="text-xs text-slate-500 capitalize">{context}</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {threads.map((thread) => (
          <article
            key={thread.id}
            className="border-2 border-slate-200 rounded-xl p-4 hover:border-violet-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-gradient-to-br from-white to-violet-50/20 group"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="font-semibold text-slate-800 group-hover:text-violet-600 transition-colors">
                Annonce #{thread.listingId}
              </p>
              {thread.unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-violet-500 text-white text-xs font-bold rounded-full">
                  {thread.unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mb-2 line-clamp-2">{thread.lastMessagePreview}</p>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>{new Date(thread.updatedAt).toLocaleString()}</span>
              {thread.unreadCount > 0 && (
                <>
                  <span>•</span>
                  <span className="text-violet-600 font-medium">{thread.unreadCount} non lus</span>
                </>
              )}
            </p>
          </article>
        ))}
        {!threads.length && (
          <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-xl">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💭</span>
            </div>
            <p className="text-sm text-slate-500">Aucune conversation active.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationPanel;




