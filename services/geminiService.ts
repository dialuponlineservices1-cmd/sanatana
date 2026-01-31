
import { GoogleGenAI, Type } from "@google/genai";
import { PostContent, PanchangamData, JathakamResult, OutputMode } from "../types";

// Always use named parameter for apiKey and avoid non-null assertion for environment variables
const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

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
    You are the 'Supreme Vedic Research Scholar & Content Engine'. 
    MANDATE: Output EXTREMELY detailed, authentic content in scholarly Telugu.
    
    RESEARCH PROTOCOL:
    - You MUST cross-reference ancient Sanskrit texts (Vedas, Upanishads, Puranas, Itihasa) and traditional commentaries.
    - If the topic is VASTU, refer specifically to Vishwakarma Prakasham, Mayamata, and Manasara. Provide REAL technical details (Directions, Aya, measurements).
    - If the topic is MAHARSHIS, include their lineage (Gotra), primary contributions, and specific Puranic episodes.
    - If the topic is MORAL/KIDS stories, pull from Panchatantra, Tenali Rama, or Mahabharata episodes.
    - NO GENERIC AI FILLER. Every sentence must hold traditional weight.
    
    SPECIAL CATEGORIES:
    - FESTIVALS: Detailed pooja steps (Vidhanam), history (Charitra), and inner scientific significance.
    - VASTU SHASTRA: Real architectural logic based on traditional texts.
    
    MODES:
    - If 'STORY': Write a flowing scholarly narrative (1500+ words).
    - If 'TEMPLATE': Detailed digital postcard format with clear, impactful bullet points.
    
    OUTPUT FORMAT: JSON ONLY. Use authentic Telugu script.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Detailed Research Request: ${prompt}. Category: ${category}. Mode: ${outputMode}. Deep Secret (Rahasya): ${isRahasya}. Scholarly Telugu.`,
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
          rituals: { type: Type.STRING, description: 'Deep technical details or pooja steps if applicable' },
          tag: { type: Type.STRING },
          slogan: { type: Type.STRING },
          whatsappFormat: { type: Type.STRING }
        },
        required: ['title', 'subtitle', 'body', 'conclusion', 'tag', 'slogan', 'whatsappFormat']
      },
      thinkingConfig: { thinkingBudget: 15000 } // High thinking budget for deep research simulation
    }
  });

  return JSON.parse(response.text || '{}') as PostContent;
};

export const generateFullJathakam = async (
  name: string,
  dob: string,
  time: string,
  place: string
): Promise<JathakamResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Full Vedic Jathakam Deep Analysis (Research Mode): Name: ${name}, DOB: ${dob}, Time: ${time}, Place: ${place}. Scholarly Telugu.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personalDetails: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, dob: { type: Type.STRING }, time: { type: Type.STRING }, place: { type: Type.STRING } } },
          panchangam: { type: Type.OBJECT, properties: { tithi: { type: Type.STRING }, nakshatram: { type: Type.STRING }, raasi: { type: Type.STRING }, lagnam: { type: Type.STRING }, yogam: { type: Type.STRING } } },
          predictions: { type: Type.OBJECT, properties: { character: { type: Type.STRING }, career: { type: Type.STRING }, health: { type: Type.STRING }, remedies: { type: Type.STRING } } },
          fullReport: { type: Type.STRING }
        }
      },
      thinkingConfig: { thinkingBudget: 8000 }
    }
  });
  return JSON.parse(response.text || '{}') as JathakamResult;
};

export const getDailyPanchangam = async (date: string): Promise<PanchangamData> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Daily High-Precision Telugu Panchangam for ${date}. Output JSON.`,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}') as PanchangamData;
};
