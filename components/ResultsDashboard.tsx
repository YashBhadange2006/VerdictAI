
import React, { useState, useEffect } from 'react';
import { Gavel, Scale, ClipboardList, ArrowRight, Quote, AlertTriangle, ShieldAlert, CheckCircle2, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { LegalStrategyResponse } from '../types';
import { LegalNoticeModal } from './LegalNoticeModal';
import { SkeletonLoader } from './SkeletonLoader';

interface ResultsDashboardProps {
  result: LegalStrategyResponse | null;
  isLoading: boolean;
  error?: string | null;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, isLoading, error }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debugging: Monitor what data actually reaches this component
  useEffect(() => {
    if (result) {
      console.log("ResultsDashboard: Data Received & Rendering:", result);
    }
  }, [result]);

  // 1. Loading State
  if (isLoading) {
    return <SkeletonLoader />;
  }

  // 2. Error State
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-red-900/50 rounded-2xl bg-red-950/20">
        <div className="p-4 rounded-full bg-red-900/20 text-red-500 mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-semibold text-red-400 mb-2">Analysis Failed</h3>
        <p className="text-red-300/80 max-w-md bg-red-950/50 p-4 rounded-lg font-mono text-sm border border-red-900/50">
          {error}
        </p>
      </div>
    );
  }

  // 3. Empty State (Waiting for Input)
  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
        <Scale size={48} className="mb-4 opacity-50" />
        <h3 className="text-xl font-medium text-slate-300 mb-2">Strategy Dashboard</h3>
        <p className="max-w-xs">Waiting for case input and knowledge base documents to generate legal strategy.</p>
      </div>
    );
  }

  // 4. Data Destructuring with Defaults
  const {
    legal_ground = { section: 'N/A', quote: 'No quote available', term: 'Unknown Violation' },
    precedent = { case_name: 'N/A', summary: 'No summary available', strength_score: 0 },
    compensation = { total: 'N/A', breakdown: 'N/A', calculation: [] },
    risk_analysis = { counter_arguments: [], risk_level: 'Medium', mitigation_strategy: 'N/A' },
    draft_notice_text = ''
  } = result;

  // Defensive check for array
  const counterArgs = Array.isArray(risk_analysis.counter_arguments) && risk_analysis.counter_arguments.length > 0 
    ? risk_analysis.counter_arguments 
    : ["Standard defense anticipated based on contract terms."];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-6"
      >
        {/* Card A: The Law (Consumer Protection Act) */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-lg hover:border-emerald-500/30 transition-all group flex flex-col h-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Gavel size={22} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-lg text-white">The Law</h3>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-400">
              CPA 2019
            </span>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-emerald-400 font-bold uppercase tracking-wide mb-1">
              Violation Identified
            </p>
            <p className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
              {legal_ground.section}
            </p>
          </div>

          <div className="relative p-4 bg-slate-900/60 rounded-xl border border-slate-800 mt-auto">
            <Quote size={16} className="absolute top-3 left-3 text-slate-600" />
            <div className="max-h-40 overflow-y-auto custom-scrollbar">
                <p className="text-sm text-slate-200 italic pl-5 leading-relaxed">
                "{legal_ground.quote}"
                </p>
            </div>
          </div>
        </div>

        {/* Card B: The Precedent */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-lg hover:border-indigo-500/30 transition-all group flex flex-col h-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Scale size={22} className="text-indigo-400" />
              </div>
              <h3 className="font-semibold text-lg text-white">The Precedent</h3>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-400">
              Binding
            </span>
          </div>

          <div className="mb-4">
             <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-indigo-400 font-bold uppercase tracking-wide">
                  Winning Argument
                </p>
                <span className="text-xs font-bold text-emerald-400">
                  {precedent.strength_score}% Match
                </span>
             </div>
             
             {/* Progress Bar */}
             <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden mb-3">
               <div 
                 className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500"
                 style={{ width: `${precedent.strength_score}%` }}
               />
             </div>

             <p className="text-lg font-bold text-white leading-tight mb-2">
               {precedent.case_name}
             </p>
             
             <div className="max-h-48 overflow-y-auto custom-scrollbar bg-slate-900/30 p-2 rounded-lg border border-slate-800/50">
                <p className="text-sm text-slate-300 leading-relaxed">
                {precedent.summary}
                </p>
             </div>
          </div>
        </div>

        {/* Card C: Opposing Counsel (Risk) */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-orange-900/30 rounded-2xl p-6 shadow-lg hover:border-orange-500/30 transition-all group flex flex-col h-auto">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <ShieldAlert size={22} className="text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg text-white">Opposing Counsel</h3>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded border ${
                    risk_analysis.risk_level === 'High' ? 'bg-red-900/50 border-red-500 text-red-400' :
                    risk_analysis.risk_level === 'Medium' ? 'bg-orange-900/50 border-orange-500 text-orange-400' :
                    'bg-emerald-900/50 border-emerald-500 text-emerald-400'
                }`}>
                {risk_analysis.risk_level} Risk
                </span>
            </div>

            <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">Likely Counter-Arguments</p>
            
            {/* Scrollable Risks List */}
            <div className="bg-slate-900/40 rounded-lg p-3 mb-4 border border-slate-800 flex-1 overflow-y-auto custom-scrollbar max-h-48">
                <ul className="space-y-3">
                    {counterArgs.map((arg, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-200">
                            <span className="bg-orange-500/10 text-orange-500 rounded px-1.5 py-0.5 text-xs font-mono mt-0.5 flex-shrink-0">
                                {idx + 1}
                            </span>
                            <span className="leading-snug">{arg}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-3 bg-emerald-900/10 border border-emerald-900/30 rounded-lg mt-auto">
                <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={12} className="text-emerald-400"/>
                    <p className="text-xs text-emerald-400 font-bold">Mitigation Strategy</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{risk_analysis.mitigation_strategy}</p>
            </div>
        </div>

        {/* Card D: Action Plan (Wide) */}
        <div className="lg:col-span-2 xl:col-span-3 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row gap-6 items-start">
            
            {/* Compensation Receipt Logic */}
            <div className="w-full md:w-1/3 bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-inner flex flex-col">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                    <Calculator size={18} className="text-emerald-500"/>
                    <h4 className="font-semibold text-slate-200 text-sm tracking-wide">COMPENSATION BREAKDOWN</h4>
                </div>
                
                <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar max-h-[250px] pr-2">
                    {compensation.calculation && compensation.calculation.length > 0 ? (
                        compensation.calculation.map((item, index) => (
                            <div key={index} className="flex justify-between items-start group">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm text-slate-300 font-medium">{item.label}</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-tight group-hover:text-emerald-500/70 transition-colors">
                                        [{item.note}]
                                    </span>
                                </div>
                                <span className="text-sm font-mono text-emerald-400 whitespace-nowrap">{item.amount}</span>
                            </div>
                        ))
                    ) : (
                         <div className="text-sm text-slate-500 italic">Detailed calculation unavailable</div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-dashed border-slate-700 flex justify-between items-end">
                    <span className="text-xs text-slate-500 font-bold">ESTIMATED TOTAL</span>
                    <span className="text-xl font-bold text-white bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        {compensation.total}
                    </span>
                </div>
            </div>

            {/* Narrative Action Plan */}
            <div className="flex-1 w-full flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-amber-500/10 rounded-xl">
                        <ClipboardList size={22} className="text-amber-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-white">Action Plan</h3>
                        <p className="text-sm text-slate-400">Step-by-step strategy</p>
                    </div>
                </div>
                
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex-1 overflow-y-auto custom-scrollbar max-h-60">
                    <p className="text-sm text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                    {compensation.breakdown}
                    </p>
                </div>

                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 w-full py-4 px-6 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                >
                    Review & Export Legal Notice
                    <ArrowRight size={18} />
                </button>
            </div>

        </div>
      </motion.div>

      <LegalNoticeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        text={draft_notice_text} 
      />
    </>
  );
};
