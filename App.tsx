import React, { useState, useEffect, useMemo } from 'react';
import { CERTIFICATION_TRACKS, CORE_DOMAINS, PLACEHOLDER_CHAPTERS, FINANCIAL_MODEL, MODEL_ASSUMPTIONS, DEMO_INDUSTRIES } from './constants';
import { Domain, Chapter, Track } from './types';
import TrackCard from './components/DomainCard'; // Reusing as TrackCard
import LicensingModule from './components/LicensingModule';
import CoursePlayer from './components/CoursePlayer';
import InstructorDashboard from './components/InstructorDashboard';
import { initDb } from './services/localDbService';
import { MessageSquare, LayoutGrid, Search, Bell, ArrowRight, ChevronRight, Home, CheckCircle2, Circle, Layers, RefreshCw, ShieldCheck, Binary, FileBadge, Waypoints, AlertTriangle, TrendingUp, Lock, BarChart3, Presentation, Settings2, Database, XCircle, Target, Map, Coins, Globe, Building, ArrowUpRight, Scale, Users, Activity, BookOpen, ChevronLeft, TreeDeciduous, Key, GraduationCap, PlayCircle } from 'lucide-react';
import { chatWithVault } from './services/offlineContentService';

enum ViewState {
  TRACK_LIST,
  TRACK_DETAIL,
  CHAPTER_CONTENT
}

