import { useAuth } from '../hooks/useAuth';
import Sidebar from './SlideBar';
import TopNav from './TopNav';
import { useState } from 'react';

export const Layout = ({ children }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <div className="min-h-screen bg-surface">

      {isSidebarOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-16 z-20">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          />
          <Sidebar currentRole={user?.role} className="max-h-[calc(100vh-4rem-2rem)]" />
        </div>
      ) : null}

      <div className="flex flex-col min-h-screen">
        <TopNav onAvatarClick={() => setIsSidebarOpen((v) => !v)} />

        <main className="p-10 flex-1">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>


    </div>
  );
};