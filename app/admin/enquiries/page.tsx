'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/admin-auth';
import { Mail, MailOpen, Trash2 } from 'lucide-react';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all'|'contact'|'product'>('all');
  const fetchData = () => { apiRequest('/enquiries').then(setEnquiries).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ fetchData(); },[]);
  const markRead = async (id: string) => { await apiRequest(`/enquiries/${id}`, { method:'PUT', body:JSON.stringify({isRead:true}) }); fetchData(); };
  const handleDelete = async (id: string) => { if(!confirm('Delete?')) return; await apiRequest(`/enquiries/${id}`, { method:'DELETE' }); fetchData(); };
  const filtered = filter==='all' ? enquiries : enquiries.filter(e=>e.type===filter);
  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold" style={{color:'#1a1a1a'}}>Enquiries</h1>
          <div className="flex rounded-xl overflow-hidden" style={{border:'1px solid rgba(0,0,0,0.08)'}}>
            {(['all','contact','product'] as const).map(f=><button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 text-xs font-medium capitalize ${filter===f?'text-white':'hover:bg-gray-50'}`} style={filter===f?{background:'linear-gradient(135deg, #1a1a1a, #333)'}:{color:'#6b5a4a'}}>{f}</button>)}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{border:'1px solid rgba(0,0,0,0.06)'}}>
          {loading ? <div className="p-10 text-center text-sm" style={{color:'#6b5a4a'}}>Loading...</div> :
          filtered.length===0 ? <div className="p-10 text-center text-sm" style={{color:'#6b5a4a'}}>No enquiries found.</div> :
          <div className="divide-y" style={{borderColor:'rgba(0,0,0,0.04)'}}>
            {filtered.map(enq=>(
              <div key={enq._id} className={`px-5 py-4 flex items-start gap-3 ${!enq.isRead?'bg-amber-50/50':''}`}>
                <div className="mt-1">{enq.isRead?<MailOpen size={16} style={{color:'#6b5a4a'}}/>:<Mail size={16} style={{color:'#555'}}/>}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><p className="text-sm font-semibold" style={{color:'#1a1a1a'}}>{enq.name}</p><span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${enq.type==='product'?'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-500'}`}>{enq.type}</span></div>
                  <p className="text-xs" style={{color:'#6b5a4a'}}>{enq.email} {enq.phone&&`• ${enq.phone}`}</p>
                  {enq.productName&&<p className="text-xs mt-0.5" style={{color:'#555'}}>Product: {enq.productName}</p>}
                  <p className="text-sm mt-1" style={{color:'#6b5a4a'}}>{enq.message}</p>
                  <p className="text-xs mt-1 opacity-50" style={{color:'#6b5a4a'}}>{new Date(enq.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-1">
                  {!enq.isRead&&<button onClick={()=>markRead(enq._id)} className="p-2 rounded-lg hover:bg-amber-100" title="Mark as read" style={{color:'#6b5a4a'}}><MailOpen size={15}/></button>}
                  <button onClick={()=>handleDelete(enq._id)} className="p-2 rounded-lg hover:bg-red-100" style={{color:'#6b5a4a'}}><Trash2 size={15}/></button>
                </div>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </AdminShell>
  );
}
