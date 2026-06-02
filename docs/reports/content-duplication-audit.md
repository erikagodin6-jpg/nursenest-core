# Content Duplication Audit

**Generated:** 2026-06-01  
**Companion to:** `docs/reports/content-source-of-truth-audit.md`

---

## Executive Summary

The platform has accumulated 7 categories of structural duplication across its educational content layer. The most critical are:

1. **Lesson content in 22 static files AND the DB** — 1,185 of 1,845 lesson slugs appear in multiple catalog files
2. **Two parallel question models** — `ExamQuestion` (modern) and `Question` (legacy) coexist in the same DB
3. **Two parallel flashcard models** — `Flashcard`/`FlashcardDeck` (modern) and `flashcard_bank` (legacy)
4. **Three parallel practice session models** — `PracticeTest`, `Exam`/`ExamSession`, `custom_practice_sessions`
5. **Two parallel event logs** — `LearnerActivityEvent` and `analytics_events`
6. **Two CAT engine implementations** — server and client
7. **Clinical pearls embedded in 4 independent locations**

---

## Target Architecture

```
Lesson (PathwayLesson)
  ↓ derives
Questions (ExamQuestion)       ← one pool, one model
  ↓ derives
Flashcards (Flashcard)         ← sourceKey links back to question
  ↓ groups
Practice (PracticeTest)        ← one session model, adaptive + timed
  ↓ selects from
CAT (PracticeTest.adaptiveState + ExamQuestion pool)
```

**One model per content type. No parallel systems. No orphaned legacy tables.**

---

## Duplication Category 1: Lesson Static Files vs Database

### What Exists
- **22 static catalog JSON files** in `src/content/pathway-lessons/` containing 1,845 unique lesson slugs
- **`PathwayLesson` DB table** — the same slugs live here after import, plus all lessons added directly to DB

### Measurement
```
Total unique slugs in static files:       1,845
Slugs appearing in 2+ catalog files:      1,185 (64%)
Most common duplication pattern:
  Same slug in ca-rn-nclex-rn AND us-rn-nclex-rn buckets (US/CA parity)
  → Both expansion catalogs store identical lesson JSON
```

**Root cause:** RN expansion catalogs duplicate every lesson across both `ca-rn-nclex-rn` and `us-rn-nclex-rn` in the same catalog file. These should be one entry with a scope flag, or a shared catalog row plus a pathway-scoped override.

### Duplicate Storage Volume
- `rn-nclex-respiratory-expansion-catalog.json`: 35 lessons × 2 pathways = 70 rows, 35 duplicate
- Same pattern in 14 other expansion catalogs = ~500 duplicate static lesson rows
- Estimated wasted storage in static files: ~4 MB of JSON duplication

### Impact
- The tertiary fallback (catalog-based) over-counts lessons for US RN by serving CA+US duplicates
- `scoped-gold-registry.ts` exists specifically to prevent cross-pathway static injection, but the root catalog duplication predates this guard

### What Should Be Deleted
After confirming all slugs are imported to `PathwayLesson` DB:
- Archive all 17 `rn-nclex-*-expansion-catalog.json` files to `data/archived-catalogs/`
- Keep only `catalog.json` as the reference for the 5-pathway baseline (576 lessons)
- Keep `np-parity-expansion-catalog.json` as the FNP/CNPLE lesson source for the publisher scripts
- The `rn-nclex-catalog-import-state.json` confirms which runs completed — verify before archiving

---

## Duplication Category 2: Two Question Models

### What Exists

**Model 1 — `ExamQuestion` (modern)**
- Table: `exam_questions`
- 5,600+ rows published across NP pool alone
- Has: IRT fields, blueprint, tags, adaptive eligibility, multi-format options, 20+ quality fields
- Used by: all CAT, all practice tests, question bank, NP publishers

**Model 2 — `Question` (legacy)**
- Table: `questions`
- Has: `stem`, `rationale`, `options`, `answerKey`, `questionType`, `lessonId` FK
- Linked to: `Lesson` model (also legacy)
- Used by: **unknown** — no active API routes or learner-facing surfaces found to query `Question` directly

**Model 3 — `generated_questions` (legacy lowercase)**
- Raw AI generation staging table
- Not served directly; intermediate step in generation pipeline

### Duplicate Storage
- `Question` and `ExamQuestion` both store `stemHash`, `tags`, `difficulty`, `status`, `countryCode`
- Both models use `CategoryId` FK to the same `Category` table
- If `Question` rows exist for the same clinical content as `ExamQuestion`, content is stored twice

### What Is Duplicated
Any question that went through the legacy pipeline (Lesson → Question → admin review → ExamQuestion) exists in both tables. This is the original import chain.

### What Should Be Deleted
- After verifying no active read paths use `Question` model: drop the `questions` table
- Remove `Lesson`/`Question` from `prisma/schema.prisma`
- Archive `generated_questions` rows older than 6 months to cold storage

---

## Duplication Category 3: Two Flashcard Models

### What Exists

