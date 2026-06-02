# NurseNest — Exam Readiness Engine

> **Status:** Architecture & data model review — pre-implementation
> **Generated:** 2026-05-28

---

## 1. What Already Exists

The codebase contains a sophisticated readiness scoring foundation. This document describes how to expose and extend it.

| Component | File | Status |
|---|---|---|
| Core scorer | `src/lib/cat/readiness-scorer.ts` | ✅ Production — full algorithm |
| Score types | `src/lib/cat/types.ts` | ✅ Production — `ReadinessScore`, `PerformanceProfile` |
| Readiness bands | `readinessBand()` in scorer | ✅ 5 bands: critical/developing/approaching/ready/proficient |
| Cognitive weights | `COGNITIVE_WEIGHTS` L1/L2/L3 | ✅ 1.0 / 1.5 / 2.2 |
| Risk weights | `RISK_WEIGHTS` low/moderate/high | ✅ 1.0 / 1.5 / 2.5 |
| Consistency modifier | in scorer | ✅ 0.85–1.10 range |
| Topic stat storage | `UserTopicStat` model | ✅ per-topic correct/wrong/streak |
| Remediation queue | `UserRemediationQueue` model | ✅ priority scores, nextReviewAt |
| Session analysis | `SessionAnalysis` type | ✅ weakAreas, lessonRecommendations |
| Answer history | `ExamQuestionPracticeAnswerAttempt` | ✅ userId, questionId, isCorrect, mode |
| CAT session state | `ExamSession.adaptiveState` | ✅ abilityEstimate, PerformanceProfile |

### What the Scorer Produces Today (but is never stored)

`computeReadinessScore(answers)` returns a full `ReadinessScore`:

```typescript
{
  score: 74,                     // 0–100
  confidence: "high",            // low | medium | high
  sampleSize: 142,
  consistencyModifier: 1.04,
  rawWeightedPercent: 0.712,
  dimensions: {
    byLayer: { L1: 88, L2: 76, L3: 61 },
    byRisk: { low: 91, moderate: 72, high: 58 },
    bySystem: { cardiovascular: 65, pharmacology: 42, respiratory: 81 }
  },
  computedAt: "2026-05-28T14:00:00Z"
}
```

This is computed on-demand inside the CAT engine but **never persisted** and **never shown to learners** outside of individual session results.

---

## 2. What Needs to Be Built

### 2a. Longitudinal Score Storage

New Prisma model — **`LearnerReadinessSnapshot`**:

```prisma
model LearnerReadinessSnapshot {
  id                  String   @id @default(cuid())
  userId              String   @map("user_id")
  pathwayId           String   @map("pathway_id") @db.VarChar(64)
  // Source of the snapshot
  source              String   @db.VarChar(32)   // "cat_session" | "practice_batch" | "daily_compute" | "manual"
  // The full ReadinessScore JSON
  scoreJson           Json     @map("score_json")
  // Denormalized top-level fields for fast range queries
  score               Int
  confidence          String   @db.VarChar(16)   // low | medium | high
  sampleSize          Int      @map("sample_size")
  // Dimension sub-scores (denormalized for dashboard queries)
  knowledgeScore      Int?     @map("knowledge_score")     // byLayer.L1
  clinicalScore       Int?     @map("clinical_score")      // byLayer.L3
  pharmacologyScore   Int?     @map("pharmacology_score")  // bySystem.pharmacology
  prioritizationScore Int?     @map("prioritization_score") // bySystem.prioritization
  delegationScore     Int?     @map("delegation_score")    // bySystem.delegation
  consistencyScore    Float?   @map("consistency_score")   // consistencyModifier × 100
  createdAt           DateTime @default(now()) @map("created_at")
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, pathwayId, createdAt])
  @@index([userId, createdAt])
  @@map("learner_readiness_snapshots")
}
```

### 2b. Exam-Specific Readiness Profiles

Each exam family has different scoring dimensions that matter more or less. We need a mapping layer:

```typescript
// src/lib/readiness/exam-readiness-profile.ts
interface ExamReadinessProfile {
  examFamily: string;       // "NCLEX-RN" | "NCLEX-PN" | "REx-PN" | "CNPLE" | "allied"
  displayName: string;
  dimensions: {
    key: string;
    label: string;
    weight: number;         // how much this dimension counts toward the composite score
    sourceField: string;    // maps to ReadinessScore.dimensions field
  }[];
  bands: {
    notReady: [number, number];      // [0, 59]
    developing: [number, number];    // [60, 74]
    nearReady: [number, number];     // [75, 84]
    examReady: [number, number];     // [85, 100]
  };
}
```

Exam-family band labels (mapping from `readinessBand()` to user-facing labels):

| Internal Band | NCLEX-RN Display | CNPLE Display | New Grad Display |
|---|---|---|---|
| critical (0–39) | Not Ready | Not Ready | Needs Foundation |
| developing (40–59) | Developing | Developing | Building Skills |
| approaching (60–74) | Near Ready | Near Ready | Developing |
| ready (75–89) | Exam Ready | Exam Ready | Practice Ready |
| proficient (90–100) | High Readiness | High Readiness | Advanced |

### 2c. Readiness Score API

