
import React, { useState, useMemo, useEffect } from 'react';
import { generateSpiritualPost } from '../services/geminiService';
import { PostContent, AppTab, Branding, OutputMode } from '../types';
import { SCRIPTURES, MAHARSHIS_LIST, TEMPLES_LIST, FESTIVALS_LIST, SPECIAL_DAYS_LIST, VASTU_LIST } from '../constants';

interface PostGeneratorProps {
  mode: AppTab;
}

const PostGenerator: React.FC<PostGeneratorProps> = ({ mode }) => {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<PostContent | null>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [nodeSearch, setNodeSearch] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isRahasyaMode, setIsRahasyaMode] = useState(true);
  const [outputMode, setOutputMode] = useState<OutputMode>('STORY');
  const [researchStep, setResearchStep] = useState('');

  // Voice Interaction Logic
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = 'te-IN';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTopic(prev => (prev.trim() + ' ' + transcript).trim());
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  }

  const toggleListening = () => {
    if (!recognition) { alert("వాయిస్ సపోర్ట్ లేదు."); return; }
    if (isListening) recognition.stop(); 
    else { setIsListening(true); recognition.start(); }
  };

  const getBranding = (): Branding => {
    const saved = localStorage.getItem('dharma_branding');
    return saved ? JSON.parse(saved) : {
      name: 'శ్రీ వెంకట సాయి',
      phone: '+91 94924 60254',
      role: 'జ్యోతిష్య నిపుణులు & ఆధ్యాత్మిక సలహాదారులు',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://chat.whatsapp.com/sample',
      groupName: 'శ్రీ సనాతన ధర్మ గ్రూప్'
    };
  };

  const currentList = useMemo(() => {
    let items: any[] = [];
    if (mode === AppTab.GENERATOR) items = SCRIPTURES;
    else if (mode === AppTab.MAHARSHIS) items = MAHARSHIS_LIST;
    else if (mode === AppTab.TEMPLES) items = TEMPLES_LIST;
    else if (mode === AppTab.PANDUGALU) items = FESTIVALS_LIST;
    else if (mode === AppTab.SPECIAL_DAYS) items = SPECIAL_DAYS_LIST;
    else if (mode === AppTab.VASTU) items = VASTU_LIST;
    
    if (nodeSearch) {
      return items.filter(i => (i.name || i.teluguName).toLowerCase().includes(nodeSearch.toLowerCase()));
    }
    return items;
  }, [mode, nodeSearch]);

  const presets = {
    [AppTab.GENERATOR]: ['ఋగ్వేద సూక్తుల అంతరార్థం', 'మంత్ర సాధన విధి - నిబద్ధత', 'పంచ భూతాల సమతుల్యత'],
    [AppTab.PANDUGALU]: ['సంక్రాంతి శాస్త్రీయ విశిష్టత', 'పూజా విధానం (వరం కోసం)', 'పండుగలలో నిషిద్ధ క్రియలు'],
    [AppTab.SPECIAL_DAYS]: ['ఏకాదశి ఉపవాస శాస్త్రీయ కారణం', 'ప్రదోష కాల శివార్చన వైభవం', 'నేటి గ్రహ గమనం - ప్రభావం'],
    [AppTab.VASTU]: ['ఈశాన్య మూల - ప్రాముఖ్యత', 'ఆగ్నేయం లో వంటగది ఎందుకు?', 'వాస్తు పురుష మండలం అంటే ఏమిటి?', 'నైరుతి దోష నివారణ ఎలా?', 'బ్రహ్మ స్థానం నియమాలు'],
    [AppTab.MORAL_STORIES]: ['పంచతంత్రం: మిత్రభేదం నీతి', 'వివేకానంద గారి ఆత్మవిశ్వాస కథ', 'తేనాలి రామకృష్ణ చతురత', 'పరమానందయ్య శిష్యుల విజ్ఞానం'],
    [AppTab.KIDS_STORIES]: ['బాల కృష్ణుడు మరియు కాళియుడు', 'హనుమంతుడు సూర్యుడిని మింగడం', 'చిన్నారి గణపతి యొక్క వినయం', 'ప్రహ్లాదుని భక్తి మార్గం']
  };

  useEffect(() => {
    if (!selectedId && currentList.length > 0) setSelectedId(currentList[0].id);
  }, [currentList, mode]);

  const handleGenerate = async (suggestedTopic?: string) => {
    if (suggestedTopic) {
      setSelectedId(''); 
    }
    const finalTopic = suggestedTopic || topic;
    if (!finalTopic && !selectedId) {
      alert("దయచేసి ఒక అంశాన్ని ఎంచుకోండి.");
      return;
    }

    setLoading(true);
    const steps = [
      "ప్రాచీన గ్రంథాల పరిశీలన...",
      "వాస్తు/ధర్మ సూత్రాల అన్వేషణ...",
      "నిజమైన ఆధారాల సేకరణ...",
      "శబ్ద విశ్లేషణ మరియు తెలుగు అనువాదం...",
      "దివ్య జ్ఞాన ఆవిష్కరణ..."
    ];
    let stepIndex = 0;
    const interval = setInterval(() => {
      setResearchStep(steps[stepIndex % steps.length]);
      stepIndex++;
    }, 2500);

    try {
      const b = getBranding();
      const selectedItem = currentList.find(item => item.id === selectedId);
      let context = selectedItem ? (selectedItem.name || selectedItem.teluguName) : mode;
      
      const res = await generateSpiritualPost(
        finalTopic || context, 
        context, 
        true, 
        false, 
        isRahasyaMode, 
        outputMode
      );

      setPost({
        ...res,
        authorName: b.name,
        authorPhone: b.phone,
        authorRole: b.role,
        qrUrl: b.qrUrl,
        authorPhotoUrl: b.photoUrl,
        groupName: b.groupName,
        isRahasya: isRahasyaMode
      });
    } catch (e) {
      alert("కాస్మిక్ సర్వర్ ఎర్రర్. మళ్ళీ ప్రయత్నించండి.");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setResearchStep('');
    }
  };

  const divineSuggestion = () => {
    const list = presets[mode as keyof typeof presets] || presets[AppTab.GENERATOR];
    const random = list[Math.floor(Math.random() * list.length)];
    handleGenerate(random);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-16 items-start pb-60">
      
      {/* 1. CONTROL PANEL */}
      <div className="lg:col-span-6 space-y-12 animate-in slide-in-from-left duration-1000">
        <div className="bg-white border-8 border-orange-100 rounded-[5rem] p-12 shadow-[0_60px_120px_rgba(139,69,19,0.1)] relative overflow-hidden">
          
          <header className="mb-12 border-b-4 border-orange-50 pb-8 flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="text-center md:text-left">
                <span className="text-xl font-black text-orange-600 bg-orange-50 px-8 py-2 rounded-full uppercase tracking-[0.5em]">{mode} పరిశోధన</span>
                <h3 className="text-6xl font-black tiro text-orange-800 mt-4 leading-none uppercase">వైదిక జ్ఞాన కేంద్రం</h3>
             </div>
             <div className="flex bg-orange-50 p-2 rounded-[3rem] border-4 border-orange-100 shadow-inner">
                <button onClick={() => setOutputMode('STORY')} className={`px-10 py-4 rounded-[2.5rem] font-black text-2xl transition-all ${outputMode === 'STORY' ? 'bg-orange-600 text-white shadow-2xl scale-105' : 'text-orange-900 hover:bg-orange-200'}`}>కథనం (Deep)</button>
                <button onClick={() => setOutputMode('TEMPLATE')} className={`px-10 py-4 rounded-[2.5rem] font-black text-2xl transition-all ${outputMode === 'TEMPLATE' ? 'bg-orange-600 text-white shadow-2xl scale-105' : 'text-orange-900 hover:bg-orange-200'}`}>పోస్టర్ (Real)</button>
             </div>
          </header>

          <div className="space-y-12">
            {/* SEARCH & SELECTOR */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-orange-50 px-8 py-4 rounded-[3rem] border-2 border-orange-100">
                 <span className="material-icons text-orange-400">search</span>
                 <input type="text" value={nodeSearch} onChange={e => setNodeSearch(e.target.value)} placeholder="విషయాన్ని వెతకండి..." className="bg-transparent border-none outline-none text-2xl font-black tiro w-full text-orange-900" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[400px] overflow-y-auto custom-scroll p-4">
                {currentList.map(item => (
                  <button key={item.id} onClick={() => setSelectedId(item.id)} className={`flex flex-col items-center gap-4 p-8 rounded-[3.5rem] border-4 transition-all duration-500 relative group ${selectedId === item.id ? 'bg-orange-500 border-orange-700 shadow-2xl scale-110 z-10' : 'bg-orange-50 border-white hover:border-orange-200 hover:bg-white'}`}>
                    {selectedId === item.id && <span className="absolute top-6 right-6 text-white material-icons animate-bounce">verified</span>}
                    <span className={`text-7xl transition-transform duration-1000 ${selectedId === item.id ? 'scale-110' : 'opacity-40 group-hover:opacity-100'}`}>{item.icon}</span>
                    <span className={`text-xl font-black tiro text-center leading-tight ${selectedId === item.id ? 'text-white' : 'text-orange-900'}`}>{item.name || item.teluguName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT & VOICE */}
            <div className="space-y-8">
               <div className="flex justify-between items-end px-4">
                  <label className="text-2xl font-black text-orange-600 uppercase tracking-widest pl-4 border-l-8 border-orange-500">పరిశోధనా అంశం</label>
                  <button onClick={toggleListening} className={`flex items-center gap-4 px-10 py-5 rounded-full font-black text-2xl transition-all shadow-lg ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}>
                    <span className="material-icons text-4xl">{isListening ? 'mic' : 'mic_none'}</span>
                    {isListening ? 'వింటోంది...' : 'దివ్య వాని'}
                  </button>
               </div>
               <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="విషయాన్ని ఇక్కడ వివరించండి (ఉదా: ఈశాన్య దోష నివారణ)..." className="w-full bg-orange-50/50 border-8 border-orange-100 rounded-[5rem] p-16 text-5xl tiro outline-none focus:border-orange-500 focus:bg-white transition-all min-h-[350px] shadow-inner text-orange-950" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="bg-orange-50/30 p-10 rounded-[4rem] space-y-8 shadow-sm">
                  <p className="text-center font-black uppercase text-orange-400 tracking-[0.5em] border-b-2 border-orange-100 pb-4">ధర్మ సూచనలు (Real Q&A)</p>
                  <div className="flex flex-col gap-4">
                     <button onClick={divineSuggestion} className="w-full py-6 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[2.5rem] font-black text-3xl tiro shadow-xl flex items-center justify-center gap-6 hover:brightness-110 active:scale-95 transition-all">
                        <span className="material-icons text-5xl">manage_search</span>
                        పరిశోధనా సూచన (Auto Pick)
                     </button>
                     <div className="grid grid-cols-1 gap-4">
                        {(presets[mode as keyof typeof presets] || presets[AppTab.GENERATOR]).slice(0, 3).map(t => (
                          <button key={t} onClick={() => handleGenerate(t)} className="px-8 py-5 bg-white border-4 border-orange-100 rounded-[2rem] text-2xl font-black text-orange-900 hover:bg-orange-600 hover:text-white transition-all tiro shadow-md text-left">
                            {t}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
               <div className="flex flex-col gap-8 justify-end">
                  <button onClick={() => setIsRahasyaMode(!isRahasyaMode)} className={`w-full py-8 rounded-[3rem] font-black text-2xl tracking-[0.5em] border-8 transition-all ${isRahasyaMode ? 'bg-orange-950 text-white border-black shadow-2xl' : 'bg-orange-100 text-orange-800 border-orange-200'}`}>
                    {isRahasyaMode ? 'RAHASYA MODE: ON' : 'STANDARD MODE: ON'}
                  </button>
                  <button onClick={() => handleGenerate()} disabled={loading} className="w-full py-20 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black rounded-[5rem] text-6xl shadow-[0_40px_80px_rgba(234,88,12,0.4)] hover:brightness-110 active:scale-95 transition-all cinzel border-b-[24px] border-orange-900 uppercase tracking-[1em] relative overflow-hidden">
                    {loading ? (
                      <div className="flex flex-col items-center">
                         <span className="animate-pulse">DIVINING...</span>
                         <span className="text-2xl mt-4 tiro normal-case tracking-normal">{researchStep}</span>
                      </div>
                    ) : 'సృష్టించు (Real)'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. OUTPUT PREVIEW */}
      <div className="lg:col-span-6 sticky top-20 flex flex-col items-center gap-12">
        <div className="px-16 py-8 bg-orange-600 text-white rounded-full flex items-center gap-8 shadow-2xl border-4 border-orange-400">
           <span className="material-icons text-5xl">auto_stories</span>
           <span className="text-3xl font-black uppercase tracking-[1em]">DEEP RESEARCH MANIFESTO</span>
        </div>
        
        {post ? (
          <div className="w-full max-w-[1000px] space-y-12 animate-in zoom-in-95 duration-1000">
            <div className={`w-full bg-white rounded-[10rem] overflow-hidden relative shadow-[0_150px_300px_rgba(139,69,19,0.3)] border-[50px] border-orange-50 flex flex-col p-24 ${outputMode === 'STORY' ? 'min-h-[1600px]' : 'aspect-[9/16]'}`}>
              
              <div className="flex justify-between items-start border-b-[16px] border-orange-600 pb-16 mb-16">
                 <div className="space-y-10 flex-1 pr-12">
                    <div className="flex items-center gap-6">
                       <span className="w-8 h-8 bg-orange-600 rounded-full animate-pulse"></span>
                       <span className="text-4xl font-black text-orange-500 uppercase tracking-[1em] block">{post.tag}</span>
                    </div>
                    <h1 className="text-orange-950 tiro font-black text-7xl leading-tight drop-shadow-2xl">{post.title}</h1>
                 </div>
                 <div className="w-64 h-64 bg-white p-6 border-[12px] border-orange-100 rounded-[5rem] shadow-2xl shrink-0">
                    <img src={post.qrUrl} className="w-full h-full object-contain" alt="QR" />
                 </div>
              </div>
              
              <div className="flex-1 space-y-24 overflow-y-auto custom-scroll-orange-pro pr-12 pb-24">
                 {post.sloka && (
                    <div className="bg-orange-50/90 border-y-[16px] border-orange-600 py-24 px-16 rounded-[6rem] text-orange-900 text-6xl italic text-center font-black shadow-inner relative">
                       {post.sloka}
                    </div>
                 )}
                 
                 <div className="space-y-20">
                   <p className="text-stone-900 tiro text-6xl leading-[2.5] text-justify font-black whitespace-pre-line border-l-[32px] border-orange-100 pl-20 py-12">
                    {post.body}
                   </p>
                 </div>

                 {post.rituals && (
                   <div className="bg-indigo-50 border-[12px] border-indigo-100 p-20 rounded-[8rem] space-y-12 shadow-inner">
                      <h4 className="cinzel text-6xl font-black text-indigo-800 border-b-4 border-indigo-200 pb-8 uppercase tracking-widest">Deep Logic (ప్రమాణ విధి)</h4>
                      <p className="tiro text-5xl leading-relaxed text-indigo-900 whitespace-pre-line font-black italic">{post.rituals}</p>
                   </div>
                 )}

                 <div className="bg-gradient-to-br from-orange-700 to-amber-700 p-24 rounded-[9rem] text-white shadow-xl mt-24">
                    <h4 className="cinzel text-4xl font-black mb-8 border-b border-white/20 pb-4">శాస్త్ర నిశ్చయం (Final Conclusion)</h4>
                    <p className="tiro text-6xl leading-[2] font-black italic">
                       {post.conclusion}
                    </p>
                 </div>
              </div>

              <div className="mt-auto pt-24 border-t-[16px] border-orange-50 flex items-center justify-between">
                 <div className="flex items-center gap-16">
                    <div className="w-64 h-64 rounded-[6rem] border-[16px] border-orange-100 shadow-2xl overflow-hidden shrink-0">
                       <img src={post.authorPhotoUrl} className="w-full h-full object-cover" alt="Author" />
                    </div>
                    <div className="space-y-8">
                       <p className="text-orange-950 font-black text-8xl tiro leading-none">{post.authorName}</p>
                       <p className="text-orange-600 font-bold text-4xl uppercase tracking-[0.8em] border-l-8 border-orange-500 pl-10 leading-none">{post.authorRole}</p>
                       <p className="text-orange-900 font-black text-4xl cinzel tracking-[0.2em]">{post.authorPhone}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <h2 className="text-8xl font-black cinzel text-orange-700 tracking-[0.5em]">{post.groupName}</h2>
                    <p className="text-3xl font-black uppercase tracking-[1em] text-orange-400">Deep Vedic Research</p>
                 </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 pt-8">
              <button onClick={() => { 
                navigator.clipboard.writeText(post.whatsappFormat || ''); 
                alert("Deep Research Content Copied!"); 
              }} className="w-full py-24 bg-orange-800 text-white rounded-[7rem] font-black uppercase tracking-[1em] shadow-xl text-6xl hover:scale-[1.05] transition-all border-b-[24px] border-orange-950 flex items-center justify-center gap-12">
                 <span className="material-icons text-8xl">share</span>
                 Copy Deep Link
              </button>
              <button onClick={() => window.print()} className="w-full py-24 bg-white border-[12px] border-orange-100 text-orange-700 rounded-[7rem] font-black uppercase tracking-[1em] shadow-2xl text-6xl hover:bg-orange-50 transition-all flex items-center justify-center gap-12">
                 <span className="material-icons text-8xl">print</span>
                 Download PDF
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[1000px] aspect-[9/16] bg-white border-[32px] border-dashed border-orange-100 rounded-[12rem] flex flex-col items-center justify-center p-64 text-center text-orange-100 group">
             <span className="material-icons text-[500px] mb-24 opacity-5 group-hover:scale-110 transition-all duration-5000">architecture</span>
             <p className="text-6xl font-black uppercase tracking-[2em] opacity-5">Initiate Research Cycle</p>
          </div>
        )}
      </div>

      <style>{`
        .custom-scroll-orange-pro::-webkit-scrollbar { width: 18px; }
        .custom-scroll-orange-pro::-webkit-scrollbar-thumb { background: #EA580C; border-radius: 50px; border: 6px solid #FFF; }
      `}</style>
    </div>
  );
};

export default PostGenerator;
