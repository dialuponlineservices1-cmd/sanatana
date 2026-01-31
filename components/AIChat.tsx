
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'నమస్కారం వత్స! నేను మీ ఆధ్యాత్మిక సహాయకుడిని. ధర్మం, జ్యోతిష్యం లేదా వేదాల గురించి మీ సందేహాలను నాతో చర్చించండి.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Voice setup
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = 'te-IN';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev.trim() + ' ' + transcript).trim());
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  }

  const toggleListening = () => {
    if (!recognition) { alert("Voice not supported"); return; }
    if (isListening) recognition.stop(); else { setIsListening(true); recognition.start(); }
  };

  const scrollToBottom = () => endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      // Use process.env.API_KEY directly as specified in the guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: 'You are an enlightened Rishi. Reply in deep, scholarly Telugu. Use spiritual metaphors.',
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || 'Error.' }]);
    } catch (err) { setMessages(prev => [...prev, { role: 'ai', text: 'Connection failed.' }]); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] max-w-6xl mx-auto bg-white border-8 border-orange-100 rounded-[5rem] shadow-2xl overflow-hidden relative">
      <div className="h-4 bg-gradient-to-r from-orange-600 to-amber-500"></div>

      <div className="p-10 border-b-4 border-orange-50 flex items-center justify-between bg-orange-50/20">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 rounded-[2rem] bg-orange-600 flex items-center justify-center shadow-xl">
            <span className="material-icons text-white text-5xl">psychology</span>
          </div>
          <div>
            <h3 className="text-5xl font-black text-orange-800 cinzel tracking-tighter">RISHI AI COMMAND</h3>
            <p className="text-xl font-black text-orange-400 uppercase tracking-widest mt-2">Voice Sync Enabled</p>
          </div>
        </div>
        <button onClick={toggleListening} className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-600 text-white animate-pulse shadow-xl' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}>
           <span className="material-icons text-5xl">{isListening ? 'mic' : 'mic_none'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-orange-50/10">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${m.role === 'user' ? 'bg-orange-600 text-white rounded-[4rem] rounded-tr-none' : 'bg-white border-4 border-orange-100 text-orange-950 rounded-[4rem] rounded-tl-none'} p-10 shadow-xl`}>
              <p className="tiro text-4xl leading-relaxed font-black">{m.text}</p>
              <span className="mt-4 text-[12px] font-black uppercase tracking-widest opacity-50 block">{m.role === 'user' ? 'Admin Input' : 'Rishi Response'}</span>
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="bg-white border-4 border-orange-100 rounded-full p-8 flex gap-4"><div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div><div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></div></div></div>}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-12 border-t-4 border-orange-50 bg-white">
        <div className="flex gap-8 items-center bg-orange-50 border-4 border-orange-100 rounded-[4rem] p-6 focus-within:bg-white focus-within:border-orange-500 transition-all shadow-inner">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="ధర్మం గురించి మీ సందేహాన్ని అడగండి..." className="flex-1 bg-transparent border-none px-8 py-4 focus:outline-none text-orange-900 tiro text-4xl font-black placeholder:text-orange-200" />
          <button onClick={handleSend} disabled={loading} className="w-24 h-24 bg-orange-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl hover:brightness-110 active:scale-90 transition-all">
            <span className="material-icons text-6xl">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
