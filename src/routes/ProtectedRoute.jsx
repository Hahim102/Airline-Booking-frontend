import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute component
 * Checks if user is authenticated and has required roles
 *
 * @param {ReactNode} children - Component to render if authorized
 * @param {string[]} requiredRoles - Roles required to access this route
 * @returns {ReactNode} Children if authorized, redirect otherwise
 */
export const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, hasAnyRole } = useAuth();

  // Not logged in - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // No specific roles required
  if (requiredRoles.length === 0) {
    return children;
  }

  // Check if user has any of the required roles
  if (!hasAnyRole(requiredRoles)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};
