
import React, { useState, useRef, useEffect } from 'react';
import { solveSamsaya } from '../services/geminiService';
import { SamsayaResult } from '../types';
import { SAMSAYA_SUGGESTIONS } from '../constants';

const SamsayaSolver: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SamsayaResult | null>(null);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'te-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setQuery(transcript);
      };
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  const handleSolve = async (forcedQuery?: string) => {
    const q = forcedQuery || query;
    if (!q.trim() && !forcedQuery) {
      // Auto-Inspiration Logic
      handleSolve("ఒక శక్తివంతమైన ఆధ్యాత్మిక సందేహం మరియు దానికి వేద పరిహారం తెలియజేయండి.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await solveSamsaya(q);
      setResult(res);
      setTimeout(() => {
        document.getElementById('samsaya-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (e) {
      alert("Error solving samsaya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-16 pb-60 max-w-[1700px] mx-auto w-full">
      <div className="w-full bg-indigo-900 border-[16px] border-indigo-100 rounded-[8rem] p-24 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-[0.05] pointer-events-none">
          <span className="material-icons text-[40rem] text-white">help_outline</span>
        </div>
        <h2 className="text-8xl font-black tiro text-indigo-100 uppercase mb-8 leading-none">ధర్మ సందేహ నివృత్తి</h2>
        <p className="text-indigo-300 font-black text-4xl tiro italic mb-12">మీ జీవిత సమస్యకు ఇతిహాసాల నుండి దివ్య పరిష్కారం</p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-16 max-w-6xl mx-auto">
          {SAMSAYA_SUGGESTIONS.map((s, idx) => (
            <button key={idx} onClick={() => handleSolve(s)} className="bg-indigo-800/50 hover:bg-indigo-400 hover:text-indigo-950 border-2 border-indigo-400/30 text-indigo-200 px-8 py-4 rounded-full text-2xl font-black tiro transition-all active:scale-95">{s}</button>
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto">
          <textarea 
            value={query} 
            onChange={e => setQuery(e.target.value)}
            placeholder="సందేహాన్ని ఇక్కడ టైప్ చేయండి లేదా క్రింది బటన్ క్లిక్ చేసి 'దివ్య ప్రేరణ' పొందండి..."
            className="w-full bg-white/10 border-8 border-indigo-400/30 rounded-[6rem] p-20 text-5xl tiro text-white placeholder:text-indigo-400/50 outline-none focus:border-indigo-400 min-h-[350px] text-center leading-relaxed"
          />
          <button onClick={toggleVoice} className={`absolute right-12 bottom-12 w-36 h-36 rounded-full flex items-center justify-center transition-all shadow-2xl border-4 border-white/10 ${isListening ? 'bg-red-600 animate-pulse ring-[30px] ring-red-600/10' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
            <span className="material-icons text-[100px] text-white">{isListening ? 'mic' : 'mic_none'}</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-16">
           <button onClick={() => handleSolve()} disabled={loading} className="px-40 py-16 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-[5.5rem] text-6xl shadow-2xl hover:brightness-110 active:scale-95 transition-all border-b-[32px] border-amber-900 uppercase cinzel tracking-widest">
             {loading ? 'అన్వేషణ...' : 'సమాధానం పొందు'}
           </button>
           <button onClick={() => handleSolve()} disabled={loading} className="px-12 py-8 bg-white/10 border-4 border-white/20 text-white rounded-full font-black tiro text-4xl hover:bg-white/20 transition-all">
             ✨ ఆత్మ విచారణ (Auto-Inspiration)
           </button>
        </div>
      </div>

      {result && (
        <div id="samsaya-result" className="w-full max-w-[1100px] animate-in zoom-in-95 duration-1000 space-y-24">
          <div className="w-full aspect-[9/16] bg-[#020617] overflow-hidden flex flex-col relative shadow-[0_200px_400px_rgba(0,0,0,1)] rounded-[4rem] border-[10px] border-indigo-500/40">
            <div className="absolute inset-0 opacity-[0.45] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1080&h=1920&fit=crop&q=80&sig=${result.backgroundKeyword}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 via-transparent to-black pointer-events-none"></div>

            <div className="p-24 pt-40 text-center relative z-10 space-y-12">
              <h4 className="text-[130px] font-black tiro text-[#FFD700] leading-none drop-shadow-[0_20px_50px_rgba(0,0,0,1)] uppercase tracking-tighter">{result.scriptureSource}</h4>
              <p className="text-indigo-200 font-bold text-5xl tiro italic bg-indigo-900/60 py-8 px-20 rounded-[4rem] inline-block border-4 border-indigo-500/40 shadow-2xl">{result.context}</p>
            </div>

            <div className="flex-1 p-20 flex flex-col items-center justify-center relative z-10">
               <div className="w-full h-full bg-black/70 backdrop-blur-xl border-[20px] border-indigo-500/20 rounded-[10rem] p-24 flex flex-col items-center justify-center text-center gap-20 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]">
                  <p className="text-7xl font-black text-[#FFD700] italic leading-tight tiro drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">"{result.sloka}"</p>
                  <p className="text-white text-[60px] leading-[2.6] tiro font-bold drop-shadow-lg">{result.meaning}</p>
               </div>
            </div>

            <div className="p-24 bg-indigo-950/95 relative z-10 border-t-[12px] border-indigo-500/40 space-y-12 shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
               <p className="text-white text-[64px] font-black tiro leading-tight text-center italic drop-shadow-lg">{result.solution}</p>
               <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 p-12 rounded-[5rem] text-center shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-4 border-white/20">
                  <p className="text-indigo-950 font-black text-5xl tiro uppercase tracking-tighter drop-shadow-sm">{result.divineMessage}</p>
               </div>
            </div>
          </div>
          <button onClick={() => window.print()} className="w-full py-20 bg-indigo-600 text-white rounded-[6rem] font-black text-6xl shadow-2xl border-b-[40px] border-indigo-950 transition-all active:scale-95 cinzel tracking-widest uppercase">DOWNLOAD DIVINE MANUSCRIPT</button>
        </div>
      )}
    </div>
  );
};

export default SamsayaSolver;
