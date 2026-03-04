import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Package,
  ChevronRight,
  Landmark,
} from 'lucide-react';

const navItems = [
  { to: '/',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/payroll',   label: 'Payroll',   icon: DollarSign },
  { to: '/assets',    label: 'Assets',    icon: Package },
];

export default function Sidebar() {
  return (
    <aside className="flex flex-col w-64 min-h-screen bg-slate-900 text-slate-100 shrink-0">

      {/* ── Brand ── */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/60">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 shadow-lg">
          <Landmark size={18} className="text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-white tracking-wide">PayrollPro</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Management System</p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Main Menu
        </p>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-indigo-300" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="px-4 py-4 border-t border-slate-700/60">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
            AD
          </div>
          <div className="leading-tight flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">Admin User</p>
            <p className="text-[10px] text-slate-500 truncate">admin@company.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
