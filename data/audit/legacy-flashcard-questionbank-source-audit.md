# Legacy flashcard & question-bank source audit

Generated: 2026-04-15T02:30:49.765Z

## Totals (legacy TypeScript sources)

| Metric | Value |
|--------|------:|
| Legacy flashcard TS files | 27 |
| Files with ≥1 parsed card | 27 |
| **Total flashcard cards (AST count)** | **4380** |

## Database (current environment)

Could not query DB: DATABASE_URL not set



## Per-file

| File | Cards | Tier (guess) |
|------|------:|--------------|
| flashcards-community.ts | 55 | RN |
| flashcards-icu-critical-care.ts | 70 | RN |
| flashcards-labor-delivery.ts | 60 | RN |
| flashcards-np-enrichment-1.ts | 70 | NP |
| flashcards-np-enrichment-2.ts | 49 | NP |
| flashcards-np-enrichment-3.ts | 35 | NP |
| flashcards-np-enrichment-4.ts | 35 | NP |
| flashcards-np-enrichment-5.ts | 35 | NP |
| flashcards-np-enrichment-6.ts | 28 | NP |
| flashcards-np-patho.ts | 215 | NP |
| flashcards-np-subspecialties.ts | 46 | NP |
| flashcards-np.ts | 526 | NP |
| flashcards-postpartum.ts | 55 | RN |
| flashcards-public-health.ts | 55 | RN |
| flashcards-rn-arrhythmias-chd-anticoag.ts | 350 | RN |
| flashcards-rn-expansion-2.ts | 12 | RN |
| flashcards-rn-expansion.ts | 32 | RN |
| flashcards-rn-gi-cancer-peds-integ.ts | 400 | RN |
| flashcards-rn-infectious-disease.ts | 75 | RN |
| flashcards-rn-patho-cardio-neuro.ts | 275 | RN |
| flashcards-rn-patho-expansion.ts | 300 | RN |
| flashcards-rn-resp-renal-batch2.ts | 120 | RN |
| flashcards-rn-resp-renal.ts | 105 | RN |
| flashcards-rn-shock-critical.ts | 268 | RN |
| flashcards-rn.ts | 442 | RN |
| flashcards-rpn-expansion.ts | 16 | PN/RPN/LVN_LPN |
| flashcards-rpn.ts | 651 | PN/RPN/LVN_LPN |

Question bank items in legacy repo also live in hundreds of `career-questions/*` and `advanced-questions/*` TS modules — use `data/audit/legacy-questions-inventory.json` for file-level inventory; full AST count is run in a separate job due to volume.
