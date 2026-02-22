import React, { useState } from 'react';
import { Job } from '../types';
import { Plus, Briefcase, ChevronDown, Check } from 'lucide-react';

interface Props {
  jobs: Job[];
  selectedJob: Job | null;
  onSelect: (job: Job) => void;
  onCreate: (title: string, description: string) => void;
}

export const JobPanel = ({ jobs, selectedJob, onSelect, onCreate }: Props) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    onCreate(newTitle, newDesc);
    setNewTitle('');
    setNewDesc('');
    setIsCreating(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-black/5 flex items-center justify-between bg-black/5">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-black/40" />
          <span className="font-bold text-sm uppercase tracking-wider">Active Jobs</span>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="p-1 hover:bg-black/5 rounded-lg transition-colors"
        >
          <Plus className={`w-5 h-5 transition-transform ${isCreating ? 'rotate-45' : ''}`} />
        </button>
      </div>

      <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto">
        {isCreating && (
          <form onSubmit={handleSubmit} className="p-3 bg-black/5 rounded-xl space-y-3 mb-2">
            <input 
              autoFocus
              placeholder="Job Title (e.g. Senior Frontend Engineer)"
              className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <textarea 
              placeholder="Job Description..."
              rows={4}
              className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <button 
                type="submit"
                className="flex-1 bg-black text-white text-xs font-bold py-2 rounded-lg hover:bg-black/80 transition-colors"
              >
                Create Job
              </button>
              <button 
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-2 text-xs font-bold border border-black/10 rounded-lg hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {jobs.map(job => (
          <button
            key={job.id}
            onClick={() => onSelect(job)}
            className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
              selectedJob?.id === job.id ? 'bg-black text-white' : 'hover:bg-black/5'
            }`}
          >
            <div className="flex flex-col">
              <span className="font-bold text-sm">{job.title}</span>
              <span className={`text-[10px] ${selectedJob?.id === job.id ? 'text-white/60' : 'text-black/40'}`}>
                {new Date(job.created_at).toLocaleDateString()}
              </span>
            </div>
            {selectedJob?.id === job.id && <Check className="w-4 h-4" />}
          </button>
        ))}

        {jobs.length === 0 && !isCreating && (
          <div className="p-8 text-center">
            <p className="text-sm text-black/40 italic">No jobs created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
