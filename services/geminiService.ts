
import { GoogleGenAI, Type } from "@google/genai";

export const geminiService = {
  /**
   * Generates a unique AI avatar based on student's personality/quest.
   */
  async generateAvatar(description: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A futuristic, modern, high-quality circular avatar for an education app. Theme: ${description}. Stylized, minimal, vector aesthetic.` }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return '';
  },

  /**
   * Generates a personalized practice set based on student mastery gaps.
   */
  async generateAdaptivePractice(studentName: string, subject: string, gaps: string[]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a personalized 5-question practice set for ${studentName} in ${subject}. Focus on: ${gaps.join(', ')}.`,
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
    return JSON.parse(response.text || '[]');
  },

  /**
   * Summarizes classroom engagement from live input notes.
   */
  async summarizeEngagement(notes: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following classroom observation notes: \n\n ${notes}`,
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
    return JSON.parse(response.text || '{}');
  },

  /**
   * Generates content for the AI Library.
   */
  async generateEducationalContent(topic: string, contentType: 'quiz' | 'summary' | 'problems') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create a high-quality ${contentType} about: "${topic}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            items: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  hint: { type: Type.STRING }
                }
              }
            }
          },
          required: ["title", "content"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  /**
   * Recommends related resources based on a topic.
   */
  async getRelatedResources(topic: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 3 related educational resources (videos, articles, or simulations) for the topic: "${topic}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['video', 'article', 'sim'] },
              description: { type: Type.STRING }
            },
            required: ["title", "type", "description"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  },

  /**
   * Analyzes an image for AR Socratic Hints.
   */
  async analyzeARImage(base64Image: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using vision model
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Analyze this homework problem. Don't solve it. Provide 3 short 'Socratic Hints' to guide the student. Return as JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedTopic: { type: Type.STRING },
            hints: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["detectedTopic", "hints"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  /**
   * Generates synergy-based teams.
   */
  async generateSynergyTeams(students: any[]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create optimal project teams from this student list. Balance technical skills with creative skills. \n\n Students: ${JSON.stringify(students)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              teamName: { type: Type.STRING },
              synergyScore: { type: Type.NUMBER },
              rationale: { type: Type.STRING },
              members: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["teamName", "synergyScore", "rationale", "members"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  }
};
