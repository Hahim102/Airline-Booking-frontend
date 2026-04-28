import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/MyBookingsPage.css';

/**
 * MyBookingsPage
 * - Accessible to: Customers (ROLE_USER) and guests
 * - For guests: Shows registration form to create account
 * - For customers: Shows their flight bookings and booking history
 */
export const MyBookingsPage = () => {
  const { isAuthenticated, register, isLoading, error } = useAuth();
  const navigate = useNavigate();
  
  const [showRegistration, setShowRegistration] = useState(!isAuthenticated);
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Handle input changes for registration form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value,
    }));
    setRegistrationError('');
  };

  // Handle registration submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegistrationError('');

    // Validation
    if (!registrationData.fullName || !registrationData.email || !registrationData.phone || !registrationData.password) {
      setRegistrationError('All fields are required');
      return;
    }

    if (registrationData.password !== registrationData.confirmPassword) {
      setRegistrationError('Passwords do not match');
      return;
    }

    if (registrationData.password.length < 6) {
      setRegistrationError('Password must be at least 6 characters');
      return;
    }

    // Call register function
    const result = await register(
      registrationData.email,
      registrationData.password,
      registrationData.fullName,
      registrationData.phone
    );

    if (result.success) {
      setRegistrationSuccess(true);
      setShowRegistration(false);
      navigate('/bookings', { replace: true });
    } else {
      setRegistrationError(result.error || 'Registration failed');
    }
  };

  if (!isAuthenticated && showRegistration) {
    return (
      <div className="register-page-shell">
        <header className="register-topbar">
          <div className="register-topbar-inner">
            <div className="register-brand">Skyline Operations</div>
            <nav className="register-nav-links">
              <a href="#">Registration</a>
              <a href="#">Help</a>
              <a href="#">Contact</a>
            </nav>
          </div>
        </header>

        <main className="register-main">
          <div className="register-card">
            <div className="register-header">
              <h1>Create Account</h1>
              <p>Join Skyline Operations fleet management system</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="fullName">FULL NAME</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={registrationData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">EMAIL ADDRESS</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleInputChange}
                  placeholder="dispatcher@skyline.com"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">PHONE NUMBER</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={registrationData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">PASSWORD</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={registrationData.password}
                  onChange={handleInputChange}
                  placeholder="********"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registrationData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="********"
                  disabled={isLoading}
                  required
                />
              </div>

              {(registrationError || error) && (
                <div className="error-message">
                  {registrationError || error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="register-submit-btn"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="register-footer">
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Logged-in user view - show bookings
  return (
    <div className="my-bookings-container">
      {registrationSuccess && (
        <div className="success-message">
          ✓ Welcome! Your account has been created successfully. Loading your bookings...
        </div>
      )}

      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>Manage your upcoming journeys and review past flight history</p>
      </div>

      <div className="bookings-controls">
        <button className="filter-btn">☰ Filter</button>
        <button className="new-booking-btn">+ New Booking</button>
      </div>

      <div className="bookings-section">
        <div className="bookings-tabs">
          <button className="tab active">UPCOMING</button>
          <button className="tab">COMPLETED</button>
          <button className="tab">CANCELLED</button>
        </div>

        <div className="bookings-content">
          <div className="booking-card">
            <div className="booking-header">
              <span className="booking-status upcoming">UPCOMING</span>
              <span className="booking-id">Booking ID: #SC-98231</span>
              <span className="departure-info">Departure in 2 days</span>
            </div>

            <div className="flight-info">
              <div className="flight-route">
                <h3>SFO</h3>
                <p>SAN FRANCISCO</p>
              </div>
              <div className="flight-duration">
                <p className="time">10:45 AM</p>
                <div className="flight-line">
                  <span className="plane-icon">✈</span>
                </div>
                <p className="duration">Flight SC-102 • 5h 20m</p>
              </div>
              <div className="flight-destination">
                <h3>JFK</h3>
                <p>NEW YORK</p>
              </div>
              <div className="arrival-time">
                <p className="time">07:05 PM</p>
              </div>
            </div>

            <div className="booking-details">
              <div className="detail-item">
                <span className="label">Gate</span>
                <span className="value">B12</span>
              </div>
              <div className="detail-item">
                <span className="label">Seat</span>
                <span className="value">14A</span>
              </div>
              <div className="detail-item">
                <span className="label">Terminal</span>
                <span className="value">Intl 3</span>
              </div>
              <div className="detail-item">
                <span className="label">Status</span>
                <span className="value confirmed">Confirmed</span>
              </div>
            </div>

            <div className="booking-actions">
              <button className="action-btn">Manage Seat</button>
              <button className="action-btn primary">Download Ticket</button>
            </div>
          </div>

          <div className="no-more-bookings">
            <p>Showing 1 of 42 bookings</p>
          </div>
        </div>
      </div>

      <div className="travel-summary">
        <h2>Travel Summary</h2>
        <div className="summary-items">
          <div className="summary-item">
            <p className="summary-label">Miles Earned</p>
            <p className="summary-value">24,502</p>
          </div>
          <div className="summary-item">
            <p className="summary-label">Flights this year</p>
            <p className="summary-value">12</p>
          </div>
          <div className="summary-item">
            <p className="summary-label">Member Status</p>
            <p className="summary-value elite">Platinum Elite</p>
          </div>
        </div>
      </div>

      <div className="exclusive-offer">
        <h2>Exclusive Lounge Access</h2>
        <p>Enjoy premium amenities at JFK Terminal 4 during your layover.</p>
        <button className="view-lounge-btn">View Lounge Map</button>
      </div>
    </div>
  );
};
