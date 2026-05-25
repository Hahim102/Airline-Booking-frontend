import { useState } from 'react';
import { Moon, Sun, Monitor, Bell, Languages, Plane } from 'lucide-react';

export default function PreferencesModal({ onClose }) {
    const [theme, setTheme] = useState('light');
    const [lang, setLang] = useState('English');

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Appearance */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Appearance</h4>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'light', icon: Sun, label: 'Light' },
                            { id: 'dark', icon: Moon, label: 'Dark' },
                            { id: 'system', icon: Monitor, label: 'Auto' }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${theme === t.id ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant text-outline hover:border-outline'
                                    }`}
                            >
                                <t.icon size={20} />
                                <span className="text-[10px] font-bold uppercase">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Notifications</h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant rounded-xl">
                            <span className="text-sm font-medium">Flight Alerts</span>
                            <div className="w-10 h-5 bg-primary rounded-full relative">
                                <div className="absolute right-1 top-1 h-3 w-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant rounded-xl">
                            <span className="text-sm font-medium">Marketing</span>
                            <div className="w-10 h-5 bg-outline-variant rounded-full relative">
                                <div className="absolute left-1 top-1 h-3 w-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Travel Hubs */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Primary Region</h4>
                    <div className="relative">
                        <Languages className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                        <select
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl outline-none text-sm font-medium"
                        >
                            <option>English (US)</option>
                            <option>Vietnamese (VN)</option>
                            <option>French (FR)</option>
                            <option>Japanese (JP)</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Default Service</h4>
                    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl text-primary">
                        <Plane size={18} />
                        <span className="text-sm font-bold uppercase tracking-wider">Business Class</span>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-outline-variant flex justify-end gap-3">
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-outline hover:bg-surface-container-low">Default</button>
                <button onClick={onClose} className="px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-lg">Save Settings</button>
            </div>
        </div>
    );
}
