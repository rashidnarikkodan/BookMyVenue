import { Navigate } from 'react-router-dom';
import Signup from '@/features/auth/pages/Signup';
import ErrorPage from '@/shared/pages/ErrorPage';
import Signin from '@/features/auth/pages/Signin';
import AuthLayout from '../layouts/AuthLayout';

export const authRoutes = {
  path: '/',

  element: <AuthLayout />,
  errorElement: <ErrorPage />,
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
