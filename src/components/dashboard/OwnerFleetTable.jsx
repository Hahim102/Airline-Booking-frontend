import { Plus, MoreVertical } from 'lucide-react';

export default function OwnerFleetTable({ fleet }) {
    return (
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
                            <th className="px-6 py-4">Modal</th>
                            <th className="px-6 py-4">Capacity</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30">
                        {fleet.map((aircraft, idx) => (
                            <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                                <td className="px-6 py-4 font-bold text-on-surface">{aircraft.tailNumber}</td>
                                <td className="px-6 py-4 text-sm text-outline-variant font-medium">{aircraft.modal}</td>
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
    );
}
