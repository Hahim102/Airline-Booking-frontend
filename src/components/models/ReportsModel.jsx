import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FileText, Download, Filter, Calendar } from 'lucide-react';
import { CHART_DATA } from '../../constants';

export default function ReportsModel({ onClose }) {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-2xl border border-outline-variant">
                <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-primary" />
                    <span className="text-sm font-bold text-on-surface">Period: Oct 2024</span>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-outline-variant">
                        <Filter size={18} className="text-outline" />
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-outline-variant">
                        <Download size={18} className="text-outline" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Performance Overview</h4>
                <div className="h-64 w-full bg-white rounded-2xl border border-outline-variant p-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={CHART_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                            <Tooltip
                                cursor={{ fill: '#f8f9fa' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="value" fill="#003874" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant">
                    <h5 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-3">Key Insights</h5>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span className="text-on-surface">Revenue grew by 12% compared to last month.</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span className="text-on-surface">Operational costs reduced by 4% through efficient scheduling.</span>
                        </li>
                    </ul>
                </div>
                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col justify-center items-center text-center">
                    <FileText size={32} className="text-primary mb-2 opacity-50" />
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">Full report ready</p>
                    <button className="mt-3 text-sm font-bold text-primary hover:underline">Download PDF (2.4MB)</button>
                </div>
            </div>

            <div className="pt-6 border-t border-outline-variant flex justify-center">
                <button
                    onClick={onClose}
                    className="px-10 py-3 bg-surface border border-outline-variant text-on-surface rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-surface-container transition-all"
                >
                    Finish Viewing
                </button>
            </div>
        </div>
    );
}
