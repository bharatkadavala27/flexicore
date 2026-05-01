'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest, uploadFile } from '@/lib/admin-auth';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';

export default function CertificatesPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [form, setForm] = useState({ title:'', issuingBody:'', date:'', enableDownload:true });
  const fetchData = () => { apiRequest('/certificates').then(setCerts).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ fetchData(); },[]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if(!form.title||!imageFile) return; setSaving(true);
    try { const image = await uploadFile(imageFile); await apiRequest('/certificates', { method:'POST', body:JSON.stringify({...form,image}) });
      setForm({title:'',issuingBody:'',date:'',enableDownload:true}); setImageFile(null); setShowForm(false); fetchData();
    } catch {} finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => { if(!confirm('Delete?')) return; await apiRequest(`/certificates/${id}`, { method:'DELETE' }); fetchData(); };
  const ic="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-amber-200";
  const is2={border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'};
  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{color:'#1a1a1a'}}>Certificates</h1>
          <button onClick={()=>setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}><Plus size={16}/> Add Certificate</button>
        </div>
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:'2px solid rgba(0,0,0,0.15)'}}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-sm" style={{color:'#1a1a1a'}}>Add Certificate</h2><button onClick={()=>setShowForm(false)}><X size={16} className="text-gray-400"/></button></div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Title *</label><input className={ic} style={is2} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Issuing Body</label><input className={ic} style={is2} value={form.issuingBody} onChange={e=>setForm({...form,issuingBody:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Date</label><input type="date" className={ic} style={is2} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Image *</label><input type="file" accept="image/*" className="text-sm" onChange={e=>setImageFile(e.target.files?.[0]||null)}/></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={form.enableDownload} onChange={e=>setForm({...form,enableDownload:e.target.checked})} className="w-4 h-4 rounded"/><label className="text-sm">Enable Download</label></div>
              <div className="md:col-span-2 flex gap-3"><button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}>{saving?<Loader2 size={14} className="animate-spin"/>:'Add'}</button><button type="button" onClick={()=>setShowForm(false)} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'}}>Cancel</button></div>
            </form>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? [...Array(3)].map((_,i)=><div key={i} className="bg-white rounded-2xl h-48 animate-pulse" style={{border:'1px solid rgba(0,0,0,0.06)'}}/>) :
          certs.length===0 ? <div className="col-span-full p-10 text-center text-sm bg-white rounded-2xl" style={{color:'#6b5a4a',border:'1px solid rgba(0,0,0,0.06)'}}>No certificates yet.</div> :
          certs.map(c=>(
            <div key={c._id} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{border:'1px solid rgba(0,0,0,0.06)'}}>
              {c.image?.url&&<img src={c.image.url} className="w-full h-40 object-cover" alt=""/>}
              <div className="p-4">
                <p className="font-semibold" style={{color:'#1a1a1a'}}>{c.title}</p>
                <p className="text-xs mt-0.5" style={{color:'#6b5a4a'}}>{c.issuingBody} {c.date&&`• ${new Date(c.date).toLocaleDateString()}`}</p>
                <button onClick={()=>handleDelete(c._id)} className="text-xs text-red-500 hover:underline mt-3">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
