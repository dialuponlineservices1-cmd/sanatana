
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { generateSpiritualPost } from '../services/geminiService';
import { PostContent, AppTab, Branding, OutputMode } from '../types';
import { SCRIPTURES, MAHARSHIS_LIST, FESTIVALS_LIST, VASTU_LIST, MORAL_STORIES_LIST, BIG_THREE_LIST, RAMAYANA_SECTIONS, MAHABHARATHA_SECTIONS, GITA_SECTIONS } from '../constants';

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
  const [includeSloka, setIncludeSloka] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'te-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTopic(prev => (prev.trim() + ' ' + transcript).trim());
      };

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("క్షమించండి, మీ బ్రౌజర్ వాయిస్ రికగ్నిషన్‌కు మద్దతు ఇవ్వదు.");
      return;
    }
    if (isListening) recognitionRef.current.stop();
    else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Speech recognition start failed:", e);
      }
    }
  };

  const currentList = useMemo(() => {
    let items: any[] = [];
    if (mode === AppTab.GENERATOR) {
      items = [...BIG_THREE_LIST, ...RAMAYANA_SECTIONS, ...MAHABHARATHA_SECTIONS, ...GITA_SECTIONS, ...SCRIPTURES];
    }
    else if (mode === AppTab.DHARMA_HUB) {
      items = [...RAMAYANA_SECTIONS, ...MAHABHARATHA_SECTIONS, ...GITA_SECTIONS, ...FESTIVALS_LIST];
    }
    else if (mode === AppTab.SANATANA_DHARMA) {
      items = [...MAHARSHIS_LIST, ...SCRIPTURES.filter(s => s.category === 'Veda' || s.category === 'Upanishad')];
    }
    else if (mode === AppTab.PANDUGALU) items = FESTIVALS_LIST;
    else if (mode === AppTab.VASTU) items = VASTU_LIST;
    else if (mode === AppTab.MORAL_STORIES) items = MORAL_STORIES_LIST;
    
    if (nodeSearch) return items.filter(i => (i.name || i.teluguName).toLowerCase().includes(nodeSearch.toLowerCase()));
    return items;
  }, [mode, nodeSearch]);

  const getBranding = (): Branding => {
    const saved = localStorage.getItem('dharma_branding');
    return saved ? JSON.parse(saved) : {
      name: 'పైడిపాటి భాస్కరచార్యులు',
      phone: '9492460254',
      role: 'జ్యోతిష్య నిపుణులు',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/919492460254',
      location: 'మునగాల - సిద్ధవటం'
    };
  };

  const handleGenerate = async (targetMode: OutputMode) => {
    if (!topic && !selectedId) {
      alert("దయచేసి ఒక అంశాన్ని ఎంచుకోండి.");
      return;
    }
    setLoading(true);
    setPost(null);
    setViewMode(targetMode === 'TEMPLATE' ? 'POSTER' : 'STORY');
    
    const steps = ["పురాతన గ్రంథాల లోతైన పరిశీలన...", "దేవతా చిత్రాల సేకరణ...", "దివ్య డిజైన్ సిద్ధమవుతోంది..."];
    let stepIndex = 0;
    const interval = setInterval(() => {
      setResearchStep(steps[stepIndex % steps.length]);
      stepIndex++;
    }, 1500);

    try {
      const b = getBranding();
      const selectedItem = currentList.find(item => item.id === selectedId);
      let context = selectedItem ? (selectedItem.name || selectedItem.teluguName) : mode;
      
      const res = await generateSpiritualPost(topic || context, context, includeSloka, false, true, targetMode);

      setPost({
        ...res,
        authorName: b.name,
        authorPhone: b.phone,
        authorRole: b.role,
        qrUrl: b.qrUrl,
        authorPhotoUrl: b.photoUrl,
        location: b.location
      });
      
      setTimeout(() => {
        document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
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
      
      {/* SELECTION GRID */}
      <div className="w-full bg-white border-[12px] border-orange-100 rounded-[7rem] p-20 shadow-2xl animate-in fade-in duration-700">
        <header className="text-center mb-16">
          <h3 className="text-7xl font-black tiro text-orange-950 uppercase tracking-tighter drop-shadow-sm">అంశాన్ని ఎంచుకోండి</h3>
          <p className="text-orange-400 font-bold text-3xl tracking-[1em] uppercase mt-4">{mode} PORTAL</p>
        </header>

        <div className="flex items-center gap-8 bg-orange-50 px-12 py-8 rounded-full border-4 border-orange-100 shadow-inner mb-16 max-w-4xl mx-auto focus-within:bg-white focus-within:border-orange-500 transition-all">
          <span className="material-icons text-6xl text-orange-300">search</span>
          <input 
            type="text" 
            value={nodeSearch} 
            onChange={e => setNodeSearch(e.target.value)} 
            placeholder="ఇక్కడ వెతకండి..." 
            className="bg-transparent border-none outline-none text-4xl font-black tiro w-full text-orange-950 placeholder:text-orange-200" 
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-12 max-h-[600px] overflow-y-auto custom-scroll p-8">
          {currentList.map(item => (
            <button 
              key={item.id} 
              onClick={() => setSelectedId(item.id)} 
              className={`flex flex-col items-center gap-10 p-14 rounded-[6rem] border-4 transition-all group ${selectedId === item.id ? 'bg-orange-600 border-orange-900 text-white shadow-2xl scale-110' : 'bg-white border-orange-50 hover:bg-orange-50 hover:border-orange-400'}`}
            >
              <span className="text-[140px] group-hover:scale-125 transition-transform drop-shadow-xl leading-none">{item.icon}</span>
              <span className="text-3xl font-black tiro text-center leading-tight">{item.name || item.teluguName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* INPUT HUB */}
      <div className="w-full max-w-6xl space-y-16 text-center">
        <div className="relative group">
          <label className="text-5xl font-black text-orange-900 tiro uppercase tracking-widest mb-12 block">మీకు కావలసిన విషయాన్ని ఇక్కడ రాయండి లేదా చెప్పండి</label>
          <div className="relative">
            <textarea 
              value={topic} 
              onChange={e => setTopic(e.target.value)} 
              placeholder="ఉదాహరణకు: రామాయణంలోని పితృవాక్య పరిపాలన లేదా గీతలోని కర్తవ్య బోధ..." 
              className="w-full bg-white border-[20px] border-orange-100 rounded-[7rem] p-20 text-5xl tiro outline-none focus:border-orange-500 shadow-2xl min-h-[350px] text-center leading-relaxed text-orange-950 placeholder:text-orange-100 transition-all" 
            />
            <button 
              onClick={toggleVoice}
              className={`absolute right-16 bottom-16 w-40 h-40 rounded-full flex items-center justify-center transition-all shadow-2xl border-4 border-white/20 ${isListening ? 'bg-red-600 text-white animate-pulse scale-110 ring-[30px] ring-red-600/10' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
            >
              <span className="material-icons text-[100px]">{isListening ? 'mic' : 'mic_none'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-16 pt-6">
           <button 
             onClick={() => setIncludeSloka(!includeSloka)} 
             className={`flex items-center gap-8 px-16 py-8 rounded-full font-black tiro text-4xl transition-all border-4 shadow-xl ${includeSloka ? 'bg-orange-100 border-orange-500 text-orange-800' : 'bg-white border-stone-200 text-stone-300 opacity-60'}`}
           >
              <span className="material-icons text-6xl">{includeSloka ? 'check_circle' : 'radio_button_unchecked'}</span>
              శ్లోకం అవసరం
           </button>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <button 
            onClick={() => handleGenerate('TEMPLATE')} 
            disabled={loading} 
            className="group py-16 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white font-black rounded-[5rem] text-6xl shadow-2xl hover:brightness-110 active:scale-95 transition-all cinzel border-b-[30px] border-orange-900"
          >
            {loading && viewMode === 'POSTER' ? researchStep : 'GENERATE POSTER'}
          </button>
          <button 
            onClick={() => handleGenerate('STORY')} 
            disabled={loading} 
            className="group py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-black rounded-[5rem] text-6xl shadow-2xl hover:brightness-110 active:scale-95 transition-all cinzel border-b-[30px] border-emerald-900"
          >
            {loading && viewMode === 'STORY' ? researchStep : 'GENERATE STORY'}
          </button>
        </div>
      </div>

      {/* RESULT AREA */}
      <div id="result-area" className="w-full mt-32">
        {post && !loading && (
          <div className="w-full flex flex-col items-center gap-24">
            {viewMode === 'POSTER' ? (
              <div className="w-full max-w-[1000px] animate-in zoom-in-95 duration-1000">
                <div id="divine-poster" className="w-full aspect-[9/16] bg-[#020617] overflow-hidden flex flex-col relative shadow-[0_200px_400px_rgba(0,0,0,1)] border-[4px] border-[#FFD700]/30 rounded-[2rem] print:rounded-none">
                  <div className="absolute inset-0 opacity-[0.5] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url('https://source.unsplash.com/featured/1080x1920/?${post.backgroundKeyword}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-transparent to-[#020617]/95 pointer-events-none"></div>

                  <div className="p-24 pt-32 flex justify-between items-start relative z-10">
                     <div className="space-y-10 max-w-[85%]">
                        <h1 className="text-[100px] font-black tiro text-[#FFD700] drop-shadow-[0_15px_40px_rgba(0,0,0,1)] leading-none uppercase">{post.title}</h1>
                        <p className="text-[#FFD700]/90 font-bold text-5xl tiro border-l-[16px] border-[#FFD700] pl-12 shadow-sm">{post.subtitle}</p>
                     </div>
                     <div className="bg-white p-4 rounded-[4rem] shadow-[0_0_100px_rgba(255,215,0,0.6)] border-[10px] border-[#FFD700]/60 w-48 h-48 transform rotate-6">
                        <img src={post.qrUrl} className="w-full h-full object-contain" alt="QR" />
                     </div>
                  </div>

                  <div className="flex-1 p-20 flex flex-col items-center justify-center relative z-10">
                     <div className="w-full h-full bg-[#0f172a]/95 border-[20px] border-[#FFD700]/15 rounded-[8rem] p-24 flex flex-col items-center relative shadow-[inset_0_0_200px_rgba(0,0,0,1)]">
                        <span className="absolute top-20 left-24 text-[#FFD700]/10 text-[250px] font-black opacity-30 leading-none">🕉</span>
                        <div className="flex-1 w-full text-center flex flex-col justify-center gap-16">
                           {post.sloka && (
                             <p className="text-[70px] font-black text-[#FFD700] leading-tight tiro italic drop-shadow-2xl border-b-8 border-[#FFD700]/10 pb-16">{post.sloka}</p>
                           )}
                           <p className="text-white text-[64px] leading-[2.6] tiro font-bold whitespace-pre-line drop-shadow-[0_15px_30px_rgba(0,0,0,1)]">{post.body}</p>
                        </div>
                     </div>
                  </div>

                  <div className="px-24 py-16 relative z-10">
                     <div className="bg-gradient-to-r from-orange-800 via-amber-700 to-orange-800 rounded-full py-12 px-24 flex items-center justify-between shadow-2xl border-[6px] border-[#FFD700]/50">
                        <span className="material-icons text-white text-[100px]">temple_hindu</span>
                        <h4 className="text-white font-black text-6xl tiro tracking-[0.4em] uppercase">{post.slogan}</h4>
                        <span className="material-icons text-white text-[100px]">castle</span>
                     </div>
                  </div>

                  <div className="p-24 pb-32 bg-black/90 backdrop-blur-3xl flex items-center justify-between relative z-10 border-t-[10px] border-[#FFD700]/30">
                     <div className="flex items-center gap-14">
                        <img src={post.authorPhotoUrl} className="w-48 h-48 rounded-[5rem] border-[12px] border-[#FFD700]/70 shadow-[0_0_100px_rgba(255,215,0,0.5)] object-cover" />
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
                <button onClick={() => window.print()} className="w-full mt-24 py-20 bg-orange-600 text-white rounded-[6rem] font-black text-6xl shadow-2xl border-b-[40px] border-orange-900 transition-all active:scale-95">DOWNLOAD 8K POSTER</button>
              </div>
            ) : (
              <div className="w-full max-w-[1300px] bg-white border-[30px] border-orange-100 rounded-[10rem] p-40 shadow-2xl space-y-24 animate-in slide-in-from-right-20">
                <header className="border-b-[12px] border-orange-100 pb-20 flex justify-between items-center gap-20">
                  <div className="space-y-10">
                    <p className="text-orange-400 font-bold text-4xl uppercase tracking-[1em]">DIVINE SAGA</p>
                    <h3 className="text-[120px] font-black tiro text-orange-950 leading-none">{post.title}</h3>
                    <p className="text-orange-600 font-bold text-6xl tiro italic underline decoration-[16px] decoration-orange-100 underline-offset-[30px]">{post.subtitle}</p>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(post.whatsappFormat)} className="w-56 h-56 bg-orange-100 text-orange-700 rounded-[5rem] flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-2xl">
                    <span className="material-icons text-[140px]">content_copy</span>
                  </button>
                </header>
                <div className="p-32 bg-orange-50/50 rounded-[8rem] border-8 border-orange-50">
                  <p className="text-orange-950 tiro text-[70px] leading-[2.8] font-bold text-justify whitespace-pre-line">{post.body}</p>
                </div>
                <div className="p-32 border-l-[50px] border-emerald-600 bg-emerald-50 rounded-r-[8rem] shadow-2xl">
                  <h4 className="text-6xl font-black tiro text-emerald-900 uppercase mb-10">MESSAGE</h4>
                  <p className="text-emerald-800 tiro text-[80px] font-black italic">{post.conclusion}</p>
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
