import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthValidation } from "../validation";
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';


export const RegisterPage = () => {
  const { register, logout, isLoading, error } = useAuth();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const recaptchaRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [formError, setFormError] = useState('');

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
    if (recaptchaReady && recaptchaRef.current && window.grecaptcha) {
      if (!recaptchaRef.current.innerHTML.includes('iframe')) {
        window.grecaptcha.render(recaptchaRef.current, {
          sitekey: '6Ld7DuEsAAAAAKB1D4Ej69jbBZyqLFDbA7BpplZl',
          callback: 'onRecaptchaSuccess',
        });
      }
    }
  }, [recaptchaReady]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError('');

    let validationError = null;

    switch (name) {
      case 'email':
        validationError = AuthValidation.email(value);
        break;

      case 'fullName':
        validationError = AuthValidation.fullName(value);
        break;

      case 'phone':
        validationError = AuthValidation.phone(value);
        break;

      case 'password':
        validationError = AuthValidation.password(value);

        if (formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: AuthValidation.confirmPassword(
              value,
              formData.confirmPassword
            ),
          }));
        }
        break;

      case 'confirmPassword':
        validationError = AuthValidation.confirmPassword(
          formData.password,
          value
        );
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: validationError,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const newErrors = {};

    newErrors.email = AuthValidation.email(formData.email);
    newErrors.fullName = AuthValidation.fullName(formData.fullName);
    newErrors.phone = AuthValidation.phone(formData.phone);
    newErrors.password = AuthValidation.password(formData.password);

    newErrors.confirmPassword =
      AuthValidation.confirmPassword(
        formData.password,
        formData.confirmPassword
      );

    newErrors.captchaToken =
      AuthValidation.captchaToken(recaptchaToken);

    Object.keys(newErrors).forEach(
      key => newErrors[key] === null && delete newErrors[key]
    );

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (!recaptchaToken) {
      setFormError("Please complete the reCAPTCHA verification");
      return;
    }
    await logout({ server: false });

    const result = await register(
      formData.email,
      formData.password,
      formData.fullName,
      formData.phone,
      recaptchaToken
    );

    if (result.success) {
      navigate("/verify-otp", {
        replace: true,
        state: { email: formData.email },
      });
    } else {
      setFormError(result.message || "Registration failed");
      window.grecaptcha?.reset();
      setRecaptchaToken("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <div className="text-sm font-bold text-blue-700">
            <span className="mr-1">✈️</span>
            Airline Booking
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
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName}
                </p>
              )}
            </div>


            <div>
              <label htmlFor="phone" className="mb-2 block text-xs font-bold tracking-wide text-slate-700">PHONE NUMBER</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., 0912345678"
                disabled={isLoading}
                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-bold tracking-wide text-slate-700">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="h-11 w-full rounded-md border border-slate-300 px-3 pr-10 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-xs font-bold tracking-wide text-slate-700">CONFIRM PASSWORD</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="h-11 w-full rounded-md border border-slate-300 px-3 pr-10 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {recaptchaReady && (
              <div className="flex justify-center">
                <div ref={recaptchaRef} />
              </div>
            )}
            {errors.captchaToken && (
              <p className="mt-2 text-center text-sm text-red-500">
                {errors.captchaToken}
              </p>
            )}

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
