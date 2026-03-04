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
  { id: 1, text: 'Payroll for March generated',    time: '2 min ago',  dot: 'bg-indigo-500' },
  { id: 2, text: 'New employee Alex added',        time: '1 hr ago',   dot: 'bg-emerald-500' },
  { id: 3, text: 'Asset maintenance due: Laptop',  time: '3 hrs ago',  dot: 'bg-amber-500' },
];

export default function Header({ onMenuToggle, mobileOpen }) {
  const { user }        = useAuth();
  const { pathname }    = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { title, subtitle } = PAGE_TITLES[pathname] ?? { title: 'PayrollPro', subtitle: '' };

  return (
    <header className="sticky top-0 z-10 glass border-b border-white/60 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
      <div className="flex items-center gap-4 px-4 sm:px-6 h-16">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Page title */}
        <div className="hidden sm:block flex-1 min-w-0">
          <h1 className="text-lg font-bold text-slate-800 leading-none">{title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        {/* Search */}
        <div className="flex-1 sm:flex-none sm:w-64">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
            />
          </div>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-all duration-200"
          >
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-[0_20px_60px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden animate-fade-in z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
                <p className="text-sm font-semibold text-slate-800">Notifications</p>
                <span className="badge-blue">{MOCK_NOTIFICATIONS.length} new</span>
              </div>
              <div className="divide-y divide-slate-50">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700">{n.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-slate-50 text-center">
                <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all duration-200"
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-8 h-8 rounded-full ring-2 ring-indigo-100 object-cover flex-shrink-0"
            />
            <span className="hidden sm:block text-sm font-semibold text-slate-700 max-w-[120px] truncate">
              {user?.name}
            </span>
            <ChevronDown size={14} className="hidden sm:block text-slate-400 flex-shrink-0" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-[0_20px_60px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden animate-fade-in z-50">
              <div className="px-4 py-3.5 border-b border-slate-50">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                <span className="badge-blue mt-1.5">{user?.role}</span>
              </div>
              <div className="p-2">
                {['Profile Settings', 'Preferences', 'Help & Support'].map((item) => (
                  <button key={item} className="w-full text-left px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
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
