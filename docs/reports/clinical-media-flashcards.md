# Clinical Media — Flashcard Audit

**Date:** 2026-06-02  
**Phase:** 1 of 4 — Flashcard Embedding

---

## What Changed

Three files updated to wire clinical audio into flashcard sessions:

| File | Change |
|---|---|
| `src/lib/flashcards/session-runtime-types.ts` | Added `SessionCardClinicalMedia` union type + `clinicalMedia?` field to `SessionCardPayload` |
| `src/lib/flashcards/flashcard-clinical-media-registry.ts` | New file — maps card IDs → media blocks |
| `src/lib/flashcards/flashcard-session-hydration.server.ts` | Injects registry media into payload at hydration time |
| `src/components/flashcards/flashcard-study-question-stack.tsx` | Renders stem-placement audio after the question stem; rationale-placement audio in the reveal panel |

---

## Flashcard Decks Audited

### NCLEX-PN Gap Closure (`nclex-pn-gap-closure-flashcards.ts`)

| Topic | Cards | Relevant for audio |
|---|---|---|
| Ethics | 20 | No — administrative/legal content |
| DVT | 20 | Yes — PE scenario mentions respiratory sounds |
| Respiratory Failure | — | Not in file |
| Oxygen Therapy | — | Not in file |
| Diabetes | — | Not in file |
| Diuretics | 20 | Yes — volume overload / crackles |
| Cardiac Medications | 20 | Yes — digoxin, apical pulse, S3 in HF |
| Medication Administration | 20 | Partial — one wheezing allergy question |

### CNPLE Gap Closure (`cnple-gap-closure-flashcards.ts`)

| Topic | Cards | Relevant for audio |
|---|---|---|
| Professional Practice | 20 | Partial — COPD mentioned in goals of care |
| Health Promotion | 20 | No |
| Maternal Health | 20 | No |
| Chronic Disease | 20 | No |
| Geriatrics | 20 | Yes — COPD end-of-life context |

### Allied Pharmacy Technician (`allied-pharmacy-technician.ts`)

No auscultation-relevant cards.

---

## Cards Tagged with Audio (16 total)

### Cardiac Medications deck

| Card ID | Front | Audio Attached | Placement |
|---|---|---|---|
| `pn-cardiac-fc-01` | "What is the therapeutic serum digoxin level range?" | S1 — apical pulse landmark | rationale |
| `pn-cardiac-fc-15` | "Digoxin mechanism of action (two effects)" | S1 — apical pulse landmark | rationale |
| `pn-cardiac-fc-02` | "Classic triad of digoxin toxicity" | S1/S2 — note rate and regularity | rationale |
| `pn-cardiac-fc-04` | "Before administering digoxin, the PN must check:" | S1 — marks onset of systole | **stem** |
| `pn-cardiac-fc-08` | "Three proven beta-blockers for heart failure mortality…" | S3 gallop — heart failure context | rationale |
| `pn-cardiac-fc-18` | "A patient started on beta-blockers for HF says 'I feel more SOB'" | S3 gallop | rationale |
| `pn-cardiac-fc-11` | "Patient on diltiazem for AFib has apical pulse of 44 bpm…" | S1 — irregular AFib rhythm | **stem** |
| `pn-cardiac-fc-16` | "Patient on digoxin has K⁺ 2.8 mEq/L…" | S3 + S4 — HF / reduced compliance | rationale |
| `pn-cardiac-fc-20` | "Prioritise assessment: digoxin + furosemide + lisinopril" | S1 (stem) + S3 (rationale) | stem + rationale |

### Diuretics deck

| Card ID | Front | Audio Attached | Placement |
|---|---|---|---|
| `pn-diur-fc-03` | "Furosemide IV onset and nursing priority check…" | Fine crackles — volume overload | **stem** |
| `pn-diur-fc-07` | "Patient gains 4 lb overnight on furosemide…" | Fine crackles — early fluid overload | rationale |
| `pn-diur-fc-14` | "Why weigh yourself every morning on a diuretic?" | Fine crackles — pulmonary fluid | rationale |
| `pn-diur-fc-16` | "Patient on furosemide for HF: urine output 30 mL/2hr" | Coarse crackles — severe oedema | rationale |
| `pn-diur-fc-20` | "Spironolactone's unique benefit in HF beyond diuresis" | S3 + fine crackles | rationale |

### DVT deck

| Card ID | Front | Audio Attached | Placement |
|---|---|---|---|
| `pn-dvt-fc-03` | "DVT patient: sudden dyspnea, pleuritic chest pain, O₂ 89%" | Pleural friction rub + fine crackles | rationale |

### CNPLE deck

| Card ID | Front | Audio Attached | Placement |
|---|---|---|---|
| `cnple-ger-12` | "Goals of care with 82-year-old with advanced COPD" | Wheeze — advanced COPD context | rationale |

---

## Cards Audited but NOT tagged

| Card ID | Reason not tagged |
|---|---|
| `pn-medadmin-fc-13` | Anaphylaxis / wheezing — allergy context; audio is less relevant than drug-reaction teaching |
| All Ethics cards | Administrative — no auscultation context |
| `pn-diur-fc-01` through `pn-diur-fc-06` | Mechanism/pharmacology focus — audio less relevant |
| `pn-cardiac-fc-05` through `pn-cardiac-fc-07` | Beta-blocker overdose / abrupt cessation — no direct auscultation cue |

---

## Rendering Architecture

```
Session hydration (server):
  getFlashcardClinicalMedia(cardId)          ← registry lookup
  → injects clinicalMedia[] into SessionCardPayload

Client render (FlashcardStudyQuestionStack):
  placement="stem"    → after question stem, before answer choices
  placement="rationale" → in the reveal panel, before FlashcardStudyRevealPanels

Component used: ClinicalAudioBlock (compact mode)
  - WebAudio synthesis (no external file dependency)
  - showSignificance=true in rationale placement
  - compact=true in both placements
```

---

## Missing Cards (not in content files, need DB authoring)

The following clinical scenarios are in DB questions/lessons but have no corresponding flashcard card with auscultation content:

- S3 gallop identification standalone card
- Wheeze vs stridor distinction card  
- Crackle (fine vs coarse) identification card
- Pericardial friction rub identification card
- AFib irregular rhythm auscultation card

These should be authored in the DB as `CLINICAL` itemKind cards with `exhibitData: { clinicalAudio: { ... } }`.
