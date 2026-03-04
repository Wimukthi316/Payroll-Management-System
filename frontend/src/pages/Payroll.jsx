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
function PayStat({ icon: Icon, label, value, iconBg, iconColor }) {
  return (
    <div className="card flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
        <Icon size={19} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
        <p className="text-lg font-black leading-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>{value}</p>
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
      setResult(res.data.data);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] w-full max-w-full sm:max-w-lg animate-fade-in-up overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]" style={{ background: '#0a1020', border: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>Generate Payroll</h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>ETF is employer-only — not deducted from employee net pay</p>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(255,255,255,0.8)'; }}
            onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,0.35)'; }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}>
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
                  { label: 'Basic Salary',          value: fmt(result.basicSalary) },
                  { label: 'Overtime Pay',           value: fmt(result.overtimePay) },
                  { label: 'Gross Pay',              value: fmt(result.grossPay) },
                  { label: 'EPF Deduction (8%)',     value: fmt(result.epfDeduction) },
                  { label: 'Tax Deduction (PAYE)',   value: fmt(result.taxDeduction) },
                  { label: 'Total Deductions',       value: fmt(result.totalDeductions) },
                  { label: 'ETF (Employer Only ✦)',  value: fmt(result.etfContribution) },
                  { label: 'Net Pay',                value: fmt(result.netPay) },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-3" style={{
                    background: label === 'Net Pay'
                      ? 'linear-gradient(135deg,rgba(6,182,212,0.12),rgba(99,102,241,0.08))'
                      : label.startsWith('ETF')
                      ? 'rgba(250,204,21,0.05)'
                      : 'rgba(255,255,255,0.04)',
                    border: label === 'Net Pay'
                      ? '1px solid rgba(6,182,212,0.25)'
                      : label.startsWith('ETF')
                      ? '1px solid rgba(250,204,21,0.15)'
                      : '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <p className="text-xs font-medium mb-0.5" style={{ color: label === 'Net Pay' ? '#22d3ee' : label.startsWith('ETF') ? '#fbbf24' : 'rgba(255,255,255,0.35)' }}>{label}</p>
                    <p className="text-sm font-bold" style={{ color: label === 'Net Pay' ? '#22d3ee' : label.startsWith('ETF') ? '#fcd34d' : 'rgba(255,255,255,0.85)' }}>{value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>✦ ETF is paid by the employer — it does not reduce your take-home salary.</p>
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
      setRecords(pRes.status === 'fulfilled' ? (Array.isArray(pRes.value.data?.data) ? pRes.value.data.data : []) : []);
      setEmployees(eRes.status === 'fulfilled' ? (Array.isArray(eRes.value.data?.data) ? eRes.value.data.data : []) : []);
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
    () => filtered.reduce((s, r) => s + (r.netPay ?? r.netSalary ?? 0), 0),
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
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl px-5 py-3.5 text-sm font-medium flex items-center gap-3 animate-fade-in-up" style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
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
        <PayStat icon={FileText}    label="Total Records"        value={loading ? '—' : records.length}         iconBg="rgba(6,182,212,0.1)"    iconColor="text-cyan-400" />
        <PayStat icon={DollarSign}  label="Total Net Pay (filtered)" value={loading ? '—' : fmt(totalNet)}      iconBg="rgba(52,211,153,0.1)" iconColor="text-emerald-400" />
        <PayStat icon={Users}       label="Employees on Payroll" value={loading ? '—' : [...new Set(records.map((r) => r.employee?._id))].filter(Boolean).length} iconBg="rgba(167,139,250,0.1)"  iconColor="text-violet-400" />
        <PayStat icon={TrendingUp}  label="Months Covered"       value={loading ? '—' : STAT_MONTHS.length}    iconBg="rgba(251,191,36,0.1)"   iconColor="text-amber-400" />
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
                      <div className="flex flex-col items-center gap-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
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
                          <p className="font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
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
                      <td className="font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>{fmt(rec.grossPay ?? rec.basicSalary)}</td>
                      <td className="text-red-500">{fmt(rec.epfDeduction)}</td>
                      <td>
                        <span className="inline-block px-2.5 py-1 rounded-lg font-bold text-sm" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399' }}>
                          {fmt(rec.netPay ?? rec.netSalary)}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => setDeleteTarget(rec)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          style={{ color: 'rgba(255,255,255,0.3)' }}
                          onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#f87171'; }}
                          onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,0.3)'; }}
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
          <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{filtered.length} records</p>
            <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Total Net: <span style={{ color: '#22d3ee' }}>{fmt(totalNet)}</span>
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
          <div className="relative rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] w-full max-w-sm p-6 animate-fade-in-up text-center" style={{ background: '#0a1020', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>Delete Payroll Record</h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
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
