
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { generateSpiritualPost } from '../services/geminiService';
import { PostContent, AppTab, Branding, OutputMode } from '../types';
import { SCRIPTURES, MAHARSHIS_LIST, FESTIVALS_LIST, VASTU_LIST, BIG_THREE_LIST, RAMAYANA_SECTIONS, MAHABHARATHA_SECTIONS, GITA_SECTIONS, NITHI_KATHALU_LIST, PILLALA_KATHALU_LIST, MOTIVATIONAL_KATHALU_LIST } from '../constants';

interface PostGeneratorProps {
  mode: AppTab;
}

const PostGenerator: React.FC<PostGeneratorProps> = ({ mode }) => {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<PostContent | null>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [nodeSearch, setNodeSearch] = useState('');
  const [researchStep, setResearchStep] = useState('');
  const [viewMode, setViewMode] = useState<'POSTER' | 'STORY'>('POSTER');
  const [includeSloka, setIncludeSloka] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'te-IN';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTopic(prev => (prev.trim() + ' ' + transcript).trim());
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

  const currentList = useMemo(() => {
    let items: any[] = [];
    if (mode === AppTab.GENERATOR) items = [...BIG_THREE_LIST, ...RAMAYANA_SECTIONS, ...MAHABHARATHA_SECTIONS, ...GITA_SECTIONS, ...SCRIPTURES];
    else if (mode === AppTab.DHARMA_HUB) items = [...RAMAYANA_SECTIONS, ...MAHABHARATHA_SECTIONS, ...GITA_SECTIONS, ...FESTIVALS_LIST];
    else if (mode === AppTab.SANATANA_DHARMA) items = [...MAHARSHIS_LIST, ...SCRIPTURES.filter(s => s.category === 'Veda')];
    else if (mode === AppTab.PANDUGALU) items = FESTIVALS_LIST;
    else if (mode === AppTab.VASTU) items = VASTU_LIST;
    else if (mode === AppTab.NITHI_KATHALU) items = NITHI_KATHALU_LIST;
    else if (mode === AppTab.PILLALA_KATHALU) items = PILLALA_KATHALU_LIST;
    else if (mode === AppTab.MOTIVATIONAL_KATHALU) items = MOTIVATIONAL_KATHALU_LIST;
    
    if (nodeSearch) return items.filter(i => (i.name || i.teluguName).toLowerCase().includes(nodeSearch.toLowerCase()));
    return items;
  }, [mode, nodeSearch]);

  const themeColors = useMemo(() => {
    switch (mode) {
      case AppTab.NITHI_KATHALU: return { bg: 'bg-amber-950', accent: 'text-amber-500', border: 'border-amber-800', btn: 'from-amber-600 to-orange-700' };
      case AppTab.PILLALA_KATHALU: return { bg: 'bg-emerald-950', accent: 'text-emerald-500', border: 'border-emerald-800', btn: 'from-emerald-500 to-teal-700' };
      case AppTab.MOTIVATIONAL_KATHALU: return { bg: 'bg-rose-950', accent: 'text-rose-500', border: 'border-rose-800', btn: 'from-rose-600 to-red-700' };
      default: return { bg: 'bg-slate-950', accent: 'text-orange-500', border: 'border-slate-800', btn: 'from-orange-600 to-amber-700' };
    }
  }, [mode]);

  const handleGenerate = async (targetMode: OutputMode) => {
    if (!topic && !selectedId) {
      alert("దయచేసి ఒక అంశాన్ని ఎంచుకోండి.");
      return;
    }
    setLoading(true);
    setPost(null);
    setViewMode(targetMode === 'TEMPLATE' ? 'POSTER' : 'STORY');
    
    const steps = ["కథా సేకరణ జరుగుతోంది...", "నీతి విశ్లేషణ సిద్ధమవుతోంది...", "దివ్య రూపం దాలుస్తోంది..."];
    let stepIndex = 0;
    const interval = setInterval(() => {
      setResearchStep(steps[stepIndex % steps.length]);
      stepIndex++;
    }, 1500);

    try {
      const b = JSON.parse(localStorage.getItem('dharma_branding') || '{}');
      const selectedItem = currentList.find(item => item.id === selectedId);
      let context = selectedItem ? (selectedItem.name || selectedItem.teluguName) : mode;
      
      const res = await generateSpiritualPost(topic || context, mode, includeSloka, false, true, targetMode);

      setPost({
        ...res,
        authorName: b.name || 'పైడిపాటి భాస్కరచార్యులు',
        authorPhone: b.phone || '9492460254',
        authorRole: b.role || 'జ్యోతిష్య నిపుణులు',
        qrUrl: b.qrUrl || '',
        authorPhotoUrl: b.photoUrl || '',
        location: b.location || 'మునగాల'
      });
      
      setTimeout(() => document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth' }), 500);
    } catch (e) {
      alert("Error generating content.");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setResearchStep('');
    }
  };

  return (
    <div className="flex flex-col items-center gap-16 pb-40 max-w-[1700px] mx-auto w-full">
      
      <div className={`w-full ${themeColors.bg} border-[12px] ${themeColors.border} rounded-[7rem] p-20 shadow-2xl animate-in fade-in duration-700`}>
        <header className="text-center mb-16">
          <h3 className="text-7xl font-black tiro text-white uppercase tracking-tighter drop-shadow-sm">అంశాన్ని ఎంచుకోండి</h3>
          <p className={`${themeColors.accent} font-black text-3xl tracking-[1em] uppercase mt-4`}>{mode.replace('_', ' ')} HUB</p>
        </header>

        <div className="flex items-center gap-8 bg-black/30 px-12 py-8 rounded-full border-4 border-white/5 shadow-inner mb-16 max-w-4xl mx-auto focus-within:bg-black/50 focus-within:border-white/20 transition-all">
          <span className="material-icons text-6xl text-slate-500">search</span>
          <input 
            type="text" 
            value={nodeSearch} 
            onChange={e => setNodeSearch(e.target.value)} 
            placeholder="ఇక్కడ వెతకండి..." 
            className="bg-transparent border-none outline-none text-4xl font-black tiro w-full text-white placeholder:text-slate-700" 
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-12 max-h-[600px] overflow-y-auto custom-scroll p-8">
          {currentList.map(item => (
            <button 
              key={item.id} 
              onClick={() => setSelectedId(item.id)} 
              className={`flex flex-col items-center gap-10 p-14 rounded-[6rem] border-4 transition-all group ${selectedId === item.id ? 'bg-white/10 border-white/40 scale-110 shadow-2xl' : 'bg-black/20 border-white/5 hover:bg-black/40 hover:border-white/20'}`}
            >
              <span className="text-[140px] group-hover:scale-125 transition-transform drop-shadow-xl leading-none">{item.icon}</span>
              <span className="text-3xl font-black tiro text-center leading-tight text-white">{item.name || item.teluguName}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-6xl space-y-16 text-center">
        <div className="relative group">
          <label className="text-5xl font-black text-slate-100 tiro uppercase tracking-widest mb-12 block">విషయాన్ని వివరించండి</label>
          <div className="relative">
            <textarea 
              value={topic} 
              onChange={e => setTopic(e.target.value)} 
              placeholder="ఉదాహరణకు: పట్టుదల గురించి లేదా ఒక మంచి నీతి కథ..." 
              className="w-full bg-[#0f172a] border-[20px] border-slate-800 rounded-[7rem] p-20 text-5xl tiro outline-none focus:border-white/30 shadow-2xl min-h-[350px] text-center leading-relaxed text-white placeholder:text-slate-800 transition-all" 
            />
            <button 
              onClick={toggleVoice}
              className={`absolute right-16 bottom-16 w-40 h-40 rounded-full flex items-center justify-center transition-all shadow-2xl border-4 border-white/20 ${isListening ? 'bg-red-600 animate-pulse scale-110' : 'bg-slate-800 text-orange-600 hover:bg-slate-700'}`}
            >
              <span className="material-icons text-[100px]">{isListening ? 'mic' : 'mic_none'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-16 pt-6">
           <button 
             onClick={() => setIncludeSloka(!includeSloka)} 
             className={`flex items-center gap-8 px-16 py-8 rounded-full font-black tiro text-4xl transition-all border-4 shadow-xl ${includeSloka ? 'bg-orange-600 border-white text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
           >
              <span className="material-icons text-6xl">{includeSloka ? 'check_circle' : 'radio_button_unchecked'}</span>
              శ్లోకం అవసరం (Include Sloka)
           </button>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <button 
            onClick={() => handleGenerate('TEMPLATE')} 
            disabled={loading} 
            className={`group py-16 bg-gradient-to-r ${themeColors.btn} text-white font-black rounded-[5rem] text-6xl shadow-2xl hover:brightness-110 active:scale-95 transition-all cinzel border-b-[30px] border-black/50`}
          >
            {loading && viewMode === 'POSTER' ? researchStep : 'GENERATE POSTER'}
          </button>
          <button 
            onClick={() => handleGenerate('STORY')} 
            disabled={loading} 
            className="group py-16 bg-gradient-to-r from-emerald-600 to-teal-800 text-white font-black rounded-[5rem] text-6xl shadow-2xl hover:brightness-110 active:scale-95 transition-all cinzel border-b-[30px] border-black/50"
          >
            {loading && viewMode === 'STORY' ? researchStep : 'GENERATE STORY'}
          </button>
        </div>
      </div>

      <div id="result-area" className="w-full mt-32">
        {post && !loading && (
          <div className="w-full flex flex-col items-center gap-24">
            {viewMode === 'POSTER' ? (
              <div className="w-full max-w-[1000px] animate-in zoom-in-95 duration-1000">
                <div id="divine-poster" className="w-full aspect-[9/16] bg-[#020617] overflow-hidden flex flex-col relative shadow-[0_100px_200px_rgba(0,0,0,1)] border-[4px] border-[#FFD700]/30 rounded-[2rem] print:rounded-none">
                  <div className="absolute inset-0 opacity-[0.5] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url('https://source.unsplash.com/featured/1080x1920/?${post.backgroundKeyword}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-transparent to-[#020617]/95 pointer-events-none"></div>

                  <div className="p-24 pt-32 flex justify-between items-start relative z-10">
                     <div className="space-y-10 max-w-[85%]">
                        <h1 className="text-[100px] font-black tiro text-[#FFD700] drop-shadow-[0_15px_40px_rgba(0,0,0,1)] leading-none uppercase">{post.title}</h1>
                        <p className="text-[#FFD700]/90 font-bold text-5xl tiro border-l-[16px] border-[#FFD700] pl-12 shadow-sm">{post.subtitle}</p>
                     </div>
                     <div className="bg-white p-4 rounded-[4rem] shadow-[0_0_100px_rgba(255,215,0,0.6)] border-[10px] border-[#FFD700]/60 w-48 h-48 transform rotate-6">
                        <img src={post.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${post.authorPhone}`} className="w-full h-full object-contain" alt="QR" />
                     </div>
                  </div>

                  <div className="flex-1 p-20 flex flex-col items-center justify-center relative z-10">
                     <div className="w-full h-full bg-[#0f172a]/95 border-[20px] border-[#FFD700]/15 rounded-[8rem] p-24 flex flex-col items-center relative shadow-[inset_0_0_200px_rgba(0,0,0,1)]">
                        <div className="flex-1 w-full text-center flex flex-col justify-center gap-16">
                           {post.sloka && (
                             <p className="text-[70px] font-black text-[#FFD700] leading-tight tiro italic drop-shadow-2xl border-b-8 border-[#FFD700]/10 pb-16">{post.sloka}</p>
                           )}
                           <p className="text-white text-[64px] leading-[2.4] tiro font-bold whitespace-pre-line drop-shadow-[0_15px_30px_rgba(0,0,0,1)]">{post.body}</p>
                        </div>
                     </div>
                  </div>

                  <div className="px-24 py-16 relative z-10">
                     <div className="bg-gradient-to-r from-orange-800 via-amber-700 to-orange-800 rounded-full py-12 px-24 flex items-center justify-between shadow-2xl border-[6px] border-[#FFD700]/50">
                        <h4 className="text-white font-black text-6xl tiro tracking-[0.4em] uppercase w-full text-center">{post.slogan}</h4>
                     </div>
                  </div>

                  <div className="p-24 pb-32 bg-black/90 backdrop-blur-3xl flex items-center justify-between relative z-10 border-t-[10px] border-[#FFD700]/30">
                     <div className="flex items-center gap-14">
                        <div className="w-48 h-48 rounded-[5rem] border-[12px] border-[#FFD700]/70 overflow-hidden shadow-2xl bg-orange-950 flex items-center justify-center">
                           {post.authorPhotoUrl ? <img src={post.authorPhotoUrl} className="w-full h-full object-cover" /> : <span className="material-icons text-9xl text-white">person</span>}
                        </div>
                        <div className="space-y-4">
                           <h2 className="text-[#FFD700] font-black text-8xl tiro tracking-tighter uppercase leading-none">{post.authorName}</h2>
                           <p className="text-white/80 font-bold text-5xl tiro uppercase">{post.authorRole}</p>
                        </div>
                     </div>
                     <div className="bg-[#059669] flex items-center gap-10 px-24 py-10 rounded-[5rem] border-4 border-white/30 shadow-2xl">
                        <span className="material-icons text-white text-[90px]">call</span>
                        <span className="text-white font-black text-7xl cinzel">{post.authorPhone}</span>
                     </div>
                  </div>
                </div>
                <button onClick={() => window.print()} className="w-full mt-24 py-20 bg-orange-600 text-white rounded-[6rem] font-black text-6xl shadow-2xl border-b-[40px] border-orange-900 transition-all active:scale-95">DOWNLOAD 8K TEMPLATE</button>
              </div>
            ) : (
              <div className={`w-full max-w-[1300px] ${themeColors.bg} border-[30px] ${themeColors.border} rounded-[10rem] p-40 shadow-2xl space-y-24 animate-in slide-in-from-right-20`}>
                <header className="border-b-[12px] border-white/10 pb-20 flex justify-between items-center gap-20">
                  <div className="space-y-10">
                    <p className={`${themeColors.accent} font-black text-4xl uppercase tracking-[1em]`}>DIVINE STORY HUB</p>
                    <h3 className="text-[120px] font-black tiro text-white leading-none">{post.title}</h3>
                    <p className="text-white/60 font-bold text-6xl tiro italic underline decoration-[16px] decoration-white/10 underline-offset-[30px]">{post.subtitle}</p>
                  </div>
                </header>
                <div className="p-32 bg-black/40 rounded-[8rem] border-8 border-white/5">
                  <p className="text-white tiro text-[70px] leading-[2.8] font-bold text-justify whitespace-pre-line">{post.body}</p>
                </div>
                <div className="p-32 border-l-[50px] border-orange-500 bg-black/60 rounded-r-[8rem] shadow-2xl">
                  <h4 className="text-6xl font-black tiro text-orange-500 uppercase mb-10">MORAL / MESSAGE</h4>
                  <p className="text-white tiro text-[80px] font-black italic leading-tight">{post.conclusion}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostGenerator;
