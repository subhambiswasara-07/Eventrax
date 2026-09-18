import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from './States';

export function ProtectedRoute() {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <Loader label="Checking your session" />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

export function AdminRoute() {
  const { isAdmin, isAuthenticated, initializing } = useAuth();

  if (initializing) return <Loader label="Checking your session" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/events" replace />;
  return <Outlet />;
}

export function GuestOnlyRoute() {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return <Loader label="Loading" />;
  if (isAuthenticated) return <Navigate to="/events" replace />;
  return <Outlet />;
}
