import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  avatar?: string;
  // add other necessary fields
}

interface AppState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'app-storage', // key in local storage
    }
  )
);
