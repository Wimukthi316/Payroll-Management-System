import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard',  subtitle: 'Welcome back 👋' },
  '/employees': { title: 'Employees',  subtitle: 'Manage your team' },
  '/payroll':   { title: 'Payroll',    subtitle: 'Salary & compensation' },
  '/assets':    { title: 'Assets',     subtitle: 'Track company assets' },
};

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Payroll for March generated',    time: '2 min ago',  dot: 'bg-cyan-400' },
  { id: 2, text: 'New employee Alex added',        time: '1 hr ago',   dot: 'bg-emerald-400' },
  { id: 3, text: 'Asset maintenance due: Laptop',  time: '3 hrs ago',  dot: 'bg-amber-400' },

export default function Header({ onMenuToggle, mobileOpen }) {
  const { user }        = useAuth();
  const { pathname }    = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { title, subtitle } = PAGE_TITLES[pathname] ?? { title: 'PayrollPro', subtitle: '' };

  return (
    <header className="sticky top-0 z-10 glass">
      <div className="flex items-center gap-4 px-4 sm:px-6 h-16">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background=''}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Page title */}
        <div className="hidden sm:block flex-1 min-w-0">
          <h1 className="text-lg font-bold leading-none" style={{ color: 'rgba(255,255,255,0.9)' }}>{title}</h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{subtitle}</p>
        </div>

        {/* Search */}
        <div className="flex-1 sm:flex-none sm:w-64">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.8)',
              }}
              onFocus={e => { e.target.style.borderColor='rgba(6,182,212,0.4)'; e.target.style.boxShadow='0 0 0 3px rgba(6,182,212,0.1)'; }}
              onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow=''; }}
            />
          </div>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='#22d3ee'; }}
            onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,0.45)'; }}
          >
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow: '0 0 6px rgba(6,182,212,0.6)' }} />
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden animate-fade-in z-50"
              style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>Notifications</p>
                <span className="badge-blue">{MOCK_NOTIFICATIONS.length} new</span>
              </div>
              <div>
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(6,182,212,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background=''}
                  >
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{n.text}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button className="text-xs font-semibold" style={{ color: '#22d3ee' }}>View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-200"
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background=''}
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              style={{ boxShadow: '0 0 0 2px rgba(6,182,212,0.4)' }}
            />
            <span className="hidden sm:block text-sm font-semibold max-w-[120px] truncate" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {user?.name}
            </span>
            <ChevronDown size={14} className="hidden sm:block flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-12 w-56 rounded-2xl overflow-hidden animate-fade-in z-50"
              style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <div className="px-4 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{user?.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{user?.email}</p>
                <span className="badge-blue mt-1.5">{user?.role}</span>
              </div>
              <div className="p-2">
                {['Profile Settings', 'Preferences', 'Help & Support'].map((item) => (
                  <button key={item} className="w-full text-left px-3 py-2 text-sm rounded-lg transition-colors"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(6,182,212,0.07)'; e.currentTarget.style.color='rgba(255,255,255,0.9)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,0.6)'; }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click-outside dismiss */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}
    </header>
  );
}
