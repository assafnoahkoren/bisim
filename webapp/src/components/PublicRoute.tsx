import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingOverlay } from '@mantine/core';

export function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingOverlay visible />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}