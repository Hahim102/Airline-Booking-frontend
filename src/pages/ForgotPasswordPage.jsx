import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import { AuthValidation } from "../validation";

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setSuccessMessage("");

        if (!email.trim()) {
            setFormError("Email is required.");
            return;
        }

        const emailError = AuthValidation.email(email);
        if (emailError) {
            setFormError(emailError);
            return;
        }

        try {
            setIsLoading(true);
            await authService.forgotPassword(email);

            setSuccessMessage("OTP sent successfully! Redirecting to verification page...");
            
            setTimeout(() => {
                navigate("/reset-password", {
                    state: { email },
                });
            }, 2000);
        } catch (err) {
            console.error("Forgot password error:", err?.message || err);

            setFormError(
                err?.message ||
                "Unable to send OTP. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="mb-2 text-center text-sm font-bold text-blue-700">
                    ✈️ Airline Booking
                </h1>
                <h2 className="mb-2 text-center text-4xl font-bold text-slate-900">
                    Forgot Password
                </h2>
                <p className="mb-7 text-center text-sm text-slate-500">
                    Enter your email to receive an OTP for password reset.
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

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label
                            htmlFor="email"
                            className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700"
                        >
                            EMAIL
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="e.g., username@gmail.com"
                            value={email}
                            disabled={isLoading}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (formError) setFormError("");
                            }}
                            className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                            required
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            We'll send an OTP to verify your identity
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !email.trim()}
                        className="h-11 w-full rounded-md bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Sending..." : "Send OTP"}
                    </button>
                </form>

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