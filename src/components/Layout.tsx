import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Building2,
  ChevronRight,
  Download,
  Home,
  LogOut,
  Package,
  Plus,
  ScrollText,
  Search,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import { useAuth } from '@/store/auth';

const railApps = [
  { icon: Shield, color: '#2563eb', label: 'Portaria', active: true, n: null as number | null },
  { icon: Package, color: '#f97316', label: 'Entregas', n: 12 },
  { icon: Users, color: '#e11d48', label: 'Visitantes', n: 3 },
  { icon: Building2, color: '#8b5cf6', label: 'Reservas', n: null },
];

const sidebarGestao: [string, any, string, string | null][] = [
  ['/', Home, 'Visão geral', null],
  ['/visitors', Users, 'Visitantes', null],
  ['/deliveries', Package, 'Encomendas', null],
  ['/residents', Users, 'Moradores', null],
  ['/units', Building2, 'Unidades', null],
  ['/access-logs', ScrollText, 'Auditoria', null],
  ['/users', Shield, 'Equipe', null],
];

const titles: Record<string, string> = {
  '/': 'Visão geral',
  '/visitors': 'Visitantes',
  '/deliveries': 'Encomendas',
  '/residents': 'Moradores',
  '/units': 'Unidades',
  '/access-logs': 'Auditoria',
  '/users': 'Equipe',
};

export default function Layout() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const initials =
    user?.name
      ?.split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? 'U';

  return (
    <div className="min-h-screen grid grid-cols-[72px_260px_1fr] bg-bg">
      <nav
        className="sticky top-0 h-screen flex flex-col items-center gap-1.5 py-4 px-2.5"
        style={{ background: '#1b1a17' }}
      >
        <div
          className="w-11 h-11 rounded-md grid place-items-center mb-2"
          style={{
            background: 'linear-gradient(135deg, #2f64eb, #1a3fa8)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.2)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]">
            <rect x="3" y="3" width="8" height="8" rx="2" fill="white" fillOpacity=".9" />
            <rect x="13" y="3" width="8" height="8" rx="2" fill="white" fillOpacity=".6" />
            <rect x="3" y="13" width="8" height="8" rx="2" fill="white" fillOpacity=".6" />
            <rect x="13" y="13" width="8" height="8" rx="2" fill="white" />
          </svg>
        </div>
        <div className="w-7 h-px my-0.5" style={{ background: 'rgba(255,255,255,.1)' }} />
        {railApps.map((a, i) => (
          <button
            key={i}
            title={a.label}
            className="relative w-12 h-12 rounded-md grid place-items-center transition-all"
            style={{
              background: a.active ? a.color : 'transparent',
              boxShadow: a.active ? `0 8px 20px -8px ${a.color}` : 'none',
            }}
          >
            <a.icon size={20} color={a.active ? 'white' : 'rgba(255,255,255,.6)'} />
            {a.n != null && (
              <span
                className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full grid place-items-center text-[10px] font-bold text-white"
                style={{ background: '#ef4444', border: '2px solid #1b1a17' }}
              >
                {a.n}
              </span>
            )}
            {a.active && (
              <span
                className="absolute -left-2.5 top-1/2 -translate-y-1/2 rounded-r-sm"
                style={{ width: 4, height: 24, background: 'white' }}
              />
            )}
          </button>
        ))}
      </nav>

      <aside className="sticky top-0 h-screen overflow-y-auto bg-surface border-r border-border px-3.5 py-4 flex flex-col">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div
            className="w-8 h-8 rounded-[9px] grid place-items-center flex-shrink-0"
            style={{ background: '#2563eb' }}
          >
            <Shield size={16} color="white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display font-bold text-[15px] text-ink-900">Portaria</div>
            <div className="ru-caption truncate">
              {user?.role === 'ADMIN' ? 'Administração' : user?.role === 'PORTEIRO' ? 'Porteiro' : 'Morador'}
            </div>
          </div>
        </div>

        <div className="relative mb-3.5">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none"
          />
          <input
            className="w-full h-[34px] rounded-md bg-surface border border-borderStrong pl-10 pr-3 text-[13px] text-ink-900 placeholder:text-ink-500 focus:outline-none focus:border-primary-500 focus:shadow-focus"
            placeholder="Buscar morador, unidade…"
          />
        </div>

        <div className="ru-overline px-2.5 py-1.5 mt-1">Gestão</div>
        <div className="flex flex-col gap-0.5">
          {sidebarGestao.map(([to, Icon, label, count]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
              }
            >
              <Icon size={15} />
              <span className="flex-1">{label}</span>
              {count && (
                <span className="text-[11px] px-1.5 py-px rounded-full bg-surface2 text-ink-600 font-semibold">
                  {count}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="ru-overline px-2.5 py-1.5 mt-4">Configurações</div>
        <div className="flex flex-col gap-0.5">
          <button className="sidebar-item">
            <Settings size={15} />
            <span className="flex-1">Instância</span>
          </button>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2.5 p-2.5 rounded-md bg-surface2 mt-2.5">
          <div className="ru-avatar" style={{ background: '#e0e7ff', color: '#3730a3' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-ink-900 truncate">{user?.name}</div>
            <div className="text-[11px] text-ink-600 truncate">
              {user?.email}
            </div>
          </div>
          <button
            className="icon-btn"
            title="Sair"
            onClick={() => {
              logout();
              nav('/login');
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      <section className="flex flex-col min-w-0">
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-surface border-b border-border">
          <div className="flex items-center gap-2">
            <span className="ru-caption">Jardim das Acácias</span>
            <ChevronRight size={12} className="text-ink-500" />
            <span className="ru-caption font-semibold" style={{ color: '#2563eb' }}>
              Portaria
            </span>
            <ChevronRight size={12} className="text-ink-500" />
            <span className="ru-caption">{titles[loc.pathname] ?? ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="ru-btn-secondary ru-btn-sm">
              <Download size={14} /> Exportar
            </button>
            <button className="icon-btn">
              <Bell size={16} />
              <span
                className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full"
                style={{ background: '#dc2626', border: '1.5px solid white' }}
              />
            </button>
            <button className="ru-btn-primary ru-btn-sm">
              <Plus size={14} /> Convidar morador
            </button>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
