import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Car } from 'lucide-react';
import { api } from '@/lib/api';

export default function Units() {
  const qc = useQueryClient();
  const units = useQuery({
    queryKey: ['units'],
    queryFn: async () => (await api.get('/units')).data,
  });
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
    <div className="flex flex-col gap-5">
      <div>
        <div className="ru-display">Unidades</div>
        <div className="text-ink-600 mt-1">Apartamentos do condomínio.</div>
      </div>

      <div className="ru-card p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="ru-label">Bloco</label>
            <input
              className="ru-input mt-1.5"
              value={form.block}
              onChange={(e) => setForm({ ...form, block: e.target.value })}
              placeholder="A"
            />
          </div>
          <div>
            <label className="ru-label">Número</label>
            <input
              className="ru-input mt-1.5"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="101"
            />
          </div>
          <div>
            <label className="ru-label">Andar</label>
            <input
              className="ru-input mt-1.5"
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: e.target.value })}
              placeholder="1"
            />
          </div>
          <button className="ru-btn-primary" onClick={() => create.mutate()} disabled={!form.number}>
            <Plus size={16} /> Adicionar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(units.data ?? []).map((u: any) => (
          <div key={u.id} className="ru-card p-5 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-[10px] grid place-items-center font-display font-bold flex-shrink-0"
              style={{ background: '#eef4ff', color: '#1a3fa8' }}
            >
              {u.block ?? ''}
              {u.number?.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-ink-900">
                {u.block ? `Bloco ${u.block} · ` : ''}Ap {u.number}
              </div>
              <div className="ru-caption">
                {u.floor ? `Andar ${u.floor} · ` : ''}
                {u.residents?.length ?? 0} morador(es){' '}
                {u.vehicles?.length ? (
                  <span className="inline-flex items-center gap-1 ml-1">
                    · <Car size={12} /> {u.vehicles.length}
                  </span>
                ) : null}
              </div>
            </div>
            <button className="icon-btn text-danger" onClick={() => remove.mutate(u.id)}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
