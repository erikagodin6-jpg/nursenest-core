# Phase 5B — Shared progress, adaptive learning, and cross-platform entitlements

This document is the **canonical map** for learner progress and adaptive signals in NurseNest: one Postgres database, one Prisma schema, and **the same** session + entitlement gates whether the caller is the web app or a native shell that forwards the learner’s **NextAuth session cookie** (or equivalent) to the existing `/api/*` routes.

**Related:** `docs/entitlement-paywall-audit.md` (paywall semantics). **Phase 9 / native boundary:** `nursenest-core/src/lib/mobile-native/api-boundary.ts` (shared HTTP + cookie semantics; no duplicate progress store).

---

## Architecture (prose diagram)

1. **Identity** — Every mutating learner API resolves the user from **`auth()`** (NextAuth session), then **`requireSubscriberSession()`** which loads **`getUserAccess(userId)`** from Prisma (`Subscription` + `User`) and derives **`accessScopeFromUserAccess`** (`AccessScope`). There is no separate “mobile user id” or mobile-only progress key.
2. **Write** — Web UI and native clients call the **same** route handlers under `nursenest-core/src/app/api/**`. Handlers upsert rows on shared models (`Progress`, `FlashcardProgress`, `PracticeTest`, `ExamSession`, `UserTopicStat`, etc.). CAT persistence intentionally reuses **`PracticeTest`** (see `src/lib/cat/session-persistence.ts` header comment).
3. **Read** — Dashboards, study snapshots, and JSON APIs such as **`GET /api/learner/weak-areas`** read through shared libs (`loadUnifiedTopicPerformance`, `loadLearnerDashboard`, `loadPremiumDashboardSnapshot`) so any write visible in Prisma is visible on **any** client after cache invalidation where applicable.
4. **Cache** — Many learner reads go through **`invalidateLearnerPrivateReadCache(userId)`** after writes (lesson progress, topic outcomes, flashcard reviews, etc.) so private subscriber payloads do not serve stale cross-device state.

---

## Prisma models (source of truth)

| Domain | Prisma model(s) | Purpose |
|--------|-----------------|--------|
| Lesson completion / engagement | `Progress` | Per `userId` + `lessonId`: `completed`, `engagedAt`, timestamps. |
| Pathway synthetic keys | `Progress` | Same table; synthetic `lessonId` for pathway slug progress (`pathway-progress` route). |
| Flashcard SM-2 / review | `FlashcardProgress`, `FlashcardStudySession`, `FlashcardUserStats` | Card scheduling, deck session cursor, aggregate streak/review counts. |
| Verified study decks | `VerifiedStudyCardProgress` | Learner-authored deck card mastery (separate from catalog flashcards). |
| Practice sessions (linear + CAT payload) | `PracticeTest` | `config`, `questionIds`, `answers`, `status`, `results`, **`adaptiveState`** (CAT / NP CAT). |
| Exam (linear / CAT exam mode) | `ExamSession`, `ExamAttempt` | Exam runner state; `examMode` + `adaptiveState` on session. |
| Topic ledger (adaptive / weak areas) | `UserTopicStat` | Aggregated correct/wrong/streak per topic; feeds `loadUnifiedTopicPerformance`. |
| Remediation (optional engine) | `UserRemediationEvent`, `UserRemediationQueue` | Mistake capture and spaced queue (writes often gated by feature flags). |
| Session / abuse telemetry | `LearnerSessionActivity`, `LearnerSessionIpObservation` | Not lesson progress; supports subscriber session integrity. |
| Bank question attempts | `ExamQuestionPracticeAnswerAttempt` | Graded attempts for analytics (bounded writes from practice surfaces). |

Schema file: `nursenest-core/prisma/schema.prisma`.

---

## Write paths (API → lib → Prisma)

| Activity | Route(s) | Core lib / notes |
|----------|-----------|------------------|
| CMS / content lesson completion | `POST /api/lessons/progress` | `prisma.progress.upsert`; `requireSubscriberSession`; pathway/content scope checks. |
| Pathway lesson open / engage / complete | `POST /api/lessons/pathway-progress` | Same `Progress` table; synthetic ids for pathway lessons. |
| Lesson post-assessment → topic ledger | Via lesson assessment APIs → `recordLessonAssessment` | `src/lib/lessons/lesson-assessment-store.ts` → `PracticeTest` row + **`recordTopicOutcomesSequential`** for post-assessment. |
| Question bank grade | `POST /api/questions/grade` | **`recordTopicOutcomesSequential`** (`src/lib/learner/topic-performance.ts`). |
| Practice test progress / complete | `POST`/`PATCH` `/api/practice-tests/...` | `prisma.practiceTest.*`; completion paths call **`recordTopicOutcomesFromPracticeTest`** (same module as above). |
| CAT (NP / practice CAT) | Practice test + cat session helpers | **`src/lib/cat/session-persistence.ts`** — persists to **`PracticeTest`** (`adaptiveState`, completion snapshot). |
| Exam session step / submit | `/api/exams/session`, `/api/exams/submit`, … | `ExamSession` / `ExamAttempt` updates. |
| Flashcard review | `POST /api/flashcards/cards/[cardId]/review`, `POST /api/flashcards/decks/[deckRef]/review` | `FlashcardProgress` upsert + streak helpers under `src/lib/flashcards/*`. |

