# NurseNest — Question Quality Intelligence Engine

> **Status:** Architecture & data model review — pre-implementation
> **Generated:** 2026-05-28

---

## 1. What Already Exists

The codebase has a sophisticated foundation for question quality analysis.

| Component | File | Status |
|---|---|---|
| Item quality weight | `src/lib/questions/cat-item-quality-weight.ts` | ✅ Production |
| Clinical quality standards | `src/lib/questions/clinical-question-quality.ts` | ✅ Production |
| Distractor notes | `src/lib/questions/distractor-notes.ts` | ✅ Exists |
| Question diagnostics | `src/lib/questions/build-question-bank-diagnostics.ts` | ✅ Exists |
| Quality scores on model | `ExamQuestion.qualityScores`, `qualityFeedback`, `qualityScore` | ✅ Schema columns |
| Option aggregates | `ExamQuestionAnswerOptionAggregate` | ✅ selectionCount per option |
| Performance aggregates | `ExamQuestionPerformanceAggregate` | ✅ totalAttempts, correctAttempts |
| Candidate selection score | `src/lib/questions/cat-candidate-selection-score.ts` | ✅ Scoring for CAT |
| Clinical authenticity | `src/lib/questions/clinical-authenticity-standards.ts` | ✅ Standards checker |
| Clinical contradiction detection | `src/lib/questions/clinical-contradiction-detection.ts` | ✅ Contradiction checker |

---

## 2. Psychometric Metrics

For each question, we track five psychometric properties. Three are computable from real response data once ≥ 50 attempts exist; two are computed from the question structure itself.

### 2a. Difficulty (p-value)

```
difficulty = correctAttempts / totalAttempts
```

| Range | Label |
|---|---|
| 0.00–0.30 | Very Difficult |
| 0.30–0.50 | Difficult |
| 0.50–0.70 | Moderate |
| 0.70–0.85 | Easy |
| 0.85–1.00 | Very Easy |

**Target range for exam-quality items:** 0.30–0.85.
Items outside this range are flagged for review.

### 2b. Discrimination Index

Measures whether the item distinguishes between high and low performers.

```
discrimination = (pHigh - pLow)

where:
  pHigh = % correct among learners in top 27% of overall performance
  pLow  = % correct among learners in bottom 27% of overall performance
```

| Value | Interpretation |
|---|---|
| ≥ 0.40 | Excellent |
| 0.30–0.39 | Good |
| 0.20–0.29 | Acceptable |
| 0.10–0.19 | Marginal — review |
| < 0.10 | Poor — flag for revision |
| Negative | Misleading — flag immediately |

**Note:** Computing true discrimination requires cohort segmentation. This is done in the nightly aggregate job using `LearnerReadinessSnapshot` scores to define the top/bottom 27%.

### 2c. Distractor Performance

For each incorrect option, we track:
- **Plausibility score:** % of learners who selected this distractor
- **Target range:** 10–40% per distractor (sum of wrong options ≈ 1 - p-value)

**Auto-flag triggers:**
- Any distractor selected by < 5% of learners → "non-functional distractor"
- Any distractor selected by > 60% of learners → "misleading distractor / possible answer key error"
- Correct answer selected by 0% of learners → "answer key error — immediate flag"

### 2d. Confidence Distribution (future — when confidence data is collected)

If learners rate their confidence per answer (e.g., 1–5), we track:
- Mean confidence on correct answers (high = good question clarity)
- Mean confidence on incorrect answers (low = good distractor quality)

Not implemented in data collection yet — tracked here for future planning.

### 2e. Structural Quality Score

Computed from the question text itself without response data. Uses existing quality scoring infrastructure:

| Check | Flag Condition |
|---|---|
| Stem length | < 20 words (too short, likely trivial) |
| Double negatives | "not...not" pattern detected |
| Absolute language | "always" / "never" in distractors |
| Option length parity | One option 3× longer than average → likely correct (test-taking tip giveaway) |
| Clinical authenticity | `clinical-authenticity-standards.ts` check |
| Contradiction | `clinical-contradiction-detection.ts` check |

---

## 3. Auto-Flag System

When a question meets one or more flag criteria, it is added to the admin review queue automatically.

### Flag Types and Triggers

