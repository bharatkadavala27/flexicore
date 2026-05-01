'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest, uploadFile } from '@/lib/admin-auth';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [form, setForm] = useState({ title:'', category:'factory', stepLabel:'' });
  const [filterCat, setFilterCat] = useState('all');
  const fetchData = () => { apiRequest('/gallery').then(setItems).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ fetchData(); },[]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if(!imageFile) return; setSaving(true);
    try { const image = await uploadFile(imageFile); await apiRequest('/gallery', { method:'POST', body:JSON.stringify({...form,image,displayOrder:items.length}) });
      setForm({title:'',category:'factory',stepLabel:''}); setImageFile(null); setShowForm(false); fetchData();
    } catch {} finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => { if(!confirm('Delete?')) return; await apiRequest(`/gallery/${id}`, { method:'DELETE' }); fetchData(); };
  const filtered = filterCat==='all' ? items : items.filter(i=>i.category===filterCat);
  const cats = ['all','factory','installation','event','entry-to-exit'];
  const ic="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-amber-200";
  const is2={border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'};
  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold" style={{color:'#1a1a1a'}}>Gallery</h1>
          <div className="flex gap-3">
            <div className="flex rounded-xl overflow-hidden" style={{border:'1px solid rgba(0,0,0,0.08)'}}>
              {cats.map(c=><button key={c} onClick={()=>setFilterCat(c)} className={`px-3 py-1.5 text-xs font-medium capitalize ${filterCat===c?'text-white':'hover:bg-gray-50'}`} style={filterCat===c?{background:'linear-gradient(135deg, #1a1a1a, #333)'}:{color:'#6b5a4a'}}>{c.replace('-',' ')}</button>)}
            </div>
            <button onClick={()=>setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}><Plus size={16}/> Upload</button>
          </div>
        </div>
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:'2px solid rgba(0,0,0,0.15)'}}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-sm" style={{color:'#1a1a1a'}}>Upload Photo</h2><button onClick={()=>setShowForm(false)}><X size={16} className="text-gray-400"/></button></div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Title</label><input className={ic} style={is2} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Category</label><select className={ic} style={is2} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="factory">Factory</option><option value="installation">Installation</option><option value="event">Event</option><option value="entry-to-exit">Entry to Exit</option></select></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Step Label</label><input className={ic} style={is2} value={form.stepLabel} onChange={e=>setForm({...form,stepLabel:e.target.value})} placeholder="For entry-to-exit"/></div>
              <div className="md:col-span-3"><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Image *</label><input type="file" accept="image/*" className="text-sm" onChange={e=>setImageFile(e.target.files?.[0]||null)}/></div>
              <div className="md:col-span-3 flex gap-3"><button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}>{saving?<Loader2 size={14} className="animate-spin"/>:'Upload'}</button><button type="button" onClick={()=>setShowForm(false)} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'}}>Cancel</button></div>
            </form>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? [...Array(8)].map((_,i)=><div key={i} className="aspect-square bg-white rounded-2xl animate-pulse" style={{border:'1px solid rgba(0,0,0,0.06)'}}/>) :
          filtered.length===0 ? <div className="col-span-full p-10 text-center text-sm bg-white rounded-2xl" style={{color:'#6b5a4a',border:'1px solid rgba(0,0,0,0.06)'}}>No photos yet.</div> :
          filtered.map(item=>(
            <div key={item._id} className="relative group rounded-2xl overflow-hidden shadow-sm" style={{border:'1px solid rgba(0,0,0,0.06)'}}>
              <img src={item.image?.url} className="w-full aspect-square object-cover" alt={item.title||''}/>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                <div className="w-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                  <span className="text-xs text-white font-medium truncate">{item.title||item.category}</span>
                  <button onClick={()=>handleDelete(item._id)} className="p-1.5 bg-red-500 rounded-lg text-white"><Trash2 size={13}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
