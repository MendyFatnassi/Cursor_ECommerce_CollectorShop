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
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Boutiques & articles</h3>
          <p className="text-sm text-slate-500">Contrôle automatique Collector activé</p>
        </div>
        <button className="px-3 py-2 bg-slate-900 text-white rounded-lg">Nouvelle boutique</button>
      </div>
      <div className="space-y-2">
        {listings.map((listing) => (
          <article key={listing.id} className="border border-slate-100 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{listing.title}</p>
                <p className="text-xs text-slate-500">
                  {listing.status} • {listing.price} {listing.currency}
                </p>
              </div>
              <button className="text-sm text-slate-600 underline">Modifier</button>
            </div>
          </article>
        ))}
        {!listings.length && <p className="text-sm text-slate-500">Aucun article publié.</p>}
      </div>
    </div>
  );
};

export default StoreManager;




