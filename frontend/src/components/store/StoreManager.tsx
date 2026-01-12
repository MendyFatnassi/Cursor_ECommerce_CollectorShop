import { useEffect } from 'react';
import client from '@api/client';
import usePortalStore from '@store/usePortalStore';
import { ListingSummary } from '@types/index';

const StoreManager = () => {
  const listings = usePortalStore((state) => state.listings);
  const setListings = usePortalStore((state) => state.setListings);

  useEffect(() => {
    const fetchListings = async () => {
      const response = await client.get<ListingSummary[]>('/seller/listings');
      setListings(response.data);
    };
    fetchListings();
  }, [setListings]);

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">🏪</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Boutiques & articles</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Contrôle automatique Collector activé
            </p>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <span>+</span>
          <span>Nouvelle boutique</span>
        </button>
      </div>
      <div className="space-y-3">
        {listings.map((listing) => (
          <article
            key={listing.id}
            className="border-2 border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-emerald-50/20 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  {listing.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold text-emerald-600">
                    {listing.price} {listing.currency}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                    {listing.status}
                  </span>
                </div>
              </div>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 underline ml-4">
                Modifier
              </button>
            </div>
          </article>
        ))}
        {!listings.length && (
          <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-xl">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-sm text-slate-500 mb-4">Aucun article publié.</p>
            <button className="btn-primary">Créer votre premier article</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreManager;




