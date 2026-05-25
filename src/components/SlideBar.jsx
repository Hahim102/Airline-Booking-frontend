import { useState } from 'react';
import {
    LayoutDashboard,
    User,
    Shield,
    Settings,
    CheckCircle,
    LogOut,
    Plane,
    Calendar,
    CreditCard,
    Users,
    BarChart,
    FileText,
    UserPlus
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/roles';
import { useNavigate } from 'react-router-dom';
import Modal from './ui/Modal';
import ProfileModal from './modals/ProfileModal';
import SecurityModal from './modals/SecurityModal';
import PreferencesModal from './modals/PreferencesModal';
import FleetModal from './modals/FleetModal';
import StaffModal from './modals/StaffModal';
import ReportsModal from './modals/ReportsModal';
import OverviewUpdateModal from './modals/OverviewUpdateModal';
import UserManagementModal from './modals/UserManagementModal';
import CreateUserModal from './modals/CreateUserModal';

export default function Sidebar({ currentRole, className = '' }) {
    const [openModal, setOpenModal] = useState(null);

    const { user, logout } = useAuth();
    const role = user?.role;
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: [ROLES.USER, ROLES.AIRLINE_OWNER], type: 'tab' },

        { id: 'profile', label: 'Profile', icon: User, roles: [ROLES.USER], type: 'modal' },
        { id: 'security', label: 'Security', icon: Shield, roles: [ROLES.USER], type: 'modal' },
        { id: 'preferences', label: 'Preferences', icon: Settings, roles: [ROLES.USER], type: 'modal' },

        { id: 'fleet', label: 'Fleet Management', icon: Plane, roles: [ROLES.AIRLINE_OWNER], type: 'modal' },
        { id: 'scheduling', label: 'Flight Scheduling', icon: Calendar, roles: [ROLES.AIRLINE_OWNER], type: 'modal' },
        { id: 'revenue', label: 'Revenue / Finance', icon: CreditCard, roles: [ROLES.AIRLINE_OWNER], type: 'modal' },
        { id: 'staff', label: 'Staff / Crew', icon: Users, roles: [ROLES.AIRLINE_OWNER], type: 'modal' },

        { id: 'bookings', label: 'Booking Management', icon: FileText, roles: [ROLES.SYSTEM_ADMIN], type: 'modal' },
        { id: 'users', label: 'User Management', icon: Users, roles: [ROLES.SYSTEM_ADMIN], type: 'modal' },
        { id: 'createUser', label: 'Create User', icon: UserPlus, roles: [ROLES.SYSTEM_ADMIN], type: 'modal' },
        { id: 'settings', label: 'System Settings', icon: Settings, roles: [ROLES.SYSTEM_ADMIN], type: 'modal' },

        { id: 'reports', label: 'Reports / Analytics', icon: BarChart, roles: [ROLES.AIRLINE_OWNER, ROLES.SYSTEM_ADMIN], type: 'modal' },
    ];

    const handleModalClick = (modalId) => {
        setOpenModal(modalId);
    };

    const filteredItems = menuItems.filter(item => item.roles.includes(role));

    if (!user) return null;

    return (
        <>
            <aside className={`w-72 fixed right-8 top-16 bg-white border border-outline-variant rounded-2xl shadow-xl shadow-black/5 flex flex-col py-6 px-4 z-30 ${className}`}>
                <div className="mb-10 px-2">
                    <button
                        type="button"
                        onClick={() => navigate('/booking')}
                        className="text-left text-xl font-bold text-primary tracking-tight hover:opacity-90 transition-opacity"
                    >
                        Airline Booking
                    </button>
                    <p className="text-[10px] text-outline font-semibold uppercase tracking-widest mt-1">Operations</p>
                </div>

                <nav className="flex-1 space-y-1 overflow-auto pr-1">
                    {filteredItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { 
                                if (item.type === 'modal') {
                                    handleModalClick(item.id);
                                } else if (item.id === 'overview') {
                                    navigate('/user');
                                }
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${item.id === 'overview' && window.location.pathname === '/user'
                                    ? 'text-primary font-bold border-l-4 border-primary bg-surface-container-low'
                                    : 'text-outline hover:text-primary hover:bg-surface-container-low'
                                }`}
                        >
                            <item.icon size={18} />
                            <span className="text-sm font-medium tracking-tight">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-outline-variant space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2 text-outline text-sm font-medium tracking-tight">
                        <CheckCircle size={18} className="text-green-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Account Status</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-all text-sm font-medium tracking-tight"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Modals */}
            <Modal isOpen={openModal === 'profile'} onClose={() => setOpenModal(null)} title="My SkyStream Profile">
                <ProfileModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'security'} onClose={() => setOpenModal(null)} title="Security Settings">
                <SecurityModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'preferences'} onClose={() => setOpenModal(null)} title="User Preferences">
                <PreferencesModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'fleet'} onClose={() => setOpenModal(null)} title="Fleet Management">
                <FleetModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'scheduling'} onClose={() => setOpenModal(null)} title="Flight Scheduling">
                <OverviewUpdateModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'revenue'} onClose={() => setOpenModal(null)} title="Revenue / Finance">
                <OverviewUpdateModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'staff'} onClose={() => setOpenModal(null)} title="Staff / Crew Management">
                <StaffModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'bookings'} onClose={() => setOpenModal(null)} title="Booking Management">
                <OverviewUpdateModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'users'} onClose={() => setOpenModal(null)} title="Access Management" fullScreen>
                <UserManagementModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'createUser'} onClose={() => setOpenModal(null)} title="Create New User">
                <CreateUserModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'settings'} onClose={() => setOpenModal(null)} title="System Settings">
                <OverviewUpdateModal onClose={() => setOpenModal(null)} />
            </Modal>

            <Modal isOpen={openModal === 'reports'} onClose={() => setOpenModal(null)} title="Reports / Analytics">
                <ReportsModal onClose={() => setOpenModal(null)} />
            </Modal>
        </>
    );
}