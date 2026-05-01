'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/admin-auth';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
}

const emptyForm = { name: '', description: '', displayOrder: 0 };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    apiRequest('/categories')
      .then(setCategories)
      .catch(() => setMsg('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || '', displayOrder: cat.displayOrder });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(emptyForm); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!form.name) { setMsg('Category name is required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await apiRequest(`/categories/${editing._id}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await apiRequest('/categories', { method: 'POST', body: JSON.stringify(form) });
      }
      closeForm();
      fetchData();
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products in this category will be unassigned.')) return;
    setDeleting(id);
    try {
      await apiRequest(`/categories/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-white focus:ring-2 focus:ring-amber-200";
  const inputStyle = { border: '1px solid rgba(0,0,0,0.12)', color: '#1a1a1a' };
  const labelCls = "block text-xs font-semibold mb-1.5 uppercase tracking-wide";
  const labelStyle = { color: '#6b5a4a' };

  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Categories</h1>
          <button onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)', boxShadow: '0 2px 10px rgba(107,47,42,0.25)' }}>
            <Plus size={16} /> Add Category
          </button>
        </div>

        {msg && <div className="px-4 py-3 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200">{msg}</div>}

        {/* Inline form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '2px solid rgba(0,0,0,0.15)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(247,244,240,0.5)' }}>
              <h2 className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{editing ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={closeForm} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls} style={labelStyle}>Name *</label>
                  <input className={inputCls} style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Alabaster" required autoFocus />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>Description</label>
                  <input className={inputCls} style={inputStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description" />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>Display Order</label>
                  <input type="number" className={inputCls} style={inputStyle} value={form.displayOrder} onChange={e => setForm({ ...form, displayOrder: Number(e.target.value) })} />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" disabled={saving}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)' }}>
                  {saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><Check size={14} />{editing ? 'Update' : 'Create'}</>}
                </button>
                <button type="button" onClick={closeForm}
                  className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100"
                  style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#1a1a1a' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ color: '#6b5a4a' }}>
              <Loader2 className="animate-spin" size={28} />
              <span className="text-sm">Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 text-sm" style={{ color: '#6b5a4a' }}>
              No categories yet.{' '}
              <button onClick={openAdd} className="underline" style={{ color: '#555' }}>Create the first one</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(247,244,240,0.6)' }}>
                    <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: '#6b5a4a' }}>Name</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: '#6b5a4a' }}>Slug</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell" style={{ color: '#6b5a4a' }}>Description</th>
                    <th className="text-center px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: '#6b5a4a' }}>Order</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: '#6b5a4a' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, i) => (
                    <tr key={cat._id} className="hover:bg-amber-50/30 transition-colors"
                      style={{ borderBottom: i < categories.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                      <td className="px-5 py-3.5 font-semibold" style={{ color: '#1a1a1a' }}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)' }} />
                          {cat.name}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs hidden md:table-cell" style={{ color: '#6b5a4a' }}>{cat.slug}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell" style={{ color: '#6b5a4a' }}>{cat.description || '—'}</td>
                      <td className="px-5 py-3.5 text-center" style={{ color: '#6b5a4a' }}>{cat.displayOrder}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(cat)}
                            className="p-2 rounded-lg transition-colors hover:bg-amber-100"
                            style={{ color: '#6b5a4a' }}>
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => handleDelete(cat._id)}
                            disabled={deleting === cat._id}
                            className="p-2 rounded-lg transition-colors hover:bg-red-100"
                            style={{ color: deleting === cat._id ? '#ccc' : '#6b5a4a' }}>
                            {deleting === cat._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
