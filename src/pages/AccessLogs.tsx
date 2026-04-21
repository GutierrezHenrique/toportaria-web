import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function AccessLogs() {
  const logs = useQuery({
    queryKey: ['access-logs'],
    queryFn: async () => (await api.get('/access-logs')).data,
  });
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Logs de acesso</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-panel2 text-muted text-xs uppercase">
            <tr>
              <th className="text-left p-3">Data</th>
              <th className="text-left p-3">Tipo</th>
              <th className="text-left p-3">Sujeito</th>
              <th className="text-left p-3">Nota</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(logs.data ?? []).map((l: any) => (
              <tr key={l.id}>
                <td className="p-3 text-muted">{new Date(l.createdAt).toLocaleString('pt-BR')}</td>
                <td className="p-3">
                  <span className={`chip ${l.type === 'ENTRY' ? 'text-ok' : 'text-accent'}`}>
                    {l.type === 'ENTRY' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
                <td className="p-3">{l.subject}</td>
                <td className="p-3 text-muted">{l.note ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
