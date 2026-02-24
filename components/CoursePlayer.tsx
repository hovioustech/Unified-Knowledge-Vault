import React, { useState, useEffect } from 'react';
import { Chapter, Track, Quiz, Submission, RemedialContent } from '../types';
import { generateQuiz, gradeSubmission, generateRemedialContent } from '../services/aiService';
import { getProgress, updateProgress, saveSubmission, getRemedialContentForUser, saveRemedialContent } from '../services/localDbService';
import { CheckCircle2, PlayCircle, FileText, BrainCircuit, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';
import { generateChapterContent } from '../services/offlineContentService';

interface CoursePlayerProps {
  track: Track;
  chapter: Chapter;
  userId: string;
  onComplete: () => void;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ track, chapter, userId, onComplete }) => {
  const [content, setContent] = useState<string>('');
  const [remedialContent, setRemedialContent] = useState<RemedialContent[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      // Load main content
      const generated = await generateChapterContent({ id: 'mock', trackId: track.id, name: track.title, description: '' }, chapter, 'student');
      setContent(generated.contentBody);

      // Load remedial content if any
      const existingRemedial = await getRemedialContentForUser(userId, chapter.id);
      setRemedialContent(existingRemedial);

      // Generate quiz
      const newQuiz = await generateQuiz(chapter.title, track.title);
      setQuiz(newQuiz);
      
      setLoading(false);
    };
    loadContent();
  }, [chapter.id, track.title, userId]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    setGrading(true);
    
    const sub: Submission = {
      id: `sub_${Date.now()}`,
      userId,
      assessmentId: quiz.id,
      answers,
      gradedBy: 'pending',
      timestamp: new Date().toISOString()
    };
    
    try {
      const result = await gradeSubmission(sub, quiz);
      sub.score = result.score;
      sub.feedback = result.feedback;
      sub.gradedBy = 'ai';
      
      await saveSubmission(sub);
      setSubmission(sub);

      // Update progress and generate remedial content if score < 80
      const progress = await getProgress(userId, track.id);
      if (result.score >= 80) {
        if (!progress.completedChapterIds.includes(chapter.id)) {
          progress.completedChapterIds.push(chapter.id);
        }
      } else {
        progress.weakPoints = [...new Set([...progress.weakPoints, ...result.weakPoints])];
        
        // Generate remedial content for weak points
        for (const wp of result.weakPoints) {
          const contentText = await generateRemedialContent(wp, track.title);
          const newRemedial: RemedialContent = {
            id: `rem_${Date.now()}_${Math.random()}`,
            userId,
            chapterId: chapter.id,
            topic: wp,
            content: contentText
          };
          await saveRemedialContent(newRemedial);
          setRemedialContent(prev => [...prev, newRemedial]);
        }
      }
      await updateProgress(progress);
    } catch (error) {
      console.error("Error grading submission:", error);
    } finally {
      setGrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-vault-muted">
        <RefreshCw className="animate-spin mb-4" size={32} />
        <p>Generating personalized course content and assessments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-vault-border shadow-sm">
        <h1 className="text-3xl font-serif font-bold text-vault-text mb-2">{chapter.title}</h1>
        <p className="text-vault-muted">{chapter.description}</p>
      </div>

      {/* Remedial Content Section */}
      {remedialContent.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center text-amber-800 font-bold mb-4">
            <AlertCircle className="mr-2" size={20} />
            Targeted Review Based on Previous Assessments
          </div>
          <div className="space-y-4">
            {remedialContent.map((rem) => (
              <div key={rem.id} className="bg-white p-4 rounded-lg border border-amber-100">
                <h3 className="font-bold text-vault-text mb-2">Review: {rem.topic}</h3>
                <div className="prose prose-sm max-w-none text-slate-700">
                  <Markdown>{rem.content}</Markdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white p-6 rounded-xl border border-vault-border shadow-sm">
        <div className="flex items-center text-vault-accent font-bold mb-6 border-b border-vault-border pb-4">
          <FileText className="mr-2" size={20} />
          Lesson Content
        </div>
        <div className="prose prose-slate max-w-none">
          <Markdown>{content}</Markdown>
        </div>
      </div>

      {/* Interactive Elements Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
          <PlayCircle size={48} className="text-vault-accent mb-4" />
          <h3 className="font-bold mb-2">Interactive Video Lecture</h3>
          <p className="text-sm text-slate-400">Watch the AI-generated lecture for this module.</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-100 transition-colors">
          <BrainCircuit size={48} className="text-indigo-600 mb-4" />
          <h3 className="font-bold text-indigo-900 mb-2">Memory Pointers</h3>
          <p className="text-sm text-indigo-700">Review key concepts with interactive flashcards.</p>
        </div>
      </div>

      {/* Quiz Section */}
      {quiz && !submission && (
        <div className="bg-white p-6 rounded-xl border border-vault-border shadow-sm">
          <div className="flex items-center text-vault-text font-bold mb-6 border-b border-vault-border pb-4 text-xl">
            <CheckCircle2 className="mr-2 text-emerald-600" size={24} />
            Chapter Assessment
          </div>
          
          <div className="space-y-8">
            {quiz.questions.map((q, idx) => (
              <div key={q.id} className="space-y-3">
                <p className="font-bold text-vault-text">
                  <span className="text-vault-muted mr-2">{idx + 1}.</span>
                  {q.text}
                </p>
                
                {q.type === 'multiple-choice' && q.options ? (
                  <div className="space-y-2 pl-6">
                    {q.options.map((opt, oIdx) => (
                      <label key={oIdx} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                        <input 
                          type="radio" 
                          name={`q_${q.id}`} 
                          value={opt}
                          checked={answers[q.id] === opt}
                          onChange={() => handleAnswer(q.id, opt)}
                          className="text-vault-accent focus:ring-vault-accent"
                        />
                        <span className="text-sm text-slate-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="pl-6">
                    <textarea 
                      className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-vault-accent focus:border-vault-accent text-sm"
                      rows={4}
                      placeholder="Type your answer here..."
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleSubmitQuiz}
              disabled={grading || Object.keys(answers).length < quiz.questions.length}
              className="flex items-center px-6 py-3 bg-vault-accent text-white rounded-lg font-bold hover:bg-vault-accent/90 disabled:opacity-50 transition-all"
            >
              {grading ? (
                <><RefreshCw className="animate-spin mr-2" size={18} /> Grading via AI...</>
              ) : (
                <>Submit Assessment <ArrowRight className="ml-2" size={18} /></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {submission && (
        <div className={`p-6 rounded-xl border shadow-sm ${submission.score && submission.score >= 80 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center justify-between mb-4 border-b border-black/5 pb-4">
            <h2 className="text-2xl font-bold text-vault-text">Assessment Results</h2>
            <div className={`text-3xl font-bold ${submission.score && submission.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {submission.score}%
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none text-slate-700 mb-6">
            <Markdown>{submission.feedback || ''}</Markdown>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={onComplete}
              className="flex items-center px-6 py-2 bg-white text-vault-text border border-vault-border rounded-lg font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              {submission.score && submission.score >= 80 ? 'Continue to Next Chapter' : 'Review Remedial Content'}
              <ArrowRight className="ml-2" size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
