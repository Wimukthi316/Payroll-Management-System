import { useEffect, useState, useMemo } from 'react';
import {
  DollarSign, Play, Trash2, Search, X, ChevronDown,
  AlertTriangle, FileText, TrendingUp, Users, Clock,
} from 'lucide-react';
import { payrollAPI, employeeAPI } from '../services/api';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const thisYear  = new Date().getFullYear();
const YEARS     = Array.from({ length: 6 }, (_, i) => thisYear - 2 + i);

function fmt(n) {
  if (n == null) return '—';
  return `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ── Stat Card ─────────────────────────────────────────────────────────────── */
function PayStat({ icon: Icon, label, value, bg, color }) {
  return (
    <div className="card flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={19} className={color} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 font-medium truncate">{label}</p>
        <p className="text-lg font-black text-slate-800 leading-tight">{value}</p>
      </div>
    </div>
  );
}

/* ── Skeleton rows ─────────────────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="border-b border-slate-50">
      {[140, 80, 70, 90, 90, 90, 90, 70].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className="skeleton h-4 rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

/* ── Generate Form Modal ───────────────────────────────────────────────────── */
function GenerateModal({ open, onClose, employees, onDone }) {
  const [form, setForm] = useState({
    employeeId: '', month: MONTHS[new Date().getMonth()], year: thisYear, overtimeHours: 0,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.employeeId) { setError('Please select an employee.'); return; }
    setLoading(true);
    try {
      const res = await payrollAPI.calculate({
        employeeId:   form.employeeId,
        month:        form.month,
        year:         Number(form.year),
        overtimeHours: Number(form.overtimeHours),
      });
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed to generate payroll.');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setResult(null);
    setError('');
    onClose();
    if (result) onDone();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-[0_30px_80px_rgb(0,0,0,0.18)] w-full max-w-lg animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Generate Payroll</h2>
            <p className="text-xs text-slate-400 mt-0.5">Auto-calculate salary, EPF, ETF, and net pay</p>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  <AlertTriangle size={15} className="flex-shrink-0" />
                  {error}
                </div>
              )}
              {/* Employee select */}
              <div>
                <label className="label">Employee</label>
                <div className="relative">
                  <select
                    name="employeeId"
                    value={form.employeeId}
                    onChange={handleChange}
                    className="input appearance-none pr-10"
                    required
                  >
                    <option value="">Select an employee…</option>
                    {employees.map((e) => (
                      <option key={e._id} value={e._id}>
                        {e.firstName} {e.lastName} ({e.employeeId})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Month */}
                <div>
                  <label className="label">Month</label>
                  <div className="relative">
                    <select name="month" value={form.month} onChange={handleChange} className="input appearance-none pr-8">
                      {MONTHS.map((m) => <option key={m}>{m}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                {/* Year */}
                <div>
                  <label className="label">Year</label>
                  <div className="relative">
                    <select name="year" value={form.year} onChange={handleChange} className="input appearance-none pr-8">
                      {YEARS.map((y) => <option key={y}>{y}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Overtime */}
              <div>
                <label className="label">Overtime Hours (optional)</label>
                <div className="relative">
                  <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    name="overtimeHours"
                    type="number"
                    min="0"
                    value={form.overtimeHours}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="0"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading
                  ? <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  : <><Play size={16} /> Calculate Payroll</>
                }
              </button>
            </form>
          ) : (
            /* Result breakdown */
            <div className="animate-fade-in-up space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-emerald-700 text-sm">Payroll Generated!</p>
                  <p className="text-xs text-emerald-600">
                    {result.month} {result.year} — {result.employee?.firstName ?? 'Employee'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Basic Salary',   value: fmt(result.basicSalary) },
                  { label: 'Overtime Pay',   value: fmt(result.overtimePay) },
                  { label: 'EPF Deduction',  value: fmt(result.epfDeduction) },
                  { label: 'ETF Contribution', value: fmt(result.etfContribution) },
                  { label: 'Gross Pay',      value: fmt(result.grossPay) },
                  { label: 'Total Deductions', value: fmt(result.totalDeductions) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
                    <p className="text-sm font-bold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100">
                <p className="text-sm font-bold text-indigo-700">Net Pay</p>
                <p className="text-xl font-black text-indigo-700">{fmt(result.netPay)}</p>
              </div>
              <button onClick={handleClose} className="btn-primary w-full justify-center">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────────── */
export default function Payroll() {
  const [records, setRecords]     = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [monthFilter, setMonthFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]   = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast]         = useState('');

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  async function load() {
    setLoading(true);
    try {
      const [pRes, eRes] = await Promise.allSettled([payrollAPI.getAll(), employeeAPI.getAll()]);
      setRecords(pRes.status === 'fulfilled' ? (pRes.value.data ?? []) : []);
      setEmployees(eRes.status === 'fulfilled' ? (eRes.value.data ?? []) : []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let data = records;
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((r) => {
        const emp = r.employee;
        const name = emp ? `${emp.firstName} ${emp.lastName}`.toLowerCase() : '';
        return name.includes(q) || r.month?.toLowerCase().includes(q);
      });
    }
    if (monthFilter !== 'All') data = data.filter((r) => r.month === monthFilter);
    return data;
  }, [records, search, monthFilter]);

  const totalNet = useMemo(
    () => filtered.reduce((s, r) => s + (r.netPay ?? 0), 0),
    [filtered],
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await payrollAPI.delete(deleteTarget._id);
      showToast('Payroll record deleted');
      setDeleteTarget(null);
      load();
    } catch {
      showToast('Failed to delete record.');
    } finally {
      setDeleting(false);
    }
  }

  const STAT_MONTHS = [...new Set(records.map((r) => r.month))];

  return (
    <div className="page-container space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-800 flex items-center gap-3 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Payroll</h2>
          <p className="section-subtitle">{loading ? '…' : `${records.length} payroll records`}</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Play size={16} /> Generate Payroll
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <PayStat icon={FileText}    label="Total Records"        value={loading ? '—' : records.length}         bg="bg-indigo-50"  color="text-indigo-600" />
        <PayStat icon={DollarSign}  label="Total Net Pay (filtered)" value={loading ? '—' : fmt(totalNet)}      bg="bg-emerald-50" color="text-emerald-600" />
        <PayStat icon={Users}       label="Employees on Payroll" value={loading ? '—' : [...new Set(records.map((r) => r.employee?._id))].filter(Boolean).length} bg="bg-violet-50"  color="text-violet-600" />
        <PayStat icon={TrendingUp}  label="Months Covered"       value={loading ? '—' : STAT_MONTHS.length}    bg="bg-amber-50"   color="text-amber-600" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by employee name or month…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="relative">
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="input pr-9 appearance-none min-w-[140px]"
          >
            <option value="All">All Months</option>
            {MONTHS.map((m) => <option key={m}>{m}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {['Employee', 'Period', 'Basic Salary', 'Overtime', 'Gross Pay', 'EPF Deduction', 'Net Pay', 'Actions'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : filtered.length === 0
                ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <DollarSign size={22} />
                        </div>
                        <p className="font-medium text-sm">No payroll records yet</p>
                        <p className="text-xs">Click "Generate Payroll" to create the first record</p>
                      </div>
                    </td>
                  </tr>
                )
                : filtered.map((rec) => {
                  const emp = rec.employee;
                  return (
                    <tr key={rec._id}>
                      <td>
                        {emp ? (
                          <p className="font-semibold text-slate-800">
                            {emp.firstName} {emp.lastName}
                          </p>
                        ) : (
                          <span className="text-slate-400 text-xs">Unknown</span>
                        )}
                      </td>
                      <td>
                        <span className="badge-blue">{rec.month} {rec.year}</span>
                      </td>
                      <td className="font-medium">{fmt(rec.basicSalary)}</td>
                      <td>{fmt(rec.overtimePay)}</td>
                      <td className="font-semibold text-slate-700">{fmt(rec.grossPay)}</td>
                      <td className="text-red-500">{fmt(rec.epfDeduction)}</td>
                      <td>
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-sm">
                          {fmt(rec.netPay)}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => setDeleteTarget(rec)}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3.5 border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-400">{filtered.length} records</p>
            <p className="text-sm font-bold text-slate-700">
              Total Net: <span className="text-indigo-600">{fmt(totalNet)}</span>
            </p>
          </div>
        )}
      </div>

      {/* Generate Modal */}
      <GenerateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        employees={employees}
        onDone={load}
      />

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-[0_30px_80px_rgb(0,0,0,0.18)] w-full max-w-sm p-6 animate-fade-in-up text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Payroll Record</h3>
            <p className="text-sm text-slate-500 mb-6">
              Delete payroll for <strong>{deleteTarget.employee?.firstName}</strong> — {deleteTarget.month} {deleteTarget.year}?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60">
                {deleting ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : <><Trash2 size={15}/> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
