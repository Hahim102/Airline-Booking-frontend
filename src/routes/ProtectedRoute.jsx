import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


export const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, isLoading, isInitializing, hasAnyRole } = useAuth();

  if (isInitializing || isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length === 0) {
    return children;
  }

  if (!hasAnyRole(requiredRoles)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};
