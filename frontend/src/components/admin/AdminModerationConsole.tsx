import { useEffect, useState } from 'react';
import client from '@api/client';
import { FraudAlert } from '@types/index';

interface PendingListing {
  id: string;
  title: string;
  sellerName: string;
  submittedAt: string;
}

const AdminModerationConsole = () => {
  const [pendingListings, setPendingListings] = useState<PendingListing[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);

  useEffect(() => {
    const loadAdminData = async () => {
      const [pendingResponse, fraudResponse] = await Promise.all([
        client.get<PendingListing[]>('/admin/listings/pending'),
        client.get<FraudAlert[]>('/admin/fraud-alerts')
      ]);
      setPendingListings(pendingResponse.data);
      setFraudAlerts(fraudResponse.data);
    };
    loadAdminData();
  }, []);

  const approveListing = (id: string) => client.post(`/admin/listings/${id}/approve`);

  const rejectListing = (id: string) => client.post(`/admin/listings/${id}/reject`);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-lg font-semibold">Articles en contrôle</h3>
        {pendingListings.map((listing) => (
          <article key={listing.id} className="border border-slate-100 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{listing.title}</p>
                <p className="text-xs text-slate-500">
                  {listing.sellerName} • soumis {new Date(listing.submittedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => approveListing(listing.id)} className="px-3 py-1 text-sm bg-emerald-100 text-emerald-800 rounded-lg">
                  Publier
                </button>
                <button onClick={() => rejectListing(listing.id)} className="px-3 py-1 text-sm bg-rose-100 text-rose-800 rounded-lg">
                  Rejeter
                </button>
              </div>
            </div>
          </article>
        ))}
        {!pendingListings.length && <p className="text-sm text-slate-500">Aucun article en attente.</p>}
      </section>
      <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-lg font-semibold">Alertes fraude / anomalie</h3>
        {fraudAlerts.map((alert) => (
          <article key={alert.id} className="border border-slate-100 rounded-xl p-3">
            <p className="font-medium">{alert.message}</p>
            <p className="text-xs text-slate-400">
              {alert.severity} • {new Date(alert.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
        {!fraudAlerts.length && <p className="text-sm text-slate-500">Aucune alerte active.</p>}
      </section>
    </div>
  );
};

export default AdminModerationConsole;




