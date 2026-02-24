import { GoogleGenAI, Type } from '@google/genai';
import { Quiz, Question, Submission, Report, RemedialContent } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateQuiz = async (chapterTitle: string, trackTitle: string): Promise<Quiz> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a 3-question quiz for the chapter "${chapterTitle}" in the course "${trackTitle}". Include 2 multiple-choice questions and 1 short writing question.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, description: "Either 'multiple-choice' or 'writing'" },
                text: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                rubric: { type: Type.STRING }
              },
              required: ['id', 'type', 'text']
            }
          }
        },
        required: ['questions']
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  return {
    id: `quiz_${Date.now()}`,
    chapterId: chapterTitle,
    questions: data.questions || []
  };
};

export const gradeSubmission = async (submission: Submission, quiz: Quiz): Promise<{ score: number, feedback: string, weakPoints: string[] }> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Grade the following student submission for a quiz.
    Quiz Questions: ${JSON.stringify(quiz.questions)}
    Student Answers: ${JSON.stringify(submission.answers)}
    
    Provide a score out of 100, detailed feedback, and a list of weak points (topics) the student needs to review.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          weakPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['score', 'feedback', 'weakPoints']
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  return {
    score: data.score || 0,
    feedback: data.feedback || 'No feedback provided.',
    weakPoints: data.weakPoints || []
  };
};

export const generateRemedialContent = async (topic: string, trackTitle: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a short, targeted remedial lesson on the topic "${topic}" for a student taking the course "${trackTitle}". Explain it simply with a real-world example.`
  });
  return response.text || 'Remedial content unavailable.';
};
