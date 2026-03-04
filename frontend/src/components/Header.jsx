import { Bell, Search } from 'lucide-react';

export default function Header({ title = 'Dashboard' }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 shrink-0">

      {/* ── Page Title ── */}
      <div>
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
        <p className="text-xs text-slate-400">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="relative hidden sm:flex items-center">
          <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-4 py-1.5 text-sm text-slate-700 bg-slate-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition w-48"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow cursor-pointer select-none">
          AD
        </div>
      </div>
    </header>
  );
}
