
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
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'hi',
      config: { maxOutputTokens: 1 }
    });
    return true;
  } catch (e: any) {
    const errMsg = e.message || "";
    if (errMsg.includes('429')) return true; 
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
  const modelName = params.usePro ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: params.contents,
      config: {
        systemInstruction: params.systemInstruction || "You are a Divine Maharshi. Speak only in scholarly, elegant Telugu. Never define concepts generically. Reveal deep secrets and life lessons.",
        responseMimeType: 'application/json',
        responseSchema: params.schema,
        thinkingConfig: params.usePro ? { thinkingBudget: 16384 } : undefined
      }
    });
    return JSON.parse(cleanJSONResponse(response.text || "{}"));
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    throw err;
  }
}

// Fix: Implemented getDailyPanchangam to provide daily Vedic astrological data
export const getDailyPanchangam = async (date: string): Promise<PanchangamData> => {
  return await callGemini({
    contents: `తేదీ: ${date}. ఈ రోజుకు సంబంధించిన పూర్తి తెలుగు పంచాంగం (తిథి, నక్షత్రం, యోగం, కరణం, రాహుకాలం మొదలైనవి) వివరాలు. JSON.`,
    schema: {
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
        specialty: { type: Type.STRING }
      },
      required: ['date', 'teluguYear', 'ayanam', 'rutuvu', 'masam', 'paksham', 'tithi', 'nakshatram', 'yogam', 'karanam', 'sunrise', 'sunset', 'rahukalam', 'yamagandam', 'gulika', 'abhijit']
    }
  });
};

// Fix: Implemented generateFullJathakam to provide comprehensive Vedic birth chart analysis
export const generateFullJathakam = async (name: string, dob: string, time: string, place: string): Promise<JathakamResult> => {
  return await callGemini({
    usePro: true,
    contents: `జాతక విశ్లేషణ: పేరు ${name}, తేదీ ${dob}, సమయం ${time}, ప్రదేశం ${place}. వైదిక జ్యోతిష్య శాస్త్రం ప్రకారం పూర్తి జాతక చక్రం మరియు ఫలితాలు. JSON.`,
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

export const generateRaasiPrediction = async (raasi: string): Promise<RaasiResult> => {
  return await callGemini({
    contents: `${raasi} రాశికి నేటి గోచార ఫలితం. మహర్షి శైలిలో లోతైన విశ్లేషణ. JSON.`,
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
    contents: `సంఖ్యాశాస్త్రం: పేరు ${name}, తేదీ ${dob}. సంఖ్యల రహస్యం మరియు అదృష్ట మార్గం. JSON.`,
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
  const isTemplate = outputMode === 'TEMPLATE';
  
  return await callGemini({
    usePro: true,
    contents: `
      Topic: ${prompt}. Category: ${category}.
      Mode: ${outputMode}.
      Role: Enlightenment Maharshi. 
      CRITICAL RULE: Never provide a generic definition (e.g., if asked about Ramayana, don't say 'It is a book about Rama'). 
      Instead, reveal a DEEP SECRET or a LIFE LESSON from it (e.g., 'The subtle science of Hanuman's devotion is...').
      
      STORY Requirement: 1000+ words of profound, scholarly Telugu matter. Deep insights only.
      TEMPLATE Requirement: Short, punchy, impactful 3-4 sentences maximum. Large font readable.
      
      BackgroundKeyword: Provide 1 highly specific English keyword for an atmosphere (e.g., 'mystic forest', 'celestial light', 'vedic sacrifice').
      JSON output only.
    `,
    schema: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Elegant title, max 10 words. Concise.' },
        subtitle: { type: Type.STRING },
        sloka: { type: Type.STRING },
        body: { type: Type.STRING, description: isTemplate ? 'Max 4 punchy lines.' : 'Detailed 1000 word deep content.' },
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
    contents: `ధర్మ సందేహం: ${query}. ఇతిహాసాల నుండి రహస్య పరిష్కారం. JSON.`,
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
