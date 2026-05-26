import { Edit, Shield } from 'lucide-react';

export default function ManagerAdminCard({ user, onEditClick, onSecurityClick }) {
    return (
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10 p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img
                        src={user?.avatarUrl}
                        alt={user?.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-primary/20"
                    />
                    <div>
                        <h3 className="text-xl font-bold text-primary">{user?.name}</h3>
                        <p className="text-sm text-outline">{user?.email}</p>
                        <p className="text-xs text-outline font-bold uppercase tracking-widest mt-1">System Administrator</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onEditClick}
                        className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:opacity-90 transition-all flex items-center gap-2 uppercase tracking-wide"
                    >
                        <Edit size={14} /> Edit Profile
                    </button>
                    <button
                        onClick={onSecurityClick}
                        className="px-4 py-2 text-xs font-bold text-primary bg-white border border-primary rounded-lg hover:bg-primary/5 transition-all flex items-center gap-2 uppercase tracking-wide"
                    >
                        <Shield size={14} /> Change Password
                    </button>
                </div>
            </div>
        </div>
    );
}
