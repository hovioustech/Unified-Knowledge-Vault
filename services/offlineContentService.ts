import { GeneratedContent, Domain, Chapter } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateChapterContent = async (
  domain: Domain,
  chapter: Chapter,
  roleFocus: string
): Promise<GeneratedContent> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a comprehensive educational chapter on "${chapter.title}" within the domain of "${domain.name}". 
      Tailor the content for a "${roleFocus}" perspective.
      
      The content should be structured, engaging, and suitable for a college-level course or professional certification.
      Include an executive summary, core methodologies, practical implementation examples, and future outlook.
      
      Return the response as a JSON object with the following structure:
      {
        "overview": "A short 2-3 sentence overview of the chapter.",
        "keyConcepts": ["Concept 1", "Concept 2", "Concept 3", "Concept 4", "Concept 5"],
        "roleSpecificInsight": "A specific insight relevant to the ${roleFocus} role.",
        "certificationCriteria": ["Criteria 1", "Criteria 2", "Criteria 3"],
        "contentBody": "The full markdown formatted essay/chapter content."
      }`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            roleSpecificInsight: { type: Type.STRING },
            certificationCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
            contentBody: { type: Type.STRING }
          },
          required: ['overview', 'keyConcepts', 'roleSpecificInsight', 'certificationCriteria', 'contentBody']
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      overview: data.overview || `Overview of ${chapter.title}`,
      keyConcepts: data.keyConcepts || [],
      roleSpecificInsight: data.roleSpecificInsight || '',
      certificationCriteria: data.certificationCriteria || [],
      contentBody: data.contentBody || `# ${chapter.title}\n\nContent could not be generated.`
    };
  } catch (error) {
    console.error("Error generating chapter content:", error);
    // Fallback content if API fails
    return {
      overview: `Fallback overview for ${chapter.title}.`,
      keyConcepts: ["Strategy", "Execution", "Review"],
      roleSpecificInsight: "Strategic value assessment operational.",
      certificationCriteria: ["Review Complete"],
      contentBody: `# ${chapter.title}\n\nThis is fallback content because the AI generation failed. Please check your API key and network connection.`
    };
  }
};

export const chatWithVault = async (message: string, currentContext?: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the "Vault Strategist", an AI assistant for the Unified Knowledge Vault platform. 
      The platform provides institutional licensing infrastructure for educational content in sectors like Climate, Workforce, and Regenerative Systems.
      
      Current Context: ${currentContext || 'General inquiry'}
      
      User Message: ${message}
      
      Provide a helpful, strategic, and concise response.`
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Error in chatWithVault:", error);
    return "I am currently offline. Please check your connection or API key.";
  }
}