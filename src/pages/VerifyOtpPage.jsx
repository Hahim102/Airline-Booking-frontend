import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../api/authService';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const purpose = location.state?.purpose || 'REGISTER';
  const pageMessage = location.state?.message || "";
  const autoSendOtp = location.state?.autoSendOtp || false;

  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const autoSentRef = useRef(false);

  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (!email || !autoSendOtp) return;
    if (autoSentRef.current) return;

    autoSentRef.current = true;

    const sendOtp = async () => {
      try {
        await authService.resendVerifyOtp(email);
        setSuccessMessage("OTP has been sent to your email.");
        setTimeout(() => setSuccessMessage(""), 4000);
      } catch (err) {
        setFormError(err?.message || "Unable to send OTP. Please try again.");
      }
    };

    sendOtp();
  }, [email, autoSendOtp]);

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    setFormError('');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const digits = pastedData.replace(/\D/g, '').slice(0, OTP_LENGTH);

    if (digits.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < OTP_LENGTH; i++) {
      newOtp[i] = digits[i] || '';
    }
    setOtp(newOtp);
    setFormError('');

    const nextEmptyIndex = newOtp.findIndex((v) => !v);
    const focusIndex = nextEmptyIndex === -1 ? OTP_LENGTH - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = useCallback(async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== OTP_LENGTH) {
      setFormError('Please enter the full 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setFormError('');

    try {
      const response = await authService.verifyOtp(email, otpCode);
      setIsVerified(true);
      setSuccessMessage('Verification successful! Redirecting...');

      setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: { successMessage: 'Account verified successfully. Please log in.' },
        });
      }, 2000);
    } catch (err) {
      console.error('OTP verification error:', err?.message || err);

      const errorMsg =
        err?.message ||
        'OTP verification failed. Please try again.';

      setFormError(errorMsg);
      setOtp(new Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  }, [otp, email, navigate]);

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setCountdown(RESEND_COOLDOWN);
    setFormError('');
    setOtp(new Array(OTP_LENGTH).fill(''));

    try {
      await authService.resendVerifyOtp(email);

      setSuccessMessage('A new OTP has been sent to your email.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setFormError(err?.message || 'Unable to resend OTP. Please try again.');
    }

    inputRefs.current[0]?.focus();
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c)
    : '';

  const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="text-sm font-bold text-blue-700">
            <span className="mr-1">✈️</span>
            Airline Booking
          </Link>
          <nav className="hidden gap-5 text-sm text-slate-500 md:flex">
            <span className="text-blue-700">Verify OTP</span>
            <a href="#help">Help</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div
            className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
            style={{
              animation: 'fadeInUp 0.5s ease-out',
            }}
          >
            {/* Icon */}
            <div className="mb-5 flex justify-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 ${isVerified
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-100 text-blue-600'
                  }`}
                style={{
                  animation: isVerified ? 'pulse 0.6s ease-in-out' : 'none',
                }}
              >
                {isVerified ? (
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="mb-2 text-center">
              <h1 className="text-2xl font-bold text-slate-900">
                {isVerified ? 'Verification Successful!' : 'Verify Your Email'}
              </h1>
            </div>

            {/* Description */}
            <p className="mb-6 text-center text-sm leading-relaxed text-slate-500">
              {isVerified ? (
                'Your account has been activated. Redirecting to login page...'
              ) : (
                <>
                  We have sent a 6-digit verification code to
                  <br />
                  <span className="font-semibold text-slate-700">
                    {maskedEmail}
                  </span>
                </>
              )}
            </p>

            {/* Page Message */}
            {pageMessage && !isVerified && (
              <div className="mb-4 rounded-md border-l-4 border-blue-500 bg-blue-50 px-3 py-2.5 text-sm text-blue-700">
                {pageMessage}. Please verify your email to continue.
              </div>
            )}

            {!isVerified && (
              <>
                {/* OTP Inputs */}
                <div className="mb-6 flex justify-center gap-2.5">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      disabled={isLoading}
                      className={`h-14 w-12 rounded-lg border-2 text-center text-xl font-bold outline-none transition-all duration-200
                        ${digit
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                          : formError
                            ? 'border-red-300 bg-red-50 text-red-700'
                            : 'border-slate-200 bg-slate-50 text-slate-900'
                        }
                        focus:border-blue-600 focus:bg-white focus:shadow-md focus:ring-2 focus:ring-blue-100
                        disabled:cursor-not-allowed disabled:opacity-50
                      `}
                      style={{
                        animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                      }}
                      id={`otp-input-${index}`}
                      aria-label={`OTP digit ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Error Message */}
                {formError && (
                  <div
                    className="mb-4 rounded-md border-l-4 border-red-500 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                    style={{ animation: 'shakeX 0.4s ease-in-out' }}
                  >
                    {formError}
                  </div>
                )}

                {/* Success Message */}
                {successMessage && !isVerified && (
                  <div className="mb-4 rounded-md border-l-4 border-green-500 bg-green-50 px-3 py-2.5 text-sm text-green-700">
                    {successMessage}
                  </div>
                )}

                {/* Verify Button */}
                <button
                  onClick={handleVerify}
                  disabled={isLoading || otp.join('').length !== OTP_LENGTH}
                  className="mb-4 h-11 w-full rounded-md bg-blue-600 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  id="verify-otp-button"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    'Verify OTP'
                  )}
                </button>

                {/* Resend Section */}
                <div className="text-center text-sm text-slate-500">
                  {canResend ? (
                    <p>
                      Didn't receive the code?{' '}
                      <button
                        onClick={handleResend}
                        className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                        id="resend-otp-button"
                      >
                        Resend OTP
                      </button>
                    </p>
                  ) : (
                    <p>
                      Resend code in{' '}
                      <span className="font-semibold text-blue-600">
                        {formatCountdown(countdown)}
                      </span>
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Links */}
          <div className="mt-5 text-center text-sm text-slate-500">
            <p>
              Back to{' '}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:underline"
              >
                Register
              </Link>
              {' '}or{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Inline Keyframe Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
