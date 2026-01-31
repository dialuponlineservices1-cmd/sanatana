
import React, { useState, useEffect } from 'react';
import { ClientRecord } from '../types';

const ClientManager: React.FC = () => {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [newClient, setNewClient] = useState({
    name: '',
    dob: '',
    time: '',
    place: '',
    notes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('internal_clients');
    if (saved) setClients(JSON.parse(saved));
  }, []);

  const saveClients = (data: ClientRecord[]) => {
    setClients(data);
    localStorage.setItem('internal_clients', JSON.stringify(data));
  };

  const handleAdd = () => {
    if (!newClient.name) return;
    const client: ClientRecord = {
      ...newClient,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    saveClients([client, ...clients]);
    setNewClient({ name: '', dob: '', time: '', place: '', notes: '' });
    setIsAdding(false);
  };

  const deleteClient = (id: string) => {
    if (confirm("ఖచ్చితంగా తొలగించాలా?")) {
      saveClients(clients.filter(c => c.id !== id));
    }
  };

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.place.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-[#1e293b]/50 p-10 rounded-[4rem] border border-slate-800 shadow-2xl">
        <div className="space-y-2">
           <h3 className="text-6xl font-black tiro text-white">గ్రాహకుల వివరాలు (Internal Database)</h3>
           <p className="text-slate-400 text-2xl font-bold tiro">మీరు సేవ్ చేసిన జాతక వివరాలన్నీ ఇక్కడ భద్రంగా ఉంటాయి.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-12 py-6 bg-orange-600 text-white font-black rounded-3xl text-3xl shadow-xl hover:bg-orange-500 transition-all flex items-center gap-4"
        >
          <span className="material-icons text-5xl">{isAdding ? 'close' : 'person_add'}</span>
          {isAdding ? 'రద్దు చేయి' : 'కొత్త గ్రాహకుని చేర్చు'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#0f172a] border-4 border-orange-500/20 rounded-[5rem] p-16 space-y-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-10">
           <div className="grid md:grid-cols-2 gap-8">
              <input placeholder="పేరు (Client Name)" className="bg-slate-900 border border-slate-700 p-8 rounded-3xl text-3xl tiro outline-none focus:border-orange-500" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
              <input type="date" className="bg-slate-900 border border-slate-700 p-8 rounded-3xl text-3xl outline-none focus:border-orange-500" value={newClient.dob} onChange={e => setNewClient({...newClient, dob: e.target.value})} />
              <input type="time" className="bg-slate-900 border border-slate-700 p-8 rounded-3xl text-3xl outline-none focus:border-orange-500" value={newClient.time} onChange={e => setNewClient({...newClient, time: e.target.value})} />
              <input placeholder="పుట్టిన ప్రదేశం (Birth Place)" className="bg-slate-900 border border-slate-700 p-8 rounded-3xl text-3xl tiro outline-none focus:border-orange-500" value={newClient.place} onChange={e => setNewClient({...newClient, place: e.target.value})} />
              <textarea placeholder="ముఖ్యమైన గమనికలు (Notes)" className="md:col-span-2 bg-slate-900 border border-slate-700 p-8 rounded-3xl text-3xl tiro outline-none focus:border-orange-500 min-h-[150px]" value={newClient.notes} onChange={e => setNewClient({...newClient, notes: e.target.value})} />
           </div>
           <button onClick={handleAdd} className="w-full py-8 bg-emerald-600 text-white rounded-3xl font-black text-4xl shadow-xl border-b-8 border-emerald-900">సేవ్ చేయండి (Save Record)</button>
        </div>
      )}

      <div className="relative group max-w-4xl mx-auto">
        <span className="material-icons absolute left-10 top-1/2 -translate-y-1/2 text-5xl text-slate-600">search</span>
        <input 
          placeholder="గ్రాహకుని పేరుతో వెతకండి..." 
          className="w-full bg-slate-900 border-2 border-slate-800 p-10 pl-24 rounded-full text-4xl tiro outline-none focus:border-orange-500 shadow-inner" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-10">
        {filtered.map(client => (
          <div key={client.id} className="bg-[#1e293b] border border-slate-800 rounded-[4rem] p-12 hover:border-orange-500/50 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-40 transition-opacity">
               <span className="material-icons text-[15rem] text-slate-500">account_circle</span>
             </div>
             
             <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                   <h4 className="text-5xl font-black tiro text-orange-500">{client.name}</h4>
                   <button onClick={() => deleteClient(client.id)} className="text-slate-600 hover:text-red-500 transition-colors">
                     <span className="material-icons text-5xl">delete</span>
                   </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6 pt-4">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date of Birth</p>
                      <p className="text-2xl font-black cinzel">{client.dob}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Birth Time</p>
                      <p className="text-2xl font-black cinzel">{client.time}</p>
                   </div>
                   <div className="col-span-2 space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Place</p>
                      <p className="text-3xl font-black tiro text-slate-300">{client.place}</p>
                   </div>
                </div>

                {client.notes && (
                  <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <p className="text-2xl tiro italic text-slate-400">"{client.notes}"</p>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                   <button className="flex-1 py-4 bg-slate-800 text-slate-300 rounded-2xl font-black text-xl hover:bg-orange-600 hover:text-white transition-all">VIEW CHART</button>
                   <button className="flex-1 py-4 bg-slate-800 text-slate-300 rounded-2xl font-black text-xl hover:bg-emerald-600 hover:text-white transition-all">POSTER GEN</button>
                </div>
             </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-40 text-center space-y-8 opacity-20">
             <span className="material-icons text-[200px]">person_off</span>
             <p className="text-5xl font-black tiro">గ్రాహకులు ఎవరూ లేరు.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManager;
