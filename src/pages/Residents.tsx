import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function Residents() {
  const users = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users')).data,
  });
  const residents = (users.data ?? []).filter((u: any) => u.role === 'MORADOR');

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="ru-display">Moradores</div>
        <div className="text-ink-600 mt-1">Usuários vinculados a unidades do condomínio.</div>
      </div>

      <div className="ru-card overflow-hidden">
        <table className="ru-table">
          <thead>
            <tr>
              <th>Morador</th>
              <th>Contato</th>
              <th>Unidade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((u: any) => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="ru-avatar" style={{ background: '#ffe4e6', color: '#be123c' }}>
                      {u.name
                        .split(' ')
                        .map((w: string) => w[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div className="font-semibold text-ink-900">{u.name}</div>
                  </div>
                </td>
                <td className="text-ink-600">
                  <div>{u.email}</div>
                  <div className="text-xs">{u.phone ?? '—'}</div>
                </td>
                <td>
                  {u.unit ? (
                    <code className="font-mono text-[12.5px]">
                      {u.unit.block ? `${u.unit.block}-` : ''}
                      {u.unit.number}
                    </code>
                  ) : (
                    <span className="text-ink-500">sem unidade</span>
                  )}
                </td>
                <td>
                  <span className={`ru-badge ${u.active ? 'ru-badge-success' : 'ru-badge'}`}>
                    {u.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
              </tr>
            ))}
            {!residents.length && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-ink-500">
                  Nenhum morador cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
