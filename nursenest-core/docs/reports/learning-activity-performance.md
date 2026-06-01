# Learning Activity Performance Investigation

Generated: 2026-06-01T10:51:37.516Z

## Measurement Status

- Live authenticated cold/warm timings were not executed because `LEARNING_PERF_BASE_URL` and an authenticated session were not provided. This report uses static source tracing, route/API payload proxies, and known instrumentation points.
- Static query count means source-level Prisma call sites in the route/API/client path, not executed SQL count. It is useful for locating likely wait points and N+1 risk.

## Slowest Risk Ranking

| Rank | Activity | Route | Source Size | Prisma Call Sites | findMany | Transactions | Client fetches | Cold | Warm | Where users wait |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | CAT session | `/app/practice-tests/[id]?mode=cat` | 329 KB | 22 | 8 | 0 | 8 | not measured | not measured | Users wait on CAT pool count/findMany, answer history, adaptive state persistence, and per-question adaptive selection/feedback queries. |
| 2 | Flashcard session | `/app/flashcards/[deckRef]` | 98 KB | 26 | 12 | 1 | 0 | not measured | not measured | Users wait on custom pool generation: dedicated flashcards, virtual question-derived cards, progress filters, option hydration, and session persistence/hydration. |
| 3 | Practice session | `/app/practice-tests/[id]` | 244 KB | 4 | 1 | 0 | 8 | not measured | not measured | Users wait on practice test bootstrap plus repeated client saves/question fetches during the session; runner is a large client component. |
| 4 | Lesson launcher | `/app/lessons` | 63 KB | 12 | 4 | 0 | 3 | not measured | not measured | Users wait on entitlement/profile resolution, contentItem count, pathwayLesson sample/list pagination, then client-side filter fetches. |
| 5 | Practice launcher | `/app/practice-tests` | 109 KB | 5 | 3 | 1 | 3 | not measured | not measured | Users wait mostly after shell render: discovery counts, weak-area/readiness/performance-summary calls, then practice test creation when launching. |
| 6 | CAT launcher | `/app/practice-tests/cat-launch` | 87 KB | 4 | 3 | 1 | 2 | not measured | not measured | Users wait on cat-readiness and POST /api/practice-tests; route shell is light but launch API is heavy. |
| 7 | Lesson detail | `/app/lessons/[id]` | 76 KB | 6 | 0 | 0 | 3 | not measured | not measured | Users wait on duplicated learnerPath/profile reads, pathwayLesson lookup, legacy ContentItem fallback checks, measurement preference lookup, and related/practice hydration. |
| 8 | Flashcard launcher | `/app/flashcards` | 110 KB | 1 | 0 | 0 | 1 | not measured | not measured | Users wait on session + entitlement, compatible pathway bootstrap, profile lookup, and flashcard inventory aggregate transaction before the client can trust counts. |

## Flow Details

### Lesson launcher

- Route: `/app/lessons`
- Data fetched: user.findUnique, pathwayLesson.findFirst, contentItem.count, contentItem.findMany, contentItem.count, user.findUnique, user.update
- API/client fetches: /api/learner/lesson-loading-errors
- Data size proxy: 63 KB across scanned route/API/client files.
- Query-count proxy: 12 Prisma call sites; 4 findMany; 3 count; 0 transactions; 0 raw queries.
- Render-count proxy: 2 useState, 2 useEffect, 0 Suspense boundaries across scanned client/server components.
- Cold load: not measured.
- Warm load: not measured.
- Exact wait point: Users wait on entitlement/profile resolution, contentItem count, pathwayLesson sample/list pagination, then client-side filter fetches.

| File | Size | Prisma | findMany | count | tx | fetch | useState | useEffect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `src/app/(app)/app/(learner)/lessons/page.tsx` | 28 KB | 4 | 0 | 1 | 0 | 0 | 0 | 0 |
| `src/components/student/learner-lessons-responsive-results.tsx` | 21 KB | 0 | 0 | 0 | 0 | 3 | 2 | 2 |
| `src/app/api/lessons/route.ts` | 15 KB | 8 | 4 | 2 | 0 | 0 | 0 | 0 |

