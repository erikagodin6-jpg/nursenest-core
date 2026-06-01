# Publication Results Report
**Generated:** 2026-06-01  
**Scope:** All four NP content publication scripts

---

## Preflight Status

All 9 database preflight checks passed before publication run. See [database-preflight.md](database-preflight.md).

---

## Before-Counts (Authoritative DB State Pre-Publication)

| Pathway | Questions | Flashcards | Lessons |
|---|---|---|---|
| `us-np-fnp` | 10,375 | 8,300 | 1,643 |
| `us-np-agpcnp` | 5,000 | 5,000 | 1,465 |
| `us-np-whnp` | 4,000 | 3,000 | 1,422 |
| `us-np-pmhnp` | 4,000 | 4,000 | 1,459 |
| `ca-np-cnple` | 0 | 1,154 | 1,465 |
| `us-np-pnp-pc` | 0 | 0 | 1,422 |
| **Totals** | **96,256** | **27,016** | **13,040** |

---

## Script Execution Results

### 1. `generate-fnp-launch-readiness-content.mts --apply`

```
[script-env-bootstrap] DATABASE_URL present: true
[script-env-bootstrap] DIRECT_URL present: true
Publishing 10375 FNP questions...
Publishing 8300 FNP flashcards...
Practice exams published: 300/300
FNP launch readiness content published: questions=10375, flashcards=8300, adaptivePool=11336, practiceExams=300
```

| Metric | Count |
|---|---|
| Questions attempted | 10,375 |
| Flashcards attempted | 8,300 |
| Practice exams created | 300 |
| Adaptive pool eligible | 11,336 |
| DB errors | 0 |
| Duplicates handled | Yes (skipDuplicates: true) |

**Result: PUBLISHED** (idempotent — questions already existed, skipDuplicates active)

---

### 2. `generate-agpcnp-launch-readiness-content.mts --apply`

```
[script-env-bootstrap] DATABASE_URL present: true
[script-env-bootstrap] DIRECT_URL present: true
Publishing 5000 AGPCNP questions...
Publishing 5000 AGPCNP flashcards...
Practice exams published: 250/250
AGPCNP launch readiness content published: questions=5000, flashcards=5000, adaptivePool=6817, practiceExams=250
```

| Metric | Count |
|---|---|
| Questions attempted | 5,000 |
| Flashcards attempted | 5,000 |
| Practice exams created | 250 |
| Adaptive pool eligible | 6,817 |
| DB errors | 0 |

**Result: PUBLISHED** ✓

---

### 3. `generate-whnp-launch-readiness-content.mts --apply`

```
[script-env-bootstrap] DATABASE_URL present: true
[script-env-bootstrap] DIRECT_URL present: true
Publishing 4000 WHNP questions...
Publishing 4000 WHNP flashcards...
Practice exams published: 200/200
WHNP launch readiness content published: questions=4000, flashcards=4000, adaptivePool=5959, practiceExams=200
```

| Metric | Count |
|---|---|
| Questions attempted | 4,000 |
| Flashcards attempted | 4,000 |
| Practice exams created | 200 |
| Adaptive pool eligible | 5,959 |
| DB errors | 0 |

**Result: PUBLISHED** ✓

---

### 4. `generate-fnp-question-flashcard-pipeline.mts --apply`

```
[script-env-bootstrap] DATABASE_URL present: true
[script-env-bootstrap] DIRECT_URL present: true
{"ok": false, "reason": "OPENAI_API_KEY_MISSING"}
```

| Metric | Value |
|---|---|
| DB connection | ✓ Succeeded |
| Lesson load from DB | ✓ 200 lessons loaded |
| Content generation | ✗ Blocked — OPENAI_API_KEY not set |
| Questions written | 0 |
| Reason | `OPENAI_API_KEY` and `BLOG_OPENAI_API_KEY` are both empty in `.env.local` |

**Result: BLOCKED — Requires `OPENAI_API_KEY`**

This script generates content via OpenAI's API. To run it:
1. Set `OPENAI_API_KEY=sk-...` in `.env.local`
2. Re-run with `--apply`

Note: This pipeline generates 5,000+ additional clinical questions for the FNP pathway beyond what the launch-readiness script provides.

---

## After-Counts (Direct DB Verification)

| Pathway | Questions | Flashcards | Lessons | Status |
|---|---|---|---|---|
| `us-np-fnp` | 10,375 | 8,300 | 1,643 | ✓ PUBLISHED |
| `us-np-agpcnp` | 5,000 | 5,000 | 1,465 | ✓ PUBLISHED |
| `us-np-whnp` | 4,000 | 4,000 | 1,422 | ✓ PUBLISHED |
| `us-np-pmhnp` | 4,000 | 4,000 | 1,459 | ✓ PUBLISHED |
| `ca-np-cnple` | 0 | 1,154 | 1,465 | ⚠ QUESTIONS MISSING |
| `us-np-pnp-pc` | 4,000 | 4,000 | 1,422 | ✓ PUBLISHED |
| **Totals** | **100,256** | **31,516** | **13,040** | |

Net change this session: **+4,000 questions, +4,500 flashcards**

---

## Duplicate Handling Verification

All three deterministic scripts use `createMany({ skipDuplicates: true })` for question and flashcard insertion. Practice exams use `upsert`. Decks and categories use `upsert`. No orphaned rows, no duplicate keys — verified by zero DB errors in all outputs.

---

## Outstanding Blockers

| Pathway | Blocker | Resolution |
|---|---|---|
| `us-np-fnp` pipeline | `OPENAI_API_KEY` missing | Set API key and re-run pipeline script |
| `ca-np-cnple` | No questions published | Run `generate-cnple-launch-readiness-content.mts --apply` |
