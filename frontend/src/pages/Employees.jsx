import { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, UserCheck, UserX, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';

const roleColors = {
  Admin:      'bg-rose-100 text-rose-700',
  HR:         'bg-indigo-100 text-indigo-700',
  Accountant: 'bg-amber-100 text-amber-700',
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [error, setError]         = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees');
      setEmployees(res.data.data);
    } catch {
      setError('Failed to load employees. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch {
      alert('Failed to delete employee.');
    }
  };

  const filtered = employees.filter((e) =>
    `${e.firstName} ${e.lastName} ${e.employeeId} ${e.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Employee Management</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage employee profiles, roles, and salary information.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200/80 transition-all duration-200">
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* ── Filters Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, ID, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Employee', 'Employee ID', 'Department', 'Role', 'Basic Salary', 'Status', ''].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3.5 bg-slate-100 rounded-full w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-slate-400 text-sm">
                    {search ? 'No employees match your search.' : 'No employees found. Add your first employee to get started.'}
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const AVATARS = [
                            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
                            'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
                            'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
                            'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
                          ];
                          const idx = filtered.indexOf(emp) % AVATARS.length;
                          return (
                            <img
                              src={AVATARS[idx]}
                              alt={`${emp.firstName} ${emp.lastName}`}
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                            />
                          );
                        })()}
                        <div>
                          <p className="font-semibold text-slate-800">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-mono text-xs">{emp.employeeId}</td>
                    <td className="px-5 py-4 text-slate-600">{emp.department || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${roleColors[emp.role] || 'bg-slate-100 text-slate-600'}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-700 font-medium">
                      LKR {emp.basicSalary?.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      {emp.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                          <UserCheck size={11} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded-full">
                          <UserX size={11} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer ── */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <p className="text-xs text-slate-400">Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of <span className="font-semibold text-slate-600">{employees.length}</span> employees</p>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40" disabled>
                Previous
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
