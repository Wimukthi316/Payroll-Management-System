import { useEffect, useState } from 'react';
import { Users, Package, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from 'lucide-react';
import api from '../services/api';

const StatCard = ({ label, value, icon: Icon, iconBg, iconColor, change, changeType }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="mt-1 text-3xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
    {change !== undefined && (
      <div className={`flex items-center gap-1 text-xs font-medium ${changeType === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
        {changeType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{change}</span>
        <span className="text-slate-400 font-normal ml-1">vs last month</span>
      </div>
    )}
  </div>
);

const recentActivity = [
  { id: 1, action: 'New employee added',      detail: 'John Perera — Software Engineer',   time: '2 min ago',  icon: Users,      color: 'text-indigo-500',  bg: 'bg-indigo-50' },
  { id: 2, action: 'Payroll approved',         detail: 'February 2026 — 24 employees',      time: '1 hr ago',   icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 3, action: 'Asset registered',         detail: 'Dell Laptop — IT Department',       time: '3 hrs ago',  icon: Package,     color: 'text-amber-500',   bg: 'bg-amber-50' },
  { id: 4, action: 'Payslip generated',        detail: 'March 2026 batch initiated',        time: '5 hrs ago',  icon: DollarSign,  color: 'text-blue-500',    bg: 'bg-blue-50' },
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
    { label: 'Total Employees', value: loading ? '...' : stats.employees, icon: Users,       iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', change: '+2 new',  changeType: 'up'   },
    { label: 'Total Assets',    value: loading ? '...' : stats.assets,    icon: Package,     iconBg: 'bg-amber-100',  iconColor: 'text-amber-600',  change: '+5 this month', changeType: 'up' },
    { label: 'Payroll Records', value: loading ? '...' : stats.payrolls,  icon: DollarSign,  iconBg: 'bg-emerald-100',iconColor: 'text-emerald-600',change: 'Current month', changeType: 'up' },
    { label: 'Pending Approvals',value: '3',                               icon: TrendingUp,  iconBg: 'bg-rose-100',   iconColor: 'text-rose-600',   change: '3 drafts', changeType: 'down' },
  ];

  return (
    <div className="space-y-6">

      {/* ── Welcome Banner ── */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
        <p className="text-sm font-medium text-indigo-200">Welcome back,</p>
        <h2 className="mt-0.5 text-2xl font-bold">Administrator 👋</h2>
        <p className="mt-1 text-sm text-indigo-200 max-w-md">
          Here's what's happening with your payroll and assets today. Everything looks on track.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Chart Placeholder + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Salary Overview Chart (placeholder) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Salary Overview</h3>
              <p className="text-xs text-slate-400">Monthly net salary payout — 2026</p>
            </div>
            <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          {/* Bar Chart Visual Placeholder */}
          <div className="flex items-end gap-2 h-40 mt-2">
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => {
              const heights = [60, 75, 55, 80, 70, 90, 65, 85, 50, 78, 88, 95];
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-md transition-all ${i === 2 ? 'bg-indigo-600' : 'bg-indigo-100 hover:bg-indigo-200'}`}
                    style={{ height: `${heights[i]}%` }}
                  />
                  <span className="text-[9px] text-slate-400">{m}</span>
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-slate-400 mt-3">Connect payroll data to populate chart</p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Recent Activity</h3>
            <Clock size={14} className="text-slate-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.map(({ id, action, detail, time, icon: Icon, color, bg }) => (
              <div key={id} className="flex items-start gap-3">
                <div className={`mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg ${bg} shrink-0`}>
                  <Icon size={14} className={color} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{action}</p>
                  <p className="text-[11px] text-slate-400 truncate">{detail}</p>
                  <p className="text-[10px] text-slate-300 mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'EPF Contributions This Month',  value: 'LKR 0',   sub: 'Employee 8% deductions' },
          { label: 'ETF Contributions This Month',  value: 'LKR 0',   sub: 'Employer 3% contributions' },
          { label: 'Total Tax Deductions This Month',value: 'LKR 0',  sub: 'PAYE tax withheld' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className="mt-1 text-xl font-bold text-slate-800">{value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
