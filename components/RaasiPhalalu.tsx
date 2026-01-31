
import React, { useState } from 'react';
import { generateRaasiPrediction } from '../services/geminiService';
import { RaasiResult } from '../types';

const RAASIS = [
  { name: 'మేషం', en: 'Aries', icon: '♈' },
  { name: 'వృషభం', en: 'Taurus', icon: '♉' },
  { name: 'మిథునం', en: 'Gemini', icon: '♊' },
  { name: 'కర్కాటకం', en: 'Cancer', icon: '♋' },
  { name: 'సింహం', en: 'Leo', icon: '♌' },
  { name: 'కన్య', en: 'Virgo', icon: '♍' },
  { name: 'తుల', en: 'Libra', icon: '♎' },
  { name: 'వృశ్చికం', en: 'Scorpio', icon: '♏' },
  { name: 'ధనుస్సు', en: 'Sagittarius', icon: '♐' },
  { name: 'మకరం', en: 'Capricorn', icon: '♑' },
  { name: 'కుంభం', en: 'Aquarius', icon: '♒' },
  { name: 'మీనం', en: 'Pisces', icon: '♓' }
];

const RaasiPhalalu: React.FC = () => {
  const [selectedRaasi, setSelectedRaasi] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RaasiResult | null>(null);

  const fetchPrediction = async (raasi: string) => {
    setLoading(true);
    setSelectedRaasi(raasi);
    try {
      const res = await generateRaasiPrediction(raasi);
      setResult(res);
    } catch (e) {
      alert("Error calculating raasi phalalu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-8xl font-black tiro text-white cinzel uppercase">రాశి ఫలాల విశ్లేషణ</h2>
        <p className="text-slate-400 text-3xl tiro font-bold">నవగ్రహ గతులు మరియు మీ రాశిపై వాటి ప్రభావం.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {RAASIS.map(r => (
          <button 
            key={r.name}
            onClick={() => fetchPrediction(r.name)}
            className={`p-10 rounded-[4rem] border-4 transition-all flex flex-col items-center gap-4 ${selectedRaasi === r.name ? 'bg-purple-600 border-white text-white scale-110 shadow-2xl' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-purple-400'}`}
          >
            <span className="text-[100px]">{r.icon}</span>
            <span className="text-3xl font-black tiro">{r.name}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-20 animate-pulse">
          <div className="w-24 h-24 border-8 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <p className="text-4xl font-black tiro text-purple-400">గ్రహ గతుల విశ్లేషణ జరుగుతోంది...</p>
        </div>
      )}

      {result && !loading && (
        <div className="bg-[#1e293b] border-8 border-purple-900/50 rounded-[6rem] p-24 space-y-16 shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in slide-in-from-bottom-20 duration-1000">
          <div className="absolute top-0 right-0 p-20 opacity-[0.05] pointer-events-none">
             <span className="text-[40rem]">{RAASIS.find(r => r.name === selectedRaasi)?.icon}</span>
          </div>

          <header className="flex justify-between items-center border-b-4 border-purple-500/30 pb-10 relative z-10">
             <h3 className="text-8xl font-black tiro text-white">{selectedRaasi} రాశి ఫలితాలు</h3>
             <div className="px-10 py-4 bg-purple-600 rounded-full text-white font-black text-2xl uppercase tracking-widest shadow-xl">ADVANCED NODE</div>
          </header>

          <div className="grid md:grid-cols-2 gap-12 relative z-10">
             <div className="bg-slate-950 p-12 rounded-[4rem] border-4 border-slate-800 shadow-inner">
                <h4 className="text-4xl font-black tiro text-purple-400 mb-6 flex items-center gap-4">
                  <span className="material-icons text-5xl">auto_awesome</span> గోచారం & ఫలితం
                </h4>
                <p className="text-white text-4xl leading-[2] tiro font-bold">{result.prediction}</p>
             </div>
             
             <div className="space-y-12">
                <div className="grid grid-cols-2 gap-8">
                   <div className="bg-slate-950 p-10 rounded-[3rem] border-4 border-slate-800">
                      <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-2">Lucky Number</p>
                      <p className="text-6xl font-black text-white cinzel">{result.luckyNumber}</p>
                   </div>
                   <div className="bg-slate-950 p-10 rounded-[3rem] border-4 border-slate-800">
                      <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-2">Health Index</p>
                      <p className="text-4xl font-black text-emerald-400 tiro">{result.health}</p>
                   </div>
                </div>

                <div className="bg-indigo-900/30 p-10 rounded-[3rem] border-4 border-indigo-500/30">
                   <h4 className="text-4xl font-black tiro text-indigo-400 mb-4 uppercase tracking-widest">ఆర్థిక పరిస్థితి</h4>
                   <p className="text-white text-3xl tiro font-bold italic">{result.wealth}</p>
                </div>
             </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-12 rounded-[4rem] border-4 border-white/10 shadow-2xl relative z-10">
             <h4 className="text-4xl font-black tiro text-white mb-4 flex items-center gap-4">
                <span className="material-icons text-5xl">flare</span> శాంతి & పరిహారములు
             </h4>
             <p className="text-white text-[45px] font-black tiro leading-tight drop-shadow-lg">{result.remedy}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaasiPhalalu;
