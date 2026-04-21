import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
    <div>
      <h1 className="font-display text-3xl mb-6">Encomendas</h1>
      <div className="card divide-y divide-border">
        {(list.data ?? []).map((d: any) => (
          <div key={d.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{d.description}</div>
              <div className="text-xs text-muted">
                {d.sender ? `de ${d.sender} • ` : ''}
                {d.unit?.block ? `Bl ${d.unit.block} • ` : ''}Ap {d.unit?.number} •{' '}
                {new Date(d.receivedAt).toLocaleString('pt-BR')}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`chip ${d.status === 'DELIVERED' ? 'text-ok' : 'text-warn'}`}>
                {d.status}
              </span>
              {d.status === 'RECEIVED' && (
                <button className="btn-primary !py-1 !px-3 text-xs" onClick={() => deliver.mutate(d.id)}>
                  Entregar
                </button>
              )}
            </div>
          </div>
        ))}
        {!list.data?.length && <div className="p-6 text-sm text-muted">Sem encomendas.</div>}
      </div>
    </div>
  );
}
