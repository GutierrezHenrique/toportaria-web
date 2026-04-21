import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, Eye, EyeOff, Package, Users, Calendar, Megaphone } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';

const tiles = [
  { icon: Package, color: '#f97316', label: 'Entregas', n: '12' },
  { icon: Users, color: '#e11d48', label: 'Visitantes', n: '3' },
  { icon: Calendar, color: '#8b5cf6', label: 'Reservas', n: null },
  { icon: Megaphone, color: '#0ea5a4', label: 'Comunicados', n: '2' },
];

export default function Login() {
  const [email, setEmail] = useState('admin@toportaria.com');
  const [password, setPassword] = useState('123456');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const setAuth = useAuth((s) => s.setAuth);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.token, data.user);
      nav('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[minmax(440px,1fr)_1.2fr] bg-bg">
      {/* Brand panel */}
      <aside
        className="relative hidden lg:flex flex-col p-10 text-white overflow-hidden min-h-screen"
        style={{
          background:
            'linear-gradient(165deg, #1a3fa8, #172e67 70%, #0f1733)',
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            right: -100,
            bottom: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, #5a87f9 0%, transparent 60%)',
            opacity: 0.35,
            filter: 'blur(20px)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,.12) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,.5), transparent 80%)',
            WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,.5), transparent 80%)',
          }}
        />

        <div className="relative flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-xl grid place-items-center"
            style={{
              background: 'linear-gradient(135deg, #8eb0ff, #2f64eb)',
              boxShadow:
                '0 10px 30px -8px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.3)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-[26px] h-[26px]">
              <rect x="3" y="3" width="8" height="8" rx="2" fill="white" fillOpacity=".9" />
              <rect x="13" y="3" width="8" height="8" rx="2" fill="white" fillOpacity=".6" />
              <rect x="3" y="13" width="8" height="8" rx="2" fill="white" fillOpacity=".6" />
              <rect x="13" y="13" width="8" height="8" rx="2" fill="white" />
            </svg>
          </div>
          <div>
            <div className="font-display font-extrabold text-[22px] tracking-tight">
              ToPortaria
            </div>
            <div className="text-xs opacity-70">Gestão integrada</div>
          </div>
        </div>

        <div className="relative mt-auto mb-8">
          <div className="ru-overline mb-3.5" style={{ color: 'rgba(255,255,255,.72)' }}>
            Família de apps
          </div>
          <div
            className="font-display font-bold"
            style={{
              fontSize: 40,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: 'white',
            }}
          >
            A portaria do
            <br />
            seu condomínio,
            <br />
            <span style={{ color: '#bcd0ff' }}>no mesmo lugar.</span>
          </div>
          <p
            style={{
              color: 'rgba(255,255,255,.72)',
              marginTop: 16,
              fontSize: 15,
              maxWidth: 420,
              lineHeight: 1.55,
            }}
          >
            Visitantes, entregas, moradores e acessos — tudo integrado,
            simples de operar no dia-a-dia.
          </p>
        </div>

        <div
          className="absolute hidden xl:flex flex-col gap-3"
          style={{ right: -60, top: 110, transform: 'rotate(-6deg)' }}
        >
          {tiles.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-[14px] p-2.5 pr-3.5"
              style={{
                minWidth: 230,
                background: 'rgba(255,255,255,.09)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,.14)',
                boxShadow: '0 10px 24px -10px rgba(0,0,0,.4)',
              }}
            >
              <div
                className="w-8 h-8 rounded-[10px] grid place-items-center"
                style={{ background: t.color, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.2)' }}
              >
                <t.icon size={16} color="white" />
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-[13px] text-white">
                  {t.label}
                </div>
                <div className="text-[11px] mt-px" style={{ color: 'rgba(255,255,255,.6)' }}>
                  atualizado agora
                </div>
              </div>
              {t.n && (
                <div
                  className="font-display font-bold text-[11px] text-white px-2 py-px rounded-full"
                  style={{ background: t.color }}
                >
                  {t.n}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="relative mt-5">
          <div className="ru-caption" style={{ color: 'rgba(255,255,255,.55)' }}>
            Instância #001 · Edifício Jardim das Acácias
          </div>
        </div>
      </aside>

      {/* Form */}
      <main className="flex flex-col px-8 md:px-14 py-7 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-end gap-2.5 mb-5">
          <div className="ru-caption">Ainda não tem conta?</div>
          <button className="ru-btn-secondary ru-btn-sm" type="button">
            Criar conta <ArrowRight size={14} />
          </button>
        </div>

        <form onSubmit={submit} className="max-w-[460px] w-full my-auto py-5">
          <div className="ru-overline text-primary-700">Bem-vindo de volta</div>
          <div className="ru-display mt-1.5 mb-2">Entre na portaria</div>
          <div className="text-ink-600 text-[15px] mb-7">
            O perfil é detectado automaticamente pelo servidor.
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="ru-label">E-mail</label>
            <input
              className="ru-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="voce@condominio.com.br"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <div className="flex items-center justify-between">
              <label className="ru-label">Senha</label>
              <button type="button" className="text-[13px] font-semibold text-primary-700 hover:underline">
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <input
                className="ru-input pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? 'text' : 'password'}
                required
              />
              <button
                type="button"
                aria-label="Mostrar senha"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-sm hover:bg-surface2 text-ink-500"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mb-6 select-none">
            <span
              role="checkbox"
              aria-checked={remember}
              onClick={() => setRemember(!remember)}
              className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] grid place-items-center transition-all ${
                remember
                  ? 'bg-primary-600 border-primary-600'
                  : 'bg-surface border-borderStrong'
              }`}
            >
              {remember && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6.5l2.5 2.5L10 3.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="text-[13px] text-ink-700">Lembrar deste dispositivo</span>
          </label>

          <button className="ru-btn-primary w-full h-12 rounded-lg" disabled={loading}>
            {loading ? (
              <span
                className="w-[14px] h-[14px] rounded-full border-2"
                style={{ borderColor: 'rgba(255,255,255,.3)', borderTopColor: 'white', animation: 'spin 700ms linear infinite' }}
              />
            ) : (
              <>
                Entrar <ArrowRight size={16} />
              </>
            )}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ink-500">
              ou
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" className="ru-btn-secondary">QR crachá</button>
            <button type="button" className="ru-btn-secondary">SSO empresa</button>
          </div>

          <div className="mt-6 ru-caption">
            Demo admin: <span className="text-ink-900 font-mono">admin@toportaria.com</span> / 123456
          </div>
        </form>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
