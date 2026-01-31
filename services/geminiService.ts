
import { GoogleGenAI, Type } from "@google/genai";
import { PostContent, PanchangamData, JathakamResult, OutputMode, SamsayaResult, NumerologyResult, RaasiResult } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING: Vercel సెట్టింగ్స్ లో API_KEY కనిపించడం లేదు.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Robust JSON extraction using regex to find the first { and last }
 */
const cleanJSONResponse = (text: string): string => {
  if (!text) return "{}";
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }
    return text.trim();
  } catch (e) {
    return "{}";
  }
};

/**
 * Generic caller with fallback mechanism for stability.
 */
async function callGeminiWithFallback(params: {
  contents: string | any;
  systemInstruction?: string;
  schema: any;
  preferPro?: boolean;
}) {
  const ai = getAI();
  // Using gemini-2.5-flash as the most reliable base for standard keys
  const models = ['gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-2.5-flash-lite-latest'];
  
  let lastError: any = null;

  for (const modelName of models) {
    try {
      console.log(`Attempting with model: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: typeof params.contents === 'string' ? [{ parts: [{ text: params.contents }] }] : params.contents,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: params.schema,
        }
      });

      const text = cleanJSONResponse(response.text ?? "{}");
      return JSON.parse(text);
    } catch (err: any) {
      lastError = err;
      console.error(`${modelName} error details:`, err);
      // Stop immediately if it's an authentication or quota issue
      if (err.message?.includes('API_KEY') || err.message?.includes('403') || err.message?.includes('429')) {
        throw err;
      }
    }
  }

  throw new Error(lastError?.message || "అన్ని AI మోడల్స్ విఫలమయ్యాయి. దయచేసి ఇంటర్నెట్ లేదా API Key చెక్ చేయండి.");
}

export const generateRaasiPrediction = async (raasi: string): Promise<RaasiResult> => {
  return await callGeminiWithFallback({
    contents: `Detailed Vedic Horoscope for ${raasi} raasi. Output fields: raasi, prediction, health, wealth, luckyNumber, remedy in Telugu.`,
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
  return await callGeminiWithFallback({
    contents: `Full Numerology report for ${name} born on ${dob}. Telugu script.`,
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
  return await callGeminiWithFallback({
    contents: `Complete Vedic Horoscope for ${name}, DOB: ${dob}, Time: ${time}, Place: ${place}. Language: Telugu.`,
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
  return await callGeminiWithFallback({
    systemInstruction: "You are a Dharmic Scholar. Always output clean JSON in Telugu script.",
    contents: `Task: Generate ${outputMode} content. Topic: ${prompt}. Category: ${category}. Sloka: ${includeSloka}. Output MUST follow the JSON schema perfectly.`,
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
  return await callGeminiWithFallback({
    contents: `Solve spiritual doubt: ${query}. Use Telugu script. Provide sloka and meaning.`,
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
  return await callGeminiWithFallback({
    contents: `Detailed Telugu Panchangam for ${date}.`,
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
