import { useState } from 'react';
import { motion } from 'motion/react';
import { Contact, Ticket, Armchair, Utensils, PlaneTakeoff, Lock, Smartphone, ChevronRight, RefreshCw, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Model from '../components/ui/Model';
import ProfileModel from '../components/models/ProfileModel';

export default function UserDashboard() {
    const [openModel, setOpenModel] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const userData = {
        name: user?.fullName || user?.name || "User Name",
        email: user?.email || "user@example.com",
        phone: user?.phone || "+1 234 567 890",
        passport: user?.passport || "ABC123456",
        memberSince: user?.createdAt ? new Date(user.createdAt).getFullYear() : 2021,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            {/* User Banner */}
            <section className="relative h-64 rounded-3xl overflow-hidden custom-shadow">
                <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsDxDzm6IqVuhi3r8qST2BqdC9cYrkvpLfiPbcIXVrfmxQE0LBRviTRxN7kHZIPrOGASlKvWi4nm31hVwFJ0xXtntjxHiKi5lW3WomrNb3Igq35qNpdJZwxr4EDntRQK16kLURvlpwIJ49idL_OAv3zoBv5DBqRpxOglH6G_z8xZsNA_xRND23s29L4oq18PLGfgk2SBxfPdFPmWWZnEn4IEis894RJPAEL-g2wZQFuRQYEcVYw0seUOAuk8sAplmp_TWlmIkfzmc"
                    alt="Flight Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
                        <div>
                            <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Member Since {userData.memberSince}</p>
                            <h1 className="text-4xl font-bold text-white tracking-tight">Welcome Back, {userData.name}</h1>
                        </div>
                        <button
                            onClick={() => navigate('/bookings')}
                            className="flex items-center gap-3 px-8 py-3.5 bg-white text-primary rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-surface transition-all custom-shadow"
                        >
                            <Ticket size={18} />
                            View My Bookings
                        </button>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Account Info */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-outline-variant custom-shadow overflow-hidden">
                    <div className="px-6 py-6 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Contact size={20} className="text-primary" />
                            <h3 className="text-lg font-bold text-primary">Account Information</h3>
                        </div>
                        <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Airline Booking Elite</span>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Full Name</label>
                            <p className="font-semibold text-on-surface">{userData.name}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Email Address</label>
                            <p className="font-semibold text-on-surface">{userData.email}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Phone Number</label>
                            <p className="font-semibold text-on-surface">{userData.phone}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Passport / ID</label>
                            <p className="font-semibold text-on-surface">{userData.passport}</p>
                        </div>
                    </div>
                    <div className="px-8 py-4 bg-surface-container-lowest border-t border-outline-variant flex justify-end">
                        <button onClick={() => setOpenModel('profile')} className="px-6 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all">
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Sidebar Cards */}
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
                        <button onClick={() => setOpenModel('profile')} className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm transition-all text-left flex items-center gap-3">
                            <RefreshCw size={18} />
                            Update Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative w-full h-48 rounded-3xl overflow-hidden custom-shadow group border border-outline-variant">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=1200"
                    alt="Banner"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-30"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-10">
                    <h4 className="text-2xl font-bold text-white mb-2 tracking-tight">Global Network Access</h4>
                    <p className="text-white/80 text-sm max-w-sm font-medium">Manage your operational preferences across 140+ destinations worldwide from your central dashboard.</p>
                </div>
                <div className="absolute top-0 right-0 w-2/3 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
            </div>

            {/* Profile Modal */}
            <Model isOpen={openModel === 'profile'} onClose={() => setOpenModel(null)} title="My SkyStream Profile">
                <ProfileModel onClose={() => setOpenModel(null)} />
            </Model>
        </motion.div>
    );
}
