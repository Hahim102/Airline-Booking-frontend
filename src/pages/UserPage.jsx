import { useAuth } from '../hooks/useAuth';

/**
 * UserPage
 * Accessible to: ROLE_USER
 */
export const UserPage = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div>
        <h1 className="mb-6 text-4xl font-bold text-slate-900">User Dashboard</h1>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Welcome, User!</h2>
          <p className="mb-4 text-slate-600">You have access to user-level features and information.</p>

          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold text-slate-800">Your Roles:</h3>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              {user?.roles?.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800">Available Features:</h3>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>View personal flight bookings</li>
              <li>Manage seat preferences</li>
              <li>View booking history</li>
              <li>Access exclusive lounge benefits</li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-800">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">View My Bookings</button>
            <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Book a Flight</button>
            <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Update Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};