```
GET  /api/learner/readiness?pathway=rn
     → current readiness score + last 30 days trend
     → top 3 strengths, top 3 weaknesses
     → recommended next action

GET  /api/learner/readiness/history?pathway=rn&days=90
     → array of LearnerReadinessSnapshot (for trend chart)

POST /api/learner/readiness/compute
     → triggers on-demand recompute from all answer history
     → stores new LearnerReadinessSnapshot
     → returns computed score
```

### 2d. Learner-Facing Readiness UI

New page: `/app/readiness` (or embedded in existing dashboard)

**Readiness Card** (visible on learner dashboard):
```
┌──────────────────────────────────────────────────────┐
│  NCLEX-RN Readiness                                  │
│                                                      │
│            74 / 100                                  │
│         ● Near Ready                                 │
│                                                      │
│  ▲ +6 pts this week                                  │
│                                                      │
│  Strengths           Weaknesses                      │
│  ✓ Respiratory       ✗ Pharmacology (42)             │
│  ✓ Cardiac (81)      ✗ Delegation (38)               │
│  ✓ Assessment (88)   ✗ Prioritization (51)           │
│                                                      │
│  [View Full Report] [Start Remediation]              │
└──────────────────────────────────────────────────────┘
```

**Readiness Details Page:**
- Score gauge (0–100)
- Band label with clinical description
- Trend line (30/60/90 day)
- Per-dimension breakdown (8 dimensions from System 1 spec)
- Next milestone: "Reach Exam Ready at 85+"

---

## 3. Data Model

### New Models Required

| Model | Purpose | Migration |
|---|---|---|
| `LearnerReadinessSnapshot` | Longitudinal score history | New table |

### Existing Models Consumed

| Model | Fields Used |
|---|---|
| `ExamQuestionPracticeAnswerAttempt` | `userId`, `questionId`, `isCorrect`, `createdAt` |
| `ExamQuestion` | `cognitiveLevel`, `bodySystem`, `topic`, `difficulty` |
| `UserTopicStat` | `correctCount`, `wrongCount`, `lastAttemptAt` |
| `UserRemediationQueue` | `topic`, `priorityScore` |
| `ExamSession.adaptiveState` | `PerformanceProfile` for CAT sessions |

### Score Computation Triggers

| Trigger | When | Notes |
|---|---|---|
| CAT session complete | After `POST /api/cat/{id}/result` | Most authoritative snapshot |
| Practice batch complete | After grading ≥ 10 questions | Background, non-blocking |
| Daily cron (02:00 UTC) | Nightly for all active learners | For learners who studied the previous day |
| Manual learner request | `POST /api/learner/readiness/compute` | Throttled: 1 per hour per user |

---

## 4. The Eight Readiness Dimensions

These map onto the spec's required dimensions. Each is derived from existing score data:

| Dimension | Source | Computation |
|---|---|---|
| Knowledge Score | `byLayer.L1` | L1 weighted accuracy × 100 |
| Clinical Judgment | `byLayer.L3` | L3 weighted accuracy × 100 |
| Prioritization | `bySystem.prioritization` | System tag accuracy for prioritization questions |
| Delegation | `bySystem.delegation` | System tag accuracy for delegation questions |
| Pharmacology | `bySystem.pharmacology` | System tag accuracy (matches `ExamQuestion.topic`) |
| Trend Score | Δ(score, 7d ago vs today) | Score improvement / regression over 7 days |
| Consistency Score | `consistencyModifier × 100` | 85–110 mapped to 0–100 |
| CAT Performance | `ExamSession.adaptiveState.abilityEstimate` | Theta converted to 0–100 (z-score normalized) |

---

## 5. Implementation Plan

### Phase A — Score Storage (1–2 days)
1. Write Prisma migration: `LearnerReadinessSnapshot` table
2. Write `src/lib/readiness/store-readiness-snapshot.ts` — upsert logic
3. Hook into: CAT session complete, practice grading route
4. Write `GET /api/learner/readiness` API route

### Phase B — Readiness UI (2–3 days)
1. Write readiness card component
2. Wire into learner dashboard
3. Write readiness details page with trend chart (use existing Recharts)
4. Add to nav

### Phase C — Exam-Specific Profiles (1 day)
1. Write `exam-readiness-profile.ts` with all exam families
2. Parameterize band labels per exam family
3. Wire `?pathway=` param into the API and UI

### Phase D — Daily Compute Cron (1 day)
1. Add `POST /api/cron/compute-readiness` (protected by `CRON_SECRET`)
2. Batch process active learners (last study activity ≤ 48h)
3. Throttle: max 1000 users per cron run

---

## 6. Acceptance Criteria

- [ ] Readiness score is stored after every CAT session
- [ ] Readiness score is stored after every practice batch ≥ 10 questions
- [ ] `/api/learner/readiness?pathway=rn` returns score + dimensions + top 3 strengths/weaknesses
- [ ] Trend data spans ≥ 30 days for active learners
- [ ] Band labels are exam-family specific (NCLEX-RN labels differ from CNPLE labels)
- [ ] Score never decreases due to completing more questions alone (recency weighting prevents cold-start regression)
- [ ] UI renders on mobile without horizontal scroll
- [ ] TypeScript strict mode — no `any`

---

## 7. Non-Goals

- Do not compute readiness for freemium (LEARNER tier) users in Phase A — score requires ≥ 20 weighted answers which freemium users rarely reach
- Do not replace the CAT adaptive algorithm — this is a parallel reporting system
- Do not expose raw theta estimates from CAT to learners — translate to 0–100 only
