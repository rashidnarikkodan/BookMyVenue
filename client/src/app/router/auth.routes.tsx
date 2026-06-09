import { Navigate } from 'react-router-dom';
import Signup from '@/features/auth/pages/Signup';
import ErrorPage from '@/shared/pages/ErrorPage';
import Signin from '@/features/auth/pages/Signin';
import ErrorPage from '@/shared/pages/ErrorPage';
import AuthLayout from '../layouts/AuthLayout';

export const authRoutes = {
  path: '/',

  element: <AuthLayout />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: 'login',
      element: <>LoginPage</>,
    },

    {
      path: 'register',
      element: <>RegisterPage</>,
    },

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
