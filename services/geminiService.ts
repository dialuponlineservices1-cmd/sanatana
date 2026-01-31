
import { GoogleGenAI, Type } from "@google/genai";
import { PostContent, PanchangamData, JathakamResult, OutputMode, SamsayaResult } from "../types";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const solveSamsaya = async (query: string): Promise<SamsayaResult> => {
  const ai = getAI();
  const systemInstruction = `
    You are the 'Supreme Dharma Judge'. A user presents a life problem or a spiritual doubt (Samsaya).
    Your task is to:
    1. Identify a relevant situation from Ramayanam, Mahabharatham, or Bhagavad Gita.
    2. Provide a specific Sanskrit Sloka that addresses the problem.
    3. Explain the Context: How did Lord Rama, Krishna, or another deity/hero handle this?
    4. Provide a step-by-step 'Divine Solution' for the modern user.
    5. Output must be in scholarly Telugu script.
    
    Output Format: JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Samsaya (Problem): ${query}. Provide a scriptural solution.`,
    config: {
      systemInstruction,
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

  return JSON.parse(response.text || '{}') as SamsayaResult;
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
    You are the 'Supreme Divine Content Architect' and 'Universal Dharmic Scholar'. 
    Your knowledge spans all 4 Vedas, 18 Puranas, 108 Upanishads, and the 2 Great Epics (Ramayana & Mahabharatha).
    Output MUST be in high-fidelity, scholarly Telugu script.
    
    TASK: Generate deep scholarly data for a professional 8K spiritual poster or an immersive long-form story.
    
    1. Title: Bold, divine headline (e.g., 'శ్రీరామ చంద్రుని ధర్మనిరతి').
    2. Subtitle: Profound scholarly philosophical context.
    3. Tag: Exact divine source (e.g., 'రామాయణం - అయోధ్య కాండం').
    4. Slogan: Powerful dharmic ribbon text (e.g., 'ధర్మో రక్షతి రక్షితః').
    5. Sloka: Accurate Sanskrit/Vedic sloka with reference. Provide only if 'includeSloka' is true.
    6. Body: Deeply researched, scholarly, impactful spiritual matter.
    7. Conclusion: Moral or takeaway.
    8. BackgroundKeyword: Provide ONE VERY SPECIFIC English keyword (e.g., 'Lord Rama Archer', 'Kurukshetra War Battle', 'Vishwaroopam Lord Krishna').
    9. whatsappFormat: Ready version with *Bold* text.
    
    Output must be JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Topic: ${prompt}. Category: ${category}. Output Mode: ${outputMode}. Deep scholarly insights.`,
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
      thinkingConfig: { thinkingBudget: 32000 }
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
    contents: `Vedic Jathakam for ${name}.`,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}') as JathakamResult;
};

export const getDailyPanchangam = async (date: string): Promise<PanchangamData> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Detailed High-Precision Telugu Panchangam for ${date}. JSON.`,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}') as PanchangamData;
};
