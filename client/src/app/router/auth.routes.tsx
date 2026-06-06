import { Navigate } from 'react-router-dom';
import AuthLayout from '@/features/auth/AuthLayout';
import Signin from '@/features/auth/Signin';
import Signup from '@/features/auth/Signup';

export const authRoutes = {
  path: '/',

  element: <AuthLayout />,

  children: [
    // ── Primary auth routes (used by internal Links) ──────────────
    {
      path: 'signin',
      element: <Signin />,
    },
    {
      path: 'signup',
      element: <Signup />,
    },

    // ── Aliases so old /login and /register still work ─────────────
    {
      path: 'login',
      element: <Navigate to="/signin" replace />,
    },
    {
      path: 'register',
      element: <Navigate to="/signup" replace />,
    },

    // ── Owner & Admin auth (placeholders until pages are built) ───
    {
      path: 'owner/login',
      element: <>OwnerLoginPage</>,
    },
    {
      path: 'owner/register',
      element: <>OwnerRegisterPage</>,
    },
    {
      path: 'owner/onboarding',
      element: <>OwnerOnboardingPage</>,
    },
    {
      path: 'admin/login',
      element: <>AdminLoginPage</>,
    },
  ],
};
