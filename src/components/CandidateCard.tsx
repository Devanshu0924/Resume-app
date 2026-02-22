import React from 'react';
import { Candidate, AIAnalysis } from '../types';
import { Star, Mail, FileText, Check, X, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  candidate: Candidate;
  onStatusChange: (id: number, status: Candidate['status']) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const CandidateCard = ({ candidate, onStatusChange, onDelete, isSelected, onSelect }: Props) => {
  const analysis: AIAnalysis = JSON.parse(candidate.analysis);

  return (
    <div 
      onClick={onSelect}
      className={cn(
        "group p-4 rounded-xl border transition-all cursor-pointer",
        isSelected 
          ? "bg-black text-white border-black shadow-lg" 
          : "bg-white border-black/5 hover:border-black/20 shadow-sm"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
            isSelected ? "bg-white/20" : "bg-black/5"
          )}>
            {candidate.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold leading-tight">{candidate.name}</h3>
            <p className={cn("text-xs", isSelected ? "text-white/60" : "text-black/40")}>{candidate.email}</p>
          </div>
        </div>
        <div className={cn(
          "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
          candidate.score >= 80 ? "bg-emerald-500/20 text-emerald-500" :
          candidate.score >= 60 ? "bg-amber-500/20 text-amber-500" :
          "bg-rose-500/20 text-rose-500"
        )}>
          {candidate.score}% Match
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {analysis.skills.slice(0, 3).map((skill, i) => (
          <span key={i} className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-medium",
            isSelected ? "bg-white/10 text-white/80" : "bg-black/5 text-black/60"
          )}>
            {skill}
          </span>
        ))}
        {analysis.skills.length > 3 && (
          <span className={cn("text-[10px] font-medium self-center", isSelected ? "text-white/40" : "text-black/20")}>
            +{analysis.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-current/10">
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onStatusChange(candidate.id, 'shortlisted'); }}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              candidate.status === 'shortlisted' ? "bg-emerald-500 text-white" : "hover:bg-emerald-500/10 text-emerald-500"
            )}
          >
            <Check className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onStatusChange(candidate.id, 'rejected'); }}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              candidate.status === 'rejected' ? "bg-rose-500 text-white" : "hover:bg-rose-500/10 text-rose-500"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <ChevronRight className={cn("w-4 h-4 transition-transform", isSelected ? "translate-x-1" : "text-black/20")} />
      </div>
    </div>
  );
};
