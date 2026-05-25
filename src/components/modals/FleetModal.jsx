import { FLEET_DATA } from '../../constants';
import { Plane, Info, AlertCircle, Plus } from 'lucide-react';

export default function FleetModal({ onClose }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-outline font-bold uppercase tracking-widest">Active Fleet: {FLEET_DATA.length}</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm">
                    <Plus size={14} /> Register Aircraft
                </button>
            </div>

            <div className="space-y-4">
                {FLEET_DATA.map((aircraft, idx) => (
                    <div key={idx} className="p-5 bg-surface-container-low border border-outline-variant rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-outline-variant/30 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                <Plane size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-on-surface truncate max-w-[120px]">{aircraft.tailNumber}</h4>
                                <p className="text-xs text-outline font-medium">{aircraft.modal}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Status</p>
                                <div className="flex items-center gap-1.5 justify-end">
                                    <div className={`w-1.5 h-1.5 rounded-full ${aircraft.status === 'Active' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                                    <span className="text-xs font-bold">{aircraft.status}</span>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-outline-variant">
                                <Info size={18} className="text-outline" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-start gap-4">
                <AlertCircle className="text-blue-600 shrink-0" size={20} />
                <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                    Note: Maintenance logs are updated every 24 hours. Contact engineering for real-time sensor data updates.
                </p>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-outline hover:bg-surface-container-low">Minimize</button>
                <button className="px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-lg">Fleet Analysis</button>
            </div>
        </div>
    );
}
