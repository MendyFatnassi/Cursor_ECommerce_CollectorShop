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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white shadow-sm">
        <div>
          <p className="text-lg font-semibold">Collector.shop Portal</p>
          <p className="text-sm text-slate-500">{profile?.fullName ?? 'Visiteur'}</p>
        </div>
        <nav className="flex gap-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-1 rounded-full border ${isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;




