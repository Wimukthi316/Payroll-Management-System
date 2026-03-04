import { useEffect, useState, useMemo } from 'react';
import {
  UserPlus, Search, Pencil, Trash2, X, ChevronUp, ChevronDown,
  Mail, Phone, Briefcase, Building2, Calendar, DollarSign, Save,
  AlertTriangle,
} from 'lucide-react';
import { employeeAPI } from '../services/api';

const AVATAR_SEEDS = [
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=80&h=80&auto=format&fit=facearea&facepad=2',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=80&h=80&auto=format&fit=facearea&facepad=2',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80&h=80&auto=format&fit=facearea&facepad=2',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80&h=80&auto=format&fit=facearea&facepad=2',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=80&h=80&auto=format&fit=facearea&facepad=2',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=80&h=80&auto=format&fit=facearea&facepad=2',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=80&h=80&auto=format&fit=facearea&facepad=2',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=80&h=80&auto=format&fit=facearea&facepad=2',
];

function getAvatar(id) {
  const hash = [...String(id ?? '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_SEEDS[hash % AVATAR_SEEDS.length];
}

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

/* ── Modal ─────────────────────────────────────────────────────────────────── */
function EmployeeModal({ open, onClose, onSave, initial, saving }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  useEffect(() => { setForm(initial ?? EMPTY_FORM); }, [initial]);
  const isEdit = !!initial?._id;

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  if (!open) return null;

  const F = ({ name, label, type = 'text', icon: Icon, required, options }) => (
    <div>
      <label className="label">{label}</label>
      {options ? (
        <select name={name} value={form[name]} onChange={handleChange} className="input" required={required}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <div className="relative">
          {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
          <input
            name={name}
            type={type}
            value={form[name]}
            onChange={handleChange}
            required={required}
            className={`input ${Icon ? 'pl-10' : ''}`}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-[0_30px_80px_rgb(0,0,0,0.18)] w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{isEdit ? 'Update employee information' : 'Fill in the details below'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition-colors">
            <X size={18} />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          <F name="employeeId" label="Employee ID"    icon={Briefcase} required />
          <F name="role"       label="Role"            options={['Admin', 'HR', 'Accountant']} required />
          <F name="firstName"  label="First Name"      required />
          <F name="lastName"   label="Last Name"       required />
          <F name="email"      label="Email"           icon={Mail}  type="email"  required />
          <F name="phone"      label="Phone"           icon={Phone} />
          <F name="department" label="Department"      icon={Building2} />
          <F name="basicSalary" label="Basic Salary ($)" icon={DollarSign} type="number" required />
          <div className="sm:col-span-2">
            <label className="label">Date Joined</label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                name="dateJoined"
                type="date"
                value={form.dateJoined ? form.dateJoined.split('T')[0] : ''}
                onChange={handleChange}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving
                ? <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : <><Save size={15}/> {isEdit ? 'Save Changes' : 'Add Employee'}</>
              }
            </button>
          </div>
        </form>
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
      <div className="relative bg-white rounded-2xl shadow-[0_30px_80px_rgb(0,0,0,0.18)] w-full max-w-sm p-6 animate-fade-in-up text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Employee</h3>
        <p className="text-sm text-slate-500 mb-6">
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
      setEmployees(res.data ?? []);
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
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-800 flex items-center gap-3 animate-fade-in-up">
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
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                roleFilter === r
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-btn'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
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
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
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
                    <td className="text-xs font-mono text-slate-400">{emp.employeeId}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={getAvatar(emp.employeeId)}
                          alt={`${emp.firstName}`}
                          className="w-8 h-8 rounded-full ring-2 ring-white shadow object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-slate-400 truncate hidden sm:block">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell text-slate-500 truncate max-w-[180px]">{emp.email}</td>
                    <td>
                      <span className={ROLE_BADGE[emp.role] ?? 'badge-slate'}>{emp.role}</span>
                    </td>
                    <td className="text-slate-500">{emp.department || '—'}</td>
                    <td className="font-semibold text-slate-700">
                      {emp.basicSalary != null ? `$${Number(emp.basicSalary).toLocaleString()}` : '—'}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setEditTarget(emp); setModalOpen(true); }}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center transition-all duration-150"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all duration-150"
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
          <div className="px-5 py-3 border-t border-slate-50 text-xs text-slate-400 flex items-center justify-between">
            <span>Showing {filtered.length} of {employees.length} records</span>
          </div>
        )}
      </div>

      {/* Modals */}
      <EmployeeModal
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