**Model 1 — `Flashcard` + `FlashcardDeck` (modern)**
- Tables: `flashcards`, `flashcard_decks`, `flashcard_options`, `flashcard_progress`
- Has: `sourceKey` (deduplication), `pathwayId` on deck, `examFamily`, `visibility` (SUBSCRIBER)
- Used by: all flashcard sessions, inventory API, new publisher scripts

**Model 2 — `flashcard_bank` (legacy lowercase)**
- Table: `flashcard_bank`
- Has: `front`, `back`, `tier`, `flashcard_enabled` boolean (opt-in flag)
- Linked to: `source_question_id` pointing at some question model
- Not linked to: `FlashcardDeck`, `pathwayId`, modern learner progress tracking

### Duplicate Storage
The NP launch-readiness scripts published 25,300 flashcards to `Flashcard`. If `flashcard_bank` contains any overlapping NP content (from earlier generation runs), the same clinical front/back text exists in two tables.

Content duplication within flashcards:
- Clinical pearl text appears in `Flashcard.back` AND `ExamQuestion.clinicalPearl` (same field, two tables)
- `spaced_repetition_cards` table — a third flashcard-adjacent model with no FK to `Flashcard`

### What Should Be Deleted
- Audit `flashcard_bank.flashcard_enabled` — if all rows have `flashcard_enabled = false`, the table is inactive and can be dropped
- Verify `spaced_repetition_cards` source — if derived from `FlashcardProgress`, consolidate
- `src/content/flashcard-samples.json` — verify whether used at runtime or only in tests

---

## Duplication Category 4: Three Practice Session Models

### What Exists

**Model 1 — `PracticeTest` (modern, primary)**
- Table: `practice_tests`
- Adaptive + practice mode; `adaptiveState` for CAT theta
- Used by: `/api/practice-tests`, all NP CAT sessions

**Model 2 — `Exam` + `ExamSession` + `ExamAttempt`**
- Tables: `exams`, `exam_sessions`, `exam_attempts`
- Separate timed exam structure with linear/CAT mode
- `ExamSession.examMode = 'cat' | 'linear'`
- Used by: `/app/modules/*` and possibly legacy quiz flows

**Model 3 — `custom_practice_sessions` (legacy lowercase)**
- Table: `custom_practice_sessions`
- Standalone; not linked to `PracticeTest` or `ExamSession`
- Likely Replit-era custom session builder

**Model 4 — `exam_attempts` (legacy lowercase)**
- Table: `exam_attempts`
- Has: `template_id`, `questions_payload` JSON
- No FK to modern models

### Duplicate Storage
A single learner CAT session may generate rows in:
- `PracticeTest` (session state + theta)
- `ExamSession` (if routed through `Exam` structure)
- `ExamQuestionPracticeAnswerAttempt` (per-response records)

This is 3 rows for what should be 1 session record.

### What Should Be Deleted
1. Verify `custom_practice_sessions` — if no active API reads this, drop
2. Verify `exam_attempts` (lowercase) — if no active front-end reads this, drop
3. Consolidate `Exam`/`ExamSession` into `PracticeTest.config` — add a `mode: 'timed_exam'` flag
4. The `Exam` table currently only holds 200–300 preset rows per NP pathway (title + status) — these could move to an `ExamQuestion` tag configuration

---

## Duplication Category 5: Two Parallel Event Logs

### What Exists

**Model 1 — `LearnerActivityEvent` (modern)**
- Table: `learner_activity_events`
- Has: `userId`, `activityType`, `pathwayId`, `metadata` JSON
- Written by: modern learner activity tracking in Next.js app

**Model 2 — `analytics_events` (legacy lowercase)**
- Table: `analytics_events`
- Different schema; older `event_type` + `properties` JSON pattern
- Written by: likely the legacy client-side tracker

### Duplicate Storage
If both systems are active, every learner event generates two rows in two tables. They are not deduplicated or joined anywhere in the codebase.

### What Should Be Deleted
- After migrating any unique `analytics_events` data to `LearnerActivityEvent` format:
  1. Stop writing to `analytics_events`
  2. Archive old rows to cold storage
  3. Drop the table

---

## Duplication Category 6: Two CAT Engine Implementations

### What Exists

**Server engine:** `server/cat-engine.ts`
- Used by: `/api/practice-tests`, `/api/cat/np/session`
- Contains: IRT item selection, theta update, stop criteria

**Client engine:** `client/src/lib/cat-engine.ts`
- Used by: legacy client-side CAT flows (Replit-era)
- Contains: same IRT logic, possibly diverged

### Risk
Any parameter change in one engine must be mirrored in the other. Both engines compute theta — if they diverge, learners see different difficulty progressions depending on which code path processes their session.

### What Should Be Done
1. Audit for algorithmic divergence between the two files
2. Extract IRT math into a shared package (`packages/cat-engine/`)
3. Both server and client import from the shared package
4. Delete the redundant implementation

---

## Duplication Category 7: Clinical Pearls in 4 Locations

### Where Clinical Pearls Live

