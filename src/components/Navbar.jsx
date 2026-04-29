import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
    <nav className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <h2 className="m-0 text-xl font-bold text-slate-800">
            <span className="mr-1">✈️</span>
            SkyStream Operations
          </h2>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="/bookings"
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${isActive('/bookings') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
            onClick={(e) => {
              e.preventDefault();
              navigate('/bookings');
            }}
          >
            My Bookings
          </a>

          {isAuthenticated && (
            <a
              href="/user"
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${isActive('/user') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/user');
              }}
            >
              User Dashboard
            </a>
          )}

          {hasRole('ROLE_SYSTEM_ADMIN') && (
            <a
              href="/admin"
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${isActive('/admin') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/admin');
              }}
            >
              Admin
            </a>
          )}

          {hasRole('ROLE_AIRLINE_OWNER') && (
            <a
              href="/airline"
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${isActive('/airline') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/airline');
              }}
            >
              Airline Operations
            </a>
          )}
        </div>

        <div>
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {user.roles?.[0]?.replace('ROLE_', '') || 'User'}
              </span>
              <button className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="/register"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/register');
                }}
              >
                Register
              </a>
              <a
                href="/login"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
              >
                Sign In
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
