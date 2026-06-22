import ErrorPage from '@/shared/pages/ErrorPage';
import MainLayout from '../layouts/MainLayout';
import HomePage from '@/features/public/pages/HomePage';
import VenueListPage from '@/features/public/pages/VenueListPage';
import VenueDetailsPage from '@/features/public/pages/VenueDetailsPage';

export const mainRoutes = {
  path: '/',

  element: <MainLayout />,
  errorElement: <ErrorPage />,

  children: [
    { index: true, element: <HomePage /> },
    { path: 'venues', element: <VenueListPage /> },
    { path: 'venues/:id', element: <VenueDetailsPage /> },
    { path: 'account/profile', element: <>ProfilePage</> },
    { path: 'account/bookings', element: <>MyBookingsPage</> },
  ],
};
