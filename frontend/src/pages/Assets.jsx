import { useEffect, useState } from 'react';
import { Plus, Search, Package, Wrench, ArrowRightLeft, Trash2, Filter, MoreHorizontal } from 'lucide-react';
import api from '../services/api';

const TABS = [
  { key: 'assets',      label: 'All Assets',    icon: Package },
  { key: 'maintenance', label: 'Maintenance',   icon: Wrench },
  { key: 'transfers',   label: 'Transfers',     icon: ArrowRightLeft },
  { key: 'disposals',   label: 'Disposals',     icon: Trash2 },
];

const statusConfig = {
  'Active':           { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Under Maintenance':{ bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  'Disposed':         { bg: 'bg-slate-100',  text: 'text-slate-500',   dot: 'bg-slate-400'   },
};

function EmptyState({ message }) {
  return (
    <tr>
      <td colSpan={10} className="px-5 py-16 text-center">
        <Package size={32} className="mx-auto text-slate-200 mb-3" />
        <p className="text-sm text-slate-400">{message}</p>
      </td>
    </tr>
  );
}

function SkeletonRows({ cols = 6 }) {
  return Array.from({ length: 4 }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      {Array.from({ length: cols }).map((__, j) => (
        <td key={j} className="px-5 py-4"><div className="h-3.5 bg-slate-100 rounded-full w-24" /></td>
      ))}
    </tr>
  ));
}

// ─── Sub-tab panels ───────────────────────────────────────────────────────────

