
import { GoogleGenAI } from "@google/genai";

export class GeminiSupportService {
  /**
   * Asks the AI for support.
   * Initializes GenAI inside the call to ensure the latest API key is used
   * and prevents initialization errors during module loading.
   */
  async askSupport(query: string, history: { role: 'user' | 'model', text: string }[]) {
    try {
      // Correctly initialize with process.env.API_KEY as a named parameter
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      // Ensure the conversation starts with a 'user' message as required by Gemini.
      const firstUserIndex = history.findIndex(h => h.role === 'user');
      const validHistory = firstUserIndex !== -1 ? history.slice(firstUserIndex) : [];

      const contents = validHistory.map(h => ({
        role: h.role as "user" | "model",
        parts: [{ text: h.text }]
      }));

      // Add the current user query
      contents.push({
        role: 'user',
        parts: [{ text: query }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
          systemInstruction: `You are the NOTTY SMM Panel AI Support Assistant. 
          Your goal is to help users with:
          1. Explaining SMM services (Followers, Likes, Views).
          2. Troubleshooting orders (suggesting refills if dropped).
          3. Explaining terms like "Drip-feed" or "Refill".
          4. Promoting the high quality of NOTTY SMM services.
          Be professional, helpful, and concise. Do NOT reveal provider names like Mesumax. 
          If a user asks about an order status, tell them to check the Order History page.`,
        }
      });

      // Fix: Access .text property directly instead of calling a method or nested properties
      return response.text || "I was unable to process that. Could you rephrase?";
    } catch (error) {
      console.error("Gemini Support Error:", error);
      return "I'm having a small technical hiccup. Please try again in a moment.";
    }
  }
}

export const geminiSupport = new GeminiSupportService();
