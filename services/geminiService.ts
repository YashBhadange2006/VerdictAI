
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { LegalStrategyResponse, SupportedLanguage } from "../types";

// Helper to convert File to Base64
const fileToPart = async (file: File) => {
  return new Promise<{ inlineData: { mimeType: string; data: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          mimeType: file.type,
          data: base64Data,
        },
      });
    };
    reader.onerror = (error) => reject(new Error("Failed to read file: " + error));
    reader.readAsDataURL(file);
  });
};

const getAIClient = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    throw new Error("API Key not found or invalid.");
  }
  return new GoogleGenAI({ apiKey: apiKey.trim() });
};

export const analyzeLegalCase = async (
  complaint: string,
  files: File[]
): Promise<LegalStrategyResponse> => {
  console.log("Service: Initializing Gemini analysis...");
  const ai = getAIClient();

  try {
    console.log(`Service: Converting ${files.length} files to base64...`);
    // Convert all files to parts
    const fileParts = await Promise.all(files.map(file => fileToPart(file)));
    
    // Construct the prompt content
    const promptText = `
      User Complaint: "${complaint}"
      
      Instructions:
      1. Analyze the attached legal knowledge base documents (PDFs).
      2. Identify the specific sections of the law violated based on the user's complaint.
      3. Find the most relevant precedent/case law from the documents that supports the user's position.
      4. **Opposing Counsel Simulation:** Identify 2-3 specific, factual counter-arguments the other party will likely use (e.g., specific clauses, limitation periods, force majeure). Be specific, not generic.
      5. **Compensation Calculation:** Create a structured financial breakdown. 
         - Itemize the Principal Amount, Interest (calculated at a reasonable legal rate if applicable), Damages/Harassment, and Legal Costs.
         - For each item, provide a short "note" explaining the basis (e.g., "18% p.a. for 2 years delay").
      
      6. Generate a JSON response with the following structure:
      { 
        "legal_ground": {"section": "...", "quote": "...", "term": "..."}, 
        "precedent": {"case_name": "...", "summary": "...", "strength_score": 85}, 
        "risk_analysis": {
            "counter_arguments": ["Specific Argument 1", "Specific Argument 2"],
            "risk_level": "Low" | "Medium" | "High",
            "mitigation_strategy": "..."
        },
        "compensation": {
            "breakdown": "Narrative explanation of the compensation...", 
            "total": "₹XX,XX,XXX",
            "calculation": [
                { "label": "Principal Refund", "amount": "₹XX,XXX", "note": "Full booking amount paid" },
                { "label": "Interest", "amount": "₹XX,XXX", "note": "12% p.a. as per SC guidelines" },
                { "label": "Mental Harassment", "amount": "₹XX,XXX", "note": "Standard compensation for deficiency" }
            ]
        }, 
        "draft_notice_text": "Full legal notice text..." 
      }
      
      Do not cite cases not present in the provided PDFs.
    `;

    console.log("Service: Sending request to Gemini (gemini-3-pro-preview)...");
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          ...fileParts,
          { text: promptText }
        ]
      },
      config: {
        systemInstruction: "You are a top-tier legal strategist. Your goal is to build a winning consumer case while anticipating defense strategies.",
        responseMimeType: 'application/json',
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      }
    });

    console.log("Service: Response received from Gemini.");

    if (response.text) {
      const rawText = response.text;
      const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      console.log("Service: Parsing cleaned JSON...");
      let parsed: any;
      try {
        parsed = JSON.parse(cleanedText);
      } catch (e) {
        throw new Error("Failed to parse JSON response from AI.");
      }

      if (Array.isArray(parsed)) parsed = parsed[0];

      // Structural Validation & Defaults
      if (!parsed.legal_ground) throw new Error("AI Response invalid: Missing 'legal_ground'");
      
      // Fallback for new structure if AI hallucinates old structure
      if (!parsed.compensation.calculation) {
          parsed.compensation.calculation = [
              { label: "Estimated Total", amount: parsed.compensation.total, note: "Breakdown unavailable" }
          ];
      }

      console.log("Service: Validation passed.", parsed);
      return parsed as LegalStrategyResponse;
    } else {
      throw new Error("Gemini API returned an empty response.");
    }
  } catch (error: any) {
    console.error("Service: Gemini Analysis Failed Exception:", error);
    if (error.message && error.message.includes('401')) {
      throw new Error("UNAUTHENTICATED"); // Specific flag for UI
    }
    throw error;
  }
};

export const translateLegalNotice = async (
    text: string, 
    targetLang: SupportedLanguage
): Promise<string> => {
    if (targetLang === 'English') return text;

    const ai = getAIClient();
    const prompt = `
      Task: Translate the following legal notice into professional ${targetLang}.
      Requirements: 
      1. Use formal legal terminology appropriate for ${targetLang}.
      2. Maintain the exact formatting (paragraphs, line breaks, sender/receiver details).
      3. Do not add any explanatory notes or preambles. Just the translated text.

      Text to Translate:
      ${text}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: 'text/plain'
            }
        });
        return response.text || "Translation failed.";
    } catch (e) {
        console.error("Translation error", e);
        return "Translation unavailable at this time.";
    }
}
