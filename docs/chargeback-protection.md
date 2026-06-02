# NurseNest — Chargeback Protection Dashboard

> **Status:** Architecture & data model review — pre-implementation
> **Generated:** 2026-05-28

---

## 1. Context and Purpose

Stripe chargebacks (disputes) require evidence that the customer used the service they are disputing. Without a systematic evidence export, the response is manual, time-consuming, and often loses by default.

This system:
1. Tracks all learner activity in an immutable, timestamped audit log
2. Provides a one-click evidence export per user (PDF or structured report)
3. Is designed specifically for Stripe dispute response format
4. Is admin-only — learners never see this system exists

---

## 2. What Already Exists

| Data Point | Source | Status |
|---|---|---|
| Login events | Implicit from session creation | ✅ Auth.js sessions |
| Questions answered | `ExamQuestionPracticeAnswerAttempt` | ✅ timestamped rows |
| Flashcards reviewed | `FlashcardAttempt` (via FlashcardSession) | ✅ timestamped |
| CAT sessions | `ExamSession` (created_at, status) | ✅ timestamped |
| Exam attempts | `ExamAttempt` | ✅ score, total, createdAt |
| Subscription events | Stripe webhook → `Subscription` model | ✅ active subscriptions |
| User profile | `User` table | ✅ country, tier, examFocus |

**What is missing:**
- A consolidated audit event log (evidence is scattered across 6+ tables)
- A session/login event log (no table tracks individual login events)
- Lesson open tracking (not stored persistently — only counted in `freeLessonOpens`)
- A report generation pipeline
- The admin UI to query and export evidence per user

---

## 3. Evidence Categories (per Stripe dispute guidance)

Stripe provides up to **12 categories of evidence** for digital service disputes. We address the most relevant 6:

| Evidence Type | Data Source |
|---|---|
| Customer email | `User.email` |
| Service used (date + description) | Activity log |
| IP address / device | Auth.js session metadata (if stored) |
| Terms of service acceptance | `User.legalPoliciesAcceptedAt`, `legalPoliciesVersion` |
| Refund policy compliance | `Subscription` events, policy version |
| Significant product use | Activity summary: questions, sessions, lessons |

The evidence report is formatted so it can be directly pasted into Stripe's dispute evidence form or uploaded as a PDF attachment.

---

## 4. Data Model

### New Models Required

```prisma
/// * Immutable audit log for chargeback evidence.
/// * Written on every significant learner action. Append-only (no updates, no deletes).
model LearnerActivityEvent {
  id         String    @id @default(cuid())
  userId     String    @map("user_id")
  eventType  String    @map("event_type") @db.VarChar(64)
  // eventType values:
  //   session_login | lesson_open | question_answered | flashcard_reviewed
  //   cat_session_start | cat_session_complete | practice_test_start
  //   practice_test_complete | lesson_complete | subscription_activated
  //   subscription_cancelled | trial_started | trial_converted
  eventMeta  Json?     @map("event_meta")
  // Safe subset: { sessionId?, lessonId?, questionId?, score?, topic? }
  // Never stores: answers, PII beyond userId, raw content
  ipHash     String?   @map("ip_hash") @db.VarChar(64)  // SHA256 of IP (not raw IP)
  userAgent  String?   @map("user_agent") @db.VarChar(256)
  createdAt  DateTime  @default(now()) @map("created_at")
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
  @@index([userId, eventType, createdAt])
  @@map("learner_activity_events")
}
```

**Note on IP storage:** We store a SHA256 hash of the IP address (not the raw IP) to satisfy GDPR/PIPEDA while still providing evidence of distinct access points. The hash is one-way and cannot be reversed to the original IP. This is sufficient for Stripe evidence (we report "N distinct access points" rather than listing IPs).

### Existing Models Read (for evidence)

| Model | Evidence Value |
|---|---|
| `ExamQuestionPracticeAnswerAttempt` | "Answered 142 questions between May 1–28" |
| `ExamAttempt` | "Completed 3 mock exams: scored 72%, 76%, 81%" |
| `ExamSession` | "Started CAT sessions on [dates]" |
| `FlashcardSession` | "Completed flashcard sessions on [dates]" |
| `FlashcardAttempt` | "Reviewed 287 flashcards total" |
| `User.legalPoliciesAcceptedAt` | "Accepted terms of service on [date]" |
| `Subscription` | "Subscribed on [date], active through [date]" |

