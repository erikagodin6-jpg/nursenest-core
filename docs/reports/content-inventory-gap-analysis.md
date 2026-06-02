# Content Inventory Gap Analysis

**Date:** 2026-06-01  
**Standard:** NurseNest Long-Term Content Inventory Targets v1.0  
**Data sources:** `certification-readiness-dashboard.json` (2026-06-01), `question-inventory-us-rn-nclex-rn.json` (2026-05-31), `lesson-completeness-pathway-rollup.json` (2026-04-15)  
**Scope:** All 19 exam pathways defined in the target document

> **Note on question counts:** The certification readiness dashboard measures only *repository-evidenced* static content. The DB question inventory (`question-inventory-us-rn-nclex-rn.json`) — generated from a live database query — is the authoritative source for NCLEX-RN and is used where available. For all other pathways, dashboard numbers are the best available evidence.

---

## Executive Summary

| Status | Pathways |
|---|---|
| **Launch-ready** (meets all minimums) | 0 of 19 |
| **Questions ≥ launch minimum** | 1 of 19 (NCLEX-RN: 12,838 / 10,000 ✓ — but format distribution and flashcards fail) |
| **Questions 0** | 10 of 19 |
| **Flashcards 0** | **All 19** |
| **Practice exams 0** | **All 19** |
| **CAT pools 0** | **All 19** |

No pathway is launch-ready. The two most urgent systemic gaps are:
1. **Zero flashcards across every pathway** — the flashcard build has not started.
2. **Zero practice exam sets across every pathway** — the 100-exam-per-pathway requirement is unmet everywhere.

---

## Registered Nurse Pathways

### NCLEX-RN (US)

| Metric | Current | Launch Min | Mature | Gap to Launch | Gap to Mature |
|---|---:|---:|---:|---:|---:|
| Total questions | **12,838** | 10,000 | 20,000 | **+2,838 ✓** | −7,162 |
| — Traditional MCQ | ~12,838* | 3,500 (35%) | 7,000 (35%) | ✓ | ✓ |
| — SATA (15%) | **0** | 1,500 | 3,000 | −1,500 | −3,000 |
| — Bowtie (10%) | **~392†** | 1,000 | 2,000 | −608 | −1,608 |
| — Matrix (10%) | **0** | 1,000 | 2,000 | −1,000 | −2,000 |
| — Case Studies (10%) | **6** | 1,000 | 2,000 | −994 | −1,994 |
| — Trend Recognition (5%) | **0** | 500 | 1,000 | −500 | −1,000 |
| — Prioritization (5%) | **0** | 500 | 1,000 | −500 | −1,000 |
| — Delegation (3%) | **0** | 300 | 600 | −300 | −600 |
| — Documentation (2%) | **0** | 200 | 400 | −200 | −400 |
| CAT-eligible questions | **11,660** | 3,000 | 5,000 | **+8,660 ✓** | **+6,660 ✓** |
| Difficulty L1 (easy) | 30 (0.2%) | ~15% balanced | ~15% | −1,470 | −2,970 |
| Difficulty L2 | 1,393 (10.8%) | ~25% | ~25% | −1,712 | −3,607 |
| Difficulty L3 (moderate) | 7,464 (58.1%) | ~35% | ~35% | overstocked | overstocked |
| Difficulty L4 | 2,723 (21.2%) | ~20% | ~20% | near target | near target |
| Difficulty L5 (hard) | 50 (0.4%) | ~5% | ~5% | −450 | −950 |
| **Flashcards** | **0** | 15,000 | 25,000 | **−15,000** | **−25,000** |
| **Practice exams (sets)** | **0** | 100 | 100 | **−100** | **−100** |
| NGN case studies | 6 | 100 | 100 | −94 | −94 |
| Bowties | ~392† | 150 | 150 | ✓† | ✓† |
| Matrix cases | 0 | 150 | 150 | −150 | −150 |
| Trend interpretation | 0 | 150 | 150 | −150 | −150 |
| Prioritization cases | 0 | 150 | 150 | −150 | −150 |
| Delegation cases | 0 | 100 | 100 | −100 | −100 |
| Documentation cases | 0 | 100 | 100 | −100 | −100 |
| Multi-shift simulations | 9 | 50 | 50 | −41 | −41 |
| Virtual clinical sims | 0 | 50 | 50 | −50 | −50 |
| Production-ready lessons | 30 | — | — | — | — |
| **Overall readiness** | **41.7%** | — | — | — | — |

