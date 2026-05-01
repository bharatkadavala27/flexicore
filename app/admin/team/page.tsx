'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest, uploadFile } from '@/lib/admin-auth';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File|null>(null);
  const ef = { name:'', designation:'', bio:'', linkedinUrl:'', displayOrder:0, isFounder:false };
  const [form, setForm] = useState(ef);

  const fetchData = () => { apiRequest('/team').then(setMembers).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm(ef); setEditing(null); setShowForm(false); setPhotoFile(null); };
  const handleEdit = (m: any) => { setEditing(m); setForm({ name:m.name, designation:m.designation, bio:m.bio||'', linkedinUrl:m.linkedinUrl||'', displayOrder:m.displayOrder||0, isFounder:m.isFounder }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if(!form.name||!form.designation) return; setSaving(true);
    try {
      let photo = editing?.photo;
      if(photoFile) photo = await uploadFile(photoFile);
      const body = {...form, photo};
      if(editing) await apiRequest(`/team/${editing._id}`, { method:'PUT', body:JSON.stringify(body) });
      else await apiRequest('/team', { method:'POST', body:JSON.stringify(body) });
      resetForm(); fetchData();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if(!confirm('Delete?')) return; await apiRequest(`/team/${id}`, { method:'DELETE' }); fetchData(); };

  const ic="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-amber-200";
  const is2={border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'};

  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{color:'#1a1a1a'}}>Team & Founder</h1>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}><Plus size={16}/> Add Member</button>
        </div>
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:'2px solid rgba(0,0,0,0.15)'}}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-sm" style={{color:'#1a1a1a'}}>{editing?'Edit':'Add'} Member</h2><button onClick={resetForm}><X size={16} className="text-gray-400"/></button></div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Name *</label><input className={ic} style={is2} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Designation *</label><input className={ic} style={is2} value={form.designation} onChange={e=>setForm({...form,designation:e.target.value})} required/></div>
              <div className="md:col-span-2"><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Bio</label><textarea className={`${ic} resize-none`} style={is2} rows={3} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>LinkedIn</label><input className={ic} style={is2} value={form.linkedinUrl} onChange={e=>setForm({...form,linkedinUrl:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Order</label><input type="number" className={ic} style={is2} value={form.displayOrder} onChange={e=>setForm({...form,displayOrder:Number(e.target.value)})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Photo</label><input type="file" accept="image/*" className="text-sm" onChange={e=>setPhotoFile(e.target.files?.[0]||null)}/></div>
              <div className="flex items-center gap-2 pt-6"><input type="checkbox" checked={form.isFounder} onChange={e=>setForm({...form,isFounder:e.target.checked})} className="w-4 h-4 rounded"/><label className="text-sm">Founder</label></div>
              <div className="md:col-span-2 flex gap-3"><button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}>{saving?<Loader2 size={14} className="animate-spin"/>:editing?'Update':'Add'}</button><button type="button" onClick={resetForm} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'}}>Cancel</button></div>
            </form>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? [...Array(3)].map((_,i)=><div key={i} className="bg-white rounded-2xl h-48 animate-pulse" style={{border:'1px solid rgba(0,0,0,0.06)'}}/>) :
          members.length===0 ? <div className="col-span-full p-10 text-center text-sm bg-white rounded-2xl" style={{color:'#6b5a4a',border:'1px solid rgba(0,0,0,0.06)'}}>No team members yet.</div> :
          members.map(m=>(
            <div key={m._id} className="bg-white rounded-2xl p-5 shadow-sm" style={{border:'1px solid rgba(0,0,0,0.06)'}}>
              <div className="flex items-start gap-4">
                {m.photo?.url?<img src={m.photo.url} className="w-16 h-16 rounded-xl object-cover" alt=""/>:<div className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}>{m.name.charAt(0)}</div>}
                <div className="flex-1 min-w-0"><p className="font-semibold" style={{color:'#1a1a1a'}}>{m.name}</p><p className="text-xs" style={{color:'#6b5a4a'}}>{m.designation}</p>{m.isFounder&&<span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 mt-1 inline-block">Founder</span>}</div>
              </div>
              {m.bio&&<p className="text-xs mt-3 line-clamp-2" style={{color:'#6b5a4a'}}>{m.bio}</p>}
              <div className="flex gap-2 mt-3 pt-3" style={{borderTop:'1px solid rgba(0,0,0,0.05)'}}>
                <button onClick={()=>handleEdit(m)} className="text-xs font-medium hover:underline" style={{color:'#555'}}>Edit</button>
                <button onClick={()=>handleDelete(m._id)} className="text-xs font-medium hover:underline text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
