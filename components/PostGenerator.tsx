
import { useState, useMemo, useEffect, useRef } from 'react';
import { generateSpiritualPost } from '../services/geminiService';
import { PostContent, AppTab, OutputMode } from '../types';
import { SCRIPTURES, MAHARSHIS_LIST, FESTIVALS_LIST, VASTU_LIST, BIG_THREE_LIST, RAMAYANA_SECTIONS, MAHABHARATHA_SECTIONS, GITA_SECTIONS, NITHI_KATHALU_LIST } from '../constants';

const PostGenerator: React.FC<{ mode: AppTab }> = ({ mode }) => {
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
    setResearchStep("మహర్షి విజ్ఞానం అన్వేషిస్తోంది...");

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
        qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://wa.me/91${b.phone}&bgcolor=00000000&color=FFD700&margin=0`,
        authorPhotoUrl: b.photoUrl,
        location: b.location
      });
      setTimeout(() => document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth' }), 500);
    } catch (e: any) {
      if (e.message === "API_LIMIT") {
        alert("మీ API Key ఉచిత పరిమితి (Limit) దాటిపోయింది. దయచేసి ఒక నిమిషం ఆగి మళ్ళీ ప్రయత్నించండి.");
      } else if (e.message === "API_INVALID") {
        alert("మీ API Key తప్పుగా ఉంది లేదా పని చేయడం లేదు. దయచేసి 'ప్రొఫైల్ సెట్టింగ్స్' లో సరైన కీ ఇవ్వండి.");
      } else if (e.message === "API_KEY_MISSING") {
        alert("API Key లేదు. దయచేసి 'ప్రొఫైల్ సెట్టింగ్స్' లో కీ ఎంటర్ చేయండి.");
      } else {
        alert("సర్వర్ కనెక్షన్ సమస్య. దయచేసి మీ ఇంటర్నెట్ చెక్ చేయండి.");
        console.error(e);
      }
    } finally {
      setLoading(false);
      setResearchStep('');
    }
  };

  const handleDownloadImage = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-12 pb-40 max-w-[1600px] mx-auto w-full">
      {/* Input Selection Area */}
      <div className="w-full bg-[#0f172a] border-2 border-white/5 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden group no-print">
        <header className="text-center mb-10">
          <h3 className="text-6xl font-black tiro text-white tracking-tighter uppercase mb-4">అంశాన్ని ఎంచుకోండి</h3>
          <p className="text-orange-500 font-bold text-2xl tracking-[0.5em] uppercase opacity-60">Internal Studio 8K Pro</p>
        </header>

        <div className="flex items-center gap-6 bg-black/40 px-10 py-6 rounded-full border border-white/10 shadow-inner mb-12 max-w-4xl mx-auto focus-within:border-orange-500 transition-all">
          <span className="material-icons text-4xl text-slate-600">search</span>
          <input 
            type="text" 
            value={nodeSearch} 
            onChange={e => setNodeSearch(e.target.value)} 
            placeholder="వేద అంశాల అన్వేషణ..." 
            className="bg-transparent border-none outline-none text-2xl tiro w-full text-white placeholder:text-slate-800" 
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 max-h-[350px] overflow-y-auto custom-scroll p-6 bg-black/20 rounded-3xl border border-white/5">
          {currentList.map(item => (
            <button 
              key={item.id} 
              onClick={() => setSelectedId(item.id)} 
              className={`flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all group ${selectedId === item.id ? 'bg-orange-600/30 border-orange-500 shadow-2xl scale-110 ring-4 ring-orange-500/10' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
            >
              <span className="text-6xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-xl font-black tiro text-center leading-none text-white">{item.name || item.teluguName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Description & Prompt Area */}
      <div className="w-full max-w-6xl space-y-12 text-center no-print">
        <div className="relative group">
          <label className="text-2xl font-black text-slate-500 tiro uppercase tracking-widest mb-6 block group-focus-within:text-orange-500 transition-colors">నిర్దిష్ట అంశం (Specific Subject)</label>
          <textarea 
            value={topic} 
            onChange={e => setTopic(e.target.value)} 
            placeholder="ఏదైనా టాపిక్ ఇవ్వండి... ఒక గొప్ప మహర్షి చెప్పే రహస్యాలు మీకు అందుతాయి." 
            className="w-full bg-[#0f172a] border-[10px] border-white/5 rounded-[5rem] p-16 text-4xl md:text-5xl tiro outline-none focus:border-orange-500 shadow-2xl min-h-[300px] text-center text-white placeholder:text-slate-900 leading-relaxed transition-all font-black" 
          />
          <button 
            onClick={toggleVoice}
            className={`absolute right-12 bottom-12 w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-3xl ${isListening ? 'bg-red-600 animate-pulse ring-[20px] ring-red-600/10' : 'bg-slate-800 text-orange-500 hover:bg-white/10'}`}
          >
            <span className="material-icons text-6xl">{isListening ? 'mic' : 'mic_none'}</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-8">
           <button 
             onClick={() => setIncludeSloka(!includeSloka)} 
             className={`flex items-center gap-4 px-14 py-8 rounded-full font-black tiro text-2xl transition-all border-2 ${includeSloka ? 'bg-orange-600 border-orange-400 text-white shadow-2xl scale-105' : 'bg-white/5 border-white/10 text-slate-500'}`}
           >
              <span className="material-icons text-5xl">{includeSloka ? 'verified' : 'circle'}</span>
              శ్లోకముతో (With Sloka)
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
          <button onClick={() => handleGenerate('TEMPLATE')} disabled={loading} className="py-12 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 text-white font-black rounded-[4rem] text-4xl shadow-2xl hover:brightness-110 active:scale-95 transition-all border-b-[20px] border-orange-950 uppercase tracking-widest flex items-center justify-center gap-6">
            {loading && viewMode === 'POSTER' ? <span className="animate-spin material-icons">sync</span> : null}
            {loading && viewMode === 'POSTER' ? researchStep : 'GENERATE 8K POSTER'}
          </button>
          <button onClick={() => handleGenerate('STORY')} disabled={loading} className="py-12 bg-slate-900 text-white font-black rounded-[4rem] text-4xl shadow-xl hover:bg-slate-800 active:scale-95 transition-all border-b-[20px] border-black border border-white/5 uppercase tracking-widest flex items-center justify-center gap-6">
            {loading && viewMode === 'STORY' ? <span className="animate-spin material-icons">sync</span> : null}
            {loading && viewMode === 'STORY' ? researchStep : 'GENERATE 1000W STORY'}
          </button>
        </div>
      </div>

      {/* Result Display Area */}
      <div id="result-area" className="w-full mt-20">
        {post && !loading && (
          <div className="w-full flex flex-col items-center gap-24">
            {viewMode === 'POSTER' ? (
              <div className="w-full max-w-[900px] animate-in zoom-in-95 duration-1000 relative">
                <div id="divine-poster" className="w-full aspect-[9/16] bg-[#020617] overflow-hidden flex flex-col relative shadow-[0_150px_300px_rgba(0,0,0,1)] border-[6px] border-[#FFD700]/30 rounded-3xl">
                  {/* High Quality Background with Cinematic Glow */}
                  <div className="absolute inset-0 opacity-[0.7] mix-blend-overlay scale-110" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1080&h=1920&fit=crop&q=80&sig=${post.backgroundKeyword}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/95"></div>

                  {/* Header: Title and QR - Borderless Clean */}
                  <div className="p-16 pb-4 flex justify-between items-start relative z-10">
                     <div className="flex-1 space-y-4">
                        <h1 className="text-[64px] font-black tiro text-[#FFD700] leading-none drop-shadow-[0_8px_20px_rgba(0,0,0,1)] tracking-tighter uppercase line-clamp-2">{post.title}</h1>
                        <p className="text-white font-bold text-3xl tiro italic opacity-90 drop-shadow-xl">{post.subtitle}</p>
                     </div>
                     <div className="w-36 h-36 flex items-center justify-center transform rotate-2">
                        <img src={post.qrUrl} className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_20px_#FFD700]" alt="QR" />
                     </div>
                  </div>

                  {/* Main Matter: Profound Insight from Rishi */}
                  <div className="flex-1 px-14 flex flex-col items-center justify-center relative z-10 text-center">
                     <div className="w-full bg-[#0f172a]/95 border-[10px] border-[#FFD700]/15 rounded-[5rem] p-14 flex flex-col items-center justify-center relative shadow-[inset_0_0_200px_rgba(0,0,0,0.8)] overflow-hidden">
                        {post.sloka && (
                          <div className="mb-14 w-full px-8">
                            <p className="text-[38px] font-black text-[#FFD700] leading-tight tiro italic px-10 py-10 border-y-4 border-[#FFD700]/20 tracking-tight bg-white/5 rounded-[3rem] shadow-inner italic">ॐ {post.sloka} ॐ</p>
                          </div>
                        )}
                        <p className="text-white text-[48px] leading-[1.8] tiro font-black whitespace-pre-line px-6 drop-shadow-[0_10px_30px_rgba(0,0,0,1)] tracking-tight">
                           {post.body}
                        </p>
                        <span className="absolute -bottom-24 -right-24 text-[#FFD700]/5 text-[450px] leading-none pointer-events-none transform rotate-12">ॐ</span>
                     </div>
                  </div>

                  {/* Divine Slogan Center */}
                  <div className="px-16 py-10 relative z-10">
                     <div className="bg-gradient-to-r from-red-950 via-orange-600 to-red-950 rounded-[3rem] py-8 px-14 flex items-center justify-center shadow-3xl border-2 border-[#FFD700]/40">
                        <h4 className="text-white font-black text-4xl tiro uppercase tracking-[0.4em] drop-shadow-2xl leading-none">
                          ⛳ {post.slogan} ⛳
                        </h4>
                     </div>
                  </div>

                  {/* Footer: Ultra-Clean Professional Branding */}
                  <div className="p-14 bg-black/80 backdrop-blur-3xl flex items-center justify-between relative z-10 border-t-[12px] border-[#FFD700]/40 shadow-[0_-40px_100px_rgba(0,0,0,0.8)]">
                     <div className="flex items-center gap-12">
                        <div className="w-32 h-32 rounded-3xl border-[8px] border-[#FFD700] overflow-hidden shadow-2xl bg-orange-950 transform -rotate-2">
                           {post.authorPhotoUrl ? <img src={post.authorPhotoUrl} className="w-full h-full object-cover" /> : <span className="material-icons text-9xl text-white/20 p-6">person</span>}
                        </div>
                        <div className="leading-none space-y-4">
                           <h2 className="text-[#FFD700] font-black text-[56px] tiro uppercase tracking-tighter drop-shadow-2xl">{post.authorName}</h2>
                           <p className="text-white/80 font-bold text-2xl tiro uppercase tracking-[0.2em]">{post.authorRole}</p>
                           <div className="flex items-center gap-4 text-white/40 text-xl font-black tiro italic mt-4">
                             <span className="material-icons text-2xl">location_on</span>
                             {post.location}
                           </div>
                        </div>
                     </div>
                     <div className="bg-[#10b981] flex flex-col items-center gap-2 px-10 py-6 rounded-[3rem] border-2 border-white/20 shadow-2xl transition-all group scale-110">
                        <div className="flex items-center gap-4">
                          <span className="material-icons text-white text-4xl group-hover:rotate-12 transition-transform">phone_in_talk</span>
                          <span className="text-white font-black text-5xl cinzel tracking-tighter leading-none">{post.authorPhone}</span>
                        </div>
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Direct Connect</span>
                     </div>
                  </div>
                </div>
                
                {/* 8K Export Controls */}
                <div className="flex gap-8 mt-20 w-full no-print">
                  <button onClick={handleDownloadImage} className="flex-1 py-12 bg-orange-600 text-white rounded-[4rem] font-black text-4xl shadow-3xl border-b-[20px] border-orange-950 active:scale-95 transition-all flex items-center justify-center gap-8 group">
                    <span className="material-icons text-7xl group-hover:scale-125 transition-transform">download_for_offline</span>
                    SAVE IMAGE (JPG 8K)
                  </button>
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.whatsappFormat)}`, '_blank')} className="px-24 py-12 bg-[#25D366] text-white rounded-[4rem] font-black text-4xl shadow-3xl border-b-[20px] border-[#128C7E] active:scale-95 transition-all flex items-center justify-center gap-8 group">
                    <span className="material-icons text-8xl group-hover:animate-bounce">whatsapp</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Story Mode: Long Form Detailed Library Archive */
              <div className="w-full max-w-6xl bg-[#0f172a] border-[25px] border-white/5 rounded-[7rem] p-24 md:p-40 shadow-2xl space-y-24 animate-in slide-in-from-bottom-20 duration-1000 relative overflow-hidden">
                <div className="absolute top-0 left-0 p-20 opacity-[0.05] pointer-events-none">
                   <span className="material-icons text-[40rem] text-orange-500">history_edu</span>
                </div>
                <header className="border-b-[6px] border-[#FFD700]/30 pb-20 relative z-10 text-center">
                  <h3 className="text-[120px] font-black tiro text-[#FFD700] tracking-tighter drop-shadow-2xl mb-8 leading-none">{post.title}</h3>
                  <div className="inline-block px-14 py-6 bg-orange-600/20 rounded-full border-2 border-orange-500/40 shadow-xl">
                    <p className="text-orange-400 font-bold text-4xl tiro italic tracking-widest">{post.subtitle}</p>
                  </div>
                </header>
                <div className="p-20 bg-black/60 rounded-[6rem] border-2 border-white/5 relative z-10 overflow-hidden shadow-inner">
                  <p className="text-white tiro text-[48px] leading-[2.5] font-black text-justify whitespace-pre-line tracking-tight relative z-10 drop-shadow-xl">{post.body}</p>
                </div>
                <div className="p-20 border-l-[50px] border-orange-600 bg-orange-600/10 rounded-r-[6rem] relative z-10 shadow-2xl space-y-10">
                  <div className="flex items-center gap-10">
                    <span className="material-icons text-8xl text-orange-500">verified</span>
                    <h4 className="text-3xl font-black text-orange-400 uppercase tracking-[0.8em]">Maharshi Rahasya</h4>
                  </div>
                  <p className="text-white tiro text-[72px] font-black italic leading-tight drop-shadow-2xl">"{post.conclusion}"</p>
                </div>
                <button onClick={() => window.print()} className="w-full py-12 bg-slate-900 text-white rounded-[4rem] font-black text-5xl cinzel uppercase no-print border-b-[20px] border-black hover:bg-black transition-all">Print Sacred Manuscript</button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          #divine-poster { 
            width: 1080px !important; 
            height: 1920px !important;
            max-width: none !important;
            aspect-ratio: 9/16 !important;
            box-shadow: none !important;
            transform: none !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
          }
          body { 
            background: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          @page {
            size: 1080px 1920px;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PostGenerator;