---

## 5. Evidence Report Format

### Report Structure

```typescript
interface ChargebackEvidenceReport {
  // Header
  generatedAt: string;
  generatedByAdminId: string;
  reportVersion: string;             // "1.0"

  // Customer identification
  customer: {
    userId: string;
    email: string;
    name: string;
    country: string;
    tier: string;
    examFocus: string | null;
  };

  // Subscription history
  subscription: {
    startedAt: string;
    endedAt: string | null;
    status: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    tier: string;
    pricePaid: string;              // "CAD $99.00 / 3 months"
  };

  // Legal acceptance
  termsAccepted: {
    acceptedAt: string;
    policyVersion: string;
    refundPolicyUrl: string;
  };

  // Activity summary
  activitySummary: {
    firstActivityAt: string;
    lastActivityAt: string;
    totalActiveDays: number;
    loginCount: number;
    questionCount: number;
    flashcardCount: number;
    lessonOpenCount: number;
    catSessionCount: number;
    examAttemptCount: number;
    estimatedStudyMinutes: number;
  };

  // Daily activity timeline (for the disputed period)
  activityTimeline: {
    date: string;                   // "2026-05-14"
    eventTypes: string[];           // ["session_login", "question_answered", "cat_session_start"]
    questionCount: number;
    flashcardCount: number;
    sessionMinutes: number;
  }[];

  // Exam attempts
  examAttempts: {
    date: string;
    type: string;                   // "CAT" | "Linear Mock"
    score: string;                  // "76%" (not raw number)
    completedAt: string;
  }[];

  // Narrative summary (Stripe evidence text field)
  narrativeSummary: string;
}
```

### Narrative Summary

Auto-generated text block for Stripe's "Evidence Details" field:

```
NurseNest Evidence Report — {Customer Name} — Generated {Date}

This report documents verified platform usage for the Stripe subscription {subscriptionId}.

SUBSCRIPTION: {Tier} plan active from {startDate}. Customer accepted Terms of Service and 
Refund Policy on {termsDate} (Policy Version {version}).

USAGE EVIDENCE:
- Customer logged in on {loginCount} occasions between {firstActivity} and {lastActivity}
- Answered {questionCount} practice questions across {activeDays} active study days
- Reviewed {flashcardCount} study flashcards
- Completed {catSessionCount} adaptive exam sessions
- Achieved scores of {scores} on practice exams

The customer's most recent platform activity was on {lastActivityDate}.

This constitutes significant use of a digital education service. Our refund policy 
(available at {refundPolicyUrl}) reflects that digital services cannot be "returned."
```

---

## 6. Admin Dashboard

**Route:** `/admin/chargeback`

**Access:** Admin tier only

### User Lookup

Search by email, Stripe customer ID, or subscription ID:

