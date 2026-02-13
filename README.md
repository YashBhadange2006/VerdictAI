# VerdictAI – Automated Legal Strategist

> Empowering everyday citizens against corporate malpractice — transforming raw grievances into professional, data-backed legal strategies instantly.

![Dashboard](image/Dashboard1.png)
![Dashboard](image/Dashboard2.png)
![DratNoticePage](image/DraftNotice.png)
![LocakStorageCases_WebPage](image/Local_Storage_Cases.png)
---

## The Problem

For millions of consumers facing defective products or unfair service denials, the cost of hiring a lawyer often **exceeds the value of their claim**. VerdictAI bridges this justice gap by acting as an on-demand legal reasoning engine — no lawyer required.

---

## How It Works

**1. Upload your documents** — `FileUpload.tsx`
PDFs go in: Consumer Protection Acts or upload any of your choice of document, Supreme Court judgments, your invoices, emails, photos — anything relevant to the case.

**2. Describe your complaint** — `CaseIntake.tsx`
Plain language. No legal jargon. Just what happened.

**3. Gemini reads everything** — `geminiService.ts`
The full text of your uploaded statutes and case law gets injected into Gemini's 1M token context window — no chunking, no retrieval. The model reasons directly over your documents, mapping your facts to specific statutory violations and binding precedents.

**4. Your legal strategy is ready** — `ResultsDashboard.tsx` + `LegalNoticeModal.tsx`
- Which laws were violated and under which sections
- Estimated compensation: principal + interest + damages
- What the company will argue — and how to counter it
- A formal legal notice drafted in your language, ready to send

**5. Cases saved locally** — `storage.ts` + `MyCases.tsx`
Reports and translations are cached in your browser. Come back anytime without re-uploading documents or burning API tokens.

---

## Key Features

### Legal Strategy Generator
Analyzes your complaint against ingested statutes and case law to identify specific violations, applicable sections, and recommended legal remedies.

### Opposing Counsel Simulator
Predicts the corporate defense strategy (e.g., *"User Negligence"*, *"Force Majeure"*) so you can prepare counter-arguments before filing.

### Compensation Calculator
Estimates realistic claim values — **Principal + Interest + Damages** — based on historical judicial trends from ingested case law.

### Multilingual Legal Notice Drafting
Drafts formal legal notices in regional Indian languages via `LegalNoticeModal.tsx`. Results are cached via `storage.ts` to avoid redundant API calls.

### Multi-File Injection
Upload multiple PDFs simultaneously — Consumer Protection Acts, Supreme Court judgments, and personal evidence — all cross-referenced in a single Gemini reasoning pass.

### Smart Local Caching
`storage.ts` persists generated reports and translations to the browser, giving returning users instant access to their cases via `MyCases.tsx` without repeat API calls.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite |
| LLM | Gemini Pro (1M token context window) |
| AI Integration | `geminiService.ts` (Google AI SDK) |
| Caching | Browser Local Storage via `storage.ts` |
| Styling | CSS (`index.css`) |

---

## Project Structure

```
verdictai/
│
├── components/
│   ├── CaseIntake.tsx          # Complaint input form
│   ├── FileUpload.tsx          # PDF upload (Acts, judgments, evidence)
│   ├── LegalNoticeModal.tsx    # Multilingual notice drafting
│   ├── MyCases.tsx             # Saved cases dashboard
│   ├── ResultsDashboard.tsx    # Legal strategy output
│   └── SkeletonLoader.tsx      # Loading states
│
├── services/
│   ├── geminiService.ts        # Gemini API calls & prompt construction
│   └── storage.ts              # Local Storage caching logic
│
├── App.tsx                     # Root component & routing
├── index.tsx                   # Entry point
├── index.html
├── index.css
├── types.ts                    # Shared TypeScript interfaces
├── metadata.json
├── .env                        # API keys (not committed)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YashBhadange2006/VerdictAI.git
cd VerdictAI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://aistudio.google.com).

---

## Running the Project

**Start the development server:**

```bash
npm run dev
```

Then visit `http://localhost:5173`.

**Build for production:**

```bash
npm run build
```

---

## Example Usage

1. **Upload documents** — Consumer Protection Act PDF, relevant judgments, and your personal evidence
2. **Describe your complaint** — e.g., *"I received a defective product and the company refused to refund me after 3 follow-ups"*
3. **Get your legal strategy** — violations, compensation estimate, predicted defenses, and a drafted legal notice
4. **Save your case** — access it anytime from *My Cases* without re-uploading

---

## Roadmap

- [ ] Case similarity detection across saved cases
- [ ] Legal precedent recommendation engine
- [ ] Fine-tuned model for law
- [ ] Mobile-responsive UI

---

## Author

**Yash Bhadange** — AI/ML Developer | Android Developer | OSINT Enthusiast

GitHub: [github.com/YashBhadange2006](https://github.com/YashBhadange2006)

---
