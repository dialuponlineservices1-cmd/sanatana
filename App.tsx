
import React, { useState } from 'react';
import { AppTab } from './types';
import PostGenerator from './components/PostGenerator';
import ScriptureLibrary from './components/ScriptureLibrary';
import DailyPanchangam from './components/DailyPanchangam';
import AIChat from './components/AIChat';
import BrandingSettings from './components/BrandingSettings';
import SamsayaSolver from './components/SamsayaSolver';
import RishiHub from './components/RishiHub';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.GENERATOR);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { tab: AppTab.GENERATOR, icon: 'auto_fix_high', label: 'డిజైన్ స్టూడియో', color: 'bg-orange-600' },
    { tab: AppTab.SAMSAYA_SAMADHANAM, icon: 'help_center', label: 'ధర్మ సందేహం', color: 'bg-indigo-700' },
    { tab: AppTab.RISHI_HUB, icon: 'self_improvement', label: 'మహర్షి విజ్ఞానం', color: 'bg-emerald-700' },
    { tab: AppTab.DHARMA_HUB, icon: 'auto_awesome', label: 'హిందూ ధర్మం', color: 'bg-amber-600' },
    { tab: AppTab.SANATANA_DHARMA, icon: 'temple_hindu', label: 'సనాతన ధర్మం', color: 'bg-red-700' },
    { tab: AppTab.VASTU, icon: 'architecture', label: 'వాస్తు శాస్త్రం', color: 'bg-stone-700' },
    { tab: AppTab.MORAL_STORIES, icon: 'menu_book', label: 'నీతి కథలు', color: 'bg-emerald-600' },
    { tab: AppTab.PANDUGALU, icon: 'celebration', label: 'పండుగలు', color: 'bg-pink-600' },
    { tab: AppTab.LIBRARY, icon: 'library_books', label: 'గ్రంథాలయం', color: 'bg-indigo-600' },
    { tab: AppTab.PANCHANGAM, icon: 'flare', label: 'పంచాంగం', color: 'bg-yellow-600' },
    { tab: AppTab.AI_CHAT, icon: 'psychology', label: 'ఋషి AI చాట్', color: 'bg-sky-600' },
    { tab: AppTab.BRANDING, icon: 'contact_page', label: 'ప్రొఫైల్ సెట్టింగ్స్', color: 'bg-rose-600' }
  ];

  return (
    <div className="flex h-screen bg-[#FFFDF5] overflow-hidden">
      <aside className={`${isSidebarOpen ? 'w-[450px]' : 'w-24'} bg-white border-r-8 border-orange-100 transition-all duration-500 flex flex-col z-30 shadow-2xl`}>
        <div className="p-10 flex items-center gap-6 border-b-4 border-orange-50">
          <div className="w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shrink-0">
            <span className="material-icons text-white text-4xl">temple_hindu</span>
          </div>
          {isSidebarOpen && (
            <div>
              <h1 className="cinzel font-black text-3xl text-orange-800 tracking-tighter leading-none">SANATANA PRO</h1>
              <p className="text-[12px] font-bold text-orange-400 uppercase tracking-widest mt-2">ULTIMATE DIVINE HUB</p>
            </div>
          )}
        </div>
        <nav className="flex-1 px-8 py-12 space-y-4 overflow-y-auto custom-scroll">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-8 px-8 py-6 rounded-[3rem] transition-all w-full group ${
                activeTab === item.tab ? `${item.color} text-white shadow-2xl scale-[1.05]` : 'text-stone-500 hover:bg-orange-50'
              }`}
            >
              <span className={`material-icons text-4xl ${activeTab === item.tab ? 'text-white' : 'text-stone-400 group-hover:text-orange-500'}`}>{item.icon}</span>
              {isSidebarOpen && <span className="font-black tiro text-2xl whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-32 bg-white border-b-8 border-orange-100 flex items-center justify-between px-20 z-20 shadow-sm print:hidden">
          <div className="flex items-center gap-12">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-orange-400 p-6 hover:bg-orange-50 rounded-3xl transition-all">
              <span className="material-icons text-6xl">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
            </button>
            <h2 className="text-5xl font-black tiro text-orange-800">శ్రీ సనాతన ధర్మ స్టూడియో</h2>
          </div>
          <div className="flex items-center gap-10">
             <div className="text-right">
                <p className="text-[12px] font-black text-orange-400 uppercase tracking-[0.4em]">Engine Status</p>
                <p className="text-2xl font-black cinzel text-emerald-600">8K DIVINE ACTIVE</p>
             </div>
             <div className="w-6 h-6 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_25px_rgba(16,185,129,0.7)]"></div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-16 relative custom-scroll print:p-0">
          <div className="max-w-[2000px] mx-auto">
            {(activeTab === AppTab.GENERATOR || activeTab === AppTab.DHARMA_HUB || activeTab === AppTab.SANATANA_DHARMA || activeTab === AppTab.VASTU || activeTab === AppTab.MORAL_STORIES || activeTab === AppTab.PANDUGALU) && (
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
