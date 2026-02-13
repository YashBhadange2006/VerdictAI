
import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Loader2, Check, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SupportedLanguage } from '../types';
import { translateLegalNotice } from '../services/geminiService';
import { jsPDF } from "jspdf";

interface LegalNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
}

export const LegalNoticeModal: React.FC<LegalNoticeModalProps> = ({ isOpen, onClose, text }) => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('English');
  const [displayText, setDisplayText] = useState(text);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Translation Memory (Simple Cache)
  const getCachedTranslation = (lang: string) => {
    try {
        const cache = localStorage.getItem(`trans_${lang}_${text.length}`);
        return cache;
    } catch(e) { return null; }
  };

  const saveCachedTranslation = (lang: string, trans: string) => {
    try {
        localStorage.setItem(`trans_${lang}_${text.length}`, trans);
    } catch(e) {}
  };

  useEffect(() => {
    if (isOpen) {
        setDisplayText(text);
        setCurrentLang('English');
    }
  }, [isOpen, text]);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as SupportedLanguage;
    setCurrentLang(lang);
    
    if (lang === 'English') {
        setDisplayText(text);
        return;
    }

    const cached = getCachedTranslation(lang);
    if (cached) {
        setDisplayText(cached);
        return;
    }

    setIsTranslating(true);
    const translated = await translateLegalNotice(text, lang);
    setDisplayText(translated);
    saveCachedTranslation(lang, translated);
    setIsTranslating(false);
  };

  const handleCopy = async () => {
    try {
        await navigator.clipboard.writeText(displayText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
        console.error("Failed to copy", err);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    
    // Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("LEGAL NOTICE", 105, 20, { align: "center" });

    // Subtitle
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100);
    doc.text(`Generated via ConsumerShield AI (${currentLang})`, 105, 27, { align: "center" });

    // Content
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    const pageWidth = 190;
    const lines = doc.splitTextToSize(displayText, pageWidth);
    
    let cursorY = 40;
    const lineHeight = 6;
    
    lines.forEach((line: string) => {
        if (cursorY > 275) {
            doc.addPage();
            cursorY = 20;
        }
        doc.text(line, 10, cursorY);
        cursorY += lineHeight;
    });

    doc.save(`Legal_Notice_${currentLang}.pdf`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-slate-950 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col h-[90vh] max-h-[90vh]"
        >
          {/* Header - Fixed Height */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 gap-4 flex-shrink-0 z-20">
            <div>
              <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                Draft Legal Notice
                {isTranslating && <Loader2 size={16} className="animate-spin text-emerald-500" />}
              </h3>
              <p className="text-sm text-slate-400">Review, translate, and export your legal document.</p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Globe size={14} />
                    </div>
                    <select
                        value={currentLang}
                        onChange={handleLanguageChange}
                        disabled={isTranslating}
                        className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-9 pr-8 py-2 appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
                    >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Telugu">Telugu</option>
                        <option value="Kannada">Kannada</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Punjabi">Punjabi</option>
                        <option value="Odia">Odia</option>
                        <option value="Urdu">Urdu</option>
                        <option value="Assamese">Assamese</option>
                        <option value="Maithili">Maithili</option>
                    </select>
                </div>

                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
            </div>
          </div>

          {/* Content Area - SCROLLABLE (flex-1 min-h-0 is crucial here) */}
          <div className="relative flex-1 min-h-0 bg-slate-950 overflow-hidden">
             {isTranslating && (
                 <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center flex-col gap-3">
                     <Loader2 className="animate-spin text-emerald-500" size={40} />
                     <span className="text-emerald-400 text-sm font-medium animate-pulse">Translating to {currentLang}...</span>
                 </div>
             )}
            <div className="h-full overflow-y-auto custom-scrollbar p-6 md:p-8">
                <div className="bg-slate-900/30 p-6 md:p-8 rounded-xl border border-slate-800/50 shadow-inner min-h-full">
                    <pre className="font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap font-sans selection:bg-emerald-500/30 selection:text-emerald-100">
                        {displayText}
                    </pre>
                </div>
            </div>
          </div>

          {/* Footer - Fixed Height */}
          <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row justify-end gap-3 flex-shrink-0 z-20">
            <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-medium transition-colors justify-center"
            >
              {isCopied ? <Check size={18} className="text-emerald-400"/> : <Copy size={18} />}
              {isCopied ? "Copied!" : "Copy Text"}
            </button>
            
            <button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-lg shadow-emerald-900/20 justify-center"
            >
              <Download size={18} />
              Download PDF ({currentLang})
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
