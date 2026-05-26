import { Plane, Radio, Wallet, Users, TrendingUp } from 'lucide-react';

const ICON_MAP = {
    Plane: Plane,
    Radio: Radio,
    Wallet: Wallet,
    Users: Users
};

export default function OwnerMetricsCards({ metrics }) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, idx) => {
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
    );
}