| Location | Type | Count |
|----------|------|-------|
| `ExamQuestion.clinicalPearl` | DB column | 1 per published question |
| `ExamQuestion.examStrategy` | DB column | 1 per published question |
| `ExamQuestion.clinicalReasoning` | DB column | 1 per published question |
| `ExamQuestion.keyTakeaway` | DB column | 1 per published question |
| `Flashcard.back` text | Embedded | ~8 pearls per flashcard |
| `PathwayLesson.sections` | Embedded JSON | Extracted by `extract-clinical-pearl-lines.ts` |
| `ExamQuestion.distractorRationales` JSON | Embedded | 1 per distractor option |

### Problem
The same clinical insight (e.g., "In COPD, target SpO2 88–92% to avoid hypercapnia") may appear in:
1. A question's `clinicalPearl` field
2. The associated flashcard's `back` text
3. The lesson section body
4. A distractor rationale for the same question

Updates to clinical guidance require finding and updating 4+ independent storage locations.

### What Should Happen
Clinical pearls should be a **first-class content entity** with a FK from `ExamQuestion`, `Flashcard`, and `PathwayLesson`:

```
CanonicalClinicalPearl {
  id
  text
  systemSlug
  blueprintCategory
  sourceQuestionId? FK → ExamQuestion
}
ExamQuestion.clinicalPearlId? FK → CanonicalClinicalPearl
Flashcard.clinicalPearlId? FK → CanonicalClinicalPearl
PathwayLesson section.pearlId? FK → CanonicalClinicalPearl
```

---

## Duplication in Blog Content

**Four independent blog content stores:**

1. **`BlogPost` DB model** — primary, pipeline-managed, has workflow states
2. **`src/content/blog-static-longtail/*.md`** — 4,700+ static markdown files, served directly at build time
3. **`src/content/blog-static-posts.json`** — older static JSON blog posts
4. **`nursenest-core/content/blog-legacy-export.json`** — Replit-era export

These are not unified — a given topic may have both a `BlogPost` DB row AND a static `.md` file at overlapping URLs. The blog is outside the educational content chain (Lesson → Question → Flashcard → Practice → CAT) and is documented here for completeness.

---

## Summary: What to Delete

| Item | Action | Risk | Prerequisite |
|------|--------|------|-------------|
| 17 `rn-nclex-*-expansion-catalog.json` files | Archive to `data/archived-catalogs/` | Low | Verify all slugs in DB |
| `Question` DB model + table | Drop | Medium | Verify no active reads |
| `generated_questions` table | Archive rows > 6 months, then drop | Low | Verify pipeline complete |
| `flashcard_bank` table | Drop if all rows `flashcard_enabled = false` | Medium | Audit enabled flags |
| `spaced_repetition_cards` table | Consolidate into `FlashcardProgress` | High | Data migration |
| `custom_practice_sessions` table | Drop | Low | Verify no active reads |
| `exam_attempts` (lowercase) table | Archive + drop | Medium | Verify no active reads |
| `analytics_events` table | Archive + migrate, then drop | High | Migration required |
| Client `cat-engine.ts` | Replace with shared package | Medium | Shared package required |
| `src/content/flashcard-samples.json` | Remove or move to tests | Low | Verify test usage only |
| `src/content/transfusion-safety-questions.json` | Verify static or import to `ExamQuestion` | Low | Audit active reads |
| Legacy `study_plan_schedule` rows | Archive or migrate to computed plan | Medium | Plan alignment required |

---

## Migration Plan: Toward Target Architecture

### Phase 1 — Safe Reads (2 weeks)
1. Add read-path logging to `Question`, `flashcard_bank`, `custom_practice_sessions`, `exam_attempts` tables
2. Confirm zero active traffic to these tables over 7 days
3. Audit `analytics_events` write paths — list every caller

### Phase 2 — Stop Writes (1 month)
4. Remove all write paths to `analytics_events` — route to `LearnerActivityEvent` only
5. Remove all write paths to `exam_attempts` (lowercase) — route to `PracticeTest`
6. Stop generating rows in `generated_questions` after promotion to `ExamQuestion`
7. Archive all expansion catalog JSON files to `data/archived-catalogs/`

### Phase 3 — Drop Orphans (2 months)
8. Drop tables: `questions`, `generated_questions`, `flashcard_bank`, `custom_practice_sessions`, `exam_attempts`
9. Remove `Lesson`, `Question`, `flashcard_bank`, `custom_practice_sessions`, `exam_attempts` from `prisma/schema.prisma`
10. Remove `Lesson`/`Question` FK from any remaining code references

### Phase 4 — Unify Remaining Parallels (3 months)
11. Consolidate `Exam`/`ExamSession` into `PracticeTest` — add `mode: 'timed_exam'` field
12. Extract shared CAT engine math into `packages/cat-engine-core/`
13. Introduce `CanonicalClinicalPearl` model — migrate `ExamQuestion.clinicalPearl` to FK
14. Unify blog stores — migrate `blog-static-posts.json` content to `BlogPost` DB rows

### Phase 5 — Long-Tail Architecture (6 months)
15. Remove cross-pathway lesson slug duplication from static catalogs
16. Enforce single-slug → single-DB-row invariant via CI test
17. Add `CanonicalClinicalPearl` FK to `Flashcard` and `PathwayLesson`
18. Retire `spaced_repetition_cards` — consolidate into `FlashcardMastery`
