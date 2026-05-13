import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import { AuthValidation } from "../validation";

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setFormError("");
        setSuccessMessage("");

        if (!otp.trim()) {
            setFormError("OTP is required.");
            return;
        }

        if (otp.length !== 6) {
            setFormError("OTP must be 6 digits.");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setFormError("OTP must contain only digits.");
            return;
        }

        try {
            setIsLoading(true);
            // Call new endpoint to confirm/verify OTP
            await authService.confirmResetPassword(email, otp);
            
            setOtpVerified(true);
            setSuccessMessage("OTP verified successfully. Please enter your new password.");
        } catch (err) {
            setFormError(
                err.response?.data?.message ||
                "Invalid OTP. Please try again."
            );
            setOtp("");
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
                otp,
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
            const errorMsg = err.response?.data?.message || "Password reset failed. Please try again.";
            setFormError(errorMsg);
            
            // If OTP expired or not verified, allow user to verify OTP again
            if (errorMsg.toLowerCase().includes("otp") || errorMsg.toLowerCase().includes("expired")) {
                setOtpVerified(false);
                setOtp("");
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
                        <div className="mb-5">
                            <label
                                htmlFor="otp"
                                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700"
                            >
                                OTP CODE
                            </label>
                            <input
                                type="text"
                                id="otp"
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                value={otp}
                                disabled={isLoading}
                                onChange={(e) =>
                                    setOtp(e.target.value.replace(/\D/g, ""))
                                }
                                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Enter the 6-digit code sent to your email
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="h-11 w-full rounded-md bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? "Verifying..." : "Verify OTP"}
                        </button>
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
                            <input
                                type="password"
                                id="newPassword"
                                placeholder="••••••••"
                                value={newPassword}
                                disabled={isLoading}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                            />
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
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="••••••••"
                                value={confirmPassword}
                                disabled={isLoading}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                            />
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
        </div>
    );
};