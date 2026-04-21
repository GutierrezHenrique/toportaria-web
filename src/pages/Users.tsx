import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function Users() {
  const qc = useQueryClient();
  const users = useQuery({ queryKey: ['users'], queryFn: async () => (await api.get('/users')).data });
  const units = useQuery({ queryKey: ['units'], queryFn: async () => (await api.get('/units')).data });

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
    <div>
      <h1 className="font-display text-3xl mb-6">Usuários</h1>

      <div className="card p-5 mb-6 grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="label">Nome</label>
          <input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Email</label>
          <input className="input mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Telefone</label>
          <input className="input mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="label">Senha</label>
          <input type="password" className="input mt-1" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div>
          <label className="label">Role</label>
          <select className="input mt-1" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="ADMIN">Admin</option>
            <option value="PORTEIRO">Porteiro</option>
            <option value="MORADOR">Morador</option>
          </select>
        </div>
        <div>
          <label className="label">Unidade</label>
          <select className="input mt-1" value={form.unitId} onChange={(e) => setForm({ ...form, unitId: e.target.value })}>
            <option value="">—</option>
            {(units.data ?? []).map((u: any) => (
              <option key={u.id} value={u.id}>
                {u.block ? `Bl ${u.block} ` : ''}Ap {u.number}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-primary md:col-span-6" onClick={() => create.mutate()}>
          Criar usuário
        </button>
      </div>

      <div className="card divide-y divide-border">
        {(users.data ?? []).map((u: any) => (
          <div key={u.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-xs text-muted">{u.email}</div>
            </div>
            <span className="chip">{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
