'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest, uploadFile } from '@/lib/admin-auth';
import { Plus, Trash2, X, Loader2, ExternalLink } from 'lucide-react';

export default function PressPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File|null>(null);
  const [form, setForm] = useState({ headline:'', date:'', articleUrl:'' });
  const fetchData = () => { apiRequest('/press').then(setItems).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ fetchData(); },[]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if(!form.headline) return; setSaving(true);
    try { let mediaLogo; if(logoFile) mediaLogo = await uploadFile(logoFile); await apiRequest('/press', { method:'POST', body:JSON.stringify({...form,mediaLogo}) });
      setForm({headline:'',date:'',articleUrl:''}); setLogoFile(null); setShowForm(false); fetchData();
    } catch {} finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => { if(!confirm('Delete?')) return; await apiRequest(`/press/${id}`, { method:'DELETE' }); fetchData(); };
  const ic="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-amber-200";
  const is2={border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'};
  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{color:'#1a1a1a'}}>PR & News</h1>
          <button onClick={()=>setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}><Plus size={16}/> Add Coverage</button>
        </div>
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:'2px solid rgba(0,0,0,0.15)'}}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-sm" style={{color:'#1a1a1a'}}>Add Press Coverage</h2><button onClick={()=>setShowForm(false)}><X size={16} className="text-gray-400"/></button></div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Headline *</label><input className={ic} style={is2} value={form.headline} onChange={e=>setForm({...form,headline:e.target.value})} required/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Date</label><input type="date" className={ic} style={is2} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Article URL</label><input className={ic} style={is2} value={form.articleUrl} onChange={e=>setForm({...form,articleUrl:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Media Logo</label><input type="file" accept="image/*" className="text-sm" onChange={e=>setLogoFile(e.target.files?.[0]||null)}/></div>
              <div className="md:col-span-2 flex gap-3"><button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}>{saving?<Loader2 size={14} className="animate-spin"/>:'Add'}</button><button type="button" onClick={()=>setShowForm(false)} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'}}>Cancel</button></div>
            </form>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y" style={{border:'1px solid rgba(0,0,0,0.06)',borderColor:'rgba(0,0,0,0.04)'}}>
          {loading ? <div className="p-10 text-center text-sm" style={{color:'#6b5a4a'}}>Loading...</div> :
          items.length===0 ? <div className="p-10 text-center text-sm" style={{color:'#6b5a4a'}}>No press coverage yet.</div> :
          items.map(p=>(
            <div key={p._id} className="px-5 py-4 flex items-center gap-4">
              {p.mediaLogo?.url&&<img src={p.mediaLogo.url} className="w-12 h-12 rounded-lg object-contain p-1" style={{background:'#f7f4f0',border:'1px solid rgba(0,0,0,0.06)'}} alt=""/>}
              <div className="flex-1 min-w-0"><p className="font-semibold" style={{color:'#1a1a1a'}}>{p.headline}</p><p className="text-xs" style={{color:'#6b5a4a'}}>{p.date&&new Date(p.date).toLocaleDateString()}</p></div>
              {p.articleUrl&&<a href={p.articleUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-amber-100" style={{color:'#555'}}><ExternalLink size={15}/></a>}
              <button onClick={()=>handleDelete(p._id)} className="p-2 rounded-lg hover:bg-red-100" style={{color:'#6b5a4a'}}><Trash2 size={15}/></button>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
