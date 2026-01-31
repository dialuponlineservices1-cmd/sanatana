
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.GENERATOR);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [keyError, setKeyError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the API key was successfully injected during Vite build
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "" || apiKey === "undefined") {
      setKeyError("Vercel లో API_KEY సెట్ చేసిన తర్వాత 'Redeploy' చేయడం మర్చిపోకండి.");
    }
  }, []);

  const navItems = [
    { tab: AppTab.GENERATOR, icon: 'dashboard_customize', label: 'డిజైన్ స్టూడియో', color: 'bg-orange-600' },
    { tab: AppTab.LIVE_CONSULTATION, icon: 'record_voice_over', label: 'లైవ్ కన్సల్టేషన్', color: 'bg-red-600' },
    { tab: AppTab.RAASI_PHALALU, icon: 'brightness_7', label: 'రాశి ఫలాలు', color: 'bg-purple-700' },
    { tab: AppTab.NUMEROLOGY, icon: 'calculate', label: 'సంఖ్యాశాస్త్రం', color: 'bg-cyan-700' },
    { tab: AppTab.NITHI_KATHALU, icon: 'balance', label: 'నీతి కథలు', color: 'bg-amber-700' },
    { tab: AppTab.PILLALA_KATHALU, icon: 'child_care', label: 'పిల్లల కథలు', color: 'bg-emerald-600' },
    { tab: AppTab.MOTIVATIONAL_KATHALU, icon: 'bolt', label: 'స్ఫూర్తి కథలు', color: 'bg-rose-700' },
    { tab: AppTab.PANDUGALU, icon: 'festival', label: 'పండుగలు - విశేషాలు', color: 'bg-pink-600' },
    { tab: AppTab.PANCHANGAM, icon: 'calendar_month', label: 'పంచాంగం', color: 'bg-yellow-600' },
    { tab: AppTab.SAMSAYA_SAMADHANAM, icon: 'psychology_alt', label: 'ధర్మ సందేహం', color: 'bg-indigo-700' },
    { tab: AppTab.RISHI_HUB, icon: 'history_edu', label: 'మహర్షి విజ్ఞానం', color: 'bg-emerald-700' },
    { tab: AppTab.LIBRARY, icon: 'menu_book', label: 'గ్రంథాలయం', color: 'bg-indigo-600' },
    { tab: AppTab.AI_CHAT, icon: 'chat_bubble', label: 'ఋషి AI చాట్', color: 'bg-sky-600' },
    { tab: AppTab.BRANDING, icon: 'settings', label: 'ప్రొఫైల్ సెట్టింగ్స్', color: 'bg-slate-600' }
  ];

  if (keyError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#020617] p-10 text-center space-y-12">
        <div className="w-40 h-40 bg-red-600 rounded-[3rem] flex items-center justify-center shadow-2xl animate-pulse">
          <span className="material-icons text-white text-[100px]">error_outline</span>
        </div>
        <h1 className="text-7xl font-black tiro text-white leading-tight">API కీ లోపం! (Configuration Error)</h1>
        <p className="text-slate-400 text-3xl tiro max-w-4xl bg-white/5 p-10 rounded-[3rem] border border-white/10">
          {keyError}<br/><br/>
          <span className="text-orange-500 font-black">పరిష్కారం:</span> Vercel Dashboard -> Deployments -> (...) క్లిక్ చేయండి -> <span className="underline italic">Redeploy</span> సెలెక్ట్ చేయండి.
        </p>
        <div className="flex gap-8">
           <button onClick={() => window.location.reload()} className="px-16 py-8 bg-slate-800 text-white rounded-full font-black cinzel text-3xl hover:bg-slate-700 transition-all">REFRESH PAGE</button>
           <a href="https://vercel.com" target="_blank" className="px-16 py-8 bg-orange-600 text-white rounded-full font-black cinzel text-3xl shadow-2xl hover:bg-orange-500 transition-all border-b-[16px] border-orange-950">GO TO VERCEL</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <aside className={`${isSidebarOpen ? 'w-[420px]' : 'w-24'} bg-[#0f172a] border-r border-slate-800 transition-all duration-500 flex flex-col z-30 shadow-[20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden`}>
        <div className="p-10 flex items-center gap-6 border-b border-slate-800/50 bg-[#1e293b]/30">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
            <span className="material-icons text-white text-3xl">token</span>
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="cinzel font-black text-2xl text-orange-500 tracking-tighter leading-none whitespace-nowrap">BHASKARA PRO</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">INTERNAL STUDIO HUB</p>
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
                  ? `${item.color} text-white shadow-xl scale-[1.02] font-black` 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className={`material-icons text-3xl ${activeTab === item.tab ? 'text-white' : 'text-slate-500 group-hover:text-orange-400'}`}>{item.icon}</span>
              {isSidebarOpen && <span className="tiro text-xl whitespace-nowrap">{item.label}</span>}
              {activeTab === item.tab && <div className="absolute left-0 w-1.5 h-8 bg-white rounded-full"></div>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#020617]">
        <header className="h-24 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-10 z-20 shadow-lg">
          <div className="flex items-center gap-8">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 p-4 hover:bg-slate-800 rounded-2xl transition-all">
              <span className="material-icons text-5xl">{isSidebarOpen ? 'keyboard_double_arrow_left' : 'keyboard_double_arrow_right'}</span>
            </button>
            <div className="h-10 w-px bg-slate-800"></div>
            <h2 className="text-3xl font-black tiro text-slate-100 uppercase tracking-tighter">
              {navItems.find(i => i.tab === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-8">
             <div className="flex flex-col items-end">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">BHASKARA PRO STUDIO</p>
                <p className="text-xl font-black text-orange-500 cinzel">v5.0.1-VEE LIVE</p>
             </div>
             <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-500 shadow-inner">
                <span className="material-icons text-3xl">record_voice_over</span>
             </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-12 relative custom-scroll bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]">
          <div className="max-w-[1800px] mx-auto">
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
