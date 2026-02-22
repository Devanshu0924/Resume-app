import React from 'react';
import { Candidate, AIAnalysis } from '../types';
import { CheckCircle2, AlertCircle, Award, Brain, Mail, Calendar, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  candidate: Candidate | null;
  onDelete: (id: number) => void;
}

export const CandidateDetails = ({ candidate, onDelete }: Props) => {
  if (!candidate) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-black/5 rounded-2xl border border-dashed border-black/10">
        <Brain className="w-12 h-12 text-black/10 mb-4" />
        <h3 className="font-bold text-lg text-black/40">Select a candidate</h3>
        <p className="text-sm text-black/30 max-w-[240px]">Choose a candidate from the list to view their AI-powered screening analysis.</p>
      </div>
    );
  }

  const analysis: AIAnalysis = JSON.parse(candidate.analysis);

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-bold text-xl">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{candidate.name}</h2>
            <div className="flex items-center gap-3 text-sm text-black/40 mt-1">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {candidate.email}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Screened {new Date(candidate.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => onDelete(candidate.id)}
          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4" /> AI Summary
          </h3>
          <div className="prose prose-sm max-w-none text-black/70 leading-relaxed">
            <ReactMarkdown>{analysis.summary}</ReactMarkdown>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-6">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Key Strengths
            </h3>
            <ul className="space-y-2">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-black/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Areas for Review
            </h3>
            <ul className="space-y-2">
              {analysis.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-black/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4" /> Skill Match Evaluation
          </h3>
          <div className="bg-black/5 p-4 rounded-xl">
            <p className="text-sm text-black/70 italic leading-relaxed">
              "{analysis.match_explanation}"
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Detected Skills</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-white border border-black/10 rounded-full text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
