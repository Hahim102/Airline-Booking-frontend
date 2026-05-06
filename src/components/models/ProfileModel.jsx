import { useState } from 'react';
import { Mail, Phone, MapPin, User, Save, IdCard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/apiClient';

export default function ProfileModel({ onClose }) {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        fullName: user?.fullName,
        email: user?.email || "user@example.com",
        phone: user?.phone || "+1 234 567 890",
        // passPort: user?.passport || "ABC123456",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("FORM DATA BEFORE SEND:", formData);
            const res = await apiClient.put(`/auth/update-profile?userId=${user?.id}`, formData);
            
            const updatedUser = res.data.user;

            console.log("Profile updated successfully:", updatedUser);

            setUser(updatedUser)
            onClose();
        }
        catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-8">
                <div className="h-24 w-24 rounded-3xl bg-primary/10 overflow-hidden border-4 border-white custom-shadow relative group">
                    <img
                        src={user?.avatar}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="text-white text-[10px] font-bold uppercase">Change</span>
                    </div>
                </div>
                <h4 className="mt-4 font-bold text-on-surface text-lg">{formData.fullName}</h4>
                <p className="text-xs text-outline font-bold uppercase tracking-widest">Premium Member</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                {/* <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Passpost</label>
                    <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                        <input
                            type="text"
                            value={formData.passport}
                            onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-medium"
                        />
                    </div>
                </div> */}
            </div>

            <div className="pt-6 border-t border-outline-variant flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-outline hover:bg-surface-container-low transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all custom-shadow flex items-center gap-2"
                >
                    <Save size={16} />
                    Save Changes
                </button>
            </div>
        </form>
    );
}
