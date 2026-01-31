
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
    setResearchStep("మహర్షి విజ్ఞానం సేకరిస్తోంది...");

    try {
      const bStr = localStorage.getItem('dharma_branding');
      const b = bStr ? JSON.parse(bStr) : { name: 'పైడిపాటి భాస్కరచార్యులు', phone: '9492460254', role: 'జ్యోతిష్య నిపుణులు', location: 'మునగాల' };
      
      const selectedItem = currentList.find(item => item.id === selectedId);
      let context = selectedItem ? (selectedItem.name || selectedItem.teluguName) : mode;
      
      const res = await generateSpiritualPost(topic || context, mode, includeSloka, false, true, targetMode);

      setPost({
        ...res,
        authorName: b.name,
        authorPhone: b.phone,
        authorRole: b.role,
        qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://wa.me/91${b.phone}&bgcolor=ffffff&color=000000&margin=0`,
        authorPhotoUrl: b.photoUrl,
        location: b.location
      });
      setTimeout(() => document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth' }), 500);
    } catch (e: any) {
      alert("సర్వర్ కనెక్షన్ లోపం. దయచేసి మళ్ళీ ప్రయత్నించండి.");
    } finally {
      setLoading(false);
      setResearchStep('');
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 pb-40 max-w-[1600px] mx-auto w-full">
      {/* Search and Selection Area */}
      <div className="w-full bg-[#0f172a] border-4 border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group no-print">
        <header className="text-center mb-8">
          <h3 className="text-5xl font-black tiro text-white tracking-tighter uppercase mb-2">అంశాన్ని ఎంచుకోండి</h3>
          <p className="text-orange-500 font-bold text-xl tracking-[0.5em] uppercase opacity-70">Bhaskara Hub 8K</p>
        </header>

        <div className="flex items-center gap-6 bg-black/40 px-10 py-6 rounded-full border border-white/10 shadow-inner mb-10 max-w-4xl mx-auto focus-within:border-orange-500 transition-all">
          <span className="material-icons text-4xl text-slate-600">search</span>
          <input 
            type="text" 
            value={nodeSearch} 
            onChange={e => setNodeSearch(e.target.value)} 
            placeholder="Search Vedic Topics..." 
            className="bg-transparent border-none outline-none text-2xl tiro w-full text-white placeholder:text-slate-800" 
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-h-[350px] overflow-y-auto custom-scroll p-6 bg-black/20 rounded-3xl border border-white/5">
          {currentList.map(item => (
            <button 
              key={item.id} 
              onClick={() => setSelectedId(item.id)} 
              className={`flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all group ${selectedId === item.id ? 'bg-orange-600/30 border-orange-500 shadow-2xl scale-110' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
            >
              <span className="text-6xl drop-shadow-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-lg font-black tiro text-center leading-none text-white">{item.name || item.teluguName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Description Area */}
      <div className="w-full max-w-6xl space-y-12 text-center no-print">
        <div className="relative group">
          <label className="text-2xl font-black text-slate-500 tiro uppercase tracking-widest mb-6 block group-focus-within:text-orange-500 transition-colors">వివరణాత్మక అంశం (Detailed Subject)</label>
          <textarea 
            value={topic} 
            onChange={e => setTopic(e.target.value)} 
            placeholder="మీ మనసులోని భావాన్ని ఇక్కడ ఎంటర్ చేయండి. మహర్షి శైలిలో అద్భుతమైన జ్ఞానం సృష్టించబడుతుంది..." 
            className="w-full bg-[#0f172a] border-[8px] border-white/5 rounded-[4rem] p-12 text-3xl md:text-4xl tiro outline-none focus:border-orange-500 shadow-2xl min-h-[250px] text-center text-white placeholder:text-slate-900 leading-relaxed transition-all" 
          />
          <button 
            onClick={toggleVoice}
            className={`absolute right-10 bottom-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-3xl ${isListening ? 'bg-red-600 animate-pulse ring-[20px] ring-red-600/10' : 'bg-slate-800 text-orange-500 hover:bg-white/10'}`}
          >
            <span className="material-icons text-5xl">{isListening ? 'mic' : 'mic_none'}</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-8">
           <button 
             onClick={() => setIncludeSloka(!includeSloka)} 
             className={`flex items-center gap-4 px-12 py-6 rounded-full font-black tiro text-2xl transition-all border-2 ${includeSloka ? 'bg-orange-600 border-orange-400 text-white shadow-2xl scale-105' : 'bg-white/5 border-white/10 text-slate-500'}`}
           >
              <span className="material-icons text-4xl">{includeSloka ? 'verified' : 'circle'}</span>
              శ్లోకం చేర్చు (Add Sloka)
           </button>
        </div>

        <div className="grid grid-cols-2 gap-10 pt-6">
          <button onClick={() => handleGenerate('TEMPLATE')} disabled={loading} className="py-10 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 text-white font-black rounded-[3rem] text-3xl shadow-2xl hover:brightness-110 active:scale-95 transition-all border-b-[20px] border-orange-950 uppercase tracking-widest">
            {loading && viewMode === 'POSTER' ? researchStep : 'GENERATE POSTER'}
          </button>
          <button onClick={() => handleGenerate('STORY')} disabled={loading} className="py-10 bg-slate-900 text-white font-black rounded-[3rem] text-3xl shadow-xl hover:bg-slate-800 active:scale-95 transition-all border-b-[20px] border-black border border-white/5 uppercase tracking-widest">
            {loading && viewMode === 'STORY' ? researchStep : 'GENERATE STORY'}
          </button>
        </div>
      </div>

      {/* Result Display Area */}
      <div id="result-area" className="w-full mt-10">
        {post && !loading && (
          <div className="w-full flex flex-col items-center gap-20">
            {viewMode === 'POSTER' ? (
              <div className="w-full max-w-[850px] animate-in zoom-in-95 duration-1000">
                {/* 9:16 Portrait Ultra-HD Poster */}
                <div id="divine-poster" className="w-full aspect-[9/16] bg-[#020617] overflow-hidden flex flex-col relative shadow-[0_150px_300px_rgba(0,0,0,1)] border-[4px] border-[#FFD700]/30 rounded-2xl scale-image-8k">
                  {/* Atmospheric High-Quality Background */}
                  <div className="absolute inset-0 opacity-[0.6] mix-blend-overlay scale-110" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1080&h=1920&fit=crop&q=80&sig=${post.backgroundKeyword}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/90"></div>

                  {/* Header Title & QR: Neat & Clean */}
                  <div className="p-14 pb-4 flex justify-between items-start relative z-10">
                     <div className="flex-1 space-y-4">
                        <h1 className="text-[58px] font-black tiro text-[#FFD700] leading-none drop-shadow-[0_6px_15px_rgba(0,0,0,1)] tracking-tight uppercase line-clamp-2">{post.title}</h1>
                        <p className="text-white font-bold text-2xl tiro italic opacity-80 drop-shadow-lg">{post.subtitle}</p>
                     </div>
                     <div className="bg-white p-1 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-[6px] border-[#FFD700]/30 w-32 h-32 flex items-center justify-center transform rotate-2">
                        <img src={post.qrUrl} className="w-full h-full object-contain" alt="Borderless QR" />
                     </div>
                  </div>

                  {/* Main Matter: Profound Insight */}
                  <div className="flex-1 px-12 flex flex-col items-center justify-center relative z-10 text-center">
                     <div className="w-full bg-[#0f172a]/95 border-[8px] border-[#FFD700]/15 rounded-[4rem] p-12 flex flex-col items-center justify-center relative shadow-[inset_0_0_150px_rgba(0,0,0,0.6)] overflow-hidden">
                        {post.sloka && (
                          <div className="mb-10 w-full px-6">
                            <p className="text-[34px] font-black text-[#FFD700] leading-tight tiro italic px-8 py-8 border-y-4 border-[#FFD700]/20 tracking-tight bg-white/5 rounded-3xl shadow-inner italic">ॐ {post.sloka} ॐ</p>
                          </div>
                        )}
                        <p className="text-white text-[44px] leading-[1.8] tiro font-bold whitespace-pre-line px-4 drop-shadow-[0_8px_20px_rgba(0,0,0,1)] tracking-tight animate-in fade-in duration-1000 delay-500">
                           {post.body}
                        </p>
                        <span className="absolute -bottom-20 -right-20 text-[#FFD700]/5 text-[350px] leading-none pointer-events-none transform rotate-45">ॐ</span>
                     </div>
                  </div>

                  {/* Divine Slogan Bar */}
                  <div className="px-14 py-8 relative z-10">
                     <div className="bg-gradient-to-r from-red-950 via-orange-600 to-red-950 rounded-3xl py-6 px-12 flex items-center justify-center shadow-3xl border-2 border-[#FFD700]/40 group-hover:scale-[1.02] transition-transform">
                        <h4 className="text-white font-black text-3xl tiro uppercase tracking-[0.4em] drop-shadow-lg leading-none">
                          ⛳ {post.slogan} ⛳
                        </h4>
                     </div>
                  </div>

                  {/* Footer Branding: Professional & High-End */}
                  <div className="p-12 bg-[#020617] flex items-center justify-between relative z-10 border-t-[10px] border-[#FFD700]/40 shadow-[0_-40px_100px_rgba(0,0,0,0.8)]">
                     <div className="flex items-center gap-10">
                        <div className="w-28 h-28 rounded-2xl border-[6px] border-[#FFD700] overflow-hidden shadow-2xl bg-orange-950 transform -rotate-1">
                           {post.authorPhotoUrl ? <img src={post.authorPhotoUrl} className="w-full h-full object-cover" /> : <span className="material-icons text-8xl text-white/20 p-5">person</span>}
                        </div>
                        <div className="leading-none space-y-4">
                           <h2 className="text-[#FFD700] font-black text-5xl tiro uppercase tracking-tighter drop-shadow-2xl">{post.authorName}</h2>
                           <p className="text-white/70 font-bold text-lg tiro uppercase tracking-[0.2em]">{post.authorRole}</p>
                           <div className="flex items-center gap-4 text-white/30 text-[14px] font-black tiro italic mt-2">
                             <span className="material-icons text-xl">location_on</span>
                             {post.location}
                           </div>
                        </div>
                     </div>
                     <div className="bg-[#10b981] flex items-center gap-6 px-10 py-6 rounded-full border-2 border-white/20 shadow-2xl active:scale-95 transition-all group">
                        <span className="material-icons text-white text-4xl group-hover:rotate-12 transition-transform">phone_in_talk</span>
                        <span className="text-white font-black text-4xl cinzel tracking-tighter leading-none">{post.authorPhone}</span>
                     </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-8 mt-16 w-full no-print">
                  <button onClick={() => window.print()} className="flex-1 py-10 bg-orange-600 text-white rounded-[3rem] font-black text-3xl shadow-3xl border-b-[20px] border-orange-950 active:scale-95 transition-all flex items-center justify-center gap-8 group">
                    <span className="material-icons text-6xl group-hover:scale-125 transition-transform">download_for_offline</span>
                    SAVE IMAGE (8K ULTRA HD)
                  </button>
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.whatsappFormat)}`, '_blank')} className="px-20 py-10 bg-[#25D366] text-white rounded-[3rem] font-black text-3xl shadow-3xl border-b-[20px] border-[#128C7E] active:scale-95 transition-all flex items-center justify-center gap-6 group">
                    <span className="material-icons text-7xl group-hover:animate-bounce">whatsapp</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Story Mode: Comprehensive Library Archive Style */
              <div className="w-full max-w-6xl bg-[#0f172a] border-[20px] border-white/5 rounded-[6rem] p-20 md:p-32 shadow-2xl space-y-20 animate-in slide-in-from-bottom-14 duration-1000 relative overflow-hidden">
                <div className="absolute top-0 left-0 p-16 opacity-[0.05] pointer-events-none">
                   <span className="material-icons text-[30rem] text-orange-500">menu_book</span>
                </div>
                <header className="border-b-4 border-white/10 pb-16 relative z-10 text-center">
                  <h3 className="text-[100px] font-black tiro text-[#FFD700] tracking-tight drop-shadow-2xl mb-6 leading-none">{post.title}</h3>
                  <div className="inline-block px-12 py-5 bg-orange-600/20 rounded-full border-2 border-orange-500/40 shadow-xl">
                    <p className="text-orange-400 font-bold text-3xl tiro italic tracking-widest">{post.subtitle}</p>
                  </div>
                </header>
                <div className="p-16 bg-black/60 rounded-[5rem] border-2 border-white/5 relative z-10 overflow-hidden shadow-inner">
                  <p className="text-white tiro text-[44px] leading-[2.4] font-medium text-justify whitespace-pre-line tracking-tight relative z-10 drop-shadow-lg">{post.body}</p>
                </div>
                <div className="p-16 border-l-[40px] border-orange-600 bg-orange-600/10 rounded-r-[5rem] relative z-10 shadow-2xl">
                  <div className="flex items-center gap-8 mb-8">
                    <span className="material-icons text-7xl text-orange-500">auto_awesome</span>
                    <h4 className="text-2xl font-black text-orange-400 uppercase tracking-[1em]">Rishi Secrets Reveal</h4>
                  </div>
                  <p className="text-white tiro text-[64px] font-black italic leading-tight drop-shadow-2xl">"{post.conclusion}"</p>
                </div>
                <button onClick={() => window.print()} className="w-full py-10 bg-slate-900 text-white rounded-[3rem] font-black text-4xl cinzel uppercase no-print border-b-[15px] border-black hover:bg-black transition-all">Print Library Record</button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          #divine-poster { 
            width: 100% !important; 
            max-width: none !important;
            height: auto !important;
            aspect-ratio: 9/16 !important;
            box-shadow: none !important;
            transform: none !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
          }
          body { 
            background: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
        .scale-image-8k {
          /* High-res scaling logic for exports */
          transform-origin: top center;
        }
      `}</style>
    </div>
  );
};

export default PostGenerator;
