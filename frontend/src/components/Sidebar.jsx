import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Package,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users,           label: 'Employees' },
  { to: '/payroll',   icon: DollarSign,      label: 'Payroll'   },
  { to: '/assets',    icon: Package,         label: 'Assets'    },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut, user }         = useAuth();
  const navigate                  = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/signin');
  }

  const sidebarW = collapsed ? 'w-[72px]' : 'w-64';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-white border-r border-slate-100
          transition-all duration-300 ease-in-out
          ${sidebarW}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          shadow-[4px_0_24px_rgb(0,0,0,0.04)]
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 py-5 border-b border-slate-100 ${collapsed ? 'justify-center px-0' : ''}`}>
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-btn">
            <Zap size={18} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-extrabold text-slate-800 text-lg leading-none tracking-tight">
              Payroll<span className="text-indigo-600">Pro</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl
                 text-sm font-semibold transition-all duration-200
                 ${isActive
                   ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                   : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                 }
                 ${collapsed ? 'justify-center' : ''}
                `
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}
                  />
                  {!collapsed && <span>{label}</span>}
                  {!collapsed && isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Sign Out */}
        <div className={`p-3 border-t border-slate-100 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
          {!collapsed && user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 mb-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full ring-2 ring-white object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-semibold text-slate-500
              hover:bg-red-50 hover:text-red-600
              transition-all duration-200
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && 'Sign Out'}
          </button>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3.5 top-12 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 z-10"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>
    </>
  );
}
