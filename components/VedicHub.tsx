
import React from 'react';

const EXTERNAL_APPS = [
  { name: 'TTD Official Portal', desc: 'Book Seva, Darshan, and view real-time updates from Tirumala Tirupati Devasthanams.', icon: 'temple_hindu', color: 'bg-orange-600', link: 'https://tirupatibalaji.ap.gov.in/' },
  { name: 'Dharma Wiki', desc: 'A massive community-driven archive of Sanatana Dharma literature and history.', icon: 'auto_stories', color: 'bg-amber-600', link: 'https://dharmawiki.org/' },
  { name: 'ePanchang', desc: 'Precision astrological charts and traditional Muhurtha calculations.', icon: 'brightness_6', color: 'bg-indigo-600', link: 'https://www.epanchang.com/' },
  { name: 'Indica Library', desc: 'Explore deep research on Indic studies, Mahasruhul stories, and civilization history.', icon: 'menu_book', color: 'bg-emerald-600', link: 'https://indica.nic.in/' },
  { name: 'Kanchi Kamakoti', desc: 'Official portal for Kanchi Peetham - spiritual guidance and archives.', icon: 'account_balance', color: 'bg-red-600', link: 'https://www.kanchiperiva.org/' },
  { name: 'Sanskrit eBooks', desc: 'Download authentic PDFs of Vedas, Puranas, and Maharshi records in multiple languages.', icon: 'file_download', color: 'bg-sky-600', link: 'https://sanskritdocuments.org/' },
];

const VedicHub: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-40 px-4">
      <header className="text-center space-y-6 animate-in fade-in duration-1000">
        <h2 className="text-7xl font-black gold-text cinzel tracking-tighter uppercase">SACRED INTEGRATION PORTAL</h2>
        <div className="flex items-center justify-center gap-6">
          <div className="h-0.5 w-24 bg-amber-500/20"></div>
          <p className="text-slate-500 font-black tracking-[1em] uppercase text-[10px]">Verified Vedic Gateway</p>
          <div className="h-0.5 w-24 bg-amber-500/20"></div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {EXTERNAL_APPS.map((app, idx) => (
          <a 
            key={app.name} 
            href={app.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-slate-900/40 border-2 border-white/5 rounded-[4rem] p-12 hover:border-amber-500/40 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in duration-500"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
             <div className={`absolute top-0 left-0 w-full h-2.5 ${app.color}`}></div>
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             
             <div className={`w-28 h-28 ${app.color} text-slate-950 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
                <span className="material-icons text-6xl">{app.icon}</span>
             </div>

             <h3 className="text-2xl font-black cinzel text-slate-200 mb-6 tracking-widest">{app.name}</h3>
             <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 px-4 group-hover:text-slate-300 transition-colors italic">
               "{app.desc}"
             </p>

             <div className="mt-auto flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-white/20 transition-all">
                <span>LAUNCH SECURE PORTAL</span>
                <span className="material-icons text-sm">open_in_new</span>
             </div>
          </a>
        ))}
      </div>

      <div className="bg-[#050814] border-4 border-amber-500/10 rounded-[5rem] p-24 relative overflow-hidden shadow-[0_100px_200px_rgba(0,0,0,0.8)]">
         <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
            <span className="material-icons text-[30rem] text-amber-500">api</span>
         </div>
         
         <div className="max-w-4xl relative z-10 space-y-10">
            <h4 className="text-5xl font-black tiro text-amber-500 leading-tight">విశ్వ వ్యాప్త ధర్మ నెట్‌వర్క్ (Global Integration)</h4>
            <p className="text-slate-400 text-xl leading-relaxed font-medium">
              Sri Sanatana Dharma Studio connects you with official temple boards, authorized Vedic repositories, and trusted astronomical data providers. We bridge the gap between ancient wisdom and digital access through secure API handshakes.
            </p>
            <div className="flex flex-wrap gap-8 pt-6">
              <button className="px-16 py-6 bg-amber-500 text-slate-950 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:brightness-110 transition-all border-b-4 border-amber-700">Explore Integrations</button>
              <button className="px-16 py-6 bg-slate-900 border-2 border-white/10 text-white rounded-3xl font-black uppercase tracking-widest hover:border-amber-500 transition-all">Developer API Access</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default VedicHub;
