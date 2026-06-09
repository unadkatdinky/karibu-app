import { create } from 'zustand';

// Updated to match your Go backend's JSON response
interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'Traveler' | 'Local Guide' | 'Admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  // Notice we removed the token parameter entirely
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));