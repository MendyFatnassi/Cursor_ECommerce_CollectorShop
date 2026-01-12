import StoreManager from '@components/store/StoreManager';
import ConversationPanel from '@components/chat/ConversationPanel';
import NotificationCenter from '@components/notifications/NotificationCenter';

const SellerDashboard = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="mb-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
        Tableau de bord Vendeur
      </h1>
      <p className="text-slate-600">Gérez vos boutiques et vos conversations avec les acheteurs</p>
    </div>
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="lg:col-span-2 space-y-6">
        <StoreManager />
        <ConversationPanel context="seller" />
      </section>
      <aside>
        <NotificationCenter />
      </aside>
    </div>
  </div>
);

export default SellerDashboard;




