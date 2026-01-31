
import React, { useState, useEffect } from 'react';
import { AppTab } from './types';
import PostGenerator from './components/PostGenerator';
import ScriptureLibrary from './components/ScriptureLibrary';
import DailyPanchangam from './components/DailyPanchangam';
import AIChat from './components/AIChat';
import BrandingSettings from './components/BrandingSettings';
import SamsayaSolver from './components/SamsayaSolver';
import RishiHub from './components/RishiHub';
import RaasiPhalalu from './components/RaasiPhalalu';
import NumerologyHub from './components/NumerologyHub';
import LiveConsultation from './components/LiveConsultation';
import { validateApiKey, getApiKey } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.GENERATOR);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      const currentKey = getApiKey();
      if (currentKey && currentKey !== "") {
        const valid = await validateApiKey(currentKey);
        setIsKeyValid(valid);
      } else {
        setIsKeyValid(false);
      }
    };
    
    checkKey();
    const interval = setInterval(checkKey, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEnterKey = async () => {
    // 1. Try Platform Dialog
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      try {
        await window.aistudio.openSelectKey();
        setTimeout(() => window.location.reload(), 1000);
        return;
      } catch (err) {}
    }

    // 2. Fallback for Vercel/External: Manual Prompt
    const manualKey = window.prompt("Gemini API Key ఎంటర్ చేయండి (Enter your Gemini API Key):");
    if (manualKey) {
      localStorage.setItem('internal_api_key', manualKey.trim());
      const valid = await validateApiKey(manualKey.trim());
      if (valid) {
        setIsKeyValid(true);
        window.location.reload();
      } else {
        alert("Invalid API Key. దయచేసి సరైన కీని ఎంటర్ చేయండి.");
        localStorage.removeItem('internal_api_key');
      }
    }
  };

  const navItems = [
    { tab: AppTab.GENERATOR, icon: 'auto_awesome', label: 'డిజైన్ స్టూడియో', color: 'bg-orange-600' },
    { tab: AppTab.LIVE_CONSULTATION, icon: 'settings_voice', label: 'లైవ్ కన్సల్టేషన్', color: 'bg-red-600' },
    { tab: AppTab.RAASI_PHALALU, icon: 'brightness_7', label: 'రాశి ఫలాలు', color: 'bg-purple-700' },
    { tab: AppTab.NUMEROLOGY, icon: 'calculate', label: 'సంఖ్యాశాస్త్రం', color: 'bg-cyan-700' },
    { tab: AppTab.NITHI_KATHALU, icon: 'menu_book', label: 'నీతి కథలు', color: 'bg-amber-700' },
    { tab: AppTab.PILLALA_KATHALU, icon: 'face', label: 'పిల్లల కథలు', color: 'bg-emerald-600' },
    { tab: AppTab.MOTIVATIONAL_KATHALU, icon: 'bolt', label: 'స్ఫూర్తి కథలు', color: 'bg-rose-700' },
    { tab: AppTab.PANDUGALU, icon: 'festival', label: 'పండుగలు - విశేషాలు', color: 'bg-pink-600' },
    { tab: AppTab.PANCHANGAM, icon: 'event_note', label: 'పంచాంగం', color: 'bg-yellow-600' },
    { tab: AppTab.SAMSAYA_SAMADHANAM, icon: 'psychology', label: 'ధర్మ సందేహం', color: 'bg-indigo-700' },
    { tab: AppTab.RISHI_HUB, icon: 'history_edu', label: 'మహర్షి విజ్ఞానం', color: 'bg-emerald-700' },
    { tab: AppTab.LIBRARY, icon: 'local_library', label: 'గ్రంథాలయం', color: 'bg-indigo-600' },
    { tab: AppTab.AI_CHAT, icon: 'forum', label: 'ఋషి AI చాట్', color: 'bg-sky-600' },
    { tab: AppTab.BRANDING, icon: 'badge', label: 'ప్రొఫైల్ సెట్టింగ్స్', color: 'bg-slate-600' }
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <aside className={`${isSidebarOpen ? 'w-[380px]' : 'w-24'} bg-[#0f172a] border-r border-white/5 transition-all duration-300 flex flex-col z-30 shadow-[10px_0_40px_rgba(0,0,0,0.6)]`}>
        <div className="p-8 flex items-center gap-6 border-b border-white/5 bg-[#1e293b]/30">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-red-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl shrink-0 group hover:rotate-6 transition-transform">
            <span className="material-icons text-white text-4xl">temple_hindu</span>
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden animate-in fade-in slide-in-from-left-4">
              <h1 className="cinzel font-black text-2xl text-orange-500 tracking-tighter leading-none whitespace-nowrap uppercase">Bhaskara Hub</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Internal Studio Pro</p>
            </div>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scroll">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-6 px-6 py-4 rounded-2xl transition-all w-full group relative ${
                activeTab === item.tab 
                  ? `${item.color} text-white shadow-[0_12px_24px_rgba(0,0,0,0.4)] font-black scale-[1.02]` 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <span className={`material-icons text-3xl ${activeTab === item.tab ? 'text-white' : 'text-slate-500 group-hover:text-orange-400'}`}>{item.icon}</span>
              {isSidebarOpen && <span className="tiro text-xl whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
              {activeTab === item.tab && <div className="absolute left-0 w-2 h-10 bg-white/40 rounded-full"></div>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#020617]">
        <header className="h-24 bg-[#0f172a]/95 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-12 z-20 shadow-2xl">
          <div className="flex items-center gap-10">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 p-3 hover:bg-white/5 rounded-2xl transition-all">
              <span className="material-icons text-5xl">{isSidebarOpen ? 'keyboard_double_arrow_left' : 'menu'}</span>
            </button>
            <div className="h-10 w-px bg-white/10 hidden md:block"></div>
            <h2 className="text-3xl font-black tiro text-slate-100 uppercase tracking-tighter flex items-center gap-5">
              <span className="material-icons text-orange-500">star_rate</span>
              {navItems.find(i => i.tab === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-10">
             <button 
               onClick={handleEnterKey}
               className={`flex items-center gap-5 px-10 py-4 rounded-full border-2 transition-all active:scale-95 group relative overflow-hidden ${
                 isKeyValid 
                  ? 'bg-emerald-500/10 border-emerald-500/40 hover:bg-emerald-500/20' 
                  : 'bg-orange-500/10 border-orange-500/40 hover:bg-orange-500/20 animate-pulse'
               }`}
             >
                <div className={`w-4 h-4 rounded-full ${isKeyValid ? 'bg-emerald-500 shadow-[0_0_20px_#10b981]' : 'bg-orange-500 shadow-[0_0_20px_#f59e0b]'}`}></div>
                <div className="text-left relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none text-slate-500 mb-1">Status: {isKeyValid ? 'Active' : 'Setup'}</p>
                  <p className="text-xl font-black uppercase tracking-tight text-white">ENTER API KEY</p>
                </div>
                <span className="material-icons text-4xl text-slate-400 group-hover:text-amber-500 transition-colors">key</span>
             </button>
             
             <div className="flex flex-col items-end leading-none border-l border-white/10 pl-10 hidden lg:flex">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">BHASKARA HUB</p>
                <p className="text-2xl font-black text-orange-500 cinzel tracking-tighter leading-none">PRO EDITION</p>
             </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-12 relative custom-scroll bg-gradient-to-br from-[#020617] via-[#0b1222] to-[#020617]">
          <div className="max-w-[1700px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            {activeTab === AppTab.LIVE_CONSULTATION && <LiveConsultation />}
            {activeTab === AppTab.RAASI_PHALALU && <RaasiPhalalu />}
            {activeTab === AppTab.NUMEROLOGY && <NumerologyHub />}
            {(activeTab === AppTab.GENERATOR || 
              activeTab === AppTab.DHARMA_HUB || 
              activeTab === AppTab.SANATANA_DHARMA || 
              activeTab === AppTab.VASTU || 
              activeTab === AppTab.NITHI_KATHALU || 
              activeTab === AppTab.PILLALA_KATHALU || 
              activeTab === AppTab.MOTIVATIONAL_KATHALU || 
              activeTab === AppTab.PANDUGALU) && (
              <PostGenerator mode={activeTab} />
            )}
            {activeTab === AppTab.SAMSAYA_SAMADHANAM && <SamsayaSolver />}
            {activeTab === AppTab.RISHI_HUB && <RishiHub />}
            {activeTab === AppTab.LIBRARY && <ScriptureLibrary />}
            {activeTab === AppTab.PANCHANGAM && <DailyPanchangam />}
            {activeTab === AppTab.AI_CHAT && <AIChat />}
            {activeTab === AppTab.BRANDING && <BrandingSettings />}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
