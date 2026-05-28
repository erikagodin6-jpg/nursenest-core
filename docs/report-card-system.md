# NurseNest — Report Card System

> **Status:** Architecture & data model review — pre-implementation
> **Generated:** 2026-05-28

---

## 1. What Already Exists

| Component | File / Model | Status |
|---|---|---|
| Readiness scoring | `readiness-scorer.ts` | ✅ Algorithm exists |
| Topic stat tracking | `UserTopicStat` | ✅ correct/wrong/streak |
| Flashcard streaks | `FlashcardUserStats` | ✅ currentStreak, cardsReviewedTotal |
| Exam attempt history | `ExamAttempt` | ✅ score, total, createdAt |
| Answer attempts | `ExamQuestionPracticeAnswerAttempt` | ✅ full answer history |
| Remediation events | `UserRemediationEvent` | ✅ mistakeType taxonomy |
| Peer analytics | `ExamQuestionPerformanceAggregate` | ✅ total/correct attempts per question |
| Readiness snapshots | (to be built — readiness-engine.md) | Planned |
| Performance summary API | `/api/performance-summary` | ✅ Exists — verify fields |

---

## 2. Report Card Types

### Weekly Report Card

Generated every Sunday at 23:59 UTC for all learners who studied during the week.

**Sections:**
1. **Overview** — Questions answered, time studied, readiness delta
2. **Knowledge** — L1 accuracy % (recall and recognition)
3. **Clinical Reasoning** — L3 accuracy % (action/decision)
4. **Safety** — High-risk topic accuracy
5. **Pharmacology** — Pharmacology system tag accuracy
6. **Clinical Judgment** — L2 accuracy % (interpretation)
7. **Question Volume** — Total answered vs. weekly goal
8. **Consistency** — Study days in week, streak status

### Monthly Report Card

Generated on the 1st of each month.

**Additional sections over weekly:**
- Readiness progression graph (4-week trend)
- Benchmark comparison (vs. peer cohort)
- Biggest improvement this month
- Persistent weak areas (topics with < 65% accuracy over 30 days)
- Exam timeline assessment (on track / behind / ahead)

### Exam Readiness Report

Generated on-demand or automatically 30/14/7 days before `User.examDate`.

**Focus:** Exam-specific gap analysis and final preparation recommendations.

---

## 3. Report Card Schema

```typescript
interface ReportCardSection {
  key: string;
  label: string;
  score: number;           // 0–100
  trend: "improving" | "stable" | "declining" | "insufficient_data";
  deltaFromLastPeriod: number | null;
  breakdown: Record<string, number>;  // e.g. { cardiovascular: 81, pharmacology: 42 }
  insights: string[];      // 1–3 plain-text insight sentences
}

interface ReportCard {
  id: string;
  userId: string;
  pathwayId: string;
  type: "weekly" | "monthly" | "exam_readiness";
  periodStart: string;     // ISO date
  periodEnd: string;       // ISO date
  overallScore: number;    // composite readiness score
  overallBand: string;     // "Near Ready" etc.
  sections: ReportCardSection[];
  benchmarkPercentile: number | null;  // 0–100, null if < 100 users in cohort
  studyStats: {
    questionsAnswered: number;
    flashcardsReviewed: number;
    lessonsOpened: number;
    studyDaysActive: number;
    estimatedMinutesStudied: number;
  };
  highlights: {
    topStrength: string | null;    // "Respiratory (91%)"
    topWeakness: string | null;    // "Pharmacology (42%)"
    biggestGain: string | null;    // "Cardiac +19% this week"
    streak: number;                // days
  };
  peerComparison: {
    percentile: number | null;
    cohortSize: number;
    cohortLabel: string;           // "RN learners in Canada"
  };
  recommendations: string[];       // 2–4 actionable next steps
  generatedAt: string;
}
```

---

## 4. Data Model

### New Models Required

```prisma
model LearnerReportCard {
  id                    String    @id @default(cuid())
  userId                String    @map("user_id")
  pathwayId             String    @map("pathway_id") @db.VarChar(64)
  type                  String    @db.VarChar(24)   // weekly | monthly | exam_readiness
  periodStart           DateTime  @map("period_start") @db.Date
  periodEnd             DateTime  @map("period_end") @db.Date
  overallScore          Int       @map("overall_score")
  overallBand           String    @map("overall_band") @db.VarChar(32)
  // Full report JSON (avoids wide column proliferation)
  reportJson            Json      @map("report_json")
  // Denormalized for list queries
  questionsAnswered     Int       @default(0) @map("questions_answered")
  studyDaysActive       Int       @default(0) @map("study_days_active")
  benchmarkPercentile   Int?      @map("benchmark_percentile")
  generatedAt           DateTime  @default(now()) @map("generated_at")
  viewedAt              DateTime? @map("viewed_at")
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, pathwayId, type, periodStart])
  @@index([userId, type, periodStart])
  @@index([userId, generatedAt])
  @@map("learner_report_cards")
}
```

---

## 5. Report Generation Algorithm

### Weekly Report Generation

