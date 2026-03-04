import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Package,
  ChevronRight,
  Landmark,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';

const AVATAR_URL =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const navItems = [
  { to: '/',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/payroll',   label: 'Payroll',   icon: DollarSign },
  { to: '/assets',    label: 'Assets',    icon: Package },
];

const bottomItems = [
  { label: 'Settings', icon: Settings },
  { label: 'Help',     icon: HelpCircle },
];

export default function Sidebar() {
  return (
    <aside
      className="flex flex-col w-64 min-h-screen shrink-0 relative overflow-hidden"
      style={{ background: 'linear-gradient(175deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)' }}
    >
      {/* ── Decorative glow orb ── */}
      <div className="pointer-events-none absolute -top-20 -left-10 w-56 h-56 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 -right-10 w-40 h-40 rounded-full bg-violet-600/15 blur-3xl" />

      {/* ── Brand ── */}
      <div className="relative flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/50">
          <Landmark size={17} className="text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-white tracking-wide">PayrollPro</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Management System</p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="relative flex-1 px-3 py-5 space-y-0.5">
        <p className="px-3 mb-3 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
          Main Menu
        </p>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white shadow-inner'
                  : 'text-slate-500 hover:bg-white/[0.06] hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-indigo-400" />
                )}
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-500 shadow-md shadow-indigo-900/60'
                      : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                </span>
                <span className="flex-1 tracking-[-0.01em]">{label}</span>
                {isActive && (
                  <ChevronRight size={13} className="text-indigo-400/70" />
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-5 mt-4 border-t border-white/[0.06]">
          <p className="px-3 mb-3 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
            System
          </p>
          {bottomItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-white/[0.06] hover:text-slate-200 transition-all duration-200"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.08] transition-all">
                <Icon size={15} className="text-slate-500 group-hover:text-slate-300" />
              </span>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── User Footer ── */}
      <div className="relative px-4 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.06] cursor-pointer transition-all duration-200 group">
          <img
            src={AVATAR_URL}
            alt="Admin User"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="leading-tight flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">Admin User</p>
            <p className="text-[10px] text-slate-500 truncate">admin@company.com</p>
          </div>
          <LogOut size={13} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
        </div>
      </div>
    </aside>
  );
}
