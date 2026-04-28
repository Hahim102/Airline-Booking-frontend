import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/ErrorPages.css';

/**
 * ForbiddenPage (403)
 * Shown when user is authenticated but lacks required role
 */
export const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-icon">
          <span>🔒</span>
        </div>

        <h1>403 - Access Forbidden</h1>
        <p className="error-message">
          You do not have permission to access this page. This restricted sector is reserved for
          flight command personnel with specific clearance levels.
        </p>

        <button className="primary-btn" onClick={() => navigate('/user')}>
          Return to Dashboard
        </button>

        <div className="error-details">
          <h3>Security Protocols</h3>
          <p>
            <strong>Credentials verification failed</strong> for the requested resource.
          </p>

          {user?.roles && user.roles.length > 0 && (
            <div className="your-roles">
              <p><strong>Your Current Roles:</strong></p>
              <ul>
                {user.roles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            </div>
          )}

          <p>
            <strong>Need Assistance?</strong><br />
            Contact your Ops Supervisor for authorization keys.
          </p>
        </div>

        <div className="incident-log">
          <p>
            <strong>Incident Log:</strong><br />
            Event ID: Sky-403-EX-992 has been recorded
          </p>
        </div>
      </div>
    </div>
  );
};
