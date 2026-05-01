'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/admin-auth';
import { Loader2, Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(()=>{ apiRequest('/settings').then(setSettings).catch(()=>{}).finally(()=>setLoading(false)); },[]);
  const handleSave = async () => {
    setSaving(true); setMsg('');
    try { await apiRequest('/settings', { method:'PUT', body:JSON.stringify(settings) }); setMsg('Settings saved!'); setTimeout(()=>setMsg(''),3000); } catch(err:any){ setMsg(err.message); } finally { setSaving(false); }
  };
  const ic="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-amber-200";
  const is2={border:'1px solid rgba(0,0,0,0.12)',color:'#1a1a1a'};
  if(loading) return <AdminShell><div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin" size={28} style={{color:'#555'}}/></div></AdminShell>;
  return (
    <AdminShell>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{color:'#1a1a1a'}}>Settings</h1>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'linear-gradient(135deg, #1a1a1a, #333)'}}>{saving?<Loader2 size={14} className="animate-spin"/>:<Save size={14}/>} Save</button>
        </div>
        {msg&&<div className={`px-4 py-3 rounded-xl text-sm ${msg.includes('saved')?'text-green-700 bg-green-50 border border-green-200':'text-red-700 bg-red-50 border border-red-200'}`}>{msg}</div>}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5" style={{border:'1px solid rgba(0,0,0,0.06)'}}>
          <h2 className="font-semibold text-sm pb-3" style={{color:'#1a1a1a',borderBottom:'1px solid rgba(0,0,0,0.05)'}}>WhatsApp</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>WhatsApp Number</label><input className={ic} style={is2} value={settings.whatsappNumber||''} onChange={e=>setSettings({...settings,whatsappNumber:e.target.value})} placeholder="+91XXXXXXXXXX"/></div>
            <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Pre-filled Message</label><input className={ic} style={is2} value={settings.whatsappMessage||''} onChange={e=>setSettings({...settings,whatsappMessage:e.target.value})}/></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4" style={{border:'1px solid rgba(0,0,0,0.06)'}}>
          <h2 className="font-semibold text-sm pb-3" style={{color:'#1a1a1a',borderBottom:'1px solid rgba(0,0,0,0.05)'}}>Social Links</h2>
          {['facebook','instagram','linkedin','youtube','twitter'].map(p=>(
            <div key={p}><label className="block text-xs font-semibold mb-1 uppercase capitalize" style={{color:'#6b5a4a'}}>{p}</label><input className={ic} style={is2} value={settings.socialLinks?.[p]||''} onChange={e=>setSettings({...settings,socialLinks:{...settings.socialLinks,[p]:e.target.value}})} placeholder={`https://${p}.com/...`}/></div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4" style={{border:'1px solid rgba(0,0,0,0.06)'}}>
          <h2 className="font-semibold text-sm pb-3" style={{color:'#1a1a1a',borderBottom:'1px solid rgba(0,0,0,0.05)'}}>Content</h2>
          <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Footer Text</label><textarea className={`${ic} resize-none`} style={is2} rows={2} value={settings.footerText||''} onChange={e=>setSettings({...settings,footerText:e.target.value})}/></div>
          <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Privacy Policy</label><textarea className={`${ic} resize-none`} style={is2} rows={6} value={settings.privacyPolicyContent||''} onChange={e=>setSettings({...settings,privacyPolicyContent:e.target.value})}/></div>
          <div><label className="block text-xs font-semibold mb-1 uppercase" style={{color:'#6b5a4a'}}>Cookie Consent Text</label><textarea className={`${ic} resize-none`} style={is2} rows={2} value={settings.cookieConsentText||''} onChange={e=>setSettings({...settings,cookieConsentText:e.target.value})}/></div>
        </div>
      </div>
    </AdminShell>
  );
}
