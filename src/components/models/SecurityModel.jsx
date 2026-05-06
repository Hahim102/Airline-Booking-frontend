import { useState } from 'react';
import { ShieldCheck, Key, Smartphone, AlertTriangle } from 'lucide-react';
import { a } from 'motion/react-client';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/apiClient';

export default function SecurityModel({ onClose }) {
    const { user } = useAuth();
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });


    const handleUpdatePassword = async () => {
        try {
            if (passwords.new !== passwords.confirm) {
                alert("New password and confirmation do not match.");
                return;
            }
            if (passwords.new.length < 6) {
                alert("New password must be at least 6 characters long.");
                return;
            }

            await apiClient.put(
                `/auth/update-password?userId=${user?.id}`,
                {
                    currentPassword: passwords.current,
                    newPassword: passwords.new,
                }
            );
            alert("Password updated successfully!");

            onClose();
        } catch (error) {
            console.error("Change password error:", error);
            alert(error.response?.data?.message || "Failed to change password");
        }
    }

    return (
        <div className="space-y-8">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                <div className="space-y-1">
                    <p className="text-sm font-bold text-amber-900">Security Recommendation</p>
                    <p className="text-xs text-amber-700 leading-relaxed">It's been 90 days since your last password change. We recommend updating it for account safety.</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-outline-variant pb-2">
                    <Key size={18} className="text-primary" />
                    <h4 className="font-bold text-on-surface">Change Password</h4>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Current Password</label>
                        <input
                            type="password"
                            value={passwords.current}
                            onChange={(e) =>
                                setPasswords({ ...passwords, current: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">New Password</label>
                            <input
                                type="password"
                                value={passwords.new}
                                onChange={(e) =>
                                    setPasswords({ ...passwords, new: e.target.value })
                                }
                                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwords.confirm}
                                onChange={(e) =>
                                    setPasswords({ ...passwords, confirm: e.target.value })
                                }
                                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-outline-variant pb-2">
                    <Smartphone size={18} className="text-primary" />
                    <h4 className="font-bold text-on-surface">Two-Factor Authentication</h4>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container-low border border-outline-variant rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <ShieldCheck size={20} className="text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-on-surface">Mobile Auth App</p>
                            <p className="text-xs text-outline">Currently enabled for your account</p>
                        </div>
                    </div>
                    <button className="text-xs font-bold text-error uppercase tracking-wider hover:underline">Disable</button>
                </div>
            </div>

            <div className="pt-6 border-t border-outline-variant flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-outline hover:bg-surface-container-low"
                >
                    Close
                </button>

                <button
                    type="button"
                    onClick={handleUpdatePassword}
                    className="px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-lg"
                >
                    Update Security
                </button>
            </div>
        </div>
    );
}
