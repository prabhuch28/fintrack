
import { GoogleGenAI, Type } from "@google/genai";
import { AppState, CategoryType } from "../types";

export async function getFinancialInsights(state: AppState, category: CategoryType): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const categoryData = state.categories[category];
  
  const prompt = `
    You are a friendly financial assistant for college students. 
    Analyze the following data for the ${category} category:
    - Current Spending: $${categoryData.spent}
    - Monthly Limit: $${categoryData.limit}
    - Recent Transactions: ${JSON.stringify(categoryData.transactions.slice(0, 5))}
    - Emergency Fund: $${state.emergencyFund}

    Provide a short, 2-sentence piece of advice or an insight to help this student manage their money better in this specific category. 
    Be supportive and practical. Use a helpful tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    // Use the .text property directly (not a method call).
    return response.text || "Keep tracking your expenses to stay on top of your goals!";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Great job staying aware of your spending!";
  }
}

export async function getQuickTips(): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 3 quick, short financial tips for a college student. Each tip should be under 15 words.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    // Safely access the .text property and parse the JSON string.
    const text = response.text;
    if (!text) {
      throw new Error("Empty response text");
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Quick Tips Error:", error);
    return [
      "Track every dollar you spend.",
      "Always set aside an emergency fund.",
      "Look for student discounts whenever possible."
    ];
  }
}
