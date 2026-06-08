import ErrorPage from '@/shared/pages/ErrorPage';
import MainLayout from '../layouts/MainLayout';
import HomePage from '@/features/home/pages/HomePage';

export const mainRoutes = {
  path: '/',

  element: <MainLayout />,
  errorElement: <ErrorPage />,

  children: [
    { index: true, element: <HomePage /> },
    { path: 'venues', element: <>VenueListPage</> },
    { path: 'venues/:id', element: <>VenueDetailsPage</> },
    { path: 'account/profile', element: <>ProfilePage</> },
    { path: 'account/bookings', element: <>MyBookingsPage</> },
  ],
};
// add your pages here based on path. path:'venues'=> http:/localhost:3000/user/venues
