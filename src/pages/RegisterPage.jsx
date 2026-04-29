import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';


export const RegisterPage = () => {
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
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
    setFormError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setFormError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    const result = await register(
      formData.email,
      formData.password,
      formData.fullName,
      formData.phone
    );

    if (result.success) {
      navigate('/bookings', { replace: true });
    } else {
      setFormError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <div className="text-sm font-bold text-blue-700">
            <span className="mr-1">✈️</span>
            Skyline Operations
          </div>
          <nav className="hidden gap-5 text-sm text-slate-500 md:flex">
            <a href="#registration" className="text-blue-700">Registration</a>
            <a href="#help">Help</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-5xl font-bold text-slate-900">Create Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-bold tracking-wide text-slate-700">EMAIL ADDRESS</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="username@gmail.com"
                disabled={isLoading}
                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label htmlFor="fullName" className="mb-2 block text-xs font-bold tracking-wide text-slate-700">FULL NAME</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={isLoading}
                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>


            <div>
              <label htmlFor="phone" className="mb-2 block text-xs font-bold tracking-wide text-slate-700">PHONE NUMBER</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+84 000-000-0000"
                disabled={isLoading}
                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-bold tracking-wide text-slate-700">PASSWORD</label>
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

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-xs font-bold tracking-wide text-slate-700">CONFIRM PASSWORD</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {(formError || error) && (
              <div className="rounded-md border-l-4 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError || error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 h-11 w-full rounded-md bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 border-t border-slate-200 pt-4 text-center text-sm text-slate-500">
            <p>
              Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
