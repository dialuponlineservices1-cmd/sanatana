
import React, { useState } from 'react';
import { generateFullJathakam } from '../services/geminiService';
import { JathakamResult } from '../types';

const AstrologyHub: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JathakamResult | null>(null);
  const [form, setForm] = useState({
    name: '',
    dob: '',
    time: '',
    place: ''
  });

  const handleGenerate = async () => {
    if (!form.name || !form.dob || !form.time || !form.place) {
      alert("దయచేసి అన్ని వివరాలను నింపండి.");
      return;
    }
    setLoading(true);
    try {
      const res = await generateFullJathakam(form.name, form.dob, form.time, form.place);
      setResult(res);
    } catch (e) {
      alert("జాతక గణనలో లోపం జరిగింది.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[2600px] mx-auto pb-60 px-10 space-y-40">
      <header className="text-center space-y-12">
        <h2 className="text-[10rem] font-black cinzel text-orange-700 leading-none tracking-tighter uppercase drop-shadow-xl">పూర్ణ జాతకం</h2>
        <p className="text-orange-900/50 font-black tracking-[1.5em] uppercase text-2xl">Premium 8K Vedic Astrology Console</p>
        <div className="divider-saffron w-3/4 mx-auto"></div>
      </header>

      <div className="grid xl:grid-cols-12 gap-24 items-start">
        {/* INPUT HUB - ROYAL FORM */}
        <div className="xl:col-span-4 bg-white border-8 border-orange-100 rounded-[6rem] p-20 space-y-20 shadow-[0_50px_100px_rgba(139,69,19,0.1)]">
           <div className="flex items-center gap-8 border-b-4 border-orange-50 pb-12">
              <div className="w-24 h-24 bg-orange-100 rounded-[2rem] flex items-center justify-center">
                 <span className="material-icons text-6xl text-orange-600">stars</span>
              </div>
              <h3 className="text-6xl font-black tiro text-orange-800">వ్యక్తిగత వివరాలు</h3>
           </div>
           
           <div className="space-y-12">
              <div className="space-y-6">
                 <label className="text-[18px] font-black text-orange-400 uppercase tracking-widest px-8">పూర్తి పేరు (Name)</label>
                 <input 
                    className="w-full bg-orange-50 border-4 border-orange-100 rounded-[3rem] px-12 py-10 text-4xl tiro text-orange-900 outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Ex: శాస్త్రి గారు"
                 />
              </div>
              <div className="grid grid-cols-1 gap-12">
                 <div className="space-y-6">
                    <label className="text-[18px] font-black text-orange-400 uppercase tracking-widest px-8">పుట్టిన తేదీ (DOB)</label>
                    <input type="date" 
                       className="w-full bg-orange-50 border-4 border-orange-100 rounded-[3rem] px-12 py-10 text-3xl text-orange-900 outline-none focus:border-orange-500 transition-all shadow-inner"
                       value={form.dob} onChange={e => setForm({...form, dob: e.target.value})}
                    />
                 </div>
                 <div className="space-y-6">
                    <label className="text-[18px] font-black text-orange-400 uppercase tracking-widest px-8">సమయం (Time)</label>
                    <input type="time" 
                       className="w-full bg-orange-50 border-4 border-orange-100 rounded-[3rem] px-12 py-10 text-3xl text-orange-900 outline-none focus:border-orange-500 transition-all shadow-inner"
                       value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                    />
                 </div>
              </div>
              <div className="space-y-6">
                 <label className="text-[18px] font-black text-orange-400 uppercase tracking-widest px-8">పుట్టిన ప్రదేశం (Place)</label>
                 <input 
                    className="w-full bg-orange-50 border-4 border-orange-100 rounded-[3rem] px-12 py-10 text-4xl tiro text-orange-900 outline-none focus:border-orange-500 transition-all shadow-inner"
                    value={form.place} onChange={e => setForm({...form, place: e.target.value})}
                    placeholder="Ex: కాశీ"
                 />
              </div>
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-16 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black rounded-[4rem] cinzel tracking-[0.8em] text-4xl shadow-2xl hover:brightness-110 active:scale-95 transition-all mt-10 border-b-[16px] border-orange-800"
              >
                {loading ? 'CALCULATING...' : 'GENERATE JATHAKAM'}
              </button>
           </div>
        </div>

        {/* RESULTS - ROYAL DOCUMENT STYLE */}
        <div className="xl:col-span-8">
           {result ? (
              <div className="space-y-24 animate-in fade-in slide-in-from-right-20 duration-1000">
                 <div className="bg-white border-[16px] border-orange-50 rounded-[8rem] p-24 space-y-24 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 opacity-[0.05] pointer-events-none">
                       <span className="material-icons text-[50rem] text-orange-500">menu_book</span>
                    </div>

                    <header className="flex flex-col md:flex-row justify-between items-center border-b-8 border-orange-500 pb-20 relative z-10 gap-12">
                       <div className="text-center md:text-left space-y-6">
                          <h4 className="text-9xl font-black tiro text-orange-900 leading-none">{result.personalDetails.name}</h4>
                          <span className="inline-block px-12 py-4 bg-orange-600 text-white rounded-full text-2xl font-black uppercase tracking-widest">Master Destiny Record</span>
                       </div>
                       <div className="text-center md:text-right bg-orange-50 p-10 rounded-[3rem] border-2 border-orange-100">
                          <p className="text-orange-400 text-xl font-black uppercase tracking-widest mb-4">Calculation Log</p>
                          <p className="text-orange-900 font-black text-4xl cinzel">SECURE ARCHIVE</p>
                       </div>
                    </header>

                    {/* VIBRANT GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-10 relative z-10">
                       {[
                         { l: 'తిథి', v: result.panchangam.tithi, c: 'bg-red-50 text-red-700' },
                         { l: 'నక్షత్రం', v: result.panchangam.nakshatram, c: 'bg-orange-50 text-orange-700' },
                         { l: 'రాశి', v: result.panchangam.raasi, c: 'bg-amber-50 text-amber-700' },
                         { l: 'లగ్నం', v: result.panchangam.lagnam, c: 'bg-yellow-50 text-yellow-700' },
                         { l: 'యోగం', v: result.panchangam.yogam, c: 'bg-emerald-50 text-emerald-700' }
                       ].map(p => (
                         <div key={p.l} className={`${p.c} p-12 rounded-[4rem] border-4 border-white text-center space-y-6 shadow-xl`}>
                            <span className="text-[18px] font-black uppercase tracking-widest block opacity-70">{p.l}</span>
                            <p className="text-5xl font-black tiro drop-shadow-sm">{p.v}</p>
                         </div>
                       ))}
                    </div>

                    {/* PREDICTIONS - LARGE COLORFUL BLOCKS */}
                    <div className="space-y-20 relative z-10">
                       <h5 className="text-6xl font-black tiro text-orange-800 flex items-center gap-10 border-l-[20px] border-orange-500 pl-12">
                          జీవిత ఫలితాల విశ్లేషణ (Destiny Analysis)
                       </h5>
                       <div className="grid gap-16">
                          {[
                             { t: 'స్వభావము & వ్యక్తిత్వము', v: result.predictions.character, i: 'face', b: 'border-blue-100 bg-blue-50/30' },
                             { t: 'ఉద్యోగ & ధన యోగము', v: result.predictions.career, i: 'account_balance_wallet', b: 'border-emerald-100 bg-emerald-50/30' },
                             { t: 'ఆరోగ్యము & క్షేమము', v: result.predictions.health, i: 'healing', b: 'border-red-100 bg-red-50/30' },
                             { t: 'పరిహారములు & శాంతి', v: result.predictions.remedies, i: 'flare', b: 'border-amber-100 bg-amber-50/30' }
                          ].map(pred => (
                             <div key={pred.t} className={`${pred.b} p-20 rounded-[6rem] border-8 shadow-inner space-y-12`}>
                                <div className="flex items-center gap-10 border-b-4 border-black/5 pb-8">
                                   <span className="material-icons text-8xl opacity-30">{pred.i}</span>
                                   <span className="font-black text-5xl tiro text-stone-900">{pred.t}</span>
                                </div>
                                <p className="text-stone-800 text-5xl leading-[2] tiro text-justify font-bold tracking-tight">
                                   {pred.v}
                                </p>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-12">
                    <button className="py-14 bg-orange-600 text-white rounded-[4rem] font-black uppercase tracking-widest text-4xl shadow-2xl border-b-[16px] border-orange-800 flex items-center justify-center gap-8">
                       <span className="material-icons text-6xl">print</span>
                       PRINT ROYAL PDF
                    </button>
                    <button className="py-14 bg-white border-8 border-orange-100 text-orange-600 rounded-[4rem] font-black uppercase tracking-widest text-4xl hover:bg-orange-50 transition-all flex items-center justify-center gap-8">
                       <span className="material-icons text-6xl">share</span>
                       SHARE RESULTS
                    </button>
                 </div>
              </div>
           ) : (
              <div className="h-full min-h-[1200px] border-8 border-dashed border-orange-100 rounded-[8rem] flex flex-col items-center justify-center p-32 text-center text-orange-100 group">
                 <span className="material-icons text-[300px] mb-20 opacity-20">auto_awesome</span>
                 <h4 className="cinzel text-8xl tracking-widest mb-16 opacity-30 uppercase">Destiny Hub</h4>
                 <p className="text-3xl font-black uppercase tracking-[1em] opacity-20 max-w-4xl leading-relaxed">Input nodes to reveal celestial architectural results.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AstrologyHub;
