import { createBrowserRouter } from 'react-router-dom';

import { mainRoutes } from './main.routes';
import { ownerRoutes } from './owner.routes';
import { adminRoutes } from './admin.routes';
import { authRoutes } from './auth.routes';
import PageNotFound from '@/shared/pages/PageNotFound';

export const router = createBrowserRouter([
  authRoutes,
  ownerRoutes,
  adminRoutes,
  mainRoutes,
  {
    path: '*',
    element: <PageNotFound />,
  },
]);
