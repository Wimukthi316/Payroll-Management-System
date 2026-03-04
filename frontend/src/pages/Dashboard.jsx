import { useEffect, useState } from 'react';
import {
  Users, DollarSign, Package, TrendingUp,
  ArrowUpRight, ArrowDownRight, Activity, Clock,
  Calendar, ChevronRight,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { employeeAPI, payrollAPI, assetAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ── Mini chart bar ────────────────────────────────────────────────────────── */
function MiniBar({ heights = [] }) {
  return (
    <div className="flex items-end gap-0.5 h-10">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-500"
          style={{ height: `${h}%`, background: 'rgba(6,182,212,0.25)' }}
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
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
          up
            ? 'text-emerald-400'
            : 'text-red-400'
          }`}
          style={{ background: up ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)' }}
        >
          {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-2xl font-black leading-none mb-1" style={{ color: 'rgba(255,255,255,0.92)' }}>{value}</p>
        <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
      </div>
      {bars && (
        <div className="mt-auto pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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
  { text: 'Payroll generated for February 2026', time: '10 min ago', icon: DollarSign, color: 'text-emerald-400', bg: 'rgba(52,211,153,0.1)' },
  { text: 'New employee Isabella Kim onboarded', time: '2 hrs ago', icon: Users, color: 'text-cyan-400', bg: 'rgba(6,182,212,0.1)' },
  { text: 'Asset LAPTOP-042 transferred to IT Dept', time: '5 hrs ago', icon: Package, color: 'text-violet-400', bg: 'rgba(167,139,250,0.1)' },
  { text: 'Salary updated for Marcus Reid', time: '1 day ago', icon: TrendingUp, color: 'text-amber-400', bg: 'rgba(251,191,36,0.1)' },
  { text: 'Asset maintenance scheduled: Projector', time: '2 days ago', icon: Clock, color: 'text-white/30', bg: 'rgba(255,255,255,0.05)' },
];

export default function Dashboard() {
  const { user }    = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats]   = useState({ employees: 0, payroll: 0, assets: 0, expenses: 0 });
  const [monthlyPayroll, setMonthlyPayroll] = useState(MONTHS.map((month) => ({ month, netPay: 0 })));
  const today = new Date();

  useEffect(() => {
    async function loadStats() {
      try {
        const [empRes, payRes, astRes] = await Promise.allSettled([
          employeeAPI.getAll(),
          payrollAPI.getAll(),
          assetAPI.getAll(),
        ]);
        const employees = empRes.status === 'fulfilled' ? (empRes.value.data?.count ?? empRes.value.data?.data?.length ?? 0) : 0;
        const payrolls  = payRes.status === 'fulfilled' ? (Array.isArray(payRes.value.data?.data) ? payRes.value.data.data : []) : [];
        const assets    = astRes.status === 'fulfilled' ? (astRes.value.data?.count ?? astRes.value.data?.data?.length ?? 0) : 0;
        const totalPay  = Array.isArray(payrolls)
          ? payrolls.reduce((s, p) => s + (p.netPay ?? p.netSalary ?? p.basicSalary ?? 0), 0)
          : 0;

        const monthIndexMap = {
          january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
          july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
        };
        const grouped = MONTHS.map((month) => ({ month, netPay: 0 }));

        if (Array.isArray(payrolls)) {
          payrolls.forEach((record) => {
            const rawMonth = String(record.month ?? '').trim().toLowerCase();
            const index = monthIndexMap[rawMonth];
            if (index != null) {
              grouped[index].netPay += Number(record.netPay ?? record.netSalary ?? 0);
            }
          });
        }

        setStats({ employees, payroll: totalPay, assets, expenses: totalPay * 0.12 });
        setMonthlyPayroll(grouped);
      } catch {
        /* backend may be offline — use zeros */
        setMonthlyPayroll(MONTHS.map((month) => ({ month, netPay: 0 })));
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
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      bars: [40, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 90],
    },
    {
      icon: DollarSign,
      label: 'Total Payroll Disbursed',
      value: loading ? '—' : fmt(stats.payroll),
      change: '+8.1%',
      trend: 'up',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      bars: [30, 42, 38, 55, 50, 68, 60, 75, 70, 82, 78, 95],
    },
    {
      icon: Package,
      label: 'Registered Assets',
      value: loading ? '—' : stats.assets.toString(),
      change: '-1.3%',
      trend: 'down',
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
      bars: [65, 60, 68, 55, 62, 58, 70, 52, 60, 55, 58, 50],
    },
    {
      icon: TrendingUp,
      label: 'Operating Expenses',
      value: loading ? '—' : fmt(stats.expenses),
      change: '+2.5%',
      trend: 'up',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      bars: [20, 35, 28, 42, 38, 50, 44, 58, 52, 65, 60, 70],
    },
  ];

  return (
    <div className="page-container space-y-8">
      {/* ── Welcome Banner ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white animate-fade-in-up"
        style={{ background: 'linear-gradient(135deg, #050f2a 0%, #071a3e 50%, #050f2a 100%)', border: '1px solid rgba(6,182,212,0.2)', boxShadow: '0 0 60px rgba(6,182,212,0.08)' }}
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3Ccircle cx='23' cy='23' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="absolute top-[-30px] right-[-30px] w-48 h-48 rounded-full blur-2xl" style={{ background: 'rgba(6,182,212,0.12)' }} />
        <div className="absolute bottom-[-20px] left-[30%] w-32 h-32 rounded-full blur-xl" style={{ background: 'rgba(99,102,241,0.12)' }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(6,182,212,0.7)' }}>
              <Calendar size={13} className="inline mr-1.5 -mt-0.5" />
              {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black mb-1">
              Good {today.getHours() < 12 ? 'morning' : today.getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p className="text-sm max-w-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Your payroll dashboard is all up to date. Here's what's happening today.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="/payroll" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', color: '#fff', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
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
          <div className="relative h-56 rounded-xl px-2 py-2 overflow-hidden"
            style={{ background: 'rgba(6,182,212,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPayroll} margin={{ top: 10, right: 10, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                  tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 'Net Pay']}
                  contentStyle={{ background: 'rgba(10,16,32,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'rgba(255,255,255,0.85)' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                  cursor={{ fill: 'rgba(6,182,212,0.08)' }}
                />
                <Bar dataKey="netPay" radius={[8, 8, 0, 0]} fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 card animate-fade-in-up animation-delay-300">
          <h3 className="section-title mb-1">Recent Activity</h3>
          <p className="section-subtitle mb-5">Latest system events</p>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map(({ text, time, icon: Icon, color, bg }, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: bg }}>
                  <Icon size={14} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug" style={{ color: 'rgba(255,255,255,0.75)' }}>{text}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Access ─────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-3 gap-4 animate-fade-in-up animation-delay-400">
        {[
          { href: '/employees', icon: Users,      label: 'View All Employees', desc: 'Manage team members',    iconColor: 'text-cyan-400',    iconBg: 'rgba(6,182,212,0.1)',    border: 'rgba(6,182,212,0.15)' },
          { href: '/payroll',   icon: DollarSign, label: 'Payroll Processing',  desc: 'Generate & view payslips', iconColor: 'text-emerald-400', iconBg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.15)' },
          { href: '/assets',    icon: Package,    label: 'Asset Registry',      desc: 'Track company assets',  iconColor: 'text-violet-400',  iconBg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.15)' },
        ].map(({ href, icon: Icon, label, desc, iconColor, iconBg, border }) => (
          <a
            key={href}
            href={href}
            className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 group hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}` }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.boxShadow=`0 0 24px ${border}`; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.boxShadow=''; }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200" style={{ background: iconBg }}>
              <Icon size={20} className={iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{desc}</p>
            </div>
            <ChevronRight size={16} className="flex-shrink-0 transition-colors" style={{ color: 'rgba(255,255,255,0.2)' }} />
          </a>
        ))}
      </div>
    </div>
  );
}
