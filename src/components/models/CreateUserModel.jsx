import { useState } from 'react';
import { UserPlus, Mail, Shield, User, X, CheckCircle, Phone, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUsers } from '../../hooks/useUsers';
import { AuthValidation } from '../../validation';

export default function CreateUserModel({ onClose }) {
    const { createUser, loading, error: hookError } = useUsers();
    const [successData, setSuccessData] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'ROLE_USER',
    });
    const [localError, setLocalError] = useState(null);

    const validate = () => {
        const newErrors = {};

        const fullNameErr = AuthValidation.fullName(formData.fullName);
        const emailErr = AuthValidation.email(formData.email);
        const phoneErr = AuthValidation.phone(formData.phone);

        if (fullNameErr) newErrors.fullName = fullNameErr;
        if (emailErr) newErrors.email = emailErr;
        if (phoneErr) newErrors.phone = phoneErr;

        setLocalError(Object.values(newErrors)[0] || null);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);

        const savedName = formData.fullName; 
        const savedEmail = formData.email;

        if (!validate()) return;

        try {
            const res = await createUser({
                fullName: savedName,
                email: savedEmail,
                phone: formData.phone,
                role: formData.role,
            });

            const generatedPassword =
                res?.data?.password ||
                "******";

            setSuccessData({
                name: savedName,
                email: savedEmail,
                password: generatedPassword,
            });

            setFormData({
                fullName: '',
                email: '',
                phone: '',
                role: 'ROLE_USER',
            });
        } catch (err) {
            const statusCode = err?.response?.status;
            const errorMessage = err?.response?.data?.message;

            if (statusCode === 403 || statusCode === 409) {
                setLocalError('Email address already exists. Please use a different email.');
            } else if (statusCode === 400) {
                setLocalError(errorMessage || 'Invalid data. Please check all fields.');
            } else {
                setLocalError(errorMessage || err?.message || 'Failed to create user');
            }
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        setLocalError(null);
    };

    if (successData) {
        return (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center"
                >
                    <CheckCircle size={32} />
                </motion.div>
                <div>
                    <h3 className="text-xl font-bold text-on-surface">Account Created Successfully! ✨</h3>
                    <p className="text-sm text-outline mt-2">User #{successData.name} has been registered and is ready to use.</p>
                </div>
                <div className="w-full bg-surface-container-low border border-outline-variant rounded-2xl p-6 space-y-4">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest text-center">Login Credentials</p>

                    <div className="space-y-3">
                        <div className="flex justify-start items-center gap-3 p-3 bg-white rounded-xl border border-outline-variant/30">
                            <span className="text-xs font-bold text-outline uppercase tracking-wider min-w-[70px]">Email</span>
                            <span className="text-sm font-semibold text-on-surface select-all">{successData.email}</span>
                        </div>
                        <div className="flex justify-start items-center gap-3 p-3 bg-white rounded-xl border border-outline-variant/30">
                            <span className="text-xs font-bold text-outline uppercase tracking-wider min-w-[70px]">Password</span>
                            <span className="text-sm font-mono font-semibold text-on-surface tracking-wider select-all">{successData.password}</span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <p className="text-[10px] text-outline text-center leading-relaxed">
                            Please share these credentials with the user securely.
                            They will be prompted to change their password upon first login.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={() => setSuccessData(null)}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                    >
                        Create Another User
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-surface border border-outline-variant text-on-surface rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-surface-container transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {(localError || hookError) && (
                <div className="p-4 bg-error-container border border-error rounded-xl flex items-start gap-3">
                    <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-error">{localError || hookError}</p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                            <input
                                required
                                type="text"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => handleChange("fullName", e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                            <input
                                required
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                        <input
                            required
                            type="tel"
                            placeholder="e.g., 0912345678"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                </div>


                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Access Role</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'User', value: 'ROLE_USER' },
                            { label: 'Admin', value: 'ROLE_SYSTEM_ADMIN' },
                            { label: 'Owner', value: 'ROLE_AIRLINE_OWNER' }
                        ].map((role) => (
                            <button
                                key={role.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, role: role.value })}
                                className={`py-2 px-3 rounded-xl border text-[10px] font-bold transition-all ${formData.role === role.value
                                    ? 'bg-primary text-white border-primary shadow-md'
                                    : 'bg-surface-container-low text-outline border-outline-variant hover:border-primary/50'
                                    }`}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>
                </div>


                <p className="text-[10px] text-outline mt-1">
                    Password will be auto-generated by system and sent to user.
                </p>
            </div>

            <div className="pt-6 border-t border-outline-variant flex justify-between items-center">
                <p className="text-[10px] font-bold text-outline max-w-[200px]">New accounts must be verified by the system administrator before first login.</p>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2.5 bg-surface border border-outline-variant text-on-surface rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-surface-container transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <UserPlus size={16} /> {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </div>
            </div>
        </form>
    );
}
