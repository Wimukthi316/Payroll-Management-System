import { useEffect, useState, useMemo } from 'react';
import {
  UserPlus, Search, Pencil, Trash2, X, ChevronUp, ChevronDown,
  Mail, Phone, Briefcase, Building2, Calendar, DollarSign, Save,
  AlertTriangle, UserCircle,
} from 'lucide-react';
import { employeeAPI } from '../services/api';


const ROLE_BADGE = {
  Admin:      'badge-blue',
  HR:         'badge-green',
  Accountant: 'badge-amber',
};

const EMPTY_FORM = {
  employeeId: '', firstName: '', lastName: '', email: '',
  phone: '', role: 'HR', department: '', basicSalary: '', dateJoined: '',
};

/* ── Skeleton row ──────────────────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="border-b border-slate-50">
      {[40, 160, 140, 100, 100, 90, 80].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className="skeleton h-4 rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

/* ── Field primitives ─────────────────────────────────────────────────────── */
const FIELD_BASE = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.85)',
  borderRadius: 10,
  outline: 'none',
  width: '100%',
  padding: '7px 10px',
  fontSize: 14,
  transition: 'border-color 0.15s, box-shadow 0.15s',
};
const FIELD_FOCUS = { borderColor: 'rgba(99,102,241,0.6)', boxShadow: '0 0 0 3px rgba(99,102,241,0.15)' };
const FIELD_ERROR = { borderColor: 'rgba(239,68,68,0.5)', boxShadow: '0 0 0 3px rgba(239,68,68,0.1)' };

