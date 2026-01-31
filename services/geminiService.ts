
import { GoogleGenAI, Type } from "@google/genai";
import { PostContent, PanchangamData, JathakamResult, OutputMode, SamsayaResult, NumerologyResult, RaasiResult } from "../types";

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
  if (!apiKey) throw new Error("API_KEY_MISSING");
  return new GoogleGenAI({ apiKey });
};

export const validateApiKey = async (key: string): Promise<boolean> => {
  if (!key || key.length < 10) return false;
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    // Quick probe to test key validity
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'test',
      config: { maxOutputTokens: 1 }
    });
    return true;
  } catch (e: any) {
    // If it's a 429 (Quota), the key is valid but limited
    if (e.message?.includes('429')) return true;
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
  // Using Gemini 3 Pro for deep reasoning if requested, otherwise Flash
  const modelName = params.usePro ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: params.contents,
      config: {
        systemInstruction: params.systemInstruction || `
          You are a Divine Vedic Maharshi with infinite wisdom. 
          Language: Elegant, Scholarly Telugu.
          Style: Deeply spiritual, revealing hidden secrets (Rahasya).
          STRICT RULE: Never provide generic definitions. 
          Example: If asked about Ramayana, do NOT say "It's a story of Rama". 
          Instead say: "The esoteric secret of the 24,000 verses representing the Gayatri Mantra is..."
          Focus on facts that are beneficial to humanity and not commonly known.
        `,
        responseMimeType: 'application/json',
        responseSchema: params.schema,
        thinkingConfig: params.usePro ? { thinkingBudget: 16384 } : undefined
      }
    });
    return JSON.parse(cleanJSONResponse(response.text || "{}"));
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    if (err.message?.includes('429')) throw new Error("API_LIMIT");
    if (err.message?.includes('403') || err.message?.includes('401')) throw new Error("API_INVALID");
    throw err;
  }
}

export const generateSpiritualPost = async (
  prompt: string, 
  category: string, 
  includeSloka: boolean, 
  isQA: boolean = false,
  isRahasya: boolean = false,
  outputMode: OutputMode = 'STORY'
): Promise<PostContent> => {
  const isTemplate = outputMode === 'TEMPLATE';
  
  return await callGemini({
    usePro: true, // Use Pro for higher quality deep insights
    contents: `
      Subject: ${prompt}. Category: ${category}. Mode: ${outputMode}.
      Reveal a DEEP SACRED SECRET or a VEDIC INSIGHT about this topic.
      Do not repeat what is commonly known. Use scholarly language.
      STORY: 1000 words. TEMPLATE: 3-4 Impactful sentences.
      Keyword: specific high-res atmosphere for Unsplash.
    `,
    schema: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Short powerful title (Max 8 words).' },
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
    contents: `Daily Panchangam for ${date} in Telugu. High precision. JSON.`,
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
    contents: `Full Vedic Jathakam for ${name}, ${dob}, ${time}, ${place}. JSON.`,
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
    contents: `Numerology for ${name} ${dob}. JSON.`,
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
