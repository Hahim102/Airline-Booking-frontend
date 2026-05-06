import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * MyBookingsPage
 * - Accessible to: Customers (ROLE_USER) - Authenticated users only
 * - Shows flight bookings and booking history
 */
export const MyBookingsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('UPCOMING');
  const navigate = useNavigate();

  // TODO: Fetch real bookings from API using user.id
  // const [bookings] = useState(user?.bookings || []);
  // TODO: Fetch real travel summary from API
  // const travelSummary = user?.travelSummary || { miles: 24502, flights: 12, status: 'Platinum Elite' };

  // Show login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-4xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-slate-600">Please <a className="text-blue-600 hover:underline" href="/register">create an account</a> or <a className="text-blue-600 hover:underline" href="/login">sign in</a> to view your bookings</p>
        </div>
      </div>
    );
  }

  // Show bookings for authenticated users
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap gap-3 md:justify-end">
        <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">☰ Filter</button>
        <button
          onClick={() => navigate('/booking')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + New Booking
        </button>
      </div>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button 
            className={`flex-1 border-b-2 px-4 py-3 text-xs font-bold tracking-wide ${activeTab === 'UPCOMING' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
            onClick={() => setActiveTab('UPCOMING')}
          >
            UPCOMING
          </button>
          <button 
            className={`flex-1 border-b-2 px-4 py-3 text-xs font-bold tracking-wide ${activeTab === 'COMPLETED' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
            onClick={() => setActiveTab('COMPLETED')}
          >
            COMPLETED
          </button>
          <button 
            className={`flex-1 border-b-2 px-4 py-3 text-xs font-bold tracking-wide ${activeTab === 'CANCELLED' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
            onClick={() => setActiveTab('CANCELLED')}
          >
            CANCELLED
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">UPCOMING</span>
              <span className="text-sm text-slate-500">Booking ID: #SC-98231</span>
              <span className="text-sm text-slate-500">Departure in 2 days</span>
            </div>

            <div className="mb-5 grid gap-4 rounded-lg bg-slate-50 p-4 md:grid-cols-4 md:items-center">
              <div>
                <h3 className="text-3xl font-bold text-slate-900">SFO</h3>
                <p className="text-xs text-slate-500">SAN FRANCISCO</p>
              </div>
              <div className="text-center md:col-span-2">
                <p className="font-semibold text-slate-800">10:45 AM</p>
                <div className="my-1 text-slate-500">✈</div>
                <p className="text-sm text-slate-500">Flight SC-102 • 5h 20m</p>
              </div>
              <div className="text-right">
                <h3 className="text-3xl font-bold text-slate-900">JFK</h3>
                <p className="text-xs text-slate-500">NEW YORK</p>
                <p className="mt-1 font-semibold text-slate-800">07:05 PM</p>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3 border-b border-slate-200 pb-4 md:grid-cols-4">
              <div>
                <span className="mb-1 block text-[11px] font-bold uppercase text-slate-400">Gate</span>
                <span className="font-semibold text-slate-800">B12</span>
              </div>
              <div>
                <span className="mb-1 block text-[11px] font-bold uppercase text-slate-400">Seat</span>
                <span className="font-semibold text-slate-800">14A</span>
              </div>
              <div>
                <span className="mb-1 block text-[11px] font-bold uppercase text-slate-400">Terminal</span>
                <span className="font-semibold text-slate-800">Intl 3</span>
              </div>
              <div>
                <span className="mb-1 block text-[11px] font-bold uppercase text-slate-400">Status</span>
                <span className="font-semibold text-emerald-600">Confirmed</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <button className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Manage Seat</button>
              <button className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Download Ticket</button>
            </div>
          </div>

          <div className="pt-4 text-center text-sm text-slate-500">
            <p>Showing 1 of 42 bookings</p>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Travel Summary</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4 text-center">
            <p className="mb-1 text-xs font-bold uppercase text-slate-400">Miles Earned</p>
            <p className="text-3xl font-bold text-slate-800">{user?.mileagePoints?.toLocaleString() || '24,502'}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 text-center">
            <p className="mb-1 text-xs font-bold uppercase text-slate-400">Flights this year</p>
            <p className="text-3xl font-bold text-slate-800">{user?.flightCount || '12'}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 text-center">
            <p className="mb-1 text-xs font-bold uppercase text-slate-400">Member Status</p>
            <p className="text-3xl font-bold text-blue-600">{user?.memberStatus || 'Platinum Elite'}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 p-6 text-center text-white shadow">
        <h2 className="mb-2 text-2xl font-bold">Exclusive Lounge Access</h2>
        <p className="mb-4 text-slate-200">Enjoy premium amenities at JFK Terminal 4 during your layover.</p>
        <button className="rounded-md bg-white px-5 py-2 font-semibold text-slate-800 hover:bg-slate-100">View Lounge Map</button>
      </div>
    </div>
  );
};
