import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { api } from '@/lib/api';
import {
  ArrowRight,
  Building2,
  LogIn,
  LogOut as LogOutIcon,
  Package,
  Shield,
  UserPlus,
  Users,
} from 'lucide-react';
import { useAuth } from '@/store/auth';

type Stat = { label: string; value: string; delta: string; tone: 'up' | 'down' | 'neutral'; icon: any; color: string };

function KpiCard({ s }: { s: Stat }) {
  return (
    <div className="ru-card p-[18px]">
      <div className="flex items-center justify-between mb-3">
        <div className="ru-overline">{s.label}</div>
        <div
          className="w-8 h-8 rounded-[10px] grid place-items-center"
          style={{ background: s.color + '1a', color: s.color }}
        >
          <s.icon size={16} />
        </div>
      </div>
      <div className="font-display text-[30px] font-bold text-ink-900 leading-[1.1]">
        {s.value}
      </div>
      <div className="ru-caption mt-2">
        <span
          className="font-semibold"
          style={{
            color:
              s.tone === 'up' ? '#16a34a' : s.tone === 'down' ? '#d97706' : '#635d52',
          }}
        >
          {s.tone === 'up' ? '↑' : s.tone === 'down' ? '⚠' : '•'} {s.delta}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const user = useAuth((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? '';

  const stats = useQuery({
    queryKey: ['stats'],
    queryFn: async () => (await api.get('/access-logs/stats')).data,
  });
  const pending = useQuery({
    queryKey: ['visitors', 'pending'],
    queryFn: async () => (await api.get('/visitors?status=PENDING')).data,
  });
  const users = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users')).data,
  });
  const units = useQuery({
    queryKey: ['units'],
    queryFn: async () => (await api.get('/units')).data,
  });
  const deliveries = useQuery({
    queryKey: ['deliveries'],
    queryFn: async () => (await api.get('/deliveries')).data,
  });

  const residentsCount = (users.data ?? []).filter((u: any) => u.role === 'MORADOR').length;
  const openDeliveries = (deliveries.data ?? []).filter((d: any) => d.status === 'RECEIVED').length;
  const occRate = units.data?.length
    ? Math.round(
        (units.data.filter((u: any) => (u.residents?.length ?? 0) > 0).length / units.data.length) *
          100,
      )
    : 0;

  const kpis: Stat[] = [
    { label: 'Moradores ativos', value: String(residentsCount), delta: '+3 esta semana', tone: 'up', icon: Users, color: '#2563eb' },
    { label: 'Aguardando aprovação', value: String(pending.data?.length ?? 0), delta: pending.data?.length ? 'requer atenção' : 'tudo em dia', tone: pending.data?.length ? 'down' : 'neutral', icon: Shield, color: '#d97706' },
    { label: 'Entregas abertas', value: String(openDeliveries), delta: '+12% vs ontem', tone: 'up', icon: Package, color: '#f97316' },
    { label: 'Taxa de ocupação', value: `${occRate}%`, delta: `${units.data?.length ?? 0} unidades`, tone: 'neutral', icon: Building2, color: '#16a34a' },
  ];

  const chartData = (() => {
    const map: Record<string, { day: string; entradas: number; saidas: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5);
      const key = d.toISOString().slice(0, 10);
      map[key] = {
        day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
        entradas: 0,
        saidas: 0,
      };
    }
    for (const l of stats.data?.last7 ?? []) {
      const key = new Date(l.createdAt).toISOString().slice(0, 10);
      if (map[key]) {
        if (l.type === 'ENTRY') map[key].entradas++;
        else map[key].saidas++;
      }
    }
    return Object.values(map);
  })();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="ru-display m-0">Bom dia, {firstName}</div>
        <div className="text-ink-600 mt-1">Aqui está o pulso da portaria nas últimas 24h.</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <KpiCard key={i} s={k} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <div className="ru-card">
          <div className="flex items-center justify-between px-5 py-[18px] border-b border-border">
            <div>
              <div className="ru-h3">Movimento últimos 7 dias</div>
              <div className="ru-caption">Entradas e saídas registradas pela portaria</div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#2f64eb' }} />
                Entradas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#f97316' }} />
                Saídas
              </span>
            </div>
          </div>
          <div className="p-5 h-72">
            <ResponsiveContainer>
              <BarChart data={chartData} barCategoryGap={18}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="#8a8377" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8a8377" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(47,100,235,0.06)' }}
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="entradas" fill="#2f64eb" radius={[8, 8, 0, 0]} />
                <Bar dataKey="saidas" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ru-card">
          <div className="flex items-center justify-between px-5 py-[18px] border-b border-border">
            <div>
              <div className="ru-h3">Aprovações pendentes</div>
              <div className="ru-caption">Visitantes aguardando liberação</div>
            </div>
            <button className="ru-btn-ghost ru-btn-sm">
              Ver todos <ArrowRight size={12} />
            </button>
          </div>
          <div className="p-2">
            {(pending.data ?? []).length === 0 && (
              <div className="p-5 text-sm text-ink-500">Nenhum visitante aguardando.</div>
            )}
            {(pending.data ?? []).slice(0, 5).map((v: any) => (
              <div
                key={v.id}
                className="flex items-center gap-3.5 px-3.5 py-3 rounded-md hover:bg-surface2"
              >
                <div className="ru-avatar" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                  {v.name
                    .split(' ')
                    .map((w: string) => w[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink-900 truncate">{v.name}</div>
                  <div className="ru-caption">
                    <code className="font-mono text-[12.5px]">
                      {v.unit?.block ? `${v.unit.block}-` : ''}
                      {v.unit?.number}
                    </code>
                    {v.document ? ` · ${v.document}` : ''}
                  </div>
                </div>
                <button className="ru-btn-primary ru-btn-sm">
                  <UserPlus size={12} /> Aprovar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="ru-card p-5 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md grid place-items-center"
            style={{ background: '#ecfdf5', color: '#16a34a' }}
          >
            <LogIn size={18} />
          </div>
          <div>
            <div className="ru-overline">Entradas total</div>
            <div className="font-display text-xl font-bold text-ink-900">
              {stats.data?.entries ?? '—'}
            </div>
          </div>
        </div>
        <div className="ru-card p-5 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md grid place-items-center"
            style={{ background: '#fff7ed', color: '#f97316' }}
          >
            <LogOutIcon size={18} />
          </div>
          <div>
            <div className="ru-overline">Saídas total</div>
            <div className="font-display text-xl font-bold text-ink-900">
              {stats.data?.exits ?? '—'}
            </div>
          </div>
        </div>
        <div className="ru-card p-5 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md grid place-items-center"
            style={{ background: '#fef2f2', color: '#e11d48' }}
          >
            <Users size={18} />
          </div>
          <div>
            <div className="ru-overline">Visitantes hoje</div>
            <div className="font-display text-xl font-bold text-ink-900">
              {pending.data?.length ?? 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