### Lesson detail

- Route: `/app/lessons/[id]`
- Data fetched: user.findUnique, pathwayLesson.findUnique, contentItem.findFirst
- API/client fetches: /api/learner/lesson-bank-study-loop?lessonId=${encodeURIComponent(lessonId)}, /api/learner/lesson-bank-study-loop, /api/learner/study-settings
- Data size proxy: 76 KB across scanned route/API/client files.
- Query-count proxy: 6 Prisma call sites; 0 findMany; 0 count; 0 transactions; 0 raw queries.
- Render-count proxy: 2 useState, 5 useEffect, 0 Suspense boundaries across scanned client/server components.
- Cold load: not measured.
- Warm load: not measured.
- Exact wait point: Users wait on duplicated learnerPath/profile reads, pathwayLesson lookup, legacy ContentItem fallback checks, measurement preference lookup, and related/practice hydration.

| File | Size | Prisma | findMany | count | tx | fetch | useState | useEffect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `src/app/(app)/app/(learner)/lessons/[id]/page.tsx` | 51 KB | 6 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/components/lessons/pathway-lesson-study-loop-orchestrator.tsx` | 22 KB | 0 | 0 | 0 | 0 | 3 | 2 | 5 |
| `src/app/api/learner/pathway-lesson-practice-questions/route.ts` | 2 KB | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

### Flashcard launcher

- Route: `/app/flashcards`
- Data fetched: user.findUnique
- API/client fetches: none detected in scanned files
- Data size proxy: 110 KB across scanned route/API/client files.
- Query-count proxy: 1 Prisma call sites; 0 findMany; 0 count; 0 transactions; 0 raw queries.
- Render-count proxy: 9 useState, 6 useEffect, 1 Suspense boundaries across scanned client/server components.
- Cold load: not measured.
- Warm load: not measured.
- Exact wait point: Users wait on session + entitlement, compatible pathway bootstrap, profile lookup, and flashcard inventory aggregate transaction before the client can trust counts.

| File | Size | Prisma | findMany | count | tx | fetch | useState | useEffect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `src/app/(app)/app/(learner)/flashcards/page.tsx` | 20 KB | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/components/flashcards/flashcards-hub-client.tsx` | 60 KB | 0 | 0 | 0 | 0 | 1 | 9 | 6 |
| `src/app/api/flashcards/inventory/route.ts` | 11 KB | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/app/api/flashcards/custom-session/route.ts` | 19 KB | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

### Flashcard session

- Route: `/app/flashcards/[deckRef]`
- Data fetched: flashcard.findMany, examQuestion.findMany, flashcardProgress.findMany, flashcardSession.findFirst, flashcardAttempt.findMany, flashcardDeck.findMany, flashcardDeck.findUnique, flashcardSession.findFirst, flashcardSession.create, flashcardAttempt.count, flashcardAttempt.create, flashcardMastery.upsert, flashcardSession.updateMany, flashcard.count, flashcard.findMany, flashcardProgress.findMany, flashcardStudySession.findUnique, flashcardStudySession.upsert
- API/client fetches: none detected in scanned files
- Data size proxy: 98 KB across scanned route/API/client files.
- Query-count proxy: 26 Prisma call sites; 12 findMany; 3 count; 1 transactions; 0 raw queries.
- Render-count proxy: 0 useState, 0 useEffect, 0 Suspense boundaries across scanned client/server components.
- Cold load: not measured.
- Warm load: not measured.
- Exact wait point: Users wait on custom pool generation: dedicated flashcards, virtual question-derived cards, progress filters, option hydration, and session persistence/hydration.

| File | Size | Prisma | findMany | count | tx | fetch | useState | useEffect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `src/app/(app)/app/(learner)/flashcards/[deckRef]/page.tsx` | 1 KB | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/lib/flashcards/build-flashcard-custom-session.ts` | 41 KB | 5 | 5 | 0 | 0 | 0 | 0 | 0 |
| `src/lib/flashcards/flashcard-session-hydration.server.ts` | 5 KB | 2 | 1 | 0 | 0 | 0 | 0 | 0 |
| `src/lib/flashcards/flashcard-session-dal.server.ts` | 8 KB | 11 | 1 | 2 | 1 | 0 | 0 | 0 |
| `src/app/api/flashcards/custom-session/route.ts` | 19 KB | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/app/api/flashcards/decks/[deckRef]/study/route.ts` | 24 KB | 8 | 5 | 1 | 0 | 0 | 0 | 0 |

### Practice launcher

- Route: `/app/practice-tests`
- Data fetched: user.findUnique, practiceTest.findMany, practiceTest.create
- API/client fetches: /api/questions/discovery?${qp.toString()}, /api/practice-tests, /api/practice-tests
- Data size proxy: 109 KB across scanned route/API/client files.
- Query-count proxy: 5 Prisma call sites; 3 findMany; 0 count; 1 transactions; 0 raw queries.
- Render-count proxy: 6 useState, 5 useEffect, 0 Suspense boundaries across scanned client/server components.
- Cold load: not measured.
- Warm load: not measured.
- Exact wait point: Users wait mostly after shell render: discovery counts, weak-area/readiness/performance-summary calls, then practice test creation when launching.

| File | Size | Prisma | findMany | count | tx | fetch | useState | useEffect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `src/app/(app)/app/(learner)/practice-tests/page.tsx` | 15 KB | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/components/student/practice-tests-hub-client.tsx` | 34 KB | 0 | 0 | 0 | 0 | 2 | 5 | 5 |
| `src/components/student/practice-exam-launcher-client.tsx` | 8 KB | 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| `src/app/api/practice-tests/route.ts` | 42 KB | 4 | 3 | 0 | 1 | 0 | 0 | 0 |
| `src/app/api/questions/discovery/route.ts` | 10 KB | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

