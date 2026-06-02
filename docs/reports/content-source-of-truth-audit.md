# Content Source of Truth Audit

**Generated:** 2026-06-01  
**Method:** Schema analysis, static file inventory, codebase tracing, live DB queries  
**Scope:** All educational content surfaces across the NurseNest platform

---

## Architecture Overview

Content flows through a layered hierarchy. The canonical source is always the database row; static files and caches are read-fallbacks only. The system has accumulated significant divergence from this ideal — several content types have no single canonical source and are stored in 3–5 independent locations.

```
Generation (AI / script / manual)
  ↓
Static catalog JSON files  ←── authoring / staging
  ↓ (import scripts)
Database (PostgreSQL via Prisma)  ←── canonical published source
  ↓ (nightly snapshot export)
Filesystem snapshots (STUDY_PUBLISHED_SNAPSHOT_DIR)
  ↓ (on read)
Redis (in-memory, 2–120 min TTL)
  ↓ (on Redis miss)
Snapshot file read
  ↓ (on snapshot miss)
Live DB query
```

---

## 1. Lessons

### Canonical Source
**`PathwayLesson` (DB table `pathway_lessons`)** — rich structured model with `sections` JSON, `status`, `pathwayId`, `canonicalTopicId`. This is the single authoritative source for published lesson content.

### Derived Sources
- `CanonicalTopicSharedSection` — reusable clinical foundation blocks shared across multiple `PathwayLesson` rows for the same topic. Injected at read time by the section assembler.
- `scoped-gold-registry.ts` — TypeScript-hardcoded "gold standard" lessons (COPD, ACS, fluids/electrolytes, etc.) prepended to hub lists programmatically. These resolve to full DB rows by slug; the registry is the routing layer, not the content store.
- `src/lib/lessons/fnp-us-lesson-enrichment.ts` — additional in-code lesson enrichment for FNP pathway.

### Cache Sources
Three-layer manifest loader (`manifest-loader.ts`):
1. **Redis** — TTL varies by loader; lesson list typically 2 min
2. **Filesystem snapshot** — `STUDY_PUBLISHED_SNAPSHOT_DIR/lessons/` (nightly export)
3. **Live DB** — fallback; writes result back to Redis

### Fallback Sources (DB unavailable)
- `lessons-list-catalog-fallback.ts` — reads from `getCatalogPathwayLessonsSync()`, which merges static catalog JSON. Labelled `source_used: "tertiary"`.
- `app-lessons-hub-published-snapshot-fallback.ts` — reads filesystem snapshot directly.

### Static Authoring Inputs (pre-DB)
21 distinct catalog JSON files in `src/content/pathway-lessons/`:
- `catalog.json` — 576 lessons across 5 pathways (12 MB)
- 17 expansion catalogs (`rn-nclex-*-expansion-catalog.json`) — 44–86 lessons each
- `np-parity-expansion-catalog.json` — 830 lessons (FNP + CNPLE source)
- `rpn-rex-pn-parity-expansion-catalog.json` — 328 lessons
- `new-grad-transition-catalog.json` — 40 lessons

Total unique slugs across all static files: **1,845**. DB has significantly more (pathway-specific counts 1,400–1,600+) because expansion catalogs have been imported.

### What Should Be Deleted
- Expansion catalog JSON files can be archived after confirmed DB import. They are not read at runtime for serving content — only by import scripts and the tertiary fallback. `rn-nclex-catalog-import-state.json` tracks which runs have completed.
- `src/content/lessons/lesson-library.json` — verify whether actively used or superseded by `PathwayLesson`.

---

## 2. Questions

### Canonical Source
**`ExamQuestion` (DB table `exam_questions`)** — rich model with IRT fields, diagnostic rationale, multi-format options, tags, body system, blueprint category, adaptive eligibility. All CAT sessions, practice tests, and question bank surfaces draw exclusively from this table.

### Derived Sources
- `ExamQuestionPerformanceAggregate` — per-question response statistics derived from `ExamQuestionPracticeAnswerAttempt` rows. Updated on session completion.
- `question-peer-analytics.ts` — computes class-vs-learner comparison statistics on demand.
- `unified_question_history` (legacy lowercase table) — flattened per-user question attempt history, derived from `ExamQuestionPracticeAnswerAttempt`.

