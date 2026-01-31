
import React, { useState, useEffect, useMemo } from 'react';
import { getDailyPanchangam } from '../services/geminiService';
import { PanchangamData } from '../types';
import { FESTIVALS_LIST } from '../constants';

const HinduCalendarHub: React.FC = () => {
  const [view, setView] = useState<'MONTH' | 'DAY'>('MONTH');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dayData, setDayData] = useState<PanchangamData | null>(null);
  const [loading, setLoading] = useState(false);

  const monthInfo = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = currentDate.toLocaleString('te-IN', { month: 'long' });
    return { year, month, firstDay, daysInMonth, monthName };
  }, [currentDate]);

  const days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < monthInfo.firstDay; i++) arr.push(null);
    for (let d = 1; d <= monthInfo.daysInMonth; d++) arr.push(d);
    return arr;
  }, [monthInfo]);

  // Simulated Festivals for the month for UI richness
  const monthlyFestivals = useMemo(() => {
    return FESTIVALS_LIST.slice(0, 4).map((f, i) => ({
      ...f,
      date: (i * 7 + 5).toString().padStart(2, '0')
    }));
  }, [monthInfo]);

  const fetchDayData = async (dateStr: string) => {
    setLoading(true);
    try {
      const res = await getDailyPanchangam(dateStr);
      setDayData(res);
      setView('DAY');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (day: number | null) => {
    if (!day) return;
    const date = new Date(monthInfo.year, monthInfo.month, day);
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    fetchDayData(dateStr);
  };

  const changeMonth = (offset: number) => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(next);
  };

  const handlePrint = () => { window.print(); };

  const weekdays = ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-16">
        <div className="relative">
          <div className="w-56 h-56 border-[16px] border-red-100 border-t-red-600 rounded-full animate-spin shadow-2xl"></div>
          <span className="material-icons absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl text-red-600 animate-pulse">temple_hindu</span>
        </div>
        <div className="text-center space-y-4">
          <p className="tiro text-5xl text-red-600 font-black uppercase tracking-[0.3em]">సిద్దిపేట పంచాంగం</p>
          <p className="tiro text-2xl text-slate-500 font-bold">గ్రహ గతుల గణన జరుగుతోంది...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1700px] mx-auto space-y-12 pb-40">
      {/* Header Controls - App Style */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 no-print bg-[#0f172a] p-10 rounded-[4rem] border-4 border-white/5 shadow-2xl">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_40px_rgba(220,38,38,0.4)]">
            <span className="material-icons text-white text-6xl">calendar_today</span>
          </div>
          <div className="space-y-1">
             <h2 className="text-6xl font-black tiro text-white uppercase tracking-tighter leading-none">హిందూ క్యాలెండర్ ప్రో</h2>
             <div className="flex items-center gap-3 bg-red-600/10 px-4 py-1 rounded-full w-fit">
                <span className="material-icons text-red-500 text-2xl">location_on</span>
                <p className="text-red-500 font-black text-xl tiro uppercase">సిద్దిపేట జిల్లా ఎడిషన్</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-black/40 p-3 rounded-[3rem] border-2 border-white/10 shadow-inner">
          <button onClick={() => setView('MONTH')} className={`px-12 py-5 rounded-[2.5rem] font-black tiro text-2xl transition-all ${view === 'MONTH' ? 'bg-red-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}>క్యాలెండర్</button>
          <button onClick={() => { if(dayData) setView('DAY'); else handleDateClick(new Date().getDate()); }} className={`px-12 py-5 rounded-[2.5rem] font-black tiro text-2xl transition-all ${view === 'DAY' ? 'bg-red-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}>నేటి తిథి</button>
        </div>
      </div>

      {view === 'MONTH' ? (
        <div className="grid lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {/* Main Calendar Section */}
          <div className="lg:col-span-9 space-y-10">
            <div className="flex items-center justify-between bg-red-900 border-[10px] border-red-950/40 rounded-[4rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none"></div>
              <button onClick={() => changeMonth(-1)} className="w-24 h-24 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10 active:scale-90 shadow-lg">
                <span className="material-icons text-white text-6xl">chevron_left</span>
              </button>
              <div className="text-center z-10">
                <h3 className="text-[110px] font-black tiro text-white leading-none uppercase tracking-tighter drop-shadow-2xl">{monthInfo.monthName} {monthInfo.year}</h3>
                <p className="text-red-300 font-bold text-3xl tiro mt-4 tracking-widest uppercase italic">శోభకృత్ నామ సంవత్సరము • సిద్ధవటం ప్రాంతీయ గణన</p>
              </div>
              <button onClick={() => changeMonth(1)} className="w-24 h-24 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10 active:scale-90 shadow-lg">
                <span className="material-icons text-white text-6xl">chevron_right</span>
              </button>
            </div>

            <div className="bg-white border-[20px] border-red-950/20 rounded-[5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)]">
              <div className="grid grid-cols-7 bg-red-800 border-b-8 border-red-950/40">
                {weekdays.map(d => (
                  <div key={d} className="py-12 text-center text-4xl font-black tiro text-white border-r border-white/10 last:border-none uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {days.map((day, idx) => {
                  const isToday = day === new Date().getDate() && monthInfo.month === new Date().getMonth() && monthInfo.year === new Date().getFullYear();
                  const fest = monthlyFestivals.find(f => parseInt(f.date) === day);
                  return (
                    <button 
                      key={idx}
                      onClick={() => handleDateClick(day)}
                      className={`h-56 md:h-80 border-r border-b border-red-50 p-6 flex flex-col items-start justify-between transition-all group hover:bg-red-50 relative ${!day ? 'bg-slate-50' : ''}`}
                    >
                      {day && (
                        <>
                          <div className="w-full flex justify-between items-start">
                             <span className={`cinzel text-5xl font-black ${isToday ? 'bg-red-600 text-white w-24 h-24 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(220,38,38,0.5)] scale-110' : 'text-slate-800'}`}>
                               {day}
                             </span>
                             {fest && <span className="text-4xl" title={fest.name}>{fest.icon}</span>}
                          </div>
                          
                          <div className="w-full space-y-2">
                             {fest && <p className="tiro text-xl font-black text-red-700 leading-tight line-clamp-2">{fest.name}</p>}
                             <div className="flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                                <span className="tiro text-xl font-black text-red-900/50">వివరాలు</span>
                                {day === 15 && <div className="w-10 h-10 rounded-full bg-slate-100 border-4 border-slate-300 shadow-lg" title="Purnima"></div>}
                                {day === 30 && <div className="w-10 h-10 rounded-full bg-slate-900 shadow-lg" title="Amavasya"></div>}
                             </div>
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Festivals of the Month */}
          <div className="lg:col-span-3 space-y-10">
             <div className="bg-[#0f172a] border-8 border-white/5 rounded-[4rem] p-10 h-full flex flex-col shadow-2xl">
                <header className="mb-10 space-y-4">
                   <h4 className="text-4xl font-black tiro text-white flex items-center gap-4">
                     <span className="material-icons text-5xl text-orange-500">celebration</span> మాస పండుగలు
                   </h4>
                   <p className="text-slate-500 font-bold text-xl tiro uppercase tracking-widest border-b-2 border-white/5 pb-4">{monthInfo.monthName} విశిష్టతలు</p>
                </header>
                
                <div className="flex-1 space-y-6">
                   {monthlyFestivals.map(f => (
                     <div key={f.id} onClick={() => handleDateClick(parseInt(f.date))} className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border-2 border-white/5 hover:border-red-500/40 hover:bg-white/10 transition-all cursor-pointer group">
                        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                           {f.icon}
                        </div>
                        <div>
                           <p className="text-red-500 cinzel font-black text-3xl">{f.date} {monthInfo.monthName.slice(0,3)}</p>
                           <p className="text-white tiro font-black text-2xl line-clamp-1">{f.name}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-12 p-8 bg-red-600/10 border-2 border-red-500/20 rounded-3xl">
                   <p className="text-red-500 font-black tiro text-2xl text-center italic">"శోభకృత్ నామ సంవత్సరము సర్వ శుభాలు కలిగించును గాక!"</p>
                </div>
             </div>
          </div>
        </div>
      ) : (
        /* Detailed Day View - Poster Mode */
        <div className="animate-in zoom-in-95 duration-700 space-y-16">
          {dayData && (
            <div className="grid lg:grid-cols-12 gap-16 items-start">
              {/* Divine Poster */}
              <div className="lg:col-span-5">
                <div id="calendar-poster" className="w-full aspect-[9/16] bg-[#FFF8E1] border-[30px] border-[#8B4513]/20 rounded-[6rem] shadow-[0_100px_200px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col p-20">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-15"></div>
                  
                  <div className="relative z-10 text-center space-y-10 border-b-8 border-[#8B4513]/20 pb-16">
                    <div className="flex justify-center mb-6">
                       <span className="material-icons text-[180px] text-red-700 drop-shadow-2xl">temple_hindu</span>
                    </div>
                    <h3 className="text-8xl font-black tiro text-[#8B4513] leading-none uppercase tracking-tighter drop-shadow-xl">{dayData.teluguYear}</h3>
                    <div className="flex justify-center gap-10 text-5xl font-black tiro text-red-800">
                        <span className="bg-red-200/50 px-10 py-4 rounded-[2rem] shadow-inner">{dayData.masam} మాసం</span>
                        <span className="bg-red-200/50 px-10 py-4 rounded-[2rem] shadow-inner">{dayData.paksham}</span>
                    </div>
                  </div>

                  <div className="flex-1 py-16 flex flex-col items-center justify-center space-y-20 relative z-10">
                    <div className="text-center space-y-6">
                        <p className="text-[24px] font-black text-[#8B4513]/50 uppercase tracking-[0.8em] mb-4">నేటి పవిత్ర తిథి</p>
                        <div className="relative inline-block">
                           <h4 className="text-[220px] font-black tiro text-red-900 leading-none drop-shadow-[0_20px_60px_rgba(0,0,0,0.4)]">{dayData.tithi}</h4>
                           <span className="absolute -top-10 -right-10 w-8 h-8 rounded-full bg-red-600 animate-ping"></span>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-12">
                        <div className="bg-white/95 border-4 border-[#8B4513]/10 p-12 rounded-[5rem] text-center space-y-6 shadow-2xl group hover:-translate-y-4 transition-transform">
                          <span className="material-icons text-[120px] text-orange-500 drop-shadow-lg group-hover:rotate-12 transition-transform">wb_sunny</span>
                          <div>
                            <p className="text-[18px] font-black text-[#8B4513]/50 uppercase tracking-widest">సూర్యోదయం</p>
                            <p className="text-7xl font-black cinzel text-[#8B4513]">{dayData.sunrise}</p>
                          </div>
                        </div>
                        <div className="bg-white/95 border-4 border-[#8B4513]/10 p-12 rounded-[5rem] text-center space-y-6 shadow-2xl group hover:-translate-y-4 transition-transform">
                          <span className="material-icons text-[120px] text-indigo-700 drop-shadow-lg group-hover:-rotate-12 transition-transform">nights_stay</span>
                          <div>
                            <p className="text-[18px] font-black text-[#8B4513]/50 uppercase tracking-widest">సూర్యాస్తమయం</p>
                            <p className="text-7xl font-black cinzel text-[#8B4513]">{dayData.sunset}</p>
                          </div>
                        </div>
                    </div>
                  </div>

                  <div className="relative z-10 bg-red-800 p-14 rounded-[4rem] text-center shadow-[0_30px_60px_rgba(0,0,0,0.4)] mb-12 border-b-[20px] border-red-950">
                    <p className="text-5xl tiro text-white font-black italic">"{dayData.specialty || 'సర్వేజనా సుఖినోభవంతు!'}"</p>
                  </div>
                  
                  <div className="relative z-10 text-center opacity-40 pt-10 border-t-4 border-[#8B4513]/10">
                    <p className="text-3xl font-black cinzel text-[#8B4513] tracking-[0.6em] uppercase">Bhaskara Hub SIDDIPET 8K PRO</p>
                  </div>
                </div>
              </div>

              {/* Day Analysis Sidebar */}
              <div className="lg:col-span-7 space-y-12 no-print">
                <div className="bg-[#0f172a] border-[16px] border-white/5 rounded-[7rem] p-20 space-y-16 shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent pointer-events-none"></div>
                   
                   <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b-8 border-white/5 pb-12 relative z-10">
                      <div className="space-y-4">
                        <h4 className="text-[100px] font-black tiro text-white leading-none">ముహూర్త దర్పణం</h4>
                        <p className="text-red-500 text-4xl font-black tiro uppercase mt-4 tracking-widest flex items-center gap-4">
                           <span className="material-icons text-5xl">verified</span> సిద్దిపేట ప్రాంతీయ పంచాంగం
                        </p>
                      </div>
                      <div className="bg-red-600 text-white px-12 py-6 rounded-full text-4xl font-black cinzel shadow-2xl transform rotate-2 hover:rotate-0 transition-transform cursor-default">
                        {selectedDate}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                      {[
                        { l: 'రాహుకాలం', v: dayData.rahukalam, i: 'block', c: 'text-red-500', bg: 'bg-red-500/10' },
                        { l: 'యమగండం', v: dayData.yamagandam, i: 'dangerous', c: 'text-red-500', bg: 'bg-red-500/10' },
                        { l: 'గుళికా కాలం', v: dayData.gulika, i: 'brightness_low', c: 'text-amber-500', bg: 'bg-amber-500/10' },
                        { l: 'అభిజిత్ ముహూర్తం', v: dayData.abhijit || '11:45 - 12:35', i: 'verified', c: 'text-emerald-500', bg: 'bg-emerald-500/10' }
                      ].map(item => (
                        <div key={item.l} className={`${item.bg} border-4 border-white/10 rounded-[4rem] p-12 flex flex-col items-center gap-8 group hover:border-white/30 transition-all shadow-inner`}>
                           <span className={`material-icons text-[120px] ${item.c} group-hover:scale-110 transition-transform`}>{item.i}</span>
                           <div className="text-center space-y-2">
                              <p className="text-3xl font-black tiro text-slate-500 uppercase tracking-widest">{item.l}</p>
                              <p className={`text-6xl font-black cinzel ${item.c} drop-shadow-sm`}>{item.v}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                   
                   <div className="bg-black/60 border-4 border-white/10 rounded-[5rem] p-16 space-y-10 shadow-3xl relative z-10">
                      <h5 className="text-5xl font-black tiro text-red-500 flex items-center gap-6">
                        <span className="material-icons text-6xl animate-pulse">history_edu</span> వేద సందేశం
                      </h5>
                      <p className="text-slate-200 text-5xl leading-[2.2] tiro text-justify font-bold italic drop-shadow-lg">
                        "కాలమే పరబ్రహ్మ స్వరూపము. ప్రతి క్షణము పవిత్రమైనదే, కానీ ముహూర్త నిర్ణయము ద్వారా మన కర్మలు సత్ఫలితాలను ఇస్తాయి."
                      </p>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-8 relative z-10">
                      <button onClick={handlePrint} className="w-full py-16 bg-red-700 text-white rounded-[4rem] font-black tiro text-6xl shadow-3xl hover:bg-red-600 transition-all border-b-[32px] border-red-950 flex items-center justify-center gap-10 group active:scale-95">
                         <span className="material-icons text-[120px] group-hover:scale-125 transition-transform">file_download</span>
                         SAVE 8K
                      </button>
                      <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`నేటి సిద్దిపేట పంచాంగం:\nతేదీ: ${dayData.date}\nతిథి: ${dayData.tithi}\nనక్షత్రం: ${dayData.nakshatram}\nసూర్యోదయం: ${dayData.sunrise}`)}`, '_blank')} className="w-full py-16 bg-emerald-600 text-white rounded-[4rem] font-black tiro text-6xl shadow-3xl hover:bg-emerald-500 transition-all border-b-[32px] border-emerald-950 flex items-center justify-center gap-10 group active:scale-95">
                         <span className="material-icons text-[120px] group-hover:animate-bounce">whatsapp</span>
                         SHARE
                      </button>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          #calendar-poster { 
            width: 1080px !important; 
            height: 1920px !important;
            max-width: none !important;
            aspect-ratio: 9/16 !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            margin: 0 !important;
            padding: 80px !important;
            border: none !important;
            border-radius: 0 !important;
            background-color: #FFF8E1 !important;
          }
          body { background: white !important; }
          @page { size: 1080px 1920px; margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default HinduCalendarHub;
