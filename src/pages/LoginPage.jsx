import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

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

    if (!formData.email || !formData.password) {
      setFormError('Email and password are required');
      return;
    }
    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/user');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-sm font-bold text-blue-700">✈️ Airline Booking</h1>
        <h2 className="mb-7 text-center text-4xl font-bold text-slate-900">Sign In</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., username@gmail.com"
              disabled={isLoading}
              className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {(formError || error) && (
            <div className="mb-5 rounded-md border-l-4 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-md bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
          <small className="block">Internal System Access Only</small>
          <small className="block"><a href="#forgot" className="font-medium text-blue-600 hover:underline">Forgot Password?</a></small>
        </div>
      </div>
    </div>
  );
};
