import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent, PartnerType, Domain, Chapter } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateChapterContent = async (
  domain: Domain,
  chapter: Chapter,
  partnerType: PartnerType
): Promise<GeneratedContent> => {
  const model = 'gemini-3-flash-preview';

  const prompt = `
    You are the Strategic Analyst for the "Unified Knowledge Vault," a defensible intellectual infrastructure asset.
    
    Context:
    - Transformation Stage: ${partnerType}
    - Asset Domain: ${domain.name}
    - Asset Component: ${chapter.title}
    
    Task: Analyze this component from the perspective of an Investor or Strategic Partner involved in the specified Transformation Stage.
    
    Guidelines based on Transformation Stage:
    - If "IP Definition": Focus on curriculum architecture, accreditation standards, and defining the "Golden Record" of knowledge.
    - If "Legal Structuring": Focus on IP protection strategies, licensing frameworks, securities compliance (Reg A), and asset ring-fencing.
    - If "Product Packaging": Focus on EdTech delivery formats, certification design, gamification, and user experience packaging.
    - If "Contractual Licensing": Focus on sales channels, government procurement vehicles, enterprise training contracts, and distribution scaling.
    - If "Institutional Embedding": Focus on LMS integration points, customer success protocols, sticky renewal mechanisms, and compliance reporting.

    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING, description: "A strategic summary of how this component contributes to the platform's value at this stage." },
            keyConcepts: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "5 key value drivers or strategic imperatives."
            },
            roleSpecificInsight: { type: Type.STRING, description: "A thesis statement on why this specific component is a defensible asset." },
            certificationCriteria: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 operational deliverables or milestones required at this stage."
            }
          },
          required: ["overview", "keyConcepts", "roleSpecificInsight", "certificationCriteria"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    return JSON.parse(text) as GeneratedContent;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      overview: "Unable to retrieve strategic analysis at this time.",
      keyConcepts: ["System Offline", "Check Connection"],
      roleSpecificInsight: "Data unavailable.",
      certificationCriteria: []
    };
  }
};

export const chatWithVault = async (message: string, currentContext?: string): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    You are the "Vault Strategist", an expert guide for investors analyzing the Unified Knowledge Vault.
    The platform is a multi-sector institutional curriculum provider and renewal-based licensing engine.
    
    User Context: ${currentContext || "Dashboard"}
    User Query: "${message}"
    
    Provide a professional, concise, investor-focused answer.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "I am currently analyzing the infrastructure. Please ask again.";
  } catch (e) {
    return "Connection to the Vault interrupted.";
  }
}