> *Format field `questionFormat` is NULL in all 12,838 DB rows — actual SATA/MCQ split is unverified; pending a format-tagging audit.  
> †392 questions have "invalid bowtie payload" in CAT validation — they exist but are broken and excluded from CAT pool.

**Blockers to launch:** SATA 0%, Matrix 0%, Case Studies <1%; zero flashcards; zero practice exam sets; L3-heavy difficulty distribution (58% vs ~35% target); 392 bowtie questions invalid.

---

### Canadian NCLEX-RN

| Metric | Current | Launch Min | Mature | Gap to Launch |
|---|---:|---:|---:|---:|
| Total questions (Canadian-specific) | **62*** | 10,000 | 20,000 | **−9,938** |
| SATA | 0 | 1,500 | 3,000 | −1,500 |
| Bowtie | 0 | 1,000 | 2,000 | −1,000 |
| Matrix | 0 | 1,000 | 2,000 | −1,000 |
| **Flashcards** | **0** | 15,000 | 25,000 | **−15,000** |
| **Practice exams** | **0** | 100 | 100 | **−100** |
| CAT-eligible | 0 | 3,000 | 5,000 | −3,000 |
| Production-ready lessons | 29 | — | — | — |
| Overall readiness | 41.7% | — | — | — |

> *The US RN question pool (12,838) overlaps significantly with Canadian RN content; exact Canadian-region-gated count from the static audit is 62. A DB query scoped to `regionScope = BOTH OR CA_ONLY` would show the true pool size.

---

### New Graduate RN

| Metric | Current | Launch Min | Mature | Gap to Launch |
|---|---:|---:|---:|---:|
| Total questions | **0** | 2,500 | 5,000 | **−2,500** |
| Flashcards | 0 | 5,000† | 5,000 | −5,000 |
| Practice exams | 0 | 100 | 100 | −100 |
| Lessons (total) | 40 | — | — | — |
| Lessons (production-ready) | 0 | — | — | — |
| Lesson quality score | 27.7% | — | — | — |

> †Flashcard target inferred from RN minimum range (15,000–25,000); New Grad RN is a focused sub-pathway so 5,000 minimum is reasonable.

---

## Practical Nurse Pathways

### REx-PN (Canada)

| Metric | Current | Launch Min | Mature | Gap to Launch | Gap to Mature |
|---|---:|---:|---:|---:|---:|
| Total questions | **75** | 5,000 | 10,000 | **−4,925** | −9,925 |
| — SATA | 12 | 750 (15%) | 1,500 | −738 | −1,488 |
| — Bowtie | 12 | 500 (10%) | 1,000 | −488 | −988 |
| — Matrix | 12 | 500 (10%) | 1,000 | −488 | −988 |
| — Traditional MCQ | ~39 | 1,750 (35%) | 3,500 | −1,711 | −3,461 |
| **Flashcards** | **0** | 8,000 | 15,000 | **−8,000** | **−15,000** |
| **Practice exams** | **0** | 100 | 100 | **−100** | **−100** |
| CAT-eligible | 0 | 3,000 | 5,000 | −3,000 | −5,000 |
| Simulations | 2 | 50 | 50 | −48 | −48 |
| Lessons (total) | 410 | — | — | — | — |
| Overall readiness | 57.2% | — | — | — | — |

**Note:** REx-PN has the best format diversity of any pathway (SATA/Matrix/Bowtie present) but total volume is critically low at 1.5% of launch minimum.

---

### NCLEX-PN (US)

