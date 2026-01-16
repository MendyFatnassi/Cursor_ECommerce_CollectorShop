import { useEffect, useState } from 'react';
import client from '@api/client';
import { ListingSummary } from '@shared/index';

const RecommendationPanel = () => {
  const [items, setItems] = useState<ListingSummary[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const response = await client.get<ListingSummary[]>('/recommendations');
      setItems(response.data);
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl">✨</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Recommandations pour vous</h3>
          <p className="text-xs text-slate-500">Basé sur vos préférences</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="group border-2 border-slate-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-purple-50/30"
          >
            <p className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors mb-2">
              {item.title}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-purple-600">
                {item.price} {item.currency}
              </span>
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                Nouveau
              </span>
            </div>
          </article>
        ))}
        {!items.length && (
          <div className="col-span-2 flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-sm text-slate-500">Chargement des recommandations…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationPanel;




