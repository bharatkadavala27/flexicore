'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/admin-auth';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';

export default function SeoPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const ef = { pageName:'', title:'', metaDescription:'', keywords:'', canonicalUrl:'', robotsTxt:'' };
  const [form, setForm] = useState(ef);
  const fetchData = () => { apiRequest('/seo').then(setPages).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ fetchData(); },[]);
  const resetForm = () => { setForm(ef); setEditing(null); setShowForm(false); };
  const handleEdit = (p: any) => { setEditing(p); setForm({ pageName:p.pageName, title:p.title||'', metaDescription:p.metaDescription||'', keywords:p.keywords?.join(', ')||'', canonicalUrl:p.canonicalUrl||'', robotsTxt:p.robotsTxt||'' }); setShowForm(true); };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if(!form.pageName) return; setSaving(true);
    try { const body = {...form, keywords:form.keywords.split(',').map(k=>k.trim()).filter(Boolean)};
      if(editing) await apiRequest(`/seo/${editing._id}`, { method:'PUT', body:JSON.stringify(body) }); else await apiRequest('/seo', { method:'POST', body:JSON.stringify(body) }); resetForm(); fetchData(); } catch {} finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => { if(!confirm('Delete?')) return; await apiRequest(`/seo/${id}`, { method:'DELETE' }); fetchData(); };
  const ic="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-amber-200";
  const is2={border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'};
  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{color:'#1a1a1a'}}>SEO Manager</h1>
          <button onClick={()=>{resetForm();setShowForm(true);}} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}><Plus size={16}/> Add Page SEO</button>
        </div>
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:'2px solid rgba(0,0,0,0.15)'}}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-sm" style={{color:'#1a1a1a'}}>{editing?'Edit':'Add'} SEO Settings</h2><button onClick={resetForm}><X size={16} className="text-gray-400"/></button></div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Page Name *</label><input className={ic} style={is2} value={form.pageName} onChange={e=>setForm({...form,pageName:e.target.value})} required placeholder="home, about, products"/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>SEO Title</label><input className={ic} style={is2} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div className="md:col-span-2"><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Meta Description</label><textarea className={`${ic} resize-none`} style={is2} rows={2} value={form.metaDescription} onChange={e=>setForm({...form,metaDescription:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Keywords (comma separated)</label><input className={ic} style={is2} value={form.keywords} onChange={e=>setForm({...form,keywords:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Canonical URL</label><input className={ic} style={is2} value={form.canonicalUrl} onChange={e=>setForm({...form,canonicalUrl:e.target.value})}/></div>
              <div className="md:col-span-2"><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>robots.txt Content</label><textarea className={`${ic} resize-none font-mono text-xs`} style={is2} rows={4} value={form.robotsTxt} onChange={e=>setForm({...form,robotsTxt:e.target.value})}/></div>
              <div className="md:col-span-2 flex gap-3"><button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}>{saving?<Loader2 size={14} className="animate-spin"/>:editing?'Update':'Add'}</button><button type="button" onClick={resetForm} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'}}>Cancel</button></div>
            </form>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{border:'1px solid rgba(0,0,0,0.06)'}}>
          {loading ? <div className="p-10 text-center text-sm" style={{color:'#6b5a4a'}}>Loading...</div> :
          pages.length===0 ? <div className="p-10 text-center text-sm" style={{color:'#6b5a4a'}}>No SEO settings configured yet.</div> :
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr style={{borderBottom:'1px solid rgba(0,0,0,0.05)',background:'rgba(247,244,240,0.6)'}}>
            <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{color:'#6b5a4a'}}>Page</th>
            <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{color:'#6b5a4a'}}>Title</th>
            <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell" style={{color:'#6b5a4a'}}>Description</th>
            <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{color:'#6b5a4a'}}>Actions</th>
          </tr></thead><tbody>
            {pages.map((p,i)=>(
              <tr key={p._id} className="hover:bg-amber-50/30 transition-colors" style={{borderBottom:i<pages.length-1?'1px solid rgba(0,0,0,0.04)':'none'}}>
                <td className="px-5 py-3 font-semibold capitalize" style={{color:'#1a1a1a'}}>{p.pageName}</td>
                <td className="px-5 py-3 hidden md:table-cell truncate max-w-xs" style={{color:'#6b5a4a'}}>{p.title||'—'}</td>
                <td className="px-5 py-3 hidden lg:table-cell truncate max-w-sm" style={{color:'#6b5a4a'}}>{p.metaDescription||'—'}</td>
                <td className="px-5 py-3 text-right"><div className="flex items-center justify-end gap-1">
                  <button onClick={()=>handleEdit(p)} className="p-2 rounded-lg hover:bg-amber-100" style={{color:'#6b5a4a'}}><Pencil size={15}/></button>
                  <button onClick={()=>handleDelete(p._id)} className="p-2 rounded-lg hover:bg-red-100" style={{color:'#6b5a4a'}}><Trash2 size={15}/></button>
                </div></td>
              </tr>
            ))}
          </tbody></table></div>}
        </div>
      </div>
    </AdminShell>
  );
}