| Metric | Current | Launch Min | Mature | Gap to Launch |
|---|---:|---:|---:|---:|
| Total questions | **26** | 5,000 | 10,000 | **−4,974** |
| SATA | 0 | 750 | 1,500 | −750 |
| Bowtie | 0 | 500 | 1,000 | −500 |
| Matrix | 0 | 500 | 1,000 | −500 |
| **Flashcards** | **0** | 8,000 | 15,000 | **−8,000** |
| **Practice exams** | **0** | 100 | 100 | **−100** |
| CAT-eligible | 0 | 3,000 | 5,000 | −3,000 |
| Lessons (total) | 86 | — | — | — |
| Overall readiness | 32.6% | — | — | — |

---

## Nurse Practitioner Pathways

### FNP (Family Nurse Practitioner)

| Metric | Current | Launch Min | Mature | Gap to Launch |
|---|---:|---:|---:|---:|
| Total questions | **0** | 2,500 | 6,000 | **−2,500** |
| SATA | 0 | 375 | 900 | −375 |
| Bowtie | 0 | 250 | 600 | −250 |
| Matrix | 0 | 250 | 600 | −250 |
| **Flashcards** | **0** | 8,000 | 12,000 | **−8,000** |
| **Practice exams** | **0** | 100 | 100 | **−100** |
| CAT-eligible | 0 | 3,000 | 5,000 | −3,000 |
| Lessons (total / production-ready) | 496 / 104 | — | — | — |
| Content quality score | 55% | — | — | — |
| Overall readiness | 19.6% | — | — | — |

**Note:** FNP has the best lesson foundation of all NP pathways (496 lessons, 104 production-ready) but zero questions — lesson-to-question conversion is the critical next step.

---

### CNPLE (Canadian NP)

| Metric | Current | Launch Min | Mature | Gap to Launch |
|---|---:|---:|---:|---:|
| Total questions | **75** | 2,500 | 5,000 | **−2,425** |
| SATA | 12 | 375 | 750 | −363 |
| Bowtie | 12 | 250 | 500 | −238 |
| Matrix | 12 | 250 | 500 | −238 |
| **Flashcards** | **0** | 8,000 | 12,000 | **−8,000** |
| **Practice exams** | **0** | 100 | 100 | **−100** |
| CAT-eligible | 0 | 3,000 | 5,000 | −3,000 |
| Lessons (total) | 436 | — | — | — |
| Overall readiness | 56.9% | — | — | — |

---

### AGPCNP

| Metric | Current | Launch Min | Mature | Gap to Launch |
|---|---:|---:|---:|---:|
| Total questions | **0** | 2,500 | 5,000 | **−2,500** |
| Flashcards | 0 | 8,000 | 12,000 | −8,000 |
| Practice exams | 0 | 100 | 100 | −100 |
| CAT-eligible | 0 | 3,000 | 5,000 | −3,000 |
| Lessons (production-ready) | 0 | — | — | — |
| Lesson catalog (NP shared) | ~1,465 | — | — | — |
| Overall readiness | 0% | — | — | — |

---

### PMHNP

| Metric | Current | Launch Min | Mature | Gap to Launch |
|---|---:|---:|---:|---:|
| Total questions | **0** | 2,500 | 5,000 | **−2,500** |
| Flashcards | 0 | 8,000 | 12,000 | −8,000 |
| Practice exams | 0 | 100 | 100 | −100 |
| Lessons (production-ready) | 0 | — | — | — |
| Lesson catalog (NP shared) | ~1,459 | — | — | — |
| Overall readiness | 0% | — | — | — |

---

### PNP-PC

| Metric | Current | Launch Min | Mature | Gap to Launch |
|---|---:|---:|---:|---:|
| Total questions | **0** | 2,500 | 4,500 | **−2,500** |
| Flashcards | 0 | 8,000 | 12,000 | −8,000 |
| Practice exams | 0 | 100 | 100 | −100 |
| Lessons (production-ready) | 0 | — | — | — |
| Overall readiness | 0% | — | — | — |

---

### WHNP

| Metric | Current | Launch Min | Mature | Gap to Launch |
|---|---:|---:|---:|---:|
| Total questions | **0** | 2,500 | 4,000 | **−2,500** |
| Flashcards | 0 | 8,000 | 12,000 | −8,000 |
| Practice exams | 0 | 100 | 100 | −100 |
| Lessons (production-ready) | 0 | — | — | — |
| Overall readiness | 0% | — | — | — |