### Cache Sources
- **Redis** — question bank pool (discovery aggregates), TTL 60 min
- **Filesystem snapshot** — `study-published-snapshot/questions/discovery-{TIER}-{COUNTRY}-{PATHWAY}.json` (nightly)
- **Live DB** — on cache miss

### Fallback Sources
- `practice-test-question-static-fallback.server.ts` — serves a minimal static set when both Redis and snapshot miss
- `cat_emergency_fallback_banks` (DB table) — last-resort CAT item bank used when the primary pool is below floor

### Static Authoring Inputs (pre-DB, not served at runtime)
- `src/content/transfusion-safety-questions.json` — legacy static questions (verify active/inactive)
- `client/src/data/career-questions/` — client-side JSON questions

### Legacy Models (orphaned)
- **`Question` model** (DB table `questions`) — simpler schema, linked to `Lesson`. Still in Prisma schema. Not used by CAT, practice tests, or question bank. Content source for the legacy Replit-era system.
- **`generated_questions` table** — raw AI generation output before promotion. Intermediate, not served directly.
- **`GeneratedLessonDraft` / `GeneratedFlashcardDraft`** — AI draft holding tables before admin promotion.

---

## 3. Flashcards

### Canonical Source
**`Flashcard` + `FlashcardDeck` + `FlashcardOption` (DB tables)** — modern model with `status`, `tier`, `examFamily`, `pathwayId`, spaced repetition support, `sourceKey` for deduplication. `FlashcardDeck` is the grouping unit; `Flashcard` rows belong to a deck.

### Derived Sources
- `FlashcardMastery` — per-user mastery state computed from `FlashcardProgress` and `FlashcardAttempt` responses.
- `FlashcardUserStats` — aggregated stats per user per card.
- `self-healing-flashcard-session-cache.ts` — rebuilds session state from DB when client cache is stale.

### Cache Sources
Three layers for inventory and session:
1. **Redis** — inventory counts, deck metadata
2. **Filesystem snapshot** — `flashcards/hub-bootstrap-{country}-{tier}.json`, `flashcards/list-{country}-{tier}.json`
3. **Live DB** — on miss

Client-side:
- `client/src/lib/flashcard-cache.ts` — in-browser session cache (Replit-era client)

### Fallback Sources
- `build-flashcard-catalog-fallback-session.ts` — generates a fallback session from static catalog JSON when DB and snapshots are unavailable
- `flashcard-session-static-fallback.server.ts` — serves static flashcard data

### Legacy Models (to be deprecated)
- **`flashcard_bank` table** — separate legacy lowercase model with different schema (flat `front`/`back`, no `FlashcardDeck` relationship). Still has `flashcard_enabled` boolean column. Not the same content as `Flashcard`. Unclear if actively served.
- **`spaced_repetition_cards` table** — standalone spaced-repetition system, separate from `FlashcardProgress`. Potential duplicate of the mastery tracking built into the modern Flashcard model.
- **`src/content/flashcard-samples.json`** — static sample set.

---

## 4. Practice Exams

### Canonical Source
**`PracticeTest` (DB table `practice_tests`)** — session record with `config`, `questionIds`, `adaptiveState`, `status`. This is the live session object for both adaptive (CAT) and timed practice.

For exam presets (pre-configured 85-question exams), the canonical definition is the **`exam-preset-{pathway}-launch-NNN` tag** on `ExamQuestion` rows. The `Exam` table rows (title, country, tier) serve as the label; actual question selection happens via tag query.

### Derived Sources
- `results` JSON field on `PracticeTest` — computed score, topic breakdown, weak areas. Set on completion.
- `adaptiveState` JSON field — IRT theta, SE, discrimination history for CAT sessions.
- `ExamAttempt` — linked to `ExamSession`, records final score.

### Cache Sources
- `practice-tests-hub-bootstrap-snapshot-read.ts` — reads hub pathway options from snapshot
- `practice-exams-published-snapshot-read.ts` — reads exam list from snapshot
- Redis via manifest loader — TTL 60 min

