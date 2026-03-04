import { Link } from 'react-router-dom';
import {
  Zap, Users, DollarSign, Package, ShieldCheck,
  BarChart3, Globe, ArrowRight, CheckCircle2, ChevronRight,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Users,
    title: 'Employee Management',
    desc: 'Onboard, manage, and organise your entire workforce with role-based access controls and rich profile data.',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
  },
  {
    icon: DollarSign,
    title: 'Automated Payroll',
    desc: 'Calculate salaries, overtime, EPF, ETF, and net pay automatically in seconds. Generate payslips with one click.',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    icon: Package,
    title: 'Asset Tracking',
    desc: 'Track every asset from purchase to disposal. Manage maintenance schedules, transfers, and depreciation.',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
  },
  {
    icon: BarChart3,
    title: 'Insightful Reports',
    desc: 'Real-time dashboards with cost analysis, headcount trends, and asset lifecycle visibility at a glance.',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Compliant',
    desc: 'Enterprise-grade security with JWT authentication, encrypted data, and full audit trail on all operations.',
    bg: 'bg-sky-50',
    text: 'text-sky-600',
  },
  {
    icon: Globe,
    title: 'Cloud Ready',
    desc: 'Deploy anywhere — on-prem or cloud. Built on Node.js & MongoDB with a blazing Vite + React frontend.',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
  },
];

const STATS = [
  { value: '10×', label: 'Faster payroll processing' },
  { value: '99.9%', label: 'Platform uptime' },
  { value: '100%', label: 'Compliance coverage' },
  { value: '< 1s', label: 'Average query response' },
];

const TESTIMONIALS = [
  {
    quote: "PayrollPro cut our monthly payroll processing from 3 days down to under an hour. Absolutely game-changing.",
    author: "Sarah Chen",
    title: "VP of HR, TechNova Inc.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=facearea&facepad=2",
  },
  {
    quote: "The asset tracking module alone saved us from losing track of 200+ devices. Clean, intuitive, and reliable.",
    author: "Marcus Reid",
    title: "IT Director, Meridian Group",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=facearea&facepad=2",
  },
  {
    quote: "Finally, a payroll system that looks as good as it works. Our finance team loves the dashboard.",
    author: "Priya Sharma",
    title: "CFO, Luminary Ventures",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=facearea&facepad=2",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navigation ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-100/60 shadow-[0_2px_16px_rgb(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-btn group-hover:shadow-xl transition-shadow duration-300">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-800 text-xl tracking-tight">
              Payroll<span className="text-indigo-600">Pro</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Docs', 'About'].map((item) => (
              <a
                key={item}
                href="#features"
                className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link to="/signin" className="btn-secondary hidden sm:inline-flex">Sign In</Link>
            <Link to="/signup" className="btn-primary">
              Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Gradient BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700" />
        {/* Noise/pattern overlay */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        {/* Glow orbs */}
        <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-violet-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-pulse-slow animation-delay-300" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Copy */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 border border-white/25 rounded-full text-xs font-semibold text-white mb-6 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                Now available — v2.0 with Asset Tracking
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight mb-6">
                Payroll &amp; Assets,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200">
                  Perfectly Managed.
                </span>
              </h1>
              <p className="text-lg text-indigo-100 leading-relaxed max-w-[480px] mb-8">
                The all-in-one modern platform for HR, Finance, and IT teams. Automate payroll, track assets, and gain insights — all without the spreadsheet chaos.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/signup" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-indigo-700 font-bold rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.18)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.25)] hover:-translate-y-0.5 transition-all duration-200 text-base">
                  Start for Free <ArrowRight size={17} />
                </Link>
                <Link to="/signin" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 transition-all duration-200 text-sm backdrop-blur-sm">
                  Sign In <ChevronRight size={15} />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-5 mt-7">
                {['No credit card required', 'Free 30-day trial', 'SOC2 Compliant'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-indigo-200 font-medium">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="relative animate-fade-in animation-delay-200 hidden lg:block">
              <div className="absolute inset-[-20px] rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 blur-xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-[0_40px_100px_rgb(0,0,0,0.35)] ring-1 ring-white/20">
                <img
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1920&h=1080&auto=format&fit=crop"
                  alt="PayrollPro Dashboard"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
                {/* Glass overlay on image bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-indigo-900/60 to-transparent" />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 animate-fade-in animation-delay-400">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <DollarSign size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Payroll Processed</p>
                  <p className="text-lg font-bold text-slate-800">$248,920</p>
                </div>
              </div>
              {/* Floating team card */}
              <div className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-card p-3 flex items-center gap-2 animate-fade-in animation-delay-300">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=40&h=40&auto=format&fit=facearea&facepad=2',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=40&h=40&auto=format&fit=facearea&facepad=2',
                    'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=40&h=40&auto=format&fit=facearea&facepad=2',
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-7 h-7 rounded-full ring-2 ring-white object-cover" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-slate-700 pr-1">87 employees</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 10 720 30C480 50 240 10 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, label }, i) => (
              <div
                key={label}
                className={`text-center p-6 rounded-2xl border border-slate-100 bg-slate-50/60 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <p className="text-4xl font-black text-indigo-600 mb-1">{value}</p>
                <p className="text-sm text-slate-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4 border border-indigo-100">
              Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">
              Everything you need,
              <span className="text-gradient"> nothing you don't.</span>
            </h2>
            <p className="text-base text-slate-500 max-w-xl mx-auto">
              A meticulously crafted toolkit to manage your payroll and asset lifecycle — built for speed, clarity, and compliance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, bg, text }, i) => (
              <div
                key={title}
                className="card group cursor-pointer hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={22} className={text} />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-800 mb-3">Loved by finance &amp; HR teams</h2>
            <p className="text-slate-500 text-sm">Trusted by growing companies of all sizes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, author, title: authorTitle, avatar }, i) => (
              <div
                key={author}
                className="card hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <p className="text-slate-600 text-sm leading-relaxed mb-5">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={avatar} alt={author} className="w-10 h-10 rounded-full ring-2 ring-indigo-100 object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{author}</p>
                    <p className="text-xs text-slate-400">{authorTitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to transform your operations?
          </h2>
          <p className="text-indigo-200 text-base mb-8 max-w-md mx-auto">
            Join hundreds of businesses automating payroll and asset management with PayrollPro.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-base">
              Start Free Trial <ArrowRight size={16} />
            </Link>
            <Link to="/signin" className="inline-flex items-center gap-2 px-7 py-4 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 transition-all duration-200 text-sm backdrop-blur-sm">
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Zap size={15} className="text-white" />
              </div>
              <span className="font-extrabold text-white text-lg">Payroll<span className="text-indigo-400">Pro</span></span>
            </div>
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} PayrollPro. Built with React, Node.js &amp; MongoDB.</p>
            <div className="flex gap-6 text-xs text-slate-500">
              {['Privacy', 'Terms', 'Security'].map((item) => (
                <a key={item} href="#" className="hover:text-slate-300 transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
