import { Globe, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavItem = ({ label, active = false }) => (
  <a
    href="#"
    className={`font-medium transition-colors duration-200 py-1 ${
      active
        ? 'text-primary border-b-2 border-primary'
        : 'text-on-surface-variant hover:text-primary'
    }`}
  >
    {label}
  </a>
);

export const BookingLandingNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
            SkyStream Operations
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <NavItem label="Book" active />
            <NavItem label="My Trips" />
            <NavItem label="Check-in" />
            <NavItem label="Flight Status" />
            <NavItem label="Loyalty" />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
            <Globe className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="hidden lg:block text-on-surface-variant font-medium hover:text-primary px-4 py-2 transition-colors">
            Support
          </button>
          <Link
            to="/login"
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-container transition-all active:scale-95"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
};

