import { useAuth } from '../hooks/useAuth';
import '../styles/Pages.css';

/**
 * UserPage
 * Accessible to: ROLE_USER
 */
export const UserPage = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-content">
        <h1>User Dashboard</h1>

        <div className="info-card">
          <h2>Welcome, User!</h2>
          <p>You have access to user-level features and information.</p>

          <div className="user-info">
            <h3>Your Roles:</h3>
            <ul>
              {user?.roles?.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>

          <div className="features-section">
            <h3>Available Features:</h3>
            <ul>
              <li>View personal flight bookings</li>
              <li>Manage seat preferences</li>
              <li>View booking history</li>
              <li>Access exclusive lounge benefits</li>
            </ul>
          </div>
        </div>

        <div className="action-card">
          <h3>Quick Actions</h3>
          <button className="action-btn">View My Bookings</button>
          <button className="action-btn">Book a Flight</button>
          <button className="action-btn">Update Profile</button>
        </div>
      </div>
    </div>
  );
};
