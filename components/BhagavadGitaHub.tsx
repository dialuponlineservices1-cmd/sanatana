
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { getApiKey } from '../services/geminiService';

const BhagavadGitaHub: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [chapter, setChapter] = useState('1');

  const fetchGitaContent = async (isRandom = true) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: getApiKey() });
      const prompt = isRandom 
        ? "Give a random profound Bhagavad Gita Shloka. Include Sanskrit text, clear Telugu meaning, and a deep spiritual life application. Response must be in JSON." 
        : `Provide a comprehensive summary and the most important shloka from Bhagavad Gita Chapter ${chapter}. Include Sanskrit and detailed Telugu. Response must be in JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: 'You are a Divine Vedic Maharshi. Your responses should be in highly scholarly, formal Telugu. Use spiritual metaphors and divine language. Return JSON only.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              shloka: { type: Type.STRING },
              teluguMeaning: { type: Type.STRING },
              chapterInfo: { type: Type.STRING },
              spiritualApplication: { type: Type.STRING },
              backgroundKeyword: { type: Type.STRING }
            },
            required: ['shloka', 'teluguMeaning', 'chapterInfo', 'spiritualApplication', 'backgroundKeyword']
          },
          thinkingConfig: { thinkingBudget: 24000 }
        }
      });

      const res = JSON.parse(response.text || "{}");
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitaContent();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto space-y-16 pb-40">
      <header className="text-center space-y-10 animate-in fade-in duration-1000">
        <div className="flex justify-center mb-8">
           <span className="material-icons text-[150px] text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]">auto_stories</span>
        </div>
        <h2 className="text-[120px] font-black tiro text-amber-500 uppercase leading-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] tracking-tighter">శ్రీమద్ భగవద్గీత</h2>
        <p className="text-slate-500 font-bold text-4xl tiro italic max-w-5xl mx-auto">
          నిత్య జీవిత సంక్షోభాలకు పరమాత్మ అందించిన దివ్య పరిష్కారం - సంపూర్ణ వేద సారం.
        </p>
        <div className="h-3 w-[800px] mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full opacity-30 shadow-2xl"></div>
      </header>

      <div className="grid lg:grid-cols-12 gap-16">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-10">
           <div className="bg-[#0f172a] border-[12px] border-amber-900/20 rounded-[5rem] p-16 space-y-12 shadow-3xl h-full flex flex-col">
              <h4 className="text-5xl font-black tiro text-white flex items-center gap-6 mb-4">
                <span className="material-icons text-6xl text-amber-500">book</span> అధ్యాయముల విజ్ఞానం
              </h4>
              <div className="grid grid-cols-3 gap-6">
                 {[...Array(18)].map((_, i) => (
                   <button 
                     key={i} 
                     onClick={() => { setChapter((i+1).toString()); fetchGitaContent(false); }}
                     className={`h-24 rounded-3xl font-black text-4xl cinzel transition-all border-b-8 active:scale-95 ${chapter === (i+1).toString() ? 'bg-amber-600 text-white border-amber-950 shadow-2xl scale-110' : 'bg-white/5 text-slate-500 border-black/20 hover:text-white hover:bg-white/10 hover:border-white/10'}`}
                   >
                     {i+1}
                   </button>
                 ))}
              </div>
              
              <div className="mt-auto space-y-6 pt-12">
                 <button 
                   onClick={() => fetchGitaContent(true)}
                   className="w-full py-10 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white font-black rounded-[3.5rem] text-4xl shadow-2xl hover:brightness-110 active:scale-95 transition-all border-b-[24px] border-amber-950 uppercase tracking-[0.2em] flex items-center justify-center gap-6"
                 >
                   <span className="material-icons text-6xl">flare</span> దివ్య శ్లోకం
                 </button>
                 <p className="text-center text-slate-500 font-bold tiro text-2xl italic opacity-50">ప్రతి రోజూ ఒక శ్లోకం - సంపూర్ణ శాంతి</p>
              </div>
           </div>
        </div>

        {/* Content Display Area */}
        <div className="lg:col-span-8">
           {loading ? (
             <div className="flex flex-col items-center justify-center h-full space-y-12 bg-black/40 rounded-[6rem] border-8 border-white/5 animate-pulse min-h-[1000px]">
                <div className="relative">
                   <div className="w-64 h-64 border-[16px] border-amber-100 border-t-amber-600 rounded-full animate-spin shadow-[0_0_80px_rgba(245,158,11,0.3)]"></div>
                   <span className="material-icons absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] text-amber-500">auto_stories</span>
                </div>
                <p className="tiro text-6xl text-amber-600 font-black uppercase tracking-[0.3em] drop-shadow-lg">గీతా సారం అన్వేషిస్తోంది...</p>
             </div>
           ) : data && (
             <div className="bg-[#FFF8E1] border-[30px] border-[#8B4513]/20 rounded-[8rem] p-24 shadow-[0_150px_300px_rgba(0,0,0,0.7)] relative overflow-hidden group min-h-[1000px] flex flex-col">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-15 pointer-events-none"></div>
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-amber-500 opacity-[0.03] rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="relative z-10 text-center space-y-12 flex-1 flex flex-col">
                   <div className="inline-block px-14 py-6 bg-red-800 text-white rounded-full text-4xl font-black tiro shadow-2xl uppercase tracking-widest border-b-[10px] border-red-950 transform -rotate-1">
                     {data.chapterInfo}
                   </div>
                   
                   <div className="bg-white/90 border-[12px] border-[#8B4513]/10 p-20 rounded-[7rem] shadow-inner space-y-16 flex-1 flex flex-col justify-center border-t-[30px] border-red-800/20">
                      <p className="text-[100px] font-black tiro text-[#8B4513] italic leading-tight drop-shadow-xl px-12 transform group-hover:scale-[1.02] transition-transform duration-1000">
                        " {data.shloka} "
                      </p>
                      <div className="h-2 w-96 mx-auto bg-gradient-to-r from-transparent via-red-800/40 to-transparent rounded-full shadow-sm"></div>
                      <p className="text-5xl font-bold tiro text-[#2D1B08] leading-relaxed text-justify px-10 italic drop-shadow-sm border-l-8 border-red-800/10 pl-16">
                        {data.teluguMeaning}
                      </p>
                   </div>

                   <div className="bg-red-800/10 border-8 border-red-800/15 rounded-[5rem] p-16 text-left space-y-8 shadow-[0_40px_80px_rgba(153,27,27,0.1)] relative">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                         <span className="material-icons text-[20rem]">flare</span>
                      </div>
                      <h5 className="text-5xl font-black tiro text-red-800 flex items-center gap-6 relative z-10">
                        <span className="material-icons text-7xl animate-pulse">psychology</span> భావ ప్రకాశిక (Divine Insight)
                      </h5>
                      <p className="text-4xl font-bold tiro text-red-950 leading-relaxed italic relative z-10 px-6">
                        {data.spiritualApplication}
                      </p>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-8 pt-12 no-print">
                      <button onClick={() => window.print()} className="w-full py-10 bg-red-800 text-white rounded-[4rem] font-black text-4xl shadow-2xl hover:bg-red-700 transition-all border-b-[20px] border-red-950 uppercase tracking-widest active:scale-95">
                         డౌన్‌లోడ్ పోస్టర్ (8K)
                      </button>
                      <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`శ్రీమద్ భగవద్గీత సందేశం:\n${data.shloka}\n\nఅర్థం: ${data.teluguMeaning}`)}`, '_blank')} className="w-full py-10 bg-emerald-600 text-white rounded-[4rem] font-black text-4xl shadow-2xl hover:bg-emerald-500 transition-all border-b-[20px] border-emerald-950 uppercase tracking-widest active:scale-95 flex items-center justify-center gap-6">
                         <span className="material-icons text-5xl">whatsapp</span> వాట్సాప్‌లో పంపు
                      </button>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default BhagavadGitaHub;
