import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';
import { api } from '@/lib/api';

const statusBadge: Record<string, string> = {
  PENDING: 'ru-badge-warning',
  APPROVED: 'ru-badge-success',
  DENIED: 'ru-badge-danger',
  CHECKED_IN: 'ru-badge-primary',
  CHECKED_OUT: 'ru-badge',
  EXPIRED: 'ru-badge',
};

const statusLabel: Record<string, string> = {
  PENDING: 'Aguardando',
  APPROVED: 'Aprovado',
  DENIED: 'Negado',
  CHECKED_IN: 'Em visita',
  CHECKED_OUT: 'Finalizado',
  EXPIRED: 'Expirado',
};

export default function Visitors() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>('ALL');
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

  const filtered = (list.data ?? []).filter((v: any) =>
    filter === 'ALL' ? true : v.status === filter,
  );
  const counts: Record<string, number> = { ALL: list.data?.length ?? 0 };
  for (const v of list.data ?? []) counts[v.status] = (counts[v.status] ?? 0) + 1;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="ru-display">Visitantes</div>
          <div className="text-ink-600 mt-1">
            Acompanhe em tempo real todos os visitantes do condomínio.
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['ALL', 'PENDING', 'APPROVED', 'CHECKED_IN', 'CHECKED_OUT'] as const).map((k) => (
          <button
            key={k}
            className={`ru-chip ${filter === k ? 'ru-chip-active' : ''}`}
            onClick={() => setFilter(k)}
          >
            {k === 'ALL' ? 'Todos' : statusLabel[k]}
            <span
              className="text-[10.5px] px-1.5 py-px rounded-full"
              style={{
                background: filter === k ? 'rgba(255,255,255,.15)' : '#eef2f8',
                color: filter === k ? 'white' : '#635d52',
              }}
            >
              {counts[k] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="ru-card overflow-hidden">
        <table className="ru-table">
          <thead>
            <tr>
              <th>Visitante</th>
              <th>Unidade</th>
              <th>Status</th>
              <th>Check-in</th>
              <th className="!text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v: any) => (
              <tr key={v.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="ru-avatar" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                      {v.name
                        .split(' ')
                        .map((w: string) => w[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-ink-900">{v.name}</div>
                      <div className="ru-caption">{v.document ?? 'sem documento'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <code className="font-mono text-[12.5px]">
                    {v.unit?.block ? `${v.unit.block}-` : ''}
                    {v.unit?.number}
                  </code>
                </td>
                <td>
                  <span className={`ru-badge ${statusBadge[v.status]}`}>{statusLabel[v.status]}</span>
                </td>
                <td className="text-ink-600">
                  {v.checkInAt ? new Date(v.checkInAt).toLocaleString('pt-BR') : '—'}
                </td>
                <td className="text-right">
                  <div className="inline-flex gap-1.5">
                    {v.status === 'APPROVED' && (
                      <button
                        className="ru-btn-primary ru-btn-sm"
                        onClick={() => updateStatus.mutate({ id: v.id, status: 'CHECKED_IN' })}
                      >
                        Check-in
                      </button>
                    )}
                    {v.status === 'CHECKED_IN' && (
                      <button
                        className="ru-btn-secondary ru-btn-sm"
                        onClick={() => updateStatus.mutate({ id: v.id, status: 'CHECKED_OUT' })}
                      >
                        Check-out
                      </button>
                    )}
                    {v.status === 'PENDING' && (
                      <>
                        <button
                          className="ru-btn-primary ru-btn-sm"
                          onClick={() => updateStatus.mutate({ id: v.id, status: 'APPROVED' })}
                        >
                          Aprovar
                        </button>
                        <button
                          className="ru-btn-secondary ru-btn-sm"
                          onClick={() => updateStatus.mutate({ id: v.id, status: 'DENIED' })}
                        >
                          Negar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={5} className="text-center text-ink-500 py-8">
                  Nenhum visitante com esse filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
