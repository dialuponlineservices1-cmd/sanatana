
import { GoogleGenAI, Type } from "@google/genai";
import { PostContent, PanchangamData, JathakamResult, OutputMode, SamsayaResult, NumerologyResult, RaasiResult } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") {
    throw new Error("API_KEY_MISSING: Vercel సెట్టింగ్స్ లో API_KEY కనిపించడం లేదు. దయచేసి Env Variables చెక్ చేయండి.");
  }
  return new GoogleGenAI({ apiKey });
};

const cleanJSONResponse = (text: string): string => {
  if (!text) return "{}";
  try {
    // Look for the first { and last } to extract JSON from possible conversational padding
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? jsonMatch[0] : text.trim();
  } catch (e) {
    return "{}";
  }
};

/**
 * Unified caller with model fallback. 
 * If Pro fails, tries Flash. 
 */
async function callGemini(params: {
  contents: string;
  systemInstruction?: string;
  schema: any;
  usePro?: boolean;
}) {
  const ai = getAI();
  // Primary model choices based on task complexity
  const primaryModel = params.usePro ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  const fallbackModel = 'gemini-3-flash-preview';
  
  const modelsToTry = [primaryModel];
  if (primaryModel !== fallbackModel) {
    modelsToTry.push(fallbackModel);
  }

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Calling Gemini with model: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ parts: [{ text: params.contents }] }],
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: params.schema,
          // Only use thinking for Pro model
          thinkingConfig: modelName.includes('pro') ? { thinkingBudget: 16384 } : undefined
        }
      });

      const text = cleanJSONResponse(response.text ?? "{}");
      return JSON.parse(text);
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${modelName} failed. Details:`, err.message);
      
      // If it's a quota or key error, no point in retrying other models
      if (err.message?.includes('429') || err.message?.includes('403') || err.message?.includes('API_KEY')) {
        throw err;
      }
    }
  }

  throw lastError || new Error("అన్ని AI మోడల్స్ విఫలమయ్యాయి. కనెక్షన్ చెక్ చేయండి.");
}

export const generateRaasiPrediction = async (raasi: string): Promise<RaasiResult> => {
  return await callGemini({
    contents: `Detailed Vedic Horoscope for ${raasi} raasi in Telugu for today. Include specific predictions.`,
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
    contents: `Detailed Numerology report for ${name || 'User'} born on ${dob} in Telugu script.`,
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
    contents: `Complete Vedic Birth Chart Analysis (Jathakam) for ${name}, DOB: ${dob}, Time: ${time}, Place: ${place}. Language: Telugu.`,
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
    systemInstruction: "You are a Dharmic Scholar. Always output scholarly Telugu content in clean JSON format.",
    contents: `Task: Generate ${outputMode}. Topic: ${prompt}. Category: ${category}. Include Sloka: ${includeSloka}.`,
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
    contents: `Solve this spiritual doubt with Vedic references: ${query}. Use Telugu script.`,
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
    contents: `Full Telugu Panchangam data for ${date}.`,
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
