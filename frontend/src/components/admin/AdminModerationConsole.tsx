import { useEffect, useState } from 'react';
import client from '@api/client';
import type { FraudAlert } from '@shared/index';

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

  const getSeverityBadge = (severity: string) => {
    const severityLower = severity.toLowerCase();
    if (severityLower.includes('high') || severityLower.includes('élevé')) {
      return 'badge-danger';
    } else if (severityLower.includes('medium') || severityLower.includes('moyen')) {
      return 'badge-warning';
    }
    return 'badge-info';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Console d&apos;administration
        </h1>
        <p className="text-slate-600">Modération et contrôle de sécurité</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">⏳</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Articles en contrôle</h3>
          </div>
          <div className="space-y-3">
            {pendingListings.map((listing) => (
              <article
                key={listing.id}
                className="border-2 border-slate-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-amber-50/20"
              >
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">{listing.title}</p>
                    <p className="text-xs text-slate-500">
                      <span className="font-medium">{listing.sellerName}</span> • soumis{' '}
                      {new Date(listing.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveListing(listing.id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-green-600 transition-all shadow-md hover:shadow-lg"
                    >
                      ✓ Publier
                    </button>
                    <button
                      onClick={() => rejectListing(listing.id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-lg font-medium hover:from-rose-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg"
                    >
                      ✕ Rejeter
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {!pendingListings.length && (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-xl">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <p className="text-sm text-slate-500">Aucun article en attente.</p>
              </div>
            )}
          </div>
        </section>
        <section className="card p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🚨</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Alertes fraude / anomalie</h3>
          </div>
          <div className="space-y-3">
            {fraudAlerts.map((alert) => (
              <article
                key={alert.id}
                className="border-2 border-slate-200 rounded-xl p-4 hover:border-red-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-red-50/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 mb-2">{alert.message}</p>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${getSeverityBadge(alert.severity)}`}>{alert.severity}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            {!fraudAlerts.length && (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-xl">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🛡️</span>
                </div>
                <p className="text-sm text-slate-500">Aucune alerte active.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminModerationConsole;