---

### ENP

| Metric | Current | Launch Min | Mature | Gap to Launch |
|---|---:|---:|---:|---:|
| Total questions | **0** | 2,500 | 4,000 | **−2,500** |
| Flashcards | 0 | 8,000 | 12,000 | −8,000 |
| Practice exams | 0 | 100 | 100 | −100 |
| Lessons | 0 | — | — | — |
| Overall readiness | 0% | — | — | — |

**Status:** No content or lessons found in any audit. Not yet in certification readiness dashboard.

---

## International Nursing Exam Pathways

All 8 international pathways have **zero inventory evidence** in any existing audit. No questions, no lessons, no flashcards, no practice exams.

| Exam | Launch Min | Mature | Questions Gap | Flashcards Gap |
|---|---:|---:|---:|---:|
| NMC CBT | 2,500 | 5,000 | −2,500 | −5,000 |
| NMC OSCE | 2,500 | 4,000 | −2,500 | −5,000 |
| AHPRA RN | 2,500 | 5,000 | −2,500 | −5,000 |
| NCNZ RN | 2,500 | 5,000 | −2,500 | −5,000 |
| DHA RN | 2,500 | 4,000 | −2,500 | −5,000 |
| HAAD RN | 2,500 | 4,000 | −2,500 | −5,000 |
| MOH RN | 2,500 | 4,000 | −2,500 | −5,000 |
| Singapore SNB RN | 2,500 | 4,000 | −2,500 | −5,000 |

**Total international question gap to launch:** −20,000 across 8 exams  
**Total international flashcard gap to launch:** −40,000 across 8 exams

---

## Cross-Pathway Aggregates

### Total question gap to launch minimums

| Pathway group | Current | Launch Sum | Gap |
|---|---:|---:|---:|
| NP (7 pathways) | 75 | 17,500 | **−17,425** |
| RN (3 pathways) | ~12,900 | 22,500 | **−9,600** |
| PN (2 pathways) | 101 | 10,000 | **−9,899** |
| International (8 pathways) | 0 | 20,000 | **−20,000** |
| **Total across 20 pathways** | **~13,076** | **70,000** | **−56,924** |

### Flashcard gap (all pathways at 0)

| Pathway group | Launch Min per pathway | Pathways | Total gap |
|---|---:|---:|---:|
| NP (7) | 8,000 | 7 | **−56,000** |
| RN (3) | 15,000 | 3 | **−45,000** |
| PN (2) | 8,000 | 2 | **−16,000** |
| International (8) | 5,000 | 8 | **−40,000** |
| **Total** | — | 20 | **−157,000** |

### Practice exam gap (all pathways at 0)

Every pathway needs 100 full-length practice exams. Total gap: **−2,000 practice exam sets** across 20 pathways.

### CAT pool gap

| Pathway | Current CAT | Min CAT | Gap |
|---|---:|---:|---:|
| NCLEX-RN (US) | 11,660 ✓ | 3,000 | +8,660 |
| All other 19 pathways | 0 | 3,000 each | −57,000 total |

---

## Question Type Distribution Gap

Required distribution vs. current state (using NCLEX-RN as the only pathway with published data):

| Format | Required % | Required at 10K launch | Required at 20K mature | Current NCLEX-RN | Gap to 10K | Gap to 20K |
|---|---:|---:|---:|---:|---:|---:|
| Traditional MCQ | 35% | 3,500 | 7,000 | ~12,838* | surplus* | surplus* |
| SATA | 15% | 1,500 | 3,000 | 0 | **−1,500** | **−3,000** |
| Bowtie | 10% | 1,000 | 2,000 | ~392† | **−608** | **−1,608** |
| Matrix | 10% | 1,000 | 2,000 | 0 | **−1,000** | **−2,000** |
| Case Studies | 10% | 1,000 | 2,000 | 6 | **−994** | **−1,994** |
| Trend Recognition | 5% | 500 | 1,000 | 0 | **−500** | **−1,000** |
| Prioritization | 5% | 500 | 1,000 | 0 | **−500** | **−1,000** |
| Delegation | 3% | 300 | 600 | 0 | **−300** | **−600** |
| Documentation | 2% | 200 | 400 | 0 | **−200** | **−400** |

