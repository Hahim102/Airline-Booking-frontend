import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAuth } from '../hooks/useAuth';


export const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const hideNavbarOnPaths = ['/', '/login', '/register'];
  const isGuestBookingsPage = location.pathname === '/bookings' && !isAuthenticated;
  const showNavbar = !hideNavbarOnPaths.includes(location.pathname) && !isGuestBookingsPage;

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      {showNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
