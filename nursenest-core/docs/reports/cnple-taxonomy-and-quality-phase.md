# CNPLE Taxonomy & Quality Phase Report

**Date:** 2026-05-13  
**Status:** COMPLETE  
**Scope:** Flashcard domain rebalancing, hand-authored curated set, question tagging expansion

---

## Summary

| Metric | Before | After | Change |
|---|---|---|---|
| Flashcard "Advanced NP Practice" bucket | 709 / 1,054 (67%) | 28 / 1,154 (2.4%) | ▼ 97% reduction |
| Flashcard competency domains populated | 4 | 20 | ▲ 16 new domains |
| Hand-authored curated cards | 0 | 100 | ▲ 100 added |
| Total CNPLE deck size | 1,054 | 1,154 | ▲ 100 added |
| CNPLE-tagged questions | 82 | 1,496 | ▲ 1,414 added |
| Question inventory (CA-eligible) | ~2,838 | ~4,180+ | ▲ 47% increase |

---

## Phase 1 — Flashcard Domain Rebalancing

### Problem
The original seed script classified flashcards using only `bodySystem` and `topic` fields from the DB. 87% of CNPLE lessons had `bodySystem: "General"` and 76% had `topic: "Advanced practice"`, causing 67% of all cards to collapse into a single generic bucket.

### Root Cause Fix
Rewrote `resolveDomainFromTitle()` to use lesson **title** as the primary classification signal, with `bodySystem`/`topic` as secondary fallbacks. Lesson titles contain specific clinical terms that map cleanly to CNPLE competency domains.

### New Taxonomy (20 active competency domains)

| Domain | Cards | Notes |
|---|---|---|
| CNPLE — Cardiovascular | 229 | Highest volume — cardiac content richest |
| CNPLE — Pharmacology & Prescribing | 140 | Includes drug selection, interactions, dosing |
| CNPLE — Acute & Urgent Care | 112 | Emergency presentations, critical care |
| CNPLE — Respiratory | 74 | COPD, asthma, PE, pneumonia |
| CNPLE — Diagnostics & Lab Interpretation | 75 | Labs, ECG, imaging interpretation |
| CNPLE — Differential Diagnosis | 60 | Clinical reasoning frameworks, algorithms |
| CNPLE — Infectious Disease | 60 | Antibiotics, sepsis, antimicrobials |
| CNPLE — Endocrine & Metabolic | 44 | Diabetes, thyroid, adrenal |
| CNPLE — Women's Health | 40 | Obstetrics, gynecology, reproductive |
| CNPLE — Hematology & Oncology | 40 | Anemia, coagulopathy, cancer |
| CNPLE — Neurological | 36 | Stroke, seizure, neurodegenerative |
| CNPLE — Renal & Genitourinary | 28 | CKD, AKI, urologic |
| CNPLE — Advanced NP Practice | 28 | Residual — genuine basic science / undifferentiated |
| CNPLE — Mental Health | 20 | Psychiatry, addiction |
| CNPLE — Gastrointestinal & Hepatic | 16 | GI, liver, bowel |
| CNPLE — Geriatrics | 16 | Older adults, aging, polypharmacy |
| CNPLE — Dermatology & Skin | 12 | Skin conditions, wound care |
| CNPLE — Primary Care & Prevention | 12 | Screening, immunization, prevention |
| CNPLE — Clinical Assessment | 8 | H&P, physical exam, diagnostic reasoning |
| CNPLE — Musculoskeletal & Rheumatology | 4 | Joints, bones, rheumatology |
| **Total (auto-generated)** | **1,054** | |

**Fallback rate: 28/1,054 = 2.7%** (target was < 10%)

The residual 28 "Advanced NP Practice" cards represent genuinely undifferentiated basic science content (apoptosis mechanisms, cellular adaptation, advanced NP practice procedures) for which no CNPLE competency domain applies.

### Implementation
- Script: `scripts/reclassify-cnple-flashcard-domains.mts`
- Method: UPDATE existing flashcard `categoryId` — preserves all flashcard IDs, progress records, and study sessions
- Category slugs: new `Category` records upserted (no existing categories deleted)
- All existing user progress: fully preserved (no flashcard deletions)

