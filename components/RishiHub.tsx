
import React, { useState } from 'react';
import { generateSpiritualPost } from '../services/geminiService';
import { MAHARSHIS_LIST } from '../constants';
import { PostContent } from '../types';

const RishiHub: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PostContent | null>(null);
  const [selectedRishi, setSelectedRishi] = useState<string | null>(null);

  const handleRishiInsights = async (rishiName: string) => {
    setLoading(true);
    setResult(null);
    setSelectedRishi(rishiName);
    try {
      // Use the existing service to generate a deep scholarly biography
      const res = await generateSpiritualPost(
        `${rishiName} మహర్షి చరిత్ర మరియు వారి దివ్య సందేశం`, 
        'Maharshi Biography', 
        true, 
        false, 
        true, 
        'STORY'
      );
      setResult(res);
      setTimeout(() => {
        document.getElementById('rishi-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (e) {
      alert("మహర్షి విజ్ఞానం పొందడంలో అంతరాయం కలిగింది.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-20 pb-60 max-w-[1800px] mx-auto w-full">
      <header className="text-center space-y-10 animate-in fade-in duration-1000">
        <h2 className="text-9xl font-black cinzel text-emerald-800 tracking-tighter uppercase leading-none">మహర్షి విజ్ఞాన కేంద్రం</h2>
        <p className="text-emerald-600 font-black text-4xl tiro italic max-w-6xl mx-auto">
          సప్తర్షులు మరియు మహా మునుల దివ్య చరిత్రలు, వారి సాధనలు మరియు లోక కళ్యాణం కోసం వారు అందించిన జ్ఞాన సంపద.
        </p>
        <div className="h-3 w-[1000px] mx-auto bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full opacity-30"></div>
      </header>

      {/* RISHI GALLERY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 w-full px-10">
        {MAHARSHIS_LIST.map((rishi) => (
          <div 
            key={rishi.id}
            className="group bg-white border-8 border-emerald-50 rounded-[7rem] p-16 hover:border-emerald-500 hover:shadow-[0_80px_160px_rgba(6,78,59,0.15)] transition-all cursor-pointer relative overflow-hidden flex flex-col items-center text-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-[0.05] rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
            
            <span className="text-[180px] mb-12 drop-shadow-2xl group-hover:scale-125 transition-transform duration-700 leading-none">{rishi.icon}</span>
            <div className="space-y-6">
               <h3 className="text-6xl font-black tiro text-emerald-950 leading-tight">{rishi.teluguName}</h3>
               <p className="text-emerald-800/70 text-3xl font-bold tiro italic leading-relaxed line-clamp-3 bg-emerald-50/50 p-8 rounded-[4rem] border-2 border-emerald-100/50">
                  {rishi.description}
               </p>
            </div>

            <button 
              onClick={() => handleRishiInsights(rishi.teluguName)}
              className="mt-12 w-full py-8 bg-emerald-600 text-white rounded-[4rem] font-black tiro text-3xl shadow-xl hover:bg-emerald-500 active:scale-95 transition-all flex items-center justify-center gap-6"
            >
              <span className="material-icons text-5xl">auto_awesome</span>
              దివ్య సమాచారం
            </button>
          </div>
        ))}
      </div>

      {/* RISHI INSIGHT RESULT */}
      {loading && (
        <div className="flex flex-col items-center gap-10 py-20 animate-pulse">
           <div className="w-40 h-40 border-[16px] border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
           <p className="text-4xl font-black tiro text-emerald-800 uppercase tracking-widest">మహర్షి లోక అన్వేషణ...</p>
        </div>
      )}

      {result && !loading && (
        <div id="rishi-result" className="w-full max-w-[1300px] bg-white border-[30px] border-emerald-100 rounded-[10rem] p-40 shadow-[0_120px_250px_rgba(6,78,59,0.2)] space-y-24 animate-in slide-in-from-bottom-20 duration-1000 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-emerald-500 opacity-[0.02] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <header className="border-b-[12px] border-emerald-100 pb-20 flex justify-between items-center gap-20 relative z-10">
            <div className="space-y-10">
              <p className="text-emerald-400 font-bold text-4xl uppercase tracking-[1em]">• మహర్షి చరిత్ర •</p>
              <h3 className="text-[140px] font-black tiro text-emerald-950 leading-none drop-shadow-sm">{result.title}</h3>
              <p className="text-emerald-700 font-bold text-6xl tiro italic underline decoration-[16px] decoration-emerald-100 underline-offset-[30px]">{result.subtitle}</p>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(result.whatsappFormat)}
              className="w-56 h-56 bg-emerald-100 text-emerald-800 rounded-[5rem] flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-2xl group border-4 border-emerald-200"
            >
              <span className="material-icons text-[140px] group-hover:scale-125 transition-transform">content_copy</span>
            </button>
          </header>

          <div className="p-32 bg-emerald-50/50 rounded-[10rem] border-8 border-emerald-50 relative z-10 shadow-inner">
            <p className="text-emerald-950 tiro text-[75px] leading-[2.8] font-bold text-justify whitespace-pre-line tracking-tight">
              {result.body}
            </p>
          </div>

          <div className="p-32 border-l-[60px] border-amber-500 bg-amber-50 rounded-r-[10rem] shadow-2xl relative z-10 space-y-12">
            <h4 className="text-6xl font-black tiro text-amber-900 uppercase tracking-widest">దివ్య సందేశం</h4>
            <p className="text-amber-800 tiro text-[90px] font-black italic leading-tight">
              {result.conclusion}
            </p>
          </div>

          <div className="pt-24 border-t-[12px] border-emerald-100 relative z-10">
            <button 
              onClick={() => navigator.clipboard.writeText(result.whatsappFormat)}
              className="w-full py-20 bg-emerald-600 text-white rounded-[6rem] font-black tiro text-7xl shadow-2xl flex items-center justify-center gap-16 hover:bg-emerald-500 active:scale-95 transition-all border-b-[40px] border-emerald-900 uppercase tracking-widest"
            >
              <span className="material-icons text-[120px]">whatsapp</span> వాట్సాప్‌లో షేర్ చేయండి
            </button>
            <p className="text-center text-stone-400 font-bold tiro text-4xl mt-20 italic">ఈ దివ్య సమాచారాన్ని ఇతరులతో పంచుకుని సనాతన ధర్మ ప్రచారంలో భాగస్వాములు అవ్వండి.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RishiHub;
