import RecommendationPanel from '@components/recommendations/RecommendationPanel';
import NotificationCenter from '@components/notifications/NotificationCenter';
import NotificationSettings from '@components/notifications/NotificationSettings';
import InterestPreferences from '@components/preferences/InterestPreferences';
import PaymentStatusCard from '@components/payments/PaymentStatusCard';
import usePortalStore from '@store/usePortalStore';

const BuyerDashboard = () => {
  const listings = usePortalStore((state) => state.listings);
  const profile = usePortalStore((state) => state.profile);

  if (!profile) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Catalogue Acheteur
          </h1>
          <p className="text-slate-600">
            Parcourez les articles. Connectez-vous pour suivre vos achats et vendre.
          </p>
        </div>
        <RecommendationPanel />
        <div className="card p-6 text-center text-sm text-slate-500">
          Créez un compte pour accéder à vos achats, notifications et préférences.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Tableau de bord Acheteur
        </h1>
        <p className="text-slate-600">Gérez vos achats et découvrez de nouvelles recommandations</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
              Achats en cours
            </h2>
            <div className="space-y-4">
              {listings.slice(0, 3).map((listing, index) => (
                <div key={listing.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <PaymentStatusCard listing={listing} />
                </div>
              ))}
            </div>
          </div>
          <RecommendationPanel />
        </section>
        <aside className="space-y-6">
          <NotificationCenter />
          <NotificationSettings />
          <InterestPreferences />
        </aside>
      </div>
    </div>
  );
};

export default BuyerDashboard;




