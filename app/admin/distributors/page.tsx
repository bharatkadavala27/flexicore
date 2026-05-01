'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/admin-auth';
import { Plus, Pencil, Trash2, X, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

const ic = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-white focus:ring-2 focus:ring-amber-200";
const is = { border: '1px solid rgba(0,0,0,0.12)', color: '#1a1a1a' };
const lc = "block text-xs font-semibold mb-1.5 uppercase tracking-wide";
const ls = { color: '#6b5a4a' };

export default function DistributorsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const emptyForm = { companyName: '', contactPerson: '', email: '', phone: '', pinCode: '', area: '', city: '', state: '', country: 'India', territory: '', status: 'pending', isVisibleOnMap: false };
  const [form, setForm] = useState(emptyForm);

  const fetchData = () => { apiRequest('/distributors').then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditing(null); setShowForm(false); };
  const handleEdit = (d: any) => { setEditing(d); setForm({ companyName: d.companyName, contactPerson: d.contactPerson, email: d.email, phone: d.phone || '', pinCode: d.pinCode || '', area: d.area || '', city: d.city || '', state: d.state || '', country: d.country || 'India', territory: d.territory || '', status: d.status, isVisibleOnMap: d.isVisibleOnMap }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.contactPerson || !form.email) return;
    setSaving(true);
    try {
      if (editing) await apiRequest(`/distributors/${editing._id}`, { method: 'PUT', body: JSON.stringify(form) });
      else await apiRequest('/distributors', { method: 'POST', body: JSON.stringify(form) });
      resetForm(); fetchData();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('Delete?')) return; await apiRequest(`/distributors/${id}`, { method: 'DELETE' }); fetchData(); };
  const handleStatus = async (id: string, s: string) => { await apiRequest(`/distributors/${id}`, { method: 'PUT', body: JSON.stringify({ status: s }) }); fetchData(); };

  const statusIcon = (s: string) => s === 'approved' ? <CheckCircle size={14} className="text-green-600"/> : s === 'rejected' ? <XCircle size={14} className="text-red-500"/> : <Clock size={14} className="text-amber-500"/>;

  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Distributors</h1>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)' }}><Plus size={16}/> Add Distributor</button>
        </div>
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '2px solid rgba(0,0,0,0.15)' }}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{editing ? 'Edit' : 'Add'} Distributor</h2><button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={16}/></button></div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div><label className={lc} style={ls}>Company Name *</label><input className={ic} style={is} value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} required/></div>
              <div><label className={lc} style={ls}>Contact Person *</label><input className={ic} style={is} value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} required/></div>
              <div><label className={lc} style={ls}>Email *</label><input type="email" className={ic} style={is} value={form.email} onChange={e => setForm({...form, email: e.target.value})} required/></div>
              <div><label className={lc} style={ls}>Phone</label><input className={ic} style={is} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/></div>
              <div><label className={lc} style={ls}>Pin Code</label><input className={ic} style={is} value={form.pinCode} onChange={e => setForm({...form, pinCode: e.target.value})}/></div>
              <div><label className={lc} style={ls}>Area</label><input className={ic} style={is} value={form.area} onChange={e => setForm({...form, area: e.target.value})}/></div>
              <div><label className={lc} style={ls}>City</label><input className={ic} style={is} value={form.city} onChange={e => setForm({...form, city: e.target.value})}/></div>
              <div><label className={lc} style={ls}>State</label><input className={ic} style={is} value={form.state} onChange={e => setForm({...form, state: e.target.value})}/></div>
              <div><label className={lc} style={ls}>Country</label><input className={ic} style={is} value={form.country} onChange={e => setForm({...form, country: e.target.value})}/></div>
              <div><label className={lc} style={ls}>Territory</label><input className={ic} style={is} value={form.territory} onChange={e => setForm({...form, territory: e.target.value})}/></div>
              <div><label className={lc} style={ls}>Status</label><select className={ic} style={is} value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></div>
              <div className="flex items-center gap-2 pt-6"><input type="checkbox" checked={form.isVisibleOnMap} onChange={e => setForm({...form, isVisibleOnMap: e.target.checked})} id="mapV" className="w-4 h-4 rounded"/><label htmlFor="mapV" className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Show on Map</label></div>
              <div className="md:col-span-2 lg:col-span-3 flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)' }}>{saving ? <Loader2 size={14} className="animate-spin"/> : editing ? 'Update' : 'Add'}</button>
                <button type="button" onClick={resetForm} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#1a1a1a' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          {loading ? <div className="p-10 text-center text-sm" style={{ color: '#6b5a4a' }}>Loading...</div> :
          items.length === 0 ? <div className="p-10 text-center text-sm" style={{ color: '#6b5a4a' }}>No distributors yet.</div> :
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(247,244,240,0.6)' }}>
            <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: '#6b5a4a' }}>Company</th>
            <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: '#6b5a4a' }}>Contact</th>
            <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell" style={{ color: '#6b5a4a' }}>Location</th>
            <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: '#6b5a4a' }}>Status</th>
            <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: '#6b5a4a' }}>Actions</th>
          </tr></thead><tbody>
            {items.map((d,i) => (
              <tr key={d._id} className="hover:bg-amber-50/30 transition-colors" style={{ borderBottom: i < items.length-1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                <td className="px-5 py-3 font-medium" style={{ color: '#1a1a1a' }}>{d.companyName}</td>
                <td className="px-5 py-3 hidden md:table-cell" style={{ color: '#6b5a4a' }}>{d.contactPerson}<br/><span className="text-xs">{d.email}</span></td>
                <td className="px-5 py-3 hidden lg:table-cell" style={{ color: '#6b5a4a' }}>{[d.city, d.state, d.country].filter(Boolean).join(', ')}</td>
                <td className="px-5 py-3"><span className="inline-flex items-center gap-1 text-xs capitalize">{statusIcon(d.status)} {d.status}</span></td>
                <td className="px-5 py-3 text-right"><div className="flex items-center justify-end gap-1">
                  {d.status === 'pending' && <><button onClick={() => handleStatus(d._id, 'approved')} className="p-2 rounded-lg text-green-600 hover:bg-green-50"><CheckCircle size={15}/></button><button onClick={() => handleStatus(d._id, 'rejected')} className="p-2 rounded-lg text-red-500 hover:bg-red-50"><XCircle size={15}/></button></>}
                  <button onClick={() => handleEdit(d)} className="p-2 rounded-lg hover:bg-amber-100" style={{ color: '#6b5a4a' }}><Pencil size={15}/></button>
                  <button onClick={() => handleDelete(d._id)} className="p-2 rounded-lg hover:bg-red-100" style={{ color: '#6b5a4a' }}><Trash2 size={15}/></button>
                </div></td>
              </tr>
            ))}
          </tbody></table></div>}
        </div>
      </div>
    </AdminShell>
  );
}
