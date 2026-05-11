import { motion } from 'motion/react';
import { Plane, Clock, Ticket, User, TrendingUp, TrendingDown, ArrowRight, MoreHorizontal, Download, Plus, Search, UserPlus, Map, Edit, Shield } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from 'recharts';
import { MANAGER_METRICS, FLIGHT_MANAGEMENT_DATA, RECENT_BOOKINGS, USER_MANAGEMENT_DATA, CHART_DATA } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { ROLES } from '../utils/roles';
import { useState, useEffect } from 'react';
import ProfileModel from '../components/models/ProfileModel';
import SecurityModel from '../components/models/SecurityModel';
import CreateUserModel from '../components/models/CreateUserModel';
import Model from '../components/ui/Model';
import UserManagementModel from '../components/models/UserManagementModel';

const ICON_MAP = {
    Plane: Plane,
    Clock: Clock,
    Ticket: Ticket,
    User: User
};

export default function ManagerDashboard() {
    const { user } = useAuth();
    const { users, loading, error, fetchUsers, updateUserStatus } = useUsers();
    const [selectedAdminProfile, setSelectedAdminProfile] = useState(null);
    const [togglingUserId, setTogglingUserId] = useState(null);
    const [openModel, setOpenModel] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const adminUsers = users.filter(u => u.role === ROLES.SYSTEM_ADMIN);

    const handleToggleActive = async (userId, currentStatus) => {
        try {
            setTogglingUserId(userId);
            await updateUserStatus(userId, !currentStatus);
        } catch (err) {
            console.error('Failed to toggle status:', err);
        } finally {
            setTogglingUserId(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Admin Profile Card */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src={user?.avatar}
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
                            onClick={() => setOpenModel('profile')}
                            className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:opacity-90 transition-all flex items-center gap-2 uppercase tracking-wide"
                        >
                            <Edit size={14} /> Edit Profile
                        </button>
                        <button
                            onClick={() => setOpenModel('security')}
                            className="px-4 py-2 text-xs font-bold text-primary bg-white border border-primary rounded-lg hover:bg-primary/5 transition-all flex items-center gap-2 uppercase tracking-wide"
                        >
                            <Shield size={14} /> Change Password
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-4xl font-bold text-primary tracking-tight">Operations Overview</h2>
                    <p className="text-outline font-medium">Real-time status of SkyStream's global fleet and bookings.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-xs font-bold text-outline bg-white border border-outline-variant rounded-lg hover:bg-surface transition-colors custom-shadow flex items-center gap-2 uppercase tracking-wide">
                        <Download size={16} /> Export Report
                    </button>
                    <button className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:opacity-90 transition-all custom-shadow flex items-center gap-2 uppercase tracking-wide">
                        <Plus size={16} /> Add New Flight
                    </button>
                </div>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MANAGER_METRICS.map((metric, idx) => {
                    const Icon = ICON_MAP[metric.icon];
                    return (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-outline-variant custom-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg ${idx === 0 ? 'bg-blue-50 text-blue-600' :
                                    idx === 1 ? 'bg-orange-50 text-orange-600' :
                                        idx === 2 ? 'bg-purple-50 text-purple-600' :
                                            'bg-cyan-50 text-cyan-600'
                                    }`}>
                                    <Icon size={20} />
                                </div>
                                <span className={`text-[10px] font-bold flex items-center gap-1 ${metric.changeType === 'positive' ? 'text-emerald-500' :
                                    metric.changeType === 'negative' ? 'text-rose-500' : 'text-outline'
                                    }`}>
                                    {metric.trend === 'up' ? <TrendingUp size={12} /> : metric.trend === 'down' ? <TrendingDown size={12} /> : null}
                                    {metric.change}
                                </span>
                            </div>
                            <p className="text-outline text-[10px] font-bold uppercase tracking-widest">{metric.label}</p>
                            <h3 className="text-3xl font-bold text-primary mt-1">{metric.value}</h3>
                        </div>
                    );
                })}
            </section>

            <div className="grid grid-cols-12 gap-6">
                {/* Flight Management Table */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-outline-variant custom-shadow flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                        <h3 className="text-lg font-bold text-primary">Flight Management</h3>
                        <select className="text-xs font-bold border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-1.5 outline-none bg-white">
                            <option>All Status</option>
                            <option>Scheduled</option>
                            <option>Delayed</option>
                            <option>Cancelled</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container-low/50 text-outline text-[10px] font-bold uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Flight ID</th>
                                    <th className="px-6 py-4">Route</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right pr-12">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/30 text-sm">
                                {FLIGHT_MANAGEMENT_DATA.map((flight, idx) => (
                                    <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-primary">{flight.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-medium text-on-surface">
                                                <span>{flight.routeFrom}</span>
                                                <ArrowRight size={14} className="text-outline-variant" />
                                                <span>{flight.routeTo}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-outline font-medium">{flight.dateTime}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${flight.status === 'Scheduled' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                flight.status === 'Delayed' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    'bg-rose-50 text-rose-700 border-rose-100'
                                                }`}>
                                                {flight.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-12">
                                            <button className="text-outline-variant hover:text-primary transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-outline-variant mt-auto text-center">
                        <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wide">View All Flights</button>
                    </div>
                </div>

                {/* Booking Trend Chart */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-outline-variant custom-shadow p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-primary">Booking Trend</h3>
                        <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Last 7 Days</span>
                    </div>
                    <div className="flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CHART_DATA}>
                                <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                                    {CHART_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 5 ? '#4f5a9a' : '#003874'} className="hover:fill-secondary cursor-pointer transition-colors" />
                                    ))}
                                </Bar>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#737782' }} dy={10} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-12 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-outline font-medium">Peak Day</span>
                            <span className="font-bold text-primary">Saturday</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-outline font-medium">Avg. Daily Bookings</span>
                            <span className="font-bold text-primary">6,130</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Recent Bookings */}
                <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl border border-outline-variant custom-shadow overflow-hidden">
                    <div className="p-6 border-b border-outline-variant bg-surface-container-low">
                        <h3 className="text-lg font-bold text-primary">Recent Bookings</h3>
                    </div>
                    <div className="divide-y divide-outline-variant/30">
                        {RECENT_BOOKINGS.map((booking) => (
                            <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold shadow-sm">
                                        {booking.userInitials}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-on-surface">{booking.userName}</p>
                                        <p className="text-[10px] text-outline font-medium">Flight: {booking.flightId} • {booking.tier}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${booking.status === 'CONFIRMED' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                                        booking.status === 'PENDING' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                                            'text-rose-600 bg-rose-50 border-rose-100'
                                        }`}>
                                        {booking.status}
                                    </span>
                                    <div className="flex gap-2">
                                        <button className="text-[10px] font-bold text-primary hover:bg-surface-container-high px-3 py-1.5 rounded transition-colors border border-outline-variant">Update</button>
                                        <button
                                            className={`text-[10px] font-bold px-3 py-1.5 rounded transition-colors border ${booking.status === 'REFUNDED' ? 'text-outline opacity-50 cursor-not-allowed border-outline-variant' : 'text-error hover:bg-error-container border-error/10'
                                                }`}
                                            disabled={booking.status === 'REFUNDED'}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Admin User Management */}
                <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl border border-outline-variant custom-shadow flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                        <h3 className="text-lg font-bold text-primary">Admin User Management</h3>
                        <button 
                            onClick={() => setOpenModel('createUser')}
                            className="text-outline hover:text-primary transition-colors focus:outline-none"
                        >
                            <UserPlus size={20} />
                        </button>
                    </div>
                    <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                        {loading && !adminUsers.length ? (
                            <p className="text-center text-outline">Loading admin users...</p>
                        ) : error ? (
                            <p className="text-center text-error text-sm">{error}</p>
                        ) : adminUsers.length === 0 ? (
                            <p className="text-center text-outline">No admin users found</p>
                        ) : (
                            adminUsers.map((admin) => (
                                <div key={admin.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={admin.avatar} className="w-10 h-10 rounded-full object-cover border border-outline-variant" alt={admin.name} />
                                        <div>
                                            <p className="text-sm font-bold text-on-surface">{admin.name}</p>
                                            <p className="text-[10px] text-outline font-semibold uppercase">{admin.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setSelectedAdminProfile(admin)}
                                            className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wide"
                                        >
                                            View Profile
                                        </button>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={admin.active}
                                                onChange={() => handleToggleActive(admin.id, admin.active)}
                                                disabled={togglingUserId === admin.id}
                                                className="sr-only peer"
                                            />
                                            <div className="w-8 h-4 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary opacity-60 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                                        </label>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-4 border-t border-outline-variant text-center">

                        <button
                            onClick={() => setOpenModel('admins')}
                            className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
                        >
                            See All Admin Users
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-2xl border border-outline-variant custom-shadow overflow-hidden">
                <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                    <h3 className="text-lg font-bold text-primary">Live Fleet Distribution</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-outline uppercase tracking-widest tracking-widest">Live Feed</span>
                    </div>
                </div>
                <div className="relative h-[300px] bg-sky-50 overflow-hidden">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1TjcloFCEssHaVQYF9o6iWqHNmrn73m0twKmNHchO0SNx2zD0SDjX6j2IZa2WahIrESGCGL_DN9oKga1O2pDhndyeC06qNAt2tKiUlYX4yC86MNG0XF2DWipGjGYEzDEvGE9xFV96b21zdlVaIQdkdf2uOdQ68b88V35LZ9hxa5wBYQ1qunTiQ_pR-j2Nuw0YMGLdlnv5GGvBlRwQECYBORTzkudjnLNhJ6G6ZIWdrIXLY4S8IL3jlXEQAseboFvor554XC7WC6Q"
                        className="w-full h-full object-cover grayscale opacity-50"
                        alt="Map"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="bg-white/90 backdrop-blur px-8 py-4 rounded-full border border-outline-variant custom-shadow flex items-center gap-4 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                            <Map size={24} className="text-primary" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wide">Interactive Map Offline - Monitoring Regional Statistics</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Profile Modal */}
            {selectedAdminProfile && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md custom-shadow overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                            <h3 className="text-lg font-bold text-primary">Admin Profile</h3>
                            <button
                                onClick={() => setSelectedAdminProfile(null)}
                                className="text-outline hover:text-primary transition-colors text-2xl leading-none"
                            >
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Avatar and Name */}
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={selectedAdminProfile.avatar}
                                    alt={selectedAdminProfile.name}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-primary/20 mb-4"
                                />
                                <h4 className="text-lg font-bold text-on-surface">{selectedAdminProfile.name}</h4>
                                <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">
                                    System Administrator
                                </p>
                            </div>

                            {/* Info */}
                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                {/* User ID */}
                                <div className="flex items-start gap-3">
                                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest min-w-[100px]">User ID</span>
                                    <span className="text-on-surface text-sm font-mono">{selectedAdminProfile.id}</span>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-3">
                                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest min-w-[100px]">Email</span>
                                    <span className="text-on-surface text-sm break-all">{selectedAdminProfile.email}</span>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-3">
                                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest min-w-[100px]">Phone</span>
                                    <span className="text-on-surface text-sm">{selectedAdminProfile.phone || 'N/A'}</span>
                                </div>

                                {/* Status */}
                                <div className="flex items-start gap-3">
                                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest min-w-[100px]">Status</span>
                                    <span className={`text-sm font-bold ${selectedAdminProfile.active ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {selectedAdminProfile.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                {/* Role */}
                                {selectedAdminProfile.role && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-[10px] uppercase tracking-widest min-w-[100px]">Role</span>
                                        <span className="text-on-surface text-sm">{selectedAdminProfile.role}</span>
                                    </div>
                                )}

                                {/* Created Date */}
                                {(selectedAdminProfile.createdAt || selectedAdminProfile.created_at) && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-[10px] uppercase tracking-widest min-w-[100px]">Created</span>
                                        <span className="text-on-surface text-sm">
                                            {new Date(selectedAdminProfile.createdAt || selectedAdminProfile.created_at).toLocaleDateString()} • {new Date(selectedAdminProfile.createdAt || selectedAdminProfile.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )}

                                {/* Updated Date */}
                                {(selectedAdminProfile.updatedAt || selectedAdminProfile.updated_at) && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-[10px] uppercase tracking-widest min-w-[100px]">Updated</span>
                                        <span className="text-on-surface text-sm">
                                            {new Date(selectedAdminProfile.updatedAt || selectedAdminProfile.updated_at).toLocaleDateString()} • {new Date(selectedAdminProfile.updatedAt || selectedAdminProfile.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )}

                                {/* Last Login */}
                                {selectedAdminProfile.lastLoginAt && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-[10px] uppercase tracking-widest min-w-[100px]">Last Login</span>
                                        <span className="text-on-surface text-sm">
                                            {new Date(selectedAdminProfile.lastLoginAt).toLocaleDateString()} • {new Date(selectedAdminProfile.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )}

                                {/* Full Name */}
                                {selectedAdminProfile.fullName && selectedAdminProfile.fullName !== selectedAdminProfile.name && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-[10px] uppercase tracking-widest min-w-[100px]">Full Name</span>
                                        <span className="text-on-surface text-sm">{selectedAdminProfile.fullName}</span>
                                    </div>
                                )}

                                {/* Deleted Status */}
                                {selectedAdminProfile.isDeleted !== undefined && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-primary font-bold text-[10px] uppercase tracking-widest min-w-[100px]">Deleted</span>
                                        <span className="text-on-surface text-sm">{selectedAdminProfile.isDeleted ? 'Yes' : 'No'}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-outline-variant bg-surface-container-low text-center">
                            <button
                                onClick={() => setSelectedAdminProfile(null)}
                                className="text-xs font-bold text-primary hover:bg-surface-container-highest px-4 py-2 rounded-lg transition-colors uppercase tracking-wide"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Profile Edit Modal */}
            <Model isOpen={openModel === 'profile'} onClose={() => setOpenModel(null)} title="Edit Admin Profile">
                <ProfileModel onClose={() => setOpenModel(null)} />
            </Model>

            {/* Admin Security/Password Modal */}
            <Model isOpen={openModel === 'security'} onClose={() => setOpenModel(null)} title="Change Password">
                <SecurityModel onClose={() => setOpenModel(null)} />
            </Model>

            {/* Create User Modal */}
            <Model isOpen={openModel === 'createUser'} onClose={() => setOpenModel(null)} title="Create New User">
                <CreateUserModel onClose={() => setOpenModel(null)} />
            </Model>

            {/* Admin Users Management Modal */}
            <Model isOpen={openModel === 'admins'} onClose={() => setOpenModel(null)} title="All Admin Users">
                <UserManagementModel onClose={() => setOpenModel(null)} filterRole={ROLES.SYSTEM_ADMIN} />
            </Model>
        </motion.div>
    );
}