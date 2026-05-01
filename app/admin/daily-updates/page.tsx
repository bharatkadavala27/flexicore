'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/admin-auth';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';

const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-white focus:ring-2 focus:ring-amber-200";
const inputStyle = { border: '1px solid rgba(0,0,0,0.12)', color: '#1a1a1a' };
const labelCls = "block text-xs font-semibold mb-1.5 uppercase tracking-wide";
const labelStyle = { color: '#6b5a4a' };

export default function DailyUpdatesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ text: '', link: '', isActive: true });

  const fetchData = () => { apiRequest('/daily-updates').then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text) return;
    setSaving(true);
    try {
      await apiRequest('/daily-updates', { method: 'POST', body: JSON.stringify({ ...form, displayOrder: items.length }) });
      setForm({ text: '', link: '', isActive: true }); setShowForm(false); fetchData();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('Remove?')) return; await apiRequest(`/daily-updates/${id}`, { method: 'DELETE' }); fetchData(); };
  const toggle = async (id: string, v: boolean) => { await apiRequest(`/daily-updates/${id}`, { method: 'PUT', body: JSON.stringify({ isActive: !v }) }); fetchData(); };

  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Daily Updates</h1><p className="text-sm mt-1" style={{ color: '#6b5a4a' }}>Homepage scrolling ticker items</p></div>
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)' }}><Plus size={16}/> Add Update</button>
        </div>
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '2px solid rgba(0,0,0,0.15)' }}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>New Update</h2><button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={16}/></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className={labelCls} style={labelStyle}>Text *</label><input className={inputCls} style={inputStyle} value={form.text} onChange={e => setForm({...form, text: e.target.value})} required placeholder="New surface launch coming soon!"/></div>
              <div><label className={labelCls} style={labelStyle}>Link (optional)</label><input className={inputCls} style={inputStyle} value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="https://..."/></div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)' }}>{saving ? <Loader2 size={14} className="animate-spin"/> : 'Add'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#1a1a1a' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          {loading ? <div className="p-10 text-center text-sm" style={{ color: '#6b5a4a' }}>Loading...</div> :
          items.length === 0 ? <div className="p-10 text-center text-sm" style={{ color: '#6b5a4a' }}>No updates yet.</div> :
          <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            {items.map(u => (
              <div key={u._id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${u.isActive ? '' : 'line-through opacity-50'}`} style={{ color: '#1a1a1a' }}>{u.text}</p>
                  {u.link && <p className="text-xs mt-0.5" style={{ color: '#555' }}>{u.link}</p>}
                </div>
                <button onClick={() => toggle(u._id, u.isActive)} className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{u.isActive ? 'Active' : 'Inactive'}</button>
                <button onClick={() => handleDelete(u._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={15}/></button>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </AdminShell>
  );
}
