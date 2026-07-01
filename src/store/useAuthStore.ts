import { create } from 'zustand';
import api from '../utils/api';

// Single canonical role type — matches exactly what the Go backend stores and returns.
// 'Local Guide' (with space) is a display label only; the DB and API always use 'LocalGuide'.
export type UserRole = 'Traveler' | 'LocalGuide' | 'Admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,

  login: (user) => set({ user, isAuthenticated: true }),

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/users/me');
      const userData: User = {
        id: response.data.user.id,
        fullName: response.data.user.fullName,
        email: response.data.user.email,
        role: response.data.user.role as UserRole,
      };
      set({ user: userData, isAuthenticated: true, isCheckingAuth: false });
    } catch {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
}));