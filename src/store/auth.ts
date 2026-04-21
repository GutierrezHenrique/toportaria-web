import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = { id: string; name: string; email: string; role: 'ADMIN' | 'PORTEIRO' | 'MORADOR' };

type State = {
  token: string | null;
  user: User | null;
  setAuth: (t: string, u: User) => void;
  logout: () => void;
};

export const useAuth = create<State>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'toportaria-auth' },
  ),
);
