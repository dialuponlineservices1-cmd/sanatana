
import React, { useState } from 'react';
import { AppTab } from './types';
import PostGenerator from './components/PostGenerator';
import ScriptureLibrary from './components/ScriptureLibrary';
import DailyPanchangam from './components/DailyPanchangam';
import AIChat from './components/AIChat';
import BrandingSettings from './components/BrandingSettings';
import AstrologyHub from './components/AstrologyHub';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.GENERATOR);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { tab: AppTab.GENERATOR, icon: 'auto_fix_high', label: 'దివ్య స్టూడియో', color: 'bg-orange-500' },
    { tab: AppTab.VASTU, icon: 'architecture', label: 'వాస్తు శాస్త్రం', color: 'bg-stone-700' },
    { tab: AppTab.MORAL_STORIES, icon: 'menu_book', label: 'నిత్య నీతి కథలు', color: 'bg-emerald-600' },
    { tab: AppTab.KIDS_STORIES, icon: 'face', label: 'బాల శిక్ష (Kids)', color: 'bg-blue-500' },
    { tab: AppTab.PANDUGALU, icon: 'celebration', label: 'మన పండుగలు', color: 'bg-pink-600' },
    { tab: AppTab.SPECIAL_DAYS, icon: 'event_note', label: 'రోజుల విశిష్టత', color: 'bg-teal-600' },
    { tab: AppTab.MAHARSHIS, icon: 'history_edu', label: 'మహర్షుల చరిత్ర', color: 'bg-amber-600' },
    { tab: AppTab.TEMPLES, icon: 'castle', label: 'పుణ్య క్షేత్రాలు', color: 'bg-red-600' },
    { tab: AppTab.JATHAKAM, icon: 'auto_awesome', label: 'పూర్ణ జాతకం', color: 'bg-purple-600' },
    { tab: AppTab.PANCHANGAM, icon: 'flare', label: 'నిత్య పంచాంగం', color: 'bg-yellow-600' },
    { tab: AppTab.LIBRARY, icon: 'library_books', label: 'జ్ఞాన భాండాగారం', color: 'bg-indigo-600' },
    { tab: AppTab.AI_CHAT, icon: 'psychology', label: 'ఋషి AI చాట్', color: 'bg-sky-600' },
    { tab: AppTab.BRANDING, icon: 'contact_page', label: 'ప్రొఫైల్ సెట్టింగ్స్', color: 'bg-rose-600' }
  ];

  return (
    <div className="flex h-screen text-stone-900 overflow-hidden bg-[#FFFDF5]">
      {/* Royal Saffron Palace Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-[480px]' : 'w-32'} bg-white border-r-8 border-orange-100 transition-all duration-700 flex flex-col z-30 shadow-[40px_0_120px_rgba(139,69,19,0.08)]`}>
        <div className="p-10 flex items-center gap-8 bg-gradient-to-br from-orange-100 to-white">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-amber-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
            <span className="material-icons text-white text-5xl">temple_hindu</span>
          </div>
          {isSidebarOpen && (
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              <h1 className="cinzel font-black text-4xl text-orange-800 leading-none tracking-tighter">SANATANA PRO</h1>
              <p className="text-[12px] font-black tracking-[0.6em] text-orange-400 uppercase mt-3">DIVINE CONSOLE V13.0</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-6 space-y-3 overflow-y-auto custom-scroll py-8">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-8 px-8 py-5 rounded-[2.5rem] transition-all w-full group relative ${
                activeTab === item.tab 
                  ? `${item.color} text-white shadow-2xl scale-[1.05]` 
                  : 'text-stone-500 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <span className={`material-icons text-4xl ${activeTab === item.tab ? 'text-white' : 'text-stone-400 group-hover:text-orange-500'}`}>
                {item.icon}
              </span>
              {isSidebarOpen && (
                <span className={`font-black tiro text-2xl whitespace-nowrap tracking-wide ${activeTab === item.tab ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-10 border-t-4 border-orange-50">
          <div className="bg-orange-50 rounded-[3rem] p-6 flex items-center gap-6 border-2 border-orange-200">
             <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center">
               <span className="material-icons text-orange-600">shield</span>
             </div>
             {isSidebarOpen && (
               <div>
                 <span className="text-[12px] font-black text-orange-600 uppercase tracking-widest block">Supreme Research Hub</span>
               </div>
             )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-40 bg-white/95 backdrop-blur-3xl border-b-8 border-orange-100 flex items-center justify-between px-16 z-20 shadow-sm">
          <div className="flex items-center gap-12">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-orange-400 hover:text-orange-600 p-4 hover:bg-orange-50 rounded-[1.5rem]">
              <span className="material-icons text-5xl">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
            </button>
            <div className="flex flex-col">
              <h2 className="text-5xl font-black tiro text-orange-800 leading-none">శ్రీ సనాతన ధర్మ స్టూడియో</h2>
              <span className="text-[14px] text-orange-400 font-black uppercase tracking-[1em] mt-4 hidden sm:block">Vedic Research Engine Pro</span>
            </div>
          </div>
          <div className="flex items-center gap-8 bg-orange-50 px-8 py-4 rounded-[2rem] border-2 border-orange-100">
             <span className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-xl font-black text-orange-700 cinzel">RESEARCH CORES ACTIVE</span>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-12 md:p-20 relative custom-scroll">
          <div className="max-w-[2800px] mx-auto">
            {(activeTab === AppTab.GENERATOR || 
              activeTab === AppTab.MAHARSHIS || 
              activeTab === AppTab.TEMPLES || 
              activeTab === AppTab.PANDUGALU || 
              activeTab === AppTab.SPECIAL_DAYS || 
              activeTab === AppTab.VASTU ||
              activeTab === AppTab.MORAL_STORIES || 
              activeTab === AppTab.KIDS_STORIES) && (
              <PostGenerator mode={activeTab} />
            )}
            {activeTab === AppTab.JATHAKAM && <AstrologyHub />}
            {activeTab === AppTab.LIBRARY && <ScriptureLibrary />}
            {activeTab === AppTab.PANCHANGAM && <DailyPanchangam />}
            {activeTab === AppTab.AI_CHAT && <AIChat />}
            {activeTab === AppTab.BRANDING && <BrandingSettings />}
          </div>
        </section>
      </main>
      
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #FF9933; border-radius: 20px; border: 2px solid #FFF; }
      `}</style>
    </div>
  );
};

export default App;