```
┌──────────────────────────────────────────────────────────────┐
│  CHARGEBACK EVIDENCE LOOKUP                                  │
│                                                              │
│  Search: [erika.godin@email.com        ] [Search]           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Erika Godin — RN Subscriber — CA                     │   │
│  │ Subscribed: 2026-03-01 → Active                      │   │
│  │ Last active: 2026-05-28                               │   │
│  │                                                      │   │
│  │ Activity:  142 questions · 87 flashcards · 3 CATs    │   │
│  │ Active days: 31 of 88 days subscribed                │   │
│  │                                                      │   │
│  │        [Generate Evidence Report (PDF)]              │   │
│  │        [Copy Stripe Evidence Text]                   │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Report Generation

One-click generates:
- PDF report (using existing `jspdf` or `pdf-lib` — both installed)
- Plain text version for Stripe's evidence text field
- JSON export for internal records

---

## 7. Activity Event Instrumentation

### Where to Write Events

| Event Type | Trigger Point | File to Modify |
|---|---|---|
| `session_login` | After successful auth | `src/lib/auth/` (post-signin callback) |
| `lesson_open` | `GET /api/lessons/{id}` or lesson page render | Lesson API route |
| `question_answered` | `POST /api/questions/grade` | Grade route (already logs `ExamQuestionPracticeAnswerAttempt`) |
| `flashcard_reviewed` | `POST /api/flashcards/progress` | Flashcard progress route |
| `cat_session_start` | `POST /api/cat/sessions` | CAT session route |
| `cat_session_complete` | When ExamSession status → COMPLETED | CAT completion route |
| `practice_test_start` | Practice test launch | Practice test route |
| `practice_test_complete` | Practice test submission | Practice test submit route |
| `subscription_activated` | Stripe webhook: `customer.subscription.created` | Webhook handler |
| `subscription_cancelled` | Stripe webhook: `customer.subscription.deleted` | Webhook handler |

**Performance impact:** `LearnerActivityEvent` writes are fire-and-forget (no await in the request path). Use `void writeActivityEvent(...)` pattern with error swallowed to avoid adding latency.

### Event Write Helper

```typescript
// src/lib/audit/write-activity-event.ts
export async function writeActivityEvent(
  userId: string,
  eventType: LearnerActivityEventType,
  eventMeta?: Record<string, unknown>,
  request?: Request,
): Promise<void> {
  // Non-blocking: void this in call sites
  await prisma.learnerActivityEvent.create({
    data: {
      userId,
      eventType,
      eventMeta: eventMeta ?? null,
      ipHash: request ? hashIp(getClientIp(request)) : null,
      userAgent: request?.headers.get("user-agent")?.slice(0, 256) ?? null,
    },
  });
}

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex");
}
```

---

## 8. Retention Policy

`LearnerActivityEvent` records are retained for:
- **7 years** for active or recently-cancelled subscribers (aligns with typical dispute window + record-keeping requirements)
- **2 years** for free-tier learners
- Deleted automatically via nightly job for expired records

This does not conflict with GDPR right-to-erasure because we can delete event records while retaining the minimum necessary for legal compliance (we can anonymize the `userId` linkage rather than deleting rows entirely).

---

## 9. API Endpoints

```
GET  /api/admin/chargeback/lookup?email={email}
     → UserChargebackProfile (activity summary, subscription history)

GET  /api/admin/chargeback/{userId}/evidence-report
     → ChargebackEvidenceReport JSON

GET  /api/admin/chargeback/{userId}/evidence-report.pdf
     → PDF download

GET  /api/admin/chargeback/{userId}/evidence-report.txt
     → Plain text narrative for Stripe

GET  /api/admin/chargeback/{userId}/activity-timeline?from={date}&to={date}
     → array of daily activity records for the specified period
```

---

## 10. Implementation Plan

### Phase A — Activity Event Logging (2 days)
1. Prisma migration: `LearnerActivityEvent` table
2. `src/lib/audit/write-activity-event.ts` helper
3. Wire to: auth callback, grade route, flashcard progress route, CAT routes, subscription webhook
4. Verify events are being written without affecting request latency

### Phase B — Evidence Report Generator (2 days)
1. `src/lib/audit/build-chargeback-evidence.ts` — report builder
2. `src/lib/audit/generate-evidence-narrative.ts` — Stripe narrative text
3. `GET /api/admin/chargeback/lookup` + evidence report endpoints

### Phase C — PDF Export (1 day)
1. `src/lib/audit/generate-evidence-pdf.ts` using `pdf-lib` (already installed)
2. `/api/admin/chargeback/{userId}/evidence-report.pdf` endpoint

### Phase D — Admin UI (2 days)
1. `/admin/chargeback` page with user lookup
2. Evidence report preview
3. One-click copy (Stripe text) and download (PDF) actions

---

## 11. Acceptance Criteria

- [ ] `LearnerActivityEvent` rows are written for all 10 event types
- [ ] Event writes add < 5ms to API route P95 latency (fire-and-forget, non-blocking)
- [ ] IP addresses are stored only as SHA256 hashes — no raw IPs in database
- [ ] Evidence report PDF downloads successfully from admin panel
- [ ] Stripe narrative text is < 3000 characters (Stripe field limit)
- [ ] Admin chargeback route returns 403 for non-admin users
- [ ] Lookup returns correct activity data for a test user with known activity
- [ ] Activity timeline covers the exact subscription period with day-by-day granularity
- [ ] TypeScript strict mode — no `any` in report types
