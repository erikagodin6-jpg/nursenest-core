# NurseNest — Peer Benchmarking System

> **Status:** Architecture & data model review — pre-implementation
> **Generated:** 2026-05-28

---

## 1. What Already Exists

| Component | File / Model | Status |
|---|---|---|
| Per-question aggregate | `ExamQuestionPerformanceAggregate` | ✅ totalAttempts, correctAttempts |
| Per-option aggregate | `ExamQuestionAnswerOptionAggregate` | ✅ selectionCount per option |
| Peer analytics builder | `src/lib/questions/question-peer-analytics.ts` | ✅ Exists — verify fields |
| Localized analytics | `src/lib/questions/localized-question-analytics.ts` (likely) | ✅ Check |

The `ExamQuestionPerformanceAggregate` and `ExamQuestionAnswerOptionAggregate` tables already collect anonymous aggregate data at the question level. The benchmarking system uses these plus computed cohort statistics.

---

## 2. Privacy Guarantees

**Absolute constraints — these are non-negotiable:**

1. No individual learner data is ever exposed in benchmarking views
2. Cohort statistics are only displayed when the cohort contains ≥ **50 learners** (not 100 — smaller cohorts are less likely to allow re-identification at 50)
3. All percentile calculations are based on **score aggregates**, never raw user rows
4. No learner-to-learner linking — you cannot determine if a specific person is in a cohort
5. Benchmarking data is computed offline in aggregate tables, never computed live from `User` rows

**Implementation enforcement:** The benchmark query layer never touches the `User` table directly. It reads from pre-aggregated cohort stat tables only.

---

## 3. Cohort Definitions

Cohorts are the units of comparison. A learner's benchmarking result is always relative to a specific cohort.

| Cohort Type | Example | Min Size |
|---|---|---|
| pathway + country | "RN learners in Canada" | 50 |
| pathway only | "All RN learners" | 50 |
| pathway + tier | "RN subscribers" | 50 |
| question-level | "All learners who attempted this question" | 50 |

Cohorts fall back gracefully: if the narrowest cohort (pathway + country) has < 50 learners, the system falls back to the next broader cohort. If no cohort reaches 50, no benchmark is shown.

---

## 4. What Learners See

### In-Question Peer Feedback (post-answer)

Shown immediately after a learner answers a question:

```
"64% of learners chose the same answer. This question is challenging for most."
```
```
"You got this right. Only 31% of learners answered correctly."
```
```
"This was answered correctly by 89% of learners."
```

**Source:** `ExamQuestionPerformanceAggregate.correctAttempts / totalAttempts`
**Display threshold:** ≥ 50 total attempts on the question
**No user identity**: the percentage is from the aggregate table, not a query against individual users

### In-Session Result Benchmark

Shown on the practice session results page:

```
"You performed better than 73% of RN learners."
```

**Source:** Learner's session accuracy vs. cohort accuracy distribution
**Cohort:** All learners who completed sessions in the same pathway within the last 90 days

### Readiness Score Percentile

Shown on the readiness dashboard:

```
"Your readiness score of 74 is higher than 68% of NCLEX-RN candidates in Canada."
```

**Source:** `LearnerReadinessSnapshot` → anonymized cohort distribution (pre-aggregated)

### Topic Difficulty Label

Shown in topic performance breakdowns:

```
"Pharmacology is a challenging topic for most learners."
"Respiratory assessment is a strength area for most RN candidates."
```

**Source:** Cohort average accuracy by topic (from `ExamQuestionPerformanceAggregate` joined to `ExamQuestion.topic`)
**Threshold:** Topic classified as "challenging" if cohort accuracy < 60%, "strength" if > 75%

---

## 5. Data Model

### New Models Required

```prisma
/// * Pre-aggregated cohort statistics. Recomputed nightly.
/// * Never stores user IDs — only statistical summaries.
model CohortPerformanceStat {
  id              String    @id @default(cuid())
  // Cohort definition
  pathwayId       String    @map("pathway_id") @db.VarChar(64)
  countryCode     String?   @map("country_code") @db.VarChar(8)
  tierCode        String?   @map("tier_code") @db.VarChar(16)
  // What this stat describes
  dimension       String    @db.VarChar(32)   // "overall" | "topic:{slug}" | "system:{tag}"
  // Statistical summary (no individual data)
  cohortSize      Int       @map("cohort_size")
  meanScore       Float     @map("mean_score")
  medianScore     Float     @map("median_score")
  p25Score        Float     @map("p25_score")  // 25th percentile
  p75Score        Float     @map("p75_score")  // 75th percentile
  p90Score        Float     @map("p90_score")  // 90th percentile
  // Bucket distribution: 0–10, 10–20, ..., 90–100
  scoreBuckets    Json      @map("score_buckets")  // Record<string, number>
  computedAt      DateTime  @map("computed_at")

  @@unique([pathwayId, countryCode, tierCode, dimension])
  @@index([pathwayId, dimension])
  @@map("cohort_performance_stats")
}

/// * Per-question difficulty classification. Recomputed nightly from aggregates.
model QuestionDifficultyClassification {
  questionId        String    @id @map("question_id") @db.VarChar
  cohortSize        Int       @map("cohort_size")
  cohortAccuracy    Float     @map("cohort_accuracy")
  difficultyLabel   String    @map("difficulty_label") @db.VarChar(16)
  // easy | moderate | challenging | very_challenging
  computedAt        DateTime  @map("computed_at")

  @@map("question_difficulty_classifications")
}
```

