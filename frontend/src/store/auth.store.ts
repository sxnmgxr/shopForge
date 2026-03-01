import { create } from 'zustand';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await authApi.login({ email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      set({ token, user, isLoading: false });
      return user; // return for callers
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const res = await authApi.register({ name, email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      set({ token, user, isLoading: false });
      return user;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchMe: async () => {
    try {
      const res = await authApi.me();
      set({ user: res.data.user });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },
}));