All of the above **subscriber-mutating** routes use **`requireSubscriberSession()`** (or session + equivalent checks for exam routes) so **`getUserAccess`** remains the entitlement source of truth, aligned with `docs/entitlement-paywall-audit.md`.

---

## Read paths (adaptive summary / weak topics)

| Consumer | Entry | Reads |
|----------|--------|------|
| Learner dashboard | `loadLearnerDashboard` → `loadLearnerDashboardAnalytics` | **`loadUnifiedTopicPerformance`** (`src/lib/learner/topic-performance.ts`). |
| Study snapshot / smart next | `buildLearnerStudySnapshot`, `buildSmartStudyNextRecommendations` | Uses topic performance snapshot (often preloaded from premium snapshot). |
| Premium home payload | `loadPremiumDashboardSnapshot` | Aggregates lessons, practice, flashcards, readiness; weak topic fields align with same topic perf. |
| JSON API (any client) | **`GET /api/learner/weak-areas`** | **`loadUnifiedTopicPerformance(gate.userId, gate.entitlement, 12)`** — same function as dashboard analytics. |
| Account / coach surfaces | `load-account-hub-snapshot`, `coach-page-data`, etc. | Import **`loadUnifiedTopicPerformance`** directly. |

**Cross-platform rule:** If a native app calls `GET /api/learner/weak-areas` with the same session cookie as the browser, it receives the same JSON because the handler uses the same `userId` and `gate.entitlement`.

---

## Mobile and “no duplicate tables”

| Check | Result |
|-------|--------|
| `apps/mobile` (Expo) | Present as the **native shell**; `package.json` has **no** `@prisma/client` / `sqlite` dependencies. API calls go through `lib/api.ts` with **`Cookie` + `cookieJar`** so mutations hit the same Next.js `/api/*` routes as the browser. |
| `packages/nursenest-mobile-shared` | **HTTP / handoff contracts only** (`contracts.ts`) — no Prisma, no SQLite, no progress tables. |
| SQL migrations under `prisma/migrations` | **No `mobile`-named progress tables** found via `rg -i mobile nursenest-core/prisma/migrations/**/*.sql` (no hits). |

Native shells should treat on-device stores (e.g. SecureStore for pathway preference) as **client hints / cache only**; authoritative progress remains on the server.

---

## Caches and invalidation

| Mechanism | Role |
|-----------|------|
| `invalidateLearnerPrivateReadCache(userId)` | Called after progress and topic-ledger writes to avoid stale subscriber read models. |
| `mergeSubscriberPrivateCacheHeaders` | Subscriber JSON APIs mark responses private / non-shared CDN behavior (`require-subscriber-session` / related HTTP helpers). |

---

## Gaps / future work

1. **E2E with real device cookie jar** — Contract tests in-repo prove static wiring; full cross-device E2E is optional in Playwright mobile config when a staging app shell exists.
2. **Operational runbook** — If a third-party shell misconfigures cookie domains, 401/403 on the same routes is expected; debugging = session + `getUserAccess` / Stripe mirror state.
3. **Truthpack regeneration** — When `.vibecheck/truthpack/` is present in an environment, re-run `vibecheck truthpack` so `routes.json` / `schemas.json` stay aligned with this map.

---

## File index (quick navigation)

- Entitlement gate: `src/lib/entitlements/require-subscriber-session.ts`, `get-user-access.ts`
- Topic ledger read/write: `src/lib/learner/topic-performance.ts`
- Dashboard assembly: `src/lib/learner/load-learner-dashboard.ts`, `premium-dashboard-snapshot.ts`
- CAT on `PracticeTest`: `src/lib/cat/session-persistence.ts`
- Mobile API boundary (types only): `src/lib/mobile-native/api-boundary.ts`, `packages/nursenest-mobile-shared/src/contracts.ts`