```
function generateWeeklyReportCard(userId, pathwayId, weekEnd):

  periodStart = weekEnd - 7 days
  periodEnd   = weekEnd

  // Load answer attempts for this period
  answers = ExamQuestionPracticeAnswerAttempt WHERE
    userId = userId AND
    createdAt BETWEEN periodStart AND periodEnd
    JOIN ExamQuestion (cognitiveLevel, bodySystem, topic, difficulty)

  // Load previous period for delta
  prevAnswers = ... (prior 7 days)

  // Compute section scores
  knowledge = L1 accuracy from answers
  clinicalReasoning = L3 accuracy from answers
  safety = accuracy on questions WHERE bodySystem IN safety topics
  pharmacology = accuracy WHERE topic = "pharmacology"
  clinicalJudgment = L2 accuracy
  questionVolume = count(answers) / weeklyGoal × 100
  consistency = activeDays / 7 × 100

  // Compute deltas vs prev period
  knowledgeDelta = knowledge - prevKnowledge

  // Study stats
  studyStats.questionsAnswered = count(answers)
  studyStats.flashcardsReviewed = FlashcardAttempt count for period
  studyStats.lessonsOpened = (from analytics events, if tracked)
  studyStats.studyDaysActive = distinct(date(createdAt)) from answers

  // Benchmark
  cohort = RN learners in same country who studied this week
  percentile = percentRankInCohort(overallScore, cohort scores)

  // Recommendations
  recommendations = top 3 from UserRemediationQueue

  // Store LearnerReportCard
  upsert WHERE userId + pathwayId + type='weekly' + periodStart
```

### Section Score Computation

Each section score is on 0–100 and uses the same `computeReadinessScore()` engine but filtered to relevant question subsets:

| Section | Filter on ExamQuestion |
|---|---|
| Knowledge | `cognitiveLevel = "L1"` |
| Clinical Reasoning | `cognitiveLevel = "L3"` |
| Safety | `bodySystem IN ['safety', 'medication-safety', 'infection-control']` |
| Pharmacology | `topic = 'pharmacology' OR bodySystem = 'pharmacology'` |
| Clinical Judgment | `cognitiveLevel = "L2"` |
| Question Volume | `count(attempts) / goal × 100` (not accuracy-based) |
| Consistency | `activeDays / 7 × 100` |

---

## 6. Report Delivery

### Push Notification (when ready)

Weekly report cards are delivered as in-app notifications on Monday morning:
```
"Your Weekly Report Card is ready. You improved 6 points this week."
```

### Email Summary (optional future)

A condensed email version of the weekly report. Not in scope for Phase 1 implementation.

### In-App Report Card Feed

New page: `/app/progress/reports`

Shows:
- Latest weekly report card (expanded)
- Monthly report card (if available)
- Archive: past 12 weekly reports
- Archive: past 6 monthly reports

Each card is interactive with expandable sections.

---

## 7. API Endpoints

```
GET  /api/learner/reports?pathway=rn&type=weekly
     → list of LearnerReportCard (most recent first, limit 12)

GET  /api/learner/reports/{id}
     → full LearnerReportCard JSON

POST /api/learner/reports/{id}/viewed
     → sets viewedAt timestamp

POST /api/cron/generate-report-cards
     → generates weekly reports for all active learners
     → triggered Sunday 23:59 UTC, protected by CRON_SECRET
```

---

## 8. Trend Graphs

Each weekly report card includes sparkline data for the trend chart. Use existing **Recharts** (already installed). Data points are pulled from `LearnerReadinessSnapshot.score` for the section time range.

No new charting library needed.

```typescript
interface TrendDataPoint {
  date: string;       // ISO date
  score: number;      // 0–100
  label: string;      // "Week of May 19"
}
```

---

## 9. Implementation Plan

### Phase A — Report Generation Engine (2–3 days)
1. `src/lib/reports/generate-weekly-report-card.ts`
2. `src/lib/reports/generate-monthly-report-card.ts`
3. Prisma migration: `LearnerReportCard` table
4. `POST /api/cron/generate-report-cards` cron endpoint

### Phase B — Report API + UI (2–3 days)
1. `GET /api/learner/reports` list endpoint
2. `GET /api/learner/reports/{id}` detail endpoint
3. Reports feed page (`/app/progress/reports`)
4. Report card component with expandable sections

### Phase C — Trend Charts (1 day)
1. Trend chart component (Recharts line chart)
2. Wire to `LearnerReadinessSnapshot` history

---

## 10. Acceptance Criteria

- [ ] Weekly report cards are generated for all learners who answered ≥ 5 questions in the week
- [ ] Learners with zero activity receive no report card (no empty data cards)
- [ ] All 8 section scores are 0–100 with a trend indicator
- [ ] Delta vs previous period is shown for each section
- [ ] Benchmark percentile appears only when cohort ≥ 100 learners
- [ ] Report cards are viewable for at least 12 weeks of history
- [ ] Report JSON validates against the `ReportCard` TypeScript interface
- [ ] Mobile layout: all sections visible without horizontal scroll
