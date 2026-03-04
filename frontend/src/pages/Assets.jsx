import { useEffect, useState, useMemo } from 'react';
import {
  Package, Wrench, ArrowLeftRight, Trash2,
  Plus, Search, X, Save, AlertTriangle, ChevronDown,
  Calendar, DollarSign, MapPin, User,
} from 'lucide-react';
import { assetAPI, maintenanceAPI, transferAPI, disposalAPI } from '../services/api';

/* ─────────────────────────────────────────────── helpers ── */
function fmt(n) {
  if (n == null) return '—';
  return `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const STATUS_BADGE = {
  Active:       'badge-green',
  'In Repair':  'badge-amber',
  Disposed:     'badge-red',
  Transferred:  'badge-blue',
};

/* ─── Skeleton row ──────────────────────────────────────────────────────────── */
function SkeletonRow({ cols = 6 }) {
  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="skeleton h-4 rounded" style={{ width: 60 + i * 14 }} />
        </td>
      ))}
    </tr>
  );
}

/* ─── Empty State ───────────────────────────────────────────────────────────── */
function EmptyState({ icon: Icon, label }) {
  return (
    <tr>
      <td colSpan={10} className="px-5 py-16 text-center">
        <div className="flex flex-col items-center gap-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <Icon size={22} />
          </div>
          <p className="font-medium text-sm">{label}</p>
        </div>
      </td>
    </tr>
  );
}

/* ─── Reusable asset modal field ───────────────────────────────────────────── */
function AssetModalField({ name, label, type = 'text', icon: Icon, options, col2, form, onChange }) {
  return (
    <div className={col2 ? 'sm:col-span-2' : ''}>
      <label className="label">{label}</label>
      {options ? (
        <div className="relative">
          <select name={name} value={form[name] ?? ''} onChange={onChange} className="input appearance-none pr-8">
            {options.map((o) => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
        </div>
      ) : (
        <div className="relative">
          {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />}
          <input
            name={name} type={type} value={form[name] ?? ''}
            onChange={onChange}
            className={`input ${Icon ? 'pl-10' : ''}`}
          />
        </div>
      )}
    </div>
  );
}

/* ─── Asset Form Modal ──────────────────────────────────────────────────────── */
const EMPTY_ASSET = {
  assetId: '', category: 'IT Equipment', description: '', serialNumber: '',
  purchaseDate: '', supplier: '', purchaseCost: '', depreciationRate: '',
  assignedLocation: '', responsiblePerson: '', status: 'Active',
};

function AssetModal({ open, onClose, onSave, initial, saving }) {
  const [form, setForm] = useState(initial ?? EMPTY_ASSET);
  const isEdit = !!initial?._id;

  function handleChange(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); }
  function handleSubmit(e) { e.preventDefault(); onSave(form); }
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up" style={{ background: '#0a1020', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10 rounded-t-2xl" style={{ background: '#0a1020', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{isEdit ? 'Edit Asset' : 'Add New Asset'}</h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Fill in the asset details below</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(255,255,255,0.8)'; }}
            onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,0.35)'; }}
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          <AssetModalField name="assetId" label="Asset ID" required form={form} onChange={handleChange} />
          <AssetModalField name="category" label="Category" required
            options={['IT Equipment', 'Furniture', 'Vehicles', 'Machinery', 'Office Supplies', 'Other']}
            form={form} onChange={handleChange} />
          <AssetModalField name="serialNumber" label="Serial Number" form={form} onChange={handleChange} />
          <AssetModalField name="supplier"          label="Supplier" form={form} onChange={handleChange} />
          <AssetModalField name="purchaseDate"      label="Purchase Date"      type="date" icon={Calendar} form={form} onChange={handleChange} />
          <AssetModalField name="purchaseCost"      label="Purchase Cost ($)"  type="number" icon={DollarSign} required form={form} onChange={handleChange} />
          <AssetModalField name="depreciationRate"  label="Depreciation Rate (%)" type="number" form={form} onChange={handleChange} />
          <AssetModalField name="assignedLocation"  label="Location"           icon={MapPin} form={form} onChange={handleChange} />
          <AssetModalField name="responsiblePerson" label="Responsible Person" icon={User} form={form} onChange={handleChange} />
          <AssetModalField name="status"            label="Status"             options={['Active', 'In Repair', 'Disposed', 'Transferred']} form={form} onChange={handleChange} />
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="input resize-none"
              placeholder="Optional description…"
            />
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              : <><Save size={15} /> {isEdit ? 'Save Changes' : 'Add Asset'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete confirm ────────────────────────────────────────────────────────── */
function DeleteModal({ item, label, onClose, onConfirm, loading }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] w-full max-w-sm p-6 animate-fade-in-up text-center" style={{ background: '#0a1020', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.1)' }}>
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>Delete {label}</h3>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>This action cannot be undone.</p>
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

/* ─── All Assets Tab ────────────────────────────────────────────────────────── */
function AllAssetsTab({ toast }) {
  const [assets, setAssets]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await assetAPI.getAll();
      setAssets(Array.isArray(r.data?.data) ? r.data.data : []);
    } catch { setAssets([]); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search) return assets;
    const q = search.toLowerCase();
    return assets.filter((a) =>
      `${a.assetId} ${a.category} ${a.assignedLocation} ${a.responsiblePerson}`.toLowerCase().includes(q)
    );
  }, [assets, search]);

  async function handleSave(form) {
    setSaving(true);
    try {
      editTarget?._id ? await assetAPI.update(editTarget._id, form) : await assetAPI.create(form);
      setModalOpen(false); setEditTarget(null); toast(editTarget?._id ? 'Asset updated' : 'Asset added'); load();
    } catch (err) { toast(err?.response?.data?.message ?? 'Save failed.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setDeleting(true);
    try { await assetAPI.delete(deleteTarget._id); setDeleteTarget(null); toast('Asset deleted'); load(); }
    catch { toast('Delete failed.'); }
    finally { setDeleting(false); }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets…" className="input pl-10" />
        </div>
        <button onClick={() => { setEditTarget(null); setModalOpen(true); }} className="btn-primary">
          <Plus size={15} /> Add Asset
        </button>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>{['Asset ID', 'Category', 'Purchase Date', 'Cost', 'Location', 'Person', 'Status', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={8} />) :
               filtered.length === 0 ? <EmptyState icon={Package} label="No assets found" /> :
               filtered.map((a) => (
                <tr key={a._id}>
                  <td className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{a.assetId}</td>
                  <td className="font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>{a.category}</td>
                  <td style={{ color: 'rgba(255,255,255,0.4)' }}>{fmtDate(a.purchaseDate)}</td>
                  <td className="font-medium">{fmt(a.purchaseCost)}</td>
                  <td style={{ color: 'rgba(255,255,255,0.4)' }}>{a.assignedLocation || '—'}</td>
                  <td style={{ color: 'rgba(255,255,255,0.4)' }}>{a.responsiblePerson || '—'}</td>
                  <td><span className={STATUS_BADGE[a.status] ?? 'badge-slate'}>{a.status ?? 'Active'}</span></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => { setEditTarget(a); setModalOpen(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ color: 'rgba(255,255,255,0.3)' }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(6,182,212,0.1)'; e.currentTarget.style.color='#22d3ee'; }}
                        onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,0.3)'; }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={() => setDeleteTarget(a)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ color: 'rgba(255,255,255,0.3)' }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#f87171'; }}
                        onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,0.3)'; }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AssetModal key={editTarget?._id ?? 'new'} open={modalOpen} onClose={() => { setModalOpen(false); setEditTarget(null); }} onSave={handleSave} initial={editTarget} saving={saving} />
      <DeleteModal item={deleteTarget} label="Asset" onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
    </>
  );
}

/* ─── Maintenance Tab ───────────────────────────────────────────────────────── */
function MaintenanceTab({ toast }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets]   = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]       = useState({ asset: '', scheduledDate: '', description: '', cost: '', status: 'Scheduled' });
  const [saving, setSaving]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [mRes, aRes] = await Promise.allSettled([maintenanceAPI.getAll(), assetAPI.getAll()]);
      setRecords(mRes.status === 'fulfilled' ? (Array.isArray(mRes.value.data?.data) ? mRes.value.data.data : []) : []);
      setAssets(aRes.status === 'fulfilled'  ? (Array.isArray(aRes.value.data?.data)  ? aRes.value.data.data  : []) : []);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function handleSave(e) {
    e.preventDefault(); setSaving(true);
    try { await maintenanceAPI.create(form); setModalOpen(false); toast('Maintenance record added'); load(); }
    catch (err) { toast(err?.response?.data?.message ?? 'Save failed.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setDeleting(true);
    try { await maintenanceAPI.delete(deleteTarget._id); setDeleteTarget(null); toast('Record deleted'); load(); }
    catch { toast('Delete failed.'); }
    finally { setDeleting(false); }
  }

  return (
    <>
      <div className="flex justify-end mb-5">
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={15} /> Schedule Maintenance
        </button>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>{['Asset', 'Scheduled Date', 'Description', 'Cost', 'Status', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />) :
               records.length === 0 ? <EmptyState icon={Wrench} label="No maintenance records" /> :
               records.map((r) => (
                <tr key={r._id}>
                  <td className="font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{r.asset?.assetId ?? r.asset ?? '—'}</td>
                  <td>{fmtDate(r.scheduledDate)}</td>
                  <td className="max-w-[220px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.description || '—'}</td>
                  <td>{fmt(r.cost)}</td>
                  <td><span className={r.status === 'Completed' ? 'badge-green' : r.status === 'In Progress' ? 'badge-amber' : 'badge-blue'}>{r.status}</span></td>
                  <td>
                    <button onClick={() => setDeleteTarget(r)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ color: 'rgba(255,255,255,0.3)' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#f87171'; }}
                      onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,0.3)'; }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] w-full max-w-md p-6 animate-fade-in-up" style={{ background: '#0a1020', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>Schedule Maintenance</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.background=''; }}
              ><X size={17}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Asset</label>
                <div className="relative">
                  <select value={form.asset} onChange={(e) => setForm((f) => ({...f, asset: e.target.value}))} className="input appearance-none pr-8" required>
                    <option value="">Select asset…</option>
                    {assets.map((a) => <option key={a._id} value={a._id}>{a.assetId} — {a.category}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
                </div>
              </div>
              <div>
                <label className="label">Scheduled Date</label>
                <input type="date" value={form.scheduledDate} onChange={(e) => setForm((f) => ({...f, scheduledDate: e.target.value}))} className="input" required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({...f, description: e.target.value}))} className="input resize-none" placeholder="Describe the maintenance…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Estimated Cost ($)</label>
                  <input type="number" value={form.cost} onChange={(e) => setForm((f) => ({...f, cost: e.target.value}))} className="input" placeholder="0" />
                </div>
                <div>
                  <label className="label">Status</label>
                  <div className="relative">
                    <select value={form.status} onChange={(e) => setForm((f) => ({...f, status: e.target.value}))} className="input appearance-none pr-8">
                      {['Scheduled', 'In Progress', 'Completed'].map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  : <><Save size={15}/> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DeleteModal item={deleteTarget} label="Maintenance Record" onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
    </>
  );
}

/* ─── Transfers Tab ─────────────────────────────────────────────────────────── */
function TransfersTab({ toast }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets]   = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]       = useState({ asset: '', fromLocation: '', toLocation: '', transferDate: '', transferredBy: '' });
  const [saving, setSaving]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [tRes, aRes] = await Promise.allSettled([transferAPI.getAll(), assetAPI.getAll()]);
      setRecords(tRes.status === 'fulfilled' ? (Array.isArray(tRes.value.data?.data) ? tRes.value.data.data : []) : []);
      setAssets(aRes.status === 'fulfilled'  ? (Array.isArray(aRes.value.data?.data)  ? aRes.value.data.data  : []) : []);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function handleSave(e) {
    e.preventDefault(); setSaving(true);
    try { await transferAPI.create(form); setModalOpen(false); toast('Transfer recorded'); load(); }
    catch (err) { toast(err?.response?.data?.message ?? 'Save failed.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setDeleting(true);
    try { await transferAPI.delete(deleteTarget._id); setDeleteTarget(null); toast('Record deleted'); load(); }
    catch { toast('Delete failed.'); }
    finally { setDeleting(false); }
  }

  return (
    <>
      <div className="flex justify-end mb-5">
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={15} /> Record Transfer
        </button>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>{['Asset', 'From', 'To', 'Date', 'Transferred By', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />) :
               records.length === 0 ? <EmptyState icon={ArrowLeftRight} label="No transfer records" /> :
               records.map((r) => (
                <tr key={r._id}>
                  <td className="font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{r.asset?.assetId ?? r.asset ?? '—'}</td>
                  <td style={{ color: 'rgba(255,255,255,0.4)' }}>{r.fromLocation || '—'}</td>
                  <td className="font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{r.toLocation || '—'}</td>
                  <td>{fmtDate(r.transferDate)}</td>
                  <td style={{ color: 'rgba(255,255,255,0.4)' }}>{r.transferredBy || '—'}</td>
                  <td>
                    <button onClick={() => setDeleteTarget(r)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ color: 'rgba(255,255,255,0.3)' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#f87171'; }}
                      onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,0.3)'; }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] w-full max-w-md p-6 animate-fade-in-up" style={{ background: '#0a1020', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>Record Asset Transfer</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.background=''; }}
              ><X size={17}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Asset</label>
                <div className="relative">
                  <select value={form.asset} onChange={(e) => setForm((f) => ({...f, asset: e.target.value}))} className="input appearance-none pr-8" required>
                    <option value="">Select asset…</option>
                    {assets.map((a) => <option key={a._id} value={a._id}>{a.assetId} — {a.category}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">From Location</label><input value={form.fromLocation} onChange={(e) => setForm((f) => ({...f, fromLocation: e.target.value}))} className="input" placeholder="e.g. HQ Floor 2" /></div>
                <div><label className="label">To Location</label><input value={form.toLocation} onChange={(e) => setForm((f) => ({...f, toLocation: e.target.value}))} className="input" placeholder="e.g. Branch Office" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Transfer Date</label><input type="date" value={form.transferDate} onChange={(e) => setForm((f) => ({...f, transferDate: e.target.value}))} className="input" required /></div>
                <div><label className="label">Transferred By</label><input value={form.transferredBy} onChange={(e) => setForm((f) => ({...f, transferredBy: e.target.value}))} className="input" placeholder="Name" /></div>
              </div>
              <div className="flex gap-3 justify-end pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  : <><Save size={15}/> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DeleteModal item={deleteTarget} label="Transfer Record" onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
    </>
  );
}

/* ─── Disposal Tab ──────────────────────────────────────────────────────────── */
function DisposalTab({ toast }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets]   = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]       = useState({ asset: '', disposalDate: '', method: 'Sold', saleAmount: '', reason: '' });
  const [saving, setSaving]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [dRes, aRes] = await Promise.allSettled([disposalAPI.getAll(), assetAPI.getAll()]);
      setRecords(dRes.status === 'fulfilled' ? (Array.isArray(dRes.value.data?.data) ? dRes.value.data.data : []) : []);
      setAssets(aRes.status === 'fulfilled'  ? (Array.isArray(aRes.value.data?.data)  ? aRes.value.data.data  : []) : []);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function handleSave(e) {
    e.preventDefault(); setSaving(true);
    try { await disposalAPI.create(form); setModalOpen(false); toast('Disposal recorded'); load(); }
    catch (err) { toast(err?.response?.data?.message ?? 'Save failed.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setDeleting(true);
    try { await disposalAPI.delete(deleteTarget._id); setDeleteTarget(null); toast('Record deleted'); load(); }
    catch { toast('Delete failed.'); }
    finally { setDeleting(false); }
  }

  return (
    <>
      <div className="flex justify-end mb-5">
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={15} /> Record Disposal
        </button>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>{['Asset', 'Disposal Date', 'Method', 'Sale Amount', 'Reason', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />) :
               records.length === 0 ? <EmptyState icon={Trash2} label="No disposal records" /> :
               records.map((r) => (
                <tr key={r._id}>
                  <td className="font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{r.asset?.assetId ?? r.asset ?? '—'}</td>
                  <td>{fmtDate(r.disposalDate)}</td>
                  <td><span className={r.method === 'Sold' ? 'badge-green' : r.method === 'Donated' ? 'badge-blue' : 'badge-red'}>{r.method}</span></td>
                  <td>{fmt(r.saleAmount)}</td>
                  <td className="max-w-[200px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.reason || '—'}</td>
                  <td>
                    <button onClick={() => setDeleteTarget(r)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ color: 'rgba(255,255,255,0.3)' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#f87171'; }}
                      onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,0.3)'; }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] w-full max-w-md p-6 animate-fade-in-up" style={{ background: '#0a1020', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>Record Asset Disposal</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.background=''; }}
              ><X size={17}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Asset</label>
                <div className="relative">
                  <select value={form.asset} onChange={(e) => setForm((f) => ({...f, asset: e.target.value}))} className="input appearance-none pr-8" required>
                    <option value="">Select asset…</option>
                    {assets.map((a) => <option key={a._id} value={a._id}>{a.assetId} — {a.category}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Disposal Date</label><input type="date" value={form.disposalDate} onChange={(e) => setForm((f) => ({...f, disposalDate: e.target.value}))} className="input" required /></div>
                <div>
                  <label className="label">Method</label>
                  <div className="relative">
                    <select value={form.method} onChange={(e) => setForm((f) => ({...f, method: e.target.value}))} className="input appearance-none pr-8">
                      {['Sold', 'Donated', 'Scrapped', 'Returned'].map((m) => <option key={m}>{m}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
                  </div>
                </div>
              </div>
              <div><label className="label">Sale Amount ($)</label><input type="number" value={form.saleAmount} onChange={(e) => setForm((f) => ({...f, saleAmount: e.target.value}))} className="input" placeholder="0.00" /></div>
              <div><label className="label">Reason</label><textarea rows={2} value={form.reason} onChange={(e) => setForm((f) => ({...f, reason: e.target.value}))} className="input resize-none" placeholder="Why is this asset being disposed?" /></div>
              <div className="flex gap-3 justify-end pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  : <><Save size={15}/> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DeleteModal item={deleteTarget} label="Disposal Record" onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
    </>
  );
}

/* ─── Main Assets Page ──────────────────────────────────────────────────────── */
const TABS = [
  { id: 'assets',      label: 'All Assets',  icon: Package },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'transfers',   label: 'Transfers',   icon: ArrowLeftRight },
  { id: 'disposal',    label: 'Disposal',    icon: Trash2 },
];

export default function Assets() {
  const [activeTab, setActiveTab] = useState('assets');
  const [toast, setToast]         = useState('');

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  return (
    <div className="page-container space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl px-5 py-3.5 text-sm font-medium flex items-center gap-3 animate-fade-in-up" style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {toast}
        </div>
      )}

      {/* Page header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Assets</h2>
          <p className="section-subtitle">Track, manage, and audit company assets</p>
        </div>
      </div>

      {/* Vercel-style Animated Tabs */}
      <div className="relative flex items-center gap-1 p-1 rounded-xl w-fit overflow-x-auto max-w-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap select-none"
            style={activeTab === id
              ? { background: 'linear-gradient(135deg,rgba(6,182,212,0.18),rgba(59,130,246,0.12))', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.25)', boxShadow: '0 0 12px rgba(6,182,212,0.1)' }
              : { color: 'rgba(255,255,255,0.4)' }
            }
            onMouseEnter={e => { if (activeTab !== id) { e.currentTarget.style.color='rgba(255,255,255,0.7)'; e.currentTarget.style.background='rgba(255,255,255,0.05)'; } }}
            onMouseLeave={e => { if (activeTab !== id) { e.currentTarget.style.color='rgba(255,255,255,0.4)'; e.currentTarget.style.background=''; } }}
          >
            <Icon size={15} className="flex-shrink-0" style={{ color: activeTab === id ? '#22d3ee' : undefined }} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === 'assets'      && <AllAssetsTab  toast={showToast} />}
        {activeTab === 'maintenance' && <MaintenanceTab toast={showToast} />}
        {activeTab === 'transfers'   && <TransfersTab  toast={showToast} />}
        {activeTab === 'disposal'    && <DisposalTab   toast={showToast} />}
      </div>
    </div>
  );
}
