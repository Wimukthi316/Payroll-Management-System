import { useEffect, useState } from 'react';
import {
  Users, Package, DollarSign, TrendingUp,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle,
  Sparkles, ChevronRight,
} from 'lucide-react';
import api from '../services/api';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, gradient, change, changeType, sub }) => (
  <div className="relative bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgb(0,0,0,0.09)] transition-all duration-300 overflow-hidden cursor-default group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.08em]">{label}</p>
        <p className="mt-1.5 text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
        {sub && <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p>}
      </div>
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${gradient} shadow-md`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
    {change !== undefined && (
      <div className={`flex items-center gap-1 text-[11px] font-semibold ${changeType === 'up' ? 'text-emerald-600' : 'text-rose-500'}`}>
        {changeType === 'up' ? <ArrowUpRight size={13} className="shrink-0" /> : <ArrowDownRight size={13} className="shrink-0" />}
        <span>{change}</span>
        <span className="text-slate-400 font-normal ml-0.5">vs last month</span>
      </div>
    )}
  </div>
);

const recentActivity = [
  { id: 1, action: 'New employee added',   detail: 'John Perera — Software Engineer',  time: '2 min ago',  icon: Users,       color: 'text-indigo-500',  bg: 'bg-indigo-50',  ring: 'ring-indigo-100' },
  { id: 2, action: 'Payroll approved',     detail: 'February 2026 — 24 employees',    time: '1 hr ago',   icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
  { id: 3, action: 'Asset registered',     detail: 'Dell Laptop — IT Department',     time: '3 hrs ago',  icon: Package,     color: 'text-amber-500',   bg: 'bg-amber-50',   ring: 'ring-amber-100' },
  { id: 4, action: 'Payslip generated',    detail: 'March 2026 batch initiated',      time: '5 hrs ago',  icon: DollarSign,  color: 'text-blue-500',    bg: 'bg-blue-50',    ring: 'ring-blue-100' },
  { id: 5, action: 'Asset transferred',    detail: 'HP Printer → Finance Dept',       time: 'Yesterday',  icon: TrendingUp,  color: 'text-violet-500',  bg: 'bg-violet-50',  ring: 'ring-violet-100' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ employees: '-', assets: '-', payrolls: '-' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, assetRes, payrollRes] = await Promise.all([
          api.get('/employees'),
          api.get('/assets'),
          api.get('/payroll'),
        ]);
        setStats({
          employees: empRes.data.count ?? 0,
          assets:    assetRes.data.count ?? 0,
          payrolls:  payrollRes.data.count ?? 0,
        });
      } catch {
        // API might not be reachable in dev — graceful fallback
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Employees',   value: loading ? '...' : stats.employees, icon: Users,       gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600', change: '+2 new this month',    changeType: 'up',   sub: 'Active headcount' },
    { label: 'Total Assets',      value: loading ? '...' : stats.assets,    icon: Package,     gradient: 'bg-gradient-to-br from-amber-400 to-orange-500',  change: '+5 registered',        changeType: 'up',   sub: 'Registered items' },
    { label: 'Payroll Records',   value: loading ? '...' : stats.payrolls,  icon: DollarSign,  gradient: 'bg-gradient-to-br from-emerald-500 to-teal-500',  change: 'Current cycle active', changeType: 'up',   sub: 'This fiscal year' },
    { label: 'Pending Approvals', value: '3',                                icon: TrendingUp,  gradient: 'bg-gradient-to-br from-rose-500 to-pink-500',     change: '3 awaiting review',    changeType: 'down', sub: 'Draft payslips' },
  ];

  return (
    <div className="space-y-5 max-w-screen-xl">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-2xl shadow-[0_8px_30px_rgb(99,102,241,0.18)]">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
        />
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-violet-500/30 blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-40 h-40 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />
        <div className="relative flex items-center justify-between px-7 py-6">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-white/10 rounded-full text-[11px] font-semibold text-indigo-200 border border-white/10 backdrop-blur-sm">
              <Sparkles size={10} className="text-amber-300" />
              Payroll Management System
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Good morning, Administrator 👋</h2>
            <p className="mt-1.5 text-sm text-indigo-200/90 max-w-sm leading-relaxed">
              Your payroll and asset systems are running smoothly. Here's your overview for{' '}
              <span className="text-white font-medium">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 text-xs font-bold rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-md shadow-indigo-900/20 hover:-translate-y-0.5">
                View Reports <ChevronRight size={13} />
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-xs font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
                Generate Payroll
              </button>
            </div>
          </div>
          <div className="hidden lg:block shrink-0 relative">
            <div className="absolute inset-0 rounded-2xl bg-indigo-400/30 blur-xl" />
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80"
              alt="Finance overview"
              className="relative w-64 h-40 object-cover rounded-2xl opacity-75 ring-1 ring-white/20 shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* ── Chart + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Salary Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[13px] font-bold text-slate-800 tracking-tight">Salary Payout Overview</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Monthly net salary payout — 2026</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />Current</span>
                <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-100" />Past</span>
              </div>
              <select className="text-[11px] border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50">
                <option>2026</option><option>2025</option>
              </select>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-44 pb-1">
            {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => {
              const heights = [62, 78, 55, 84, 72, 91, 68, 86, 52, 79, 90, 96];
              const isNow = i === new Date().getMonth();
              return (
                <div key={`${m}-${i}`} className="flex-1 flex flex-col items-center gap-1 group/bar">
                  <div className="relative w-full flex items-end justify-center" style={{ height: '160px' }}>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 group-hover/bar:brightness-105 ${ isNow ? 'bg-indigo-500 shadow-sm shadow-indigo-200' : 'bg-indigo-100 hover:bg-indigo-200' }`}
                      style={{ height: `${heights[i]}%` }}
                    />
                    {isNow && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-indigo-500 whitespace-nowrap">▲ Now</span>}
                  </div>
                  <span className={`text-[9px] font-medium ${ isNow ? 'text-indigo-500' : 'text-slate-400' }`}>{m}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">Connect live payroll data to populate real values</p>
            <span className="text-[11px] font-semibold text-indigo-600 cursor-pointer hover:underline">View all →</span>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[13px] font-bold text-slate-800 tracking-tight">Recent Activity</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Latest system events</p>
            </div>
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-50 border border-slate-100">
              <Clock size={13} className="text-slate-400" />
            </div>
          </div>
          <div className="flex-1 space-y-0.5">
            {recentActivity.map(({ id, action, detail, time, icon: Icon, color, bg, ring }) => (
              <div key={id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-150 cursor-default group/a">
                <div className={`mt-0.5 flex items-center justify-center w-8 h-8 rounded-xl ${bg} ring-1 ${ring} shrink-0 group-hover/a:scale-105 transition-transform duration-200`}>
                  <Icon size={13} className={color} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-slate-700 leading-snug truncate">{action}</p>
                  <p className="text-[11px] text-slate-400 truncate">{detail}</p>
                </div>
                <span className="text-[10px] text-slate-300 shrink-0 mt-0.5 whitespace-nowrap">{time}</span>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 py-2 rounded-xl hover:bg-indigo-50 transition-colors border-t border-slate-100 pt-3">
            View all activity →
          </button>
        </div>
      </div>

      {/* ── Finance Breakdown ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'EPF Contributions',     value: 'LKR 0', sub: 'Employee 8% deductions',      color: 'from-indigo-50 to-indigo-100/50', icon: '🏦' },
          { label: 'ETF Contributions',     value: 'LKR 0', sub: 'Employer 3% contributions',   color: 'from-teal-50 to-teal-100/50',    icon: '📊' },
          { label: 'Total PAYE Tax',         value: 'LKR 0', sub: 'PAYE tax withheld this month', color: 'from-violet-50 to-violet-100/50', icon: '📋' },
        ].map(({ label, value, sub, color, icon }) => (
          <div key={label} className={`bg-gradient-to-br ${color} border border-slate-100/80 rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
              <span className="text-base">{icon}</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
