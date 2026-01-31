
import React, { useState, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

const LiveConsultation: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Idle');
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
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('Live');
            setIsActive(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session: any) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscript(prev => [...prev.slice(-5), `Rishi: ${text}`]);
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
            console.error(e);
            setStatus('Error');
          },
          onclose: () => {
            setStatus('Closed');
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: 'You are a scholarly Vedic Rishi. Speak only in deep Telugu. Provide spiritual guidance and astrological wisdom. Be compassionate and wise.',
          outputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Failed to Start');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
    }
    setIsActive(false);
    setStatus('Idle');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-700">
      <div className="bg-slate-900 border-[12px] border-red-900/30 rounded-[6rem] p-16 text-center space-y-12 shadow-2xl relative overflow-hidden">
        <div className={`absolute top-0 right-0 p-10 transition-colors ${isActive ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
          <span className="material-icons text-[20rem]">graphic_eq</span>
        </div>

        <header className="relative z-10 space-y-4">
          <h2 className="text-7xl font-black tiro text-white uppercase tracking-tighter">దివ్య వాణి (Live Rishi)</h2>
          <p className="text-red-400 font-bold text-2xl tiro italic">రియల్-టైమ్ వాయిస్ కన్సల్టేషన్ - నేరుగా AI తో మాట్లాడండి.</p>
          <div className="flex justify-center gap-4 mt-8">
            <span className={`px-8 py-2 rounded-full font-black text-white text-xl uppercase tracking-widest flex items-center gap-2 ${isActive ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)]' : 'bg-slate-800'}`}>
              <span className={`w-4 h-4 rounded-full bg-white ${isActive ? 'animate-ping' : ''}`}></span>
              {status}
            </span>
          </div>
        </header>

        <div className="relative z-10 bg-black/40 rounded-[4rem] p-12 min-h-[300px] flex flex-col items-center justify-center border-4 border-white/5">
          {isActive ? (
            <div className="w-full space-y-6">
              <div className="flex justify-center gap-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-2 bg-red-500 rounded-full animate-bounce" style={{ height: `${Math.random() * 80 + 20}px`, animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
              <div className="mt-8 space-y-4 text-left px-8">
                {transcript.map((line, i) => (
                  <p key={i} className="text-2xl tiro text-white/80 font-bold leading-tight border-l-4 border-red-600 pl-4">{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-8">
               <span className="material-icons text-[150px] text-slate-700">mic_off</span>
               <p className="text-3xl tiro text-slate-500 font-black">ప్రారంభించడానికి క్రింది బటన్ నొక్కండి.</p>
            </div>
          )}
        </div>

        <div className="relative z-10 flex justify-center pt-8">
          {!isActive ? (
            <button 
              onClick={startSession}
              className="px-24 py-10 bg-red-600 text-white rounded-[4rem] font-black cinzel text-4xl shadow-2xl hover:bg-red-500 active:scale-95 transition-all border-b-[20px] border-red-900"
            >
              START LIVE CONSULTATION
            </button>
          ) : (
            <button 
              onClick={stopSession}
              className="px-24 py-10 bg-slate-800 text-white rounded-[4rem] font-black cinzel text-4xl shadow-2xl hover:bg-slate-700 active:scale-95 transition-all border-b-[20px] border-black"
            >
              STOP SESSION
            </button>
          )}
        </div>
      </div>

      <div className="bg-amber-950/20 border-4 border-amber-900/30 rounded-[4rem] p-12 space-y-6">
         <h4 className="text-3xl font-black tiro text-amber-500 flex items-center gap-4">
            <span className="material-icons">info</span> దివ్య సూచనలు
         </h4>
         <ul className="text-xl tiro text-slate-400 space-y-2 list-disc pl-8 font-bold">
            <li>AI తో మాట్లాడేటప్పుడు స్పష్టంగా మరియు నెమ్మదిగా మాట్లాడండి.</li>
            <li>ఇది ఒక అత్యాధునిక జ్యోతిష్య విశ్లేషణ వ్యవస్థ. మీ వ్యక్తిగత సలహాల కోసం వాడవచ్చు.</li>
            <li>సంభాషణ ముగిసిన తర్వాత 'STOP SESSION' నొక్కడం మర్చిపోకండి.</li>
         </ul>
      </div>
    </div>
  );
};

export default LiveConsultation;
