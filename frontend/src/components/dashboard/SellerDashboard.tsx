import StoreManager from '@components/store/StoreManager';
import ConversationPanel from '@components/chat/ConversationPanel';
import NotificationCenter from '@components/notifications/NotificationCenter';

const SellerDashboard = () => (
  <div className="grid gap-6 lg:grid-cols-3">
    <section className="lg:col-span-2 space-y-6">
      <StoreManager />
      <ConversationPanel context="seller" />
    </section>
    <aside>
      <NotificationCenter />
    </aside>
  </div>
);

export default SellerDashboard;




