import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Zap, Users, DollarSign, Package, ShieldCheck,
  BarChart3, Globe, ArrowRight, CheckCircle2, ChevronRight,
  Sparkles, TrendingUp, Clock, Lock,
} from 'lucide-react';

/* ─────────────────────────── data ─────────────────────────── */
const FEATURES = [
  {
    icon: Users,
    title: 'Employee Management',
    desc: 'Onboard, manage, and organise your entire workforce with role-based access controls and rich profile data.',
    accent: 'from-cyan-400 to-blue-500',
    glow: 'group-hover:shadow-[0_0_36px_rgba(6,182,212,0.18)]',
    border: 'group-hover:border-cyan-500/30',
  },
  {
    icon: DollarSign,
    title: 'Automated Payroll',
    desc: 'Calculate salaries, overtime, EPF, ETF, and net pay automatically in seconds. One-click payslip generation.',
    accent: 'from-emerald-400 to-teal-500',
    glow: 'group-hover:shadow-[0_0_36px_rgba(52,211,153,0.18)]',
    border: 'group-hover:border-emerald-500/30',
  },
  {
    icon: Package,
    title: 'Asset Tracking',
    desc: 'Track every asset from purchase to disposal. Manage maintenance schedules, transfers, and depreciation.',
    accent: 'from-violet-400 to-purple-600',
    glow: 'group-hover:shadow-[0_0_36px_rgba(167,139,250,0.18)]',
    border: 'group-hover:border-violet-500/30',
  },
  {
    icon: BarChart3,
    title: 'Insightful Reports',
    desc: 'Real-time dashboards with cost analysis, headcount trends, and asset lifecycle visibility at a glance.',
    accent: 'from-amber-400 to-orange-500',
    glow: 'group-hover:shadow-[0_0_36px_rgba(251,191,36,0.18)]',
    border: 'group-hover:border-amber-500/30',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Compliant',
    desc: 'Enterprise-grade security with JWT authentication, encrypted data, and full audit trail on all operations.',
    accent: 'from-sky-400 to-indigo-500',
    glow: 'group-hover:shadow-[0_0_36px_rgba(56,189,248,0.18)]',
    border: 'group-hover:border-sky-500/30',
  },
  {
    icon: Globe,
    title: 'Cloud Ready',
    desc: 'Deploy anywhere — on-prem or cloud. Built on Node.js & MongoDB with a blazing-fast Vite + React frontend.',
    accent: 'from-fuchsia-400 to-pink-600',
    glow: 'group-hover:shadow-[0_0_36px_rgba(232,121,249,0.18)]',
    border: 'group-hover:border-fuchsia-500/30',
  },
];

const STATS = [
  { value: '10×',   label: 'Faster payroll cycles',  icon: TrendingUp  },
  { value: '99.9%', label: 'Platform uptime SLA',     icon: Clock       },
  { value: '100%',  label: 'Compliance coverage',     icon: ShieldCheck },
  { value: '< 1s',  label: 'Average response time',   icon: Zap         },
];

const TESTIMONIALS = [
  {
    quote: 'PayrollPro cut our monthly payroll processing from 3 days down to under an hour. Absolutely game-changing for our HR team.',
    author: 'Sarah Chen',
    title: 'VP of HR, TechNova Inc.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=facearea&facepad=2',
  },
  {
    quote: 'The asset tracking module alone saved us from losing track of 200+ devices. Clean, intuitive, and rock-solid reliable.',
    author: 'Marcus Reid',
    title: 'IT Director, Meridian Group',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=facearea&facepad=2',
  },
  {
    quote: 'Finally, a payroll system that looks as good as it works. Our finance team genuinely enjoys using the dashboard every single day.',
    author: 'Priya Sharma',
    title: 'CFO, Luminary Ventures',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=facearea&facepad=2',
  },
];

const TRUST_LOGOS = ['Goldman', 'Stripe', 'Notion', 'Linear', 'Vercel', 'Figma'];

