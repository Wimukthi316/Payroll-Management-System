import { Bell, Search, ChevronDown, Command } from 'lucide-react';

const AVATAR_URL =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

export default function Header({ title = 'Dashboard' }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-white/70 backdrop-blur-md border-b border-slate-200/50 shrink-0 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">

      {/* ── Page Title ── */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-[15px] font-bold text-slate-800 tracking-tight">{title}</h1>
          <p className="text-[11px] text-slate-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-2.5">

        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search size={13} className="absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-8 pr-10 py-2 text-[13px] text-slate-600 bg-slate-100/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-white focus:border-indigo-300 transition-all duration-200 w-52 placeholder:text-slate-400"
          />
          <div className="absolute right-2.5 flex items-center gap-0.5">
            <kbd className="inline-flex items-center justify-center w-4 h-4 rounded text-[9px] font-semibold text-slate-400 bg-slate-200/80">
              <Command size={9} />
            </kbd>
            <kbd className="inline-flex items-center justify-center px-1 h-4 rounded text-[9px] font-semibold text-slate-400 bg-slate-200/80">
              K
            </kbd>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-slate-200" />

        {/* Notification Bell */}
        <button className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-500 hover:text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-500 ring-1.5 ring-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-xl hover:bg-slate-100/80 cursor-pointer transition-all duration-200 group select-none">
          <img
            src={AVATAR_URL}
            alt="Admin User"
            className="w-7 h-7 rounded-lg object-cover ring-2 ring-indigo-200/60 shadow-sm"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="hidden lg:block leading-tight">
            <p className="text-[12px] font-semibold text-slate-700">Admin User</p>
            <p className="text-[10px] text-slate-400">Administrator</p>
          </div>
          <ChevronDown size={13} className="hidden lg:block text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </header>
  );
}
