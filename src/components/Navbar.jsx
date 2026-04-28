import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Navbar.css';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasRole, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>
            <span className="airline-icon">✈️</span>
            SkyStream Operations
          </h2>
        </div>

        <div className="navbar-links">
          {/* My Bookings link - visible to all users and guests */}
          <a
            href="/bookings"
            className={`nav-link ${isActive('/bookings') ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              navigate('/bookings');
            }}
          >
            My Bookings
          </a>

          {/* User link - visible for authenticated users only */}
          {isAuthenticated && (
            <a
              href="/user"
              className={`nav-link ${isActive('/user') ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/user');
              }}
            >
              User Dashboard
            </a>
          )}

          {/* Admin link - only for system admins */}
          {hasRole('ROLE_SYSTEM_ADMIN') && (
            <a
              href="/admin"
              className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/admin');
              }}
            >
              Admin
            </a>
          )}

          {/* Airline Owner link - only for airline owners */}
          {hasRole('ROLE_AIRLINE_OWNER') && (
            <a
              href="/airline"
              className={`nav-link ${isActive('/airline') ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/airline');
              }}
            >
              Airline Operations
            </a>
          )}
        </div>

        <div className="navbar-user">
          {isAuthenticated && user ? (
            <div className="user-section">
              <span className="user-label">
                {user.roles?.[0]?.replace('ROLE_', '') || 'User'}
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="login-btn"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Sign In
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};
