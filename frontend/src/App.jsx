import { Routes, Route, Navigate } from 'react-router-dom';
import Layout     from './components/Layout';
import Dashboard  from './pages/Dashboard';
import Employees  from './pages/Employees';
import Payroll    from './pages/Payroll';
import Assets     from './pages/Assets';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index          element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="payroll"   element={<Payroll />} />
        <Route path="assets"    element={<Assets />} />
        {/* Catch-all → redirect to dashboard */}
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
