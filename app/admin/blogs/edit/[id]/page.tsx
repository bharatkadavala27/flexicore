'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest, uploadFile } from '@/lib/admin-auth';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import Link from 'next/link';

export default function EditBlogPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', seoTitle: '', metaDescription: '',
    tags: '', author: '', isPublished: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    apiRequest(`/blogs/${id}`)
      .then(b => {
        setForm({
          title: b.title || '', content: b.content || '', excerpt: b.excerpt || '',
          seoTitle: b.seoTitle || '', metaDescription: b.metaDescription || '',
          tags: b.tags?.join(', ') || '', author: b.author || '', isPublished: b.isPublished,
        });
        setExistingImage(b.featuredImage || null);
      })
      .catch(err => setMsg(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!imageFile) { setPreviewUrl(''); return; }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!form.title || !form.content) { setMsg('Title and content are required'); return; }
    setSaving(true);
    try {
      let featuredImage = existingImage;
      if (imageFile) featuredImage = await uploadFile(imageFile);
      const body = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        featuredImage,
      };
      await apiRequest(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      router.push('/admin/blogs');
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-white focus:ring-2 focus:ring-amber-200";
  const inputStyle = { border: '1px solid rgba(107,47,42,0.2)', color: '#1a1a1a' };
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
          <Link href="/admin/blogs" className="p-2 rounded-xl transition-colors hover:bg-white" style={{ color: '#555' }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Edit Blog Post</h1>
        </div>

        {msg && <div className="px-4 py-3 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <h2 className="font-semibold text-sm mb-4 pb-3" style={{ color: '#1a1a1a', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>Post Content</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls} style={labelStyle}>Title *</label>
                <input className={inputCls} style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Featured Image</label>
                {(existingImage?.url && !imageFile) ? (
                  <div className="relative w-48 h-28 rounded-xl overflow-hidden mb-3 group" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                    <img src={existingImage.url} className="w-full h-full object-cover" alt="" />
                    <button type="button" onClick={() => setExistingImage(null)}
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={13} />
                    </button>
                  </div>
                ) : previewUrl ? (
                  <div className="relative w-48 h-28 rounded-xl overflow-hidden mb-3" style={{ border: '2px solid #555' }}>
                    <img src={previewUrl} className="w-full h-full object-cover" alt="" />
                    <button type="button" onClick={() => setImageFile(null)} className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-0.5"><X size={13} /></button>
                  </div>
                ) : null}
                <input type="file" accept="image/*" className="text-sm" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Content * (HTML supported)</label>
                <textarea className={`${inputCls} font-mono text-xs resize-none`} style={inputStyle} rows={14} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Excerpt</label>
                <textarea className={`${inputCls} resize-none`} style={inputStyle} rows={3} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <h2 className="font-semibold text-sm mb-4 pb-3" style={{ color: '#1a1a1a', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>SEO & Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={labelStyle}>SEO Title</label>
                <input className={inputCls} style={inputStyle} value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Author</label>
                <input className={inputCls} style={inputStyle} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Flexicore Team" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls} style={labelStyle}>Meta Description</label>
                <textarea className={`${inputCls} resize-none`} style={inputStyle} rows={2} value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Tags (comma separated)</label>
                <input className={inputCls} style={inputStyle} value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <input type="checkbox" id="published" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4 rounded" />
                <label htmlFor="published" className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Published</label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)', minWidth: 140 }}>
              {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : 'Update Post'}
            </button>
            <Link href="/admin/blogs"
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