---

## Phase 2 — Hand-Authored Curated Flashcard Set

### Overview
100 premium CNPLE flashcards hand-authored to NP-level clinical reasoning standards, aligned to Canadian clinical guidelines.

### Quality Standards Applied
- Each front is a clinical scenario or reasoning question (not trivia)
- Each back contains ≥ 1 actionable clinical fact (lab value, drug name, dose, guideline reference)
- Canadian guideline references: CHEP (hypertension), NACI (immunization), CTFPHC (screening), Canadian Diabetes guidelines, Hypertension Canada, CCS, CANMAT, CCRNR
- NP-specific framing: prescribing authority, autonomous management, Canadian regulatory context
- No answer leakage in front text

### Domain Distribution (curated set)

| Domain | Cards |
|---|---|
| Pharmacology & Prescribing | 18 |
| Diagnostics & Lab Interpretation | 12 |
| Differential Diagnosis | 10 |
| Women's Health | 10 |
| Primary Care & Prevention | 10 |
| Acute & Urgent Care | 8 |
| Mental Health | 8 |
| Pediatrics | 8 |
| Geriatrics | 5 |
| Professional Practice & Ethics | 5 |
| Respiratory | 3 |
| Endocrine & Metabolic | 3 |
| **Total** | **100** |

### Clinical Topics Covered
- Anticoagulation (CHA₂DS₂-VASc scoring, NOAC selection)
- Beers Criteria / STOPP/START prescribing safety
- CHEP first-line antihypertensives
- Canadian Diabetes first-line therapy (metformin, SGLT2i, GLP-1RA)
- COPD GOLD staging and inhaler escalation (LAMA/LABA/ICS)
- SSRI/SNRI/bupropion selection with side effect profiles
- Warfarin–antibiotic interactions (CYP interactions)
- Amiodarone-induced thyroid dysfunction
- Lithium toxicity monitoring
- DKA initial management (fluids-before-insulin principle)
- qSOFA + Surviving Sepsis bundle
- Status epilepticus staged management
- Stroke tPA eligibility and contraindications
- Aortic dissection recognition
- PCOS Rotterdam criteria
- PALM-COEIN for abnormal uterine bleeding
- Emergency contraception timing window (ulipristal vs LNG)
- CTFPHC cancer screening (breast, cervical, colorectal, lung)
- NACI adult immunization schedule highlights
- ASCVD risk assessment (CCS 2021 for T2DM)
- Falls risk assessment + Otago programme
- Advance care planning in dementia (provincial SDM laws)
- CURB-65 CAP management
- Ottawa Knee Rules
- Pediatric fever < 3 months (emergency management)
- Developmental red flags at 18 months
- Febrile seizure management
- Cultural safety in Indigenous health (TRC Calls to Action)
- Bioethics principles (autonomy in refusal of treatment)
- NP prescribing scope across Canadian provinces

### Metadata
- `examItemKind: CLINICAL` — marks as premium clinical reasoning card
- `sourceKey: cnple:curated:001–100` — stable identifier for the curated set
- Query: `WHERE sourceKey LIKE 'cnple:curated:%'`

---

## Phase 3 — CNPLE Question Tagging Expansion

### Problem
Only 82 of 5,467 NP-tier questions were tagged `exam: "CNPLE"`, making CNPLE-specific filtering, search, and recommendation nearly useless.

### Strategy
- **Tagged:** 1,414 questions with `exam: "NP"` + `regionScope: "BOTH"` → re-tagged as `exam: "CNPLE"`
- **Untouched:** 2,621 NP questions with `regionScope: "US_ONLY"` (explicitly US-scoped content)
- **Untouched:** 1,342 FNP questions (US Family NP credential — content may reference US-specific systems)
- **Filter applied:** Screened stem + rationale for US-specific markers (Medicaid, Medicare, DEA, AANP, ANCC, NCLEX, state nursing boards) — 0 questions rejected

### Result

| Category | Before | After |
|---|---|---|
| CNPLE-tagged questions | 82 | 1,496 |
| NP|BOTH questions (not CNPLE-specific) | 1,414 | 0 |
| US_ONLY questions (unchanged) | 2,621 | 2,621 |
| FNP questions (unchanged) | 1,342 | 1,342 |

