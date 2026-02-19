import React from 'react';
import { Track } from '../types';
import * as LucideIcons from 'lucide-react';

interface TrackCardProps {
  track: Track;
  progress?: { completed: number; total: number; percentage: number };
  onClick: (track: Track) => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, progress, onClick }) => {
  const IconComponent = (LucideIcons as any)[track.icon] || LucideIcons.HelpCircle;
  const percentage = progress?.percentage || 0;

  return (
    <div 
      onClick={() => onClick(track)}
      className="group relative overflow-hidden rounded-xl bg-white border border-vault-border hover:border-vault-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200 cursor-pointer flex flex-col h-full"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-vault-text">
        <IconComponent size={80} />
      </div>
      
      <div className="p-6 relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-lg bg-vault-bg flex items-center justify-center text-vault-text group-hover:bg-vault-accent group-hover:text-white transition-colors border border-vault-border group-hover:border-transparent">
            <IconComponent size={24} />
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-vault-muted bg-slate-100 px-2 py-1 rounded-full">
              {track.topicsRange}
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              ~{track.estimatedChapters} Chapters
            </span>
          </div>
        </div>
        
        <h3 className="text-lg font-serif font-bold text-vault-text mb-2 group-hover:text-vault-accent transition-colors">
          {track.title}
        </h3>
        
        <p className="text-sm text-vault-muted mb-4 flex-grow">
          {track.description}
        </p>

        {/* Progress Bar */}
        <div className="mt-auto pt-4 border-t border-slate-100">
           <div className="flex justify-between items-center mb-2">
             <span className="text-xs font-medium text-vault-muted">
                {progress ? (
                    <span className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${percentage > 0 ? 'bg-vault-accent' : 'bg-slate-300'}`}></span>
                        Progress
                    </span>
                ) : 'Status'}
             </span>
             <span className="text-xs font-bold text-vault-text">
                {progress ? `${progress.completed} / ${progress.total} Modules` : 'Start'}
             </span>
           </div>
           <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
             <div 
               className="bg-vault-accent h-full rounded-full transition-all duration-500 ease-out" 
               style={{ width: `${percentage}%` }}
             />
           </div>
           {percentage > 0 && (
             <div className="text-[10px] text-right text-vault-muted mt-1">
               {percentage}% Completed
             </div>
           )}
        </div>

        <div className="flex items-center text-xs font-medium text-vault-accent opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 mt-3">
          {percentage > 0 ? 'Continue Certification' : 'Begin Track'} <LucideIcons.ArrowRight size={14} className="ml-1" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-vault-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </div>
  );
};

export default TrackCard;