> *Format field is NULL in all DB rows — actual SATA/MCQ split is unknown; all 12,838 are assumed MCQ pending a format audit.  
> †392 bowtie questions exist but have invalid payload and are CAT-excluded.

**The entire 12,838-question NCLEX-RN pool cannot be counted toward format-specific targets until `questionFormat` is tagged.**

---

## Clinical Judgment Format Requirements Gap

Per-pathway requirement (same for all 20 pathways):

| Clinical judgment format | Required | NCLEX-RN current | All other pathways |
|---|---:|---:|---:|
| NGN Case Studies | 100+ | 6 | 0 |
| Bowties | 150+ | ~392 (invalid) | 0 |
| Matrix Cases | 150+ | 0 | 0 |
| Trend Interpretation | 150+ | 0 | 0 |
| Prioritization Cases | 150+ | 0 | 0 |
| Delegation Cases | 100+ | 0 | 0 |
| Documentation Cases | 100+ | 0 | 0 |
| Multi-Shift Simulations | 50+ | 9 | 0 |
| Virtual Clinical Simulations | 50+ | 0 | 0 |

---

## Difficulty Distribution Gap (NCLEX-RN)

CAT pools require balanced spread across Easy, Moderate, Hard, and High-discrimination items.

| Level | Current | Current % | Target % | Target at 12,838 | Gap |
|---|---:|---:|---:|---:|---:|
| L1 (Easy) | 30 | 0.2% | ~15% | ~1,926 | **−1,896** |
| L2 (Moderate-Easy) | 1,393 | 10.9% | ~25% | ~3,210 | **−1,817** |
| L3 (Moderate) | 7,464 | 58.1% | ~35% | ~4,493 | **+2,971 surplus** |
| L4 (Hard) | 2,723 | 21.2% | ~20% | ~2,568 | +155 near target |
| L5 (Very Hard) | 50 | 0.4% | ~5% | ~642 | **−592** |

The pool is severely L3-heavy and L1-deficient. CAT adaptive testing requires adequate Easy questions to calibrate entry-level ability — this gap directly limits CAT effectiveness for new users.

---

## Publication Readiness Checklist — Per-Pathway Status

Per the standard, content is READY FOR PUBLICATION only when all 11 checkpoints pass.

| Checkpoint | NCLEX-RN | REx-PN | CNPLE | FNP | All others |
|---|---|---|---|---|---|
| ✓ Lesson exists | Partial | Partial | Partial | Partial | ❌ |
| ✓ Flashcards exist | ❌ | ❌ | ❌ | ❌ | ❌ |
| ✓ Questions exist | ✓* | Partial | Partial | ❌ | ❌ |
| ✓ Rationales exist | Partial (638 missing) | Unknown | Unknown | ❌ | ❌ |
| ✓ Hints exist | Unknown | Unknown | Unknown | ❌ | ❌ |
| ✓ Clinical pearls exist | Unknown | Unknown | Unknown | ❌ | ❌ |
| ✓ Metadata exists | Partial | Partial | Partial | ❌ | ❌ |
| ✓ Blueprint mapping exists | Partial | Partial | Partial | ❌ | ❌ |
| ✓ Adaptive routing exists | ❌ | ❌ | ❌ | ❌ | ❌ |
| ✓ CAT eligibility exists | Partial (11,660 eligible) | ❌ | ❌ | ❌ | ❌ |
| ✓ Analytics tagging exists | Partial | Partial | Partial | ❌ | ❌ |
| **Verdict** | **DRAFT** | **DRAFT** | **DRAFT** | **DRAFT** | **DRAFT** |

**All 20 pathways are currently: DRAFT — NOT READY FOR PUBLICATION**

---

## Priority Build Order

Ranked by impact × distance from launch minimum × revenue weight:

