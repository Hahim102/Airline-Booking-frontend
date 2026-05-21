import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/roles';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuth();
  const [errors, setErrors] = useState({});

  const recaptchaRef = useRef(null);
  const widgetIdRef = useRef(null);
  

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorTimeout, setShowErrorTimeout] = useState(null);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state?.successMessage]);

  useEffect(() => {
    return () => {
      if (showErrorTimeout) {
        clearTimeout(showErrorTimeout);
      }
    };
  }, [showErrorTimeout]);

  useEffect(() => {
    window.onRecaptchaSuccess = (token) => {
      setRecaptchaToken(token);
      setFormError('');
    };

    window.onRecaptchaLoad = () => {
      setRecaptchaReady(true);
    };

    if (window.grecaptcha) {
      setRecaptchaReady(true);
    }
  }, []);

  useEffect(() => {
    if (
      recaptchaReady &&
      recaptchaRef.current &&
      window.grecaptcha
    ) {
      if (widgetIdRef.current === null) {
        widgetIdRef.current =
          window.grecaptcha.render(
            recaptchaRef.current,
            {
              sitekey: '6Ld7DuEsAAAAAKB1D4Ej69jbBZyqLFDbA7BpplZl',
              callback: window.onRecaptchaSuccess,
            }
          );
      }
    }
  }, [recaptchaReady]);

  const validateLogin = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!recaptchaToken) {
      newErrors.captchaToken = "Captcha is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
    if (showErrorTimeout) {
      clearTimeout(showErrorTimeout);
      setShowErrorTimeout(null);
    }

    if (name === "email" && !value.trim()) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required",
      }));
    }

    if (name === "password" && !value.trim()) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (showErrorTimeout) {
      clearTimeout(showErrorTimeout);
      setShowErrorTimeout(null);
    }

    if (!validateLogin()) return;

    const result = await login(
        formData.email,
        formData.password,
        recaptchaToken
      );

      if (result.success) {
        const userRole = result.user?.role;

        if (userRole?.includes(ROLES.SYSTEM_ADMIN)) {
          navigate("/manager");
        } else if (userRole?.includes(ROLES.AIRLINE_OWNER)) {
          navigate("/owner");
        } else {
          navigate("/user");
        }
        return
      }
        const errorMessage =
          result.message ||
          error ||
          "Login failed. Please try again.";

        setFormError(errorMessage);
        
        const timeoutId = setTimeout(() => {
          setFormError("");
          setShowErrorTimeout(null);
        }, 6000);
        setShowErrorTimeout(timeoutId);

        if (window.grecaptcha) {
          window.grecaptcha.reset(widgetIdRef.current);
        }

        setRecaptchaToken("");

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-sm font-bold text-blue-700">✈️ Airline Booking</h1>
        <h2 className="mb-7 text-center text-4xl font-bold text-slate-900">Sign In</h2>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-5 rounded-md border-l-4 border-green-500 bg-green-50 px-3 py-2 text-sm text-green-700 flex items-center gap-2">
            <span className="text-lg">✓</span>
            {successMessage}
          </div>
        )}

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
              className={`h-11 w-full rounded-md border px-3 text-sm outline-none transition
                ${errors.email
                  ? 'border-red-500 focus:ring-red-100'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email}
              </p>
            )}
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
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          {recaptchaReady && (
            <div className="mb-5 flex justify-center">
              <div ref={recaptchaRef} />
            </div>
          )}
          {errors.captchaToken && (
            <p className="mt-2 text-center text-sm text-red-500">
              {errors.captchaToken}
            </p>
          )}

        {/* Error Message - Prominent Display */}
        {(formError || error) && (
          <div className="mb-5 rounded-md border-l-4 border-red-500 bg-red-50 px-3 py-3 text-sm text-red-700 flex items-start gap-2 animate-pulse">
            <span className="text-lg font-bold mt-0.5">✕</span>
            <div>
              <p className="font-semibold">Login Failed</p>
              <p className="text-red-600 mt-1">{formError || error}</p>
            </div>
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
          <div className="mt-4 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="cursor-pointer font-medium text-blue-600 hover:underline"
            >
              Sign up
            </span>
          </div>
          <small className="block"><span
            onClick={() => navigate('/forgot-password')}
            className="font-medium text-blue-600 hover:underline cursor-pointer"
          >
            Forgot Password?
          </span></small>
        </div>
      </div>
    </div>
  );
};
