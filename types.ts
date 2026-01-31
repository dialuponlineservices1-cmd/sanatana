
export enum AppTab {
  GENERATOR = 'GENERATOR',
  DHARMA_HUB = 'DHARMA_HUB',
  SANATANA_DHARMA = 'SANATANA_DHARMA',
  SAMSAYA_SAMADHANAM = 'SAMSAYA_SAMADHANAM',
  RISHI_HUB = 'RISHI_HUB',
  VASTU = 'VASTU',
  MORAL_STORIES = 'MORAL_STORIES',
  KIDS_STORIES = 'KIDS_STORIES',
  PANDUGALU = 'PANDUGALU',
  SPECIAL_DAYS = 'SPECIAL_DAYS',
  LIBRARY = 'LIBRARY',
  PANCHANGAM = 'PANCHANGAM',
  AI_CHAT = 'AI_CHAT',
  BRANDING = 'BRANDING'
}

export type OutputMode = 'STORY' | 'TEMPLATE';

export interface PostContent {
  title: string;
  subtitle: string;
  sloka?: string;
  body: string;
  conclusion: string;
  tag: string;
  slogan: string;
  backgroundKeyword: string;
  whatsappFormat: string;
  authorName?: string;
  authorPhone?: string;
  authorRole?: string;
  qrUrl?: string;
  authorPhotoUrl?: string;
  location?: string;
}

export interface SamsayaResult {
  problemSummary: string;
  scriptureSource: string; // Ramayana / Mahabharatha / Gita
  context: string; // Historical event context
  sloka: string;
  meaning: string;
  solution: string;
  divineMessage: string;
  backgroundKeyword: string;
}

export interface Branding {
  name: string;
  phone: string;
  role: string;
  photoUrl: string;
  qrUrl: string;
  location: string;
}

export interface Scripture {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rahasyaLevel: number;
}

export interface PresetItem {
  id: string;
  name: string;
  icon: string;
}

export interface Maharshi {
  id: string;
  name: string;
  teluguName: string;
  icon: string;
  description: string;
}

export interface Temple {
  id: string;
  name: string;
  teluguName: string;
  icon: string;
  description: string;
  location: string;
}

export interface PanchangamData {
  date: string;
  teluguYear: string;
  ayanam: string;
  rutuvu: string;
  masam: string;
  paksham: string;
  tithi: string;
  nakshatram: string;
  yogam: string;
  karanam: string;
  sunrise: string;
  sunset: string;
  rahukalam: string;
  yamagandam: string;
  gulika: string;
  abhijit: string;
  specialty?: string;
}

export interface JathakamResult {
  personalDetails: {
    name: string;
    dob: string;
    time: string;
    place: string;
  };
  panchangam: {
    tithi: string;
    nakshatram: string;
    raasi: string;
    lagnam: string;
    yogam: string;
  };
  predictions: {
    character: string;
    career: string;
    health: string;
    remedies: string;
  };
}
