import { Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ErrorPage from '@/shared/pages/ErrorPage';
import CategoriesList from '@/features/categories/pages/CategoriesList';
import CategoryDetails from '@/features/categories/pages/CategoryDetails';
import UsersList from '@/features/users/pages/UsersList';
import UserDetails from '@/features/users/pages/UserDetails';

export const adminRoutes = {
  path: '/admin',

  element: <AdminLayout />,
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: 'dashboard',
      element: <>Admin Dashboard</>,
    },
    {
      path: 'categories',
      element: <CategoriesList />,
    },
    {
      path: 'categories/:id',
      element: <CategoryDetails />,
    },
    {
      path: 'users',
      element: <UsersList />,
    },
    {
      path: 'users/:id',
      element: <UserDetails />,
    },
  ],
};
