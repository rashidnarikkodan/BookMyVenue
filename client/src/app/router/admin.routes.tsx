import { Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

export const adminRoutes = {
  path: '/admin',

  element: <AdminLayout />,

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
