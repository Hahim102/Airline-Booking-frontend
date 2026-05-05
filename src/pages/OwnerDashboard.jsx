import { motion } from 'motion/react';
import { Plane, Radio, Wallet, Users, TrendingUp, MoreVertical, Plus, ChevronLeft, ChevronRight, Ticket, Lock, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { FLEET_DATA, OWNER_METRICS, SCHEDULING_DATA, CREW_DATA, CHART_DATA } from '../constants';
import { useAuth } from '../hooks/useAuth';

const ICON_MAP = {
    Plane: Plane,
    Radio: Radio,
    Wallet: Wallet,
    Users: Users
};

export default function OwnerDashboard() {
    const { user } = useAuth();

    // TODO: Replace OWNER_METRICS with real data from user/API when available
    // const ownerMetrics = user?.metrics || OWNER_METRICS;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {OWNER_METRICS.map((metric, idx) => {
                    const Icon = ICON_MAP[metric.icon];
                    return (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-outline-variant custom-shadow flex flex-col justify-between h-36 hover:scale-[1.02] transition-transform">
                            <div className="flex justify-between items-start">
                                <span className="text-outline text-[10px] font-bold uppercase tracking-widest">{metric.label}</span>
                                <div className="p-2 bg-surface-container-highest rounded-lg">
                                    <Icon size={20} className="text-primary" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-on-surface">{metric.value}</p>
                                {metric.change && (
                                    <div className={`flex items-center gap-1 text-[11px] font-bold ${metric.changeType === 'positive' ? 'text-green-600' : 'text-outline'}`}>
                                        {metric.trend === 'up' && <TrendingUp size={12} />}
                                        <span>{metric.change}</span>
                                    </div>
                                )}
                                {metric.label === 'Occupancy Rate' && (
                                    <div className="w-full bg-surface-container-low h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-primary h-full w-[88%] rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Fleet & Revenue */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant custom-shadow overflow-hidden">
                    <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                        <div>
                            <h3 className="text-lg font-bold text-primary">Fleet Management</h3>
                            <p className="text-xs text-outline mt-1 font-medium">Operational status of active aircraft.</p>
                        </div>
                        <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 shadow-sm transition-all">
                            <Plus size={16} />
                            Add Aircraft
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container-low/50 text-outline text-[10px] font-bold uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Tail Number</th>
                                    <th className="px-6 py-4">Model</th>
                                    <th className="px-6 py-4">Capacity</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/30">
                                {FLEET_DATA.map((aircraft, idx) => (
                                    <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-on-surface">{aircraft.tailNumber}</td>
                                        <td className="px-6 py-4 text-sm text-outline-variant font-medium">{aircraft.model}</td>
                                        <td className="px-6 py-4 text-sm text-outline-variant font-medium">{aircraft.capacity}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${aircraft.status === 'Active'
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {aircraft.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-outline-variant hover:text-primary transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-outline-variant custom-shadow p-6 flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-primary">Revenue Trend</h3>
                        <p className="text-xs text-outline font-medium">Weekly financial performance</p>
                    </div>
                    <div className="flex-1 min-h-[160px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CHART_DATA}>
                                <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                                    {CHART_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 2 || index === 5 ? '#003874' : '#dce9ff'} />
                                    ))}
                                </Bar>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#737782' }} dy={10} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 pt-6 border-t border-outline-variant flex justify-between items-center text-sm font-medium">
                        <span className="text-outline">Average/Flight</span>
                        <span className="text-primary font-bold">$12,450</span>
                    </div>
                </div>
            </section>

            {/* Scheduling & Crew */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-primary">Active Scheduling</h3>
                        <div className="flex gap-2">
                            <button className="p-2 border border-outline-variant rounded-lg hover:bg-white transition-colors"><ChevronLeft size={18} /></button>
                            <button className="p-2 border border-outline-variant rounded-lg hover:bg-white transition-colors"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {SCHEDULING_DATA.map((flight, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-outline-variant custom-shadow flex flex-wrap md:flex-nowrap items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-container/10 rounded-xl flex items-center justify-center">
                                        <Ticket size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-on-surface">{flight.id} | {flight.routeFrom} to {flight.routeTo}</h4>
                                        <p className="text-xs text-outline font-medium">{flight.dateTime}</p>
                                    </div>
                                </div>
                                <div className="flex-1 flex items-center gap-8 px-8 border-x border-outline-variant/30 justify-center min-w-[240px]">
                                    <div className="text-center">
                                        <p className="text-[10px] text-outline font-bold uppercase tracking-wider mb-1">Status</p>
                                        <span className={`text-xs font-bold ${flight.status === 'Boarding' ? 'text-primary' : 'text-outline'}`}>{flight.status.toUpperCase()}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 w-32 relative">
                                        <div className="w-full flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${flight.status === 'Boarding' ? 'bg-primary' : 'bg-outline-variant'}`}></div>
                                            <div className="flex-1 border-t-2 border-dashed border-outline-variant/50"></div>
                                            <Plane size={14} className={flight.status === 'Boarding' ? 'text-primary' : 'text-outline-variant'} />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-outline font-bold uppercase tracking-wider mb-1">Aircraft</p>
                                        <p className="text-xs font-bold text-on-surface">{flight.aircraft}</p>
                                    </div>
                                </div>
                                <button className="text-primary font-bold text-sm hover:underline">Manage</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 bg-white rounded-2xl border border-outline-variant custom-shadow p-6 flex flex-col">
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-primary">Crew Status</h3>
                            <p className="text-xs text-outline font-semibold">Availability & Assignments</p>
                        </div>
                        <button className="text-primary p-2 hover:bg-surface rounded-lg transition-colors"><Search size={18} /></button>
                    </div>
                    <div className="space-y-6 flex-1">
                        {CREW_DATA.map((member, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
                                    <div>
                                        <p className="text-sm font-bold text-on-surface">{member.name}</p>
                                        <p className={`text-[10px] font-bold ${member.status === 'AVAILABLE' ? 'text-green-600' : 'text-primary'}`}>
                                            {member.status === 'AVAILABLE' ? 'AVAILABLE' : member.flightId ? `ON FLIGHT ${member.flightId}` : 'BUSY'}
                                        </p>
                                    </div>
                                </div>
                                {member.status === 'AVAILABLE' ? (
                                    <button className="text-[10px] font-bold text-primary px-3 py-1 border border-primary/20 rounded hover:bg-primary hover:text-white transition-all uppercase tracking-wider">Assign</button>
                                ) : (
                                    <Lock size={16} className="text-outline-variant" />
                                )}
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 bg-surface border border-outline-variant rounded-xl text-outline font-bold text-xs uppercase tracking-wider hover:bg-surface-container transition-colors">
                        View All Staff (248)
                    </button>
                </div>
            </section>
        </motion.div>
    );
}
