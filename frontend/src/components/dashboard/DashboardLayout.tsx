import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import usePortalStore from '@store/usePortalStore';

const DashboardLayout = () => {
  const profile = usePortalStore((state) => state.profile);
  const logout = usePortalStore((state) => state.logout);
  const navigate = useNavigate();
  const roles = profile?.roles ?? [];
  const isBuyer = roles.includes('BUYER');
  const isSeller = roles.includes('SELLER');
  const isAdmin = roles.includes('ADMIN');

  const links = [
    { to: '/accueil', label: 'Accueil', visible: true },
    { to: '/buyer', label: 'Dashboard Acheteur', visible: isBuyer },
    { to: '/seller', label: 'Dashboard Vendeur', visible: isSeller },
    { to: '/chat', label: 'Chat', visible: Boolean(profile) },
    { to: '/notifications', label: 'Notifications', visible: Boolean(profile) },
    { to: '/profil', label: 'Profil', visible: Boolean(profile) },
    { to: '/admin', label: 'Admin', visible: isAdmin },
    { to: '/auth', label: 'Connexion', visible: !profile }
  ];

  const handleLogout = () => {
    logout();
    navigate('/accueil');
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
                {links
                  .filter((link) => link.visible)
                  .map((link) => (
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