### Legacy Models (parallel system)
- **`Exam` + `ExamSession` + `ExamAttempt`** — a parallel timed-exam structure with its own session management. This is distinct from `PracticeTest`. Both are active. `ExamSession.examMode` distinguishes `linear` vs `cat`.
- **`exam_attempts` (legacy lowercase)** — original Replit-era attempt log with `questions_payload`. Not the same as `ExamAttempt`.
- **`exam_load_incidents` table** — error tracking for this legacy system.
- **`custom_practice_sessions` table** — third session model; unclear relationship to `PracticeTest`.

---

## 5. CAT (Computerized Adaptive Testing)

### Canonical Source
**`PracticeTest.adaptiveState` JSON field** — live IRT state: theta estimate, standard error, item history, stop reason. Updated after every item response.

The **question pool** is drawn from `ExamQuestion` filtered by `isAdaptiveEligible = true`, `status = published`, and pathway tags. There is no separate "CAT pool" table — the adaptive pool is a runtime query against the main question store.

### Derived Sources
- `ExamQuestionPerformanceAggregate` — item-level response statistics used to compute observed difficulty and discrimination. Feeds back into CAT engine item selection.
- `readiness_history` (lowercase table) — per-user readiness score history derived from CAT theta.
- Pathway-scoped reports: readiness score snapshots stored in `learner_activity_audit_snapshots`.

### Cache Sources
- `cat-practice-readiness.ts` — in-memory pool validation check
- Manifest loader: Redis → snapshot → live DB for pool counts

### Fallback Sources
- `cat_emergency_fallback_banks` — pre-exported CAT item bank per pathway. Read when live pool query fails.
- CAT engine resilience: `server/cat-resilience-extension.ts` + `server/cat-exam-resilience.ts`

### Architectural Issue
Two CAT engine implementations exist:
- **`server/cat-engine.ts`** — server-side engine used by API routes
- **`client/src/lib/cat-engine.ts`** — client-side engine (Replit-era)

These must remain in sync on IRT algorithm parameters (initial theta, step sizes, stop criteria). Divergence = different session behavior for same learner depending on which engine processes the response.

---

## 6. Cases (Clinical Scenarios)

### Canonical Source
**Split — no single canonical source.** Cases exist in three independent locations:

1. **`OsceStation` (DB table `osce_stations`)** — structured OSCE clinical cases with ordered task steps, clinical reasoning prompts, debrief sections. Primary for OSCE surface.
2. **`ClinicalScenarioSimulationRun` (DB table)** — CNPLE LOFT simulation run records. The case content itself is derived from pathway lessons at session start.
3. **Static: `src/content/clinical-case-studies.json`** — flat case study JSON, not linked to DB.

### Derived Sources
- Case content for CNPLE LOFT: assembled from `PathwayLesson` sections at session start. Cases are not stored independently — they are runtime assemblies.
- `src/lib/lessons/scoped-lessons/case-study-casebook-specs.ts` — TypeScript-hardcoded case study specifications for the casebook feature.
- `src/lib/clinical-scenarios/branching-clinical-scenarios-catalog.ts` — branching scenario catalog (static TypeScript).

### What Needs Consolidation
The LOFT simulation case source is `PathwayLesson` (derived). The OSCE case source is `OsceStation` (DB). Static cases in JSON and TypeScript are a third system. These three systems share no schema and cannot be queried together.

---

## 7. Clinical Pearls

### Canonical Source
**`ExamQuestion.clinicalPearl` column** — the single published location for clinical pearls associated with a question. Also stored in `ExamQuestion.examStrategy`, `ExamQuestion.clinicalReasoning`, and `ExamQuestion.keyTakeaway` — four related but distinct fields on the same row.

### Derived Sources
- **`extract-clinical-pearl-lines.ts`** — extracts clinical pearl sentences from `PathwayLesson.sections` at render time. These are not stored separately — they are computed on every lesson render.
- `ExamQuestion.distractorRationales` JSON — contains embedded pearls per option.

