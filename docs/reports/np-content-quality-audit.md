# NP Content Quality Audit
**Generated:** 2026-06-01  
**Pathways:** FNP, AGPCNP, WHNP, PMHNP, CNPLE, PNP-PC

---

## Overall Quality Signal

| Pathway | Questions | Rationale 100% | Clinical Pearl 100% | Distractor Rationale 100% | Exam Strategy 100% | Orphaned |
|---|---|---|---|---|---|---|
| `us-np-fnp` | 10,375 | ✓ | ✓ | ✓ | ✓ | 0 |
| `us-np-agpcnp` | 5,000 | ✓ | ✓ | ✓ | ✓ | 0 |
| `us-np-whnp` | 4,000 | ✓ | ✓ | ✓ | ✓ | 0 |
| `us-np-pmhnp` | 4,000 | ✓ | ✓ | ✓ | ✓ | 0 |
| `ca-np-cnple` | 0 | — | — | — | — | — |
| `us-np-pnp-pc` | 4,000 | ✓ | ✓ | ✓ | ✓ | 0 |

**All published questions have 100% rationale, clinical pearl, distractor rationale, and exam strategy coverage.** No orphaned questions (rows with no rationale and no clinical pearl) across any pathway.

---

## Per-Pathway Detail

### FNP (`us-np-fnp`)

| Metric | Value |
|---|---|
| Total questions | 10,375 |
| With rationale | 10,375 (100%) |
| With clinical pearl | 10,375 (100%) |
| With distractor rationale | 10,375 (100%) |
| With exam strategy | 10,375 (100%) |
| Orphaned questions | 0 |
| Lessons in DB | 1,643 |
| Flashcards in DB | 8,300 |
| Empty lessons (no sections) | 0 |
| Practice exams | 300 |
| CAT-eligible questions | 11,336 |

**Status: Launch-ready ✓**

### AGPCNP (`us-np-agpcnp`)

| Metric | Value |
|---|---|
| Total questions | 5,000 |
| With rationale | 5,000 (100%) |
| With clinical pearl | 5,000 (100%) |
| With distractor rationale | 5,000 (100%) |
| With exam strategy | 5,000 (100%) |
| Orphaned questions | 0 |
| Lessons in DB | 1,465 |
| Flashcards in DB | 5,000 |
| Empty lessons (no sections) | 0 |
| Practice exams | 250 |
| CAT-eligible questions | 6,817 |

**Status: Launch-ready ✓**

### WHNP (`us-np-whnp`)

| Metric | Value |
|---|---|
| Total questions | 4,000 |
| With rationale | 4,000 (100%) |
| With clinical pearl | 4,000 (100%) |
| With distractor rationale | 4,000 (100%) |
| With exam strategy | 4,000 (100%) |
| Orphaned questions | 0 |
| Lessons in DB | 1,422 |
| Flashcards in DB | 4,000 |
| Empty lessons (no sections) | 0 |
| Practice exams | 200 |
| CAT-eligible questions | 5,959 |

**Status: Launch-ready ✓**

### PMHNP (`us-np-pmhnp`)

| Metric | Value |
|---|---|
| Total questions | 4,000 |
| With rationale | 4,000 (100%) |
| With clinical pearl | 4,000 (100%) |
| With distractor rationale | 4,000 (100%) |
| With exam strategy | 4,000 (100%) |
| Orphaned questions | 0 |
| Lessons in DB | 1,459 |
| Flashcards in DB | 4,000 |
| Empty lessons (no sections) | 0 |

**Status: Launch-ready ✓ (no dedicated launch script — content sourced from NP core pipeline)**

### CNPLE (`ca-np-cnple`)

| Metric | Value |
|---|---|
| Total questions | **0** ← BLOCKER |
| Rationale coverage | — (no questions) |
| Clinical pearl coverage | — (no questions) |
| Lessons in DB | 1,465 |
| Flashcards in DB | 1,154 |
| Empty lessons (no sections) | 0 |

**Status: NOT launch-ready — 0 questions published.**

The `generate-cnple-launch-readiness-content.mts` script exists but has not been run with `--apply`. 

To publish:
```bash
npx tsx --tsconfig tsconfig.json scripts/db-publication-preflight.mts && \
npx tsx --tsconfig tsconfig.json scripts/generate-cnple-launch-readiness-content.mts --apply
```

### PNP-PC (`us-np-pnp-pc`)

| Metric | Value |
|---|---|
| Total questions | 4,000 |
| With rationale | 4,000 (100%) |
| With clinical pearl | 4,000 (100%) |
| With distractor rationale | 4,000 (100%) |
| With exam strategy | 4,000 (100%) |
| Orphaned questions | 0 |
| Lessons in DB | 1,422 |
| Flashcards in DB | 4,000 |
| Empty lessons (no sections) | 0 |

**Status: Launch-ready ✓**

---

## Issues Found

### Issue 1 — CNPLE Has Zero Questions
- **Severity:** Launch blocker
- **Pathway:** `ca-np-cnple`
- **Root cause:** `generate-cnple-launch-readiness-content.mts --apply` has not been run
- **Resolution:** Run the CNPLE launch script

### Issue 2 — No Empty Lessons, No Orphaned Content
- All DB lesson rows have section data
- No questions exist without rationale
- No questions exist without clinical pearl
- **Status: No structural quality issues found**

---

## Quality Methodology

Checks performed via direct Prisma queries on production database:
- `rationale`: `examQuestion.rationale IS NOT NULL`
- `clinicalPearl`: `examQuestion.clinical_pearl IS NOT NULL`
- `distractorRationales`: `examQuestion.distractor_rationales IS NOT NULL`
- `examStrategy`: `examQuestion.exam_strategy IS NOT NULL`
- Orphaned: `rationale IS NULL AND clinical_pearl IS NULL`
- Empty lessons: `pathwayLesson.sections IS NULL`
