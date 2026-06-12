import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import { AuthValidation } from "../validation";
import { Eye, EyeOff } from 'lucide-react';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef([]);

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
        if (!otpVerified && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [otpVerified]);

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

    const handleResend = async () => {
        if (!canResend) return;

        setCanResend(false);
        setCountdown(RESEND_COOLDOWN);
        setFormError('');
        setOtp(new Array(OTP_LENGTH).fill(''));

        try {
            await authService.resendForgotPasswordOtp(email);
            setSuccessMessage('A new OTP has been sent to your email.');
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (err) {
            setFormError(err?.message || 'Unable to resend OTP. Please try again.');
        }

        inputRefs.current[0]?.focus();
    };

    const formatCountdown = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== OTP_LENGTH) {
            setFormError("Please enter the full 6-digit OTP code.");
            return;
        }

        setFormError("");
        setSuccessMessage("");

        try {
            setIsLoading(true);
            await authService.confirmResetPassword(email, otpCode);
            
            setOtpVerified(true);
            setSuccessMessage("OTP verified successfully. Please enter your new password.");
        } catch (err) {
            console.error("Confirm reset password error:", err?.message || err);

            setFormError(
                err?.message ||
                "Invalid OTP. Please try again."
            );

            setOtp(new Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setFormError("");
        setSuccessMessage("");

        const passwordError = AuthValidation.password(newPassword);
        if (passwordError) {
            setFormError(passwordError);
            return;
        }

        const confirmError = AuthValidation.confirmPassword(newPassword, confirmPassword);
        if (confirmError) {
            setFormError(confirmError);
            return;
        }

        try {
            setIsLoading(true);
            await authService.resetPassword(
                email,
                newPassword
            );

            setSuccessMessage("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                navigate("/login", {
                    replace: true,
                    state: {
                        successMessage: "Password changed successfully. Please log in with your new password.",
                    },
                });
            }, 2000);
        } catch (err) {
            console.error("Reset password error:", err?.message || err);

            const errorMsg =
                err?.message ||
                "Password reset failed. Please try again.";
                
            setFormError(errorMsg);
            
            if (errorMsg.toLowerCase().includes("otp") || errorMsg.toLowerCase().includes("expired")) {
                setOtpVerified(false);
                setOtp(new Array(OTP_LENGTH).fill(''));
                setNewPassword("");
                setConfirmPassword("");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
                <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                    <h1 className="mb-2 text-sm font-bold text-blue-700">
                        ✈️ Airline Booking
                    </h1>
                    <p className="mb-5 text-sm text-slate-600">
                        Email not found. Please go back to the forgot password page.
                    </p>
                    <button
                        onClick={() => navigate("/forgot-password")}
                        className="h-11 w-full rounded-md bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="mb-2 text-center text-sm font-bold text-blue-700">
                    ✈️ Airline Booking
                </h1>
                <h2 className="mb-2 text-center text-4xl font-bold text-slate-900">
                    {otpVerified ? "Set New Password" : "Verify OTP"}
                </h2>
                <p className="mb-7 text-center text-sm text-slate-500">
                    {otpVerified 
                        ? "Please enter and confirm your new password"
                        : `OTP has been sent to ${email}`}
                </p>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-5 rounded-md border-l-4 border-green-500 bg-green-50 px-3 py-2 text-sm text-green-700 flex items-center gap-2">
                        <span className="text-lg">✓</span>
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {formError && (
                    <div className="mb-5 rounded-md border-l-4 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700 flex items-center gap-2">
                        <span className="text-lg">✕</span>
                        {formError}
                    </div>
                )}

                {/* Step 1: OTP Verification */}
                {!otpVerified ? (
                    <form onSubmit={handleVerifyOtp}>
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

                        <button
                            type="submit"
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
                                        type="button"
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
                    </form>
                ) : (
                    /* Step 2: Reset Password */
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-5">
                            <label
                                htmlFor="newPassword"
                                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700"
                            >
                                NEW PASSWORD
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    disabled={isLoading}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="h-11 w-full rounded-md border border-slate-300 px-3 pr-10 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    disabled={isLoading}
                                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                                    title={showNewPassword ? "Hide password" : "Show password"}
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                At least 8 characters with uppercase, lowercase, number, and special character
                            </p>
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700"
                            >
                                CONFIRM PASSWORD
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    disabled={isLoading}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-11 w-full rounded-md border border-slate-300 px-3 pr-10 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
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
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="h-11 w-full rounded-md bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? "Resetting password..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <div className="mt-6 border-t border-slate-200 pt-4 text-center text-sm text-slate-500">
                    <span
                        onClick={() => navigate("/login")}
                        className="cursor-pointer font-medium text-blue-600 hover:underline"
                    >
                        ← Back to Login
                    </span>
                </div>
            </div>

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