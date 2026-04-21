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
import { UserPlus, PackageCheck, LogIn, LogOut } from 'lucide-react';

function Stat({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string;
  value: string | number;
  icon: any;
  tint: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="label">{label}</div>
          <div className="text-3xl font-display mt-2">{value}</div>
        </div>
        <div className={`w-11 h-11 rounded-xl grid place-items-center ${tint}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const stats = useQuery({
    queryKey: ['stats'],
    queryFn: async () => (await api.get('/access-logs/stats')).data,
  });
  const visitors = useQuery({
    queryKey: ['visitors', 'pending'],
    queryFn: async () => (await api.get('/visitors?status=PENDING')).data,
  });

  const chartData = (() => {
    const map: Record<string, { day: string; entradas: number; saidas: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5);
      const key = d.toISOString().slice(0, 10);
      map[key] = { day: d.toLocaleDateString('pt-BR', { weekday: 'short' }), entradas: 0, saidas: 0 };
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
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Olá 👋</h1>
          <p className="text-muted">Visão geral da portaria</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Entradas" value={stats.data?.entries ?? '—'} icon={LogIn} tint="bg-ok/10 text-ok" />
        <Stat label="Saídas" value={stats.data?.exits ?? '—'} icon={LogOut} tint="bg-accent/10 text-accent" />
        <Stat label="Aguardando" value={visitors.data?.length ?? 0} icon={UserPlus} tint="bg-warn/10 text-warn" />
        <Stat label="Encomendas" value="—" icon={PackageCheck} tint="bg-panel2 text-ink" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-display text-xl mb-4">Movimento últimos 7 dias</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid stroke="#242832" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#8A8F9C" />
                <YAxis stroke="#8A8F9C" />
                <Tooltip
                  contentStyle={{ background: '#111318', border: '1px solid #242832', borderRadius: 12 }}
                />
                <Bar dataKey="entradas" fill="#4ADE80" radius={[6, 6, 0, 0]} />
                <Bar dataKey="saidas" fill="#D97757" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-display text-xl mb-4">Visitantes aguardando</h2>
          <div className="space-y-3">
            {(visitors.data ?? []).slice(0, 6).map((v: any) => (
              <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-panel2">
                <div>
                  <div className="font-medium">{v.name}</div>
                  <div className="text-xs text-muted">
                    {v.unit?.block ? `Bloco ${v.unit.block} • ` : ''}Ap {v.unit?.number}
                  </div>
                </div>
                <span className="chip text-warn">pendente</span>
              </div>
            ))}
            {!visitors.data?.length && (
              <div className="text-sm text-muted">Nenhum visitante aguardando.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
