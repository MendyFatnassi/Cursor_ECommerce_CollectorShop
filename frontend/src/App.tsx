import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import BuyerDashboard from '@components/dashboard/BuyerDashboard';
import SellerDashboard from '@components/dashboard/SellerDashboard';
import AdminModerationConsole from '@components/admin/AdminModerationConsole';
import ConversationPanel from '@components/chat/ConversationPanel';
import NotificationCenter from '@components/notifications/NotificationCenter';
import AuthPage from '@components/auth/AuthPage';
import HomePage from '@components/home/HomePage';
import ProfilePage from '@components/profile/ProfilePage';
import usePortalStore from '@store/usePortalStore';
import client, { getAuthToken, setAuthToken } from '@api/client';
import { UserProfile, UserRole } from '@shared/index';

const getDefaultPath = (profile?: UserProfile) => {
  if (!profile) {
    return '/accueil';
  }
  if (profile.roles?.includes('SELLER')) {
    return '/seller';
  }
  if (profile.roles?.includes('BUYER')) {
    return '/buyer';
  }
  return '/accueil';
};

const RoleGuard = ({ roles, children }: { roles: UserRole[]; children: ReactNode }) => {
  const profile = usePortalStore((state) => state.profile);

  if (!profile && getAuthToken()) {
    return <div className="card p-6 text-sm text-slate-500">Chargement de la session...</div>;
  }
  if (!profile) {
    return <Navigate to="/auth" replace />;
  }
  const hasRole = roles.some((role) => profile.roles.includes(role));
  if (!hasRole) {
    return <Navigate to={getDefaultPath(profile)} replace />;
  }
  return <>{children}</>;
};

const AuthRoute = () => {
  const profile = usePortalStore((state) => state.profile);
  if (!profile && getAuthToken()) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Chargement de la session...
      </div>
    );
  }
  if (profile) {
    return <Navigate to={getDefaultPath(profile)} replace />;
  }
  return <AuthPage />;
};

const ChatRoute = () => {
  const profile = usePortalStore((state) => state.profile);
  const context = profile?.roles.includes('SELLER') ? 'seller' : 'buyer';
  return <ConversationPanel context={context} />;
};

const App = () => {
  const profile = usePortalStore((state) => state.profile);
  const setProfile = usePortalStore((state) => state.setProfile);

  useEffect(() => {
    if (profile) {
      return;
    }
    const token = getAuthToken();
    if (!token) {
      return;
    }
    client
      .get<UserProfile>('/profiles/me')
      .then((response) => setProfile(response.data))
      .catch(() => setAuthToken(null));
  }, [profile, setProfile]);

  return (
    <Routes>
      <Route path="/auth" element={<AuthRoute />} />
      <Route path="/" element={<Navigate to="/accueil" replace />} />
      <Route element={<DashboardLayout />}>
        <Route path="/accueil" element={<HomePage />} />
        <Route path="/acceuil" element={<Navigate to="/accueil" replace />} />
        <Route
          path="/buyer"
          element={
            <RoleGuard roles={['BUYER', 'ADMIN']}>
              <BuyerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="/seller"
          element={
            <RoleGuard roles={['SELLER', 'ADMIN']}>
              <SellerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="/chat"
          element={
            <RoleGuard roles={['BUYER', 'SELLER', 'ADMIN']}>
              <ChatRoute />
            </RoleGuard>
          }
        />
        <Route
          path="/notifications"
          element={
            <RoleGuard roles={['BUYER', 'SELLER', 'ADMIN']}>
              <NotificationCenter />
            </RoleGuard>
          }
        />
        <Route
          path="/profil"
          element={
            <RoleGuard roles={['BUYER', 'SELLER', 'ADMIN']}>
              <ProfilePage />
            </RoleGuard>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleGuard roles={['ADMIN']}>
              <AdminModerationConsole />
            </RoleGuard>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;




