
import React, { useState, useEffect, useRef } from 'react';
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
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const lastKeyRef = useRef<string>("");

  useEffect(() => {
    const checkKey = async () => {
      const currentKey = getApiKey();
      if (currentKey !== lastKeyRef.current) {
        lastKeyRef.current = currentKey;
        if (currentKey && currentKey.length > 10) {
          const valid = await validateApiKey(currentKey);
          setIsKeyValid(valid);
        } else {
          setIsKeyValid(false);
        }
      }
    };
    checkKey();
    const interval = setInterval(checkKey, 20000);
    return () => clearInterval(interval);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '915451') {
      setIsUnlocked(true);
      localStorage.setItem('hub_access_v2', 'true');
    } else {
      alert("తప్పు పాస్‌వర్డ్! దయచేసి సరైన కోడ్ ఎంటర్ చేయండి.");
    }
  };

  useEffect(() => {
    if (localStorage.getItem('hub_access_v2') === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleEnterKey = async () => {
    const manualKey = window.prompt("Gemini API Key ఎంటర్ చేయండి:");
    if (manualKey) {
      localStorage.setItem('internal_api_key', manualKey.trim());
      window.location.reload();
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#020617] text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#020617_100%)] opacity-50"></div>
        <div className="max-w-xl w-full bg-[#0f172a]/80 backdrop-blur-3xl border-2 border-orange-500/30 rounded-[4rem] p-16 text-center shadow-[0_50px_150px_rgba(0,0,0,0.9)] space-y-12 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
           <div className="w-32 h-32 bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(234,88,12,0.4)] transform hover:rotate-12 transition-transform">
              <span className="material-icons text-7xl text-white">lock</span>
           </div>
           <div className="space-y-4">
              <h1 className="cinzel text-5xl font-black text-orange-500 uppercase tracking-tighter">Bhaskara Private Hub</h1>
              <p className="tiro text-2xl text-slate-400">అధికారిక యాక్సెస్ కోసం పాస్‌వర్డ్ అవసరం.</p>
           </div>
           <form onSubmit={handlePasswordSubmit} className="space-y-8">
             <input 
               type="password" 
               autoFocus
               value={passwordInput} 
               onChange={e => setPasswordInput(e.target.value)}
               placeholder="••••••" 
               className="w-full bg-black/40 border-2 border-slate-800 rounded-3xl p-8 text-6xl text-center cinzel tracking-[0.5em] outline-none focus:border-orange-500 transition-all text-orange-500 placeholder:text-slate-800"
             />
             <button type="submit" className="w-full py-8 bg-orange-600 rounded-3xl font-black cinzel text-3xl uppercase tracking-widest hover:bg-orange-500 transition-all border-b-[12px] border-orange-950 shadow-2xl active:scale-95">UNLOCK HUB</button>
           </form>
           <p className="text-slate-600 font-bold tracking-[0.3em] text-sm uppercase">Secure Vedic Encryption Enabled</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { tab: AppTab.GENERATOR, icon: 'auto_awesome_mosaic', label: 'డిజైన్ స్టూడియో', color: 'bg-orange-600' },
    { tab: AppTab.RAASI_PHALALU, icon: 'brightness_high', label: 'రాశి ఫలాలు', color: 'bg-purple-700' },
    { tab: AppTab.NUMEROLOGY, icon: 'calculate', label: 'సంఖ్యాశాస్త్రం', color: 'bg-cyan-700' },
    { tab: AppTab.NITHI_KATHALU, icon: 'menu_book', label: 'నీతి కథలు', color: 'bg-amber-700' },
    { tab: AppTab.SAMSAYA_SAMADHANAM, icon: 'psychology', label: 'ధర్మ సందేహం', color: 'bg-indigo-700' },
    { tab: AppTab.RISHI_HUB, icon: 'history_edu', label: 'ఋషి విజ్ఞానం', color: 'bg-emerald-700' },
    { tab: AppTab.AI_CHAT, icon: 'forum', label: 'ఋషి AI చాట్', color: 'bg-sky-600' },
    { tab: AppTab.BRANDING, icon: 'badge', label: 'ప్రొఫైల్ సెట్టింగ్స్', color: 'bg-slate-600' }
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <aside className={`${isSidebarOpen ? 'w-[360px]' : 'w-24'} bg-[#0f172a] border-r border-white/5 transition-all duration-300 flex flex-col z-30 shadow-[10px_0_40px_rgba(0,0,0,0.6)] no-print`}>
        <div className="p-8 flex items-center gap-6 border-b border-white/5 bg-[#1e293b]/30">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 via-red-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl shrink-0">
            <span className="material-icons text-white text-3xl">temple_hindu</span>
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden animate-in fade-in slide-in-from-left-4">
              <h1 className="cinzel font-black text-xl text-orange-500 tracking-tighter leading-none whitespace-nowrap uppercase">Bhaskara Pro</h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Internal Studio 8K</p>
            </div>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scroll no-print">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-5 px-5 py-4 rounded-2xl transition-all w-full group relative ${
                activeTab === item.tab 
                  ? `${item.color} text-white shadow-xl font-black scale-[1.02]` 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <span className={`material-icons text-3xl ${activeTab === item.tab ? 'text-white' : 'text-slate-500 group-hover:text-orange-400'}`}>{item.icon}</span>
              {isSidebarOpen && <span className="tiro text-lg whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#020617]">
        <header className="h-24 bg-[#0f172a]/95 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-10 z-20 shadow-2xl no-print">
          <div className="flex items-center gap-8">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 p-3 hover:bg-white/5 rounded-xl transition-all">
              <span className="material-icons text-4xl">{isSidebarOpen ? 'keyboard_double_arrow_left' : 'menu'}</span>
            </button>
            <div className="h-10 w-px bg-white/10"></div>
            <h2 className="text-3xl font-black tiro text-slate-100 tracking-tighter uppercase">
              {navItems.find(i => i.tab === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-8">
             <button 
               onClick={handleEnterKey}
               className={`flex items-center gap-4 px-8 py-3 rounded-full border-2 transition-all active:scale-95 group relative overflow-hidden ${
                 isKeyValid 
                  ? 'bg-emerald-500/10 border-emerald-500/40' 
                  : 'bg-orange-600/10 border-orange-500/40 shadow-[0_0_30px_rgba(234,88,12,0.1)]'
               }`}
             >
                <div className={`w-3.5 h-3.5 rounded-full ${isKeyValid ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-orange-500 shadow-[0_0_15px_#f59e0b]'}`}></div>
                <div className="text-left relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] leading-none text-slate-500 mb-1">Status: {isKeyValid ? 'Online' : 'Setup'}</p>
                  <p className="text-lg font-black uppercase tracking-tight text-white">Gemini Pro</p>
                </div>
             </button>
             
             <button onClick={() => { localStorage.removeItem('hub_access_v2'); window.location.reload(); }} className="p-3 text-slate-500 hover:text-red-500 transition-colors">
                <span className="material-icons text-4xl">logout</span>
             </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6 md:p-12 relative custom-scroll">
          <div className="max-w-[1700px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            {activeTab === AppTab.RAASI_PHALALU && <RaasiPhalalu />}
            {activeTab === AppTab.NUMEROLOGY && <NumerologyHub />}
            {(activeTab === AppTab.GENERATOR || 
              activeTab === AppTab.DHARMA_HUB || 
              activeTab === AppTab.SANATANA_DHARMA || 
              activeTab === AppTab.VASTU || 
              activeTab === AppTab.NITHI_KATHALU || 
              activeTab === AppTab.PANDUGALU) && (
              <PostGenerator mode={activeTab} />
            )}
            {activeTab === AppTab.SAMSAYA_SAMADHANAM && <SamsayaSolver />}
            {activeTab === AppTab.RISHI_HUB && <RishiHub />}
            {activeTab === AppTab.AI_CHAT && <AIChat />}
            {activeTab === AppTab.BRANDING && <BrandingSettings />}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
