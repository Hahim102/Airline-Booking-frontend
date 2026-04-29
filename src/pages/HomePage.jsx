import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react";
import {
  Plane,
  ShieldCheck,
  BarChart3,
  Globe,
  ArrowRight,
  CheckCircle2,
  Menu,
  X
} from "lucide-react";

export const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="w-full overflow-x-hidden">

      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'border-b border-slate-200 bg-white/85 backdrop-blur-md' : ''}`}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-10">
            <Link to="/" className={`text-4xl font-bold tracking-tight ${isScrolled ? 'text-blue-700' : 'text-white'}`}>✈️ Airline Booking</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className={`${isScrolled ? 'text-slate-600' : 'text-white'} hidden text-sm font-semibold hover:text-blue-600 sm:block`}>Login</Link>
            <Link to="/register" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Register</Link>
            <button className={`md:hidden ${isScrolled ? 'text-slate-700' : 'text-white'}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>    
        </div>
      </header>

      <section className="relative flex min-h-[760px] items-center overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3k-UTJ7NZR4mKJ9DlyfsoAOH8RWZa_Wux4nAugHBBo3hgwnNtaNJH_TvdELhfeCkh8F3USeNGilZBJt_pe-ArUBD293On0Fa1XJ65ZpdAi5NMWMplOVxSwQYbnhzcvGSuFHpYJrKw2tAQLHMx3T3W8EPSqsNLpzEpx8ERlZIy5isrqQkSF7UP7MN8ON8dX1wJzj9alK8AIZgujUNeU2KQid_A5VK0_m7PCeyd4Cc_2QW3nEggpRWQIOv65WeLSvuUOUn1Wpe_FfD0"
          alt="Aircraft above clouds"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 to-slate-900/20" />

        <motion.div
          className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-20"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="max-w-4xl text-6xl font-bold leading-[1.03] tracking-tight text-white md:text-8xl">Your Journey Starts With the Perfect Flight</h1>
          <p className="mt-5 max-w-3xl text-2xl text-slate-200">
            Discover affordable flights, compare airlines, and book your next trip in seconds — all in one place.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/register" className="inline-flex h-[72px] min-w-[225px] items-center justify-center gap-3 rounded-2xl bg-blue-700 px-7 text-2xl font-bold text-white shadow-lg shadow-blue-900/30 hover:bg-blue-600">
              Get Started <ArrowRight size={24} />
            </Link>
            <a href="#features" className="inline-flex h-[72px] min-w-[205px] items-center justify-center rounded-2xl border border-white/45 bg-slate-500/45 px-7 text-2xl font-bold text-white backdrop-blur">
              Learn More
            </a>
          </div>
        </motion.div>
      </section>

      <section id="features" className="bg-slate-50 py-24">
        <div className="mx-auto w-full max-w-7xl px-6">
          <motion.p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600" {...fadeIn}>
            Operational Excellence
          </motion.p>

          <motion.h2 className="mt-4 text-5xl font-bold text-slate-900" {...fadeIn} transition={{ delay: 0.1 }}>
            Platform Capabilities
          </motion.h2>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">

            <motion.article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 md:col-span-2" {...fadeIn}>
              <div>
                <Plane size={28} className="text-blue-600" />
                <h3 className="mt-4 text-2xl font-bold text-slate-900">Real-time Flight Tracking</h3>
                <p className="mt-2 text-slate-600">Live telemetry and precise global positioning for every aircraft in your fleet with sub-second updates.</p>
              </div>
              <div className="relative mt-10 h-40 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
                <div className="absolute top-1/2 left-1/4 h-[1px] w-32 -rotate-[15deg] bg-blue-600/30"></div>
                <div className="absolute top-[45%] left-[48%] h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)] animate-pulse"></div>
              </div>
            </motion.article>

            <motion.article className="rounded-2xl border border-slate-200 bg-white p-8" {...fadeIn}>
              <ShieldCheck size={28} className="text-slate-700" />
              <h3 className="mt-4 text-2xl font-bold text-slate-900">Intelligent RBAC</h3>
              <p className="mt-2 text-slate-600">Enterprise access control for sensitive aviation data.</p>
            </motion.article>

            <motion.article className="rounded-2xl border border-slate-200 bg-white p-8" {...fadeIn}>
              <BarChart3 size={28} className="text-orange-600" />
              <h3 className="mt-4 text-2xl font-bold text-slate-900">Revenue Analytics</h3>
              <p className="mt-2 text-slate-600">Forecast demand and optimize revenue in real time.</p>
            </motion.article>

            <motion.article className="rounded-2xl bg-slate-900 p-10 text-white md:col-span-4 flex flex-col md:flex-row items-center gap-12" {...fadeIn}>
              <div className="md:w-1/2">
                <Globe size={28} />
                <h3 className="mt-4 text-3xl font-bold">Global Fleet Control</h3>
                <p className="mt-2 text-slate-300">Manage maintenance cycles, fuel consumption, and crew logistics across multiple hubs from a single unified command center. Designed for massive scalability.</p>
              </div>
              <div className="md:w-1/2 w-full grid grid-cols-2 gap-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-1 text-4xl font-bold text-blue-400">240+</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Aircraft</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-1 text-4xl font-bold text-blue-400">99.9%</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dispatch Reliability</div>
                </div>
              </div>
            </motion.article>

          </div>
        </div>
      </section>

      <section id="overview" className="bg-white py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 md:grid-cols-2">

          <motion.div {...fadeIn} className="relative">
            <img
              className="w-full rounded-3xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjPe29INsXtuAwRYApzTcO3yX1aeoF72Xr3FsKJ4SobMmHftWiWzVsei-KrKomtiOVpBHMdAhzDS079O6gAnptAWLupTTnKpwVtIr6385M3sVd49zWZBqILWCOZgVR1ZS4qzxAAoQEKeoJJTJaYbvALdF_gj5kU9QSPhn-k5fk7sK8WtZWw4VXeF2tFHgfgqn1EL7JdR43SBO4YJzlyzWynvkeKiJt2va7pt3AuCDh8fZCgTungGGOtFkyvyNjYGuzOBKtvwW6bzmt"
              alt="Operations Center"
            />
            <motion.div 
              className="absolute -bottom-8 -right-8 hidden rounded-2xl bg-blue-600 p-6 shadow-2xl lg:block"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white opacity-80">System Health</div>
              <div className="flex items-center gap-3 text-lg font-bold text-white">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                </span>
                All Systems Operational
              </div>
            </motion.div>
          </motion.div>

          <motion.div {...fadeIn}>
            <h2 className="text-5xl font-bold text-slate-900">Ready to Take Off?</h2>
            <p className="mt-4 text-lg text-slate-600">Join thousands of aviation professionals. Sign in to your dashboard or create a new account to start booking and managing today. Our streamlined onboarding process ensures your team is airborne within hours, not weeks.</p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-center gap-4"><div className="rounded-full bg-blue-600/10 p-1 text-blue-600"><CheckCircle2 size={24} /></div> <span className="font-medium text-slate-700">Instant access to global flight manifests</span></li>
              <li className="flex items-center gap-4"><div className="rounded-full bg-blue-600/10 p-1 text-blue-600"><CheckCircle2 size={24} /></div> <span className="font-medium text-slate-700">Automated crew compliance checking</span></li>
              <li className="flex items-center gap-4"><div className="rounded-full bg-blue-600/10 p-1 text-blue-600"><CheckCircle2 size={24} /></div> <span className="font-medium text-slate-700">24/7 Priority operational support</span></li>
            </ul>
          </motion.div>

        </div>
      </section>

      <section id="cta" className="py-24">
        <div className="mx-auto w-full max-w-7xl px-6">
          <motion.div className="relative overflow-hidden rounded-[2.5rem] bg-blue-600 p-12 text-center text-white shadow-2xl md:p-20" {...fadeIn}>
            <div className="pointer-events-none absolute inset-0 opacity-10">
              <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%" className="fill-white">
                <path d="M0 100 L100 0 L100 100 Z" />
              </svg>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Elevate Your Fleet Efficiency Today</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl">Experience the most intuitive aviation management suite ever built. No long-term contracts, just pure performance.</p>

              <div className="mt-12 flex flex-col justify-center gap-6 sm:flex-row">
                <Link to="/register" className="rounded-xl bg-white px-12 py-5 text-lg font-bold text-blue-600 shadow-lg transition-all hover:translate-y-[-2px] hover:shadow-xl active:scale-95">Register</Link>
                <Link to="/login" className="rounded-xl border-2 border-white/40 px-12 py-5 text-lg font-bold text-white transition-all hover:bg-white/10 active:scale-95">Sign In</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-10 px-6 md:flex-row md:items-center">
          <div className="space-y-4">
            <div className="text-xl font-bold text-slate-900">AeroManager Aviation Systems</div>
            <p className="text-sm text-slate-500">
              © 2024 AeroManager Aviation Systems. Precision in Every Flight.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {["Terms of Service", "Privacy Policy", "Safety Standards", "Support"].map((link) => (
              <a 
                key={link} 
                href="#" 
                className="text-sm text-slate-500 decoration-slate-200 underline underline-offset-4 transition-colors hover:text-blue-600"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
};