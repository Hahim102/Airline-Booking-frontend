import { Armchair, Utensils, PlaneTakeoff, Lock, RefreshCw, ChevronRight, Smartphone, Settings } from 'lucide-react';

export default function UserSidebarCards({ onEditClick }) {
    return (
        <div className="lg:col-span-4 space-y-8">
            {/* Preferences */}
            <div className="bg-white rounded-2xl border border-outline-variant custom-shadow overflow-hidden">
                <div className="px-4 py-4 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
                    <Settings size={18} className="text-primary" />
                    <h3 className="font-bold text-primary">Preferences</h3>
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant">
                        <div className="flex items-center gap-3">
                            <Armchair size={18} className="text-primary" />
                            <span className="text-sm">Seat</span>
                        </div>
                        <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-medium">Window</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant">
                        <div className="flex items-center gap-3">
                            <Utensils size={18} className="text-primary" />
                            <span className="text-sm">Meal</span>
                        </div>
                        <span className="px-3 py-1 bg-surface-container-highest text-primary font-medium text-xs rounded-full border border-primary/10">Vegetarian</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant">
                        <div className="flex items-center gap-3">
                            <PlaneTakeoff size={18} className="text-primary" />
                            <span className="text-sm">Favorite Hub</span>
                        </div>
                        <span className="font-bold text-primary">SFO</span>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl border border-outline-variant custom-shadow overflow-hidden">
                <div className="px-4 py-4 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
                    <Lock size={18} className="text-primary" />
                    <h3 className="font-bold text-primary">Security</h3>
                </div>
                <div className="p-4 space-y-3">
                    <button className="w-full py-3 px-4 flex items-center justify-between border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors group">
                        <div className="flex items-center gap-3">
                            <RefreshCw size={18} className="text-outline group-hover:text-primary transition-colors" />
                            <span className="text-sm">Change password</span>
                        </div>
                        <ChevronRight size={18} className="text-outline-variant" />
                    </button>
                    <div className="w-full py-3 px-4 flex items-center justify-between border border-dashed border-outline-variant rounded-xl bg-surface-container-low/50">
                        <div className="flex items-center gap-3 opacity-50">
                            <Smartphone size={18} />
                            <span className="text-sm">2FA status</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase text-outline tracking-wider bg-outline-variant/20 px-2 py-0.5 rounded">Coming soon</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-primary-container rounded-2xl text-on-primary-container flex flex-col gap-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-80">Quick Actions</h4>
                <button onClick={onEditClick} className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm transition-all text-left flex items-center gap-3">
                    <RefreshCw size={18} />
                    Update Profile
                </button>
            </div>
        </div>
    );
}