### Practice session

- Route: `/app/practice-tests/[id]`
- Data fetched: practiceTest.findFirst, examQuestion.findMany, practiceTest.findFirst, examQuestion.findFirst
- API/client fetches: /api/practice-tests/${testId}, /api/learner/adaptive-post-miss
- Data size proxy: 244 KB across scanned route/API/client files.
- Query-count proxy: 4 Prisma call sites; 1 findMany; 0 count; 0 transactions; 0 raw queries.
- Render-count proxy: 10 useState, 24 useEffect, 0 Suspense boundaries across scanned client/server components.
- Cold load: not measured.
- Warm load: not measured.
- Exact wait point: Users wait on practice test bootstrap plus repeated client saves/question fetches during the session; runner is a large client component.

| File | Size | Prisma | findMany | count | tx | fetch | useState | useEffect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `src/app/(app)/app/(learner)/practice-tests/[id]/page.tsx` | 5 KB | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/components/student/practice-test-runner-client.tsx` | 194 KB | 0 | 0 | 0 | 0 | 8 | 10 | 24 |
| `src/lib/practice-tests/load-practice-test-shell-bootstrap.ts` | 3 KB | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/app/api/practice-tests/[id]/route.ts` | 35 KB | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| `src/app/api/practice-tests/[id]/question/route.ts` | 8 KB | 2 | 0 | 0 | 0 | 0 | 0 | 0 |

### CAT launcher

- Route: `/app/practice-tests/cat-launch`
- Data fetched: practiceTest.findMany, practiceTest.create
- API/client fetches: /api/practice-tests/cat-readiness?pathwayId=${encodeURIComponent(normalizedPathwayId)}, /api/practice-tests
- Data size proxy: 87 KB across scanned route/API/client files.
- Query-count proxy: 4 Prisma call sites; 3 findMany; 0 count; 1 transactions; 0 raw queries.
- Render-count proxy: 4 useState, 2 useEffect, 0 Suspense boundaries across scanned client/server components.
- Cold load: not measured.
- Warm load: not measured.
- Exact wait point: Users wait on cat-readiness and POST /api/practice-tests; route shell is light but launch API is heavy.

