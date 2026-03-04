import { useState } from 'react';
import Sidebar from './Sidebar';
import Header  from './Header';

export default function Layout({ children }) {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [collapsed,   setCollapsed]   = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#050810' }}>

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
      />

      {/* Right column: stacks header + scrollable main vertically */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          mobileOpen={mobileOpen}
          onMenuToggle={() => setMobileOpen((o) => !o)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
