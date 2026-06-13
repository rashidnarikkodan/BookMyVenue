import { Navigate } from 'react-router-dom';
import OwnerLayout from '../layouts/OwnerLayout';
import ErrorPage from '@/shared/pages/ErrorPage';

import ProtectedRoute from '@/shared/components/ProtectedRoute';

import OwnerDashboard from '@/features/dashboard/pages/OwnerDashboard';
import OwnerVenuesList from '@/features/venues/pages/OwnerVenuesList';
import OwnerVenueDetails from '@/features/venues/pages/OwnerVenueDetails';
export const ownerRoutes = {
  path: '/owners',

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
      element: <OwnerDashboard />,
    },
    {
      path: 'venues',
      element: <OwnerVenuesList />,
    },
    {
      path: 'venues/:id',
      element: <OwnerVenueDetails />,
    },
  ],
};
