import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header  from './Header';

const pageTitles = {
  '/':           'Dashboard',
  '/employees':  'Employees',
  '/payroll':    'Payroll',
  '/assets':     'Asset Management',
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'Payroll Management System';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'rgb(248 250 252)' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto px-6 py-5 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
