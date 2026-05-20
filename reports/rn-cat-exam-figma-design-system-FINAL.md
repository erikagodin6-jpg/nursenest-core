# RN CAT Exam — Premium Figma Design System (FINAL)

**Date:** 2026-05-20  
**Figma file:** [RN CAT Exam — Premium Design System 2026](https://www.figma.com/design/n2W9X5ZSC2XtrHtDXKqUeq)  
**File key:** `n2W9X5ZSC2XtrHtDXKqUeq`

## Delivered

| Area | Count |
|------|--------|
| Figma pages | 20 (cover + system + 15 types + dark + mobile) |
| Question-type concepts | **75** (15 types × 5 directions each) |
| Exam shell flows | 5 (in-progress, review, pause, results ×2) |
| Dark mode (Midnight) | 3 (MCQ, SATA, Matrix) |
| Mobile gallery | 6 (390×844) |
| Design system | Components/states overview on `01 — Design System` |

## Page map

- `00 — Cover & Index` — program overview
- `01 — Design System` — answer states, chrome, typography, accents
- `02 — Exam Shell & Flows` — navigation, review, pause, results
- `03–17` — one page per question type, five labeled concepts (A1–O5)
- `18 — Dark Mode` — midnight variants
- `19 — Mobile Gallery` — responsive shells

## Type → accent color

| Type | Accent |
|------|--------|
| MCQ | Blue `#2563EB` |
| SATA | Teal `#0D9488` |
| Matrix | Indigo `#4F46E5` |
| Cloze | Cyan `#0891B2` |
| Bowtie / Case | Emerald `#059669` |
| Drag-drop / Pharm | Purple `#7C3AED` |
| Highlight | Rose `#DB2777` |
| Ordered | Orange `#EA580C` |
| Prioritization | Amber `#D97706` |
| Delegation | Red `#DC2626` |
| Labs | Sky `#0284C7` |
| Exhibit | Teal-dark `#0F766E` |
| Hotspot | Pink `#BE185D` |

## Matrix & SATA highlights

- **SATA (B1–B5):** card toggles, segmented chips, soft highlight, spacious stack, confidence strip
- **Matrix (C1–C5):** sticky table, card-row hybrid, accordion rows, column cards, mobile stack

## Recommended implementation shortlist

1. **MCQ:** A1 Breathable Rail or A3 2-Col Cards  
2. **SATA:** B1 Card Toggle or B4 Spacious  
3. **Matrix:** C2 Card Hybrid or C5 Mobile Stack  
4. **Case study:** I1 Tab Exhibits  
5. **Shell:** Review grid + remediation results  

## Code alignment

- `nclex-cat-runner.tsx`, `nclex-exam-layout.tsx`, `cat-question-card.tsx`
- Renderer matrix: `cat-runner-renderer-coverage.ts` (matrix/cloze/hotspot still fallback in code)

## Next steps

1. Open Figma — review and pick one winner per type  
2. Refine spacing/sizing in Figma (concept frames are direction wireframes)  
3. Playwright visual QA (Ocean + Midnight) per `docs/governance/figma-premium-ui-mandatory-process.md`  
4. Implement chosen directions in app with semantic tokens only  

**Note:** Figma-only delivery; no application code changed in this pass.
