'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest, uploadFile } from '@/lib/admin-auth';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';

export default function TrustedByPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File|null>(null);
  const [form, setForm] = useState({ name:'', link:'', type:'client' });
  const [filterType, setFilterType] = useState('all');
  const fetchData = () => { apiRequest('/trusted-by').then(setItems).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ fetchData(); },[]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if(!logoFile) return; setSaving(true);
    try { const logo = await uploadFile(logoFile); await apiRequest('/trusted-by', { method:'POST', body:JSON.stringify({...form,logo,displayOrder:items.length}) });
      setForm({name:'',link:'',type:'client'}); setLogoFile(null); setShowForm(false); fetchData();
    } catch {} finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => { if(!confirm('Delete?')) return; await apiRequest(`/trusted-by/${id}`, { method:'DELETE' }); fetchData(); };
  const filtered = filterType==='all' ? items : items.filter(i=>i.type===filterType);
  const ic="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-amber-200";
  const is2={border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'};
  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold" style={{color:'#1a1a1a'}}>Trusted By</h1>
          <div className="flex gap-3">
            <div className="flex rounded-xl overflow-hidden" style={{border:'1px solid rgba(0,0,0,0.08)'}}>
              {['all','client','press'].map(t=><button key={t} onClick={()=>setFilterType(t)} className={`px-3 py-1.5 text-xs font-medium ${filterType===t?'text-white':'hover:bg-gray-50'}`} style={filterType===t?{background:'linear-gradient(135deg, #1a1a1a, #333)'}:{color:'#6b5a4a'}}>{t==='all'?'All':t==='client'?'Brands':'Media'}</button>)}
            </div>
            <button onClick={()=>setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}><Plus size={16}/> Add Logo</button>
          </div>
        </div>
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:'2px solid rgba(0,0,0,0.15)'}}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-sm" style={{color:'#1a1a1a'}}>Add Logo</h2><button onClick={()=>setShowForm(false)}><X size={16} className="text-gray-400"/></button></div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Name</label><input className={ic} style={is2} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Link</label><input className={ic} style={is2} value={form.link} onChange={e=>setForm({...form,link:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Type</label><select className={ic} style={is2} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="client">Client Brand</option><option value="press">Press/Media</option></select></div>
              <div className="md:col-span-3"><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Logo *</label><input type="file" accept="image/*" className="text-sm" onChange={e=>setLogoFile(e.target.files?.[0]||null)}/></div>
              <div className="md:col-span-3 flex gap-3"><button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}>{saving?<Loader2 size={14} className="animate-spin"/>:'Add'}</button><button type="button" onClick={()=>setShowForm(false)} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'}}>Cancel</button></div>
            </form>
          </div>
        )}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? [...Array(6)].map((_,i)=><div key={i} className="aspect-video bg-white rounded-2xl animate-pulse" style={{border:'1px solid rgba(0,0,0,0.06)'}}/>) :
          filtered.length===0 ? <div className="col-span-full p-10 text-center text-sm bg-white rounded-2xl" style={{color:'#6b5a4a',border:'1px solid rgba(0,0,0,0.06)'}}>No logos yet.</div> :
          filtered.map(item=>(
            <div key={item._id} className="relative group bg-white rounded-2xl p-3 flex items-center justify-center aspect-video shadow-sm" style={{border:'1px solid rgba(0,0,0,0.06)'}}>
              {item.logo?.url&&<img src={item.logo.url} className="max-w-full max-h-full object-contain" alt={item.name||''}/>}
              <button onClick={()=>handleDelete(item._id)} className="absolute top-1.5 right-1.5 p-1 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
