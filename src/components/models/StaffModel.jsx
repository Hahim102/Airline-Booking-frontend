import { CREW_DATA } from '../../constants';
import { UserPlus, Search, ShieldCheck } from 'lucide-react';

export default function StaffModel({ onClose }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                    <input
                        type="text"
                        placeholder="Search crew members..."
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-sm transition-all">
                    <UserPlus size={16} /> Hire
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CREW_DATA.map((member) => (
                    <div key={member.id} className="p-4 bg-white border border-outline-variant rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="relative">
                            <img src={member.avatar} className="w-14 h-14 rounded-2xl object-cover border border-outline-variant" alt={member.name} />
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${member.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-primary'}`} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-on-surface text-sm">{member.name}</h4>
                            <p className="text-[10px] font-bold text-outline uppercase tracking-wider">{member.role}</p>
                            <div className="mt-1 flex items-center gap-1.5">
                                <ShieldCheck size={12} className="text-primary" />
                                <span className="text-[10px] font-bold text-primary">Certified</span>
                            </div>
                        </div>
                        <button className="p-2 text-outline hover:text-primary transition-colors">
                            <Search size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t border-outline-variant flex justify-between items-center">
                <p className="text-xs text-outline font-bold">Showing 3 of 248 active staff</p>
                <button onClick={onClose} className="px-8 py-2.5 bg-surface border border-outline-variant text-on-surface rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-surface-container transition-all">
                    View All Roster
                </button>
            </div>
        </div>
    );
}
