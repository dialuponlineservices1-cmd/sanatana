
// Augment the existing global Process and ProcessEnv interfaces to avoid redeclaration conflicts
// with existing definitions (e.g., from @types/node or other environment types).
interface ProcessEnv {
  API_KEY: string;
}

interface Process {
  env: ProcessEnv;
}

interface Window {
  webkitAudioContext: typeof AudioContext;
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}
