
import { useState, useMemo, useEffect, useRef } from 'react';
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
  const [includeSloka, setIncludeSloka] = useState(true);
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

  const handleGenerate = async (targetMode: OutputMode) => {
    if (!topic && !selectedId) {
      alert("దయచేసి ఒక అంశాన్ని ఎంచుకోండి.");
      return;
    }
    setLoading(true);
    setPost(null);
    setViewMode(targetMode === 'TEMPLATE' ? 'POSTER' : 'STORY');
    setResearchStep("AI విశ్లేషిస్తోంది...");

    try {
      const bStr = localStorage.getItem('dharma_branding');
      const b = bStr ? JSON.parse(bStr) : {};
      
      const selectedItem = currentList.find(item => item.id === selectedId);
      let context = selectedItem ? (selectedItem.name || selectedItem.teluguName) : mode;
      
      const res = await generateSpiritualPost(topic || context, mode, includeSloka, false, true, targetMode);

      const postData: PostContent = {
        ...res,
        authorName: b.name || 'పైడిపాటి భాస్కరచార్యులు',
        authorPhone: b.phone || '9492460254',
        authorRole: b.role || 'జ్యోతిష్య నిపుణులు',
        qrUrl: b.qrUrl || '',
        authorPhotoUrl: b.photoUrl || '',
        location: b.location || 'మునగాల - సిద్ధవటం'
      };
      
      setPost(postData);
      setTimeout(() => document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth' }), 500);
    } catch (e: any) {
      if (e.message === "API_KEY_INVALID") {
        alert("API Key సరిగ్గా లేదు. దయచేసి టాప్ హెడర్‌లో 'ENTER API KEY' క్లిక్ చేసి సరైన కీని సెట్ చేయండి.");
      } else {
        alert("సర్వర్ కనెక్షన్ లోపం. దయచేసి మళ్ళీ ప్రయత్నించండి.");
      }
    } finally {
      setLoading(false);
      setResearchStep('');
    }
  };

  return (
    <div className="flex flex-col items-center gap-16 pb-40 max-w-[1600px] mx-auto w-full">
      {/* Search & Select Panel */}
      <div className="w-full bg-[#0f172a] border-[8px] border-white/5 rounded-[4rem] p-16 shadow-2xl relative overflow-hidden group">
        <header className="text-center mb-12 relative z-10">
          <h3 className="text-6xl font-black tiro text-white tracking-tighter uppercase mb-2">అంశాన్ని ఎంచుకోండి</h3>
          <p className="text-amber-500 font-black text-2xl tracking-[0.4em] uppercase opacity-80">{mode.replace('_', ' ')} Studio</p>
          <div className="h-1.5 w-48 bg-orange-600 mx-auto mt-6 rounded-full shadow-[0_0_20px_rgba(234,88,12,0.6)]"></div>
        </header>

        <div className="flex items-center gap-8 bg-black/50 px-12 py-8 rounded-3xl border border-white/10 shadow-inner mb-16 focus-within:border-orange-500/50 transition-all max-w-5xl mx-auto">
          <span className="material-icons text-6xl text-slate-500">search</span>
          <input 
            type="text" 
            value={nodeSearch} 
            onChange={e => setNodeSearch(e.target.value)} 
            placeholder="వెతకండి (Search)..." 
            className="bg-transparent border-none outline-none text-3xl tiro w-full text-white placeholder:text-slate-800" 
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 max-h-[450px] overflow-y-auto custom-scroll p-6 bg-black/20 rounded-[3rem] border border-white/5">
          {currentList.map(item => (
            <button 
              key={item.id} 
              onClick={() => setSelectedId(item.id)} 
              className={`flex flex-col items-center gap-5 p-8 rounded-[3rem] border-2 transition-all group ${selectedId === item.id ? 'bg-orange-600/30 border-orange-500 shadow-[0_15px_40px_rgba(234,88,12,0.3)] scale-105' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
            >
              <span className="text-8xl drop-shadow-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-xl font-black tiro text-center leading-tight text-white">{item.name || item.teluguName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="w-full max-w-6xl space-y-12 text-center">
        <div className="relative group">
          <label className="text-3xl font-black text-slate-400 tiro uppercase tracking-widest mb-8 block group-focus-within:text-orange-500 transition-colors">వివరణాత్మక అంశం (Detailed Subject)</label>
          <textarea 
            value={topic} 
            onChange={e => setTopic(e.target.value)} 
            placeholder="మీ మనసులోని భావాన్ని ఇక్కడ ఎంటర్ చేయండి..." 
            className="w-full bg-[#0f172a] border-[8px] border-white/5 rounded-[5rem] p-16 text-4xl tiro outline-none focus:border-orange-500 shadow-2xl min-h-[300px] text-center text-white leading-relaxed placeholder:text-slate-900" 
          />
          <button 
            onClick={toggleVoice}
            className={`absolute right-12 bottom-12 w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-3xl ${isListening ? 'bg-red-600 animate-pulse ring-[24px] ring-red-600/20' : 'bg-slate-800 text-orange-500 border border-white/10 hover:bg-white/10'}`}
          >
            <span className="material-icons text-5xl">{isListening ? 'mic' : 'mic_none'}</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-10">
           <button 
             onClick={() => setIncludeSloka(!includeSloka)} 
             className={`flex items-center gap-5 px-12 py-6 rounded-full font-black tiro text-2xl transition-all border-4 ${includeSloka ? 'bg-orange-600 border-orange-400 text-white shadow-xl scale-105' : 'bg-white/5 border-white/10 text-slate-500'}`}
           >
              <span className="material-icons text-4xl">{includeSloka ? 'verified' : 'circle'}</span>
              శ్లోకం చేర్చు (Add Sloka)
           </button>
        </div>

        <div className="grid grid-cols-2 gap-12 pt-10">
          <button 
            onClick={() => handleGenerate('TEMPLATE')} 
            disabled={loading} 
            className="py-10 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 text-white font-black rounded-[3rem] text-4xl shadow-[0_20px_50px_rgba(234,88,12,0.4)] hover:brightness-110 active:scale-95 transition-all border-b-[20px] border-orange-950 uppercase tracking-widest"
          >
            {loading && viewMode === 'POSTER' ? researchStep : 'GENERATE POSTER'}
          </button>
          <button 
            onClick={() => handleGenerate('STORY')} 
            disabled={loading} 
            className="py-10 bg-slate-900 text-white font-black rounded-[3rem] text-4xl shadow-2xl hover:bg-slate-800 active:scale-95 transition-all border-b-[20px] border-black uppercase tracking-widest border border-white/5"
          >
            {loading && viewMode === 'STORY' ? researchStep : 'GENERATE STORY'}
          </button>
        </div>
      </div>

      {/* RESULT SECTION */}
      <div id="result-area" className="w-full mt-24">
        {post && !loading && (
          <div className="w-full flex flex-col items-center gap-24">
            {viewMode === 'POSTER' ? (
              <div className="w-full max-w-[900px] animate-in zoom-in-95 duration-1000">
                {/* DIVINE POSTER - REF MATCHED */}
                <div id="divine-poster" className="w-full aspect-[4/5] bg-[#020617] overflow-hidden flex flex-col relative shadow-[0_120px_240px_rgba(0,0,0,1)] border-[8px] border-[#FFD700]/30 rounded-lg">
                  {/* Atmospheric Background Layer */}
                  <div className="absolute inset-0 opacity-[0.55] mix-blend-overlay scale-110" style={{ backgroundImage: `url('https://source.unsplash.com/featured/1200x1500/?vedic,temple,god,spirituality,${post.backgroundKeyword}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/90 pointer-events-none"></div>

                  {/* 1. TOP TITLE AREA & QR (REF MATCHED) */}
                  <div className="px-14 py-16 flex justify-between items-start relative z-10">
                     <div className="flex-1 space-y-4">
                        <h1 className="text-[75px] font-black tiro text-[#FFD700] leading-none drop-shadow-[0_6px_15px_rgba(0,0,0,1)] tracking-tight uppercase animate-in slide-in-from-left-10 duration-1000">{post.title}</h1>
                        <div className="flex items-center gap-6 opacity-90">
                           <div className="w-16 h-1.5 bg-[#FFD700] shadow-[0_0_15px_#FFD700]"></div>
                           <p className="text-[#FFD700] font-bold text-4xl tiro italic drop-shadow-lg">{post.subtitle}</p>
                        </div>
                     </div>
                     <div className="bg-white p-3 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] border-[7px] border-[#FFD700]/50 w-40 h-40 flex items-center justify-center transform rotate-2 animate-in slide-in-from-right-10 duration-1000">
                        <img src={post.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://wa.me/91${post.authorPhone}`} className="w-full h-full object-contain" alt="QR" />
                     </div>
                  </div>

                  {/* 2. CENTER CONTENT BOX */}
                  <div className="flex-1 px-14 py-4 relative z-10 flex flex-col items-center justify-center">
                     <div className="w-full h-full bg-[#0f172a]/95 border-[6px] border-[#FFD700]/20 rounded-[5rem] p-16 flex flex-col items-center justify-center relative shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] border-b-[25px] border-[#FFD700]/15">
                        {/* Sloka Overlay */}
                        {post.sloka && (
                          <div className="mb-14 w-full text-center">
                            <p className="text-[48px] font-black text-[#FFD700] leading-tight tiro italic px-14 py-10 border-y-2 border-[#FFD700]/25 tracking-tight bg-white/5 rounded-[3rem] shadow-inner">ॐ {post.sloka} ॐ</p>
                          </div>
                        )}
                        {/* Core Message Text */}
                        <div className="w-full text-center">
                           <p className="text-white text-[48px] leading-[1.8] tiro font-bold whitespace-pre-line px-10 drop-shadow-[0_5px_10px_rgba(0,0,0,1)] tracking-tight animate-in fade-in duration-1000 delay-500">
                             {post.body}
                           </p>
                        </div>
                        {/* Large Om Overlay Backdrop */}
                        <span className="absolute -bottom-16 -right-10 text-[#FFD700]/10 text-[300px] leading-none pointer-events-none transform rotate-12 transition-transform duration-1000">ॐ</span>
                     </div>
                  </div>

                  {/* 3. SLOGAN BAR */}
                  <div className="px-14 py-10 relative z-10">
                     <div className="bg-gradient-to-r from-red-950 via-orange-600 to-red-950 rounded-[2.5rem] py-8 px-20 flex items-center justify-center shadow-[0_25px_70px_rgba(220,38,38,0.5)] border-2 border-[#FFD700]/40">
                        <h4 className="text-white font-black text-[38px] tiro uppercase tracking-[0.35em] leading-none drop-shadow-[0_4px_15px_rgba(0,0,0,0.7)]">
                          ⛳ {post.slogan} ⛳
                        </h4>
                     </div>
                  </div>

                  {/* 4. ROYAL FOOTER - BRANDING (REF MATCHED) */}
                  <div className="p-12 bg-[#020617] flex items-center justify-between relative z-10 border-t-[8px] border-[#FFD700]/40 shadow-[0_-40px_80px_rgba(0,0,0,0.6)]">
                     <div className="flex items-center gap-10">
                        <div className="w-32 h-32 rounded-3xl border-[6px] border-[#FFD700] overflow-hidden shadow-2xl bg-orange-950 transform -rotate-1 group hover:rotate-0 transition-transform duration-500">
                           {post.authorPhotoUrl ? <img src={post.authorPhotoUrl} className="w-full h-full object-cover" /> : <span className="material-icons text-[100px] text-white/20 p-6">person</span>}
                        </div>
                        <div className="leading-none space-y-4">
                           <h2 className="text-[#FFD700] font-black text-6xl tiro uppercase tracking-tighter drop-shadow-2xl">{post.authorName}</h2>
                           <p className="text-white/80 font-bold text-2xl tiro uppercase tracking-[0.3em]">{post.authorRole}</p>
                           <div className="flex items-center gap-4 text-white/40 text-lg font-black tiro italic mt-3 bg-white/5 px-4 py-1 rounded-full w-fit">
                             <span className="material-icons text-xl">location_on</span>
                             {post.location}
                           </div>
                        </div>
                     </div>
                     <div className="bg-[#10b981] flex items-center gap-6 px-16 py-7 rounded-[3rem] border-[5px] border-white/20 shadow-[0_25px_60px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all group">
                        <span className="material-icons text-white text-5xl group-hover:rotate-12 transition-transform">phone_in_talk</span>
                        <span className="text-white font-black text-5xl cinzel tracking-tighter leading-none">{post.authorPhone}</span>
                     </div>
                  </div>
                </div>
                
                {/* Print/Share Control Bar */}
                <div className="flex gap-12 mt-20 w-full animate-in slide-in-from-bottom-10 duration-1000">
                  <button onClick={() => window.print()} className="flex-1 py-10 bg-orange-600 text-white rounded-[4rem] font-black text-4xl shadow-3xl border-b-[25px] border-orange-950 active:scale-95 transition-all flex items-center justify-center gap-10 group">
                    <span className="material-icons text-6xl group-hover:scale-125 transition-transform">picture_as_pdf</span>
                    SAVE AS IMAGE (PDF)
                  </button>
                  <button onClick={() => {
                    const waUrl = `https://wa.me/?text=${encodeURIComponent(post.whatsappFormat)}`;
                    window.open(waUrl, '_blank');
                  }} className="px-24 py-10 bg-[#25D366] text-white rounded-[4rem] font-black text-4xl shadow-3xl border-b-[25px] border-[#128C7E] active:scale-95 transition-all flex items-center justify-center gap-10 group">
                    <span className="material-icons text-7xl group-hover:animate-bounce">whatsapp</span>
                    SHARE
                  </button>
                </div>
              </div>
            ) : (
              /* STORY MODE UI */
              <div className="w-full max-w-6xl bg-[#0f172a] border-[18px] border-white/5 rounded-[6rem] p-24 shadow-2xl space-y-20 animate-in slide-in-from-bottom-12 duration-1000 relative overflow-hidden">
                <div className="absolute top-0 left-0 p-16 opacity-[0.05] pointer-events-none">
                   <span className="material-icons text-[25rem] text-orange-500">menu_book</span>
                </div>
                <header className="border-b-4 border-white/10 pb-16 relative z-10">
                  <h3 className="text-[100px] font-black tiro text-[#FFD700] tracking-tight drop-shadow-2xl mb-6">{post.title}</h3>
                  <div className="inline-block px-12 py-4 bg-orange-600/15 rounded-full border-2 border-orange-500/40 shadow-lg">
                    <p className="text-orange-400 font-bold text-3xl tiro italic tracking-wider">{post.subtitle}</p>
                  </div>
                </header>
                <div className="p-20 bg-black/60 rounded-[5rem] border-2 border-white/10 shadow-inner relative z-10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                  <p className="text-white tiro text-[50px] leading-[2.4] font-bold text-justify whitespace-pre-line tracking-tight relative z-10 drop-shadow-md">{post.body}</p>
                </div>
                <div className="p-16 border-l-[32px] border-orange-600 bg-gradient-to-r from-orange-600/10 to-transparent rounded-r-[5rem] relative z-10 shadow-2xl">
                  <div className="flex items-center gap-6 mb-8">
                    <span className="material-icons text-6xl text-orange-500">verified</span>
                    <h4 className="text-xl font-black text-orange-400 uppercase tracking-[0.7em]">Rishi Wisdom Summary</h4>
                  </div>
                  <p className="text-white tiro text-[68px] font-black italic leading-tight drop-shadow-2xl">"{post.conclusion}"</p>
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
