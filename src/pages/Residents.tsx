import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function Residents() {
  const users = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users')).data,
  });
  const residents = (users.data ?? []).filter((u: any) => u.role === 'MORADOR');

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Moradores</h1>
      <div className="card divide-y divide-border">
        {residents.map((u: any) => (
          <div key={u.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-xs text-muted">
                {u.email} • {u.phone ?? 'sem telefone'}
              </div>
            </div>
            <div className="text-sm text-muted">
              {u.unit ? `${u.unit.block ? 'Bl ' + u.unit.block + ' • ' : ''}Ap ${u.unit.number}` : 'sem unidade'}
            </div>
          </div>
        ))}
        {!residents.length && <div className="p-6 text-sm text-muted">Nenhum morador cadastrado.</div>}
      </div>
    </div>
  );
}
