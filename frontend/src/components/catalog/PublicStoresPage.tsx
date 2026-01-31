import { useEffect, useState } from 'react';
import client from '@api/client';
import { SellerStore } from '@shared/index';

const PublicStoresPage = () => {
  const [stores, setStores] = useState<SellerStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await client.get<SellerStore[]>('/stores');
        setStores(response.data);
      } catch {
        setError('Impossible de charger les boutiques.');
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Boutiques
        </h1>
        <p className="text-slate-600">Explorez les boutiques disponibles sur la plateforme.</p>
      </div>

      {loading && <p className="text-sm text-slate-500">Chargement des boutiques…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2">
          {stores.map((store) => (
            <div key={store.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">{store.name}</p>
                <p className="text-xs text-slate-500">{store.slug}</p>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(store.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          ))}
          {!stores.length && (
            <div className="card p-6 text-center text-sm text-slate-500">
              Aucune boutique publique pour le moment.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicStoresPage;
