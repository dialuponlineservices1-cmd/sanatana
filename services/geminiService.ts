
import { GoogleGenAI, Type } from "@google/genai";
import { PostContent, PanchangamData, JathakamResult, OutputMode, SamsayaResult, NumerologyResult, RaasiResult } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

/**
 * Strips markdown code blocks (```json ... ```) and cleans the string for JSON.parse
 */
const cleanJSONResponse = (text: string): string => {
  let cleaned = text.trim();
  // Remove markdown blocks if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
  }
  return cleaned || "{}";
};

// Zodiac Prediction Logic
export const generateRaasiPrediction = async (raasi: string): Promise<RaasiResult> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
    const text = cleanJSONResponse(response.text ?? "{}");
    return JSON.parse(text) as RaasiResult;
  } catch (error) {
    console.error("Raasi Prediction Error:", error);
    throw error;
  }
};

// Numerology Logic
export const generateNumerologyReport = async (name: string, dob: string): Promise<NumerologyResult> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
    const text = cleanJSONResponse(response.text ?? "{}");
    return JSON.parse(text) as NumerologyResult;
  } catch (error) {
    console.error("Numerology Error:", error);
    throw error;
  }
};

// Jathakam Logic
export const generateFullJathakam = async (name: string, dob: string, time: string, place: string): Promise<JathakamResult> => {
  try {
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
    const text = cleanJSONResponse(response.text ?? "{}");
    return JSON.parse(text) as JathakamResult;
  } catch (error) {
    console.error("Jathakam Error:", error);
    throw error;
  }
};

// Generate content for spiritual posters or stories
export const generateSpiritualPost = async (
  prompt: string, 
  category: string, 
  includeSloka: boolean, 
  isQA: boolean = false,
  isRahasya: boolean = false,
  outputMode: OutputMode = 'STORY'
): Promise<PostContent> => {
  try {
    const ai = getAI();
    
    const systemInstruction = `
      You are the 'Supreme Divine Content Architect' and 'Universal Dharmic Scholar'. 
      Output MUST be in high-fidelity, scholarly Telugu script.
      
      SPECIALIZATION RULES:
      1. If Category is 'NITHI_KATHALU': Focus on moral values, Panchatantra style, and clear wisdom.
      2. If Category is 'PILLALA_KATHALU': Use simple, engaging, magical, and colorful language.
      3. If Category is 'MOTIVATIONAL_KATHALU': Focus on willpower, hard work, success, and powerful inspiration.
      
      Output format MUST be valid JSON according to the schema.
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
        thinkingConfig: { thinkingBudget: 16384 } // Reduced budget for better stability
      }
    });

    const text = cleanJSONResponse(response.text ?? "{}");
    return JSON.parse(text) as PostContent;
  } catch (error) {
    console.error("Content Generation Error:", error);
    throw error;
  }
};

export const solveSamsaya = async (query: string): Promise<SamsayaResult> => {
  try {
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
    const text = cleanJSONResponse(response.text ?? "{}");
    return JSON.parse(text) as SamsayaResult;
  } catch (error) {
    console.error("Samsaya Error:", error);
    throw error;
  }
};

export const getDailyPanchangam = async (date: string): Promise<PanchangamData> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Daily Telugu Panchangam for ${date}. Return strictly as JSON.`,
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
    const text = cleanJSONResponse(response.text ?? "{}");
    return JSON.parse(text) as PanchangamData;
  } catch (error) {
    console.error("Panchangam Error:", error);
    throw error;
  }
};
