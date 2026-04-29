import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * AirlineOwnerPage
 * Accessible to: ROLE_AIRLINE_OWNER
 */
export const AirlineOwnerPage = () => {
  const { user } = useAuth();
  const [flights] = useState([
    { id: 'SK-402', route: 'LHR → JFK', status: 'On Time', departure: '14:30 GMT' },
    { id: 'SK-118', route: 'DXB → SIN', status: 'On Time', departure: '15:15 GMT' },
    { id: 'SK-909', route: 'CDG → HND', status: 'Delayed', departure: '16:00 GMT' },
    { id: 'SK-552', route: 'MUC → MAD', status: 'On Time', departure: '17:45 GMT' },
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div>
        <h1 className="mb-6 text-4xl font-bold text-slate-900">Airline Operations Dashboard</h1>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Fleet Management</h2>
          <p className="mb-4 text-slate-600">Monitor and manage your airline fleet operations.</p>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800">Your Roles:</h3>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              {user?.roles?.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500">Active Aircraft</h3>
            <p className="my-2 text-4xl font-bold text-blue-600">42</p>
            <small className="text-slate-500">Flights scheduled today</small>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500">On-Time Rate</h3>
            <p className="my-2 text-4xl font-bold text-blue-600">98.2%</p>
            <small className="text-slate-500">Current week average</small>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500">Total Passengers</h3>
            <p className="my-2 text-4xl font-bold text-blue-600">8,247</p>
            <small className="text-slate-500">Flights this week</small>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Current Flight Schedule</h2>
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ Add Flight</button>
          </div>

          <div className="overflow-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="py-2">Flight Number</th>
                  <th className="py-2">Route</th>
                  <th className="py-2">Departure</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight) => (
                  <tr key={flight.id} className="border-b border-slate-100 text-sm">
                    <td className="py-3 font-semibold text-slate-800">{flight.id}</td>
                    <td className="py-3 text-slate-600">{flight.route}</td>
                    <td className="py-3 text-slate-600">{flight.departure}</td>
                    <td className="py-3">
                      <span className={`rounded px-2 py-1 text-xs font-semibold ${flight.status === 'Delayed' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {flight.status}
                      </span>
                    </td>
                    <td className="space-x-2 py-3">
                      <button className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                      <button className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Quick Actions</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <button className="rounded-lg border border-slate-200 p-4 text-left transition hover:bg-slate-50">
              <h3 className="font-semibold text-slate-800">Fleet Status</h3>
              <p className="text-sm text-slate-500">View real-time aircraft status</p>
            </button>
            <button className="rounded-lg border border-slate-200 p-4 text-left transition hover:bg-slate-50">
              <h3 className="font-semibold text-slate-800">Crew Management</h3>
              <p className="text-sm text-slate-500">Manage pilots and crew assignments</p>
            </button>
            <button className="rounded-lg border border-slate-200 p-4 text-left transition hover:bg-slate-50">
              <h3 className="font-semibold text-slate-800">Revenue Reports</h3>
              <p className="text-sm text-slate-500">View detailed revenue analytics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
