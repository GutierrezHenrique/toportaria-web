import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserPlus,
  PackageCheck,
  ScrollText,
  Shield,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/store/auth';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/visitors', label: 'Visitantes', icon: UserPlus },
  { to: '/deliveries', label: 'Encomendas', icon: PackageCheck },
  { to: '/residents', label: 'Moradores', icon: Users },
  { to: '/units', label: 'Unidades', icon: Building2 },
  { to: '/access-logs', label: 'Acessos', icon: ScrollText },
  { to: '/users', label: 'Usuários', icon: Shield },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const nav2 = useNavigate();

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <aside className="border-r border-border p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center font-display text-white text-lg">
            T
          </div>
          <div>
            <div className="font-display text-lg leading-tight">ToPortaria</div>
            <div className="text-[11px] text-muted">Gestão de portaria</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                  isActive ? 'bg-panel2 text-ink' : 'text-muted hover:text-ink hover:bg-panel2'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 p-3 rounded-xl bg-panel2 border border-border">
          <div className="text-sm font-medium truncate">{user?.name}</div>
          <div className="text-xs text-muted">{user?.role}</div>
          <button
            className="btn-ghost w-full mt-3 text-xs"
            onClick={() => {
              logout();
              nav2('/login');
            }}
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>
      <main className="p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