### Priority 1 — NCLEX-RN (US) Format & Enrichment Sprint
> Has the questions. Needs format tags, rationale completion, and flashcard build.
- **Tag `questionFormat`** on all 12,838 questions → unlocks SATA/bowtie/matrix count visibility
- **Fix 392 invalid bowtie payloads** → restore to CAT pool
- **Complete 638 missing rationales** → unblock CAT eligibility
- **Build 15,000 flashcards** (minimum for launch)
- **Generate 100 practice exam sets** with blueprint weighting
- **Add 1,470 L1 (Easy) questions** to balance difficulty spread
- **Generate 1,500 SATA, 1,000 Matrix, 994 Case Studies** to hit launch minimums
- Estimated to unlock: **NCLEX-RN launch readiness**

### Priority 2 — REx-PN & CNPLE Question Volume
> Best format diversity, best readiness scores, but only 75 questions each.
- Generate ~4,925 questions for REx-PN (all formats, blueprint-mapped)
- Generate ~2,425 questions for CNPLE
- Build 8,000 flashcards each
- Generate 100 practice exam sets each
- Estimated unlock: **REx-PN and CNPLE launch**

### Priority 3 — FNP Question Generation from Lesson Corpus
> 496 lessons, 104 production-ready — the lesson-to-question pipeline needs to fire.
- Convert 104 production-ready FNP lessons → questions (target: 2,500 minimum)
- Build 8,000 FNP flashcards
- Generate 100 practice exam sets
- Estimated unlock: **FNP launch readiness**

### Priority 4 — Canadian NCLEX-RN Differentiation
> Question pool is largely US-RN inherited. Needs Canadian-specific content.
- Verify regionScope tagging on existing 12,838 questions to confirm Canadian pool size
- Generate Canadian-specific regulatory, legislation, and scope-of-practice questions
- Build 15,000 flashcards (Canadian-scope)
- Generate 100 practice exam sets

### Priority 5 — NCLEX-PN Volume Sprint
> 26 questions vs 5,000 minimum. Needs full build.
- Generate 4,974 questions (blueprint-mapped, all formats)
- Build 8,000 flashcards
- 100 practice exam sets

### Priority 6 — Remaining NP Pathways (AGPCNP, PMHNP, WHNP, PNP-PC, ENP)
> 0 questions and 0 lessons for 5 pathways. Lesson catalog exists for 4 of 5.
- Activate NP lesson catalog for each pathway → generate 250 production-ready lessons per pathway
- Generate 2,500 questions per pathway from those lessons
- Build 8,000 flashcards per pathway
- 100 practice exam sets per pathway

### Priority 7 — International Pathways (8 exams)
> Greenfield. Blueprint research required before content generation.
- Define blueprints for NMC CBT, NMC OSCE, AHPRA RN, NCNZ RN, DHA RN, HAAD RN, MOH RN, Singapore SNB RN
- Generate 2,500 questions per pathway
- Build 5,000 flashcards per pathway
- 100 practice exam sets per pathway

---

## Summary Score Card

| Pathway | Questions | Flashcards | Practice Exams | CAT Pool | Format Mix | Readiness |
|---|---|---|---|---|---|---|
| NCLEX-RN (US) | 12,838 ✓ | 0 ❌ | 0 ❌ | 11,660 ✓ | MCQ only ❌ | **DRAFT 41.7%** |
| Canadian NCLEX-RN | ~62 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | MCQ only ❌ | **DRAFT 41.7%** |
| New Graduate RN | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT ~0%** |
| REx-PN | 75 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | Mixed ✓ | **DRAFT 57.2%** |
| NCLEX-PN | 26 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | MCQ only ❌ | **DRAFT 32.6%** |
| FNP | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 19.6%** |
| CNPLE | 75 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | Mixed ✓ | **DRAFT 56.9%** |
| AGPCNP | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 0%** |
| PMHNP | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 0%** |
| WHNP | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 0%** |
| PNP-PC | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 0%** |
| ENP | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 0%** |
| NMC CBT | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 0%** |
| NMC OSCE | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 0%** |
| AHPRA RN | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 0%** |
| NCNZ RN | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 0%** |
| DHA RN | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 0%** |
| HAAD RN | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 0%** |
| MOH RN | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 0%** |
| Singapore SNB RN | 0 ❌ | 0 ❌ | 0 ❌ | 0 ❌ | None ❌ | **DRAFT 0%** |
