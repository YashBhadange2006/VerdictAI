import React, { useState } from 'react';
import { CaseIntake } from './components/CaseIntake';
import { ResultsDashboard } from './components/ResultsDashboard';
import { MyCases } from './components/MyCases';
import { analyzeLegalCase } from './services/geminiService';
import { saveCaseToStorage } from './services/storage';
import { LegalStrategyResponse, AppStatus, SavedCase, Tab } from './types';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  // New File State: Array based
  const [files, setFiles] = useState<File[]>([]);
  const [complaint, setComplaint] = useState<string>("");
  
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [analysisResult, setAnalysisResult] = useState<LegalStrategyResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async () => {
    console.log("--- Analyze Button Clicked ---");

    try {
      if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
        await window.aistudio.openSelectKey();
      }
    } catch (e) {
      console.warn("API Key check failed, attempting to proceed...", e);
    }
    
    if (files.length === 0) {
      const msg = "Please upload at least one document (Act, Judgment, or Evidence).";
      alert(msg);
      return;
    }
    
    if (!complaint || complaint.length < 20) {
      const msg = "Please provide a detailed description of your grievance (at least 20 characters).";
      alert(msg);
      return;
    }

    setErrorMessage(null);
    setStatus(AppStatus.ANALYZING);
    setAnalysisResult(null);

    try {
      console.log("Calling analyzeLegalCase service...");
      const data = await analyzeLegalCase(complaint, files);
      
      console.log("Analysis Success. Data received:", data);
      
      setAnalysisResult(data);
      setStatus(AppStatus.COMPLETE);
      
      // Auto-save the case to local storage
      saveCaseToStorage(complaint, data);
      
      console.log("State updated: COMPLETE. Result set and saved to Storage.");
      alert("Analysis Complete! Case saved to 'My Cases'.");

    } catch (error: any) {
      console.error("--- Analysis Failed ---", error);
      setStatus(AppStatus.ERROR);
      
      if (error.message === "UNAUTHENTICATED") {
         setErrorMessage("Session expired. Please re-select your API Key.");
         try {
           if (window.aistudio) await window.aistudio.openSelectKey();
         } catch (e) {
            console.error("Failed to open key selector", e);
         }
      } else {
         setErrorMessage(error.message || "An unexpected error occurred during analysis.");
      }
    }
  };

  const handleLoadCase = (savedCase: SavedCase) => {
    setComplaint(savedCase.complaint);
    setAnalysisResult(savedCase.result);
    setStatus(AppStatus.COMPLETE);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isReady = !!(files.length > 0 && complaint.length > 20);

  const renderContent = () => {
    if (activeTab === 'cases') {
      return (
        <div className="h-full max-w-[1920px] mx-auto p-2 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Case History</h2>
            <span className="text-sm text-slate-500">Stored locally in browser</span>
          </div>
          <MyCases onLoadCase={handleLoadCase} />
        </div>
      );
    }

    // Updated Layout: Wide screen optimization
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full max-w-[1920px] mx-auto w-full">
          {/* Column 1: Intake (Left) - Takes 4/12 columns on large screens */}
          <section className="lg:col-span-4 xl:col-span-3 bg-slate-900/30 rounded-2xl border border-slate-800 p-6 flex flex-col shadow-2xl relative overflow-hidden min-h-[500px] lg:min-h-0 order-2 lg:order-1">
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
             <CaseIntake 
                complaint={complaint}
                setComplaint={setComplaint}
                onAnalyze={handleAnalyze}
                isReady={isReady}
                isLoading={status === AppStatus.ANALYZING}
                files={files}
                setFiles={setFiles}
             />
          </section>

          {/* Column 2: Results (Right) - Takes 8/12 columns on large screens */}
          <section className="lg:col-span-8 xl:col-span-9 bg-slate-900/30 rounded-2xl border border-slate-800 p-1 flex flex-col shadow-2xl overflow-hidden relative min-h-[600px] lg:min-h-0 order-1 lg:order-2">
             <div className="absolute inset-0 p-5 overflow-hidden">
               <div className="h-full relative overflow-y-auto custom-scrollbar">
                  <ResultsDashboard 
                    result={analysisResult} 
                    isLoading={status === AppStatus.ANALYZING} 
                    error={errorMessage}
                  />
               </div>
             </div>
          </section>
        </div>
    );
  };

  const NavItem = ({ id, label }: { id: Tab, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`transition-colors relative px-4 py-2 ${activeTab === id ? 'text-white' : 'text-slate-400 hover:text-emerald-400'}`}
    >
      {label}
      {activeTab === id && (
        <motion.div 
          layoutId="activeTab"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-hidden flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center px-6 sticky top-0 z-10 justify-between">
        <div className="flex items-center gap-2 text-emerald-500">
          <ShieldCheck size={28} strokeWidth={2.5} />
          <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">ConsumerShield <span className="text-emerald-500">AI</span></h1>
        </div>
        
        <nav className="flex items-center gap-2 sm:gap-6 text-sm font-medium">
           <NavItem id="dashboard" label="Dashboard" />
           <NavItem id="cases" label="My Cases" />
        </nav>
        
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-xs font-mono text-emerald-500">SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;