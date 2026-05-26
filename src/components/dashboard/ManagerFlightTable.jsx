import { ArrowRight, MoreHorizontal } from 'lucide-react';

export default function ManagerFlightTable({ flights }) {
    return (
        <div className="bg-white rounded-2xl border border-outline-variant custom-shadow flex flex-col overflow-hidden">
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
                        {flights.map((flight, idx) => (
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
    );
}