### Static (Generation Input Only)
- `src/lib/content-factory/clinical-pearl-and-hint-database.ts` — defines pearl categories and targets for generation pipelines. Never read at runtime.

### Issue
Clinical pearls are not a standalone content entity. They are:
1. Fields on `ExamQuestion` (stored)
2. Extracted from lessons (computed)
3. Embedded in flashcard `back` text (duplicated)
4. Embedded in distractor rationales (duplicated)

No deduplication exists between these four locations. The same clinical pearl may appear identically in a question field, a lesson section, a flashcard back, and a distractor rationale.

---

## 8. Study Plans

### Canonical Source
**Computed at request time** by `buildCognitionIntegratedStudyPlan()` from:
- `UserTopicStat` — per-user topic performance
- `ExamQuestionPracticeAnswerAttempt` — raw response history
- `PracticeTest.results` — completed session summaries

There is **no stored study plan document**. The plan is assembled on every `/app/study-plan` page load.

### Persisted Supporting Data
- `student_study_profiles` (legacy lowercase table) — stored study preferences and exam date settings
- `study_plan_schedule` (lowercase table) — legacy scheduled study plan rows
- `study_milestones` (lowercase table) — legacy milestone definitions
- `exam_planner_settings` (lowercase table) — exam date + daily study goal

### Issue
The computed study plan and the legacy stored plan (`study_plan_schedule`) are parallel systems with no link. A user may have stale rows in `study_plan_schedule` from the Replit era that are never read by the current computation engine.

---

## 9. Analytics

### Canonical Source
**`LearnerActivityEvent` (DB table `learner_activity_events`)** — modern structured event log. Primary source for learner analytics.

Supporting aggregates:
- `ExamQuestionPerformanceAggregate` — canonical per-question difficulty and discrimination data
- `UserTopicStat` — canonical per-user topic performance

### Derived Aggregates
- `accuracy_trends` (lowercase) — rolling accuracy trends derived from events
- `benchmark_profiles` (lowercase) — peer benchmark derived from aggregated performance
- `topic_mastery_scores` (lowercase) — mastery score per topic derived from `UserTopicStat`
- `readiness_history` (lowercase) — CAT readiness history derived from session completion
- `FeatureHealthSnapshot` — derived health snapshot for monitoring

### Snapshot/Export
- `data/snapshots/public_home_stats_snapshot.json` — nightly export of public-facing stats
- `data/snapshots/blog_index_snapshot.json` — blog analytics snapshot
- `LearnerActivityAuditSnapshot` — periodic learner profile snapshots

### Parallel Legacy System
- **`analytics_events` (lowercase table)** — original Replit-era event log. Different schema from `LearnerActivityEvent`. Both appear to be active. Events are written to both in some paths.

---

## Summary Table

| Content Type | Canonical Source | Cache | Fallback | Snapshot | Legacy/Orphaned |
|-------------|-----------------|-------|---------|---------|-----------------|
| Lesson | `PathwayLesson` DB | Redis | Static catalog JSON | Filesystem snapshots | `Lesson` DB model |
| Question | `ExamQuestion` DB | Redis | Static JSON + fallback bank | Filesystem snapshots | `Question` DB, `generated_questions` |
| Flashcard | `Flashcard`+`FlashcardDeck` DB | Redis | Static fallback session | Filesystem snapshots | `flashcard_bank`, `spaced_repetition_cards` |
| Practice Exam | `PracticeTest` DB | Redis | Snapshot | Filesystem snapshots | `Exam`/`ExamSession`, `exam_attempts`, `custom_practice_sessions` |
| CAT | `PracticeTest.adaptiveState` + `ExamQuestion` pool | Redis | `cat_emergency_fallback_banks` | — | Server+client engine split |
| Case | `OsceStation` DB | — | Static JSON | — | Static TS specs, `clinical-case-studies.json` |
| Clinical Pearl | `ExamQuestion.clinicalPearl` | — | — | — | Extracted from lessons, embedded in flashcards |
| Study Plan | Computed on request | — | — | — | `study_plan_schedule` (legacy, detached) |
| Analytics | `LearnerActivityEvent` DB | — | — | `data/snapshots/` | `analytics_events` (parallel legacy) |
