
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
    You are the 'Supreme Vedic Command Center'. 
    MANDATE: Output EXTREMELY detailed content in scholarly Telugu.
    
    SPECIAL CATEGORIES:
    - FESTIVALS (PANDUGALU): Include "Charitra" (History), "Vidhanam" (Rituals/Pooja), and "Inner Significance".
    - SPECIAL DAYS (ROJULA VISHISTHATHA): Explain why a certain day (like Ekadashi or Pradosha) is important, historical events on that day, and spiritual benefits.
    - MORAL STORIES (NITHI KATHALU): Use a wise tone, include a clear lesson.
    - KIDS STORIES (PILLA KATHALU): Use simplified, fun Telugu, engaging dialogue, and a happy conclusion.
    
    MODES:
    - If 'STORY': Write a flowing narrative book-style.
    - If 'TEMPLATE': Structure for a digital postcard with clear bullet points.
    
    WORD COUNT: 1500+ words.
    OUTPUT FORMAT: JSON ONLY.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Topic: ${prompt}. Context: ${category}. Output Mode: ${outputMode}. Rahasya: ${isRahasya}. Output in scholarly Telugu.`,
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
          rituals: { type: Type.STRING, description: 'Step by step pooja vidhanam if festival or special day' },
          tag: { type: Type.STRING },
          slogan: { type: Type.STRING },
          whatsappFormat: { type: Type.STRING }
        },
        required: ['title', 'subtitle', 'body', 'conclusion', 'tag', 'slogan', 'whatsappFormat']
      },
      // Guideline recommendation: Avoid setting thinkingBudget unless required or latency-sensitive.
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
    contents: `Full Vedic Jathakam Analysis: Name: ${name}, DOB: ${dob}, Time: ${time}, Place: ${place}. Scholarly Telugu.`,
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
    }
  });
  return JSON.parse(response.text || '{}') as JathakamResult;
};

export const getDailyPanchangam = async (date: string): Promise<PanchangamData> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Daily Telugu Panchangam for ${date}. Output JSON.`,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}') as PanchangamData;
};
