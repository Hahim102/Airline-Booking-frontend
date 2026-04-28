import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/LoginPage.css';

/**
 * LoginPage
 * Form-based login with email and password
 */
export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      setFormError('Email and password are required');
      return;
    }

    // Call login
    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Redirect based on role
      // For demo, redirect to /user - in real app, you'd check roles
      navigate('/user');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Airline Booking</h1>
        <h2>Sign In</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., username@gmail.com"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
          </div>

          {(formError || error) && (
            <div className="error-message">
              {formError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn"
          >
            {isLoading ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <div className="login-footer">
          <small>Internal System Access Only</small>
          <small><a href="#forgot">Forgot Password?</a></small>
        </div>

      
      </div>
    </div>
  );
};
