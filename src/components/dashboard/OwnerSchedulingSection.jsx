import { ChevronLeft, ChevronRight, Ticket, Plane } from 'lucide-react';

export default function OwnerSchedulingSection({ schedulingData }) {
    return (
        <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-primary">Active Scheduling</h3>
                <div className="flex gap-2">
                    <button className="p-2 border border-outline-variant rounded-lg hover:bg-white transition-colors"><ChevronLeft size={18} /></button>
                    <button className="p-2 border border-outline-variant rounded-lg hover:bg-white transition-colors"><ChevronRight size={18} /></button>
                </div>
            </div>
            <div className="space-y-4">
                {schedulingData.map((flight, idx) => (
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
    );
}