/* ─────────────────────── animation helpers ──────────────────── */
function Reveal({ children, className = '', delay = 0, y = 32 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════ COMPONENT ════════════════════════════ */
export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050810] text-slate-100 overflow-x-hidden">

      {/* ── CSS grid texture overlay ─────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right,  #6366f1 1px, transparent 1px),
            linear-gradient(to bottom, #6366f1 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />

      {/* ══════════════ NAVBAR ══════════════════════════════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050810]/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_32px_rgba(6,182,212,0.65)] transition-shadow duration-300">
              <Zap size={17} className="text-white" />
            </div>
            <span className="font-extrabold text-white text-xl tracking-tight">
              Payroll
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Pro</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Docs', 'About'].map((item) => (
              <a
                key={item}
                href="#features"
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              to="/signin"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_32px_rgba(6,182,212,0.55)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ══════════════ HERO ════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-20">
        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute top-[-8%] left-[12%] w-[750px] h-[750px] bg-blue-700/20 blur-[150px] rounded-full" />
        <div className="pointer-events-none absolute top-[0%] right-[8%] w-[500px] h-[500px] bg-violet-700/20 blur-[130px] rounded-full" />
        <div className="pointer-events-none absolute bottom-0 left-[-5%] w-[400px] h-[400px] bg-cyan-600/10 blur-[110px] rounded-full" />

        {/* Hero copy */}
        <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold backdrop-blur-sm"
          >
            <Sparkles size={12} />
            Introducing v2.0 — Asset Tracking + Advanced Payroll
            <ChevronRight size={12} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-[88px] font-black tracking-tight leading-[0.93] mb-6"
          >
            <span className="text-white">Payroll &amp; Assets.</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-500 bg-clip-text text-transparent">
              Brilliantly Managed.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
            className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            The all-in-one enterprise platform for HR, Finance &amp; IT teams.
            Automate payroll, track every asset, and gain instant clarity — no spreadsheet chaos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-base font-bold rounded-xl shadow-[0_0_40px_rgba(6,182,212,0.35)] hover:shadow-[0_0_64px_rgba(6,182,212,0.55)] hover:-translate-y-1 transition-all duration-300"
            >
              Start for Free <ArrowRight size={17} />
            </Link>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 px-7 py-4 bg-white/5 border border-white/15 text-white text-sm font-semibold rounded-xl hover:bg-white/10 hover:border-white/25 transition-all duration-200 backdrop-blur-sm"
            >
              <Lock size={13} className="text-slate-400" /> Sign In to Dashboard
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {['No credit card required', 'Free 30-day trial', 'SOC2 Compliant'].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <CheckCircle2 size={13} className="text-cyan-500" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 64 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
          className="relative z-10 max-w-5xl mx-auto mt-20 w-full"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.85)]">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 h-9 bg-white/[0.04] border-b border-white/[0.07]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
              <div className="ml-4 flex-1 h-5 max-w-xs rounded-md bg-white/[0.05] border border-white/[0.07] flex items-center px-3">
                <span className="text-[10px] text-slate-600">app.payrollpro.io/dashboard</span>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&h=900&auto=format&fit=crop"
              alt="PayrollPro Dashboard"
              className="w-full h-auto object-cover opacity-60 mix-blend-luminosity"
              loading="eager"
            />
            {/* Bottom gradient fade into page bg */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/30 to-transparent" />
          </div>

          {/* Floating stat card — bottom-left */}
          <div className="absolute bottom-8 -left-3 sm:-left-8 bg-slate-900/95 border border-white/10 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
              <DollarSign size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Monthly Payroll</p>
              <p className="text-lg font-black text-white">$248,920</p>
            </div>
          </div>

          {/* Floating team card — top-right */}
          <div className="absolute top-14 -right-3 sm:-right-8 bg-slate-900/95 border border-white/10 backdrop-blur-xl rounded-2xl p-3 flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="flex -space-x-2">
              {[
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=40&h=40&auto=format&fit=facearea&facepad=2',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=40&h=40&auto=format&fit=facearea&facepad=2',
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=40&h=40&auto=format&fit=facearea&facepad=2',
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-7 h-7 rounded-full ring-2 ring-slate-900 object-cover opacity-80 mix-blend-luminosity brightness-125"
                />
              ))}
            </div>
            <p className="text-xs font-bold text-white pr-1">87 employees active</p>
          </div>
        </motion.div>
      </section>

      {/* ══════════════ TRUST BAR ══════════════════════════════ */}
      <section className="py-14 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-4">
          <Reveal>
            <p className="text-center text-xs font-semibold text-slate-600 uppercase tracking-[0.22em] mb-8">
              Trusted by teams at
            </p>
          </Reveal>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
            {TRUST_LOGOS.map((logo, i) => (
              <Reveal key={logo} delay={i * 0.06}>
                <span className="text-slate-600 text-sm font-bold tracking-wide uppercase hover:text-slate-400 transition-colors duration-200 cursor-default select-none">
                  {logo}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ═══════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/4 top-0 w-[400px] h-[400px] bg-indigo-700/10 blur-[100px] rounded-full" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <Reveal key={label} delay={i * 0.08} className="h-full">
                <div className="h-full flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-cyan-500/25 hover:bg-white/[0.05] transition-all duration-500 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:shadow-[0_0_22px_rgba(6,182,212,0.2)] transition-all duration-300">
                    <Icon size={18} className="text-cyan-400" />
                  </div>
                  <p className="text-4xl font-black bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-1">
                    {value}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ════════════════════════════════ */}
      <section id="features" className="py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute top-1/3 right-0 w-[500px] h-[500px] bg-violet-700/10 blur-[120px] rounded-full" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-700/10 blur-[100px] rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <Reveal className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-violet-500/25 bg-violet-500/10 text-violet-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={11} /> Platform Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              Everything you need,
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                nothing you don&apos;t.
              </span>
            </h2>
            <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
              A meticulously crafted toolkit for your payroll &amp; asset lifecycle — built for speed, clarity, and compliance.
            </p>
          </Reveal>

          {/* Bento-style feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, accent, glow, border }, i) => (
              <Reveal key={title} delay={i * 0.07} className="h-full">
                <div
                  className={`group h-full p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md hover:-translate-y-2 transition-all duration-500 ${glow} ${border}`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${accent} p-px mb-5`}>
                    <div className="w-full h-full rounded-[10px] bg-[#050810] flex items-center justify-center">
                      <Icon size={20} className="text-white opacity-90" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-700/8 blur-[100px] rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
              Loved by finance &amp; HR teams
            </h2>
            <p className="text-slate-500 text-sm">Real feedback from real users running real payroll</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, author, title: authorTitle, avatar }, i) => (
              <Reveal key={author} delay={i * 0.1} className="h-full">
                <div className="group h-full flex flex-col p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md hover:-translate-y-2 hover:border-indigo-500/30 hover:shadow-[0_0_40px_rgba(99,102,241,0.12)] transition-all duration-500">
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <svg key={si} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-6">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                    <img
                      src={avatar}
                      alt={author}
                      className="w-10 h-10 rounded-full ring-1 ring-white/10 object-cover opacity-80 mix-blend-luminosity brightness-125"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{author}</p>
                      <p className="text-xs text-slate-500">{authorTitle}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ═════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        {/* Dual glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="w-[700px] h-[400px] bg-cyan-700/15 blur-[140px] rounded-full" />
          <div className="absolute w-[450px] h-[400px] bg-violet-700/15 blur-[130px] rounded-full translate-x-48" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Free 30-day trial — no credit card needed
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 tracking-tight">
              Ready to transform
              <br />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                your operations?
              </span>
            </h2>
            <p className="text-slate-400 text-base mb-10 max-w-md mx-auto leading-relaxed">
              Join hundreds of modern businesses automating payroll &amp; assets.
              Set up your workspace in under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-base font-bold rounded-xl shadow-[0_0_40px_rgba(6,182,212,0.35)] hover:shadow-[0_0_64px_rgba(6,182,212,0.55)] hover:-translate-y-1 transition-all duration-300"
              >
                Start Free Trial <ArrowRight size={17} />
              </Link>
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 px-7 py-4 bg-white/[0.04] border border-white/[0.1] text-slate-300 text-sm font-semibold rounded-xl hover:bg-white/[0.08] hover:text-white transition-all duration-200"
              >
                Already have an account? <ChevronRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.35)]">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-extrabold text-white text-lg">
                Payroll<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Pro</span>
              </span>
            </div>
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} PayrollPro. Built with React, Node.js &amp; MongoDB.
            </p>
            <div className="flex gap-6 text-xs text-slate-600">
              {['Privacy', 'Terms', 'Security'].map((item) => (
                <a key={item} href="#" className="hover:text-slate-300 transition-colors duration-200">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
