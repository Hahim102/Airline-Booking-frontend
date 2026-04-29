import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * AdminPage
 * Accessible to: ROLE_SYSTEM_ADMIN
 */
export const AdminPage = () => {
  const { user } = useAuth();
  const [users] = useState([
    { id: 1, name: 'Marcus Wright', email: 'm.wright@skystream.com', role: 'ROLE_USER' },
    { id: 2, name: 'Elena Rodriguez', email: 'e.rodriguez@skystream.com', role: 'ROLE_USER' },
    { id: 3, name: 'David Chen', email: 'd.chen@skystream.com', role: 'ROLE_AIRLINE_OWNER' },
    { id: 4, name: 'Sarah Miller', email: 's.miller@skystream.com', role: 'ROLE_SYSTEM_ADMIN' },
  ]);

  const handleDeleteUser = (userId) => {
    console.log('Delete user:', userId);
    alert('User deletion would be implemented here');
  };

  const handleEditUser = (userId) => {
    console.log('Edit user:', userId);
    alert('User edit would be implemented here');
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div>
        <h1 className="mb-6 text-4xl font-bold text-slate-900">Admin Dashboard</h1>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">System Administration</h2>
          <p className="mb-4 text-slate-600">Manage system users, roles, and administrative permissions.</p>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800">Your Roles:</h3>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              {user?.roles?.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Manage Users</h2>
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ Add New User</button>
          </div>

          <div className="overflow-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="py-2">User Name</th>
                  <th className="py-2">Email Address</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 text-sm">
                    <td className="py-3 font-medium text-slate-800">{user.name}</td>
                    <td className="py-3 text-slate-600">{user.email}</td>
                    <td className="py-3">
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{user.role}</span>
                    </td>
                    <td className="space-x-2 py-3">
                      <button
                        className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        onClick={() => handleEditUser(user.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">System Settings</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <button className="rounded-lg border border-slate-200 p-4 text-left transition hover:bg-slate-50">
              <h3 className="font-semibold text-slate-800">User Roles</h3>
              <p className="text-sm text-slate-500">Manage role definitions and permissions</p>
            </button>
            <button className="rounded-lg border border-slate-200 p-4 text-left transition hover:bg-slate-50">
              <h3 className="font-semibold text-slate-800">System Configuration</h3>
              <p className="text-sm text-slate-500">Configure system parameters</p>
            </button>
            <button className="rounded-lg border border-slate-200 p-4 text-left transition hover:bg-slate-50">
              <h3 className="font-semibold text-slate-800">Audit Logs</h3>
              <p className="text-sm text-slate-500">View system audit trail</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
