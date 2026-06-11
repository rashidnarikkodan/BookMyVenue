import { Navigate } from 'react-router-dom';
import OwnerLayout from '../layouts/OwnerLayout';
import ErrorPage from '@/shared/pages/ErrorPage';
import OwnerVenuesList from '@/features/venues/pages/OwnerVenuesList';
import OwnerVenueDetails from '@/features/venues/pages/OwnerVenueDetails';

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
      element: <div>owner Dashboard</div>,
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
