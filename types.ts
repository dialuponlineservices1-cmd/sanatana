
export enum AppTab {
  GENERATOR = 'GENERATOR',
  MAHARSHIS = 'MAHARSHIS',
  TEMPLES = 'TEMPLES',
  PANDUGALU = 'PANDUGALU',
  SPECIAL_DAYS = 'SPECIAL_DAYS',
  MORAL_STORIES = 'MORAL_STORIES',
  KIDS_STORIES = 'KIDS_STORIES',
  DAILY_QUOTES = 'DAILY_QUOTES',
  DHARMA_QA = 'DHARMA_QA',
  ASTROLOGY = 'ASTROLOGY',
  JATHAKAM = 'JATHAKAM',
  VASTU = 'VASTU',
  SANKHYA = 'SANKHYA',
  LIBRARY = 'LIBRARY',
  PANCHANGAM = 'PANCHANGAM',
  VEDIC_HUB = 'VEDIC_HUB',
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
  rituals?: string;
  tag: string;
  slogan: string;
  imageUrl?: string;
  whatsappFormat?: string;
  authorName?: string;
  authorPhone?: string;
  authorRole?: string;
  qrUrl?: string;
  authorPhotoUrl?: string;
  isRahasya?: boolean;
  groupName?: string;
}

export interface Branding {
  name: string;
  phone: string;
  role: string;
  photoUrl: string;
  qrUrl: string;
  groupName?: string;
}

export type ScriptureCategory = 
  | 'Veda' 
  | 'Upanishad' 
  | 'Purana' 
  | 'Itihasa' 
  | 'Tantra' 
  | 'Agama' 
  | 'Sutra' 
  | 'Stotram' 
  | 'Siddhar' 
  | 'Darshana' 
  | 'Secret' 
  | 'Smriti' 
  | 'Aghora'
  | 'Yoga'
  | 'Vedanga'
  | 'Architecture'
  | 'Vastu';

export interface Scripture {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ScriptureCategory;
  rahasyaLevel: number; // 1-10
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
  grahaNilaya: Array<{ graha: string; raasi: string; position: string }>;
  predictions: {
    character: string;
    career: string;
    health: string;
    remedies: string;
  };
  fullReport: string;
}
