
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}

interface Window {
  webkitAudioContext: typeof AudioContext;
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

// Fix: Removed redundant 'process' declaration that was causing type conflicts with global NodeJS types.
