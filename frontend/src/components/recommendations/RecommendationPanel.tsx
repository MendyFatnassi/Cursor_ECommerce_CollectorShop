import { useEffect, useState } from 'react';
import client from '@api/client';
import { ListingSummary } from '@types/index';

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
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
      <h3 className="text-lg font-semibold">Recommandations</h3>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((item) => (
          <article key={item.id} className="border border-slate-100 rounded-xl p-3">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-slate-500">
              {item.price} {item.currency}
            </p>
          </article>
        ))}
        {!items.length && <p className="text-sm text-slate-500">Chargement des recommandations…</p>}
      </div>
    </div>
  );
};

export default RecommendationPanel;




