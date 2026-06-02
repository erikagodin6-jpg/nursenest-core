# Premium clinical ecosystem — content & integration inventory

**Audit date:** 2026-05-09  
**Method:** Static codebase audit + `tsx` imports of `labs-engine` / `med-calculations-engine` inventory helpers. **PostgreSQL counts not executed** (no `DATABASE_URL` in audit environment). Re-run with DB for production-grade numbers.

**Product rule:** Premium integrated subscription learning — one ecosystem — see `docs/planning/subscription-clinical-readiness-ecosystem.md`.

---

## Executive summary

| Product | Lessons/cases (engine/static) | Practice items (sample RN) | Flashcards | Notes vs 50-item guideline |
|---------|-------------------------------|----------------------------|------------|------------------------------|
| **Lab Values** | 7 lessons, 7 categories | 42 questions | 42 | **Below 50** practice items |
| **Med dosage** | 10 lessons, 10 categories | **50** questions | **50** | Meets 50 for Q/FC; 10 lesson units |
| **OSCE** | DB / legacy | — | — | Count **runtime-dependent** |
| **Marketing case studies** | **2** JSON vignettes | 2 MCQ | 0 | Not branching; far below 50 |
| **Adaptive branching** | **0** shipped | — | — | See adaptive-case-study doc |
| **ECG questions** | — | **DB `EcgVideoQuestion`** | — | Count **N/A** without DB |

---

## A. ECG

- **Route configs:** 7 (`ECG_ROUTE_CONFIGS`) — basic + advanced surfaces.
- **Learner:** `/app/ecg-video-quiz`; module `/modules/ecg/*`.
- **Tier:** RN/NP (`canAccessEcgModuleForTier`); **RPN blocked** (`assertNoEcgForRpn`).
- **Advanced product:** Future separate SKU — `ECG_MASTERY_ENTITLEMENT`, `docs/ecg-module-integration.md`.
- **Question count:** Prisma — **audit with DB**.

---

## B. Lab Values (`/app/labs`)

`countLabsInventoryForTrack('rn')`:

- lessonCount: **7**, questionCount: **42**, flashcardCount: **42**, categoryCount: **7**
- Tracks: rn, pn, np, allied (same engine filtering)
- Study loops: `buildLabsStudyLinks`; lab drills `/app/lab-drills`
- Report card: **no** Labs inset today

---

## C. Medication dosage (`/app/med-calculations`)

`countMedCalcInventoryForTrack('rn'|'pn'|'np')`:

- lessonCount: **10**, questionCount: **50**, flashcardCount: **50**, categoryCount: **10**
- Allied: **not** in `MedCalcTrack` enum
- Report card: `MedCalcReportCardInset` (localStorage)

---

## D. OSCE (`/app/osce`)

- Stations: `getOsceHubListItemsResolved` — published DB or legacy fallback
- Dev samples: 2 (non-production)
- Branching/scoring: partial UX; no full graph engine
- Report card: **no** OSCE inset

---

## E. Adaptive case studies

- **0** branching cases shipped in app
- Marketing JSON: **2** static items

---

## F. CAT / practice / lessons

- Run `npx tsx scripts/audit-exam-question-bank.ts` with `DATABASE_URL` for pathway pools.

---

## 50+ readiness matrix (honest)

| Vertical | Meets 50 meaningful items? |
|----------|---------------------------|
| Lab Values | **No** (42 Q; 7 lessons) |
| Med calc drills | **Yes** for Q/FC count (50) |
| OSCE | **Unknown / likely no** until DB authored |
| Case studies | **No** |
| ECG bank | **Unknown** (needs DB) |

---

## Canonical routes

| Surface | Path |
|---------|------|
| Labs | `/app/labs`, `/app/labs/[category]/[slug]` |
| Med calc | `/app/med-calculations`, `/app/med-calculations/[category]/[slug]` |
| OSCE | `/app/osce`, `/app/osce/[stationId]` |
| ECG quiz | `/app/ecg-video-quiz` |
| Report card | `/app/account/progress` |

---

*Audit only — no routes modified.*
