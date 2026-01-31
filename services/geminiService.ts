
import { GoogleGenAI, Type } from "@google/genai";
import { PostContent, PanchangamData, JathakamResult, OutputMode, SamsayaResult, NumerologyResult, RaasiResult } from "../types";

/**
 * Ensures the API Key is fresh and handled as a runtime constant where possible.
 */
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Advanced JSON cleaner to handle:
 * 1. Markdown code blocks (```json ... ```)
 * 2. Conversational prefix/suffix
 * 3. Escaped characters
 */
const cleanJSONResponse = (text: string): string => {
  if (!text) return "{}";
  let cleaned = text.trim();
  
  // Remove markdown code blocks if present
  if (cleaned.includes("```")) {
    cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "").trim();
  }
  
  // Extract only the part between the first { and last }
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
  const ai = getAI();
  
  // High availability model fallback chain
  const models = params.usePro 
    ? ['gemini-3-pro-preview', 'gemini-3-flash-preview', 'gemini-flash-lite-latest']
    : ['gemini-3-flash-preview', 'gemini-flash-lite-latest'];

  let lastError: any = null;

  for (const modelName of models) {
    try {
      console.log(`Attempting with model: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ parts: [{ text: params.contents }] }],
        config: {
          systemInstruction: params.systemInstruction || "You are a professional Vedic scholar. Always output valid JSON in Telugu.",
          responseMimeType: 'application/json',
          responseSchema: params.schema,
          thinkingConfig: modelName.includes('pro') ? { thinkingBudget: 16384 } : undefined
        }
      });

      const rawText = response.text || "{}";
      const cleanedText = cleanJSONResponse(rawText);
      return JSON.parse(cleanedText);
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${modelName} failed:`, err.message);
      
      // If it's a critical auth or quota error, don't bother retrying
      if (err.message?.includes('403') || err.message?.includes('429')) {
        throw err;
      }
      // Otherwise, loop continues to the next fallback model
    }
  }

  throw lastError || new Error("అన్ని AI సర్వర్లు బిజీగా ఉన్నాయి. దయచేసి మళ్ళీ ప్రయత్నించండి.");
}

export const generateRaasiPrediction = async (raasi: string): Promise<RaasiResult> => {
  return await callGemini({
    contents: `Detailed Vedic Horoscope for ${raasi} raasi for today in Telugu.`,
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
    contents: `Deep Numerology Analysis for ${name} born on ${dob} in Telugu script.`,
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

export const generateFullJathakam = async (name: string, dob: string, time: string, place: string): Promise<JathakamResult> => {
  return await callGemini({
    usePro: true,
    contents: `Complete Vedic Birth Chart (Jathakam) for ${name}, Born: ${dob} at ${time} in ${place}. Scholarly Telugu.`,
    schema: {
      type: Type.OBJECT,
      properties: {
        personalDetails: { type: Type.OBJECT, properties: { name: { type: Type.STRING } }, required: ['name'] },
        panchangam: {
          type: Type.OBJECT,
          properties: {
            tithi: { type: Type.STRING }, nakshatram: { type: Type.STRING }, raasi: { type: Type.STRING }, lagnam: { type: Type.STRING }, yogam: { type: Type.STRING }
          },
          required: ['tithi', 'nakshatram', 'raasi', 'lagnam', 'yogam']
        },
        predictions: {
          type: Type.OBJECT,
          properties: {
            character: { type: Type.STRING }, career: { type: Type.STRING }, health: { type: Type.STRING }, remedies: { type: Type.STRING }
          },
          required: ['character', 'career', 'health', 'remedies']
        }
      },
      required: ['personalDetails', 'panchangam', 'predictions']
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
    contents: `Task: ${outputMode}. Category: ${category}. Topic: ${prompt}. Sloka: ${includeSloka}. Output MUST be valid JSON.`,
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
    contents: `Solve spiritual doubt using Vedic context: ${query} in Telugu script.`,
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
    contents: `Full Telugu Panchangam for ${date}. Include Rahukalam, Abhijit and Specialty.`,
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
