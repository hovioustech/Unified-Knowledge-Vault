import React, { useState, useEffect, useMemo } from 'react';
import { CERTIFICATION_TRACKS, CORE_DOMAINS, PARTNER_ROLES, PLACEHOLDER_CHAPTERS, FINANCIAL_MODEL, MODEL_ASSUMPTIONS, DEMO_INDUSTRIES } from './constants';
import { Domain, PartnerType, Chapter, Track } from './types';
import RoleSelector from './components/RoleSelector';
import TrackCard from './components/DomainCard'; // Reusing as TrackCard
import ChapterView from './components/ChapterView';
import { MessageSquare, LayoutGrid, Search, Bell, ArrowRight, ChevronRight, Home, CheckCircle2, Circle, Layers, RefreshCw, ShieldCheck, Binary, FileBadge, Waypoints, AlertTriangle, TrendingUp, Lock, BarChart3, Presentation, Settings2, Database, XCircle, Target, Map, Coins, Globe, Building, ArrowUpRight, Scale, Users, Activity, BookOpen, ChevronLeft, TreeDeciduous } from 'lucide-react';
import { chatWithVault } from './services/geminiService';

enum ViewState {
  TRACK_LIST,
  TRACK_DETAIL,
  CHAPTER_CONTENT
}

enum AppMode {
  INVESTOR_PITCH,
  LIVE_DEMO
}

