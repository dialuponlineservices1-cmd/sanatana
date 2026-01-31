
import React from 'react';
import { GALLERY_SAMPLES } from '../constants';

interface SampleGalleryProps {
  onSelect: (topic: string) => void;
}

const SampleGallery: React.FC<SampleGalleryProps> = ({ onSelect }) => {
  return (
    <div className="max-w-[2400px] mx-auto space-y-24 pb-60">
      <header className="text-center space-y-8 animate-in fade-in duration-1000">
        <h2 className="text-9xl font-black cinzel text-orange-700 leading-none tracking-tighter uppercase">DESIGN INSPIRATION</h2>
        <p className="text-orange-900/50 font-black tracking-[1.5em] uppercase text-2xl">Premium Template Samples for Divine Content</p>
        <div className="h-2 w-[800px] mx-auto bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full"></div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        {GALLERY_SAMPLES.map((sample) => (
          <div 
            key={sample.id}
            onClick={() => onSelect(sample.title)}
            className="group relative bg-white border-8 border-orange-50 rounded-[6rem] p-12 hover:border-orange-500 transition-all cursor-pointer shadow-xl overflow-hidden aspect-[4/5] flex flex-col justify-end"
          >
            {/* Background Pattern */}
            <div className={`absolute inset-0 ${sample.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}></div>
            <div className="absolute top-12 left-12 w-32 h-32 rounded-[2rem] bg-orange-50 flex items-center justify-center text-7xl shadow-inner group-hover:scale-110 transition-transform">
              {sample.icon}
            </div>
            
            <div className="relative z-10 space-y-6">
               <span className="text-[14px] font-black text-white bg-orange-600 px-8 py-2 rounded-full uppercase tracking-widest inline-block">{sample.category}</span>
               <h3 className="text-6xl font-black tiro text-orange-950 leading-tight drop-shadow-sm">{sample.title}</h3>
               <p className="text-stone-500 text-2xl font-black tiro italic">ప్రీమియం 8K డిజైన్ నమూనా. క్లిక్ చేసి నేరుగా సృష్టించండి.</p>
               
               <div className="pt-8 border-t-4 border-orange-50 flex items-center justify-between">
                  <span className="text-orange-600 font-black uppercase tracking-widest text-xl">View Template</span>
                  <span className="material-icons text-orange-400 group-hover:translate-x-4 transition-transform text-5xl">arrow_forward</span>
               </div>
            </div>

            {/* Mock Layout Overlay */}
            <div className="absolute inset-x-12 top-48 bottom-48 border-4 border-dashed border-orange-100 rounded-[4rem] flex flex-col items-center justify-center opacity-40">
               <div className="w-3/4 h-8 bg-orange-100 rounded-full mb-4"></div>
               <div className="w-1/2 h-8 bg-orange-50 rounded-full mb-12"></div>
               <div className="w-5/6 h-4 bg-orange-100 rounded-full mb-4"></div>
               <div className="w-5/6 h-4 bg-orange-100 rounded-full mb-4"></div>
               <div className="w-5/6 h-4 bg-orange-100 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-orange-950 rounded-[6rem] p-24 text-center space-y-12 shadow-2xl relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10"></div>
         <h4 className="text-7xl font-black cinzel text-white leading-tight uppercase tracking-widest">Custom Template Request?</h4>
         <p className="text-orange-200 text-3xl tiro font-black max-w-5xl mx-auto leading-relaxed">
           మీకు నచ్చిన విధంగా డిజైన్ మారాలి అంటే, మమ్మల్ని సంప్రదించండి. మీ సొంత ఫోటోలు, లోగోలు మరియు వివరాలతో దివ్యమైన పోస్టర్స్ సిద్ధం చేయబడతాయి.
         </p>
         <button className="px-24 py-10 bg-orange-600 text-white rounded-full font-black cinzel text-3xl uppercase tracking-[0.5em] shadow-xl hover:bg-orange-500 transition-all border-b-[12px] border-orange-900">
           Contact Divya Studio
         </button>
      </div>
    </div>
  );
};

export default SampleGallery;
