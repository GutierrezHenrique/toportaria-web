import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function Deliveries() {
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ['deliveries'],
    queryFn: async () => (await api.get('/deliveries')).data,
  });

  const deliver = useMutation({
    mutationFn: async (id: string) => (await api.patch(`/deliveries/${id}/deliver`)).data,
    onSuccess: () => {
      toast.success('Marcada como entregue');
      qc.invalidateQueries({ queryKey: ['deliveries'] });
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="ru-display">Encomendas</div>
        <div className="text-ink-600 mt-1">
          Entregas recebidas pela portaria aguardando retirada.
        </div>
      </div>

      <div className="ru-card">
        {(list.data ?? []).map((d: any, i: number) => (
          <div
            key={d.id}
            className={`flex items-center gap-3.5 p-3.5 ${
              i > 0 ? 'border-t border-border' : ''
            } hover:bg-surface2 transition-colors`}
          >
            <div
              className="w-12 h-12 rounded-[10px] grid place-items-center flex-shrink-0"
              style={{ background: '#fff7ed', color: '#f97316' }}
            >
              <Package size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-ink-900">{d.description}</div>
              <div className="ru-caption">
                {d.sender ? `${d.sender} · ` : ''}
                Unidade{' '}
                <code className="font-mono text-[12.5px]">
                  {d.unit?.block ? `${d.unit.block}-` : ''}
                  {d.unit?.number}
                </code>{' '}
                · {new Date(d.receivedAt).toLocaleString('pt-BR')}
              </div>
            </div>
            <span
              className={`ru-badge ${
                d.status === 'DELIVERED' ? 'ru-badge-success' : 'ru-badge-warning'
              }`}
            >
              {d.status === 'DELIVERED' ? 'Entregue' : 'Aguardando'}
            </span>
            {d.status === 'RECEIVED' && (
              <button className="ru-btn-primary ru-btn-sm" onClick={() => deliver.mutate(d.id)}>
                Entregar
              </button>
            )}
          </div>
        ))}
        {!list.data?.length && (
          <div className="p-8 text-center text-ink-500">Sem encomendas no momento.</div>
        )}
      </div>
    </div>
  );
}
