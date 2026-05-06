/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
    PlaneTakeoff,
    PlaneLanding,
    Calendar,
    Users,
    Globe2,
    Armchair,
    CheckSquare,
    ArrowRight,
    ChevronRight,
    Award,
    CreditCard,
    QrCode,
    Share2,
    Send,
    AtSign,
    Link2
} from 'lucide-react';
import { motion } from 'motion/react';
import { BookingLandingNavbar } from '../components/BookingLandingNavbar';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="flex gap-4 items-start">
        <div className="bg-surface-container p-3 rounded-xl">
            <Icon className="w-8 h-8 text-primary" />
        </div>
        <div>
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
        </div>
    </div>
);

export default function BookingLandingView({ showNavbar = true }) {
    const [activeTab, setActiveTab] = useState('Round Trip');

    return (
        <div className="min-h-screen bg-background text-on-surface">
            {showNavbar ? <BookingLandingNavbar /> : null}

            <main className={showNavbar ? 'pt-20' : ''}>
                {/* Hero Section */}
                <section className="relative h-[650px] flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000"
                            alt="Hero Plane"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-2xl mb-12"
                        >
                            <h1 className="text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                                Explore the Skies with SkyStream
                            </h1>
                            <p className="text-xl text-white/90 font-medium drop-shadow-md">
                                Connecting you to over 150 global destinations with 5-star service.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-2xl p-8 border border-outline-variant max-w-5xl"
                        >
                            <div className="flex items-center gap-6 mb-8 border-b border-outline-variant/30">
                                {['Round Trip', 'One Way', 'Multi-city'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 px-2 font-semibold transition-all relative ${activeTab === tab ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">From</label>
                                    <div className="relative">
                                        <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                                        <input
                                            type="text"
                                            placeholder="Departure city"
                                            className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">To</label>
                                    <div className="relative">
                                        <PlaneLanding className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                                        <input
                                            type="text"
                                            placeholder="Arrival city"
                                            className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">Departure & Return</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                                        <input
                                            type="text"
                                            placeholder="Select dates"
                                            className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <button className="bg-primary text-white h-[52px] rounded-xl font-bold text-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                    Search Flights
                                </button>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                                    <Users className="w-4 h-4" />
                                    <span>1 Passenger, Economy</span>
                                </div>
                                <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer group">
                                    <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" />
                                    <span className="group-hover:text-primary transition-colors">Direct flights only</span>
                                </label>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Why Choose Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <FeatureCard
                                icon={Globe2}
                                title="Global Network"
                                description="Connecting to over 150 countries with optimized routes and shortest flight times."
                            />
                            <FeatureCard
                                icon={Armchair}
                                title="Premium Comfort"
                                description="Enjoy top-tier cuisine and a diverse entertainment system right at your seat."
                            />
                            <FeatureCard
                                icon={CheckSquare}
                                title="Flexible Booking"
                                description="Easy schedule changes or refunds with our dedicated support policies."
                            />
                        </div>
                    </div>
                </section>

                {/* Featured Destinations (Bento Grid) */}
                <section className="py-20 max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-primary mb-2">Featured Destinations</h2>
                            <p className="text-on-surface-variant">Great suggestions for your next journey.</p>
                        </div>
                        <button className="text-primary font-semibold flex items-center gap-1 hover:underline transition-all">
                            View all <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
                        {/* Tokyo Large Card */}
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="md:col-span-8 relative rounded-2xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer min-h-[400px]"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1600"
                                alt="Tokyo"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col md:flex-row justify-between items-end gap-6">
                                <div>
                                    <span className="inline-block bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                                        Most Popular
                                    </span>
                                    <h3 className="text-3xl font-bold text-white mb-2">Tokyo, Japan</h3>
                                    <p className="text-white/80 max-w-md">Discover modern beauty intertwined with tradition.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/60 text-xs mb-1 uppercase tracking-wider font-bold">From</p>
                                    <p className="text-2xl font-bold text-white mb-4">8,500,000 VND</p>
                                    <button className="bg-white text-primary px-8 py-2.5 rounded-lg font-bold hover:bg-surface-container-high transition-colors">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column Grid */}
                        <div className="md:col-span-4 grid grid-rows-2 gap-6">
                            {/* New York */}
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="relative rounded-2xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer min-h-[250px]"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800"
                                    alt="New York"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h3 className="text-xl font-bold text-white">New York, USA</h3>
                                    <p className="text-white/90 font-semibold text-lg">15.200.000 VNĐ</p>
                                </div>
                            </motion.div>

                            {/* London Offer */}
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="relative rounded-2xl overflow-hidden shadow-sm border border-outline-variant bg-surface-container-highest p-8 flex flex-col justify-between group cursor-pointer min-h-[250px]"
                            >
                                <div>
                                    <span className="bg-tertiary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        October Offer
                                    </span>
                                    <h3 className="text-2xl font-bold text-primary mt-4">London, UK</h3>
                                    <p className="text-on-surface-variant text-sm mt-2">Explore the ancient city of fog.</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-primary">12,800,000 VND</span>
                                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center transition-transform group-hover:translate-x-2">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Personalized Offers */}
                <section className="py-20 bg-surface-container px-6">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold text-primary mb-12">Exclusive Offers for You</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* SkyMiles Offer */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-sm border border-outline-variant"
                            >
                                <div className="sm:w-40 bg-primary-container flex flex-col items-center justify-center text-on-primary-container space-y-2 py-8">
                                    <Award className="w-12 h-12" />
                                    <span className="text-2xl font-bold">-20%</span>
                                </div>
                                <div className="flex-1 p-8">
                                    <h3 className="text-xl font-bold text-primary mb-2">SkyMiles Member</h3>
                                    <p className="text-on-surface-variant text-sm mb-6">
                                        Get 20% off all international flights when booking via the app.
                                    </p>
                                    <button className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all group">
                                        Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </motion.div>

                            {/* Duo Pay Offer */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-sm border border-outline-variant"
                            >
                                <div className="sm:w-40 bg-tertiary flex flex-col items-center justify-center text-white space-y-2 py-8">
                                    <CreditCard className="w-12 h-12" />
                                    <span className="text-xl font-bold">Duo Pay</span>
                                </div>
                                <div className="flex-1 p-8">
                                    <h3 className="text-xl font-bold text-tertiary mb-2">Group Offer</h3>
                                    <p className="text-on-surface-variant text-sm mb-6">
                                        Buy 2 adult tickets, get free service fees for accompanying children.
                                    </p>
                                    <button className="text-tertiary font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all group">
                                        See details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Newsletter & App Banner */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="bg-primary rounded-[2rem] p-12 md:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-container/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

                            <div className="flex-1 text-center lg:text-left relative z-10">
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Stay updated with new journeys</h2>
                                <p className="text-xl text-white/80 mb-10 max-w-xl">
                                    Subscribe to our newsletter to never miss exclusive offers and the latest travel updates.
                                </p>
                                <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto lg:mx-0">
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm transition-all"
                                    />
                                    <button className="bg-white text-primary px-10 py-4 rounded-xl font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-xl shadow-black/20">
                                        Subscribe
                                    </button>
                                </form>
                            </div>

                            <div className="lg:w-[320px] flex justify-center relative z-10">
                                <motion.div
                                    initial={{ rotate: -5, y: 20 }}
                                    whileInView={{ rotate: 0, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 text-center w-56 group cursor-pointer"
                                >
                                    <QrCode className="w-full aspect-square text-white mb-6 group-hover:scale-110 transition-transform" />
                                    <p className="text-[10px] font-bold text-white tracking-widest uppercase">Scan to Download App</p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-surface-container-high border-t border-outline-variant pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div className="lg:col-span-2">
                            <a href="#" className="text-2xl font-bold text-primary block mb-6">SkyStream Operations</a>
                            <p className="text-on-surface-variant max-w-sm mb-8 leading-relaxed">
                                The world's leading airline operator, committed to delivering safe, reliable, and superior flying experiences.
                            </p>
                            <div className="flex gap-4">
                                {[Share2, Send, AtSign, Link2].map((Icon, idx) => (
                                    <a key={idx} href="#" className="p-2.5 bg-white rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-all">
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-primary text-xs uppercase tracking-widest mb-8">Company</h4>
                            <ul className="space-y-4">
                                {['About Us', 'Careers', 'Partners', 'News'].map(item => (
                                    <li key={item}><a href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-primary text-xs uppercase tracking-widest mb-8">Legal</h4>
                            <ul className="space-y-4">
                                {['Terms of Service', 'Privacy Policy', 'Cookie Settings', 'Accessibility'].map(item => (
                                    <li key={item}><a href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">{item}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm text-on-surface-variant">
                            © 2024 SkyStream Operations. All rights reserved.
                        </p>
                        <div className="flex items-center gap-8 grayscale opacity-50 select-none">
                            <span className="font-bold text-lg tracking-tighter">VISA</span>
                            <span className="font-bold text-lg tracking-tighter italic font-serif">mastercard</span>
                            <span className="font-bold text-lg tracking-tighter font-serif uppercase">PayPal</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
