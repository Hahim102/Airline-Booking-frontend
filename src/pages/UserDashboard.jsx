import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/ui/Modal';
import ProfileModal from '../components/modals/ProfileModal';
import UserBannerSection from '../components/dashboard/UserBannerSection';
import UserAccountInfo from '../components/dashboard/UserAccountInfo';
import UserSidebarCards from '../components/dashboard/UserSidebarCards';
import UserNetworkAccessBanner from '../components/dashboard/UserNetworkAccessBanner';

export default function UserDashboard() {
    const [openModal, setOpenModal] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const userData = {
        name: user?.fullName || user?.name || "User Name",
        email: user?.email || "user@example.com",
        phone: user?.phone || "+1 234 567 890",
        passport: user?.passport || "ABC123456",
        memberSince: user?.createdAt ? new Date(user.createdAt).getFullYear() : 2021,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            <UserBannerSection userData={userData} onViewBookings={() => navigate('/bookings')} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <UserAccountInfo userData={userData} onEditClick={() => setOpenModal('profile')} />
                <UserSidebarCards onEditClick={() => setOpenModal('profile')} />
            </div>

            <UserNetworkAccessBanner />

            {/* Profile Modal */}
            <Modal isOpen={openModal === 'profile'} onClose={() => setOpenModal(null)} title="My SkyStream Profile">
                <ProfileModal onClose={() => setOpenModal(null)} />
            </Modal>
        </motion.div>
    );
}
