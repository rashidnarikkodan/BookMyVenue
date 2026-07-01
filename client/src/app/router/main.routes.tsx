import ErrorPage from '@/shared/pages/ErrorPage';
import MainLayout from '../layouts/MainLayout';
import HomePage from '@/features/public/pages/HomePage';
import VenueListPage from '@/features/public/pages/VenueListPage';
import VenueDetailsPage from '@/features/public/pages/VenueDetailsPage';
import UserProfile from '@/features/profile/pages/UserProfile';
import BookingPage from '@/features/bookings/pages/BookingPage';
import UserBookingsPage from '@/features/users/pages/UserBookingsPage';

export const mainRoutes = {
  path: '/',

  element: <MainLayout />,
  errorElement: <ErrorPage />,
  children: [
    { index: true, element: <HomePage /> },
    { path: 'venues', element: <VenueListPage /> },
    { path: 'venues/:id', element: <VenueDetailsPage /> },
    { path: 'account/profile', element: <UserProfile /> },
    { path: 'account/bookings', element: <UserBookingsPage /> },
    { path: '/bookings/:id', element: <BookingPage /> },
  ],
};