enum PitchSubState {
  MAIN,
  PROBLEM_DEEP_DIVE,
  TRANSFORMATION_DEEP_DIVE
}

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.INVESTOR_PITCH);
  
  // Demo Mode State
  const [currentRole, setCurrentRole] = useState<PartnerType>(PartnerType.IP_Definition);
  const [viewState, setViewState] = useState<ViewState>(ViewState.TRACK_LIST);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  
  // Pitch Mode State
  const [pitchSubState, setPitchSubState] = useState<PitchSubState>(PitchSubState.MAIN);
  const [selectedTransformationIdx, setSelectedTransformationIdx] = useState<number>(0);

  // Progress State
  const [completedChapters, setCompletedChapters] = useState<string[]>(() => {
    const saved = localStorage.getItem('vault_progress');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('vault_progress', JSON.stringify(completedChapters));
  }, [completedChapters]);

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
    { role: 'bot', text: 'Welcome to the Investor Portal. Select a Transformation Stage to analyze the infrastructure.' }
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
    if (appMode === AppMode.INVESTOR_PITCH && pitchSubState !== PitchSubState.MAIN) {
      setPitchSubState(PitchSubState.MAIN);
      return;
    }
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

  // Smart Redirect: Pitch -> Demo
  const handleCoreAssetDrillDown = (topic: string) => {
    // Map generic pitch topics to specific Demo Tracks
    let targetTrackId = '';
    let targetIndustry = 'all';

    if (topic.includes("Climate")) { targetTrackId = 't2'; targetIndustry = 'gov'; }
    else if (topic.includes("Workforce")) { targetTrackId = 't3'; targetIndustry = 'trade'; }
    else if (topic.includes("Housing")) { targetTrackId = 't4'; targetIndustry = 'trade'; }
    else if (topic.includes("Governance")) { targetTrackId = 't5'; targetIndustry = 'gov'; }
    else if (topic.includes("Health")) { targetTrackId = 't7'; targetIndustry = 'corporate'; }
    else { targetTrackId = 't1'; }

    const track = CERTIFICATION_TRACKS.find(t => t.id === targetTrackId);
    
    if (track) {
      setAppMode(AppMode.LIVE_DEMO);
      setSelectedIndustry(targetIndustry);
      setSelectedTrack(track);
      setViewState(ViewState.TRACK_DETAIL);
      // Optional: scroll to top
      window.scrollTo(0, 0);
    }
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
      : `Viewing Dashboard as ${currentRole}`;

    const response = await chatWithVault(userMsg, context);
    
    setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
    setIsChatLoading(false);
  };

  // Filter tracks for Demo Mode based on "Industry"
  const filteredTracks = useMemo(() => {
    if (selectedIndustry === 'all') return CERTIFICATION_TRACKS;
    if (selectedIndustry === 'higher-ed') return CERTIFICATION_TRACKS.filter(t => ['t1', 't2', 't6', 't8'].includes(t.id));
    if (selectedIndustry === 'corporate') return CERTIFICATION_TRACKS.filter(t => ['t3', 't6', 't7', 't8'].includes(t.id));
    if (selectedIndustry === 'gov') return CERTIFICATION_TRACKS.filter(t => ['t2', 't4', 't5', 't6'].includes(t.id));
    if (selectedIndustry === 'trade') return CERTIFICATION_TRACKS.filter(t => ['t1', 't3', 't4'].includes(t.id));
    return CERTIFICATION_TRACKS;
  }, [selectedIndustry]);

  return (
    <div className="min-h-screen bg-vault-bg font-sans flex flex-col text-vault-text">
      {/* Header */}
      <header className="bg-white border-b border-vault-border sticky top-0 z-50 shadow-sm transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleBackToDashboard}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-colors ${appMode === AppMode.INVESTOR_PITCH ? 'bg-indigo-900' : 'bg-vault-accent'}`}>
              <LayoutGrid className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-tight text-vault-text">
              Unified<span className={appMode === AppMode.INVESTOR_PITCH ? 'text-indigo-900' : 'text-vault-accent'}>Vault</span> 
              <span className="text-sm font-sans font-normal text-vault-muted ml-1">
                 | {appMode === AppMode.INVESTOR_PITCH ? 'Investor Portal' : 'Live Platform'}
              </span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-full flex items-center border border-slate-200">
              <button 
                onClick={() => { setAppMode(AppMode.INVESTOR_PITCH); setPitchSubState(PitchSubState.MAIN); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center transition-all ${
                  appMode === AppMode.INVESTOR_PITCH 
                  ? 'bg-indigo-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Presentation size={14} className="mr-2" />
                Pitch Deck
              </button>
              <button 
                onClick={() => { setAppMode(AppMode.LIVE_DEMO); setViewState(ViewState.TRACK_LIST); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center transition-all ${
                  appMode === AppMode.LIVE_DEMO 
                  ? 'bg-vault-accent text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers size={14} className="mr-2" />
                Live Demo
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
                                      INVESTOR PITCH VIEW
           ================================================================================= */}
        {appMode === AppMode.INVESTOR_PITCH && (
          <div className="animate-fade-in">
            
            {/* SUB-VIEW: MAIN DECK */}
            {pitchSubState === PitchSubState.MAIN && (
              <div className="space-y-12">
                {/* SLIDE 1: Title & Hero */}
                <div className="text-center space-y-4 py-8">
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-indigo-950">Unified Knowledge Platform</h1>
                  <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light">
                    Institutional Licensing Infrastructure for <br/>
                    <span className="font-semibold text-vault-accent">Climate</span>, <span className="font-semibold text-vault-accent">Workforce</span>, and <span className="font-semibold text-vault-accent">Regenerative Systems</span>
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <div className="bg-white px-6 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-bold text-slate-700 flex items-center">
                      <Database size={16} className="mr-2 text-indigo-600"/> 38 Core Topics
                    </div>
                    <div className="bg-white px-6 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-bold text-slate-700 flex items-center">
                      <Layers size={16} className="mr-2 text-indigo-600"/> 608 Chapters
                    </div>
                    <div className="bg-white px-6 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-bold text-slate-700 flex items-center">
                      <Globe size={16} className="mr-2 text-indigo-600"/> One Unified Platform
                    </div>
                  </div>
                </div>

                {/* SLIDE 2 & 5: The Core Problem vs The Platform (CLICKABLE) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Problem */}
                  <div 
                    onClick={() => setPitchSubState(PitchSubState.PROBLEM_DEEP_DIVE)}
                    className="bg-red-50 rounded-2xl p-8 border border-red-100 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all relative group"
                  >
                    <div className="absolute top-4 right-4 text-red-300 group-hover:text-red-500 transition-colors">
                      <ArrowUpRight size={24} />
                    </div>
                    <div className="flex items-center mb-6">
                      <XCircle className="w-8 h-8 text-red-600 mr-3" />
                      <h2 className="text-2xl font-serif font-bold text-red-900">The Core Problem</h2>
                    </div>
                    <p className="text-red-800 mb-6 font-medium">Most knowledge platforms fail because:</p>
                    <ul className="space-y-4">
                      <li className="flex items-center text-red-700">
                         <span className="w-2 h-2 bg-red-400 rounded-full mr-3" /> They rely on one-time sales
                      </li>
                      <li className="flex items-center text-red-700">
                         <span className="w-2 h-2 bg-red-400 rounded-full mr-3" /> They lack legal licensing structure
                      </li>
                      <li className="flex items-center text-red-700">
                         <span className="w-2 h-2 bg-red-400 rounded-full mr-3" /> No institutional renewal engine
                      </li>
                    </ul>
                    <div className="mt-8 pt-6 border-t border-red-200 text-center font-bold text-red-900 text-sm">
                      Click to analyze the broken model vs. our solution
                    </div>
                  </div>

                  {/* Solution (Slide 5) */}
                  <div 
                    onClick={() => setPitchSubState(PitchSubState.PROBLEM_DEEP_DIVE)}
                    className="bg-white rounded-2xl p-8 border border-vault-border shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all relative group"
                  >
                    <div className="absolute top-4 right-4 text-slate-300 group-hover:text-vault-accent transition-colors">
                      <ArrowUpRight size={24} />
                    </div>
                    <div className="flex items-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-vault-accent mr-3" />
                      <h2 className="text-2xl font-serif font-bold text-vault-text">The Platform</h2>
                    </div>
                    <p className="text-slate-600 mb-6 font-medium">A single institutional platform that:</p>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <Binary className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="font-semibold text-slate-800">Converts knowledge into certifications</span>
                      </div>
                      <div className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <FileBadge className="w-5 h-5 text-indigo-600 mr-3" />
                        <span className="font-semibold text-slate-800">Licenses them to institutions</span>
                      </div>
                      <div className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <RefreshCw className="w-5 h-5 text-emerald-600 mr-3" />
                        <span className="font-semibold text-slate-800">Renews annually</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SLIDE 3 & 6: The 5-Transformation Engine (CLICKABLE) */}
                <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                   <div className="relative z-10 text-center mb-10">
                     <h2 className="text-2xl font-bold font-serif mb-2">The Five-Transformation Engine</h2>
                     <p className="text-slate-400">Click any stage to reveal how we structure durable wealth.</p>
                   </div>
                   
                   <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4">
                      {PARTNER_ROLES.map((role, idx) => (
                        <div key={idx} className="relative group">
                           <button 
                              onClick={() => {
                                setSelectedTransformationIdx(idx);
                                setPitchSubState(PitchSubState.TRANSFORMATION_DEEP_DIVE);
                              }}
                              className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl h-full flex flex-col items-center text-center hover:bg-slate-700 hover:border-indigo-500 transition-all cursor-pointer"
                           >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-slate-900 border border-slate-600 text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-colors`}>
                                 <span className="font-bold text-lg">{idx + 1}</span>
                              </div>
                              <div className="mb-2 text-indigo-300 group-hover:text-white">{role.icon}</div>
                              <h3 className="font-bold text-sm mb-2 leading-tight text-slate-200 group-hover:text-white">{role.label}</h3>
                              <p className="text-[10px] text-slate-400 leading-relaxed group-hover:text-slate-300">{role.description}</p>
                           </button>
                           {idx < 4 && (
                             <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20 text-slate-600">
                                <ArrowRight size={20} />
                             </div>
                           )}
                        </div>
                      ))}
                   </div>
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/20 to-transparent pointer-events-none" />
                </div>

                {/* SLIDE 4: The Core Asset (LINK TO DEMO) */}
                <div className="bg-white rounded-2xl p-8 border border-vault-border shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                     <div>
                        <h2 className="text-2xl font-bold font-serif text-vault-text">The Core Asset</h2>
                        <p className="text-slate-600">A unified knowledge vault covering critical multi-sector architectures.</p>
                     </div>
                     <div className="text-right hidden md:block">
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Multi-Sector</span>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {[
                        { label: "Climate & Agroforestry", icon: <TreeDeciduous size={20} /> },
                        { label: "Workforce Development", icon: <Users size={20} /> },
                        { label: "Housing Systems", icon: <Home size={20} /> },
                        { label: "Governance & Capital", icon: <Scale size={20} /> },
                        { label: "Health & Performance", icon: <Activity size={20} /> }
                      ].map((topic, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleCoreAssetDrillDown(topic.label)}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer"
                        >
                           <div className="text-slate-400 group-hover:text-vault-accent mb-2 transition-colors">{topic.icon}</div>
                           <span className="font-semibold text-sm text-slate-800 group-hover:text-vault-accent">{topic.label}</span>
                           <span className="text-[10px] text-slate-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                             View Modules <ArrowRight size={10} className="ml-1"/>
                           </span>
                        </button>
                      ))}
                   </div>
                </div>

                {/* SLIDE 11: Financials */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-vault-border shadow-md relative overflow-hidden">
                      <div className="flex justify-between items-center mb-8 relative z-10">
                        <div>
                          <h2 className="text-2xl font-bold font-serif text-vault-text flex items-center">
                            <BarChart3 className="w-6 h-6 mr-3 text-indigo-600" />
                            5-Year Growth Path
                          </h2>
                          <p className="text-vault-muted text-sm mt-1">Conservative projections based on verified contract values.</p>
                        </div>
                      </div>

                      <div className="flex items-end justify-between space-x-4 h-80 relative z-10 pt-4">
                         {FINANCIAL_MODEL.map((year, idx) => (
                           <div key={idx} className="flex-1 flex flex-col justify-end group">
                              <div className="text-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-y-2 duration-300">
                                 <div className="text-xs font-bold text-slate-800">{year.clients}</div>
                                 <div className="text-[10px] text-slate-500">{year.details}</div>
                              </div>
                              <div className={`w-full ${year.color} rounded-t-lg relative shadow-md group-hover:shadow-lg transition-all ${year.height} flex items-end justify-center pb-2`}>
                                <span className="text-white font-bold text-sm md:text-base drop-shadow-md text-center px-1">{year.revenue}</span>
                              </div>
                              <div className="text-center mt-3">
                                 <div className="font-bold text-sm text-slate-700">{year.year}</div>
                                 <div className="text-[10px] text-slate-400 uppercase tracking-wider leading-tight">{year.label}</div>
                              </div>
                           </div>
                         ))}
                      </div>
                      <div className="absolute inset-0 top-24 px-8 z-0 pointer-events-none opacity-20">
                         <div className="w-full h-px bg-slate-300 mb-16"></div>
                         <div className="w-full h-px bg-slate-300 mb-16"></div>
                         <div className="w-full h-px bg-slate-300 mb-16"></div>
                      </div>
                   </div>

                   {/* Key Assumptions Side Panel */}
                   <div className="bg-slate-900 rounded-2xl p-8 shadow-xl text-white flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Database size={120} />
                      </div>
                      <h3 className="text-xl font-bold mb-6 flex items-center relative z-10">
                        <Settings2 className="w-5 h-5 mr-2 text-indigo-400" />
                        Key Assumptions
                      </h3>
                      <div className="space-y-6 relative z-10">
                        {MODEL_ASSUMPTIONS.map((item, idx) => (
                          <div key={idx} className="border-b border-indigo-800/50 pb-4 last:border-0">
                            <div className="text-indigo-300 text-xs uppercase tracking-wider mb-1">{item.label}</div>
                            <div className="text-2xl font-bold">{item.value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 pt-6 border-t border-indigo-800 relative z-10">
                        <p className="text-xs text-indigo-200 italic leading-relaxed">
                          "Financials are driven by high-retention annual licensing, not one-off sales. This creates a compounding revenue baseline."
                        </p>
                      </div>
                   </div>
                </div>

                {/* STRATEGY GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="bg-white p-6 rounded-xl border border-vault-border shadow-sm">
                      <div className="flex items-center mb-4 text-emerald-700">
                         <Coins className="w-5 h-5 mr-2" />
                         <h3 className="font-bold">Revenue Model</h3>
                      </div>
                      <ul className="space-y-3">
                         <li className="text-sm text-slate-600 flex items-start"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 mt-1.5"/> Institutional Licensing</li>
                         <li className="text-sm text-slate-600 flex items-start"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 mt-1.5"/> Enterprise Licensing</li>
                         <li className="text-sm text-slate-600 flex items-start"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 mt-1.5"/> Regional Contracts</li>
                      </ul>
                   </div>
                   <div className="bg-white p-6 rounded-xl border border-vault-border shadow-sm">
                      <div className="flex items-center mb-4 text-blue-700">
                         <Target className="w-5 h-5 mr-2" />
                         <h3 className="font-bold">Target Customers</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {["Universities", "Workforce Agencies", "Corporate Sustainability", "Government", "NGOs"].map(c => (
                            <span key={c} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-100">{c}</span>
                         ))}
                      </div>
                   </div>
                   <div className="bg-white p-6 rounded-xl border border-vault-border shadow-sm">
                      <div className="flex items-center mb-4 text-indigo-700">
                         <Map className="w-5 h-5 mr-2" />
                         <h3 className="font-bold">GTM Strategy</h3>
                      </div>
                      <div className="space-y-3 text-sm">
                         <div><span className="font-bold text-slate-800">Phase 1:</span> <span className="text-slate-600">Anchor Institutions</span></div>
                         <div><span className="font-bold text-slate-800">Phase 2:</span> <span className="text-slate-600">Enterprise Clients</span></div>
                         <div><span className="font-bold text-slate-800">Phase 3:</span> <span className="text-slate-600">National Licensing</span></div>
                      </div>
                   </div>
                   <div className="bg-white p-6 rounded-xl border border-vault-border shadow-sm">
                      <div className="flex items-center mb-4 text-purple-700">
                         <Building className="w-5 h-5 mr-2" />
                         <h3 className="font-bold">Use of Capital</h3>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-600">
                         <li className="flex items-center justify-between border-b border-slate-100 pb-1"><span>IP Structuring</span> <span className="font-bold text-slate-400">20%</span></li>
                         <li className="flex items-center justify-between border-b border-slate-100 pb-1"><span>Platform Build</span> <span className="font-bold text-slate-400">30%</span></li>
                         <li className="flex items-center justify-between border-b border-slate-100 pb-1"><span>Cert. Packaging</span> <span className="font-bold text-slate-400">15%</span></li>
                         <li className="flex items-center justify-between border-b border-slate-100 pb-1"><span>Sales & Pilots</span> <span className="font-bold text-slate-400">35%</span></li>
                      </ul>
                   </div>
                </div>

                {/* SLIDE 9: Competitive Advantage */}
                <div className="mb-12 bg-vault-text rounded-2xl p-8 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-5">
                      <Lock size={150} />
                   </div>
                   <div className="relative z-10">
                      <h2 className="text-2xl font-bold font-serif mb-6 text-white border-b border-slate-700 pb-4 inline-block">Competitive Advantage</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0"><Database size={16}/></div>
                            <div><h4 className="font-bold text-vault-accent">Large Unified Vault</h4><p className="text-sm text-slate-400">Proprietary "Golden Record" of knowledge.</p></div>
                         </div>
                         <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0"><Layers size={16}/></div>
                            <div><h4 className="font-bold text-vault-accent">Multi-Sector</h4><p className="text-sm text-slate-400">Cross-pollinated credentials.</p></div>
                         </div>
                         <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0"><FileBadge size={16}/></div>
                            <div><h4 className="font-bold text-vault-accent">Licensing-First</h4><p className="text-sm text-slate-400">High-margin revenue model.</p></div>
                         </div>
                         <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0"><RefreshCw size={16}/></div>
                            <div><h4 className="font-bold text-vault-accent">Renewal-Based</h4><p className="text-sm text-slate-400">Compounding annual contracts.</p></div>
                         </div>
                         <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0"><Waypoints size={16}/></div>
                            <div><h4 className="font-bold text-vault-accent">Embedded Strategy</h4><p className="text-sm text-slate-400">Operational stickiness.</p></div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW: PROBLEM DEEP DIVE */}
            {pitchSubState === PitchSubState.PROBLEM_DEEP_DIVE && (
              <div className="animate-fade-in space-y-8">
                 <button onClick={() => setPitchSubState(PitchSubState.MAIN)} className="flex items-center text-vault-muted hover:text-vault-accent mb-4">
                   <ChevronLeft size={16} className="mr-1"/> Back to Pitch Deck
                 </button>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
                    <div className="bg-red-50 rounded-2xl p-10 border border-red-100 flex flex-col justify-center">
                       <h2 className="text-3xl font-serif font-bold text-red-900 mb-6">The "Broken" Model</h2>
                       <p className="text-red-800 text-lg mb-8">Why traditional EdTech and Knowledge Platforms struggle with profitability.</p>
                       <ul className="space-y-6">
                         <li className="flex items-start">
                            <XCircle className="w-6 h-6 text-red-500 mr-4 mt-1 flex-shrink-0"/>
                            <div>
                               <h4 className="font-bold text-red-900">High CAC, Low LTV</h4>
                               <p className="text-red-700 text-sm mt-1">Selling single courses requires constant marketing spend. There is no recurring revenue baseline.</p>
                            </div>
                         </li>
                         <li className="flex items-start">
                            <XCircle className="w-6 h-6 text-red-500 mr-4 mt-1 flex-shrink-0"/>
                            <div>
                               <h4 className="font-bold text-red-900">Content Decay</h4>
                               <p className="text-red-700 text-sm mt-1">Static video courses become obsolete in 18 months, requiring expensive reproduction.</p>
                            </div>
                         </li>
                         <li className="flex items-start">
                            <XCircle className="w-6 h-6 text-red-500 mr-4 mt-1 flex-shrink-0"/>
                            <div>
                               <h4 className="font-bold text-red-900">Low Retention</h4>
                               <p className="text-red-700 text-sm mt-1">Users certify and leave. The platform captures no long-term value from their career.</p>
                            </div>
                         </li>
                       </ul>
                    </div>

                    <div className="bg-emerald-50 rounded-2xl p-10 border border-emerald-100 flex flex-col justify-center">
                       <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-6">The Unified Solution</h2>
                       <p className="text-emerald-800 text-lg mb-8">How we turn knowledge into a renewable institutional asset.</p>
                       <ul className="space-y-6">
                         <li className="flex items-start">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 mr-4 mt-1 flex-shrink-0"/>
                            <div>
                               <h4 className="font-bold text-emerald-900">Institutional Licensing</h4>
                               <p className="text-emerald-700 text-sm mt-1">We sell to the Enterprise, not the Student. Multi-year contracts with annual price lifts.</p>
                            </div>
                         </li>
                         <li className="flex items-start">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 mr-4 mt-1 flex-shrink-0"/>
                            <div>
                               <h4 className="font-bold text-emerald-900">Embedded Operations</h4>
                               <p className="text-emerald-700 text-sm mt-1">Our API connects to LMS & HR systems. We become the "Operating System" for their compliance.</p>
                            </div>
                         </li>
                         <li className="flex items-start">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 mr-4 mt-1 flex-shrink-0"/>
                            <div>
                               <h4 className="font-bold text-emerald-900">Forced Renewal</h4>
                               <p className="text-emerald-700 text-sm mt-1">Certifications require annual maintenance updates, guaranteeing recurring revenue.</p>
                            </div>
                         </li>
                       </ul>
                    </div>
                 </div>
              </div>
            )}

            {/* SUB-VIEW: TRANSFORMATION DETAIL */}
            {pitchSubState === PitchSubState.TRANSFORMATION_DEEP_DIVE && (
               <div className="animate-fade-in space-y-8">
                  <button onClick={() => setPitchSubState(PitchSubState.MAIN)} className="flex items-center text-vault-muted hover:text-vault-accent mb-4">
                    <ChevronLeft size={16} className="mr-1"/> Back to Transformation Engine
                  </button>

                  <div className="bg-white rounded-2xl border border-vault-border shadow-xl overflow-hidden">
                     <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
                        <div className="flex items-center">
                           <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold mr-6">
                              {selectedTransformationIdx + 1}
                           </div>
                           <div>
                              <h2 className="text-3xl font-serif font-bold">{PARTNER_ROLES[selectedTransformationIdx].label}</h2>
                              <p className="text-indigo-300 text-lg">The Strategic Partner Role</p>
                           </div>
                        </div>
                        <div className="bg-white/10 p-3 rounded-lg">
                           {React.cloneElement(PARTNER_ROLES[selectedTransformationIdx].icon as React.ReactElement<any>, { size: 40 })}
                        </div>
                     </div>
                     
                     <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                           <h3 className="text-xl font-bold text-vault-text mb-4 border-b pb-2">Operational Responsibilities</h3>
                           <p className="text-slate-600 text-lg leading-relaxed mb-6">
                              {PARTNER_ROLES[selectedTransformationIdx].description}
                           </p>
                           <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                              <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-3">Target Partner Profiles</h4>
                              <ul className="space-y-3">
                                 {selectedTransformationIdx === 0 && (
                                    <>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> University Curriculum Consultancies</li>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> Workforce Training Design Firms</li>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> Technical Subject Matter Experts</li>
                                    </>
                                 )}
                                 {selectedTransformationIdx === 1 && (
                                    <>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> IP Licensing Law Firms</li>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> Reg A Securities Counsel</li>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> Trust & Estate Attorneys</li>
                                    </>
                                 )}
                                 {selectedTransformationIdx === 2 && (
                                    <>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> EdTech Product Teams</li>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> Certification Designers</li>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> LMS Platform Integrators</li>
                                    </>
                                 )}
                                 {selectedTransformationIdx === 3 && (
                                    <>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> Higher-Ed Sales Organizations</li>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> Government Procurement Specialists</li>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> Enterprise Training Distributors</li>
                                    </>
                                 )}
                                 {selectedTransformationIdx === 4 && (
                                    <>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> Customer Success Providers</li>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> Accreditation Compliance Auditors</li>
                                       <li className="flex items-center text-slate-600"><Circle size={8} className="mr-2 text-indigo-500 fill-indigo-500"/> Integration Technologists</li>
                                    </>
                                 )}
                              </ul>
                           </div>
                        </div>

                        <div>
                           <h3 className="text-xl font-bold text-vault-text mb-4 border-b pb-2">Economic Impact</h3>
                           <div className="space-y-4">
                              <div className="flex p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                 <div className="mr-4 text-indigo-600 mt-1"><TrendingUp size={24}/></div>
                                 <div>
                                    <h4 className="font-bold text-indigo-900">Value Creation</h4>
                                    <p className="text-sm text-indigo-800">
                                       {selectedTransformationIdx === 0 && "Transforms raw expertise into structured, tradable intellectual property."}
                                       {selectedTransformationIdx === 1 && "Secures the asset, preventing leakage and enabling fractional ownership models."}
                                       {selectedTransformationIdx === 2 && "Increases user adoption by reducing friction and improving learning outcomes."}
                                       {selectedTransformationIdx === 3 && "Scales revenue through high-volume B2B channels rather than B2C marketing."}
                                       {selectedTransformationIdx === 4 && "Maximizes Lifetime Value (LTV) through sticky, multi-year operational dependence."}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                 <div className="mr-4 text-emerald-600 mt-1"><Lock size={24}/></div>
                                 <div>
                                    <h4 className="font-bold text-emerald-900">Defensibility</h4>
                                    <p className="text-sm text-emerald-800">
                                       {selectedTransformationIdx === 0 && "Proprietary Curriculum Architecture."}
                                       {selectedTransformationIdx === 1 && "Legal Monopolies & Trademarks."}
                                       {selectedTransformationIdx === 2 && "Brand Recognition & User Experience."}
                                       {selectedTransformationIdx === 3 && "Exclusive Distribution Contracts."}
                                       {selectedTransformationIdx === 4 && "High Switching Costs & Data Lock-in."}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

          </div>
        )}

        {/* =================================================================================
                                      LIVE DEMO VIEW
           ================================================================================= */}
        {appMode === AppMode.LIVE_DEMO && (
          <div className="animate-fade-in">
             
             {/* Use Case Tuner */}
             {viewState === ViewState.TRACK_LIST && (
               <div className="mb-8 bg-white border border-vault-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between">
                 <div className="flex items-center mb-4 md:mb-0">
                   <div className="p-2 bg-vault-accent/10 rounded-lg mr-3 text-vault-accent">
                      <Settings2 size={24} />
                   </div>
                   <div>
                      <h3 className="font-bold text-vault-text">Curriculum Tuner</h3>
                      <p className="text-xs text-vault-muted">Dial down 608 chapters into industry-specific tracks.</p>
                   </div>
                 </div>
                 <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                    {DEMO_INDUSTRIES.map(ind => (
                      <button
                        key={ind.id}
                        onClick={() => setSelectedIndustry(ind.id)}
                        className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                          selectedIndustry === ind.id 
                          ? 'bg-vault-accent text-white border-vault-accent' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-vault-accent'
                        }`}
                      >
                        {ind.label}
                      </button>
                    ))}
                 </div>
               </div>
             )}

             {/* Partner Role Perspective */}
             {viewState !== ViewState.CHAPTER_CONTENT && (
                <div className="mb-8">
                   <RoleSelector currentRole={currentRole} onSelectRole={setCurrentRole} />
                </div>
             )}

             {/* VIEW: TRACK LIST */}
             {viewState === ViewState.TRACK_LIST && (
               <div className="space-y-8">
                 <div className="flex justify-between items-end">
                    <div>
                       <h2 className="text-2xl font-bold font-serif text-vault-text">Asset Tracks</h2>
                       <p className="text-vault-muted mt-1">
                         {selectedIndustry === 'all' 
                           ? "Displaying full IP Library." 
                           : `Filtered for ${DEMO_INDUSTRIES.find(i => i.id === selectedIndustry)?.label} use cases.`}
                       </p>
                    </div>
                    <div className="text-sm font-medium text-vault-accent bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center">
                      <Database size={12} className="mr-2" />
                      {filteredTracks.length} Core Concepts • ~{filteredTracks.reduce((acc, t) => acc + t.estimatedChapters, 0)} Chapters
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {filteredTracks.map(track => (
                     <TrackCard 
                       key={track.id} 
                       track={track} 
                       progress={getTrackProgress(track.id)}
                       onClick={handleTrackClick} 
                     />
                   ))}
                   {filteredTracks.length === 0 && (
                     <div className="col-span-4 py-12 text-center text-vault-muted bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                       No tracks match this industry filter. Try selecting 'All Sectors'.
                     </div>
                   )}
                 </div>
               </div>
             )}

             {/* VIEW: TRACK DETAIL */}
             {viewState === ViewState.TRACK_DETAIL && selectedTrack && (
              <div className="animate-fade-in space-y-8">
                 {/* Breadcrumbs */}
                 <div className="flex items-center text-sm text-vault-muted space-x-2">
                    <button onClick={handleBackToDashboard} className="hover:text-vault-accent flex items-center"><Home size={14} className="mr-1"/> Library</button>
                    <ChevronRight size={14} />
                    <span className="font-medium text-vault-text">{selectedTrack.title}</span>
                 </div>

                <div className="bg-white border border-vault-border rounded-2xl p-8 relative overflow-hidden shadow-sm">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-vault-accent font-bold uppercase tracking-wider text-xs mb-2 block bg-blue-50 w-fit px-2 py-1 rounded">
                          {selectedTrack.topicsRange}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-vault-text mb-4">
                          {selectedTrack.title}
                        </h1>
                      </div>
                      <div className="hidden md:block text-right">
                         <div className="text-3xl font-bold text-vault-accent">{getTrackProgress(selectedTrack.id).percentage}%</div>
                         <div className="text-xs text-vault-muted uppercase tracking-wider">Analyzed</div>
                      </div>
                    </div>
                    <p className="text-slate-600 max-w-3xl text-lg leading-relaxed">
                      {selectedTrack.description}
                    </p>
                    
                    <div className="mt-6 max-w-xl">
                      <div className="flex justify-between text-xs text-vault-muted mb-1">
                        <span>Audit Progress</span>
                        <span>{getTrackProgress(selectedTrack.id).completed} / {getTrackProgress(selectedTrack.id).total} Modules</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-vault-accent transition-all duration-500" 
                          style={{ width: `${getTrackProgress(selectedTrack.id).percentage}%` }}
                        />
                      </div>
                    </div>

                  </div>
                  <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-vault-highlight to-transparent pointer-events-none opacity-50" />
                </div>

                <div className="space-y-6">
                   <h3 className="text-xl font-bold text-vault-text border-b border-vault-border pb-2">Core Domains</h3>
                   <div className="grid grid-cols-1 gap-6">
                      {CORE_DOMAINS.filter(d => d.trackId === selectedTrack.id).map((domain) => (
                        <div key={domain.id} className="bg-white border border-vault-border rounded-xl p-6 hover:shadow-md transition-shadow">
                           <h4 className="text-lg font-bold text-vault-text mb-2 flex items-center">
                              {domain.name}
                           </h4>
                           <p className="text-sm text-vault-muted mb-6">{domain.description}</p>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg">
                              {PLACEHOLDER_CHAPTERS.map((chapter, idx) => {
                                 const uniqueId = getChapterUniqueId(domain.id, chapter.id);
                                 const isCompleted = completedChapters.includes(uniqueId);
                                 return (
                                   <button 
                                      key={chapter.id}
                                      onClick={() => handleChapterClick(chapter, domain)}
                                      className={`text-left p-3 rounded-lg border transition-all group flex justify-between items-center relative overflow-hidden
                                        ${isCompleted 
                                          ? 'bg-blue-50 border-blue-200 text-blue-800' 
                                          : 'bg-white border-vault-border hover:border-vault-accent hover:text-vault-accent'
                                        }
                                      `}
                                   >
                                      <span className="text-sm font-medium z-10 flex items-center">
                                         {isCompleted ? (
                                           <CheckCircle2 size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                                         ) : (
                                           <span className="text-xs text-vault-muted font-normal mr-2">CH {idx+1}</span>
                                         )}
                                         <span className="truncate">{chapter.title}</span>
                                      </span>
                                      <ArrowRight size={14} className={`transition-opacity z-10 ${isCompleted ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'}`} />
                                      {isCompleted && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500" />}
                                   </button>
                                 );
                              })}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
             )}

             {/* VIEW: CHAPTER CONTENT */}
             {viewState === ViewState.CHAPTER_CONTENT && selectedDomain && selectedChapter && (
               <ChapterView 
                 domain={selectedDomain} 
                 chapter={selectedChapter}
                 partnerRole={currentRole}
                 onBack={handleBackToTrack}
                 isCompleted={completedChapters.includes(getChapterUniqueId(selectedDomain.id, selectedChapter.id))}
                 onToggleComplete={() => toggleChapterCompletion(getChapterUniqueId(selectedDomain.id, selectedChapter.id))}
               />
             )}
          </div>
        )}

      </main>

      {/* Floating Chat Assistant - Always visible but context aware */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all transform hover:scale-105 ${appMode === AppMode.INVESTOR_PITCH ? 'bg-indigo-900 shadow-indigo-900/30' : 'bg-vault-accent shadow-sky-600/30'}`}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}

        {isChatOpen && (
          <div className="w-80 md:w-96 bg-white border border-vault-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up h-[500px]">
            <div className={`${appMode === AppMode.INVESTOR_PITCH ? 'bg-indigo-900' : 'bg-vault-text'} p-4 flex justify-between items-center text-white`}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-bold text-sm">{appMode === AppMode.INVESTOR_PITCH ? 'IR Bot' : 'Vault Strategist'}</span>
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
                      ? `${appMode === AppMode.INVESTOR_PITCH ? 'bg-indigo-700' : 'bg-vault-accent'} text-white rounded-br-none` 
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
                  placeholder={appMode === AppMode.INVESTOR_PITCH ? "Ask about financials..." : "Ask for strategic analysis..."}
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