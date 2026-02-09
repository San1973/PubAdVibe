
import { GoogleGenAI, Type } from "@google/genai";
import { BRAND_MANIFESTO, MODEL_NAME } from "../constants";
import { AuditResult } from "../types";

export const processAdImage = async (base64Image: string): Promise<AuditResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this advertisement image against the following Brand Manifesto:
    ${BRAND_MANIFESTO}

    Perform these checks:
    1. Harmony Score (0-100): How well does it align with MyMorningYoga's minimalism and wellness aesthetic?
    2. Deceptive UI Scan: Look for fake 'X' buttons, fake system notifications, or deceptive "Download Now" buttons that mimic system UI.
    3. 2026 RAF Policy: Check for deepfake celebrity endorsements, AI-generated scam faces, or unrealistic financial promises.

    Provide a summary of your findings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Image.split(',')[1] || base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            harmonyScore: { type: Type.NUMBER },
            deceptiveUIScan: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING, description: "CLEAN or THREAT_DETECTED" },
                findings: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["status", "findings"]
            },
            rafPolicyViolation: {
              type: Type.OBJECT,
              properties: {
                detected: { type: Type.BOOLEAN },
                details: { type: Type.STRING }
              },
              required: ["detected", "details"]
            },
            summary: { type: Type.STRING }
          },
          required: ["harmonyScore", "deceptiveUIScan", "rafPolicyViolation", "summary"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as AuditResult;
    return result;
  } catch (error) {
    console.error("Gemini Audit Error:", error);
    throw error;
  }
};
