import { UserCheck, UserMinus, UserX, User } from 'lucide-react';

const ICON_MAP = {
    UserCheck: UserCheck,
    UserMinus: UserMinus,
    UserX: UserX,
    User: User
};

export default function ManagerMetricsCards({ summary, loading, error }) {
    if (loading) {
        return (
            <div className="col-span-full flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-lg text-outline">Loading metrics...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="col-span-full p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
                {error}
            </div>
        );
    }

    if (!summary) return null;

    const metrics = [
        { label: 'Total Users', value: summary.totalUsers, icon: 'User', color: 'blue' },
        { label: 'Active Users', value: summary.activeUsers, icon: 'UserCheck', color: 'emerald' },
        { label: 'Inactive Users', value: summary.inactiveUsers, icon: 'UserMinus', color: 'amber' },
        { label: 'Deleted Users', value: summary.deletedUsers, icon: 'UserX', color: 'rose' }
    ];

    return (
        <>
            {metrics.map((metric, idx) => {
                const Icon = ICON_MAP[metric.icon];
                const colorBg = idx === 0 ? 'bg-blue-50 text-blue-600' :
                    idx === 1 ? 'bg-orange-50 text-orange-600' :
                        idx === 2 ? 'bg-purple-50 text-purple-600' :
                            'bg-cyan-50 text-cyan-600';
                return (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-outline-variant custom-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${colorBg}`}>
                                <Icon size={20} />
                            </div>
                        </div>
                        <p className="text-outline text-[10px] font-bold uppercase tracking-widest">{metric.label}</p>
                        <h3 className="text-3xl font-bold text-primary mt-1">{metric.value}</h3>
                    </div>
                );
            })}
        </>
    );
}
