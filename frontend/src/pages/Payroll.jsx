import { useEffect, useState } from 'react';
import { Plus, Search, FileText, CheckCircle, Clock, DollarSign, RefreshCw } from 'lucide-react';
import api from '../services/api';

const statusConfig = {
  Draft:    { bg: 'bg-amber-50',   text: 'text-amber-700',  icon: Clock,         dot: 'bg-amber-400'  },
  Approved: { bg: 'bg-indigo-50',  text: 'text-indigo-700', icon: CheckCircle,   dot: 'bg-indigo-500' },
  Paid:     { bg: 'bg-emerald-50', text: 'text-emerald-700',icon: DollarSign,    dot: 'bg-emerald-500'},
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CURRENT_YEAR = new Date().getFullYear();

export default function Payroll() {
  const [records, setRecords]         = useState([]);
  const [employees, setEmployees]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [generating, setGenerating]   = useState(false);
  const [error, setError]             = useState('');
  const [successMsg, setSuccessMsg]   = useState('');
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Form state
  const [form, setForm] = useState({
    employeeId: '', month: '', year: CURRENT_YEAR, overtimeHours: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payrollRes, empRes] = await Promise.all([
        api.get('/payroll'),
        api.get('/employees'),
      ]);
      setRecords(payrollRes.data.data);
      setEmployees(empRes.data.data);
    } catch {
      setError('Failed to load payroll data. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.post('/payroll/calculate', form);
      setSuccessMsg(`Payroll generated! Net salary: LKR ${res.data.data.netSalary?.toLocaleString()}`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate payroll.');
    } finally {
      setGenerating(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/payroll/${id}`, { status });
      setRecords((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch {
      alert('Failed to update status.');
    }
  };

  const filtered = records.filter((r) => {
    const name = `${r.employee?.firstName} ${r.employee?.lastName}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || r.month?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus ? r.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Payroll Management</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Generate, approve, and manage monthly payslips.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* ── Generate Payroll Form ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Plus size={16} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Generate Payroll</h3>
            <p className="text-xs text-slate-400">Auto-calculate EPF, ETF, PAYE tax, and net salary</p>
          </div>
        </div>

        {(error || successMsg) && (
          <div className={`mb-4 text-sm px-4 py-3 rounded-xl ${error ? 'bg-rose-50 border border-rose-200 text-rose-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'}`}>
            {error || successMsg}
          </div>
        )}

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            required
            className="col-span-2 px-3 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName} ({emp.employeeId})
              </option>
            ))}
          </select>

          <select
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
            required
            className="px-3 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
          >
            <option value="">Month</option>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <input
            type="number"
            placeholder="Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            min={2000}
            max={2100}
            required
            className="px-3 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
          />

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="OT Hours"
              value={form.overtimeHours}
              onChange={(e) => setForm({ ...form, overtimeHours: Number(e.target.value) })}
              min={0}
              className="flex-1 px-3 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={generating}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-200 transition-colors whitespace-nowrap"
            >
              {generating ? 'Calculating...' : 'Generate'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by employee name or month..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
          />
        </div>
        <div className="flex gap-2">
          {['', 'Draft', 'Approved', 'Paid'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${filterStatus === s ? 'bg-indigo-600 text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Payroll Table ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Employee', 'Period', 'Basic Salary', 'Overtime', 'Deductions', 'Net Salary', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-3.5 bg-slate-100 rounded-full w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <FileText size={32} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-sm text-slate-400">
                      {search || filterStatus ? 'No records match your filters.' : 'No payroll records yet. Generate your first payroll above.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => {
                  const cfg = statusConfig[rec.status] || statusConfig.Draft;
                  const StatusIcon = cfg.icon;
                  const totalDeductions = (rec.epfDeduction || 0) + (rec.taxDeduction || 0);
                  return (
                    <tr key={rec._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {rec.employee?.firstName} {rec.employee?.lastName}
                        </p>
                        <p className="text-xs text-slate-400">{rec.employee?.employeeId}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{rec.month} {rec.year}</td>
                      <td className="px-5 py-4 text-slate-600">LKR {rec.basicSalary?.toLocaleString()}</td>
                      <td className="px-5 py-4 text-slate-600">
                        {rec.overtimeHours > 0 ? (
                          <span className="text-emerald-600">+LKR {rec.overtimePay?.toLocaleString()}</span>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-4 text-rose-500">
                        -LKR {totalDeductions.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-800">
                        LKR {rec.netSalary?.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={rec.status}
                          onChange={(e) => handleStatusChange(rec._id, e.target.value)}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Approved">Approved</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
