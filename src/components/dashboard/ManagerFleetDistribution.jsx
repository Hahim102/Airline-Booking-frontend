import { Map } from 'lucide-react';

export default function ManagerFleetDistribution() {
    return (
        <div className="bg-white rounded-2xl border border-outline-variant custom-shadow overflow-hidden">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="text-lg font-bold text-primary">Live Fleet Distribution</h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Live Feed</span>
                </div>
            </div>
            <div className="relative h-[300px] bg-sky-50 overflow-hidden">
                <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1TjcloFCEssHaVQYF9o6iWqHNmrn73m0twKmNHchO0SNx2zD0SDjX6j2IZa2WahIrESGCGL_DN9oKga1O2pDhndyeC06qNAt2tKiUlYX4yC86MNG0XF2DWipGjGYEzDEvGE9xFV96b21zdlVaIQdkdf2uOdQ68b88V35LZ9hxa5wBYQ1qunTiQ_pR-j2Nuw0YMGLdlnv5GGvBlRwQECYBORTzkudjnLNhJ6G6ZIWdrIXLY4S8IL3jlXEQAseboFvor554XC7WC6Q"
                    className="w-full h-full object-cover grayscale opacity-50"
                    alt="Map"
                />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="bg-white/90 backdrop-blur px-8 py-4 rounded-full border border-outline-variant custom-shadow flex items-center gap-4 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                        <Map size={24} className="text-primary" />
                        <span className="text-sm font-bold text-primary uppercase tracking-wide">Interactive Map Offline - Monitoring Regional Statistics</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
