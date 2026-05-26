import { Search, Lock } from 'lucide-react';

export default function OwnerCrewStatus({ crew }) {
    return (
        <div className="lg:col-span-4 bg-white rounded-2xl border border-outline-variant custom-shadow p-6 flex flex-col">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-primary">Crew Status</h3>
                    <p className="text-xs text-outline font-semibold">Availability & Assignments</p>
                </div>
                <button className="text-primary p-2 hover:bg-surface rounded-lg transition-colors"><Search size={18} /></button>
            </div>
            <div className="space-y-6 flex-1">
                {crew.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
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
    );
}
