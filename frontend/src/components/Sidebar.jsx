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
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          transition-all duration-300 ease-in-out
          ${sidebarW}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
        style={{
          background: 'rgba(5,8,16,0.95)',
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-5 py-5 ${collapsed ? 'justify-center px-0' : ''}`}
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow: '0 0 20px rgba(6,182,212,0.35)' }}
          >
            <Zap size={18} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-extrabold text-lg leading-none tracking-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
              Payroll<span style={{ background: 'linear-gradient(90deg,#06b6d4,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pro</span>
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
                   ? 'text-white'
                   : 'hover:text-white/80'
                 }
                 ${collapsed ? 'justify-center' : ''}
                `
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg,rgba(6,182,212,0.18),rgba(59,130,246,0.12))',
                border: '1px solid rgba(6,182,212,0.25)',
                boxShadow: '0 0 16px rgba(6,182,212,0.12)',
              } : { color: 'rgba(255,255,255,0.4)' }}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className="flex-shrink-0 transition-colors duration-200"
                    style={{ color: isActive ? '#22d3ee' : undefined }}
                  />
                  {!collapsed && <span>{label}</span>}
                  {!collapsed && isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Sign Out */}
        <div
          className={`p-3 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {!collapsed && user && (
            <div
              className="flex items-center gap-3 px-3 py-2 rounded-xl mb-2"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
                style={{ boxShadow: '0 0 0 2px rgba(6,182,212,0.4)' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>{user.name}</p>
                <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-semibold
              transition-all duration-200
              ${collapsed ? 'justify-center' : ''}
            `}
            style={{ color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => { e.currentTarget.style.color='#f87171'; e.currentTarget.style.background='rgba(239,68,68,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.35)'; e.currentTarget.style.background=''; }}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && 'Sign Out'}
          </button>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3.5 top-12 w-7 h-7 rounded-full items-center justify-center transition-all duration-200 z-10"
          style={{ background: '#0d1526', border: '1px solid rgba(6,182,212,0.3)', color: '#22d3ee', boxShadow: '0 0 12px rgba(6,182,212,0.2)' }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>
    </>
  );
}
