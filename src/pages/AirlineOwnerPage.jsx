import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/Pages.css';

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
    <div className="page-container">
      <div className="page-content">
        <h1>Airline Operations Dashboard</h1>

        <div className="info-card">
          <h2>Fleet Management</h2>
          <p>Monitor and manage your airline fleet operations.</p>

          <div className="user-info">
            <h3>Your Roles:</h3>
            <ul>
              {user?.roles?.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Active Aircraft</h3>
            <p className="stat-number">42</p>
            <small>Flights scheduled today</small>
          </div>
          <div className="stat-card">
            <h3>On-Time Rate</h3>
            <p className="stat-number">98.2%</p>
            <small>Current week average</small>
          </div>
          <div className="stat-card">
            <h3>Total Passengers</h3>
            <p className="stat-number">8,247</p>
            <small>Flights this week</small>
          </div>
        </div>

        <div className="admin-section">
          <h2>Current Flight Schedule</h2>
          <button className="primary-btn">+ Add Flight</button>

          <table className="users-table">
            <thead>
              <tr>
                <th>Flight Number</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td><strong>{flight.id}</strong></td>
                  <td>{flight.route}</td>
                  <td>{flight.departure}</td>
                  <td>
                    <span className={`status-badge ${flight.status.toLowerCase()}`}>
                      {flight.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn small">Edit</button>
                    <button className="action-btn small">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-section">
          <h2>Quick Actions</h2>
          <div className="settings-grid">
            <button className="setting-card">
              <h3>Fleet Status</h3>
              <p>View real-time aircraft status</p>
            </button>
            <button className="setting-card">
              <h3>Crew Management</h3>
              <p>Manage pilots and crew assignments</p>
            </button>
            <button className="setting-card">
              <h3>Revenue Reports</h3>
              <p>View detailed revenue analytics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
