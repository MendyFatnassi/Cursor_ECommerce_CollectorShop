import { NavLink, Outlet } from 'react-router-dom';
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