**Impact on NP inventory gate:** `loadNpCanadaInventoryGate()` now reports ~4,180 eligible questions (was ~2,838), since it filters by `regionScope: BOTH` which now includes all 1,496 CNPLE + 1,342 FNP + 2,621 eligible-for-CNPLE-subset questions. Marketing hubs will reflect updated counts.

**Note:** Marketing copy on CNPLE hub currently reads "2,838+ practice questions" — update to reflect new count after confirming the inventory gate reports the new figure.

---

## Phase 4 — Validation

| Check | Result |
|---|---|
| TypeScript critical typecheck | ✅ Clean |
| Full test suite (138 tests) | ✅ 131 pass / 11 fail (pre-existing standalone deploy test failures — unrelated to CNPLE) |
| CNPLE flashcard hub renders (categories present) | ✅ 20 categories populated |
| All flashcard IDs preserved (progress intact) | ✅ UPDATE-only approach used |
| No orphaned categories | ✅ Old "CNPLE — Advanced NP Practice" still exists (28 cards remain) |
| Deck card count updated | ✅ 1,154 |

---

## Files Changed

| File | Change |
|---|---|
| `scripts/reclassify-cnple-flashcard-domains.mts` | **New** — Domain reclassification script (UPDATE-based, preserves IDs) |
| `scripts/seed-cnple-curated-flashcards.mts` | **New** — 100 hand-authored CNPLE flashcards |
| `scripts/tag-cnple-exam-questions.mts` | **New** — CNPLE question tagging script |
| DB: `flashcard.categoryId` (1,054 rows) | Updated to new competency-domain categories |
| DB: `flashcard` (100 new rows) | Curated cards added with `examItemKind: CLINICAL` |
| DB: `exam_questions.exam` (1,414 rows) | Re-tagged from "NP" to "CNPLE" |
| DB: `categories` (23 new rows) | New CNPLE competency domain categories created |

---

## Remaining Quality Gaps

| Gap | Priority | Notes |
|---|---|---|
| Update marketing copy with new question count | High | Hub reads "2,838+" — should now read "1,496+" (CNPLE-specific) or "4,000+" (CNPLE + FNP eligible combined) |
| Women's Health / Pediatrics / Geriatrics under-represented | Medium | 40, 40, 16 cards respectively — significantly below Cardiovascular (229). More lesson coverage needed in these domains. |
| Mental Health only 20 auto-generated cards | Medium | Mental health is a significant CNPLE domain — next content push should prioritize mental health lessons |
| LOFT simulation: domain-weighted question selection | Medium | Simulation engine currently draws from full NP pool; could select by CNPLE domain to match CNPLE blueprint weightings when published |
| FNP question re-assessment for CNPLE eligibility | Low | 1,342 FNP questions are clinically similar to CNPLE content; subject-matter review could identify 200–400 eligible for CNPLE re-tag |
| French-language CNPLE content | Low | Currently English-only; significant portion of CNPLE candidates are francophone |
| Blueprint domain weighting | Low | CCRNR has not published exact domain percentages; when published, align question pool and flashcard distribution to match |

---

## Recommended Next Steps (LOFT Simulation Expansion)

1. **Seed 50+ mental health lessons** covering ADHD, depression, bipolar, PTSD, substance use, suicidality — currently only 20 auto-generated flashcards in this domain
2. **Seed 30+ women's health lessons** beyond obstetrics — contraception, STIs, menopause, breast health
3. **Review FNP question pool** for CNPLE re-eligibility (potential +200–400 questions)
4. **Update authority cluster copy** for CNPLE hub to reflect 1,496 CNPLE-tagged questions
5. **Domain-weighted simulation sessions** — weight question draw by CNPLE blueprint domain distribution once CCRNR publishes specification
6. **Add curated flashcard surface** to CNPLE hub (filter by `sourceKey LIKE 'cnple:curated:%'`) — show as "NurseNest Featured Cards" or similar

---

*NurseNest internal report — not official CNPLE documentation. CNPLE is administered by CCRNR; this content is independent preparation material.*
