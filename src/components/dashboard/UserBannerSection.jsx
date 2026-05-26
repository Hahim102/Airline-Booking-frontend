import { Ticket } from 'lucide-react';

export default function UserBannerSection({ userData, onViewBookings }) {
    return (
        <section className="relative h-64 rounded-3xl overflow-hidden custom-shadow">
            <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsDxDzm6IqVuhi3r8qST2BqdC9cYrkvpLfiPbcIXVrfmxQE0LBRviTRxN7kHZIPrOGASlKvWi4nm31hVwFJ0xXtntjxHiKi5lW3WomrNb3Igq35qNpdJZwxr4EDntRQK16kLURvlpwIJ49idL_OAv3zoBv5DBqRpxOglH6G_z8xZsNA_xRND23s29L4oq18PLGfgk2SBxfPdFPmWWZnEn4IEis894RJPAEL-g2wZQFuRQYEcVYw0seUOAuk8sAplmp_TWlmIkfzmc"
                alt="Flight Banner"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
                    <div>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Member Since {userData.memberSince}</p>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Welcome Back, {userData.name}</h1>
                    </div>
                    <button
                        onClick={onViewBookings}
                        className="flex items-center gap-3 px-8 py-3.5 bg-white text-primary rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-surface transition-all custom-shadow"
                    >
                        <Ticket size={18} />
                        View My Bookings
                    </button>
                </div>
            </div>
        </section>
    );
}
