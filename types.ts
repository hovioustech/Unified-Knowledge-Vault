export interface Track {
  id: string;
  title: string;
  description: string;
  topicsRange: string; // e.g., "Topics 1-5"
  icon: string;
  estimatedChapters: number;
}

export interface Domain {
  id: string;
  trackId: string;
  name: string;
  description: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
}

export interface GeneratedContent {
  overview: string;
  keyConcepts: string[];
  roleSpecificInsight: string;
  certificationCriteria: string[]; // Reused as "Operational Deliverables"
  contentBody: string; // Full essay content
}

export interface Institution {
  id: string;
  name: string;
  type: 'higher-ed' | 'corporate' | 'gov' | 'trade';
  contactEmail: string;
  location: string;
}

export interface License {
  id: string;
  institutionId: string;
  trackId: string;
  licenseKey: string;
  status: 'active' | 'expired' | 'pending';
  issuedDate: string;
  expiryDate: string;
  seatsTotal: number;
  seatsUsed: number;
}

export interface User {
  id: string;
  institutionId: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'writing';
  text: string;
  options?: string[]; // For multiple choice
  correctAnswer?: string; // For multiple choice
  rubric?: string; // For writing
}

export interface Quiz {
  id: string;
  chapterId: string;
  questions: Question[];
}

export interface Exam {
  id: string;
  trackId: string;
  questions: Question[];
}

export interface Submission {
  id: string;
  userId: string;
  assessmentId: string; // Quiz or Exam ID
  answers: Record<string, string>; // Question ID -> Answer
  score?: number;
  feedback?: string;
  gradedBy: 'ai' | 'instructor' | 'pending';
  timestamp: string;
}

export interface Progress {
  userId: string;
  trackId: string;
  completedChapterIds: string[];
  weakPoints: string[]; // Topics to generate remedial content for
}

export interface RemedialContent {
  id: string;
  userId: string;
  chapterId: string;
  content: string;
  topic: string;
}

export interface Report {
  id: string;
  userId: string;
  examId: string;
  score: number;
  aiAnalysis: string;
  timestamp: string;
}
