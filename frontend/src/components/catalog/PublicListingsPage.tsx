import { useEffect, useState } from 'react';
import client from '@api/client';
import { PublicListing } from '@shared/index';

const PublicListingsPage = () => {
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await client.get<PublicListing[]>('/listings');
        setListings(response.data);
      } catch {
        setError('Impossible de charger les articles.');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Articles
        </h1>
        <p className="text-slate-600">Découvrez les derniers articles publiés.</p>
      </div>

      {loading && <p className="text-sm text-slate-500">Chargement des articles…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2">
          {listings.map((listing) => (
            <article key={listing.id} className="card p-4 space-y-3">
              <div className="flex items-center gap-3">
                {listing.mediaUrls?.[0] ? (
                  <img
                    src={listing.mediaUrls[0]}
                    alt={listing.title}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
                    📦
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-800">{listing.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{listing.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-indigo-600">
                  {listing.price} {listing.currency}
                </span>
                <span className="text-xs text-slate-400">{listing.status}</span>
              </div>
            </article>
          ))}
          {!listings.length && (
            <div className="card p-6 text-center text-sm text-slate-500">
              Aucun article public pour le moment.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicListingsPage;