function EField({ name, label, type = 'text', icon: Icon, required, options, half = true, form, errors, onChange }) {
  const hasErr = !!errors?.[name];
  const style  = { ...FIELD_BASE, ...(hasErr ? FIELD_ERROR : {}) };
  return (
    <div className={half ? '' : 'col-span-1 md:col-span-2'}>
      <label className="block text-xs font-semibold mb-1" style={{ color: hasErr ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
        {label}{required && <span className="ml-0.5" style={{ color: '#f87171' }}>*</span>}
      </label>
      {options ? (
        <div className="relative">
          <select
            name={name} value={form[name] ?? ''} onChange={onChange}
            style={{ ...style, paddingRight: 36, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
            onFocus={e => Object.assign(e.currentTarget.style, FIELD_FOCUS)}
            onBlur={e => Object.assign(e.currentTarget.style, hasErr ? FIELD_ERROR : { borderColor: 'rgba(255,255,255,0.1)', boxShadow: '' })}
          >
            {options.map((o) => <option key={o} style={{ background: '#0d1526' }}>{o}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
        </div>
      ) : (
        <div className="relative">
          {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />}
          <input
            name={name} type={type}
            value={type === 'date' ? (form[name] ?? '').split('T')[0] : (form[name] ?? '')}
            onChange={onChange}
            style={{ ...style, paddingLeft: Icon ? 34 : 12 }}
            onFocus={e => Object.assign(e.currentTarget.style, FIELD_FOCUS)}
            onBlur={e => Object.assign(e.currentTarget.style, hasErr ? FIELD_ERROR : { borderColor: 'rgba(255,255,255,0.1)', boxShadow: '' })}
            placeholder={type === 'date' ? undefined : `Enter ${label.toLowerCase()}…`}
          />
        </div>
      )}
      {hasErr && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors[name]}</p>}
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="col-span-1 md:col-span-2 flex items-center gap-2">
      <p className="text-xs font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: 'rgba(99,102,241,0.8)' }}>{label}</p>
      <div className="flex-1 h-px" style={{ background: 'rgba(99,102,241,0.15)' }} />
    </div>
  );
}

/* ── Modal ─────────────────────────────────────────────────────────────────── */
function EmployeeModal({ open, onClose, onSave, initial, saving }) {
  const [form, setForm]     = useState(initial ?? EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEdit = !!initial?._id;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.employeeId?.trim())  errs.employeeId  = 'Employee ID is required';
    if (!form.firstName?.trim())   errs.firstName   = 'First name is required';
    if (!form.lastName?.trim())    errs.lastName    = 'Last name is required';
    if (!form.email?.trim())       errs.email       = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.basicSalary || Number(form.basicSalary) <= 0) errs.basicSalary = 'Enter a valid salary';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative mt-60 w-full max-w-3xl bg-slate-900 rounded-2xl shadow-2xl p-6 animate-fade-in-up flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>

        {/* ── Sticky Header ── */}
        <div className="shrink-0 flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.3)' }}>
              <UserCircle size={20} style={{ color: '#818cf8' }} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: 'rgba(255,255,255,0.92)' }}>
                {isEdit ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {isEdit ? 'Update employee information' : 'Fill in all required fields to register a new team member'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='rgba(255,255,255,0.8)'; }}
            onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,0.3)'; }}
          >
            <X size={17} />
          </button>
        </div>

        {/* ── Scrollable Form Area ── */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="employee-form" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionDivider label="Identity" />
            <EField name="employeeId" label="Employee ID" icon={Briefcase} required form={form} errors={errors} onChange={handleChange} />
            <EField name="role" label="Role" options={['Admin', 'HR', 'Accountant']} required form={form} errors={errors} onChange={handleChange} />
            <EField name="firstName" label="First Name" required form={form} errors={errors} onChange={handleChange} />
            <EField name="lastName" label="Last Name" required form={form} errors={errors} onChange={handleChange} />

            <SectionDivider label="Contact" />
            <EField name="email" label="Email Address" icon={Mail} type="email" required form={form} errors={errors} onChange={handleChange} />
            <EField name="phone" label="Phone Number" icon={Phone} form={form} errors={errors} onChange={handleChange} />

            <SectionDivider label="Employment" />
            <EField name="department" label="Department" icon={Building2} form={form} errors={errors} onChange={handleChange} />
            <EField name="basicSalary" label="Basic Salary ($)" icon={DollarSign} type="number" required form={form} errors={errors} onChange={handleChange} />
            <EField name="dateJoined" label="Date Joined" icon={Calendar} type="date" half={false} form={form} errors={errors} onChange={handleChange} />
            </div>
          </form>
        </div>

        {/* ── Sticky Footer ── */}
        <div className="shrink-0 flex items-center justify-end gap-3 pt-5">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            type="submit" form="employee-form" disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.boxShadow='0 0 28px rgba(99,102,241,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 20px rgba(99,102,241,0.35)'; }}
          >
            {saving
              ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              : <><Save size={14} /> {isEdit ? 'Save Changes' : 'Add Employee'}</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── Delete Confirm ────────────────────────────────────────────────────────── */
function DeleteModal({ employee, onClose, onConfirm, loading }) {
  if (!employee) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] w-full max-w-sm p-6 animate-fade-in-up text-center" style={{ background: '#0a1020', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.1)' }}>
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>Delete Employee</h3>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Are you sure you want to delete <strong>{employee.firstName} {employee.lastName}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60">
            {loading ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : <><Trash2 size={15}/> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────────── */
export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortKey, setSortKey]     = useState('firstName');
  const [sortDir, setSortDir]     = useState('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [toast, setToast]         = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function load() {
    setLoading(true);
    try {
      const res = await employeeAPI.getAll();
      setEmployees(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let data = employees;
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((e) =>
        `${e.firstName} ${e.lastName} ${e.email} ${e.department} ${e.employeeId}`
          .toLowerCase().includes(q)
      );
    }
    if (roleFilter !== 'All') data = data.filter((e) => e.role === roleFilter);
    return [...data].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [employees, search, roleFilter, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  const SortIcon = ({ k }) => sortKey === k
    ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
    : <ChevronUp size={13} className="opacity-20" />;

  async function handleSave(form) {
    setSaving(true);
    try {
      if (editTarget?._id) {
        await employeeAPI.update(editTarget._id, form);
        showToast('Employee updated successfully');
      } else {
        await employeeAPI.create(form);
        showToast('Employee added successfully');
      }
      setModalOpen(false);
      setEditTarget(null);
      load();
    } catch (err) {
      showToast(err?.response?.data?.message ?? 'Failed to save. Please check the form.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await employeeAPI.delete(deleteTarget._id);
      showToast('Employee deleted');
      setDeleteTarget(null);
      load();
    } catch {
      showToast('Failed to delete employee.');
    } finally {
      setDeleting(false);
    }
  }

  const COLS = [
    { key: 'employeeId', label: 'ID' },
    { key: 'firstName',  label: 'Name' },
    { key: 'email',      label: 'Email' },
    { key: 'role',       label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'basicSalary', label: 'Salary' },
  ];

  return (
    <div className="page-container space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl px-5 py-3.5 text-sm font-medium flex items-center gap-3 animate-fade-in-up" style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Employees</h2>
          <p className="section-subtitle">
            {loading ? '...' : `${employees.length} team members`}
          </p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="btn-primary"
        >
          <UserPlus size={16} /> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Admin', 'HR', 'Accountant'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
              style={roleFilter === r
                ? { background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', color: '#fff', boxShadow: '0 0 16px rgba(6,182,212,0.3)' }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
              }
              onMouseEnter={e => { if (roleFilter !== r) { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='rgba(255,255,255,0.8)'; } }}
              onMouseLeave={e => { if (roleFilter !== r) { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; } }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {COLS.map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                    className="cursor-pointer select-none group"
                  >
                    <span className="inline-flex items-center gap-1 hover:text-indigo-600 transition-colors">
                      {label}
                      <SortIcon k={key} />
                    </span>
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                : filtered.length === 0
                ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <Search size={22} />
                        </div>
                        <p className="font-medium text-sm">No employees found</p>
                        <p className="text-xs">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )
                : filtered.map((emp) => (
                  <tr key={emp._id}>
                    <td className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{emp.employeeId}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(255,255,255,0.08)', boxShadow: '0 0 0 2px rgba(6,182,212,0.3)' }}
                        >
                          <UserCircle size={20} className="text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs truncate hidden sm:block" style={{ color: 'rgba(255,255,255,0.3)' }}>{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell truncate max-w-[180px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{emp.email}</td>
                    <td>
                      <span className={ROLE_BADGE[emp.role] ?? 'badge-slate'}>{emp.role}</span>
                    </td>
                    <td style={{ color: 'rgba(255,255,255,0.45)' }}>{emp.department || '—'}</td>
                    <td className="font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {emp.basicSalary != null ? `$${Number(emp.basicSalary).toLocaleString()}` : '—'}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setEditTarget(emp); setModalOpen(true); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                          style={{ color: 'rgba(255,255,255,0.3)' }}
                          onMouseEnter={e => { e.currentTarget.style.background='rgba(6,182,212,0.1)'; e.currentTarget.style.color='#22d3ee'; }}
                          onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,0.3)'; }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                          style={{ color: 'rgba(255,255,255,0.3)' }}
                          onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#f87171'; }}
                          onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,0.3)'; }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 text-xs flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
            <span>Showing {filtered.length} of {employees.length} records</span>
          </div>
        )}
      </div>

      {/* Modals */}
      <EmployeeModal
        key={editTarget?._id ?? 'new'}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        initial={editTarget}
        saving={saving}
      />
      <DeleteModal
        employee={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