| File | Size | Prisma | findMany | count | tx | fetch | useState | useEffect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `src/app/(app)/app/(learner)/practice-tests/cat-launch/page.tsx` | 2 KB | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/app/(app)/app/(learner)/cat/page.tsx` | 1 KB | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/components/student/pathway-cat-session-start-client.tsx` | 39 KB | 0 | 0 | 0 | 0 | 2 | 4 | 2 |
| `src/app/api/practice-tests/cat-readiness/route.ts` | 3 KB | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/app/api/practice-tests/route.ts` | 42 KB | 4 | 3 | 0 | 1 | 0 | 0 | 0 |

### CAT session

- Route: `/app/practice-tests/[id]?mode=cat`
- Data fetched: examQuestion.findMany, examQuestion.count, examQuestion.findFirst, practiceTest.findMany, practiceTest.findFirst, practiceTest.create, practiceTest.findFirst, practiceTest.updateMany, practiceTest.findMany, examQuestion.findMany, practiceTest.findFirst, examQuestion.findFirst
- API/client fetches: /api/practice-tests/${testId}, /api/learner/adaptive-post-miss
- Data size proxy: 329 KB across scanned route/API/client files.
- Query-count proxy: 22 Prisma call sites; 8 findMany; 2 count; 0 transactions; 0 raw queries.
- Render-count proxy: 10 useState, 24 useEffect, 0 Suspense boundaries across scanned client/server components.
- Cold load: not measured.
- Warm load: not measured.
- Exact wait point: Users wait on CAT pool count/findMany, answer history, adaptive state persistence, and per-question adaptive selection/feedback queries.

| File | Size | Prisma | findMany | count | tx | fetch | useState | useEffect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `src/components/student/practice-test-runner-client.tsx` | 194 KB | 0 | 0 | 0 | 0 | 8 | 10 | 24 |
| `src/lib/practice-tests/cat-pool.ts` | 22 KB | 5 | 3 | 2 | 0 | 0 | 0 | 0 |
| `src/lib/practice-tests/cat-session.ts` | 46 KB | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/lib/cat/answer-history.ts` | 7 KB | 4 | 3 | 0 | 0 | 0 | 0 | 0 |
| `src/lib/cat/session-persistence.ts` | 18 KB | 7 | 1 | 0 | 0 | 0 | 0 | 0 |
| `src/app/api/practice-tests/[id]/route.ts` | 35 KB | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| `src/app/api/practice-tests/[id]/question/route.ts` | 8 KB | 2 | 0 | 0 | 0 | 0 | 0 | 0 |

## Highest-Impact Fix Order

1. Add authenticated Playwright tracing for the eight flows with request/response byte counts, Server-Timing, and browser performance entries. Current source has budget tests, but not this full per-flow evidence matrix.
2. Lesson detail: remove duplicate profile reads and make legacy ContentItem fallback a single bounded branch after pathwayLesson miss; defer related/practice blocks until after article shell.
3. Flashcard session: cache/count-only custom-session responses already exist, but includeCards path still does multi-source pool generation. Persist a short-lived generated pool by filter signature before hydrating full cards.
4. Practice/CAT launch: precompute readiness/discovery counts and avoid blocking launch UI on analytics panels.
5. Practice/CAT session: batch adaptive question hydration and answer-history lookups so per-question progression does not repeatedly hit practiceTest/examQuestion.

## Evidence Anchors

