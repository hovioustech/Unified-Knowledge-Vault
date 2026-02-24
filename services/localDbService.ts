import localforage from 'localforage';
import { User, Progress, Submission, Report, RemedialContent } from '../types';

// Initialize local databases
const usersDb = localforage.createInstance({ name: 'users' });
const progressDb = localforage.createInstance({ name: 'progress' });
const submissionsDb = localforage.createInstance({ name: 'submissions' });
const reportsDb = localforage.createInstance({ name: 'reports' });
const remedialDb = localforage.createInstance({ name: 'remedial' });

// Seed data
export const initDb = async () => {
  const users = await usersDb.length();
  if (users === 0) {
    await usersDb.setItem('student1', {
      id: 'student1',
      institutionId: 'inst1',
      name: 'Alice Student',
      email: 'alice@psu.edu',
      role: 'student'
    } as User);
    await usersDb.setItem('instructor1', {
      id: 'instructor1',
      institutionId: 'inst1',
      name: 'Dr. Bob Instructor',
      email: 'bob@psu.edu',
      role: 'instructor'
    } as User);
  }
};

export const getUser = async (id: string): Promise<User | null> => {
  return await usersDb.getItem<User>(id);
};

export const getAllStudents = async (institutionId: string): Promise<User[]> => {
  const students: User[] = [];
  await usersDb.iterate((value: User) => {
    if (value.role === 'student' && value.institutionId === institutionId) {
      students.push(value);
    }
  });
  return students;
};

export const getProgress = async (userId: string, trackId: string): Promise<Progress> => {
  const key = `${userId}_${trackId}`;
  let progress = await progressDb.getItem<Progress>(key);
  if (!progress) {
    progress = { userId, trackId, completedChapterIds: [], weakPoints: [] };
    await progressDb.setItem(key, progress);
  }
  return progress;
};

export const updateProgress = async (progress: Progress): Promise<void> => {
  const key = `${progress.userId}_${progress.trackId}`;
  await progressDb.setItem(key, progress);
};

export const saveSubmission = async (submission: Submission): Promise<void> => {
  await submissionsDb.setItem(submission.id, submission);
};

export const getSubmissionsForUser = async (userId: string): Promise<Submission[]> => {
  const subs: Submission[] = [];
  await submissionsDb.iterate((value: Submission) => {
    if (value.userId === userId) {
      subs.push(value);
    }
  });
  return subs;
};

export const saveReport = async (report: Report): Promise<void> => {
  await reportsDb.setItem(report.id, report);
};

export const getReportsForInstitution = async (institutionId: string): Promise<Report[]> => {
  const reports: Report[] = [];
  const students = await getAllStudents(institutionId);
  const studentIds = new Set(students.map(s => s.id));
  
  await reportsDb.iterate((value: Report) => {
    if (studentIds.has(value.userId)) {
      reports.push(value);
    }
  });
  return reports;
};

export const saveRemedialContent = async (content: RemedialContent): Promise<void> => {
  await remedialDb.setItem(content.id, content);
};

export const getRemedialContentForUser = async (userId: string, chapterId: string): Promise<RemedialContent[]> => {
  const content: RemedialContent[] = [];
  await remedialDb.iterate((value: RemedialContent) => {
    if (value.userId === userId && value.chapterId === chapterId) {
      content.push(value);
    }
  });
  return content;
};