### Existing Models Used (read-only)

| Model | Usage |
|---|---|
| `ExamQuestionPerformanceAggregate` | Source for question-level benchmarks |
| `ExamQuestionAnswerOptionAggregate` | Source for distractor performance |
| `LearnerReadinessSnapshot` | Source for readiness percentile computation |

---

## 6. Benchmark Computation Pipeline

### Nightly Aggregate Job

```
POST /api/cron/compute-benchmarks (protected, CRON_SECRET)

1. For each active pathway:
   a. Load all LearnerReadinessSnapshot for learners active in last 90 days
   b. Group by (pathwayId, countryCode, tierCode)
   c. For each cohort group with size ≥ 50:
      - Compute mean, median, p25, p75, p90
      - Compute score bucket distribution (10 buckets)
      - Upsert CohortPerformanceStat WHERE dimension='overall'
   d. Repeat for each topic/system dimension

2. For each ExamQuestion with ≥ 50 attempts:
   a. accuracy = correctAttempts / totalAttempts
   b. difficultyLabel = classify(accuracy)
   c. Upsert QuestionDifficultyClassification

Duration estimate: < 5 minutes for 10,000 learners
```

### Percentile Lookup (Fast Path)

When a learner requests their benchmark, we don't re-query all users. We use the pre-computed `scoreBuckets` to do an O(10) bucket scan:

```typescript
function computePercentile(score: number, buckets: Record<string, number>): number {
  // buckets: { "0-10": 12, "10-20": 34, ... "90-100": 89 }
  // Find what percentage of the cohort scored below this learner's score
  const totalLearners = Object.values(buckets).reduce((s, v) => s + v, 0);
  let scoredBelow = 0;
  for (const [range, count] of Object.entries(buckets)) {
    const [low, high] = range.split("-").map(Number);
    if (high! <= score) scoredBelow += count;
    else if (low! < score) scoredBelow += count * ((score - low!) / (high! - low!));
  }
  return Math.round((scoredBelow / totalLearners) * 100);
}
```

---

## 7. API Endpoints

```
GET  /api/learner/benchmarks?pathway=rn&country=CA
     → { overall: { percentile, cohortSize, cohortLabel }, topicBreakdown: {...} }
     → returns null percentile if cohort < 50

GET  /api/questions/{questionId}/benchmark
     → { cohortAccuracy, difficultyLabel, cohortSize, sampleMessage }
     → returns null if < 50 attempts

GET  /api/learner/benchmarks/topic?pathway=rn&topic=pharmacology
     → { learnerAccuracy, cohortAccuracy, difficultyLabel, percentile }
```

---

## 8. UI Patterns

### Post-Answer Benchmark Widget

```tsx
// Shown below the rationale after answering
<QuestionBenchmark
  cohortAccuracy={0.64}
  isCorrect={true}
  cohortSize={1240}
/>
// Renders: "You got this right. 64% of learners answered correctly."
```

### Readiness Benchmark Card

```tsx
<ReadinessBenchmark
  learnerScore={74}
  percentile={68}
  cohortLabel="NCLEX-RN candidates in Canada"
  cohortSize={892}
/>
// Renders: "Your score of 74 is higher than 68% of NCLEX-RN candidates in Canada."
```

### Topic Difficulty Badge

```tsx
<TopicDifficultyBadge
  accuracy={0.42}
  difficultyLabel="challenging"
/>
// Renders: "Most learners find this topic challenging"
```

---

## 9. Implementation Plan

### Phase A — Question-Level Benchmarks (2 days)
1. `ExamQuestionPerformanceAggregate` is already populated — verify it's being updated on every answer
2. `src/lib/benchmarks/question-difficulty-classifier.ts` — accuracy → label
3. Nightly job to populate `QuestionDifficultyClassification`
4. `GET /api/questions/{id}/benchmark` endpoint
5. Post-answer benchmark widget in question UI

### Phase B — Cohort Score Benchmarks (2–3 days)
1. Prisma migration: `CohortPerformanceStat` table
2. `src/lib/benchmarks/cohort-stat-builder.ts` — nightly aggregate computation
3. `src/lib/benchmarks/percentile-lookup.ts` — bucket-based percentile
4. `GET /api/learner/benchmarks` endpoint
5. Readiness benchmark card on readiness page

### Phase C — Cron Integration (1 day)
1. `POST /api/cron/compute-benchmarks` endpoint
2. Add to nightly cron schedule (after readiness compute cron)

---

## 10. Acceptance Criteria

- [ ] Benchmark percentile is never shown when cohort < 50 learners
- [ ] No SQL query in the benchmark read path touches the `User` table directly
- [ ] Post-answer benchmark appears only when question has ≥ 50 attempts
- [ ] Benchmark widget shows 0 decimal places on percentages ("73%" not "73.4%")
- [ ] Cohort label accurately describes the cohort ("RN learners in Canada" not generic "learners")
- [ ] TypeScript strict mode — no privacy-related data in `BenchmarkResponse` shapes
- [ ] Nightly compute job completes in < 10 minutes for expected scale
