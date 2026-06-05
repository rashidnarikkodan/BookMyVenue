import { Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ErrorPage from '@/shared/pages/ErrorPage';

export const adminRoutes = {
  path: '/admin',

  element: <AdminLayout />,
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: 'dashboard',
      element: <>Admin Dashboard</>,
    },
  ],
};
