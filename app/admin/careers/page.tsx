'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/admin-auth';
import { Plus, Pencil, Trash2, X, Loader2, Briefcase } from 'lucide-react';

export default function CareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const ef = { title:'', department:'', location:'', description:'', closingDate:'', isActive:true };
  const [form, setForm] = useState(ef);
  const fetchData = () => { apiRequest('/careers').then(setJobs).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ fetchData(); },[]);
  const resetForm = () => { setForm(ef); setEditing(null); setShowForm(false); };
  const handleEdit = (j: any) => { setEditing(j); setForm({ title:j.title, department:j.department||'', location:j.location||'', description:j.description||'', closingDate:j.closingDate?.split('T')[0]||'', isActive:j.isActive }); setShowForm(true); };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if(!form.title) return; setSaving(true);
    try { if(editing) await apiRequest(`/careers/${editing._id}`, { method:'PUT', body:JSON.stringify(form) }); else await apiRequest('/careers', { method:'POST', body:JSON.stringify(form) }); resetForm(); fetchData(); } catch {} finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => { if(!confirm('Delete?')) return; await apiRequest(`/careers/${id}`, { method:'DELETE' }); fetchData(); };
  const ic="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-amber-200";
  const is2={border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'};
  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{color:'#1a1a1a'}}>Careers</h1>
          <button onClick={()=>{resetForm();setShowForm(true);}} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}><Plus size={16}/> Post Job</button>
        </div>
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:'2px solid rgba(0,0,0,0.15)'}}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-sm" style={{color:'#1a1a1a'}}>{editing?'Edit':'Post'} Job</h2><button onClick={resetForm}><X size={16} className="text-gray-400"/></button></div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Title *</label><input className={ic} style={is2} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Department</label><input className={ic} style={is2} value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Location</label><input className={ic} style={is2} value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
              <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Closing Date</label><input type="date" className={ic} style={is2} value={form.closingDate} onChange={e=>setForm({...form,closingDate:e.target.value})}/></div>
              <div className="md:col-span-2"><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Description</label><textarea className={`${ic} resize-none`} style={is2} rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} className="w-4 h-4 rounded"/><label className="text-sm">Active</label></div>
              <div className="md:col-span-2 flex gap-3"><button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}>{saving?<Loader2 size={14} className="animate-spin"/>:editing?'Update':'Post'}</button><button type="button" onClick={resetForm} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'}}>Cancel</button></div>
            </form>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y" style={{border:'1px solid rgba(0,0,0,0.06)',borderColor:'rgba(0,0,0,0.04)'}}>
          {loading ? <div className="p-10 text-center text-sm" style={{color:'#6b5a4a'}}>Loading...</div> :
          jobs.length===0 ? <div className="p-10 text-center text-sm" style={{color:'#6b5a4a'}}>No job postings yet.</div> :
          jobs.map(j=>(
            <div key={j._id} className="px-5 py-4 flex items-start gap-3">
              <Briefcase size={18} className="mt-0.5" style={{color:'#6b5a4a'}}/>
              <div className="flex-1">
                <div className="flex items-center gap-2"><p className="font-semibold" style={{color:'#1a1a1a'}}>{j.title}</p><span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${j.isActive?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{j.isActive?'Active':'Closed'}</span></div>
                <p className="text-xs" style={{color:'#6b5a4a'}}>{[j.department,j.location].filter(Boolean).join(' • ')}</p>
              </div>
              <button onClick={()=>handleEdit(j)} className="p-2 rounded-lg hover:bg-amber-100" style={{color:'#6b5a4a'}}><Pencil size={15}/></button>
              <button onClick={()=>handleDelete(j._id)} className="p-2 rounded-lg hover:bg-red-100" style={{color:'#6b5a4a'}}><Trash2 size={15}/></button>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
