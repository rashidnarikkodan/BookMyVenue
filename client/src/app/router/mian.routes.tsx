import MainLayout from '../layouts/MainLayout';

export const mainRoutes = {
  path: '/',

  element: <MainLayout />,

  children: [
    { index: true, element: <div>HomePage</div> },
    { path: 'venues', element: <>VenueListPage</> },
    { path: 'venues/:id', element: <>VenueDetailsPage</> },
    { path: 'account/profile', element: <>ProfilePage</> },
    { path: 'account/bookings', element: <>MyBookingsPage</> },
  ],
};
// add your pages here based on path. path:'venues'=> http:/localhost:3000/user/venues
