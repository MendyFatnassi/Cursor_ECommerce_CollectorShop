import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import client, { getAuthToken } from '@api/client';
import usePortalStore from '@store/usePortalStore';

const links = [
  { to: '/buyer', label: 'Acheteur' },
  { to: '/seller', label: 'Vendeur' },
  { to: '/chat', label: 'Chat' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/admin', label: 'Admin' }
];

const DashboardLayout = () => {
  const profile = usePortalStore((state) => state.profile);
  const setProfile = usePortalStore((state) => state.setProfile);
  const logout = usePortalStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    if (!token && !profile) {
      navigate('/auth');
      return;
    }
    if (profile || !token) {
      return;
    }
    const loadProfile = async () => {
      try {
        const response = await client.get('/profiles/me');
        setProfile(response.data);
      } catch {
        logout();
        navigate('/auth');
      }
    };
    loadProfile();
  }, [profile, navigate, logout, setProfile]);

  const handleLogout = async () => {
    try {
      await client.post('/auth/logout');
    } catch {
      // Ignore logout errors, local cleanup is enough.
    }
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div>
                  <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Collector.shop
                  </p>
                  <p className="text-xs text-slate-500">{profile?.fullName ?? 'Visiteur'}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex gap-2">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              {profile && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  Déconnexion
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;




