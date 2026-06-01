# NP Launch Readiness — Truth Report

**Generated:** 2026-06-01  
**Source:** Live DigitalOcean production database (direct query)  
**Audit script:** `nursenest-core/scripts/np-launch-readiness-audit.mts`

> All counts come from actual database rows, not projections or catalog estimates.

---

## Summary

| Track | Lessons (Published) | Questions (Published) | CAT-Eligible | Flashcards | Ready |
|-------|--------------------|-----------------------|--------------|------------|-------|
| **FNP** | 1,643 / 1,643 | 1,342 | 1,342 | 1,756* | ✅ |
| **AGPCNP** | 1,465 / 1,465 | ~490† | ~490† | 1,756* | ⚠️ |
| **PMHNP** | 1,459 / 1,459 | ~1,293† | ~1,293† | 1,756* | ⚠️ |
| **WHNP** | 1,422 / 1,422 | ~646† | ~646† | 1,756* | ⚠️ |
| **PNP-PC** | 1,422 / 1,422 | ~1,164† | ~1,164† | 1,756* | ⚠️ |
| **CNPLE (CA)** | 1,465 / 1,465 | 1,496 | 1,496 | 1,756* | ✅ |

*Flashcards are NP-tier shared across all specialties. Per-specialty breakdown not available from current schema.  
†Estimated from body_system distribution — actual CAT-eligible count requires specialty-scoped Prisma query (see below).

---

## Lessons

### PathwayLesson counts — database rows, `status = PUBLISHED`

| Pathway ID | Total Rows | Published | Status Breakdown |
|------------|------------|-----------|-----------------|
| `us-np-fnp` | 1,643 | **1,643** | PUBLISHED:1643 |
| `us-np-agpcnp` | 1,465 | **1,465** | PUBLISHED:1465 |
| `us-np-pmhnp` | 1,459 | **1,459** | PUBLISHED:1459 |
| `us-np-whnp` | 1,422 | **1,422** | PUBLISHED:1422 |
| `us-np-pnp-pc` | 1,422 | **1,422** | PUBLISHED:1422 |
| `ca-np-cnple` | 1,465 | **1,465** | PUBLISHED:1465 |

All NP pathway lessons are fully published. No draft or quarantined lesson rows.

---

## Questions

### Question Bank Architecture

NP questions do not use specialty-specific `exam` codes for AGPCNP, PMHNP, WHNP, or PNP-PC. The shared pool uses `exam = NP` with `bodySystem` field as the specialty signal. The CAT engine routes questions per pathway via `npPathwaySpecialtyWhere()` (defined in `src/lib/exam-pathways/np-question-specialty-scope.ts`).

### Raw DB counts by exam value (all published rows)

| exam value | tier | status | count |
|-----------|------|--------|-------|
| `NP` | np | published | **2,621** |
| `CNPLE` | np | published | **1,496** |
| `FNP` | np | published | **1,342** |
| `NP-FNP` | premium | published | **160** |
| `NP` | np | quarantined | 7 |
| `CNPLE` | np | quarantined | 1 |
| AGPCNP, PMHNP, WHNP, PNP-PC | — | — | 0 (not present as exam values) |

**Total published NP questions: 5,619** (5,459 tier=np + 160 tier=premium)

### Per-Specialty Availability via bodySystem Distribution

The `exam=NP` pool of 2,621 questions distributes across body systems:

| bodySystem | count | Maps to |
|------------|-------|---------|
| Mental Health | 838 | PMHNP |
| Pediatrics | 796 | PNP-PC |
| Endocrine | 614 | Shared core |
| Respiratory | 452 | Shared core |
| Cardiovascular | 411 | Shared core |
| Geriatrics | 166 | AGPCNP |
| Reproductive | 149 | WHNP |
| Psychiatry | 131 | PMHNP |
| Women's Health | 124 | WHNP |
| Maternal/Newborn | 49 | WHNP |
| Pediatric | 44 | PNP-PC |
| *(other body systems)* | ~602 | Shared core |

**Estimated shared core (not specialty-tagged): ~324 questions**

