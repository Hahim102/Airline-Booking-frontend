import { Contact } from 'lucide-react';

export default function UserAccountInfo({ userData, onEditClick }) {
    return (
        <div className="lg:col-span-8 bg-white rounded-3xl border border-outline-variant custom-shadow overflow-hidden">
            <div className="px-6 py-6 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Contact size={20} className="text-primary" />
                    <h3 className="text-lg font-bold text-primary">Account Information</h3>
                </div>
                <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Airline Booking Elite</span>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Full Name</label>
                    <p className="font-semibold text-on-surface">{userData.name}</p>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Email Address</label>
                    <p className="font-semibold text-on-surface">{userData.email}</p>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Phone Number</label>
                    <p className="font-semibold text-on-surface">{userData.phone}</p>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Passport / ID</label>
                    <p className="font-semibold text-on-surface">{userData.passport}</p>
                </div>
            </div>
            <div className="px-8 py-4 bg-surface-container-lowest border-t border-outline-variant flex justify-end">
                <button onClick={onEditClick} className="px-6 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all">
                    Edit Profile
                </button>
            </div>
        </div>
    );
}
