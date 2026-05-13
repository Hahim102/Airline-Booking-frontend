import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { PublicLayout } from './components/PublicLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';
import { HomePage } from './pages/HomePage';
import BookingLandingView from './pages/BookingLandingView';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { ROLES } from './utils/roles';
import UserDashboard from './pages/UserDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import { useAuth } from './hooks/useAuth';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

const PublicOnly = ({ children }) => {
  const { user, isInitializing, isLoading, isAuthenticated } = useAuth();

  if (isInitializing || isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return children;

  const role = user?.role;
  if (role?.includes(ROLES.SYSTEM_ADMIN)) return <Navigate to="/manager" replace />;
  if (role?.includes(ROLES.AIRLINE_OWNER)) return <Navigate to="/owner" replace />;
  return <Navigate to="/user" replace />;
};



/**
 * App Component
 * Main routing and layout setup
 */
function App() {

  
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PublicOnly>
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              </PublicOnly>
            }
          />

          <Route
            path="/booking-landing"
            element={<Navigate to="/" replace />}
          />
          
          <Route
            path="/register"
            element={
              <PublicOnly>
                <PublicLayout>
                  <RegisterPage />
                </PublicLayout>
              </PublicOnly>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <PublicOnly>
                <VerifyOtpPage />
              </PublicOnly>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicOnly>
                <PublicLayout>
                  <ForgotPasswordPage />
                </PublicLayout>
              </PublicOnly>
            }
          />

          <Route
            path="/reset-password"
            element={
              <PublicOnly>
                <PublicLayout>
                  <ResetPasswordPage />
                </PublicLayout>
              </PublicOnly>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnly>
                <PublicLayout>
                  <LoginPage />
                </PublicLayout>
              </PublicOnly>
            }
          />

          <Route
            path="/user"
            element={
              <ProtectedRoute requiredRoles={[ROLES.USER]}>
                <Layout>
                  <UserDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute requiredRoles={[ROLES.USER]}>
                <Layout>
                  <MyBookingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute requiredRoles={[ROLES.USER]}>
                <Layout>
                  <BookingLandingView showNavbar={false} />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager"
            element={
              <ProtectedRoute requiredRoles={[ROLES.SYSTEM_ADMIN]}>
                <Layout>
                  <ManagerDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner"
            element={
              <ProtectedRoute requiredRoles={[ROLES.AIRLINE_OWNER]}>
                <Layout>
                  <OwnerDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Error Routes */}
          <Route
            path="/403"
            element={
              <PublicLayout>
                <ForbiddenPage />
              </PublicLayout>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
