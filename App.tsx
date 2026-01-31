
import React, { useState, useEffect, useRef } from 'react';
import { AppTab } from './types';
import PostGenerator from './components/PostGenerator';
import DailyPanchangam from './components/DailyPanchangam';
import AIChat from './components/AIChat';
import BrandingSettings from './components/BrandingSettings';
import SamsayaSolver from './components/SamsayaSolver';
import RishiHub from './components/RishiHub';
import RaasiPhalalu from './components/RaasiPhalalu';
import NumerologyHub from './components/NumerologyHub';
import LiveConsultation from './components/LiveConsultation';
import HinduCalendarHub from './components/HinduCalendarHub';
import BhagavadGitaHub from './components/BhagavadGitaHub'; // New
import { validateApiKey, getApiKey } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.GENERATOR);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [apiKeyStatus, setApiKeyStatus] = useState<{valid: boolean | null, msg: string, color: string, source: string}>({
    valid: null, 
    msg: 'Checking API Status...', 
    color: 'text-slate-500',
    source: ''
  });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const lastKeyRef = useRef<string>("");
  const lastCheckTimeRef = useRef<number>(0);

  useEffect(() => {
    const checkKey = async (force: boolean = false) => {
      const currentKey = getApiKey();
      const now = Date.now();
      
      if (force || currentKey !== lastKeyRef.current || (now - lastCheckTimeRef.current > 600000)) {
        lastKeyRef.current = currentKey;
        lastCheckTimeRef.current = now;
        const source = "System Key";
        
        if (currentKey && currentKey.length > 10) {
          try {
            const valid = await validateApiKey(currentKey);
            if (valid) {
              setApiKeyStatus({ valid: true, msg: 'Active', color: 'text-emerald-500', source });
            } else {
              setApiKeyStatus({ valid: false, msg: 'Invalid Key', color: 'text-red-500', source });
            }
          } catch (e: any) {
            if (e.message === "API_LIMIT") {
              setApiKeyStatus({ valid: true, msg: 'Limit Reached', color: 'text-orange-500', source });
            } else {
              setApiKeyStatus({ valid: false, msg: 'Key Error', color: 'text-red-500', source });
            }
          }
        } else {
          setApiKeyStatus({ valid: false, msg: 'Key Required', color: 'text-orange-500', source });
        }
      }
    };

    checkKey(true);
    const interval = setInterval(() => checkKey(false), 300000);
    return () => clearInterval(interval);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '915451') {
      setIsUnlocked(true);
      localStorage.setItem('hub_access_v3', 'true');
    } else {
      alert("తప్పు పాస్‌వర్డ్! దయచేసి 915451 ఎంటర్ చేయండి.");
    }
  };

  useEffect(() => {
    if (localStorage.getItem('hub_access_v3') === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#020617] text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#020617_100%)] opacity-60"></div>
        <div className="max-w-xl w-full bg-[#0f172a]/90 backdrop-blur-3xl border-2 border-orange-500/30 rounded-[5rem] p-20 text-center shadow-[0_50px_200px_rgba(0,0,0,1)] space-y-16 animate-in fade-in zoom-in-95 duration-1000 relative z-10 border-b-[20px] border-orange-950">
           <div className="w-40 h-40 bg-gradient-to-br from-orange-600 to-red-600 rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(234,88,12,0.5)] transform hover:scale-110 transition-transform cursor-pointer">
              <span className="material-icons text-9xl text-white">lock_open</span>
           </div>
           <div className="space-y-6">
              <h1 className="cinzel text-6xl font-black text-orange-500 uppercase tracking-tighter">Bhaskara Hub 8K</h1>
              <p className="tiro text-3xl text-slate-400">అధికారిక యాక్సెస్ కోసం 915451 ఎంటర్ చేయండి.</p>
           </div>
           <form onSubmit={handlePasswordSubmit} className="space-y-10">
             <input 
               type="password" 
               autoFocus
               value={passwordInput} 
               onChange={e => setPasswordInput(e.target.value)}
               placeholder="••••••" 
               className="w-full bg-black/50 border-4 border-slate-800 rounded-[3rem] p-10 text-8xl text-center cinzel tracking-[0.6em] outline-none focus:border-orange-500 transition-all text-orange-500 placeholder:text-slate-900 shadow-inner"
             />
             <button type="submit" className="w-full py-10 bg-orange-600 rounded-[3rem] font-black cinzel text-4xl uppercase tracking-widest hover:bg-orange-500 transition-all border-b-[15px] border-orange-950 shadow-3xl active:scale-95">UNLOCK STUDIO</button>
           </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { tab: AppTab.GENERATOR, icon: 'auto_awesome_mosaic', label: '8K డిజైన్ స్టూడియో', color: 'bg-orange-600' },
    { tab: AppTab.BHAGAVAD_GITA, icon: 'auto_stories', label: 'భగవద్గీత (Daily)', color: 'bg-amber-600' }, // New
    { tab: AppTab.HINDU_CALENDAR, icon: 'calendar_month', label: 'హిందూ క్యాలెండర్ (Siddipet)', color: 'bg-red-700' },
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
      <aside className={`${isSidebarOpen ? 'w-[380px]' : 'w-24'} bg-[#0f172a] border-r border-white/5 transition-all duration-300 flex flex-col z-30 shadow-[10px_0_40px_rgba(0,0,0,0.6)] no-print`}>
        <div className="p-10 flex items-center gap-6 border-b border-white/5 bg-[#1e293b]/30">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-red-600 to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl shrink-0 group hover:rotate-6 transition-transform">
            <span className="material-icons text-white text-4xl">temple_hindu</span>
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden animate-in fade-in slide-in-from-left-4">
              <h1 className="cinzel font-black text-2xl text-orange-500 tracking-tighter leading-none whitespace-nowrap uppercase">Bhaskara Pro</h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Internal Studio 8K</p>
            </div>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto custom-scroll no-print">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-6 px-6 py-5 rounded-[2rem] transition-all w-full group relative ${
                activeTab === item.tab 
                  ? `${item.color} text-white shadow-2xl font-black scale-[1.02]` 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <span className={`material-icons text-4xl ${activeTab === item.tab ? 'text-white' : 'text-slate-500 group-hover:text-orange-400'}`}>{item.icon}</span>
              {isSidebarOpen && <span className="tiro text-xl whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#020617]">
        <header className="h-28 bg-[#0f172a]/98 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-12 z-20 shadow-2xl no-print">
          <div className="flex items-center gap-10">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 p-4 hover:bg-white/5 rounded-2xl transition-all">
              <span className="material-icons text-5xl">{isSidebarOpen ? 'keyboard_double_arrow_left' : 'menu'}</span>
            </button>
            <div className="h-12 w-px bg-white/10"></div>
            <h2 className="text-4xl font-black tiro text-slate-100 tracking-tighter uppercase flex items-center gap-6">
              <span className="material-icons text-5xl text-orange-500">{navItems.find(i => i.tab === activeTab)?.icon}</span>
              {navItems.find(i => i.tab === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-10">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Calculated for:</span>
                <span className="text-emerald-500 font-black tiro text-xl">సిద్దిపేట, తెలంగాణ</span>
             </div>
             <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xl font-black text-orange-500">API Status: {apiKeyStatus.msg}</div>
             <button onClick={() => { localStorage.removeItem('hub_access_v3'); window.location.reload(); }} className="p-4 text-slate-600 hover:text-red-500 transition-colors bg-white/5 rounded-2xl">
                <span className="material-icons text-4xl">logout</span>
             </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-12 relative custom-scroll">
          <div className="max-w-[1700px] mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {activeTab === AppTab.RAASI_PHALALU && <RaasiPhalalu />}
            {activeTab === AppTab.NUMEROLOGY && <NumerologyHub />}
            {activeTab === AppTab.HINDU_CALENDAR && <HinduCalendarHub />}
            {activeTab === AppTab.BHAGAVAD_GITA && <BhagavadGitaHub />}
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
