# NurseNest — AI Study Coach

> **Status:** Architecture & data model review — pre-implementation
> **Generated:** 2026-05-28

---

## 1. What This Is (And Is Not)

The AI Study Coach is a **rule-based recommendation engine** — not a generative AI chatbot. It produces deterministic, personalized coaching messages and study plans from learner performance data. No LLM calls are made during delivery; all coaching output is computed from structured data.

This design choice is intentional:
- Zero latency on delivery (pre-computed or computed in < 50ms from cached stats)
- Fully auditable (every recommendation has a traceable data source)
- No hallucination risk (content is grounded in real performance data)
- Works when AI services are unavailable

Optional future layer: An LLM can generate the coaching message *text* from structured data inputs, offline, and store the result. The delivery path remains purely data-driven.

---

## 2. What Already Exists

| Component | File | Status |
|---|---|---|
| CAT results coach | `src/lib/practice-tests/cat-results-coach.ts` | ✅ Post-session coaching messages |
| Enrich results coach | `src/lib/practice-tests/enrich-cat-results-coach.ts` | ✅ Message enrichment |
| Session analysis | `src/lib/cat/types.ts` → `SessionAnalysis` | ✅ weakAreas, lessonRecommendations |
| Autonomous remediation | `src/lib/questions/autonomous-remediation-orchestration.ts` | ✅ Queue-driven remediation |
| Remediation queue | `UserRemediationQueue` (Prisma) | ✅ priorityScore, nextReviewAt |
| Daily question goal | `User.dailyQuestionGoal`, `bankQuestionsGradedCount` | ✅ Daily tracking |
| Study goal | `User.studyGoal`, `dailyStudyMinutes` | ✅ User preference |
| Exam date | `User.examDate`, `examGoalSetAt` | ✅ Countdown support |
| Topic stats | `UserTopicStat` | ✅ per-topic accuracy + streak |

---

## 3. Coaching Messages

### Message Taxonomy

The coach produces four categories of messages per learner per day:

#### Category 1 — Progress Recognition
Delivered when a measurable improvement is detected.

```
"You improved 14% in pharmacology this week."
"Your cardiac accuracy went from 62% to 76% — that's real progress."
"You've answered 23 questions today. Your daily goal is 20. ✓"
"7-day study streak! Consistency is the biggest predictor of exam success."
```

**Data sources:** `UserTopicStat`, `FlashcardUserStats.currentStreak`, `User.bankQuestionsGradedCount`

#### Category 2 — Gap Identification
Delivered when a persistent weak area is detected.

```
"Cardiac medications remain your weakest topic (42% accuracy over 30 questions)."
"You've missed 8 of the last 10 prioritization questions. This is affecting your readiness score."
"Delegation questions are the most commonly missed type for RN learners. Focus here."
```

**Data sources:** `UserRemediationQueue`, `UserTopicStat.wrongStreak`, `UserTopicStat.wrongCount`

#### Category 3 — Action Directive
A specific, actionable task with an expected outcome.

```
"Complete 15 pharmacology flashcards today."
"Answer 10 priority + delegation questions this session."
"Read the Cardiac Medications lesson before attempting today's questions."
"Your readiness will increase approximately 2% if you complete today's plan."
```

**Data sources:** `UserRemediationQueue.nextReviewAt`, `FlashcardProgress.nextReviewAt`, `LearnerReadinessSnapshot`

#### Category 4 — Exam Countdown
Delivered when `User.examDate` is set.

```
"42 days until your NCLEX-RN. You're currently Near Ready (74/100)."
"At your current pace, you'll reach Exam Ready in approximately 18 days."
"You need 3% more in pharmacology to reach your readiness target."
```

**Data sources:** `User.examDate`, `LearnerReadinessSnapshot`, computed trajectory

---

## 4. Daily Study Plan Generation

### Plan Structure

```typescript
interface DailyStudyPlan {
  userId: string;
  pathwayId: string;
  date: string;               // ISO date (UTC)
  estimatedMinutes: number;
  readinessImpactEstimate: number;  // estimated +N% readiness if completed
  items: StudyPlanItem[];
  coachingMessages: CoachingMessage[];
  generatedAt: string;
}

interface StudyPlanItem {
  type: "questions" | "flashcards" | "lesson" | "review";
  title: string;
  description: string;
  estimatedMinutes: number;
  priority: "critical" | "high" | "medium";
  targetTopic: string;
  // routing
  href: string;
  // why this item was chosen
  reason: string;
  dataSource: string;         // human-readable: "Cardiac missed 8 of last 10"
}
```

### Plan Generation Algorithm

```
function buildDailyStudyPlan(userId, pathwayId, date):

  1. Load user profile:
     - examDate, dailyStudyMinutes, studyGoal
     - currentReadinessSnapshot (latest LearnerReadinessSnapshot)

  2. Load remediation queue:
     - UserRemediationQueue WHERE userId AND resolved=false
       AND nextReviewAt <= tomorrow
       ORDER BY priorityScore DESC
       LIMIT 5

  3. Load flashcard due queue:
     - FlashcardProgress WHERE userId AND nextReviewAt <= today
       ORDER BY lapses DESC, nextReviewAt ASC
       LIMIT 20

  4. Load topic stats:
     - UserTopicStat WHERE userId ORDER BY wrongStreak DESC

  5. Compute today's budget:
     - availableMinutes = dailyStudyMinutes ?? 30
     - if examDaysRemaining < 14: availableMinutes += 15

  6. Build items (priority order):
     a. Remediation queue items → 10 questions per topic (10 min each)
     b. Flashcard due items → up to 20 cards (10 min)
     c. Weak topic questions → 10 questions from weakest topic (10 min)
     d. Lesson recommendation → if reading time < remaining budget
     e. Reinforcement items → topics with 60-75% accuracy (not failing, needs reinforcement)

  7. Trim to availableMinutes budget

  8. Compute readinessImpactEstimate:
     - For each item, estimate +score from completing it
     - Sum up (capped at 5% per day for credibility)

  9. Select coaching messages (max 3):
     - One progress message (if improvement detected this week)
     - One gap message (top remediation item)
     - One action + countdown message

  10. Store DailyStudyPlan to cache (Redis TTL: 23h, or until progress event invalidates)

  return plan
```

