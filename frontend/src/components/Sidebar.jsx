import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Package,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users,           label: 'Employees' },
  { to: '/payroll',   icon: DollarSign,      label: 'Payroll'   },
  { to: '/assets',    icon: Package,         label: 'Assets'    },
];

const SIDEBAR_STYLE = {
  background: 'rgba(5,8,16,0.97)',
  backdropFilter: 'blur(24px)',
  borderRight: '1px solid rgba(255,255,255,0.06)',
  boxShadow: '4px 0 40px rgba(0,0,0,0.4)',
};

/**
 * Inner content shared between mobile overlay and desktop sidebar.
 * `collapsed` only applies to the desktop version (always false on mobile).
 */
function SidebarContent({ collapsed, onClose, onSignOut, user }) {
  return (
    <>
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-5 py-5 flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}
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
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
               transition-all duration-200
               ${isActive ? 'text-white' : 'hover:text-white/80'}
               ${collapsed ? 'justify-center' : ''}`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg,rgba(6,182,212,0.18),rgba(59,130,246,0.12))',
              border: '1px solid rgba(6,182,212,0.25)',
              boxShadow: '0 0 16px rgba(6,182,212,0.12)',
            } : { color: 'rgba(255,255,255,0.4)' }}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className="flex-shrink-0" style={{ color: isActive ? '#22d3ee' : undefined }} />
                {!collapsed && <span>{label}</span>}
                {!collapsed && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User card + Sign Out */}
      <div
        className={`p-3 flex-shrink-0 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {!collapsed && user && (
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-xl mb-2"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              style={{ boxShadow: '0 0 0 2px rgba(6,182,212,0.4)' }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>{user.name}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={onSignOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = ''; }}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ mobileOpen, onClose, collapsed }) {
  const { signOut, user } = useAuth();
  const navigate          = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/signin');
  }

  return (
    <>
      {/* ── Mobile backdrop ───────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      {/*
       * ── Mobile sidebar (fixed overlay, only visible on <lg) ──────
       * Uses `fixed` intentionally — it overlays content on small screens.
       * Hidden on lg+ via `lg:hidden`.
       */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col w-64
          transition-transform duration-300 ease-in-out
          lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={SIDEBAR_STYLE}
      >
        <SidebarContent collapsed={false} onClose={onClose} onSignOut={handleSignOut} user={user} />
      </div>

      {/*
       * ── Desktop sidebar (in-flow flex child, only visible on lg+) ─
       * `hidden lg:flex` keeps it out of the DOM on mobile so it never
       * interferes with layout on small screens.
       * Being a plain flex child means it ACTUALLY pushes content right.
       */}
      <aside
        className={`
          hidden lg:flex flex-col flex-shrink-0
          transition-all duration-300 ease-in-out
          relative
          ${collapsed ? 'w-[72px]' : 'w-64'}
        `}
        style={SIDEBAR_STYLE}
      >
        <SidebarContent collapsed={collapsed} onClose={onClose} onSignOut={handleSignOut} user={user} />
      </aside>
    </>
  );
}
