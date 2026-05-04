import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { UserPage } from './pages/UserPage';
import { AdminPage } from './pages/AdminPage';
import { AirlineOwnerPage } from './pages/AirlineOwnerPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { ROLES } from './utils/roles';

/**
 * App Component
 * Main routing and layout setup
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<HomePage />} />
            

            {/* Protected Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute requiredRoles={[ROLES.USER, ROLES.SYSTEM_ADMIN, ROLES.AIRLINE_OWNER]}>
                  <UserPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRoles={[ROLES.SYSTEM_ADMIN]}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/airline"
              element={
                <ProtectedRoute requiredRoles={[ROLES.AIRLINE_OWNER]}>
                  <AirlineOwnerPage />
                </ProtectedRoute>
              }
            />

            {/* Error Routes */}
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
