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
            <Link to="/" className={`text-4xl font-bold tracking-tight ${isScrolled ? 'text-blue-700' : 'text-white'}`}>AeroManager</Link>
            <nav className={`items-center gap-8 text-base ${mobileMenuOpen ? 'absolute left-0 right-0 top-full flex flex-col border-b border-slate-200 bg-white p-4 md:static md:flex-row md:border-0 md:bg-transparent md:p-0' : 'hidden md:flex'}`}>
              <a href="#features" className={`${isScrolled ? 'text-slate-600' : 'text-slate-200'} hover:text-blue-600`}>Solutions</a>
              <a href="#features" className={`${isScrolled ? 'text-slate-600' : 'text-slate-200'} hover:text-blue-600`}>Flight Tracking</a>
              <a href="#overview" className={`${isScrolled ? 'text-slate-600' : 'text-slate-200'} hover:text-blue-600`}>Fleet</a>
              <a href="#cta" className={`${isScrolled ? 'text-slate-600' : 'text-slate-200'} hover:text-blue-600`}>Pricing</a>
            </nav>
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
          <h1 className="max-w-4xl text-6xl font-bold leading-[1.03] tracking-tight text-white md:text-8xl">Precision Aviation Management for the Modern Sky</h1>
          <p className="mt-5 max-w-3xl text-2xl text-slate-200">
            Streamline your fleet operations, bookings, and crew management with our all-in-one cloud-based platform.
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

            <motion.article className="rounded-2xl border border-slate-200 bg-white p-8 md:col-span-2" {...fadeIn}>
              <Plane size={28} className="text-blue-600" />
              <h3 className="mt-4 text-2xl font-bold text-slate-900">Real-time Flight Tracking</h3>
              <p className="mt-2 text-slate-600">Live telemetry and global positioning updates for every aircraft.</p>
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

            <motion.article className="rounded-2xl bg-slate-900 p-10 text-white md:col-span-4" {...fadeIn}>
              <Globe size={28} />
              <h3 className="mt-4 text-3xl font-bold">Global Fleet Control</h3>
              <p className="mt-2 text-slate-300">Manage operations across multiple hubs from one dashboard.</p>
            </motion.article>

          </div>
        </div>
      </section>

      <section id="overview" className="bg-white py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 md:grid-cols-2">

          <motion.div {...fadeIn}>
            <img
              className="w-full rounded-3xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjPe29INsXtuAwRYApzTcO3yX1aeoF72Xr3FsKJ4SobMmHftWiWzVsei-KrKomtiOVpBHMdAhzDS079O6gAnptAWLupTTnKpwVtIr6385M3sVd49zWZBqILWCOZgVR1ZS4qzxAAoQEKeoJJTJaYbvALdF_gj5kU9QSPhn-k5fk7sK8WtZWw4VXeF2tFHgfgqn1EL7JdR43SBO4YJzlyzWynvkeKiJt2va7pt3AuCDh8fZCgTungGGOtFkyvyNjYGuzOBKtvwW6bzmt"
              alt="Operations Center"
            />
          </motion.div>

          <motion.div {...fadeIn}>
            <h2 className="text-5xl font-bold text-slate-900">Ready to Take Off?</h2>
            <p className="mt-4 text-lg text-slate-600">Join aviation teams managing fleets and operations in one system.</p>

            <ul className="mt-5 space-y-3">
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-600" /> Instant flight manifests</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-600" /> Crew compliance automation</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-600" /> 24/7 operational support</li>
            </ul>
          </motion.div>

        </div>
      </section>

      <section id="cta" className="py-24">
        <div className="mx-auto w-full max-w-7xl px-6">
          <motion.div className="rounded-[2.5rem] bg-blue-600 p-12 text-center text-white shadow-2xl" {...fadeIn}>
            <h2 className="text-5xl font-bold">Elevate Your Fleet Efficiency Today</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-blue-50">Move your aviation operations to a modern platform.</p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <Link to="/register" className="rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-700">Register</Link>
              <Link to="/login" className="rounded-xl border border-white/50 px-8 py-4 text-lg font-bold text-white">Sign In</Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};