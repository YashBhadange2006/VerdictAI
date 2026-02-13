import React, { useRef } from 'react';
import { Upload, FileCheck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  label: string;
  accept: string;
  file: File | null;
  onFileSelect: (file: File) => void;
  icon?: React.ReactNode;
}

const FileUploadZone: React.FC<FileUploadProps> = ({ label, accept, file, onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        relative group cursor-pointer 
        border border-dashed rounded-xl p-6 transition-all duration-300
        flex flex-col items-center justify-center text-center gap-3
        ${file 
          ? 'bg-emerald-500/10 border-emerald-500/50' 
          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-500'
        }
      `}
    >
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleChange} 
        accept={accept} 
        className="hidden" 
      />
      
      {file ? (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-emerald-400"
        >
          <FileCheck size={32} />
        </motion.div>
      ) : (
        <div className="text-slate-400 group-hover:text-emerald-400 transition-colors">
          <Upload size={32} />
        </div>
      )}

      <div className="flex flex-col">
        <span className={`font-medium ${file ? 'text-emerald-400' : 'text-slate-200'}`}>
          {file ? file.name : label}
        </span>
        {!file && <span className="text-xs text-slate-500 mt-1">PDF files only</span>}
      </div>
    </div>
  );
};

interface SidebarProps {
  actFile: File | null;
  judgmentsFile: File | null;
  setActFile: (f: File) => void;
  setJudgmentsFile: (f: File) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ actFile, judgmentsFile, setActFile, setJudgmentsFile }) => {
  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center gap-3 text-emerald-400 mb-2">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <FileText size={20} />
        </div>
        <h2 className="font-semibold text-lg">1. Knowledge Base</h2>
      </div>
      
      <p className="text-slate-400 text-sm mb-2">
        Load the legal brain. Ensure these documents are up to date for accurate strategy.
      </p>

      <div className="space-y-4">
        <FileUploadZone 
          label="Upload 'Consumer Protection Act.pdf'"
          accept=".pdf"
          file={actFile}
          onFileSelect={setActFile}
        />
        <FileUploadZone 
          label="Upload 'Landmark Judgments.pdf'"
          accept=".pdf"
          file={judgmentsFile}
          onFileSelect={setJudgmentsFile}
        />
      </div>

      <div className="mt-auto p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 text-xs text-slate-500">
        <p>Supported Formats: PDF</p>
        <p className="mt-1">Max Size: 15MB per file</p>
      </div>
    </div>
  );
};