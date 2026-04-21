import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function AccessLogs() {
  const logs = useQuery({
    queryKey: ['access-logs'],
    queryFn: async () => (await api.get('/access-logs')).data,
  });
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="ru-display">Auditoria</div>
        <div className="text-ink-600 mt-1">Histórico completo de entradas e saídas.</div>
      </div>

      <div className="ru-card overflow-hidden">
        <table className="ru-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Sujeito</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {(logs.data ?? []).map((l: any) => (
              <tr key={l.id}>
                <td className="text-ink-600">{new Date(l.createdAt).toLocaleString('pt-BR')}</td>
                <td>
                  <span
                    className={`ru-badge ${
                      l.type === 'ENTRY' ? 'ru-badge-success' : 'ru-badge-warning'
                    }`}
                  >
                    {l.type === 'ENTRY' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
                <td className="font-medium text-ink-900">{l.subject}</td>
                <td className="text-ink-600">{l.note ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
