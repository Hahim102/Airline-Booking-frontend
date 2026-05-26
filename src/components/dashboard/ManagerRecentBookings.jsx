export default function ManagerRecentBookings({ bookings }) {
    return (
        <div className="bg-white rounded-2xl border border-outline-variant custom-shadow overflow-hidden">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low">
                <h3 className="text-lg font-bold text-primary">Recent Bookings</h3>
            </div>
            <div className="divide-y divide-outline-variant/30">
                {bookings.map((booking) => (
                    <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold shadow-sm">
                                {booking.userInitials}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-on-surface">{booking.userName}</p>
                                <p className="text-[10px] text-outline font-medium">Flight: {booking.flightId} • {booking.tier}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${booking.status === 'CONFIRMED' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                                booking.status === 'PENDING' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                                    'text-rose-600 bg-rose-50 border-rose-100'
                                }`}>
                                {booking.status}
                            </span>
                            <div className="flex gap-2">
                                <button className="text-[10px] font-bold text-primary hover:bg-surface-container-high px-3 py-1.5 rounded transition-colors border border-outline-variant">Update</button>
                                <button
                                    className={`text-[10px] font-bold px-3 py-1.5 rounded transition-colors border ${booking.status === 'REFUNDED' ? 'text-outline opacity-50 cursor-not-allowed border-outline-variant' : 'text-error hover:bg-error-container border-error/10'
                                        }`}
                                    disabled={booking.status === 'REFUNDED'}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
