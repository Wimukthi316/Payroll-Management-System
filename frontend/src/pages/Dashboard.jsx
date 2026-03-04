import { useEffect, useState } from 'react';
import {
  Users, DollarSign, Package, TrendingUp,
  ArrowUpRight, ArrowDownRight, Activity, Clock,
  Calendar, ChevronRight,
} from 'lucide-react';
import { employeeAPI, payrollAPI, assetAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ── Mini chart bar ────────────────────────────────────────────────────────── */
function MiniBar({ heights = [] }) {
  return (
    <div className="flex items-end gap-0.5 h-10">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-indigo-500/30 transition-all duration-500"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

/* ── Stat card ─────────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, change, trend, color, bg, bars, delay = 0 }) {
  const up = trend === 'up';
  return (
    <div
      className="card group flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={20} className={color} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
          {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-2xl font-black text-slate-800 leading-none mb-1">{value}</p>
        <p className="text-xs font-medium text-slate-400">{label}</p>
      </div>
      {bars && (
        <div className="mt-auto pt-2 border-t border-slate-50">
          <MiniBar heights={bars} />
        </div>
      )}
    </div>
  );
}

/* ── Skeleton ──────────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="card animate-pulse flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl skeleton" />
        <div className="w-14 h-5 rounded-full skeleton" />
      </div>
      <div>
        <div className="w-20 h-7 skeleton rounded-lg mb-2" />
        <div className="w-28 h-3 skeleton rounded" />
      </div>
    </div>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RECENT_ACTIVITY = [
  { text: 'Payroll generated for February 2026', time: '10 min ago', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { text: 'New employee Isabella Kim onboarded', time: '2 hrs ago', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { text: 'Asset LAPTOP-042 transferred to IT Dept', time: '5 hrs ago', icon: Package, color: 'text-violet-600', bg: 'bg-violet-50' },
  { text: 'Salary updated for Marcus Reid', time: '1 day ago', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  { text: 'Asset maintenance scheduled: Projector', time: '2 days ago', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-100' },
];

export default function Dashboard() {
  const { user }    = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats]   = useState({ employees: 0, payroll: 0, assets: 0, expenses: 0 });
  const today = new Date();

  useEffect(() => {
    async function loadStats() {
      try {
        const [empRes, payRes, astRes] = await Promise.allSettled([
          employeeAPI.getAll(),
          payrollAPI.getAll(),
          assetAPI.getAll(),
        ]);
        const employees = empRes.status === 'fulfilled' ? (empRes.value.data?.length ?? 0) : 0;
        const payrolls  = payRes.status === 'fulfilled' ? payRes.value.data : [];
        const assets    = astRes.status === 'fulfilled' ? (astRes.value.data?.length ?? 0) : 0;
        const totalPay  = Array.isArray(payrolls)
          ? payrolls.reduce((s, p) => s + (p.netPay ?? p.basicSalary ?? 0), 0)
          : 0;
        setStats({ employees, payroll: totalPay, assets, expenses: totalPay * 0.12 });
      } catch {
        /* backend may be offline — use zeros */
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const fmt = (n) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(1)}M`
      : n >= 1000
      ? `$${(n / 1000).toFixed(1)}k`
      : `$${n.toFixed(0)}`;

  const STAT_CARDS = [
    {
      icon: Users,
      label: 'Total Employees',
      value: loading ? '—' : stats.employees.toString(),
      change: '+4.2%',
      trend: 'up',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      bars: [40, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 90],
    },
    {
      icon: DollarSign,
      label: 'Total Payroll Disbursed',
      value: loading ? '—' : fmt(stats.payroll),
      change: '+8.1%',
      trend: 'up',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      bars: [30, 42, 38, 55, 50, 68, 60, 75, 70, 82, 78, 95],
    },
    {
      icon: Package,
      label: 'Registered Assets',
      value: loading ? '—' : stats.assets.toString(),
      change: '-1.3%',
      trend: 'down',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      bars: [65, 60, 68, 55, 62, 58, 70, 52, 60, 55, 58, 50],
    },
    {
      icon: TrendingUp,
      label: 'Operating Expenses',
      value: loading ? '—' : fmt(stats.expenses),
      change: '+2.5%',
      trend: 'up',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      bars: [20, 35, 28, 42, 38, 50, 44, 58, 52, 65, 60, 70],
    },
  ];

  return (
    <div className="page-container space-y-8">
      {/* ── Welcome Banner ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 p-6 sm:p-8 text-white animate-fade-in-up">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3Ccircle cx='23' cy='23' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="absolute top-[-30px] right-[-30px] w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-[-20px] left-[30%] w-32 h-32 bg-violet-400/20 rounded-full blur-xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">
              <Calendar size={13} className="inline mr-1.5 -mt-0.5" />
              {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black mb-1">
              Good {today.getHours() < 12 ? 'morning' : today.getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p className="text-indigo-200 text-sm max-w-sm">
              Your payroll dashboard is all up to date. Here's what's happening today.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="/payroll" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-700 rounded-xl text-sm font-bold shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              Run Payroll <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : STAT_CARDS.map((card, i) => <StatCard key={card.label} {...card} delay={i * 60} />)
          }
        </div>
      </section>

      {/* ── Chart + Activity ──────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Payroll Chart Placeholder */}
        <div className="lg:col-span-3 card animate-fade-in-up animation-delay-200">
          <div className="section-header mb-4">
            <div>
              <h3 className="section-title">Payroll Overview</h3>
              <p className="section-subtitle">Monthly disbursement — {today.getFullYear()}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-blue">
                <Activity size={11} className="mr-1" />
                Live
              </span>
            </div>
          </div>

          {/* Chart area */}
          <div className="relative h-56 bg-gradient-to-b from-indigo-50/60 to-transparent rounded-xl border border-slate-100 flex items-end px-4 pb-4 gap-2 overflow-hidden">
            {/* Y-axis guide lines */}
            {[75, 50, 25].map((p) => (
              <div
                key={p}
                className="absolute left-4 right-4 border-t border-dashed border-slate-200"
                style={{ bottom: `${p}%` }}
              />
            ))}
            {/* Bars */}
            {[42, 58, 50, 68, 62, 78, 70, 85, 80, 90, 88, 95].map((h, i) => (
              <div key={i} className="relative flex-1 group">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-500 hover:from-violet-600 hover:to-violet-400 cursor-pointer"
                  style={{ height: `${h}%` }}
                />
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap pointer-events-none z-10">
                  {h}k
                </div>
              </div>
            ))}
          </div>

          {/* Month labels */}
          <div className="flex gap-2 px-4 mt-2">
            {MONTHS.map((m) => (
              <span key={m} className="flex-1 text-center text-[10px] text-slate-400 font-medium">{m}</span>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 card animate-fade-in-up animation-delay-300">
          <h3 className="section-title mb-1">Recent Activity</h3>
          <p className="section-subtitle mb-5">Latest system events</p>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map(({ text, time, icon: Icon, color, bg }, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon size={14} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 font-medium leading-snug">{text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Access ─────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-3 gap-4 animate-fade-in-up animation-delay-400">
        {[
          { href: '/employees', icon: Users,      label: 'View All Employees', desc: 'Manage team members',    color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100 hover:border-indigo-300' },
          { href: '/payroll',   icon: DollarSign, label: 'Payroll Processing',  desc: 'Generate & view payslips', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100 hover:border-emerald-300' },
          { href: '/assets',    icon: Package,    label: 'Asset Registry',      desc: 'Track company assets',  color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100 hover:border-violet-300' },
        ].map(({ href, icon: Icon, label, desc, color, bg, border }) => (
          <a
            key={href}
            href={href}
            className={`flex items-center gap-4 p-5 bg-white rounded-2xl border ${border} shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 group`}
          >
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
              <Icon size={20} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
