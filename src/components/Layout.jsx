import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './SlideBar';
import TopNav from './TopNav';
import { useState } from 'react';

export const Layout = ({ children }) => {
  const { user } = useAuth();


  return (
    <div className="min-h-screen bg-surface">

      <Sidebar
        currentRole={user?.role}
      />

      <div className="ml-64 flex flex-col min-h-screen">
        <TopNav onProfileClick={() => openModel('profile')} />

        <main className="p-10 flex-1">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>


    </div>
  );
};