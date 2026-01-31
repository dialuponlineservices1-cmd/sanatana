
import { GoogleGenAI, Type } from "@google/genai";
import { PostContent, PanchangamData, JathakamResult, OutputMode, SamsayaResult, NumerologyResult, RaasiResult } from "../types";

// Global cache to prevent duplicate calls for identical requests
const responseCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes cache

// Modified to strictly use process.env.API_KEY as per guidelines
export const getApiKey = () => {
  return process.env.API_KEY || "";
};

const getFreshAI = () => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API_KEY_MISSING");
  return new GoogleGenAI({ apiKey });
};

export const validateApiKey = async (key: string): Promise<boolean> => {
  if (!key || key.length < 10) return false;
  
  // Check local validation cache first
  const cacheKey = `val_${key.substring(0, 10)}`;
  const cachedVal = localStorage.getItem(cacheKey);
  if (cachedVal) {
    const { valid, timestamp } = JSON.parse(cachedVal);
    if (Date.now() - timestamp < 3600000) return valid; // Valid for 1 hour
  }

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: 'hi',
      config: { 
        maxOutputTokens: 1,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    localStorage.setItem(cacheKey, JSON.stringify({ valid: true, timestamp: Date.now() }));
    return true;
  } catch (e: any) {
    if (e.message?.includes('429')) {
      throw new Error("API_LIMIT");
    }
    return false;
  }
};

const cleanJSONResponse = (text: string): string => {
  if (!text) return "{}";
  let cleaned = text.trim();
  if (cleaned.includes("```")) {
    cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "").trim();
  }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    return cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
};

async function callGemini(params: {
  contents: string;
  systemInstruction?: string;
  schema: any;
  usePro?: boolean;
}) {
  // Generate a unique key for caching based on the request parameters
  const requestKey = JSON.stringify({ c: params.contents, i: params.systemInstruction });
  const cached = responseCache.get(requestKey);
  
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log("Returning cached Vedic response...");
    return cached.data;
  }

  const ai = getFreshAI();
  const modelsToTry = params.usePro 
    ? ['gemini-3-pro-preview'] 
    : ['gemini-3-flash-preview', 'gemini-flash-lite-latest'];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction || "You are a Divine Vedic Maharshi. Scholarly Telugu. Reveal hidden secrets.",
          responseMimeType: 'application/json',
          responseSchema: params.schema,
          thinkingConfig: modelName.includes('pro') ? { thinkingBudget: 32768 } : undefined
        }
      });
      
      const result = JSON.parse(cleanJSONResponse(response.text || "{}"));
      
      // Store in cache
      responseCache.set(requestKey, { data: result, timestamp: Date.now() });
      return result;
      
    } catch (err: any) {
      lastError = err;
      if (err.message?.includes('429')) {
        throw new Error("API_LIMIT");
      }
      if (err.message?.includes('403') || err.message?.includes('401')) {
        throw new Error("API_INVALID");
      }
      console.warn(`Model ${modelName} failed, trying next...`);
    }
  }

  throw lastError || new Error("UNKNOWN_ERROR");
}

export const generateSpiritualPost = async (
  prompt: string, 
  category: string, 
  includeSloka: boolean, 
  isQA: boolean = false,
  isRahasya: boolean = false,
  outputMode: OutputMode = 'STORY'
): Promise<PostContent> => {
  return await callGemini({
    usePro: true,
    contents: `Topic: ${prompt}. Category: ${category}. Mode: ${outputMode}. Reveal DEEP SECRETS. JSON output.`,
    schema: {
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
    }
  });
};