function AssetsTable({ data, loading }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          {['Asset ID', 'Category', 'Description', 'Serial No.', 'Purchase Cost', 'Location', 'Responsible', 'Status', ''].map((h) => (
            <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {loading ? <SkeletonRows cols={9} /> : data.length === 0 ? (
          <EmptyState message="No assets registered yet." />
        ) : data.map((a) => {
          const cfg = statusConfig[a.currentStatus] || statusConfig['Active'];
          return (
            <tr key={a._id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-5 py-4 font-mono text-xs text-slate-600">{a.assetId}</td>
              <td className="px-5 py-4 text-slate-700 font-medium">{a.category}</td>
              <td className="px-5 py-4 text-slate-600 max-w-xs truncate">{a.description || '—'}</td>
              <td className="px-5 py-4 font-mono text-xs text-slate-500">{a.serialNumber || '—'}</td>
              <td className="px-5 py-4 text-slate-700 font-medium">LKR {a.purchaseCost?.toLocaleString()}</td>
              <td className="px-5 py-4 text-slate-600">{a.assignedLocation || '—'}</td>
              <td className="px-5 py-4 text-slate-600">{a.responsiblePerson || '—'}</td>
              <td className="px-5 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {a.currentStatus}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><MoreHorizontal size={14} /></button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function MaintenanceTable({ data, loading }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          {['Asset', 'Type', 'Service Provider', 'Date', 'Cost', 'Next Due', 'Notes'].map((h) => (
            <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {loading ? <SkeletonRows cols={7} /> : data.length === 0 ? (
          <EmptyState message="No maintenance records found." />
        ) : data.map((m) => (
          <tr key={m._id} className="hover:bg-slate-50 transition-colors">
            <td className="px-5 py-4">
              <p className="font-medium text-slate-800">{m.asset?.assetId}</p>
              <p className="text-xs text-slate-400">{m.asset?.category}</p>
            </td>
            <td className="px-5 py-4 text-slate-700">{m.maintenanceType}</td>
            <td className="px-5 py-4 text-slate-600">{m.serviceProvider || '—'}</td>
            <td className="px-5 py-4 text-slate-600">{m.maintenanceDate ? new Date(m.maintenanceDate).toLocaleDateString() : '—'}</td>
            <td className="px-5 py-4 text-slate-700 font-medium">LKR {m.cost?.toLocaleString()}</td>
            <td className="px-5 py-4 text-amber-600 font-medium">{m.nextMaintenanceDate ? new Date(m.nextMaintenanceDate).toLocaleDateString() : '—'}</td>
            <td className="px-5 py-4 text-slate-500 text-xs max-w-xs truncate">{m.notes || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TransfersTable({ data, loading }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          {['Asset', 'From', 'To', 'Transferred By', 'Approved By', 'Date', 'Remarks'].map((h) => (
            <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {loading ? <SkeletonRows cols={7} /> : data.length === 0 ? (
          <EmptyState message="No transfer records found." />
        ) : data.map((t) => (
          <tr key={t._id} className="hover:bg-slate-50 transition-colors">
            <td className="px-5 py-4">
              <p className="font-medium text-slate-800">{t.asset?.assetId}</p>
              <p className="text-xs text-slate-400">{t.asset?.category}</p>
            </td>
            <td className="px-5 py-4 text-slate-600">{t.currentLocation}</td>
            <td className="px-5 py-4">
              <span className="inline-flex items-center gap-1 text-indigo-700 font-semibold text-xs bg-indigo-50 px-2 py-1 rounded-full">
                <ArrowRightLeft size={11} /> {t.newLocation}
              </span>
            </td>
            <td className="px-5 py-4 text-slate-600">{t.transferredBy}</td>
            <td className="px-5 py-4 text-slate-600">{t.approvedBy || '—'}</td>
            <td className="px-5 py-4 text-slate-600">{t.transferDate ? new Date(t.transferDate).toLocaleDateString() : '—'}</td>
            <td className="px-5 py-4 text-slate-500 text-xs max-w-xs truncate">{t.remarks || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DisposalsTable({ data, loading }) {
  const methodColors = {
    Sale: 'bg-emerald-50 text-emerald-700',
    Scrap: 'bg-slate-100 text-slate-600',
    Donation: 'bg-indigo-50 text-indigo-700',
  };
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          {['Asset', 'Method', 'Date', 'Value Recovered', 'Approved By', 'Reason'].map((h) => (
            <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {loading ? <SkeletonRows cols={6} /> : data.length === 0 ? (
          <EmptyState message="No disposal records found." />
        ) : data.map((d) => (
          <tr key={d._id} className="hover:bg-slate-50 transition-colors">
            <td className="px-5 py-4">
              <p className="font-medium text-slate-800">{d.asset?.assetId}</p>
              <p className="text-xs text-slate-400">{d.asset?.category}</p>
            </td>
            <td className="px-5 py-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${methodColors[d.disposalMethod] || 'bg-slate-100 text-slate-600'}`}>
                {d.disposalMethod}
              </span>
            </td>
            <td className="px-5 py-4 text-slate-600">{d.disposalDate ? new Date(d.disposalDate).toLocaleDateString() : '—'}</td>
            <td className="px-5 py-4 text-emerald-600 font-medium">LKR {d.disposalValue?.toLocaleString()}</td>
            <td className="px-5 py-4 text-slate-600">{d.approvedBy || '—'}</td>
            <td className="px-5 py-4 text-slate-500 text-xs max-w-xs truncate">{d.reasonForDisposal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Assets() {
  const [activeTab, setActiveTab] = useState('assets');
  const [search, setSearch]       = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(true);
  const [data, setData] = useState({ assets: [], maintenance: [], transfers: [], disposals: [] });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [aRes, mRes, tRes, dRes] = await Promise.all([
        api.get('/assets'),
        api.get('/asset-maintenance'),
        api.get('/asset-transfers'),
        api.get('/asset-disposals'),
      ]);
      setData({
        assets:      aRes.data.data,
        maintenance: mRes.data.data,
        transfers:   tRes.data.data,
        disposals:   dRes.data.data,
      });
    } catch {
      setError('Failed to load asset data. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const currentData = data[activeTab] || [];
  const filtered = currentData.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.assetId?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.asset?.assetId?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  });

  const addButtonLabels = {
    assets:      'Register Asset',
    maintenance: 'Log Maintenance',
    transfers:   'Record Transfer',
    disposals:   'Dispose Asset',
  };

  return (
    <div className="space-y-5">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Asset Management</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Register, maintain, transfer, and dispose of company assets.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200/80 transition-all duration-200">
          <Plus size={16} />
          {addButtonLabels[activeTab]}
        </button>
      </div>

      {/* ── Summary Chips ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'assets',      label: 'All Assets',  icon: Package,       gradient: 'from-indigo-50 to-indigo-100/50',  iconCl: 'text-indigo-500' },
          { key: 'maintenance', label: 'Maintenance',  icon: Wrench,        gradient: 'from-amber-50 to-amber-100/50',    iconCl: 'text-amber-500'  },
          { key: 'transfers',   label: 'Transfers',    icon: ArrowRightLeft, gradient: 'from-teal-50 to-teal-100/50',      iconCl: 'text-teal-500'   },
          { key: 'disposals',   label: 'Disposals',    icon: Trash2,        gradient: 'from-rose-50 to-rose-100/50',      iconCl: 'text-rose-500'   },
        ].map(({ key, label, icon: Icon, gradient, iconCl }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setSearch(''); }}
            className={`bg-gradient-to-br ${gradient} border border-slate-100/80 rounded-2xl px-4 py-3 flex items-center gap-3 text-left shadow-[0_4px_16px_rgb(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${ activeTab === key ? 'ring-2 ring-indigo-300/60' : '' }`}
          >
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <Icon size={16} className={iconCl} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">{label}</p>
              <p className="text-xl font-bold text-slate-800 leading-tight">{loading ? '...' : data[key]?.length}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex gap-1 bg-slate-100/80 border border-slate-200/60 p-1 rounded-2xl w-full overflow-x-auto shadow-inner">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setSearch(''); }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
              activeTab === key
                ? 'bg-white text-indigo-600 shadow-md shadow-slate-200/80 scale-[0.99]'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      {/* ── Search + Filter Bar ── */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={`Search ${TABS.find((t) => t.key === activeTab)?.label.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition shrink-0">
          <Filter size={14} />
          Filter
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'assets'      && <AssetsTable      data={filtered} loading={loading} />}
          {activeTab === 'maintenance' && <MaintenanceTable data={filtered} loading={loading} />}
          {activeTab === 'transfers'   && <TransfersTable   data={filtered} loading={loading} />}
          {activeTab === 'disposals'   && <DisposalsTable   data={filtered} loading={loading} />}
        </div>
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">Showing {filtered.length} record{filtered.length !== 1 && 's'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
