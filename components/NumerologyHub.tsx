
import React, { useState } from 'react';
import { generateNumerologyReport } from '../services/geminiService';
import { NumerologyResult } from '../types';

const NumerologyHub: React.FC = () => {
  const [form, setForm] = useState({ name: '', dob: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NumerologyResult | null>(null);

  const calculate = async () => {
    if (!form.dob) {
      alert("దయచేసి పుట్టిన తేదీని ఎంటర్ చేయండి.");
      return;
    }
    setLoading(true);
    try {
      const res = await generateNumerologyReport(form.name, form.dob);
      setResult(res);
    } catch (e) {
      alert("Error calculating numerology.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-8xl font-black tiro text-white cinzel uppercase">సంఖ్యాశాస్త్రం (Numerology Pro)</h2>
        <p className="text-slate-400 text-3xl tiro font-bold">సంఖ్యల వెనుక దాగి ఉన్న రహస్యాలు మరియు మీ అదృష్టాన్ని తెలుసుకోండి.</p>
      </div>

      <div className="bg-[#1e293b] p-16 rounded-[5rem] border-4 border-slate-800 shadow-2xl space-y-12">
         <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
               <label className="text-xl font-black text-slate-400 uppercase tracking-widest px-8">మీ పేరు (Optional Name)</label>
               <input 
                 className="w-full bg-slate-900 border-4 border-slate-800 rounded-[3rem] px-10 py-8 text-4xl tiro text-white outline-none focus:border-cyan-500"
                 placeholder="NAME"
                 value={form.name} onChange={e => setForm({...form, name: e.target.value})}
               />
            </div>
            <div className="space-y-4">
               <label className="text-xl font-black text-slate-400 uppercase tracking-widest px-8">పుట్టిన తేదీ (Date of Birth)</label>
               <input 
                 type="date"
                 className="w-full bg-slate-900 border-4 border-slate-800 rounded-[3rem] px-10 py-8 text-4xl text-white outline-none focus:border-cyan-500"
                 value={form.dob} onChange={e => setForm({...form, dob: e.target.value})}
               />
            </div>
         </div>
         <button 
           onClick={calculate}
           disabled={loading}
           className="w-full py-10 bg-cyan-600 text-white rounded-[3rem] font-black text-4xl cinzel shadow-2xl hover:bg-cyan-500 transition-all border-b-8 border-cyan-900"
         >
           {loading ? 'CALCULATING NUMBERS...' : 'CALCULATE DESTINY'}
         </button>
      </div>

      {result && !loading && (
        <div className="grid md:grid-cols-12 gap-12 animate-in zoom-in-95 duration-1000">
           <div className="md:col-span-4 bg-cyan-900/40 border-8 border-cyan-500/20 rounded-[6rem] p-16 flex flex-col items-center justify-center text-center space-y-12 shadow-2xl">
              <div className="space-y-4">
                 <p className="text-2xl font-black text-cyan-400 uppercase tracking-[1em]">Birth Number</p>
                 <div className="w-56 h-56 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[150px] font-black cinzel border-[12px] border-white/20 shadow-2xl">{result.birthNumber}</div>
              </div>
              <div className="space-y-4">
                 <p className="text-2xl font-black text-cyan-400 uppercase tracking-[1em]">Destiny Number</p>
                 <div className="w-56 h-56 rounded-full bg-white text-cyan-950 flex items-center justify-center text-[150px] font-black cinzel border-[12px] border-cyan-600 shadow-2xl">{result.destinyNumber}</div>
              </div>
           </div>

           <div className="md:col-span-8 bg-slate-900 border-8 border-slate-800 rounded-[6rem] p-20 space-y-12">
              <div className="p-10 bg-slate-950 rounded-[4rem] border-4 border-slate-800">
                 <h4 className="text-4xl font-black tiro text-cyan-400 mb-6 uppercase tracking-widest">సంఖ్యా విశ్లేషణ (Analysis)</h4>
                 <p className="text-white text-4xl leading-[2] tiro font-bold">{result.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-10">
                 <div className="p-8 bg-cyan-950 rounded-[3rem] border-2 border-cyan-500/20">
                    <p className="text-[12px] font-black text-cyan-500 uppercase tracking-widest">Lucky Colors</p>
                    <p className="text-3xl font-black tiro text-white">{result.luckyColors}</p>
                 </div>
                 <div className="p-8 bg-cyan-950 rounded-[3rem] border-2 border-cyan-500/20">
                    <p className="text-[12px] font-black text-cyan-500 uppercase tracking-widest">Lucky Days</p>
                    <p className="text-3xl font-black tiro text-white">{result.luckyDays}</p>
                 </div>
              </div>

              <div className="p-10 bg-emerald-950 rounded-[4rem] border-4 border-emerald-500/20">
                 <h4 className="text-4xl font-black tiro text-emerald-400 mb-4">మరింత అదృష్టం కోసం పరిహారాలు</h4>
                 <p className="text-white text-3xl tiro font-bold italic">{result.remedies}</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default NumerologyHub;
