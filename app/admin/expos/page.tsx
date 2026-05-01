'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/admin-auth';
import { Plus, Pencil, Trash2, X, Loader2, CalendarDays, MapPin } from 'lucide-react';

export default function ExposPage() {
  const [expos, setExpos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const ef = { name:'', date:'', endDate:'', location:'', description:'', registrationLink:'', isUpcoming:true };
  const [form, setForm] = useState(ef);
  const fetchData = () => { apiRequest('/expos').then(setExpos).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ fetchData(); },[]);
  const resetForm = () => { setForm(ef); setEditing(null); setShowForm(false); };
  const handleEdit = (e: any) => { setEditing(e); setForm({ name:e.name, date:e.date?.split('T')[0]||'', endDate:e.endDate?.split('T')[0]||'', location:e.location||'', description:e.description||'', registrationLink:e.registrationLink||'', isUpcoming:e.isUpcoming }); setShowForm(true); };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if(!form.name) return; setSaving(true);
    try { if(editing) await apiRequest(`/expos/${editing._id}`, { method:'PUT', body:JSON.stringify(form) }); else await apiRequest('/expos', { method:'POST', body:JSON.stringify(form) }); resetForm(); fetchData(); } catch {} finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => { if(!confirm('Delete?')) return; await apiRequest(`/expos/${id}`, { method:'DELETE' }); fetchData(); };
  const ic="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-amber-200";
  const is2={border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'};
  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{color:'#1a1a1a'}}>Expos</h1>
          <button onClick={()=>{resetForm();setShowForm(true);}} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}><Plus size={16}/> Add Expo</button>
        </div>
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:'2px solid rgba(0,0,0,0.15)'}}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-sm" style={{color:'#1a1a1a'}}>{editing?'Edit':'Add'} Expo</h2><button onClick={resetForm}><X size={16} className="text-gray-400"/></button></div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Name *</label><input className={ic} style={is2} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Location</label><input className={ic} style={is2} value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Start Date</label><input type="date" className={ic} style={is2} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>End Date</label><input type="date" className={ic} style={is2} value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})}/></div>
              <div className="md:col-span-2"><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Description</label><textarea className={`${ic} resize-none`} style={is2} rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Registration Link</label><input className={ic} style={is2} value={form.registrationLink} onChange={e=>setForm({...form,registrationLink:e.target.value})}/></div>
              <div className="flex items-center gap-2 pt-6"><input type="checkbox" checked={form.isUpcoming} onChange={e=>setForm({...form,isUpcoming:e.target.checked})} className="w-4 h-4 rounded"/><label className="text-sm">Upcoming</label></div>
              <div className="md:col-span-2 flex gap-3"><button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}>{saving?<Loader2 size={14} className="animate-spin"/>:editing?'Update':'Add'}</button><button type="button" onClick={resetForm} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'}}>Cancel</button></div>
            </form>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y" style={{border:'1px solid rgba(0,0,0,0.06)',borderColor:'rgba(0,0,0,0.04)'}}>
          {loading ? <div className="p-10 text-center text-sm" style={{color:'#6b5a4a'}}>Loading...</div> :
          expos.length===0 ? <div className="p-10 text-center text-sm" style={{color:'#6b5a4a'}}>No expos yet.</div> :
          expos.map(ex=>(
            <div key={ex._id} className="px-5 py-4 flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2"><p className="font-semibold" style={{color:'#1a1a1a'}}>{ex.name}</p><span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${ex.isUpcoming?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{ex.isUpcoming?'Upcoming':'Past'}</span></div>
                <div className="flex flex-wrap gap-3 mt-1 text-xs" style={{color:'#6b5a4a'}}>
                  {ex.date&&<span className="flex items-center gap-1"><CalendarDays size={12}/>{new Date(ex.date).toLocaleDateString()}</span>}
                  {ex.location&&<span className="flex items-center gap-1"><MapPin size={12}/>{ex.location}</span>}
                </div>
              </div>
              <button onClick={()=>handleEdit(ex)} className="p-2 rounded-lg hover:bg-amber-100" style={{color:'#6b5a4a'}}><Pencil size={15}/></button>
              <button onClick={()=>handleDelete(ex._id)} className="p-2 rounded-lg hover:bg-red-100" style={{color:'#6b5a4a'}}><Trash2 size={15}/></button>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
