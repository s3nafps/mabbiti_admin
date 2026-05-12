import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/src/core/hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'moderator' | 'user')[];
}

export const ProtectedRoute = ({ allowedRoles = ['admin', 'moderator'] }: ProtectedRouteProps) => {
  const { user, role, loading, initialized } = useAuthStore();

  if (!initialized || loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { user, loading, initialized } = useAuthStore();

  if (!initialized || loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
