import React from 'react';
import { Briefcase, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

export const Header = () => (
  <header className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <Briefcase className="text-white w-5 h-5" />
        </div>
        <h1 className="font-bold text-xl tracking-tight">TalentFlow <span className="text-black/40 font-medium">AI</span></h1>
      </div>
      <nav className="flex items-center gap-6 text-sm font-medium text-black/60">
        <a href="#" className="text-black">Dashboard</a>
        <a href="#" className="hover:text-black transition-colors">Jobs</a>
        <a href="#" className="hover:text-black transition-colors">Settings</a>
      </nav>
    </div>
  </header>
);

export const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-black/40 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);
