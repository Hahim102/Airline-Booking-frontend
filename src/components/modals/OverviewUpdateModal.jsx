import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { CHART_DATA } from '../../constants';
import { Bell, RefreshCw, Zap } from 'lucide-react';

export default function OverviewUpdateModal({ onClose }) {
    return (
        <div className="space-y-8">
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                    <Zap size={20} className="text-primary" />
                    <h4 className="font-bold text-primary">System Refresh</h4>
                </div>
                <p className="text-sm text-outline-variant leading-relaxed">
                    The dashboard overview is currently synced with global operations. You can manually force a cache refresh or adjust the visualization parameters below.
                </p>
            </div>

            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Active Visualization</h4>
                <div className="h-48 w-full bg-surface-container-low rounded-2xl border border-outline-variant p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={CHART_DATA}>
                            <Line type="monotone" dataKey="value" stroke="#003874" strokeWidth={3} dot={{ fill: '#003874', strokeWidth: 2, r: 4 }} />
                            <XAxis dataKey="name" hide />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#003874', fontWeight: 'bold' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center gap-3 p-6 bg-surface-container-low border border-outline-variant rounded-2xl hover:border-primary/40 transition-all group">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-outline group-hover:text-primary transition-colors">
                        <RefreshCw size={24} />
                    </div>
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Sync Data</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-3 p-6 bg-surface-container-low border border-outline-variant rounded-2xl hover:border-primary/40 transition-all group">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-outline group-hover:text-primary transition-colors">
                        <Bell size={24} />
                    </div>
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Alert Config</span>
                </button>
            </div>

            <div className="pt-6 border-t border-outline-variant flex justify-center">
                <button
                    onClick={onClose}
                    className="px-10 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all custom-shadow"
                >
                    Close Overview Manager
                </button>
            </div>
        </div>
    );
}
