import { Navigate } from 'react-router-dom';
import OwnerLayout from '../layouts/OwnerLayout';

export const ownerRoutes = {
  path: '/owner',

  element: <OwnerLayout />,

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
