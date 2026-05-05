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
    FileText
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/roles';
import { useNavigate } from 'react-router-dom';
import Model from './ui/Model';
import ProfileModel from './models/ProfileModel';
import SecurityModel from './models/SecurityModel';
import PreferencesModel from './models/PreferencesModel';
import FleetModel from './models/FleetModel';
import StaffModel from './models/StaffModel';
import ReportsModel from './models/ReportsModel';
import OverviewUpdateModel from './models/OverviewUpdateModel';

export default function Sidebar({ currentRole, activeTab }) {
    const [openModel, setOpenModel] = useState(null);

    const { user, logout } = useAuth();
    const role = user?.role;
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: [ROLES.USER, ROLES.AIRLINE_OWNER, ROLES.SYSTEM_ADMIN], type: 'tab' },

        { id: 'profile', label: 'Profile', icon: User, roles: [ROLES.USER], type: 'model' },
        { id: 'security', label: 'Security', icon: Shield, roles: [ROLES.USER], type: 'model' },
        { id: 'preferences', label: 'Preferences', icon: Settings, roles: [ROLES.USER], type: 'model' },

        { id: 'fleet', label: 'Fleet Management', icon: Plane, roles: [ROLES.AIRLINE_OWNER], type: 'model' },
        { id: 'scheduling', label: 'Flight Scheduling', icon: Calendar, roles: [ROLES.AIRLINE_OWNER], type: 'model' },
        { id: 'revenue', label: 'Revenue / Finance', icon: CreditCard, roles: [ROLES.AIRLINE_OWNER], type: 'model' },
        { id: 'staff', label: 'Staff / Crew', icon: Users, roles: [ROLES.AIRLINE_OWNER], type: 'model' },

        { id: 'bookings', label: 'Booking Management', icon: FileText, roles: [ROLES.SYSTEM_ADMIN], type: 'model' },
        { id: 'users', label: 'User Management', icon: Users, roles: [ROLES.SYSTEM_ADMIN], type: 'model' },
        { id: 'settings', label: 'System Settings', icon: Settings, roles: [ROLES.SYSTEM_ADMIN], type: 'model' },

        { id: 'reports', label: 'Reports / Analytics', icon: BarChart, roles: [ROLES.AIRLINE_OWNER, ROLES.SYSTEM_ADMIN], type: 'model' },
    ];

    const handleModelClick = (modelId) => {
        setOpenModel(modelId);
    };

    const filteredItems = menuItems.filter(item => item.roles.includes(role));

    if (!user) return null;

    return (
        <>
            <aside className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-outline-variant flex flex-col py-6 px-4 z-50">
                <div className="mb-10 px-2">
                    <h1 className="text-xl font-bold text-primary tracking-tight">Airline Booking</h1>
                    <p className="text-[10px] text-outline font-semibold uppercase tracking-widest mt-1">Operations</p>
                </div>

                <nav className="flex-1 space-y-1">
                    {filteredItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { 
                                if (item.type === 'model') {
                                    handleModelClick(item.id);
                                } else {
                                    onTabChange(item.id);
                                }
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${activeTab === item.id
                                    ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-low'
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

            {/* Models */}
            <Model isOpen={openModel === 'profile'} onClose={() => setOpenModel(null)} title="My SkyStream Profile">
                <ProfileModel onClose={() => setOpenModel(null)} />
            </Model>

            <Model isOpen={openModel === 'security'} onClose={() => setOpenModel(null)} title="Security Settings">
                <SecurityModel onClose={() => setOpenModel(null)} />
            </Model>

            <Model isOpen={openModel === 'preferences'} onClose={() => setOpenModel(null)} title="User Preferences">
                <PreferencesModel onClose={() => setOpenModel(null)} />
            </Model>

            <Model isOpen={openModel === 'fleet'} onClose={() => setOpenModel(null)} title="Fleet Management">
                <FleetModel onClose={() => setOpenModel(null)} />
            </Model>

            <Model isOpen={openModel === 'scheduling'} onClose={() => setOpenModel(null)} title="Flight Scheduling">
                <OverviewUpdateModel onClose={() => setOpenModel(null)} />
            </Model>

            <Model isOpen={openModel === 'revenue'} onClose={() => setOpenModel(null)} title="Revenue / Finance">
                <OverviewUpdateModel onClose={() => setOpenModel(null)} />
            </Model>

            <Model isOpen={openModel === 'staff'} onClose={() => setOpenModel(null)} title="Staff / Crew Management">
                <StaffModel onClose={() => setOpenModel(null)} />
            </Model>

            <Model isOpen={openModel === 'bookings'} onClose={() => setOpenModel(null)} title="Booking Management">
                <OverviewUpdateModel onClose={() => setOpenModel(null)} />
            </Model>

            <Model isOpen={openModel === 'users'} onClose={() => setOpenModel(null)} title="User Management">
                <OverviewUpdateModel onClose={() => setOpenModel(null)} />
            </Model>

            <Model isOpen={openModel === 'settings'} onClose={() => setOpenModel(null)} title="System Settings">
                <OverviewUpdateModel onClose={() => setOpenModel(null)} />
            </Model>

            <Model isOpen={openModel === 'reports'} onClose={() => setOpenModel(null)} title="Reports / Analytics">
                <ReportsModel onClose={() => setOpenModel(null)} />
            </Model>
        </>
    );
}