export const getDailyPanchangam = async (date: string): Promise<PanchangamData> => {
  return await callGemini({
    contents: `Daily Telugu Panchangam for ${date}. JSON.`,
    schema: {
      type: Type.OBJECT,
      properties: {
        date: { type: Type.STRING }, teluguYear: { type: Type.STRING }, ayanam: { type: Type.STRING }, rutuvu: { type: Type.STRING },
        masam: { type: Type.STRING }, paksham: { type: Type.STRING }, tithi: { type: Type.STRING }, nakshatram: { type: Type.STRING },
        yogam: { type: Type.STRING }, karanam: { type: Type.STRING }, sunrise: { type: Type.STRING }, sunset: { type: Type.STRING },
        rahukalam: { type: Type.STRING }, yamagandam: { type: Type.STRING }, gulika: { type: Type.STRING }, abhijit: { type: Type.STRING },
        specialty: { type: Type.STRING }
      },
      required: ['date', 'teluguYear', 'ayanam', 'rutuvu', 'masam', 'paksham', 'tithi', 'nakshatram', 'sunrise', 'sunset', 'rahukalam']
    }
  });
};

export const generateFullJathakam = async (name: string, dob: string, time: string, place: string): Promise<JathakamResult> => {
  return await callGemini({
    usePro: true,
    contents: `Vedic Jathakam: ${name}, ${dob}. JSON.`,
    schema: {
      type: Type.OBJECT,
      properties: {
        personalDetails: { type: Type.OBJECT, properties: { name: { type: Type.STRING } }, required: ['name'] },
        panchangam: {
          type: Type.OBJECT,
          properties: { tithi: { type: Type.STRING }, nakshatram: { type: Type.STRING }, raasi: { type: Type.STRING }, lagnam: { type: Type.STRING }, yogam: { type: Type.STRING } },
          required: ['tithi', 'nakshatram', 'raasi', 'lagnam', 'yogam']
        },
        predictions: {
          type: Type.OBJECT,
          properties: { character: { type: Type.STRING }, career: { type: Type.STRING }, health: { type: Type.STRING }, remedies: { type: Type.STRING } },
          required: ['character', 'career', 'health', 'remedies']
        }
      },
      required: ['personalDetails', 'panchangam', 'predictions']
    }
  });
};

export const generateRaasiPrediction = async (raasi: string): Promise<RaasiResult> => {
  return await callGemini({
    contents: `${raasi} రాశి ఫలితం. JSON.`,
    schema: {
      type: Type.OBJECT,
      properties: {
        raasi: { type: Type.STRING }, prediction: { type: Type.STRING }, health: { type: Type.STRING },
        wealth: { type: Type.STRING }, luckyNumber: { type: Type.STRING }, remedy: { type: Type.STRING }
      },
      required: ['raasi', 'prediction', 'health', 'wealth', 'luckyNumber', 'remedy']
    }
  });
};

export const generateNumerologyReport = async (name: string, dob: string): Promise<NumerologyResult> => {
  return await callGemini({
    contents: `Numerology ${name} ${dob}. JSON.`,
    schema: {
      type: Type.OBJECT,
      properties: {
        birthNumber: { type: Type.NUMBER }, destinyNumber: { type: Type.NUMBER }, description: { type: Type.STRING },
        luckyColors: { type: Type.STRING }, luckyDays: { type: Type.STRING }, remedies: { type: Type.STRING }
      },
      required: ['birthNumber', 'destinyNumber', 'description', 'luckyColors', 'luckyDays', 'remedies']
    }
  });
};

export const solveSamsaya = async (query: string): Promise<SamsayaResult> => {
  return await callGemini({
    usePro: true,
    contents: `Solve spiritual doubt: ${query}. JSON.`,
    schema: {
      type: Type.OBJECT,
      properties: {
        problemSummary: { type: Type.STRING }, scriptureSource: { type: Type.STRING }, context: { type: Type.STRING },
        sloka: { type: Type.STRING }, meaning: { type: Type.STRING }, solution: { type: Type.STRING },
        divineMessage: { type: Type.STRING }, backgroundKeyword: { type: Type.STRING }
      },
      required: ['problemSummary', 'scriptureSource', 'context', 'sloka', 'meaning', 'solution', 'divineMessage', 'backgroundKeyword']
    }
  });
};