| Flag | Trigger | Severity |
|---|---|---|
| `too_easy` | p-value > 0.90 AND totalAttempts ≥ 100 | Low |
| `too_difficult` | p-value < 0.20 AND totalAttempts ≥ 100 | Medium |
| `poor_discrimination` | discrimination < 0.10 AND totalAttempts ≥ 100 | High |
| `negative_discrimination` | discrimination < 0 AND totalAttempts ≥ 50 | Critical |
| `non_functional_distractor` | any option < 5% selection AND totalAttempts ≥ 100 | Low |
| `misleading_distractor` | any incorrect option > 60% selection | Critical |
| `answer_key_error` | correct option 0% selection AND totalAttempts ≥ 20 | Critical |
| `structural_quality` | structural quality score < 60 | Medium |
| `clinical_authenticity` | authenticity check fails | Medium |
| `contradiction_detected` | contradiction check fires | High |
| `low_educational_value` | p-value > 0.92 OR discrimination < 0.05 | Medium |

### Critical Flags → Immediate Action

Questions with `negative_discrimination`, `misleading_distractor`, or `answer_key_error` are:
1. Immediately removed from active CAT pools (`isAdaptiveEligible = false`)
2. Removed from mock exam pools (`isMockExamEligible = false`)
3. Added to admin review queue with `severity: "critical"` and `requiresImmediateReview: true`

This happens in the nightly quality compute job or in real-time when triggered by a score anomaly.

---

## 4. Data Model

### New Models Required

```prisma
/// * Per-question psychometric summary. Recomputed nightly when totalAttempts changes.
model QuestionPsychometricSummary {
  questionId          String    @id @map("question_id") @db.VarChar
  // Attempt counts
  totalAttempts       Int       @default(0) @map("total_attempts")
  // Psychometric metrics
  pValue              Float?    @map("p_value")              // correctAttempts / totalAttempts
  discriminationIndex Float?    @map("discrimination_index") // top27 - bottom27
  // Per-distractor summary JSON: { optionKey: { selectionRate, isNonFunctional, isMisleading } }
  distractorSummary   Json?     @map("distractor_summary")
  // Structural quality score (0–100)
  structuralScore     Int?      @map("structural_score")
  // Flags (array of flag type strings)
  activeFlags         String[]  @default([]) @map("active_flags")
  highestSeverity     String?   @map("highest_severity") @db.VarChar(16)
  // Review queue status
  inReviewQueue       Boolean   @default(false) @map("in_review_queue")
  reviewQueuedAt      DateTime? @map("review_queued_at")
  computedAt          DateTime  @map("computed_at")

  @@map("question_psychometric_summaries")
}

/// * Admin review queue entry for flagged questions.
model QuestionQualityReviewItem {
  id                      String    @id @default(cuid())
  questionId              String    @map("question_id") @db.VarChar
  flagTypes               String[]  @map("flag_types")
  highestSeverity         String    @map("highest_severity") @db.VarChar(16) // low | medium | high | critical
  requiresImmediateReview Boolean   @default(false) @map("requires_immediate_review")
  // Review state
  status                  String    @default("pending") @db.VarChar(24) // pending | in_review | resolved | dismissed
  assignedToAdminId       String?   @map("assigned_to_admin_id")
  resolvedAt              DateTime? @map("resolved_at")
  resolutionNote          String?   @map("resolution_note") @db.Text
  // Auto-actions taken
  disabledFromCat         Boolean   @default(false) @map("disabled_from_cat")
  disabledFromMock        Boolean   @default(false) @map("disabled_from_mock")
  createdAt               DateTime  @default(now()) @map("created_at")
  updatedAt               DateTime  @updatedAt @map("updated_at")

  @@index([status, highestSeverity])
  @@index([questionId])
  @@map("question_quality_review_items")
}
```

---

## 5. Computation Pipeline

### Nightly Quality Job

```
POST /api/cron/compute-question-quality (protected, CRON_SECRET)

1. Load all published questions with ≥ 50 total attempts
   (join ExamQuestionPerformanceAggregate + ExamQuestionAnswerOptionAggregate)

2. For each question:
   a. Compute p-value = correctAttempts / totalAttempts
   b. Compute distractor rates = selectionCount / totalAttempts per option
   c. Compute discrimination index (requires cohort segmentation — see below)
   d. Run structural quality checks (existing files)
   e. Evaluate all flag conditions
   f. Upsert QuestionPsychometricSummary

3. For newly flagged questions (not previously flagged):
   a. Insert QuestionQualityReviewItem
   b. If critical: SET isAdaptiveEligible=false AND isMockExamEligible=false on ExamQuestion

4. Emit nn_quality_job_complete event:
   { questionsAnalyzed, newFlags, criticalFlags, autoDisabled }
```

