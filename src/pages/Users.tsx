import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const roleBadge: Record<string, string> = {
  ADMIN: 'ru-badge-primary',
  PORTEIRO: 'ru-badge-info',
  MORADOR: 'ru-badge',
};

export default function Users() {
  const qc = useQueryClient();
  const users = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users')).data,
  });
  const units = useQuery({
    queryKey: ['units'],
    queryFn: async () => (await api.get('/units')).data,
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'MORADOR',
    unitId: '',
  });

  const create = useMutation({
    mutationFn: async () => (await api.post('/users', form)).data,
    onSuccess: () => {
      toast.success('Usuário criado');
      setForm({ name: '', email: '', phone: '', password: '', role: 'MORADOR', unitId: '' });
      qc.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Erro'),
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="ru-display">Equipe e usuários</div>
        <div className="text-ink-600 mt-1">Admins, porteiros e moradores da instância.</div>
      </div>

      <div className="ru-card p-5">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="ru-label">Nome</label>
            <input
              className="ru-input mt-1.5"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="ru-label">Email</label>
            <input
              className="ru-input mt-1.5"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="ru-label">Telefone</label>
            <input
              className="ru-input mt-1.5"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="ru-label">Senha</label>
            <input
              type="password"
              className="ru-input mt-1.5"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <label className="ru-label">Role</label>
            <select
              className="ru-input mt-1.5"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="ADMIN">Admin</option>
              <option value="PORTEIRO">Porteiro</option>
              <option value="MORADOR">Morador</option>
            </select>
          </div>
          <div>
            <label className="ru-label">Unidade</label>
            <select
              className="ru-input mt-1.5"
              value={form.unitId}
              onChange={(e) => setForm({ ...form, unitId: e.target.value })}
            >
              <option value="">—</option>
              {(units.data ?? []).map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.block ? `${u.block}-` : ''}
                  {u.number}
                </option>
              ))}
            </select>
          </div>
          <button className="ru-btn-primary md:col-span-6" onClick={() => create.mutate()}>
            Criar usuário
          </button>
        </div>
      </div>

      <div className="ru-card overflow-hidden">
        <table className="ru-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Email</th>
              <th>Unidade</th>
              <th>Papel</th>
            </tr>
          </thead>
          <tbody>
            {(users.data ?? []).map((u: any) => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="ru-avatar" style={{ background: '#eef4ff', color: '#1a3fa8' }}>
                      {u.name
                        .split(' ')
                        .map((w: string) => w[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div className="font-semibold text-ink-900">{u.name}</div>
                  </div>
                </td>
                <td className="text-ink-600">{u.email}</td>
                <td>
                  {u.unit ? (
                    <code className="font-mono text-[12.5px]">
                      {u.unit.block ? `${u.unit.block}-` : ''}
                      {u.unit.number}
                    </code>
                  ) : (
                    <span className="text-ink-500">—</span>
                  )}
                </td>
                <td>
                  <span className={`ru-badge ${roleBadge[u.role]}`}>{u.role}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
