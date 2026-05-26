import { motion } from 'motion/react';
import { Download } from 'lucide-react';
import { FLIGHT_MANAGEMENT_DATA, RECENT_BOOKINGS } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { useManagerAnalytics } from '../hooks/useManagerAnalytics';
import { useState, useEffect } from 'react';
import ProfileModal from '../components/modals/ProfileModal';
import SecurityModal from '../components/modals/SecurityModal';
import CreateUserModal from '../components/modals/CreateUserModal';
import ExportReportModal from '../components/modals/ExportReportModal';
import Modal from '../components/ui/Modal';
import ManagerAdminCard from '../components/dashboard/ManagerAdminCard';
import ManagerAnalyticsSection from '../components/dashboard/ManagerAnalyticsSection';
import ManagerMetricsCards from '../components/dashboard/ManagerMetricsCards';
import ManagerFlightTable from '../components/dashboard/ManagerFlightTable';
import ManagerRecentBookings from '../components/dashboard/ManagerRecentBookings';
import ManagerFleetDistribution from '../components/dashboard/ManagerFleetDistribution';

export default function ManagerDashboard() {
    const { user, isAuthenticated } = useAuth();
    const { users, loading, error, fetchUsers, updateUserStatus } = useUsers();
    const { summary, registrationsByType, analyticsLoading, analyticsError } = useManagerAnalytics();
    
    const [openModal, setOpenModal] = useState(null);
    const [exportType, setExportType] = useState(null);
    const [exportError, setExportError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Admin Profile Card */}
            <ManagerAdminCard
                user={user}
                onEditClick={() => setOpenModal('profile')}
                onSecurityClick={() => setOpenModal('security')}
            />

            {/* Export Section Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-4xl font-bold text-primary tracking-tight">Operations Overview</h2>
                </div>
                <div className="flex gap-3 items-center">
                    <select
                        value={exportType || ''}
                        onChange={(e) => {setExportType(e.target.value || null);
                            setExportError('');
                        }}
                        className="text-[10px] font-bold text-on-surface bg-white border border-outline-variant rounded-lg px-3 py-2 uppercase tracking-widest hover:bg-surface-container-low transition-colors"
                    >
                        <option value="">Select Report Type</option>
                        <option value="DAY">Daily Report</option>
                        <option value="WEEK">Weekly Report</option>
                        <option value="MONTH">Monthly Report</option>
                    </select>
                    <button
                        onClick={() => {
                            if (exportType === null) {
                                setExportError('Please select a time period before exporting.');
                                return;
                            }

                            setExportError('');
                            setOpenModal('export');
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all custom-shadow flex items-center gap-2 uppercase tracking-wide ${exportType === null
                                ? 'bg-outline-variant text-outline cursor-not-allowed opacity-50'
                                : 'bg-primary text-white hover:opacity-90'
                            }`}
                    >
                        <Download size={16} /> Export Report
                    </button>
                    {exportError && (
                        <div className="mt-3 px-4 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold">
                            {exportError}
                        </div>
                    )}
                </div>
            </div>

            {/* Analytics Section */}
            <ManagerAnalyticsSection
                registrationsByType={registrationsByType}
                analyticsLoading={analyticsLoading}
                exportType={exportType}
                onExportTypeChange={setExportType}
            />

            {/* Metrics Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ManagerMetricsCards
                    summary={summary}
                    loading={analyticsLoading}
                    error={analyticsError}
                />
            </section>

            {/* Flight & Bookings */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                    <ManagerFlightTable flights={FLIGHT_MANAGEMENT_DATA} />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <ManagerRecentBookings bookings={RECENT_BOOKINGS} />
                </div>
            </div>

            {/* Fleet Distribution */}
            <ManagerFleetDistribution />

            {/* Modals */}
            <Modal isOpen={openModal === 'profile'} onClose={() => setOpenModal(null)} title="Edit Admin Profile">
                <ProfileModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'security'} onClose={() => setOpenModal(null)} title="Change Password">
                <SecurityModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'createUser'} onClose={() => setOpenModal(null)} title="Create New User">
                <CreateUserModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'export'} onClose={() => setOpenModal(null)} title="Export Report">
                <ExportReportModal 
                    exportType="analytics"
                    analyticsType={exportType}
                    onClose={() => setOpenModal(null)} 
                />
            </Modal>
        </motion.div>
    );
}