### Discrimination Index Computation

Requires knowing each learner's relative performance rank. Uses pre-computed data:

```
1. Load LearnerReadinessSnapshot for all learners in pathway
2. Sort by score → define top 27% and bottom 27% cohorts
3. For each question in the flagged set:
   a. top27Answers = ExamQuestionPracticeAnswerAttempt WHERE
        userId IN (top27 userIds) AND questionId = ?
   b. bot27Answers = ... (bottom 27% userIds)
   c. pHigh = correct in top27 / total in top27
   d. pLow  = correct in bot27 / total in bot27
   e. discrimination = pHigh - pLow
```

This is a heavier query — run only for questions where p-value or discrimination has changed significantly (change > 0.05).

---

## 6. Admin Review Dashboard

**Route:** `/admin/question-quality`

### Queue View

```
┌──────────────────────────────────────────────────────────────────┐
│  QUESTION QUALITY REVIEW QUEUE                   24 items        │
│                                                                  │
│  Filter: [All] [Critical] [High] [Medium] [Low]                  │
│                                                                  │
│  ● CRITICAL (3)                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Q#abc123  answer_key_error + misleading_distractor          │ │
│  │ "A patient with hyperkalemia..."  RN • Pharmacology          │ │
│  │ p=0.02, 847 attempts  [Auto-disabled from CAT]              │ │
│  │                              [Review] [Dismiss]             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ● HIGH (7)                                                      │
│  ...                                                             │
└──────────────────────────────────────────────────────────────────┘
```

### Question Detail View

For each flagged question, show:
- Question stem + options
- Correct answer highlighted
- Flag descriptions with supporting data
- Distractor performance chart (bar chart: % selected each option)
- Difficulty trend over time (line chart: p-value vs. date)
- Discrimination index value
- Comparison to pathway average p-value
- Resolution actions: Edit Question / Dismiss Flag / Disable / Archive

---

## 7. API Endpoints

```
GET  /api/admin/question-quality?status=pending&severity=critical
     → list of QuestionQualityReviewItem with question previews

GET  /api/admin/question-quality/{questionId}/psychometrics
     → full QuestionPsychometricSummary + distractor breakdown + trend history

PATCH /api/admin/question-quality/{reviewItemId}
     body: { status, resolutionNote }
     → update review status

GET  /api/admin/question-quality/metrics
     → { totalFlagged, criticalCount, avgPValue, avgDiscrimination, autoDisabledCount }
```

---

## 8. Implementation Plan

### Phase A — Psychometric Computation (2 days)
1. `src/lib/questions/compute-question-psychometrics.ts` — p-value, distractor rates, flag evaluation
2. Prisma migration: `QuestionPsychometricSummary` + `QuestionQualityReviewItem`
3. `POST /api/cron/compute-question-quality` job

### Phase B — Auto-Disable on Critical Flags (1 day)
1. Wire critical flag → `ExamQuestion` update (`isAdaptiveEligible=false`)
2. Add to nightly cron schedule

### Phase C — Admin Review UI (2–3 days)
1. Quality review queue page
2. Question detail psychometrics view
3. Distractor performance chart (Recharts bar chart)
4. Resolution workflow (approve/dismiss/archive)

---

## 9. Acceptance Criteria

- [ ] p-value computed from `ExamQuestionPerformanceAggregate` (no raw attempt query for routine cases)
- [ ] Questions with `answer_key_error` flag are automatically set `isAdaptiveEligible=false` within the same nightly job run
- [ ] Admin review queue shows correct flag counts per severity
- [ ] No flagged question enters production CAT pools without admin review when `highestSeverity = critical`
- [ ] Discrimination index is computed only when totalAttempts ≥ 100 (insufficient data returns `null`, not `0`)
- [ ] Distractor performance chart shows all options with selection rate, not just flagged ones
- [ ] TypeScript strict mode — no `any`
