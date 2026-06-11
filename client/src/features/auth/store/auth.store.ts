import { create } from 'zustand';

export type SignupStep = 'details' | 'otp';

interface AuthState {
  signupStep: SignupStep;
  registrationToken: string | null;
  pendingEmail: string | null;

  resendTimer: number;
  resendCount: number;
  maxResends: number;

  setSignupStep: (step: SignupStep) => void;
  setRegistrationData: (email: string, token: string) => void;
  startResendTimer: () => void;
  tickTimer: () => void;
  resetSignupFlow: () => void;
  incrementResendCount: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  signupStep: 'details',
  registrationToken: null,
  pendingEmail: null,
  resendTimer: 60,
  resendCount: 0,
  maxResends: 3,

  setSignupStep: (step) => set({ signupStep: step }),

  setRegistrationData: (email, token) =>
    set({
      pendingEmail: email,
      registrationToken: token,
      signupStep: 'otp',
      resendTimer: 60,
      resendCount: 0,
    }),

  startResendTimer: () => set({ resendTimer: 60 }),

  tickTimer: () => {
    const current = get().resendTimer;
    if (current > 0) set({ resendTimer: current - 1 });
  },

  incrementResendCount: () => set((state) => ({ resendCount: state.resendCount + 1 })),

  resetSignupFlow: () =>
    set({
      signupStep: 'details',
      registrationToken: null,
      pendingEmail: null,
      resendTimer: 60,
      resendCount: 0,
    }),
}));
