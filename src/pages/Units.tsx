import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

export default function Units() {
  const qc = useQueryClient();
  const units = useQuery({ queryKey: ['units'], queryFn: async () => (await api.get('/units')).data });
  const [form, setForm] = useState({ block: '', number: '', floor: '' });

  const create = useMutation({
    mutationFn: async () => (await api.post('/units', form)).data,
    onSuccess: () => {
      toast.success('Unidade criada');
      setForm({ block: '', number: '', floor: '' });
      qc.invalidateQueries({ queryKey: ['units'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Erro'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/units/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['units'] }),
  });

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Unidades</h1>

      <div className="card p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="label">Bloco</label>
          <input className="input mt-1" value={form.block} onChange={(e) => setForm({ ...form, block: e.target.value })} />
        </div>
        <div>
          <label className="label">Número</label>
          <input className="input mt-1" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
        </div>
        <div>
          <label className="label">Andar</label>
          <input className="input mt-1" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} />
        </div>
        <button className="btn-primary" onClick={() => create.mutate()} disabled={!form.number}>
          <Plus size={16} /> Adicionar
        </button>
      </div>

      <div className="card divide-y divide-border">
        {(units.data ?? []).map((u: any) => (
          <div key={u.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">
                {u.block ? `Bloco ${u.block} • ` : ''}Ap {u.number}
                {u.floor ? ` • Andar ${u.floor}` : ''}
              </div>
              <div className="text-xs text-muted">
                {u.residents?.length ?? 0} morador(es) • {u.vehicles?.length ?? 0} veículo(s)
              </div>
            </div>
            <button className="btn-ghost text-danger" onClick={() => remove.mutate(u.id)}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
