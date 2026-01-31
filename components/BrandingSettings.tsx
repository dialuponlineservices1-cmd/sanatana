
import React, { useState, useEffect } from 'react';
import { Branding } from '../types';

const BrandingSettings: React.FC = () => {
  const [branding, setBranding] = useState<Branding>(() => {
    const saved = localStorage.getItem('dharma_branding');
    return saved ? JSON.parse(saved) : {
      name: 'పైడిపాటి భాస్కరచార్యులు',
      phone: '9492460254',
      role: 'జ్యోతిష్య నిపుణులు',
      location: 'మునగాల - సిద్ధవటం',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/919492460254',
    };
  });

  useEffect(() => {
    localStorage.setItem('dharma_branding', JSON.stringify(branding));
  }, [branding]);

  return (
    <div className="max-w-6xl mx-auto py-20 px-8 animate-in fade-in duration-1000">
      <div className="bg-white border-[12px] border-orange-100 rounded-[5rem] p-20 shadow-2xl space-y-20">
        <header className="text-center space-y-6">
          <h2 className="text-7xl font-black cinzel text-orange-900 tracking-tighter uppercase">ప్రొఫైల్ సెట్టింగ్స్</h2>
          <p className="text-orange-400 tiro text-3xl italic font-bold">మీ వివరాలు ప్రతి టెంప్లేట్ మరియు పోస్టర్ లో ఆటోమేటిక్ గా కనిపిస్తాయి.</p>
          <div className="h-1.5 w-64 mx-auto bg-orange-100 rounded-full"></div>
        </header>

        <div className="grid lg:grid-cols-2 gap-20">
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-xl font-black text-orange-800 uppercase tracking-widest px-6">మీ పేరు (Name)</label>
              <input 
                value={branding.name} 
                onChange={e => setBranding({...branding, name: e.target.value})}
                className="w-full bg-orange-50 border-4 border-orange-100 rounded-[3rem] px-10 py-8 text-3xl tiro focus:border-orange-500 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="space-y-4">
              <label className="text-xl font-black text-orange-800 uppercase tracking-widest px-6">ఫోన్ నంబర్ (Phone)</label>
              <input 
                value={branding.phone} 
                onChange={e => setBranding({...branding, phone: e.target.value})}
                className="w-full bg-orange-50 border-4 border-orange-100 rounded-[3rem] px-10 py-8 text-3xl focus:border-orange-500 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="space-y-4">
              <label className="text-xl font-black text-orange-800 uppercase tracking-widest px-6">హోదా / బిరుదు (Role)</label>
              <input 
                value={branding.role} 
                onChange={e => setBranding({...branding, role: e.target.value})}
                className="w-full bg-orange-50 border-4 border-orange-100 rounded-[3rem] px-10 py-8 text-3xl tiro focus:border-orange-500 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-xl font-black text-orange-800 uppercase tracking-widest px-6">ప్రాంతం (Location)</label>
              <input 
                value={branding.location} 
                onChange={e => setBranding({...branding, location: e.target.value})}
                className="w-full bg-orange-50 border-4 border-orange-100 rounded-[3rem] px-10 py-8 text-3xl tiro focus:border-orange-500 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="space-y-4">
              <label className="text-xl font-black text-orange-800 uppercase tracking-widest px-6">QR కోడ్ లింక్ (QR URL)</label>
              <input 
                value={branding.qrUrl} 
                onChange={e => setBranding({...branding, qrUrl: e.target.value})}
                className="w-full bg-orange-50 border-4 border-orange-100 rounded-[3rem] px-10 py-8 text-xl focus:border-orange-500 outline-none transition-all shadow-inner"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-20">
           <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-16 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
              <div className="flex items-center gap-10 relative z-10">
                 <div className="w-32 h-32 rounded-3xl border-4 border-white overflow-hidden shadow-2xl">
                    <img src={branding.photoUrl} className="w-full h-full object-cover" alt="Preview" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-5xl font-black tiro text-white leading-none">{branding.name}</h4>
                    <p className="text-white/80 font-bold text-2xl tiro">{branding.role}</p>
                    <p className="text-white/60 font-bold text-xl tiro italic">{branding.location}</p>
                 </div>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-2xl relative z-10 w-32 h-32">
                 <img src={branding.qrUrl} className="w-full h-full object-contain" alt="QR" />
              </div>
           </div>
           <p className="text-center text-stone-400 font-bold tiro text-2xl mt-12 italic">సెట్టింగ్స్ ఆటోమేటిక్ గా సేవ్ చేయబడతాయి.</p>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
