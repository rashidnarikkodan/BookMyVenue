import AuthLayout from '../layouts/AuthLayout';

export const authRoutes = {
  path: '/',

  element: <AuthLayout />,

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
