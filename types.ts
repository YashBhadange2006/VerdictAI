
export interface LegalStrategyResponse {
  legal_ground: {
    section: string;
    quote: string;
    term?: string; // Optional helper for display
  };
  precedent: {
    case_name: string;
    summary: string;
    strength_score: number;
  };
  risk_analysis: {
    counter_arguments: string[];
    risk_level: 'Low' | 'Medium' | 'High';
    mitigation_strategy: string;
  };
  compensation: {
    breakdown: string;
    total: string;
    calculation: {
        label: string;
        amount: string;
        note: string;
    }[];
  };
  draft_notice_text: string;
}

export interface FileState {
  actFile: File | null;
  judgmentsFile: File | null;
}

export enum AppStatus {
  IDLE = 'idle',
  ANALYZING = 'analyzing',
  COMPLETE = 'complete',
  ERROR = 'error'
}

export interface SavedCase {
  id: string;
  timestamp: number;
  complaint: string;
  result: LegalStrategyResponse;
}

export type Tab = 'dashboard' | 'cases';

export type SupportedLanguage = 
  | 'English' 
  | 'Hindi' 
  | 'Marathi' 
  | 'Tamil' 
  | 'Telugu' 
  | 'Kannada' 
  | 'Malayalam' 
  | 'Bengali' 
  | 'Gujarati' 
  | 'Punjabi'
  | 'Odia'
  | 'Urdu'
  | 'Assamese'
  | 'Maithili';
