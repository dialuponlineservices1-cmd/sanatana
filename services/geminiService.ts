
import { GoogleGenAI, Type } from "@google/genai";
import { PostContent, PanchangamData, JathakamResult, OutputMode, SamsayaResult, NumerologyResult, RaasiResult } from "../types";

/**
 * Creates a fresh AI instance for every call.
 * This is CRITICAL for Vite/Vercel to pick up runtime environment changes
 * and to satisfy the Gemini Pro key selection requirement.
 */
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    throw new Error("API_KEY_MISSING: API కీ అందుబాటులో లేదు. దయచేసి సెట్టింగ్స్ లో కీని ఎంచుకోండి.");
  }
  return new GoogleGenAI({ apiKey });
};

const cleanJSONResponse = (text: string): string => {
  if (!text) return "{}";
  try {
    // Extracts JSON from markdown or conversational text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? jsonMatch[0] : text.trim();
  } catch (e) {
    return "{}";
  }
};

async function callGemini(params: {
  contents: string;
  systemInstruction?: string;
  schema: any;
  usePro?: boolean;
}) {
  const ai = getAI();
  const primaryModel = params.usePro ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  const fallbackModel = 'gemini-3-flash-preview';
  
  const modelsToTry = [primaryModel];
  if (primaryModel !== fallbackModel) modelsToTry.push(fallbackModel);

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Executing request with ${modelName}...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ parts: [{ text: params.contents }] }],
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: params.schema,
          // Only use high thinking for complex tasks in Pro
          thinkingConfig: modelName.includes('pro') ? { thinkingBudget: 16384 } : undefined
        }
      });

      const text = cleanJSONResponse(response.text ?? "{}");
      return JSON.parse(text);
    } catch (err: any) {
      lastError = err;
      console.error(`Model ${modelName} encountered an issue:`, err.message);
      
      // Stop retrying if the key is invalid or quota is reached
      if (err.message?.includes('403') || err.message?.includes('429')) {
        throw err;
      }
    }
  }

  throw lastError || new Error("AI సర్వర్ స్పందించడం లేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.");
}

export const generateRaasiPrediction = async (raasi: string): Promise<RaasiResult> => {
  return await callGemini({
    contents: `Today's Vedic Raasi Phalalu for ${raasi} in Telugu.`,
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
    contents: `Numerology destiny report for ${name} born on ${dob} in Telugu.`,
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
    contents: `Detailed Jathakam analysis for ${name}, DOB: ${dob}, Time: ${time}, Place: ${place}. Language: Telugu.`,
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
    systemInstruction: "You are a Supreme Dharmic Scholar. Create insightful Telugu content for posters and stories.",
    contents: `Action: ${outputMode}. Subject: ${prompt}. Category: ${category}. Sloka: ${includeSloka}. Output: Telugu JSON.`,
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
    contents: `Solve spiritual doubt: ${query} in Telugu.`,
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
    contents: `Panchangam for ${date}.`,
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
