import { useState, useEffect } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
    FileText,
    Download,
    Calendar,
    Loader,
    TrendingUp,
    TrendingDown,
    Minus,
    User,
    UserCheck,
    UserMinus,
    UserX
} from 'lucide-react';
import { analyticsService } from '../../api/analyticsService';
import { reportService, downloadFile } from '../../api/reportService';
import ExportReportModal from './ExportReportModal';
import Modal from '../ui/Modal';

export default function ReportsModal({ onClose }) {
    const [analyticsType, setAnalyticsType] = useState('DAY');
    const [registrations, setRegistrations] = useState([]);
    const [summary, setSummary] = useState(null);
    const [openModal, setOpenModal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setError(null);
            try {
                const [summaryData, registrationsData] = await Promise.all([
                    analyticsService.getSummary(),
                    analyticsService.getRegistrations(analyticsType)
                ]);
                setSummary(summaryData);
                setRegistrations(registrationsData || []);
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
                setError('Failed to load analytics data');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [analyticsType]);

    const handleExport = async (format) => {
        setExporting(true);
        setError(null);

        try {
            const blob =
                format === 'excel'
                    ? await reportService.exportAnalyticsExcel(analyticsType)
                    : await reportService.exportAnalyticsPdf(analyticsType);

            const ext = format === 'excel' ? 'xlsx' : 'pdf';

            downloadFile(
                blob,
                `user-analytics-${analyticsType.toLowerCase()}.${ext}`
            );
        } catch (err) {
            console.error('Export failed:', err);
            setError('Export failed');
        } finally {
            setExporting(false);
        }
    };
    const getTrend = (data = []) => {
        if (data.length < 2) return { value: 0, type: 'neutral' };

        const current = data[data.length - 1]?.total || 0;
        const previous = data[data.length - 2]?.total || 0;

        if (previous === 0) {
            return {
                value: current > 0 ? 100 : 0,
                type: current > 0 ? 'up' : 'neutral',
            };
        }

        const percent = ((current - previous) / previous) * 100;

        return {
            value: Math.abs(percent).toFixed(1),
            type: percent > 0 ? 'up' : percent < 0 ? 'down' : 'neutral',
        };
    };

    const trend = getTrend(registrations);

    const TrendIcon =
        trend.type === 'up'
            ? TrendingUp
            : trend.type === 'down'
                ? TrendingDown
                : Minus;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-2xl border border-outline-variant">
                <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-primary" />
                    <select 
                        value={analyticsType}
                        onChange={(e) => setAnalyticsType(e.target.value)}
                        className="text-sm font-bold text-on-surface bg-white border border-outline-variant rounded-lg px-3 py-1.5 uppercase tracking-widest hover:bg-surface-container-low transition-colors"
                    >
                        <option value="DAY">Daily</option>
                        <option value="WEEK">Weekly</option>
                        <option value="MONTH">Monthly</option>
                    </select>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setOpenModal('export')}
                        className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:opacity-90 transition-all custom-shadow flex items-center gap-2 uppercase tracking-wide"
                    >
                        <Download size={16} /> Export Report
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Registration Overview</h4>
                <div className="h-64 w-full bg-white rounded-2xl border border-outline-variant p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader size={24} className="text-primary animate-spin" />
                        </div>
                    ) : registrations && registrations.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={registrations}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8f9fa' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="total" fill="#003874" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-outline text-sm">
                            No data available
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center py-8">
                        <div className="flex flex-col items-center gap-2">
                            <Loader size={20} className="text-primary animate-spin" />
                            <p className="text-xs text-outline">Loading statistics...</p>
                        </div>
                    </div>
                ) : !summary ? (
                    <div className="col-span-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
                        No statistics available
                    </div>
                ) : (
                    <>
                        {[
                            { label: 'Total Users', value: summary.totalUsers, icon: User, color: 'blue' },
                            { label: 'Active Users', value: summary.activeUsers, icon: UserCheck, color: 'emerald' },
                            { label: 'Inactive Users', value: summary.inactiveUsers, icon: UserMinus, color: 'amber' },
                            { label: 'Deleted Users', value: summary.deletedUsers, icon: UserX, color: 'rose' }
                        ].map((stat, idx) => {
                            const Icon = stat.icon;
                            const colorBg = stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                    stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                                        'bg-rose-50 text-rose-600';
                            return (
                                <div key={idx} className="p-4 bg-white rounded-xl border border-outline-variant">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-2 rounded-lg ${colorBg}`}>
                                            <Icon size={18} />
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest">{stat.label}</p>
                                    <h4 className="text-2xl font-bold text-primary mt-1">{stat.value}</h4>
                                </div>
                            );
                        })}
                        
                        <div className="p-4 bg-white rounded-xl border border-outline-variant">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg ${
                                    trend.type === 'up'
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : trend.type === 'down'
                                            ? 'bg-rose-50 text-rose-600'
                                            : 'bg-slate-50 text-slate-600'
                                }`}>
                                    <TrendIcon size={18} />
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Registration Trend</p>
                            <h4 className="text-2xl font-bold text-primary mt-1">{trend.value}%</h4>
                            <p className="text-xs text-outline mt-2">vs. previous {analyticsType.toLowerCase()}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="pt-6 border-t border-outline-variant flex justify-center">
                <button
                    onClick={onClose}
                    className="px-10 py-3 bg-surface border border-outline-variant text-on-surface rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-surface-container transition-all"
                >
                    Close
                </button>
            </div>

            {/* Export Report Modal */}
            <Modal isOpen={openModal === 'export'} onClose={() => setOpenModal(null)} title="Export Report">
                <ExportReportModal 
                    exportType="analytics"
                    analyticsType={analyticsType}
                    onClose={() => setOpenModal(null)} 
                />
            </Modal>
        </div>
    );
}
