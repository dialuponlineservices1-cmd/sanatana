
import { GoogleGenAI, Type } from "@google/genai";
import { PostContent, PanchangamData, JathakamResult, OutputMode, SamsayaResult, NumerologyResult, RaasiResult } from "../types";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Zodiac Prediction Logic
export const generateRaasiPrediction = async (raasi: string): Promise<RaasiResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Detailed Vedic Horoscope analysis for ${raasi} raasi for current month/time. Provide prediction, health, wealth, lucky number, and remedy in Telugu. Ensure scholarly tone.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          raasi: { type: Type.STRING },
          prediction: { type: Type.STRING },
          health: { type: Type.STRING },
          wealth: { type: Type.STRING },
          luckyNumber: { type: Type.STRING },
          remedy: { type: Type.STRING }
        },
        required: ['raasi', 'prediction', 'health', 'wealth', 'luckyNumber', 'remedy']
      }
    }
  });
  return JSON.parse(response.text.trim() || '{}') as RaasiResult;
};

// Numerology Logic
export const generateNumerologyReport = async (name: string, dob: string): Promise<NumerologyResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Deep Numerology analysis for ${name || 'User'} born on ${dob}. Calculate Birth and Destiny numbers. Provide deep analysis of career, character, and remedies in Telugu.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          birthNumber: { type: Type.NUMBER },
          destinyNumber: { type: Type.NUMBER },
          description: { type: Type.STRING },
          luckyColors: { type: Type.STRING },
          luckyDays: { type: Type.STRING },
          remedies: { type: Type.STRING }
        },
        required: ['birthNumber', 'destinyNumber', 'description', 'luckyColors', 'luckyDays', 'remedies']
      }
    }
  });
  return JSON.parse(response.text.trim() || '{}') as NumerologyResult;
};

// Jathakam Logic
// Added missing function to handle full Vedic Astrology calculations
export const generateFullJathakam = async (name: string, dob: string, time: string, place: string): Promise<JathakamResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Deep Vedic Astrology Jathakam analysis for ${name}, born on ${dob} at ${time} in ${place}. Provide full analysis including Panchangam details (Tithi, Nakshatram, Raasi, Lagnam, Yogam) and predictions (Character, Career, Health, Remedies) in Telugu.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personalDetails: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING }
            },
            required: ['name']
          },
          panchangam: {
            type: Type.OBJECT,
            properties: {
              tithi: { type: Type.STRING },
              nakshatram: { type: Type.STRING },
              raasi: { type: Type.STRING },
              lagnam: { type: Type.STRING },
              yogam: { type: Type.STRING }
            },
            required: ['tithi', 'nakshatram', 'raasi', 'lagnam', 'yogam']
          },
          predictions: {
            type: Type.OBJECT,
            properties: {
              character: { type: Type.STRING },
              career: { type: Type.STRING },
              health: { type: Type.STRING },
              remedies: { type: Type.STRING }
            },
            required: ['character', 'career', 'health', 'remedies']
          }
        },
        required: ['personalDetails', 'panchangam', 'predictions']
      }
    }
  });
  return JSON.parse(response.text.trim() || '{}') as JathakamResult;
};

// Generate content for spiritual posters or stories with deep reasoning
export const generateSpiritualPost = async (
  prompt: string, 
  category: string, 
  includeSloka: boolean, 
  isQA: boolean = false,
  isRahasya: boolean = false,
  outputMode: OutputMode = 'STORY'
): Promise<PostContent> => {
  const ai = getAI();
  
  const systemInstruction = `
    You are the 'Supreme Divine Content Architect' and 'Universal Dharmic Scholar'. 
    Output MUST be in high-fidelity, scholarly Telugu script.
    
    SPECIALIZATION RULES:
    1. If Category is 'NITHI_KATHALU': Focus on moral values, Panchatantra style, and clear wisdom.
    2. If Category is 'PILLALA_KATHALU': Use simple, engaging, magical, and colorful language.
    3. If Category is 'MOTIVATIONAL_KATHALU': Focus on willpower, hard work, success, and powerful inspiration.
    4. If Category is 'Dharma' or 'Spiritual': Use deep Vedic vocabulary.
    
    TASK: Generate data for a professional 8K spiritual poster or an immersive long-form story.
    - Title: Bold, divine headline.
    - Subtitle: Profound philosophical context.
    - Tag: Divine source or category.
    - Slogan: Impactful ribbon text.
    - Sloka: Sanskrit sloka only if 'includeSloka' is true.
    - Body: Deeply researched, scholarly, and impactful matter.
    - Conclusion: Moral or powerful takeaway message.
    - BackgroundKeyword: One specific English keyword for image selection.
    
    Output format: JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Topic: ${prompt}. Category: ${category}. Output Mode: ${outputMode}. Include Sloka: ${includeSloka}. Generate deep, advanced content.`,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          sloka: { type: Type.STRING },
          body: { type: Type.STRING },
          conclusion: { type: Type.STRING },
          tag: { type: Type.STRING },
          slogan: { type: Type.STRING },
          backgroundKeyword: { type: Type.STRING },
          whatsappFormat: { type: Type.STRING }
        },
        required: ['title', 'subtitle', 'body', 'conclusion', 'tag', 'slogan', 'backgroundKeyword', 'whatsappFormat']
      },
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });

  return JSON.parse(response.text.trim() || '{}') as PostContent;
};

export const solveSamsaya = async (query: string): Promise<SamsayaResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Samsaya: ${query}. Provide scriptural solution with sloka and context in Telugu.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          problemSummary: { type: Type.STRING },
          scriptureSource: { type: Type.STRING },
          context: { type: Type.STRING },
          sloka: { type: Type.STRING },
          meaning: { type: Type.STRING },
          solution: { type: Type.STRING },
          divineMessage: { type: Type.STRING },
          backgroundKeyword: { type: Type.STRING }
        },
        required: ['problemSummary', 'scriptureSource', 'context', 'sloka', 'meaning', 'solution', 'divineMessage', 'backgroundKeyword']
      }
    }
  });
  return JSON.parse(response.text.trim() || '{}') as SamsayaResult;
};

export const getDailyPanchangam = async (date: string): Promise<PanchangamData> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Daily Telugu Panchangam for ${date}.`,
    config: { 
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          teluguYear: { type: Type.STRING },
          ayanam: { type: Type.STRING },
          rutuvu: { type: Type.STRING },
          masam: { type: Type.STRING },
          paksham: { type: Type.STRING },
          tithi: { type: Type.STRING },
          nakshatram: { type: Type.STRING },
          yogam: { type: Type.STRING },
          karanam: { type: Type.STRING },
          sunrise: { type: Type.STRING },
          sunset: { type: Type.STRING },
          rahukalam: { type: Type.STRING },
          yamagandam: { type: Type.STRING },
          gulika: { type: Type.STRING },
          abhijit: { type: Type.STRING },
          specialty: { type: Type.STRING },
        },
        required: ['date', 'teluguYear', 'ayanam', 'rutuvu', 'masam', 'paksham', 'tithi', 'nakshatram', 'sunrise', 'sunset', 'rahukalam']
      }
    }
  });
  return JSON.parse(response.text.trim() || '{}') as PanchangamData;
};
