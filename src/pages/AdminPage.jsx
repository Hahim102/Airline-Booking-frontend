import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/Pages.css';

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
    <div className="page-container">
      <div className="page-content">
        <h1>Admin Dashboard</h1>

        <div className="info-card">
          <h2>System Administration</h2>
          <p>Manage system users, roles, and administrative permissions.</p>

          <div className="user-info">
            <h3>Your Roles:</h3>
            <ul>
              {user?.roles?.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="admin-section">
          <h2>Manage Users</h2>
          <button className="primary-btn">+ Add New User</button>

          <table className="users-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="role-badge">{user.role}</span>
                  </td>
                  <td>
                    <button
                      className="action-btn small"
                      onClick={() => handleEditUser(user.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn small danger"
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

        <div className="admin-section">
          <h2>System Settings</h2>
          <div className="settings-grid">
            <button className="setting-card">
              <h3>User Roles</h3>
              <p>Manage role definitions and permissions</p>
            </button>
            <button className="setting-card">
              <h3>System Configuration</h3>
              <p>Configure system parameters</p>
            </button>
            <button className="setting-card">
              <h3>Audit Logs</h3>
              <p>View system audit trail</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
