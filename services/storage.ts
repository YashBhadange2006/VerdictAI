import { SavedCase, LegalStrategyResponse } from "../types";

const STORAGE_KEY = 'consumer_shield_cases';

export const saveCaseToStorage = (complaint: string, result: LegalStrategyResponse): SavedCase => {
  const newCase: SavedCase = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    complaint,
    result
  };

  const existing = getCasesFromStorage();
  const updated = [newCase, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newCase;
};

export const getCasesFromStorage = (): SavedCase[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse cases from storage", e);
    return [];
  }
};

export const deleteCaseFromStorage = (id: string): SavedCase[] => {
  const existing = getCasesFromStorage();
  const updated = existing.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};