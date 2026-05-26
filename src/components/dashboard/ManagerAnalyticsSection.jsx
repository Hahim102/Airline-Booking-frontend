import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader } from 'lucide-react';

const COLORS = ['#003874', '#4f5a9a', '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#bfdbfe'];

function CustomTooltip({ active, payload, isExpanded }) {
    if (active && payload && payload[0]) {
        return (
            <div className={`${isExpanded ? 'p-3' : 'p-2'} rounded-lg border border-outline-variant shadow-lg bg-white`}>
                <p className={`font-bold text-primary ${isExpanded ? 'text-sm' : 'text-xs'}`}>{payload[0].payload.label}</p>
                <p className={`text-outline ${isExpanded ? 'text-xs' : 'text-xs'}`}>{payload[0].value} registrations</p>
            </div>
        );
    }
    return null;
}

function RegistrationCard({ type, data, onExpand }) {
    const total = data.reduce((sum, d) => sum + d.total, 0);
    const typeLabel = type === 'DAY' ? 'Daily' : type === 'WEEK' ? 'Weekly' : 'Monthly';

    if (!data || data.length === 0) {
        return (
            <div className="bg-surface-container-low rounded-xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow" onClick={onExpand}>
                <h4 className="text-sm font-bold text-primary mb-3 text-center">{typeLabel}</h4>
                <div className="flex items-center justify-center h-[200px] text-outline text-xs">No data</div>
            </div>
        );
    }

    return (
        <div key={type} className="bg-surface-container-low rounded-xl p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow" onClick={onExpand}>
            <h4 className="text-sm font-bold text-primary mb-3 text-center">{typeLabel}</h4>
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
        </div>
    );
}

export default function ManagerAnalyticsSection({ registrationsByType, analyticsLoading, exportType, onExportTypeChange }) {
    const [expandedType, setExpandedType] = useState(null);

    if (analyticsLoading) {
        return (
            <div className="relative z-0 bg-white rounded-2xl border border-outline-variant custom-shadow p-6 flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                    <Loader size={32} className="text-primary animate-spin" />
                    <p className="text-sm text-outline">Loading analytics...</p>
                </div>
            </div>
        );
    }

    const activeType = expandedType || exportType;

    if (activeType !== null) {
        const data = registrationsByType[activeType];
        const total = data.reduce((sum, d) => sum + d.total, 0);
        const typeLabel = activeType === 'DAY' ? 'Daily' : activeType === 'WEEK' ? 'Weekly' : 'Monthly';

        return (
            <div className="relative z-0 bg-white rounded-2xl border border-outline-variant custom-shadow p-6 flex flex-col">
                <div className="flex justify-between items-center w-full mb-6">
                    <h3 className="text-lg font-bold text-primary">{typeLabel} Registrations</h3>
                    <button
                        onClick={() => {
                            setExpandedType(null);
                            onExportTypeChange(null);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-variant border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all"
                    >
                        ← Back to Grid
                    </button>
                </div>
                <div className="flex items-center justify-center">
                    <div className="relative z-0 overflow-hidden" style={{ width: '100%', height: '400px' }}>
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
                                <Tooltip content={<CustomTooltip isExpanded />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="mt-8 w-full max-w-xs space-y-3 text-sm border-t border-outline-variant pt-4 mx-auto">
                    <div className="flex justify-between items-center">
                        <span className="text-outline font-medium">{typeLabel} Total Registrations</span>
                        <span className="font-bold text-primary text-lg">{total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-outline font-medium">Avg. per {activeType === 'DAY' ? 'Day' : activeType === 'WEEK' ? 'Week' : 'Month'}</span>
                        <span className="font-bold text-primary">{Math.round(total / data.length)}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative z-0 bg-white rounded-2xl border border-outline-variant custom-shadow p-6 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['DAY', 'WEEK', 'MONTH'].map((type) => (
                    <RegistrationCard
                        key={type}
                        type={type}
                        data={registrationsByType[type]}
                        onExpand={() => {
                            setExpandedType(type);
                            onExportTypeChange(type);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