enum AppMode {
  LICENSING_MANAGER,
  STUDENT_PORTAL,
  INSTRUCTOR_PORTAL
}

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.STUDENT_PORTAL);
  
  // Demo Mode State
  const [viewState, setViewState] = useState<ViewState>(ViewState.TRACK_LIST);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  // Progress State
  const [completedChapters, setCompletedChapters] = useState<string[]>(() => {
    const saved = localStorage.getItem('vault_progress');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('vault_progress', JSON.stringify(completedChapters));
  }, [completedChapters]);

  useEffect(() => {
    // Initialize local database
    initDb().catch(console.error);
  }, []);

  const toggleChapterCompletion = (chapterUniqueId: string) => {
    setCompletedChapters(prev => 
      prev.includes(chapterUniqueId) 
        ? prev.filter(id => id !== chapterUniqueId)
        : [...prev, chapterUniqueId]
    );
  };

  const getChapterUniqueId = (domainId: string, chapterId: string) => `${domainId}_${chapterId}`;

  // Calculate Progress for a Track
  const getTrackProgress = (trackId: string) => {
    const trackDomains = CORE_DOMAINS.filter(d => d.trackId === trackId);
    const totalChapters = trackDomains.length * PLACEHOLDER_CHAPTERS.length;
    
    let completedCount = 0;
    trackDomains.forEach(domain => {
      PLACEHOLDER_CHAPTERS.forEach(chapter => {
        if (completedChapters.includes(getChapterUniqueId(domain.id, chapter.id))) {
          completedCount++;
        }
      });
    });

    return {
      completed: completedCount,
      total: totalChapters,
      percentage: totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0
    };
  };

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Welcome to the Medical Knowledge Vault. How can I assist you with your clinical education today?' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Navigation Handlers
  const handleTrackClick = (track: Track) => {
    setSelectedTrack(track);
    setViewState(ViewState.TRACK_DETAIL);
  };

  const handleChapterClick = (chapter: Chapter, domain: Domain) => {
    setSelectedDomain(domain);
    setSelectedChapter(chapter);
    setViewState(ViewState.CHAPTER_CONTENT);
  };

  const handleBackToDashboard = () => {
    setViewState(ViewState.TRACK_LIST);
    setSelectedTrack(null);
    setSelectedDomain(null);
    setSelectedChapter(null);
  };

  const handleBackToTrack = () => {
    setViewState(ViewState.TRACK_DETAIL);
    setSelectedChapter(null);
    setSelectedDomain(null);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    const context = selectedChapter 
      ? `Analyzing Component: ${selectedChapter.title} in Asset Track: ${selectedTrack?.title}` 
      : `Viewing Dashboard`;

    const response = await chatWithVault(userMsg, context);
    
    setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
    setIsChatLoading(false);
  };

  // Filter tracks for Demo Mode based on "Industry"
  const filteredTracks = useMemo(() => {
    if (selectedIndustry === 'all') return CERTIFICATION_TRACKS;
    if (selectedIndustry === 'cardiology') return CERTIFICATION_TRACKS.filter(t => ['t1', 't7'].includes(t.id));
    if (selectedIndustry === 'neurology') return CERTIFICATION_TRACKS.filter(t => ['t2', 't8'].includes(t.id));
    if (selectedIndustry === 'oncology') return CERTIFICATION_TRACKS.filter(t => ['t3', 't8'].includes(t.id));
    if (selectedIndustry === 'pediatrics') return CERTIFICATION_TRACKS.filter(t => ['t4', 't5'].includes(t.id));
    return CERTIFICATION_TRACKS;
  }, [selectedIndustry]);

  return (
    <div className="min-h-screen bg-vault-bg font-sans flex flex-col text-vault-text">
      {/* Header */}
      <header className="bg-white border-b border-vault-border sticky top-0 z-50 shadow-sm transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleBackToDashboard}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-colors ${appMode === AppMode.STUDENT_PORTAL ? 'bg-blue-600' : 'bg-vault-accent'}`}>
              <LayoutGrid className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-tight text-vault-text">
              Unified<span className={appMode === AppMode.LICENSING_MANAGER ? 'text-emerald-700' : 'text-vault-accent'}>Vault</span> 
              <span className="text-sm font-sans font-normal text-vault-muted ml-1">
                 | {appMode === AppMode.LICENSING_MANAGER ? 'Licensing Hub' : appMode === AppMode.STUDENT_PORTAL ? 'Student Portal' : appMode === AppMode.INSTRUCTOR_PORTAL ? 'Instructor Portal' : 'Live Platform'}
              </span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-full flex items-center border border-slate-200">
              <button 
                onClick={() => { setAppMode(AppMode.LICENSING_MANAGER); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center transition-all ${
                  appMode === AppMode.LICENSING_MANAGER 
                  ? 'bg-emerald-700 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Key size={14} className="mr-2" />
                Licensing
              </button>
              <button 
                onClick={() => { setAppMode(AppMode.STUDENT_PORTAL); setViewState(ViewState.TRACK_LIST); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center transition-all ${
                  appMode === AppMode.STUDENT_PORTAL 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <GraduationCap size={14} className="mr-2" />
                Student
              </button>
              <button 
                onClick={() => { setAppMode(AppMode.INSTRUCTOR_PORTAL); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center transition-all ${
                  appMode === AppMode.INSTRUCTOR_PORTAL 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users size={14} className="mr-2" />
                Instructor
              </button>
            </div>
            
            <div className="hidden md:flex h-8 w-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
               <div className="w-full h-full bg-gradient-to-tr from-vault-accent to-blue-300" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* =================================================================================
                                      LICENSING MANAGER VIEW
           ================================================================================= */}
        {appMode === AppMode.LICENSING_MANAGER && (
          <LicensingModule />
        )}

        {/* =================================================================================
                                      STUDENT PORTAL VIEW
           ================================================================================= */}
        {appMode === AppMode.STUDENT_PORTAL && (
          <div className="animate-fade-in space-y-8">
             {/* VIEW: TRACK LIST */}
             {viewState === ViewState.TRACK_LIST && (
               <div className="space-y-8">
                 <div className="bg-white p-8 rounded-2xl border border-vault-border shadow-sm text-center">
                   <h2 className="text-3xl font-serif font-bold text-vault-text mb-4">Welcome to Your Learning Portal</h2>
                   <p className="text-vault-muted max-w-2xl mx-auto">
                     Select a certification track below to begin or continue your coursework. Your progress is automatically saved.
                   </p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredTracks.map((track) => (
                     <TrackCard 
                       key={track.id} 
                       track={track} 
                       onClick={() => handleTrackClick(track)} 
                     />
                   ))}
                 </div>
               </div>
             )}

             {/* VIEW: TRACK DETAIL */}
             {viewState === ViewState.TRACK_DETAIL && selectedTrack && (
               <div className="space-y-8">
                 <button 
                   onClick={handleBackToDashboard}
                   className="flex items-center text-vault-muted hover:text-vault-accent transition-colors text-sm font-bold uppercase tracking-wider"
                 >
                   <ChevronLeft size={16} className="mr-1" /> Back to Courses
                 </button>
                 
                 <div className="bg-white border border-vault-border rounded-2xl p-8 shadow-sm">
                   <h1 className="text-3xl md:text-4xl font-serif font-bold text-vault-text mb-4">
                     {selectedTrack.title}
                   </h1>
                   <p className="text-slate-600 max-w-3xl text-lg leading-relaxed mb-8">
                     {selectedTrack.description}
                   </p>
                   
                   <div className="space-y-4">
                     <h3 className="text-xl font-bold text-vault-text border-b border-vault-border pb-2">Course Modules</h3>
                     <div className="grid grid-cols-1 gap-4">
                       {PLACEHOLDER_CHAPTERS.map((chapter, idx) => {
                         const uniqueId = `${selectedTrack.id}_${chapter.id}`;
                         const isCompleted = completedChapters.includes(uniqueId);
                         return (
                           <button 
                             key={chapter.id}
                             onClick={() => {
                               setSelectedChapter(chapter);
                               setViewState(ViewState.CHAPTER_CONTENT);
                             }}
                             className={`text-left p-4 rounded-xl border transition-all flex justify-between items-center
                               ${isCompleted 
                                 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                                 : 'bg-white border-vault-border hover:border-vault-accent hover:shadow-md'
                               }
                             `}
                           >
                             <div>
                               <span className="text-xs font-bold text-vault-muted uppercase tracking-wider mb-1 block">Module {idx + 1}</span>
                               <span className="font-bold text-lg">{chapter.title}</span>
                             </div>
                             {isCompleted ? (
                               <CheckCircle2 size={24} className="text-emerald-500" />
                             ) : (
                               <PlayCircle size={24} className="text-vault-accent opacity-50" />
                             )}
                           </button>
                         );
                       })}
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {/* VIEW: CHAPTER CONTENT (COURSE PLAYER) */}
             {viewState === ViewState.CHAPTER_CONTENT && selectedTrack && selectedChapter && (
               <div className="space-y-6">
                 <button 
                   onClick={() => setViewState(ViewState.TRACK_DETAIL)}
                   className="flex items-center text-vault-muted hover:text-vault-accent transition-colors text-sm font-bold uppercase tracking-wider"
                 >
                   <ChevronLeft size={16} className="mr-1" /> Back to Modules
                 </button>
                 <CoursePlayer 
                   track={selectedTrack} 
                   chapter={selectedChapter} 
                   userId="student1" // Mock user ID
                   onComplete={() => {
                     const uniqueId = `${selectedTrack.id}_${selectedChapter.id}`;
                     if (!completedChapters.includes(uniqueId)) {
                       setCompletedChapters(prev => [...prev, uniqueId]);
                     }
                     setViewState(ViewState.TRACK_DETAIL);
                   }}
                 />
               </div>
             )}
          </div>
        )}

        {/* =================================================================================
                                      INSTRUCTOR PORTAL VIEW
           ================================================================================= */}
        {appMode === AppMode.INSTRUCTOR_PORTAL && (
          <InstructorDashboard />
        )}

      </main>


      {/* Floating Chat Assistant - Always visible but context aware */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all transform hover:scale-105 bg-vault-accent shadow-sky-600/30`}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}

        {isChatOpen && (
          <div className="w-80 md:w-96 bg-white border border-vault-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up h-[500px]">
            <div className={`bg-vault-text p-4 flex justify-between items-center text-white`}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-bold text-sm">Vault Strategist</span>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? `bg-vault-accent text-white rounded-br-none` 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                 <div className="flex justify-start">
                   <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm">
                     <div className="flex space-x-1">
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
                     </div>
                   </div>
                 </div>
              )}
            </div>

            <form onSubmit={handleChatSubmit} className="p-4 border-t border-vault-border bg-white">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={"Ask for strategic analysis..."}
                  className="w-full bg-slate-50 border border-vault-border rounded-xl py-2 px-4 text-sm text-slate-900 focus:outline-none focus:border-vault-accent focus:ring-1 focus:ring-vault-accent transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-vault-accent hover:text-sky-700 p-1">
                  <span className="sr-only">Send</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;