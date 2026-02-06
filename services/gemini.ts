import { GoogleGenAI } from "@google/genai";
import { DevLog } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';

// Safely initialize client only if key exists, otherwise return null
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

export const generateLogInsights = async (log: DevLog): Promise<string> => {
  if (!ai) {
    return "API Key missing. Please configure your environment variables to use AI features.";
  }

  try {
    const prompt = `
      You are a senior engineering mentor. Analyze this developer's daily log and provide a short, 2-3 sentence encouraging insight or a specific resource/concept they should look into based on their struggles.
      
      Log Data:
      Worked On: ${log.workedOn}
      Learned: ${log.learned}
      Struggled: ${log.struggled}
      Next: ${log.next}
      
      Tone: Professional, mentorship, encouraging.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Keep pushing forward! Consistency is key.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate insights at this time. Please try again later.";
  }
};

export const suggestTags = async (text: string): Promise<string[]> => {
  if (!ai) return [];

  try {
     const prompt = `
      Extract 3-5 technical tags (skills, languages, concepts) from the following text. Return them as a comma-separated list.
      Text: "${text}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const textResponse = response.text || "";
    return textResponse.split(',').map(tag => tag.trim());
  } catch (e) {
    console.error(e);
    return [];
  }
}