### Weekly Study Plan

Same structure as daily but spans 7 days. Generated on Mondays. Each day in the plan has a theme:

| Day | Theme |
|---|---|
| Monday | Assessment + Knowledge Review |
| Tuesday | Clinical Judgment + L3 questions |
| Wednesday | Pharmacology focus |
| Thursday | Prioritization + Delegation |
| Friday | Weak area catch-up |
| Saturday | Full mock exam (CAT session) |
| Sunday | Review + Flashcards |

Theme is adjusted based on actual weakness profile — if pharmacology is strong, Thursday becomes the pharmacology slot.

### Exam Countdown Strategy

When `User.examDate` is within 90 days, the coach shifts to a structured countdown strategy:

```
90+ days: Foundation building — weak areas
60–89 days: Mixed practice — all topics
30–59 days: High-volume CAT practice
14–29 days: Daily mock exams + remediation only
7–13 days: Review strong topics, light practice on weak
3–6 days: Light practice only, confidence building
1–2 days: Flashcard review only, rest recommended
```

---

## 5. Data Model

### New Models Required

```prisma
model DailyStudyPlan {
  id                      String          @id @default(cuid())
  userId                  String          @map("user_id")
  pathwayId               String          @map("pathway_id") @db.VarChar(64)
  planDate                DateTime        @map("plan_date") @db.Date
  estimatedMinutes        Int             @map("estimated_minutes")
  readinessImpactEstimate Float           @map("readiness_impact_estimate")
  itemsJson               Json            @map("items_json")
  coachMessagesJson       Json            @map("coach_messages_json")
  completedItemCount      Int             @default(0) @map("completed_item_count")
  completedAt             DateTime?       @map("completed_at")
  generatedAt             DateTime        @default(now()) @map("generated_at")
  user                    User            @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, pathwayId, planDate])
  @@index([userId, planDate])
  @@map("daily_study_plans")
}

model WeeklyStudyPlan {
  id              String    @id @default(cuid())
  userId          String    @map("user_id")
  pathwayId       String    @map("pathway_id") @db.VarChar(64)
  weekStartDate   DateTime  @map("week_start_date") @db.Date
  planJson        Json      @map("plan_json")
  generatedAt     DateTime  @default(now()) @map("generated_at")
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, pathwayId, weekStartDate])
  @@index([userId, weekStartDate])
  @@map("weekly_study_plans")
}
```

### API Endpoints

```
GET  /api/learner/study-plan/today?pathway=rn
     → DailyStudyPlan (cached 23h, invalidated by progress events)

GET  /api/learner/study-plan/week?pathway=rn
     → WeeklyStudyPlan

POST /api/learner/study-plan/item-complete
     body: { planId, itemIndex }
     → marks item complete, increments completedItemCount

GET  /api/learner/coach/messages?pathway=rn
     → array of CoachingMessage for today
```

---

## 6. Coach Accuracy Requirements

The coach must never claim something false. All quantitative assertions must come from real data:

| Claim | Data required |
|---|---|
| "You improved N% in topic X" | UserTopicStat: 7-day comparison |
| "Topic X is your weakest" | UserTopicStat: lowest accuracy with ≥ 5 attempts |
| "Your readiness will increase ~N%" | LearnerReadinessSnapshot + item impact model |
| "N days until exam" | User.examDate compared to today |
| "At current pace, exam-ready in N days" | LearnerReadinessSnapshot trend + trajectory regression |

Claims that cannot be backed by data are suppressed. The coach says nothing rather than inventing a number.

---

## 7. Implementation Plan

### Phase A — Coaching Messages API (2 days)
1. `src/lib/coach/build-coaching-messages.ts` — message selector from UserTopicStat + queue
2. `GET /api/learner/coach/messages` — endpoint
3. Wire coaching messages into existing post-session results page

### Phase B — Daily Plan Generation (2–3 days)
1. `src/lib/coach/build-daily-study-plan.ts` — plan builder
2. Prisma migration: `DailyStudyPlan` table
3. `GET /api/learner/study-plan/today` — with Redis caching
4. Study plan UI component on learner dashboard

### Phase C — Weekly Plan + Countdown (2 days)
1. Weekly plan builder
2. Exam countdown strategy module
3. `GET /api/learner/study-plan/week`

### Phase D — Plan Completion Tracking (1 day)
1. Item completion API
2. Completion badge on dashboard

---

## 8. Acceptance Criteria

- [ ] Coaching messages are generated within 100ms (no LLM call in delivery path)
- [ ] All quantitative claims in messages are backed by actual data fields
- [ ] Daily plan respects `User.dailyStudyMinutes` budget
- [ ] Daily plan items have valid `href` values that route correctly
- [ ] `readinessImpactEstimate` is ≥ 0 and ≤ 5 (percent)
- [ ] Plans for learners with no answer history do not error (graceful empty state)
- [ ] Exam countdown message appears when `examDate` is ≤ 90 days away
- [ ] TypeScript strict mode — no `any`
