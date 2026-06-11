import { Navigate } from 'react-router-dom';
import OwnerLayout from '../layouts/OwnerLayout';
import ErrorPage from '@/shared/pages/ErrorPage';
import OwnerDashboard from '@/features/dashboard/pages/OwnerDashboard';

export const ownerRoutes = {
  path: '/owner',

  element: <OwnerLayout />,
  errorElement: <ErrorPage />,

  children: [
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: 'dashboard',
      element: <OwnerDashboard />,
    },
  ],
};
