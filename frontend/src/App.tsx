import { Route, Routes, Navigate } from 'react-router-dom';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import BuyerDashboard from '@components/dashboard/BuyerDashboard';
import SellerDashboard from '@components/dashboard/SellerDashboard';
import AdminModerationConsole from '@components/admin/AdminModerationConsole';
import ConversationPanel from '@components/chat/ConversationPanel';
import NotificationCenter from '@components/notifications/NotificationCenter';
import AuthPage from '@components/auth/AuthPage';

const App = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/" element={<Navigate to="/auth" replace />} />
    <Route element={<DashboardLayout />}>
      <Route path="/buyer" element={<BuyerDashboard />} />
      <Route path="/seller" element={<SellerDashboard />} />
      <Route path="/chat" element={<ConversationPanel context="buyer" />} />
      <Route path="/notifications" element={<NotificationCenter />} />
      <Route path="/admin" element={<AdminModerationConsole />} />
    </Route>
  </Routes>
);

export default App;




