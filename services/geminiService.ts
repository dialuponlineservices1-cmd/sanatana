
import { GoogleGenAI, Type } from "@google/genai";
import { PostContent, PanchangamData, JathakamResult, OutputMode, SamsayaResult, NumerologyResult, RaasiResult } from "../types";

/**
 * API Key Priority Logic:
 * 1. Check Manual Entry in localStorage (internal_api_key)
 * 2. Check Branding Settings (dharma_branding)
 * 3. Check Platform Environment Variable (process.env.API_KEY)
 */
export const getApiKey = () => {
  const manualKey = localStorage.getItem('internal_api_key');
  if (manualKey && manualKey.trim() !== "") return manualKey.trim();

  const brandingStr = localStorage.getItem('dharma_branding');
  if (brandingStr) {
    try {
      const b = JSON.parse(brandingStr);
      if (b.apiKey && b.apiKey.trim() !== "") return b.apiKey.trim();
    } catch (e) {}
  }

  return process.env.API_KEY || "";
};

const getFreshAI = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Validates the API key. 
 * If it returns 429 (Rate Limit), the key is still "Valid" but busy.
 */
export const validateApiKey = async (key: string): Promise<boolean> => {
  if (!key || key.length < 10) return false;
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    // Use the fastest model for validation
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'hi',
      config: { maxOutputTokens: 1 }
    });
    return true;
  } catch (e: any) {
    const errMsg = e.message || "";
    // If the error is 429 (Too many requests), it means the key IS VALID, just at limit.
    if (errMsg.includes('429') || errMsg.includes('limit')) {
      console.warn("API Key is valid but currently rate-limited.");
      return true; 
    }
    console.error("API Key Validation Failed:", e);
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
  const ai = getFreshAI();
  
  // Attempt with standard models first, then fallback to lite
  const models = params.usePro 
    ? ['gemini-3-pro-preview', 'gemini-3-flash-preview', 'gemini-flash-lite-latest']
    : ['gemini-3-flash-preview', 'gemini-flash-lite-latest'];

  let lastError: any = null;

  for (const modelName of models) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction || "You are a professional Vedic scholar. Output only valid JSON in Telugu.",
          responseMimeType: 'application/json',
          responseSchema: params.schema,
          thinkingConfig: modelName.includes('pro') ? { thinkingBudget: 16384 } : undefined
        }
      });

      const rawText = response.text || "{}";
      return JSON.parse(cleanJSONResponse(rawText));
    } catch (err: any) {
      lastError = err;
      const errMsg = err.message || "";
      
      // Stop retrying if the key itself is definitively invalid
      if (errMsg.includes('403') || errMsg.includes('401') || errMsg.includes('INVALID_ARGUMENT')) {
        throw new Error("API_KEY_INVALID");
      }
      
      // Special handling for rate limits
      if (errMsg.includes('429')) {
        // If we still have models to try, continue. Otherwise, throw limit error.
        if (modelName === models[models.length - 1]) {
           throw new Error("API_LIMIT_REACHED");
        }
        continue;
      }
      
      console.warn(`Model ${modelName} failed: ${errMsg}`);
    }
  }
  throw lastError || new Error("CONNECTION_FAILED");
}

export const generateRaasiPrediction = async (raasi: string): Promise<RaasiResult> => {
  return await callGemini({
    contents: `Today's horoscope for ${raasi} in Telugu. Output JSON.`,
    schema: {
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
  });
};

export const generateNumerologyReport = async (name: string, dob: string): Promise<NumerologyResult> => {
  return await callGemini({
    contents: `Numerology destiny for ${name} (${dob}) in Telugu. Output JSON.`,
    schema: {
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
  });
};

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
    contents: `Subject: ${prompt}. Category: ${category}. Sloka: ${includeSloka}. Royal Telugu formatting. Output JSON.`,
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

export const solveSamsaya = async (query: string): Promise<SamsayaResult> => {
  return await callGemini({
    usePro: true,
    contents: `Solve spiritual doubt: ${query} in Telugu. Output JSON.`,
    schema: {
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
  });
};

export const getDailyPanchangam = async (date: string): Promise<PanchangamData> => {
  return await callGemini({
    contents: `Daily Panchangam for ${date} in Telugu. Output JSON.`,
    schema: {
      type: Type.OBJECT,
      properties: {
        date: { type: Type.STRING }, teluguYear: { type: Type.STRING }, ayanam: { type: Type.STRING }, rutuvu: { type: Type.STRING },
        masam: { type: Type.STRING }, paksham: { type: Type.STRING }, tithi: { type: Type.STRING }, nakshatram: { type: Type.STRING },
        yogam: { type: Type.STRING }, karanam: { type: Type.STRING }, sunrise: { type: Type.STRING }, sunset: { type: Type.STRING },
        rahukalam: { type: Type.STRING }, yamagandam: { type: Type.STRING }, gulika: { type: Type.STRING }, abhijit: { type: Type.STRING },
        specialty: { type: Type.STRING },
      },
      required: ['date', 'teluguYear', 'ayanam', 'rutuvu', 'masam', 'paksham', 'tithi', 'nakshatram', 'sunrise', 'sunset', 'rahukalam']
    }
  });
};

export const generateFullJathakam = async (name: string, dob: string, time: string, place: string): Promise<JathakamResult> => {
  return await callGemini({
    usePro: true,
    contents: `Full Vedic Jathakam for ${name}, Born: ${dob} at ${time} in ${place}. Output JSON.`,
    schema: {
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
  });
};
