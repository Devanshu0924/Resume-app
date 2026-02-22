import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeResume(resumeText: string, jobDescription: string): Promise<AIAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Analyze the following resume against the job description provided.
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      RESUME:
      ${resumeText}
    `,
    config: {
      systemInstruction: "You are an expert HR recruiter. Analyze the resume objectively and provide a structured evaluation in JSON format.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          candidate_name: { type: Type.STRING },
          candidate_email: { type: Type.STRING },
          summary: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          match_explanation: { type: Type.STRING },
          score: { type: Type.INTEGER, description: "Match score from 0 to 100" },
        },
        required: ["candidate_name", "candidate_email", "summary", "strengths", "weaknesses", "skills", "match_explanation", "score"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