- Flashcard launcher already measures server bootstrap time at `src/app/(app)/app/(learner)/flashcards/page.tsx:137` and logs `server_shell_ready` at `src/app/(app)/app/(learner)/flashcards/page.tsx:453`; its blocking inventory load starts at `src/app/(app)/app/(learner)/flashcards/page.tsx:389`.
- Lesson launcher performs learner profile lookup at `src/app/(app)/app/(learner)/lessons/page.tsx:250`, then the client results component performs follow-up lesson API fetches at `src/components/student/learner-lessons-responsive-results.tsx:230` and `src/components/student/learner-lessons-responsive-results.tsx:284`.
- Lesson detail repeats user/profile reads at `src/app/(app)/app/(learner)/lessons/[id]/page.tsx:317`, `src/app/(app)/app/(learner)/lessons/[id]/page.tsx:356`, and `src/app/(app)/app/(learner)/lessons/[id]/page.tsx:581`.
- Flashcard session pool generation begins in `src/lib/flashcards/build-flashcard-custom-session.ts:207`; it queries dedicated flashcards at `src/lib/flashcards/build-flashcard-custom-session.ts:285` and `src/lib/flashcards/build-flashcard-custom-session.ts:424`, question-derived cards at `src/lib/flashcards/build-flashcard-custom-session.ts:459`, and progress filters at `src/lib/flashcards/build-flashcard-custom-session.ts:680` and `src/lib/flashcards/build-flashcard-custom-session.ts:733`.
- Flashcard session persistence/hydration uses deck/session/attempt reads in `src/lib/flashcards/flashcard-session-dal.server.ts:66`, `src/lib/flashcards/flashcard-session-dal.server.ts:90`, `src/lib/flashcards/flashcard-session-dal.server.ts:182`, `src/lib/flashcards/flashcard-session-dal.server.ts:197`, `src/lib/flashcards/flashcard-session-dal.server.ts:204`, and `src/lib/flashcards/flashcard-session-dal.server.ts:205`.
- Practice launcher client-side wait points are discovery at `src/components/student/practice-tests-hub-client.tsx:239` and session creation at `src/components/student/practice-tests-hub-client.tsx:394`.
- Practice/CAT session runner fetches and saves against `/api/practice-tests/${testId}` repeatedly at `src/components/student/practice-test-runner-client.tsx:824`, `src/components/student/practice-test-runner-client.tsx:939`, `src/components/student/practice-test-runner-client.tsx:1271`, `src/components/student/practice-test-runner-client.tsx:1314`, `src/components/student/practice-test-runner-client.tsx:1360`, and `src/components/student/practice-test-runner-client.tsx:1518`; adaptive post-miss feedback is requested at `src/components/student/practice-test-runner-client.tsx:1432`.
- CAT pool selection counts and fetches candidate questions in `src/lib/practice-tests/cat-pool.ts:122`, `src/lib/practice-tests/cat-pool.ts:160`, `src/lib/practice-tests/cat-pool.ts:172`, `src/lib/practice-tests/cat-pool.ts:207`, `src/lib/practice-tests/cat-pool.ts:327`, `src/lib/practice-tests/cat-pool.ts:348`, and `src/lib/practice-tests/cat-pool.ts:360`.
- CAT answer history performs repeated practice-test history reads in `src/lib/cat/answer-history.ts:44`, `src/lib/cat/answer-history.ts:83`, `src/lib/cat/answer-history.ts:109`, and `src/lib/cat/answer-history.ts:176`; CAT session persistence reads/updates practice tests in `src/lib/cat/session-persistence.ts:278`, `src/lib/cat/session-persistence.ts:416`, `src/lib/cat/session-persistence.ts:435`, and `src/lib/cat/session-persistence.ts:466`.

## Authenticated Timing Gap

- No paid learner Playwright storage state was present at `tests/e2e/.auth/paid-user.json` or `playwright/.auth/learner-paid.json`.
- No paid learner credential env vars were set (`QA_PAID_*`, `E2E_PAID_*`, `PLAYWRIGHT_TEST_*`).
- Because these routes are protected, anonymous cold/warm HTTP timings would measure redirects or login shells, not the learner activities. They are intentionally excluded from the conclusion.
