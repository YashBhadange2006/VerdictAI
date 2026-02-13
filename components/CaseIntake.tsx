import React, { useRef } from 'react';
import { Bot, Sparkles, FileUp, X, Upload, FileText } from 'lucide-react';

interface CaseIntakeProps {
  complaint: string;
  setComplaint: (val: string) => void;
  onAnalyze: () => void;
  isReady: boolean;
  isLoading: boolean;
  files: File[];
  setFiles: (files: File[]) => void;
}

export const CaseIntake: React.FC<CaseIntakeProps> = ({ 
  complaint, 
  setComplaint, 
  onAnalyze, 
  isReady,
  isLoading,
  files,
  setFiles
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // Filter out duplicates based on name
      const uniqueFiles = newFiles.filter(nf => !files.some(f => f.name === nf.name));
      setFiles([...files, ...uniqueFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="h-full flex flex-col gap-5">
       <div className="flex items-center gap-3 text-blue-400">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Bot size={20} />
        </div>
        <h2 className="font-semibold text-lg">New Case Intake</h2>
      </div>

      {/* Unified Knowledge Base Upload */}
      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Knowledge Base Documents</h3>
            <span className="text-xs text-slate-600">{files.length} uploaded</span>
        </div>
        
        {/* Dropzone Area */}
        <div 
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800/60 hover:border-emerald-500/50 transition-all rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center text-center gap-2 group"
        >
            <input 
                type="file" 
                multiple 
                accept=".pdf" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect}
            />
            <div className="p-2 rounded-full bg-slate-800 group-hover:bg-slate-700 text-slate-400 group-hover:text-emerald-400 transition-colors">
                <Upload size={20} />
            </div>
            <p className="text-sm text-slate-300">
                Click to upload Acts, Judgments, or Evidence
            </p>
            <p className="text-xs text-slate-500">Supports multiple PDF files</p>
        </div>

        {/* File List */}
        {files.length > 0 && (
            <div className="flex flex-col gap-2 mt-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                {files.map((file, idx) => (
                    <div key={`${file.name}-${idx}`} className="flex items-center justify-between bg-slate-800 p-2 px-3 rounded-lg border border-slate-700/50">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <FileText size={14} className="text-emerald-500 flex-shrink-0" />
                            <span className="text-xs text-slate-300 truncate">{file.name}</span>
                        </div>
                        <button 
                            onClick={() => removeFile(idx)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2 min-h-[200px]">
        <label className="text-sm text-slate-400 ml-1">Grievance Description</label>
        <textarea
          className="
            flex-1 w-full bg-slate-800/50 text-slate-200 
            border border-slate-700 rounded-xl p-5 
            focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none
            resize-none transition-all placeholder:text-slate-600
          "
          placeholder="Detailed description of the incident..."
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
        />
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={!isReady || isLoading}
        className={`
          relative w-full py-4 rounded-xl font-semibold text-lg tracking-wide
          flex items-center justify-center gap-3 transition-all duration-300
          ${isReady && !isLoading
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/50 hover:shadow-emerald-900/80 transform hover:-translate-y-1' 
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }
        `}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
             <span>Analyzing Case Files...</span>
          </div>
        ) : (
          <>
            <Sparkles size={20} className={isReady ? "text-yellow-200" : ""} />
            <span>Analyze & Generate Strategy</span>
          </>
        )}
      </button>
    </div>
  );
};