import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAuth } from '../hooks/useAuth';
import '../styles/Layout.css';


export const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Hide navbar for auth-focused pages and guest registration view.
  const hideNavbarOnPaths = ['/login', '/register'];
  const isGuestBookingsPage = location.pathname === '/bookings' && !isAuthenticated;
  const showNavbar = !hideNavbarOnPaths.includes(location.pathname) && !isGuestBookingsPage;

  return (
    <div className="layout">
      {showNavbar && <Navbar />}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};
