
import { GoogleGenAI, Type } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Generates a personalized practice set based on student mastery gaps.
   * Using gemini-3-pro-preview for complex STEM (Math/Physics) tasks.
   */
  async generateAdaptivePractice(studentName: string, subject: string, gaps: string[]) {
    const prompt = `Generate a personalized 5-question practice set for ${studentName} in ${subject}. 
    Focus on these specific conceptual gaps: ${gaps.join(', ')}. 
    Ensure the difficulty is slightly above their current competency.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    // Access .text property (not a method)
    return JSON.parse(response.text || '[]');
  },

  /**
   * Summarizes classroom engagement from live input notes.
   * Using gemini-3-flash-preview for summarization and analysis tasks.
   */
  async summarizeEngagement(notes: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following classroom observation notes and provide an 'Engagement Index' (0-100) and three key actionable takeaways for the teacher: \n\n ${notes}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            index: { type: Type.NUMBER },
            takeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentiment: { type: Type.STRING }
          },
          required: ["index", "takeaways", "sentiment"]
        }
      }
    });

    // Access .text property (not a method)
    return JSON.parse(response.text || '{}');
  },

  /**
   * Generates content for the AI Library (quizzes, summaries, or practice problems).
   * Using gemini-3-pro-preview for high-quality educational content generation.
   */
  async generateEducationalContent(topic: string, contentType: 'quiz' | 'summary' | 'problems') {
    const prompt = `As an expert educator, create a high-quality ${contentType} about the topic: "${topic}". 
    Format the output as a clean, structured JSON object suitable for a modern educational app.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING, description: 'The main body of the content or summary.' },
            items: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  hint: { type: Type.STRING }
                }
              },
              description: 'List of quiz questions or practice problems if applicable.'
            }
          },
          required: ["title", "content"]
        }
      }
    });

    // Access .text property (not a method)
    return JSON.parse(response.text || '{}');
  }
};
