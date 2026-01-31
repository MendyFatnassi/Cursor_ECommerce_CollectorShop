import { Route, Routes, Navigate } from 'react-router-dom';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import BuyerDashboard from '@components/dashboard/BuyerDashboard';
import SellerDashboard from '@components/dashboard/SellerDashboard';
import AdminModerationConsole from '@components/admin/AdminModerationConsole';
import ConversationPanel from '@components/chat/ConversationPanel';
import NotificationCenter from '@components/notifications/NotificationCenter';
import AuthPage from '@components/auth/AuthPage';
import ProfilePage from '@components/profile/ProfilePage';
import HomePage from '@components/home/HomePage';
import PublicStoresPage from './components/catalog/PublicStoresPage';
import PublicListingsPage from './components/catalog/PublicListingsPage';
import usePortalStore from '@store/usePortalStore';
import { getAuthToken } from '@api/client';
import { UserRole } from '@shared/index';

type RoleGuardProps = {
  allowedRoles: UserRole[];
  allowGuest?: boolean;
  children: React.ReactElement;
};

const RoleGuard = ({ allowedRoles, allowGuest = false, children }: RoleGuardProps) => {
  const profile = usePortalStore((state) => state.profile);
  const token = getAuthToken();

  if (!profile) {
    if (allowGuest && !token) {
      return children;
    }
    if (!token) {
      return <Navigate to="/auth" replace />;
    }
    return <div className="text-center text-sm text-slate-500">Chargement du profil...</div>;
  }

  const hasRole = profile.roles?.some((role) => allowedRoles.includes(role));
  if (hasRole) {
    return children;
  }

  const fallback = profile.roles?.includes('ADMIN')
    ? '/admin'
    : profile.roles?.includes('SELLER')
      ? '/seller'
      : profile.roles?.includes('BUYER')
        ? '/buyer'
        : '/acceuil';

  return <Navigate to={fallback} replace />;
};

const App = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/" element={<Navigate to="/acceuil" replace />} />
    <Route element={<DashboardLayout />}>
      <Route path="/acceuil" element={<HomePage />} />
      <Route path="/boutiques" element={<PublicStoresPage />} />
      <Route path="/articles" element={<PublicListingsPage />} />
      <Route
        path="/buyer"
        element={
          <RoleGuard allowedRoles={['BUYER']}>
            <BuyerDashboard />
          </RoleGuard>
        }
      />
      <Route
        path="/seller"
        element={
          <RoleGuard allowedRoles={['SELLER']}>
            <SellerDashboard />
          </RoleGuard>
        }
      />
      <Route
        path="/chat"
        element={
          <RoleGuard allowedRoles={['BUYER', 'SELLER', 'ADMIN']}>
            <ConversationPanel context="buyer" />
          </RoleGuard>
        }
      />
      <Route
        path="/notifications"
        element={
          <RoleGuard allowedRoles={['BUYER', 'SELLER', 'ADMIN']}>
            <NotificationCenter />
          </RoleGuard>
        }
      />
      <Route
        path="/profil"
        element={
          <RoleGuard allowedRoles={['BUYER', 'SELLER', 'ADMIN']}>
            <ProfilePage />
          </RoleGuard>
        }
      />
      <Route
        path="/admin"
        element={
          <RoleGuard allowedRoles={['ADMIN']}>
            <AdminModerationConsole />
          </RoleGuard>
        }
      />
    </Route>
  </Routes>
);

export default App;




