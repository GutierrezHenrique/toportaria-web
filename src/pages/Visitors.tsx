import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const statusColor: Record<string, string> = {
  PENDING: 'text-warn',
  APPROVED: 'text-ok',
  DENIED: 'text-danger',
  CHECKED_IN: 'text-accent',
  CHECKED_OUT: 'text-muted',
  EXPIRED: 'text-muted',
};

export default function Visitors() {
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ['visitors'],
    queryFn: async () => (await api.get('/visitors')).data,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      (await api.patch(`/visitors/${id}/status`, { status })).data,
    onSuccess: () => {
      toast.success('Status atualizado');
      qc.invalidateQueries({ queryKey: ['visitors'] });
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Visitantes</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-panel2 text-muted text-xs uppercase">
            <tr>
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">Unidade</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Check-in</th>
              <th className="text-right p-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(list.data ?? []).map((v: any) => (
              <tr key={v.id}>
                <td className="p-3">
                  <div className="font-medium">{v.name}</div>
                  <div className="text-xs text-muted">{v.document}</div>
                </td>
                <td className="p-3">
                  {v.unit?.block ? `Bl ${v.unit.block} • ` : ''}Ap {v.unit?.number}
                </td>
                <td className="p-3">
                  <span className={`chip ${statusColor[v.status]}`}>{v.status}</span>
                </td>
                <td className="p-3">{v.checkInAt ? new Date(v.checkInAt).toLocaleString('pt-BR') : '—'}</td>
                <td className="p-3 text-right space-x-2">
                  {v.status === 'APPROVED' && (
                    <button
                      className="btn-primary !py-1 !px-3 text-xs"
                      onClick={() => updateStatus.mutate({ id: v.id, status: 'CHECKED_IN' })}
                    >
                      Check-in
                    </button>
                  )}
                  {v.status === 'CHECKED_IN' && (
                    <button
                      className="btn-ghost !py-1 !px-3 text-xs"
                      onClick={() => updateStatus.mutate({ id: v.id, status: 'CHECKED_OUT' })}
                    >
                      Check-out
                    </button>
                  )}
                  {v.status === 'PENDING' && (
                    <>
                      <button
                        className="btn-primary !py-1 !px-3 text-xs"
                        onClick={() => updateStatus.mutate({ id: v.id, status: 'APPROVED' })}
                      >
                        Aprovar
                      </button>
                      <button
                        className="btn-ghost !py-1 !px-3 text-xs text-danger"
                        onClick={() => updateStatus.mutate({ id: v.id, status: 'DENIED' })}
                      >
                        Negar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
