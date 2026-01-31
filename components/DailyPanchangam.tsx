
import React, { useState, useEffect } from 'react';
import { getDailyPanchangam } from '../services/geminiService';
import { PanchangamData } from '../types';

const DailyPanchangam: React.FC = () => {
  const [data, setData] = useState<PanchangamData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const today = new Date().toISOString().split('T')[0];
      const result = await getDailyPanchangam(today);
      setData(result);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-16 animate-pulse">
      <div className="w-32 h-32 border-8 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      <h2 className="cinzel text-4xl text-orange-600 font-black tracking-widest uppercase">Aligning Celestial Spheres...</h2>
    </div>
  );

  if (!data) return <div className="text-center p-32 text-orange-900 font-black cinzel text-5xl">Celestial Fault Detected</div>;

  return (
    <div className="max-w-[2400px] mx-auto space-y-24 pb-60">
      <header className="text-center space-y-8">
        <h2 className="text-9xl font-black cinzel text-orange-700 leading-none tracking-tighter uppercase">DAILY PANCHANGAM</h2>
        <p className="text-orange-900/50 font-black tracking-[1.5em] uppercase text-2xl">High Precision Vedic Ephemeris (8K)</p>
        <div className="h-2 w-[800px] mx-auto bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full"></div>
      </header>

      <div className="grid lg:grid-cols-12 gap-20 items-stretch">
        {/* VIBRANT CARD PREVIEW */}
        <div className="lg:col-span-5 flex flex-col items-center">
           <div className="w-full aspect-[9/16] bg-white rounded-[7rem] border-[30px] border-orange-50 shadow-[0_120px_250px_rgba(139,69,19,0.15)] relative overflow-hidden flex flex-col p-16 space-y-16 group">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-100/50 via-white to-white"></div>
              
              <div className="relative z-10 text-center space-y-6">
                <span className="text-[18px] font-black text-white bg-orange-600 px-10 py-3 rounded-full shadow-lg uppercase tracking-[0.4em]">{data.date}</span>
                <h3 className="text-6xl font-black tiro text-orange-900 leading-tight mt-6">{data.teluguYear}</h3>
                <div className="flex justify-center gap-6 mt-4">
                  <span className="px-6 py-2 bg-white/80 border-2 border-orange-100 rounded-full text-xl font-black text-orange-600 tiro">{data.ayanam}</span>
                  <span className="px-6 py-2 bg-white/80 border-2 border-orange-100 rounded-full text-xl font-black text-orange-600 tiro">{data.rutuvu}</span>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-10 bg-white border-4 border-orange-100 rounded-[4rem] p-12 shadow-xl">
                  <div className="text-center space-y-6">
                     <span className="material-icons text-7xl text-orange-500 drop-shadow-lg">wb_sunny</span>
                     <p className="text-[14px] font-black text-orange-400 uppercase tracking-widest">Suryodayam</p>
                     <p className="text-4xl font-black text-orange-900 cinzel tracking-widest">{data.sunrise}</p>
                  </div>
                  <div className="text-center space-y-6">
                     <span className="material-icons text-7xl text-indigo-500 drop-shadow-lg">nights_stay</span>
                     <p className="text-[14px] font-black text-indigo-400 uppercase tracking-widest">Suryastamayam</p>
                     <p className="text-4xl font-black text-indigo-900 cinzel tracking-widest">{data.sunset}</p>
                  </div>
              </div>

              <div className="relative z-10 flex-1 space-y-4">
                 {[
                   { l: 'Masam', v: data.masam, i: '🌙', c: 'text-orange-600' },
                   { l: 'Paksham', v: data.paksham, i: '🌓', c: 'text-amber-600' },
                   { l: 'Tithi', v: data.tithi, i: '⏳', c: 'text-red-600' },
                   { l: 'Nakshatram', v: data.nakshatram, i: '✨', c: 'text-indigo-600' }
                 ].map(row => (
                   <div key={row.l} className="flex justify-between items-center py-6 px-10 bg-orange-50/50 border-2 border-orange-100 rounded-[2.5rem] hover:bg-white transition-all group/row">
                      <div className="flex items-center gap-6">
                        <span className="text-5xl group-hover/row:scale-125 transition-transform">{row.i}</span>
                        <span className="text-[14px] font-black text-orange-400 uppercase tracking-widest">{row.l}</span>
                      </div>
                      <span className={`text-3xl font-black tiro ${row.c}`}>{row.v}</span>
                   </div>
                 ))}
              </div>

              <div className="relative z-10 bg-orange-600 p-10 rounded-[3rem] text-center shadow-2xl border-b-[10px] border-orange-800">
                 <p className="text-2xl tiro text-white font-black italic">"{data.specialty || 'సర్వేజనా సుఖినోభవంతు!'}"</p>
              </div>
           </div>
        </div>

        {/* ANALYTICAL MUHURTHA DATA */}
        <div className="lg:col-span-7 space-y-20">
           <div className="bg-white border-8 border-orange-100 rounded-[6rem] p-24 space-y-20 shadow-[0_50px_100px_rgba(139,69,19,0.1)] relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none">
                <span className="material-icons text-[40rem] text-orange-500">access_time</span>
              </div>
              
              <div className="relative z-10 space-y-6">
                 <h3 className="text-7xl font-black tiro text-orange-800 leading-none">ముహూర్త విశ్లేషణ (Vedic Timing)</h3>
                 <p className="text-orange-400 text-2xl font-black uppercase tracking-widest italic">Cosmic Synchrony Enabled for Current Node</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 relative z-10">
                 <div className="bg-red-50 border-4 border-red-100 p-14 rounded-[5rem] space-y-12 shadow-inner">
                    <h4 className="text-3xl font-black text-red-700 uppercase tracking-widest flex items-center gap-6 border-b-4 border-red-200 pb-6">
                       <span className="material-icons text-5xl">warning</span> దుర్ముహూర్తాలు
                    </h4>
                    <div className="space-y-10">
                       {[
                         { l: 'Rahukalam', v: data.rahukalam, i: '🚫' },
                         { l: 'Yamagandam', v: data.yamagandam, i: '💀' },
                         { l: 'Gulika', v: data.gulika, i: '🌑' }
                       ].map(t => (
                         <div key={t.l} className="flex justify-between items-center bg-white/50 p-8 rounded-[3rem] border-2 border-red-50">
                            <div className="flex items-center gap-4">
                               <span className="text-4xl">{t.i}</span>
                               <span className="text-[14px] font-black text-red-900 uppercase tracking-widest">{t.l}</span>
                            </div>
                            <span className="text-4xl font-black text-red-600 cinzel">{t.v}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-emerald-50 border-4 border-emerald-100 p-14 rounded-[5rem] space-y-12 shadow-inner">
                    <h4 className="text-3xl font-black text-emerald-700 uppercase tracking-widest flex items-center gap-6 border-b-4 border-emerald-200 pb-6">
                       <span className="material-icons text-5xl">verified</span> శుభ ముహూర్తాలు
                    </h4>
                    <div className="space-y-10">
                       <div className="flex justify-between items-center bg-white/50 p-10 rounded-[3rem] border-2 border-emerald-50">
                          <div className="flex items-center gap-4">
                             <span className="text-5xl">🌟</span>
                             <span className="text-[14px] font-black text-emerald-900 uppercase tracking-widest">Abhijit</span>
                          </div>
                          <span className="text-5xl font-black text-emerald-600 cinzel">{data.abhijit || '11:45 - 12:35'}</span>
                       </div>
                       <p className="text-xl text-emerald-900/60 font-black italic leading-relaxed text-center px-10">
                         "కాలమే పరబ్రహ్మ స్వరూపము. శుభ ముహూర్త నిర్ణయం ద్వారా మీ కర్మలు సత్ఫలితాలను ఇస్తాయి."
                       </p>
                    </div>
                 </div>
              </div>

              <div className="relative z-10 bg-orange-600/5 p-16 rounded-[5rem] border-4 border-orange-500/20">
                 <h5 className="text-4xl font-black tiro text-orange-800 mb-8 flex items-center gap-6">
                    <span className="material-icons text-5xl">psychology</span> Celestial Insight (నేటి సందేశం)
                 </h5>
                 <p className="text-stone-800 text-4xl leading-[2] tiro text-justify font-bold tracking-tight">
                   నేడు {data.nakshatram} నక్షత్ర ప్రభావం వలన మంత్ర జపం మరియు ధ్యానం అత్యంత శక్తివంతంగా ఉంటాయి. ఈ పవిత్ర కాలంలో మీ లక్ష్యాలను నిర్దేశించుకోండి. కాల గమనమే సనాతన ధర్మ మూలం.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DailyPanchangam;
