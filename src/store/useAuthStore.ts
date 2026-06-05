import { create } from 'zustand';

// 1. Update the role types here to match your new architecture
interface User {
  id: string;
  name: string;
  role: 'Traveler' | 'Volunteer' | 'Admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));