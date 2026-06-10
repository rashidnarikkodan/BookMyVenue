import { create } from 'zustand';

type AppStore = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  token: string | null;
  refreshToken: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAuth: (token: string, refreshToken: string, user: any) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  setAuth: (token, refreshToken, user) => set({ token, refreshToken, user }),
}));
