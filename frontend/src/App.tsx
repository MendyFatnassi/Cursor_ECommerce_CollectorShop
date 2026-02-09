import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { useKeycloak } from '@react-keycloak/web';
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
import client from '@api/client';
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
  const { keycloak, initialized } = useKeycloak();
  const profile = usePortalStore((state) => state.profile);

  if (!initialized) {
    return <div className="card p-6 text-sm text-slate-500">Chargement de la session...</div>;
  }
  if (!keycloak.authenticated) {
    return <Navigate to="/auth" replace />;
  }
  if (!profile) {
    return <div className="card p-6 text-sm text-slate-500">Chargement de la session...</div>;
  }
  const hasRole = roles.some((role) => profile.roles.includes(role));
  if (!hasRole) {
    return <Navigate to={getDefaultPath(profile)} replace />;
  }
  return <>{children}</>;
};

const AuthRoute = () => {
  const { keycloak, initialized } = useKeycloak();
  const profile = usePortalStore((state) => state.profile);
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Chargement de la session...
      </div>
    );
  }
  if (keycloak.authenticated && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Chargement du profil...
      </div>
    );
  }
  if (keycloak.authenticated && profile) {
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
  const { keycloak, initialized } = useKeycloak();
  const profile = usePortalStore((state) => state.profile);
  const setProfile = usePortalStore((state) => state.setProfile);

  useEffect(() => {
    if (!initialized || !keycloak.authenticated || profile) {
      return;
    }
    client
      .get<UserProfile>('/profiles/me')
      .then((response) => setProfile(response.data))
      .catch(() => {
        // Laisse le flux Keycloak gérer la session.
      });
  }, [initialized, keycloak.authenticated, profile, setProfile]);

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




