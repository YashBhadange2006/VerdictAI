import React, { useEffect, useState } from 'react';
import { Trash2, ExternalLink, Calendar, Scale, IndianRupee } from 'lucide-react';
import { SavedCase } from '../types';
import { getCasesFromStorage, deleteCaseFromStorage } from '../services/storage';

interface MyCasesProps {
  onLoadCase: (savedCase: SavedCase) => void;
}

export const MyCases: React.FC<MyCasesProps> = ({ onLoadCase }) => {
  const [cases, setCases] = useState<SavedCase[]>([]);

  useEffect(() => {
    setCases(getCasesFromStorage());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this case record?")) {
      const updated = deleteCaseFromStorage(id);
      setCases(updated);
    }
  };

  if (cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="bg-slate-800/50 p-6 rounded-full mb-4">
          <Scale size={48} className="text-slate-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No Cases Saved Yet</h3>
        <p className="text-slate-500 max-w-md">
          Generated legal strategies will appear here automatically. 
          Go to the Dashboard to analyze your first grievance.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((c) => (
          <div 
            key={c.id}
            onClick={() => onLoadCase(c)}
            className="group bg-slate-900/40 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/20 hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/50 px-2 py-1 rounded-md border border-slate-800">
                <Calendar size={12} />
                {new Date(c.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <button 
                onClick={(e) => handleDelete(c.id, e)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                title="Delete Case"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Content Preview */}
            <div className="mb-4 relative z-10">
              <h4 className="font-semibold text-slate-200 line-clamp-1 mb-1 group-hover:text-emerald-400 transition-colors">
                {c.result.precedent.case_name || "Untitled Case"}
              </h4>
              <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                "{c.complaint}"
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Win Prob.</span>
                <span className="text-emerald-400 font-bold">{c.result.precedent.strength_score}%</span>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                 <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Value</span>
                 <div className="flex items-center gap-1 text-slate-200 font-bold">
                    <IndianRupee size={14} />
                    <span className="text-sm truncate">{c.result.compensation.total}</span>
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10">
              <span className="text-xs text-slate-500">
                Section {c.result.legal_ground.section.split(':')[0]}
              </span>
              <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                View Report <ExternalLink size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};