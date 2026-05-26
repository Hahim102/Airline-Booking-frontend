import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';

export default function OwnerRevenueChart({ chartData }) {
    return (
        <div className="bg-white rounded-2xl border border-outline-variant custom-shadow p-6 flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-primary">Revenue Trend</h3>
                <p className="text-xs text-outline font-medium">Weekly financial performance</p>
            </div>
            <div className="flex-1 min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 2 || index === 5 ? '#003874' : '#dce9ff'} />
                            ))}
                        </Bar>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#737782' }} dy={10} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-6 pt-6 border-t border-outline-variant flex justify-between items-center text-sm font-medium">
                <span className="text-outline">Average/Flight</span>
                <span className="text-primary font-bold">$12,450</span>
            </div>
        </div>
    );
}
