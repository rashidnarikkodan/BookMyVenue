import { createBrowserRouter } from 'react-router-dom';

import { mainRoutes } from './mian.routes';
import { ownerRoutes } from './owner.routes';
import { adminRoutes } from './admin.routes';
import { authRoutes } from './auth.routes';
import PageNotFound from '@/features/not-found/PageNotFound';

export const router = createBrowserRouter([
  authRoutes,
  mainRoutes,
  ownerRoutes,
  adminRoutes,
  {
    path: '*',
    element: <PageNotFound />,
  },
]);
