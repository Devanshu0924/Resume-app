import React, { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onUpload: (text: string) => void;
  isProcessing: boolean;
}

export const ResumeUploader = ({ onUpload, isProcessing }: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    
    // In a real app, we'd use a PDF parser. For this demo, we'll read as text.
    // If it's a PDF, we'd need a library like pdfjs-dist.
    // For simplicity, we'll assume text/plain or just read the first few KB.
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onUpload(text);
    };
    reader.readAsText(file);
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
        isDragging ? 'border-black bg-black/5' : 'border-black/10 hover:border-black/20'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
      }}
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        accept=".txt,.md,.pdf"
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {isProcessing ? (
          <>
            <Loader2 className="w-12 h-12 text-black animate-spin" />
            <div>
              <p className="font-semibold text-lg">Analyzing Resume...</p>
              <p className="text-sm text-black/40">Gemini is evaluating skills and experience</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-black/60" />
            </div>
            <div>
              <p className="font-semibold text-lg">Click or drag resume here</p>
              <p className="text-sm text-black/40">Support TXT, MD, or PDF (text-only)</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
