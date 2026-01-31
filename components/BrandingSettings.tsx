
import React, { useState, useEffect } from 'react';
import { Branding } from '../types';

const BrandingSettings: React.FC = () => {
  const [branding, setBranding] = useState<Branding>(() => {
    const saved = localStorage.getItem('dharma_branding');
    return saved ? JSON.parse(saved) : {
      name: 'శ్రీ వెంకట సాయి',
      phone: '+91 94924 60254',
      role: 'జ్యోతిష్య నిపుణులు & ఆధ్యాత్మిక సలహాదారులు',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://chat.whatsapp.com/sample'
    };
  });

  useEffect(() => {
    localStorage.setItem('dharma_branding', JSON.stringify(branding));
  }, [branding]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in duration-700">
      <div className="bg-[#0a0f1e]/90 backdrop-blur-3xl border border-amber-500/20 rounded-[3rem] p-10 shadow-2xl">
        <header className="mb-10 text-center">
          <h2 className="text-4xl font-black cinzel gold-text mb-4">PERSONAL BRANDING</h2>
          <p className="text-slate-400 tiro text-lg italic">మీ వివరాలను ఇక్కడ నింపండి. ఇవి ఆటోమేటిక్ గా మీ పోస్టర్స్ లో కనిపిస్తాయి.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-amber-500 uppercase tracking-widest">Full Name (పేరు)</label>
              <input 
                value={branding.name} 
                onChange={e => setBranding({...branding, name: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-lg tiro focus:border-amber-500 outline-none transition-all"
                placeholder="Ex: శ్రీ పి. వెంకటేశ్వర శాస్త్రి"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-amber-500 uppercase tracking-widest">Contact Number (ఫోన్)</label>
              <input 
                value={branding.phone} 
                onChange={e => setBranding({...branding, phone: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-lg focus:border-amber-500 outline-none transition-all"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-amber-500 uppercase tracking-widest">Designation (హోదా)</label>
              <input 
                value={branding.role} 
                onChange={e => setBranding({...branding, role: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-lg tiro focus:border-amber-500 outline-none transition-all"
                placeholder="Ex: జ్యోతిష్య రత్న, వాస్తు నిపుణులు"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-amber-500 uppercase tracking-widest">Profile Photo URL (లింక్)</label>
              <input 
                value={branding.photoUrl} 
                onChange={e => setBranding({...branding, photoUrl: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:border-amber-500 outline-none transition-all"
                placeholder="https://your-image-link.com/photo.jpg"
              />
              <p className="text-[10px] text-slate-500 italic">గమనిక: మీ గూగుల్ డ్రైవ్ లేదా సోషల్ మీడియా ఫోటో లింక్ ఇక్కడ ఇవ్వవచ్చు.</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-amber-500 uppercase tracking-widest">WhatsApp QR URL (లింక్)</label>
              <input 
                value={branding.qrUrl} 
                onChange={e => setBranding({...branding, qrUrl: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:border-amber-500 outline-none transition-all"
                placeholder="QR కోడ్ ఇమేజ్ లింక్"
              />
            </div>
            
            <div className="pt-6">
               <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500">
                     <img src={branding.photoUrl} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                  <div>
                    <p className="text-amber-500 font-black tiro uppercase">{branding.name}</p>
                    <p className="text-slate-400 text-xs">{branding.role}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 p-4 text-center border-t border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Settings are auto-saved in your browser</p>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
