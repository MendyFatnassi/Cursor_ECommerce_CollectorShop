import RecommendationPanel from '@components/recommendations/RecommendationPanel';
import NotificationCenter from '@components/notifications/NotificationCenter';
import NotificationSettings from '@components/notifications/NotificationSettings';
import InterestPreferences from '@components/preferences/InterestPreferences';
import PaymentStatusCard from '@components/payments/PaymentStatusCard';
import usePortalStore from '@store/usePortalStore';

const BuyerDashboard = () => {
  const listings = usePortalStore((state) => state.listings);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold">Achats en cours</h2>
        {listings.slice(0, 3).map((listing) => (
          <PaymentStatusCard key={listing.id} listing={listing} />
        ))}
        <RecommendationPanel />
      </section>
      <aside className="space-y-6">
        <NotificationCenter />
        <NotificationSettings />
        <InterestPreferences />
      </aside>
    </div>
  );
};

export default BuyerDashboard;




