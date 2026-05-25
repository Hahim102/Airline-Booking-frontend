import { motion } from 'motion/react';
import { UserCheck, UserMinus, UserX, User, TrendingUp, TrendingDown, ArrowRight, MoreHorizontal, Download, Plus, Search, UserPlus, Map, Edit, Shield, Loader } from 'lucide-react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { FLIGHT_MANAGEMENT_DATA, RECENT_BOOKINGS, USER_MANAGEMENT_DATA } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { analyticsService } from '../api/analyticsService';
import { ROLES } from '../utils/roles';
import { useState, useEffect } from 'react';
import ProfileModal from '../components/modals/ProfileModal';
import SecurityModal from '../components/modals/SecurityModal';
import CreateUserModal from '../components/modals/CreateUserModal';
import ExportReportModal from '../components/modals/ExportReportModal';
import Modal from '../components/ui/Modal';
import UserManagementModal from '../components/modals/UserManagementModal';

const ICON_MAP = {
    UserCheck: UserCheck,
    UserMinus: UserMinus,
    UserX: UserX,
    User: User
};

export default function ManagerDashboard() {
    const { user } = useAuth();
    const { users, loading, error, fetchUsers, updateUserStatus } = useUsers();
    const [selectedAdminProfile, setSelectedAdminProfile] = useState(null);
    const [togglingUserId, setTogglingUserId] = useState(null);
    const [openModal, setOpenModal] = useState(null);
    const [exportType, setExportType] = useState('DAY');
    const [selectedChartType, setSelectedChartType] = useState(null);
    const [summary, setSummary] = useState(null);
    const [registrationsByType, setRegistrationsByType] = useState({
        DAY: [],
        WEEK: [],
        MONTH: []
    });
    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    const [analyticsError, setAnalyticsError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setAnalyticsLoading(true);
            setAnalyticsError(null);
            try {
                const [summaryData, dayData, weekData, monthData] = await Promise.all([
                    analyticsService.getSummary(),
                    analyticsService.getRegistrations('DAY'),
                    analyticsService.getRegistrations('WEEK'),
                    analyticsService.getRegistrations('MONTH')
                ]);
                setSummary(summaryData);
                setRegistrationsByType({
                    DAY: dayData || [],
                    WEEK: weekData || [],
                    MONTH: monthData || []
                });
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
                setAnalyticsError('Failed to load analytics data');
            } finally {
                setAnalyticsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);


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
                            onClick={() => setOpenModal('profile')}
                            className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:opacity-90 transition-all flex items-center gap-2 uppercase tracking-wide"
                        >
                            <Edit size={14} /> Edit Profile
                        </button>
                        <button
                            onClick={() => setOpenModal('security')}
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
                </div>
                <div className="flex gap-3 items-center">
                    <select
                        value={exportType}
                        onChange={(e) => setExportType(e.target.value)}
                        className="text-[10px] font-bold text-on-surface bg-white border border-outline-variant rounded-lg px-3 py-2 uppercase tracking-widest hover:bg-surface-container-low transition-colors"
                    >
                        <option value="DAY">Daily Report</option>
                        <option value="WEEK">Weekly Report</option>
                        <option value="MONTH">Monthly Report</option>
                    </select>
                    <button 
                        onClick={() => setOpenModal('export')}
                        className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:opacity-90 transition-all custom-shadow flex items-center gap-2 uppercase tracking-wide"
                    >
                        <Download size={16} /> Export Report
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-outline-variant custom-shadow p-6 flex flex-col">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-primary mb-4">User Registrations</h3>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedChartType(selectedChartType === 'DAY' ? null : 'DAY')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-widest ${
                                selectedChartType === 'DAY'
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-container-low text-on-surface border border-outline-variant hover:bg-surface-container-highest'
                            }`}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => setSelectedChartType(selectedChartType === 'WEEK' ? null : 'WEEK')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-widest ${
                                selectedChartType === 'WEEK'
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-container-low text-on-surface border border-outline-variant hover:bg-surface-container-highest'
                            }`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setSelectedChartType(selectedChartType === 'MONTH' ? null : 'MONTH')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-widest ${
                                selectedChartType === 'MONTH'
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-container-low text-on-surface border border-outline-variant hover:bg-surface-container-highest'
                            }`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>

                {analyticsLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <Loader size={32} className="text-primary animate-spin" />
                            <p className="text-sm text-outline">Loading analytics...</p>
                        </div>
                    </div>
                ) : selectedChartType === 'DAY' || selectedChartType === 'WEEK' || selectedChartType === 'MONTH' ? (
                    <div className="flex flex-col items-center justify-center">
                        <div style={{ width: '100%', height: '400px' }}>
                            {(() => {
                                const data = registrationsByType[selectedChartType];
                                const total = data.reduce((sum, d) => sum + d.total, 0);
                                const typeLabel = selectedChartType === 'DAY' ? 'Daily' : selectedChartType === 'WEEK' ? 'Weekly' : 'Monthly';
                                const COLORS = ['#003874', '#4f5a9a', '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#bfdbfe'];
                                
                                const CustomTooltip = ({ active, payload }) => {
                                    if (active && payload && payload[0]) {
                                        return (
                                            <div className="bg-white p-3 rounded-lg border border-outline-variant shadow-lg">
                                                <p className="text-sm font-bold text-primary">{payload[0].payload.label}</p>
                                                <p className="text-xs text-outline">{payload[0].value} registrations</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                };

                                return (
                                    <>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={data}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={80}
                                                    outerRadius={120}
                                                    paddingAngle={2}
                                                    dataKey="total"
                                                    label={({ value, percent }) => `${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {data.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="mt-8 w-full max-w-xs space-y-3 text-sm border-t border-outline-variant pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-outline font-medium">{typeLabel} Total Registrations</span>
                                                <span className="font-bold text-primary text-lg">{total}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-outline font-medium">Avg. per {selectedChartType === 'DAY' ? 'Day' : selectedChartType === 'WEEK' ? 'Week' : 'Month'}</span>
                                                <span className="font-bold text-primary">{Math.round(total / data.length)}</span>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['DAY', 'WEEK', 'MONTH'].map((type) => {
                            const data = registrationsByType[type];
                            const total = data.reduce((sum, d) => sum + d.total, 0);
                            const typeLabel = type === 'DAY' ? 'Daily' : type === 'WEEK' ? 'Weekly' : 'Monthly';
                            const COLORS = ['#003874', '#4f5a9a', '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#bfdbfe'];
                            
                            const CustomTooltip = ({ active, payload }) => {
                                if (active && payload && payload[0]) {
                                    return (
                                        <div className="bg-white p-2 rounded-lg border border-outline-variant shadow-lg">
                                            <p className="text-xs font-bold text-primary">{payload[0].payload.label}</p>
                                            <p className="text-xs text-outline">{payload[0].value} registrations</p>
                                        </div>
                                    );
                                }
                                return null;
                            };

                            return (
                                <div key={type} className="bg-surface-container-low rounded-xl p-4 flex flex-col">
                                    <h4 className="text-sm font-bold text-primary mb-3 text-center">{typeLabel}</h4>
                                    {data && data.length > 0 ? (
                                        <div className="flex-1 flex flex-col items-center">
                                            <div style={{ width: '100%', height: '200px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={data}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={40}
                                                            outerRadius={65}
                                                            paddingAngle={2}
                                                            dataKey="total"
                                                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                                        >
                                                            {data.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<CustomTooltip />} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="mt-4 w-full space-y-2 text-[11px] border-t border-outline-variant/50 pt-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-outline">Total</span>
                                                    <span className="font-bold text-primary">{total}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-outline">Avg.</span>
                                                    <span className="font-bold text-primary">{Math.round(total / data.length)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-[200px] text-outline text-xs">
                                            No data
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {analyticsLoading ? (
                    <div className="col-span-full flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <Loader size={32} className="text-primary animate-spin" />
                            <p className="text-sm text-outline">Loading analytics...</p>
                        </div>
                    </div>
                ) : analyticsError ? (
                    <div className="col-span-full p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
                        {analyticsError}
                    </div>
                ) : summary ? (
                    <>
                        {[
                            { label: 'Total Users', value: summary.totalUsers, icon: 'User', color: 'blue' },
                            { label: 'Active Users', value: summary.activeUsers, icon: 'UserCheck', color: 'emerald' },
                            { label: 'Inactive Users', value: summary.inactiveUsers, icon: 'UserMinus', color: 'amber' },
                            { label: 'Deleted Users', value: summary.deletedUsers, icon: 'UserX', color: 'rose' }
                        ].map((metric, idx) => {
                            const Icon = ICON_MAP[metric.icon];
                            const colorBg = idx === 0 ? 'bg-blue-50 text-blue-600' :
                                idx === 1 ? 'bg-orange-50 text-orange-600' :
                                    idx === 2 ? 'bg-purple-50 text-purple-600' :
                                        'bg-cyan-50 text-cyan-600';
                            return (
                                <div key={idx} className="bg-white p-6 rounded-2xl border border-outline-variant custom-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg ${colorBg}`}>
                                            <Icon size={20} />
                                        </div>
                                    </div>
                                    <p className="text-outline text-[10px] font-bold uppercase tracking-widest">{metric.label}</p>
                                    <h3 className="text-3xl font-bold text-primary mt-1">{metric.value}</h3>
                                </div>
                            );
                        })}
                    </>
                ) : null}
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

                <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-outline-variant custom-shadow overflow-hidden">
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
                                    src={selectedAdminProfile.avatarUrl}
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
            <Modal isOpen={openModal === 'profile'} onClose={() => setOpenModal(null)} title="Edit Admin Profile">
                <ProfileModal onClose={() => setOpenModal(null)} />
            </Modal>

            {/* Admin Security/Password Modal */}
            <Modal isOpen={openModal === 'security'} onClose={() => setOpenModal(null)} title="Change Password">
                <SecurityModal onClose={() => setOpenModal(null)} />
            </Modal>

            {/* Create User Modal */}
            <Modal isOpen={openModal === 'createUser'} onClose={() => setOpenModal(null)} title="Create New User">
                <CreateUserModal onClose={() => setOpenModal(null)} />
            </Modal>

            {/* Export Report Modal */}
            <Modal isOpen={openModal === 'export'} onClose={() => setOpenModal(null)} title="Export Report">
                <ExportReportModal 
                    exportType="analytics"
                    analyticsType={exportType}
                    onClose={() => setOpenModal(null)} 
                />
            </Modal>
        </motion.div>
    );
}