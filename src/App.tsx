import React, { useState, useEffect } from 'react';
import { Header, StatCard } from './components/Layout';
import { JobPanel } from './components/JobPanel';
import { ResumeUploader } from './components/ResumeUploader';
import { CandidateCard } from './components/CandidateCard';
import { CandidateDetails } from './components/CandidateDetails';
import { Job, Candidate } from './types';
import { analyzeResume } from './services/gemini';
import { Users, CheckCircle, XCircle, Clock, Search, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchCandidates(selectedJob.id);
    } else {
      setCandidates([]);
      setSelectedCandidate(null);
    }
  }, [selectedJob]);

  const fetchJobs = async () => {
    const res = await fetch('/api/jobs');
    const data = await res.json();
    setJobs(data);
    if (data.length > 0 && !selectedJob) {
      setSelectedJob(data[0]);
    }
  };

  const fetchCandidates = async (jobId: number) => {
    const res = await fetch(`/api/candidates/${jobId}`);
    const data = await res.json();
    setCandidates(data);
  };

  const handleCreateJob = async (title: string, description: string) => {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    const newJob = await res.json();
    setJobs([newJob, ...jobs]);
    setSelectedJob(newJob);
  };

  const handleResumeUpload = async (text: string) => {
    if (!selectedJob) return;
    setIsProcessing(true);
    try {
      const analysis = await analyzeResume(text, selectedJob.description);
      
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: selectedJob.id,
          name: analysis.candidate_name,
          email: analysis.candidate_email,
          resume_text: text,
          score: analysis.score,
          analysis: analysis
        }),
      });
      
      if (res.ok) {
        await fetchCandidates(selectedJob.id);
      }
    } catch (error) {
      console.error("Error processing resume:", error);
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusChange = async (id: number, status: Candidate['status']) => {
    const res = await fetch(`/api/candidates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setCandidates(candidates.map(c => c.id === id ? { ...c, status } : c));
      if (selectedCandidate?.id === id) {
        setSelectedCandidate({ ...selectedCandidate, status });
      }
    }
  };

  const handleDeleteCandidate = async (id: number) => {
    if (!confirm("Are you sure you want to delete this candidate?")) return;
    const res = await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCandidates(candidates.filter(c => c.id !== id));
      if (selectedCandidate?.id === id) {
        setSelectedCandidate(null);
      }
    }
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: candidates.length,
    shortlisted: candidates.filter(c => c.status === 'shortlisted').length,
    rejected: candidates.filter(c => c.status === 'rejected').length,
    pending: candidates.filter(c => c.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans selection:bg-black selection:text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <div className="col-span-3 space-y-6">
            <JobPanel 
              jobs={jobs} 
              selectedJob={selectedJob} 
              onSelect={setSelectedJob}
              onCreate={handleCreateJob}
            />
            
            {selectedJob && (
              <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                <h3 className="font-bold text-sm uppercase tracking-wider text-black/40 mb-4">Job Details</h3>
                <h4 className="font-bold text-lg mb-2">{selectedJob.title}</h4>
                <p className="text-sm text-black/60 line-clamp-6 leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-9 space-y-8">
            
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Total Candidates" value={stats.total} icon={Users} color="bg-blue-50 text-blue-600" />
              <StatCard label="Shortlisted" value={stats.shortlisted} icon={CheckCircle} color="bg-emerald-50 text-emerald-600" />
              <StatCard label="Rejected" value={stats.rejected} icon={XCircle} color="bg-rose-50 text-rose-600" />
              <StatCard label="Pending" value={stats.pending} icon={Clock} color="bg-amber-50 text-amber-600" />
            </div>

            {selectedJob ? (
              <div className="grid grid-cols-12 gap-8 items-start">
                
                {/* List Column */}
                <div className="col-span-5 space-y-6">
                  <ResumeUploader onUpload={handleResumeUpload} isProcessing={isProcessing} />
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <input 
                        placeholder="Search candidates..."
                        className="w-full bg-white border border-black/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {filteredCandidates.map(candidate => (
                          <motion.div
                            key={candidate.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          >
                            <CandidateCard 
                              candidate={candidate}
                              isSelected={selectedCandidate?.id === candidate.id}
                              onSelect={() => setSelectedCandidate(candidate)}
                              onStatusChange={handleStatusChange}
                              onDelete={handleDeleteCandidate}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {filteredCandidates.length === 0 && (
                        <div className="py-12 text-center bg-black/5 rounded-2xl border border-dashed border-black/10">
                          <p className="text-sm text-black/40 italic">No candidates found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details Column */}
                <div className="col-span-7 sticky top-24 h-[calc(100vh-120px)]">
                  <CandidateDetails 
                    candidate={selectedCandidate} 
                    onDelete={handleDeleteCandidate}
                  />
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-black/5 shadow-sm text-center">
                <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
                  <Briefcase className="w-10 h-10 text-black/20" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Job Selected</h2>
                <p className="text-black/40 max-w-sm">
                  Create or select a job from the sidebar to start screening candidates.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
