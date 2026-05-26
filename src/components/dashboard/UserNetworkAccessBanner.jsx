export default function UserNetworkAccessBanner() {
    return (
        <div className="relative w-full h-48 rounded-3xl overflow-hidden custom-shadow group border border-outline-variant">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 z-10"></div>
            <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=1200"
                alt="Banner"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-30"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-10">
                <h4 className="text-2xl font-bold text-white mb-2 tracking-tight">Global Network Access</h4>
                <p className="text-white/80 text-sm max-w-sm font-medium">Manage your operational preferences across 140+ destinations worldwide from your central dashboard.</p>
            </div>
            <div className="absolute top-0 right-0 w-2/3 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
        </div>
    );
}
