import { Navigate } from 'react-router-dom';
import OwnerLayout from '../layouts/OwnerLayout';
import ErrorPage from '@/shared/pages/ErrorPage';
import ProtectedRoute from '@/shared/components/ProtectedRoute';

export const ownerRoutes = {
  path: '/owner',

  element: (
    <ProtectedRoute allowedRoles={['owner']} redirectPath="/signin">
      <OwnerLayout />
    </ProtectedRoute>
  ),
  errorElement: <ErrorPage />,

  children: [
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: 'dashboard',
      element: <div>owner Dashboard</div>,
    },
  ],
};
