import { create } from 'zustand';
import api from '../utils/api'; // Make sure this path points to your Axios instance

// Updated to match your Go backend's JSON response
interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'Traveler' | 'Local Guide' | 'LocalGuide' | 'Admin'; // Added LocalGuide to match DB
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean; // NEW: Tells the app we are currently checking cookies
  login: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>; // NEW: The hydration function
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true, // Start true so the Navbar doesn't flash "Sign In" on reload

  login: (user) => set({ user, isAuthenticated: true }),

  logout: async () => {
    try {
      // Optional: Tell the backend to destroy the cookie
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Always clear frontend state
      set({ user: null, isAuthenticated: false });
    }
  },

  // THE HYDRATION LOOP
  checkAuth: async () => {
    try {
      // This automatically sends the HttpOnly cookie to the Go server
      const response = await api.get('/users/me');

      // Map the Go backend response strictly to your TypeScript interface
      const userData: User = {
        id: response.data.user.id,           // was .ID
        fullName: response.data.user.fullName, // was .FullName
        email: response.data.user.email,     // was .Email
        role: response.data.user.role,       // was .Role
      };

      set({
        user: userData,
        isAuthenticated: true,
        isCheckingAuth: false
      });
    } catch (error) {
      // If the cookie is missing or expired, quietly fail and ensure logged-out state
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false
      });
    }
  },
}));