
import React, { useState, useMemo } from 'react';
import { SCRIPTURES } from '../constants';
import { Scripture } from '../types';

const ScriptureLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(SCRIPTURES.map(s => s.category)));
    return ['All', ...cats];
  }, []);

  const categoryColors: Record<string, string> = {
    'Veda': 'bg-orange-500',
    'Vedanga': 'bg-indigo-500',
    'Itihasa': 'bg-red-600',
    'Purana': 'bg-pink-600',
    'Darshana': 'bg-yellow-600',
    'Tantra': 'bg-rose-600',
    'Secret': 'bg-amber-600',
    'Yoga': 'bg-teal-600',
    'Architecture': 'bg-sky-600',
    'All': 'bg-stone-800'
  };

  const filteredScriptures = useMemo(() => {
    return SCRIPTURES.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="space-y-20 max-w-[2600px] mx-auto pb-60">
      <div className="flex flex-col md:flex-row items-center justify-between gap-16 bg-white p-20 rounded-[6rem] shadow-[0_40px_100px_rgba(139,69,19,0.1)] border-8 border-orange-100">
        <div className="space-y-6 max-w-5xl">
          <h2 className="text-9xl font-black cinzel text-orange-700 uppercase tracking-tighter leading-none">GRAND LIBRARY</h2>
          <p className="text-orange-900/60 font-black text-4xl tiro italic">
            సర్వ వేద, పురాణ, ఇతిహాసాల రహస్య భాండాగారం. ప్రాచీన జ్ఞానానికి ఆధునిక ఆవిష్కరణ.
          </p>
        </div>
        <div className="w-full md:w-[800px] group relative">
          <div className="flex items-center gap-8 bg-orange-50 border-4 border-orange-200 p-8 rounded-[4rem] shadow-inner focus-within:border-orange-500 focus-within:bg-white transition-all">
             <span className="material-icons text-7xl text-orange-500 ml-6">search</span>
             <input 
               type="text" 
               placeholder="Search Divine Knowledge..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="bg-transparent outline-none text-5xl w-full tiro text-orange-900 px-6 placeholder:text-orange-200" 
             />
          </div>
          <div className="absolute -bottom-10 right-10 text-[12px] font-black text-orange-300 uppercase tracking-widest">Total Volumes: {SCRIPTURES.length}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 justify-center bg-white/50 p-10 rounded-[4rem] border-4 border-orange-100 shadow-sm">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-14 py-8 rounded-[3rem] font-black text-2xl uppercase tracking-widest transition-all border-4 shadow-lg ${
              activeCategory === cat 
                ? `${categoryColors[cat] || 'bg-stone-800'} text-white border-black/10 scale-110 z-10` 
                : 'bg-white text-stone-700 border-orange-100 hover:border-orange-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {filteredScriptures.map((s) => (
          <div 
            key={s.id} 
            className="group bg-white border-8 border-orange-50 rounded-[6rem] p-16 hover:border-orange-500 hover:shadow-[0_80px_160px_rgba(139,69,19,0.15)] transition-all cursor-pointer relative overflow-hidden flex flex-col h-[800px]"
          >
            <div className={`absolute top-0 right-0 w-64 h-64 ${categoryColors[s.category] || 'bg-orange-500'} opacity-[0.05] rounded-bl-[100%] transition-transform group-hover:scale-150`}></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className={`w-36 h-36 ${categoryColors[s.category] || 'bg-orange-500'} text-white rounded-[3rem] flex items-center justify-center text-8xl mb-12 shadow-2xl group-hover:rotate-12 transition-transform`}>
                {s.icon}
              </div>
              <div className="space-y-6">
                <span className={`text-[14px] font-black ${categoryColors[s.category] || 'bg-orange-500'} text-white px-8 py-2 rounded-full uppercase tracking-widest inline-block mb-4`}>
                   {s.category}
                </span>
                <h3 className="text-6xl font-black text-orange-950 tiro leading-tight drop-shadow-sm">{s.name}</h3>
                <p className="text-orange-900/70 text-3xl leading-relaxed font-bold tiro italic line-clamp-6 bg-orange-50/30 p-8 rounded-[3rem] border-2 border-orange-100/50">
                   "{s.description}"
                </p>
              </div>
              
              <div className="mt-auto pt-12 flex items-center justify-between border-t-4 border-orange-50">
                 <div className="space-y-3">
                    <p className="text-[12px] font-black text-orange-400 uppercase tracking-widest">Rahasya Level</p>
                    <div className="flex gap-2">
                       {[...Array(5)].map((_, i) => (
                         <div key={i} className={`w-4 h-4 rounded-full ${i < s.rahasyaLevel ? 'bg-orange-500 shadow-[0_0_10px_rgba(255,153,51,0.5)]' : 'bg-orange-100'}`}></div>
                       ))}
                    </div>
                 </div>
                 <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-xl">
                   <span className="material-icons text-5xl">arrow_forward</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptureLibrary;
