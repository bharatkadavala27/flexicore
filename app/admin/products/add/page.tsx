'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest, uploadFile } from '@/lib/admin-auth';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import Link from 'next/link';

export default function ProductFormPage() {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    name: '', sku: '', category: '', tags: '',
    description: '', metaDescription: '', videoUrl: '', priceRange: '',
    surface: '', finish: '', thickness: '', isVisible: true,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ url: string; publicId: string }[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await apiRequest('/categories');
        setCategories(cats);
        if (id) {
          const p = await apiRequest(`/products/${id}`);
          setForm({
            name: p.name || '', sku: p.sku || '', category: p.category?._id || p.category || '',
            tags: p.tags?.join(', ') || '', description: p.description || '',
            metaDescription: p.metaDescription || '', videoUrl: p.videoUrl || '',
            priceRange: p.priceRange || '', surface: p.surface || '',
            finish: p.finish || '', thickness: p.thickness || '', isVisible: p.isVisible,
          });
          setExistingImages(p.images || []);
        }
      } catch (err: any) {
        setMsg(err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  useEffect(() => {
    const urls = imageFiles.map(f => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [imageFiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!form.name) { setMsg('Product name is required'); return; }
    setSaving(true);
    try {
      let images = [...existingImages];
      for (const file of imageFiles) {
        const uploaded = await uploadFile(file);
        images.push(uploaded);
      }
      const body = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images,
        category: form.category || undefined,
      };
      if (id) {
        await apiRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await apiRequest('/products', { method: 'POST', body: JSON.stringify(body) });
      }
      router.push('/admin/products');
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-white"
    + " focus:ring-2 focus:ring-amber-200";
  const inputStyle = { border: '1px solid rgba(0,0,0,0.12)', color: '#1a1a1a' };
  const labelCls = "block text-xs font-semibold mb-1.5 uppercase tracking-wide";
  const labelStyle = { color: '#6b5a4a' };

  if (loading) return (
    <AdminShell>
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin" size={28} style={{ color: '#555' }} />
      </div>
    </AdminShell>
  );

  return (
    <AdminShell>
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/admin/products"
            className="p-2 rounded-xl transition-colors hover:bg-white"
            style={{ color: '#6b5a4a' }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>{id ? 'Edit' : 'Add'} Product</h1>
        </div>

        {msg && <div className="px-4 py-3 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <h2 className="font-semibold text-sm mb-4 pb-3" style={{ color: '#1a1a1a', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={labelStyle}>Name *</label>
                <input className={inputCls} style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>SKU</label>
                <input className={inputCls} style={inputStyle} value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="FC-001" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Category</label>
                <select className={inputCls} style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select Category</option>
                  {Array.isArray(categories) && categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Price Range</label>
                <input className={inputCls} style={inputStyle} value={form.priceRange} onChange={e => setForm({ ...form, priceRange: e.target.value })} placeholder="₹500 - ₹1500 per sq.ft" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Surface Type</label>
                <input className={inputCls} style={inputStyle} value={form.surface} onChange={e => setForm({ ...form, surface: e.target.value })} placeholder="Alabaster, Marble, etc." />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Finish</label>
                <input className={inputCls} style={inputStyle} value={form.finish} onChange={e => setForm({ ...form, finish: e.target.value })} placeholder="Matte, Glossy, etc." />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Thickness</label>
                <input className={inputCls} style={inputStyle} value={form.thickness} onChange={e => setForm({ ...form, thickness: e.target.value })} placeholder="12mm, 18mm" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Tags (comma separated)</label>
                <input className={inputCls} style={inputStyle} value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="kitchen, bathroom, commercial" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls} style={labelStyle}>Description</label>
                <textarea className={`${inputCls} resize-none`} style={inputStyle} rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls} style={labelStyle}>Meta Description (SEO)</label>
                <textarea className={`${inputCls} resize-none`} style={inputStyle} rows={2} value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Video URL</label>
                <input className={inputCls} style={inputStyle} value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtube.com/..." />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <input type="checkbox" id="visible" checked={form.isVisible} onChange={e => setForm({ ...form, isVisible: e.target.checked })}
                  className="w-4 h-4 rounded" />
                <label htmlFor="visible" className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Visible on website</label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <h2 className="font-semibold text-sm mb-4 pb-3" style={{ color: '#1a1a1a', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>Product Images</h2>
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden group" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                    <img src={img.url} className="w-full h-full object-cover" alt="" />
                    <button type="button" onClick={() => setExistingImages(existingImages.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {previewUrls.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden" style={{ border: '2px solid #c28b5a' }}>
                    <img src={url} className="w-full h-full object-cover" alt="" />
                    <span className="absolute bottom-0 inset-x-0 text-[9px] text-center py-0.5 text-white" style={{ background: 'rgba(0,0,0,0.5)' }}>New</span>
                  </div>
                ))}
              </div>
            )}
            <input type="file" accept="image/*" multiple
              className="text-sm"
              onChange={e => setImageFiles(Array.from(e.target.files || []))} />
            <p className="text-xs mt-2" style={{ color: '#6b5a4a' }}>Upload multiple images. Supported: JPG, PNG, WebP</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)', minWidth: 140 }}>
              {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : (id ? 'Update Product' : 'Add Product')}
            </button>
            <Link href="/admin/products"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100"
              style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#1a1a1a' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
