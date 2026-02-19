import React, { useEffect, useState } from 'react';
import { Domain, Chapter, PartnerType, GeneratedContent } from '../types';
import { generateChapterContent } from '../services/geminiService';
import { Loader2, ArrowLeft, Award, BookOpen, AlertCircle, Sparkles, CheckCircle2, Circle, Briefcase, FileText } from 'lucide-react';

interface ChapterViewProps {
  domain: Domain;
  chapter: Chapter;
  partnerRole: PartnerType;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onBack: () => void;
}

const ChapterView: React.FC<ChapterViewProps> = ({ domain, chapter, partnerRole, isCompleted, onToggleComplete, onBack }) => {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchContent = async () => {
      setLoading(true);
      const data = await generateChapterContent(domain, chapter, partnerRole);
      if (mounted) {
        setContent(data);
        setLoading(false);
      }
    };
    fetchContent();
    return () => { mounted = false; };
  }, [domain, chapter, partnerRole]);

  return (
    <div className="animate-fade-in min-h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white hover:shadow-sm text-vault-muted hover:text-vault-accent transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center space-x-2 text-xs text-vault-accent uppercase tracking-widest mb-1 font-semibold">
              <span>{domain.name}</span>
              <span>•</span>
              <span>{partnerRole.split(':')[0]} View</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-vault-text flex items-center">
              {chapter.title}
              {isCompleted && <CheckCircle2 className="w-6 h-6 ml-3 text-green-500" />}
            </h2>
          </div>
        </div>

        {/* Completion Toggle */}
        <button 
          onClick={onToggleComplete}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
            isCompleted 
            ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' 
            : 'bg-white text-slate-500 hover:text-vault-accent hover:border-vault-accent border border-slate-200'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={18} className="mr-2" />
              Reviewed
            </>
          ) : (
            <>
              <Circle size={18} className="mr-2" />
              Mark Reviewed
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-vault-muted">
          <div className="relative">
            <div className="absolute inset-0 bg-vault-accent/20 rounded-full blur-xl animate-pulse"></div>
            <Loader2 className="relative w-12 h-12 animate-spin mb-4 text-vault-accent" />
          </div>
          <p className="font-medium text-vault-text">Analyzing Infrastructure Asset...</p>
          <p className="text-xs mt-2">Retrieving strategic data for {partnerRole.split(':')[1]}...</p>
        </div>
      ) : content ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-vault-border shadow-sm">
              <h3 className="text-xl font-bold text-vault-text mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-vault-accent" />
                Strategic Component Overview
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {content.overview}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-vault-border shadow-sm">
              <h3 className="text-xl font-bold text-vault-text mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-vault-gold" />
                Value Drivers for {partnerRole.split(':')[0]}
              </h3>
              <ul className="space-y-4">
                {content.keyConcepts.map((concept, idx) => (
                  <li key={idx} className="flex items-start bg-slate-50 p-3 rounded-lg">
                    <span className="w-6 h-6 rounded-full bg-vault-accent text-white flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0 font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 font-medium">{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-vault-accent to-blue-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10"><Sparkles size={60} /></div>
              <h4 className="text-sm font-bold text-blue-100 uppercase tracking-wider mb-4 relative z-10">
                Asset Defense Thesis
              </h4>
              <div className="prose prose-invert prose-sm relative z-10">
                <p className="italic text-white font-serif text-lg leading-relaxed">
                  "{content.roleSpecificInsight}"
                </p>
              </div>
            </div>

            <div className={`bg-white p-6 rounded-2xl border border-l-4 shadow-sm transition-all ${isCompleted ? 'border-green-500 border-l-green-500' : 'border-vault-border border-l-vault-gold'}`}>
              <div className="flex items-center mb-4">
                <FileText className={`w-6 h-6 mr-2 ${isCompleted ? 'text-green-500' : 'text-vault-gold'}`} />
                <h4 className="font-bold text-vault-text">Operational Deliverables</h4>
              </div>
              <p className="text-xs text-vault-muted mb-4">
                Required milestones for this stage:
              </p>
              <ul className="space-y-3">
                {content.certificationCriteria.map((criteria, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-600">
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 mt-1.5 flex-shrink-0 ${isCompleted ? 'bg-green-500' : 'bg-vault-gold'}`} />
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onToggleComplete}
                className={`w-full mt-6 py-2.5 rounded-lg text-sm font-bold transition-colors border ${
                  isCompleted 
                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                  : 'bg-vault-gold/10 text-vault-gold border-vault-gold/30 hover:bg-vault-gold/20'
                }`}
              >
                {isCompleted ? 'Milestones Met' : 'Validate Deliverables'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-500">Failed to load content.</div>
      )}
    </div>
  );
};

export default ChapterView;
