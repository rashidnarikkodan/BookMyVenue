import React, { type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/store/app.store';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectPath?: string;
  children?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/signin',
  children,
}) => {
  const { isAuthenticated, user } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