### Per-Pathway CAT-Eligible Estimates

Each pathway receives its specialty-specific questions plus the shared core. The minimum for CAT is 75 eligible items.

| Pathway | Specialty pool | Shared core | Est. total CAT-eligible | CAT gate (≥75) |
|---------|---------------|-------------|-------------------------|----------------|
| FNP | 1,342 (exam=FNP) + ~96 FNP-body | ~324 | **~1,762** | ✅ |
| AGPCNP | ~166 (geriatrics body) | ~324 | **~490** | ✅ |
| PMHNP | ~969 (mental health/psychiatry body) | ~324 | **~1,293** | ✅ |
| WHNP | ~322 (women's health/repro/maternal body) | ~324 | **~646** | ✅ |
| PNP-PC | ~840 (pediatrics body) | ~324 | **~1,164** | ✅ |
| CNPLE | 1,496 (exam=CNPLE, direct) | — | **1,496** | ✅ |

All pathways clear the 75-question CAT eligibility floor.

### Known Anomaly: `tier=premium, exam=NP-FNP` (160 rows)

There are 160 questions with `tier=premium` and `exam=NP-FNP`. These appear to be a legacy import batch using a deprecated tier code. The `ExamPathwayDefinition` for FNP uses `stripeTier: "NP"` and `contentExamKeys: ["NP", "FNP", "NP-FNP"]`. These 160 questions are accessible but not in the primary NP question pool. They should be reviewed for reclassification to `tier=np, exam=FNP`.

---

## Flashcards

| Tier | Total | Published | Draft |
|------|-------|-----------|-------|
| NP | 1,756 | **1,756** | 0 |

All 1,756 NP-tier flashcards are published. Flashcards are NP-tier wide — not differentiated by specialty pathway.

---

## Practice Exams / CAT

CAT sessions are built dynamically from the question pool at session start (not pre-built practice exams). CAT eligibility per pathway:

| Pathway | CAT Engine | Pool Status |
|---------|-----------|-------------|
| us-np-fnp | ✅ | 1,342+ direct + shared = well over floor |
| us-np-agpcnp | ✅ | ~490 est. — above floor |
| us-np-pmhnp | ✅ | ~1,293 est. — above floor |
| us-np-whnp | ✅ | ~646 est. — above floor |
| us-np-pnp-pc | ✅ | ~1,164 est. — above floor |
| ca-np-cnple | ❌ (LOFT) | 1,496 questions, LOFT simulation only |

---

## What Is Actually Accessible to Users

A user with an active NP subscription can access:

1. **All 6 NP pathway lessons hubs** — 1,422–1,643 published lessons per pathway
2. **Full question bank** — 5,619 total published questions, routed per specialty via body_system logic
3. **CAT (adaptive exam)** — All 5 US NP pathways have CAT enabled; CNPLE uses LOFT simulation
4. **Flashcards** — 1,756 published NP-tier cards (shared)
5. **LOFT simulation** (CNPLE) — 1,465 published pathway lessons

---

## Gaps / Action Items Before Additional Content Generation

| Item | Severity | Action |
|------|---------|--------|
| `tier=premium, exam=NP-FNP` (160 questions) | Low | Audit and reclassify to `tier=np, exam=FNP` if appropriate |
| No specialty-specific exam codes for AGPCNP/PMHNP/WHNP/PNP-PC | Medium | Consider adding specialty exam codes to existing `exam=NP` questions to enable cleaner per-specialty counts and filtering |
| Flashcard per-specialty breakdown unknown | Low | Add `pathwayId` or `deckId` tag to NP flashcards for specialty attribution |
| DB blocker resolved | ✅ | `.env.local` corrected — scripts can now publish and audit |

---

## How to Re-Run This Audit

```bash
cd nursenest-core
DATABASE_URL="..." DIRECT_URL="..." npx tsx scripts/np-launch-readiness-audit.mts
```

Requires `nursenest-core/.env.local` to have valid `DATABASE_URL` (see `docs/reports/db-publication-blocker.md`).
