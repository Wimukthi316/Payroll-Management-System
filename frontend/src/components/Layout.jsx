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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
