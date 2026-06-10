import { create } from 'zustand';

type AuthState = {
  pendingEmail: string;
  registrationToken: string | null;
  resendTimer: number;
  resendCount: number;
  maxResends: number;
  signupStep: 'details' | 'otp';
  setRegistrationData: (email: string, token: string) => void;
  tickTimer: () => void;
  startResendTimer: () => void;
  incrementResendCount: () => void;
  resetSignupFlow: () => void;
  setSignupStep: (step: 'details' | 'otp') => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  pendingEmail: '',
  registrationToken: null,
  resendTimer: 0,
  resendCount: 0,
  maxResends: 3,
  signupStep: 'details',
  setRegistrationData: (email, token) =>
    set({ pendingEmail: email, registrationToken: token, signupStep: 'otp' }),
  tickTimer: () => set((state) => ({ resendTimer: Math.max(0, state.resendTimer - 1) })),
  startResendTimer: () => set({ resendTimer: 60 }),
  incrementResendCount: () => set((state) => ({ resendCount: state.resendCount + 1 })),
  resetSignupFlow: () =>
    set({
      pendingEmail: '',
      registrationToken: null,
      resendTimer: 0,
      resendCount: 0,
      signupStep: 'details',
    }),
  setSignupStep: (step) => set({ signupStep: step }),
}));
