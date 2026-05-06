import { useLocation } from 'react-router-dom';

export const PublicLayout = ({ children }) => {
  const location = useLocation();

  const hideNavbarOnPaths = ['/login', '/register'];
  const showNavbar = !hideNavbarOnPaths.includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <main className="flex-1">{children}</main>
    </div>
  );
};
