import { Bell, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { USER_INFO, OWNER_INFO, MANAGER_INFO } from '../constants';
import { ROLES } from '../utils/roles';

export default function TopNav({ onAvatarClick }) {
    const { user } = useAuth();
    const userData = {
        name: user?.fullName,
        role: user?.role,
    };
    console.log(import.meta.env.VITE_RECAPTCHA_SITE_KEY);

    const getInfo = () => {
        switch (userData.role) {
            case ROLES.AIRLINE_OWNER:
                return OWNER_INFO;

            case ROLES.SYSTEM_ADMIN:
                return MANAGER_INFO;

            case ROLES.USER:
            default:
                return user;
        }
    };

    const info = getInfo();

    return (
        <header className="flex justify-between items-center h-16 px-8 bg-white/80 backdrop-blur-md border-b border-outline-variant sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <Link to="/booking" className="font-bold text-primary tracking-tight hover:opacity-90 transition-opacity">
                    Airline Booking
                </Link>
                <span className="text-outline-variant">/</span>

                <span className="text-outline text-[10px] font-bold uppercase tracking-widest">
                    {userData.role?.replace("ROLE_", "") || "USER"} VIEW
                </span>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-outline border-r border-outline-variant pr-6">
                    <button className="hover:text-primary transition-colors">
                        <Bell size={20} />
                    </button>
                    <button className="hover:text-primary transition-colors">
                        <HelpCircle size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-bold text-on-surface leading-none">{userData.name}</p>
                        <p className="text-[10px] text-outline font-semibold uppercase tracking-wider mt-1">
                            {info.role}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onAvatarClick}
                        className="h-10 w-10 rounded-xl bg-surface-container-highest overflow-hidden border-2 border-primary/10 custom-shadow hover:opacity-90 transition-opacity"
                        aria-label="Toggle sidebar"
                    >
                        <img
                            src={info.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
}