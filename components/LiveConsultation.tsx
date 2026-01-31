
import React, { useState, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

const LiveConsultation: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('సిద్ధంగా ఉంది (Idle)');
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const createBlob = (data: Float32Array): Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      // Clamp values to prevent distortion
      int16[i] = Math.max(-1, Math.min(1, data[i])) * 32767;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    try {
      setStatus('కనెక్ట్ అవుతోంది...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        throw new Error("ఈ బ్రౌజర్‌లో ఆడియో సదుపాయం లేదు.");
      }

      audioContextRef.current = new AudioCtx({ sampleRate: 16000 });
      outputAudioContextRef.current = new AudioCtx({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('లైవ్ కనెక్షన్ (Active)');
            setIsActive(true);
            if (!audioContextRef.current) return;
            const source = audioContextRef.current.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session: any) => {
                if (session && typeof session.sendRealtimeInput === 'function') {
                  session.sendRealtimeInput({ media: pcmBlob });
                }
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscript(prev => [...prev.slice(-4), `ఋషి: ${text}`]);
            }
            
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Session Error:', e);
            setStatus('కనెక్షన్ విఫలమైంది (Error)');
          },
          onclose: () => {
            setStatus('ముగిసింది (Closed)');
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: 'You are Bhaskara, a wise Vedic Rishi. Speak only in scholarly Telugu. Provide astrological insights and spiritual peace. Be concise but profound.',
          outputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Start Session Failed:', err);
      setStatus('ప్రారంభించలేకపోయాము (Failed)');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e) {}
    }
    setIsActive(false);
    setStatus('సిద్ధంగా ఉంది (Idle)');
    setTranscript([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-700">
      <div className="bg-[#0f172a] border-[12px] border-orange-900/40 rounded-[6rem] p-12 md:p-20 text-center space-y-14 shadow-2xl relative overflow-hidden">
        {/* Decorative Background Icon */}
        <div className={`absolute -top-32 -right-32 opacity-[0.03] transition-colors pointer-events-none ${isActive ? 'text-orange-500' : 'text-slate-600'}`}>
          <span className="material-icons text-[40rem]">settings_voice</span>
        </div>

        <header className="relative z-10 space-y-4">
          <h2 className="text-7xl md:text-9xl font-black tiro text-white uppercase tracking-tighter drop-shadow-2xl">దివ్య వాణి (Live)</h2>
          <p className="text-orange-500 font-black text-2xl md:text-4xl tiro italic tracking-wide">రియల్-టైమ్ వాయిస్ కన్సల్టేషన్</p>
          <div className="flex justify-center gap-4 mt-12">
            <div className={`px-10 py-4 rounded-full font-black text-white text-xl md:text-2xl uppercase tracking-widest flex items-center gap-4 shadow-2xl transition-all duration-500 ${isActive ? 'bg-red-600 ring-8 ring-red-600/20' : 'bg-slate-800'}`}>
              <span className={`w-5 h-5 rounded-full bg-white ${isActive ? 'animate-ping' : ''}`}></span>
              {status}
            </div>
          </div>
        </header>

        <div className="relative z-10 bg-black/60 backdrop-blur-3xl rounded-[5rem] p-12 min-h-[400px] flex flex-col items-center justify-center border-4 border-white/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
          {isActive ? (
            <div className="w-full space-y-10">
              <div className="flex justify-center items-end gap-4 h-32 mb-10">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-4 bg-orange-600 rounded-full animate-pulse shadow-[0_0_20px_rgba(234,88,12,0.5)]" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.05}s` }}></div>
                ))}
              </div>
              <div className="space-y-6 text-left px-4 md:px-12">
                {transcript.length > 0 ? transcript.map((line, i) => (
                  <div key={i} className="animate-in slide-in-from-left-10 duration-500">
                    <p className="text-3xl md:text-4xl tiro text-orange-50 font-black leading-tight border-l-[12px] border-orange-600 pl-8 py-4 bg-white/5 rounded-r-3xl">{line}</p>
                  </div>
                )) : (
                  <p className="text-center text-slate-500 tiro text-3xl italic animate-pulse">ఋషి సమాధానం కోసం వేచి ఉంది...</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-10 group">
               <div className="w-56 h-56 bg-slate-900 rounded-full flex items-center justify-center mx-auto border-8 border-slate-800 shadow-2xl group-hover:border-orange-600 group-hover:scale-110 transition-all duration-700">
                  <span className="material-icons text-9xl text-slate-700 group-hover:text-orange-500">mic_none</span>
               </div>
               <p className="text-3xl md:text-4xl tiro text-slate-400 font-black tracking-tight">ప్రారంభించడానికి క్రింది బటన్ క్లిక్ చేయండి.</p>
            </div>
          )}
        </div>

        <div className="relative z-10 flex justify-center pt-10">
          {!isActive ? (
            <button 
              onClick={startSession}
              className="px-20 md:px-32 py-10 md:py-14 bg-orange-600 text-white rounded-[5rem] font-black cinzel text-4xl md:text-5xl shadow-[0_20px_60px_rgba(234,88,12,0.4)] hover:bg-orange-500 active:scale-95 transition-all border-b-[20px] border-orange-950 uppercase tracking-widest"
            >
              START LIVE CONSULTATION
            </button>
          ) : (
            <button 
              onClick={stopSession}
              className="px-20 md:px-32 py-10 md:py-14 bg-slate-900 text-white rounded-[5rem] font-black cinzel text-4xl md:text-5xl shadow-2xl hover:bg-slate-800 active:scale-95 transition-all border-b-[20px] border-black uppercase tracking-widest"
            >
              END SESSION
            </button>
          )}
        </div>
      </div>

      <div className="bg-orange-950/20 border-4 border-orange-900/30 rounded-[5rem] p-12 space-y-8 shadow-xl">
         <h4 className="text-4xl font-black tiro text-orange-500 flex items-center gap-6">
            <span className="material-icons text-5xl">info_outline</span> దివ్య సూచనలు (Instructions)
         </h4>
         <ul className="text-2xl md:text-3xl tiro text-slate-400 space-y-6 list-disc pl-12 font-bold leading-relaxed">
            <li>మైక్రోఫోన్ అనుమతి (Access) అడిగినప్పుడు 'Allow' క్లిక్ చేయండి.</li>
            <li>నిశ్శబ్ద వాతావరణంలో ఉంటే ఫలితాలు మెరుగ్గా ఉంటాయి.</li>
            <li>ప్రశ్న అడిగిన తర్వాత కొద్దిసేపు వేచి ఉండండి, ఋషి సమాధానం ఇస్తారు.</li>
            <li>మీ సంభాషణ పూర్తిగా గోప్యంగా ఉంటుంది.</li>
         </ul>
      </div>
    </div>
  );
};

export default LiveConsultation;
