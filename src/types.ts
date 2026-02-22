export interface Job {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export interface Candidate {
  id: number;
  job_id: number;
  name: string;
  email: string;
  resume_text: string;
  score: number;
  analysis: string; // JSON string
  status: 'pending' | 'shortlisted' | 'rejected';
  created_at: string;
}

export interface AIAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  skills: string[];
  match_explanation: string;
  score: number;
  candidate_name: string;
  candidate_email: string;
}
