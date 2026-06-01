# Learning Activity Root Cause Remediation Plan

Generated: 2026-06-01

## Scope

This plan converts the completed learning activity investigation into latency-removal work only. It does not add features, alter UI, or change product behavior. The counts below are source-trace counts from the current route, API, and client files. Runtime React render counts require React Profiler traces; this plan therefore reports:

- **React components**: component definitions in the scanned route path.
- **Render-trigger sites**: `setState` call sites that can trigger additional renders.
- **Effects**: `useEffect` call sites that can trigger browser-side work after mount.
- **Data transferred**: scanned source-size proxy until production bundle/request byte traces are recorded.

## Phase 1: Bottleneck Matrix

| Rank | Route | Prisma ops | findMany | API calls | React components | useEffect | Render triggers | Data proxy | Primary bottleneck |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | CAT Session | 22 | 8 | 7 | 4 | 24 | 131 | 317.5 KB | Large runner plus CAT pool, answer history, adaptive state persistence, and repeated session APIs. |
| 2 | Practice Session | 4 | 1 | 7 | 5 | 24 | 130 | 233 KB | One very large client runner with many effects and repeated save/fetch paths. |
| 3 | Flashcard Session | 26 | 12 | 0 | 3 | 0 | 1 | 96.1 KB | Multi-source pool generation, progress filters, deck/session persistence, and hydration. |
| 4 | Flashcards | 1 | 0 | 1 | 6 | 6 | 134 | 110.3 KB | Launcher shell is lightweight server-side, but client state management is high. |
| 5 | Practice | 5 | 3 | 3 | 6 | 5 | 61 | 103.6 KB | Discovery/readiness/performance calls after shell plus create-session path. |
| 6 | CAT Launch | 4 | 3 | 2 | 6 | 2 | 25 | 81.8 KB | CAT readiness preflight plus POST session creation. |
| 7 | Lesson Detail | 7 | 0 | 3 | 6 | 5 | 30 | 75.8 KB | Duplicate learner/pathway/profile reads and related study-loop hydration. |
| 8 | Lessons | 12 | 4 | 3 | 4 | 2 | 14 | 63.4 KB | Content counts, pathway samples/lists, and client result fetches. |

## Phase 2: Duplicate Work To Remove

| Area | Current | Optimized | Expected effect |
| --- | --- | --- | --- |
| User/session lookup | Each protected page/API resolves subscriber/session independently. Practice/CAT startup can hit session gates on launcher, readiness, create, load, question, and answer routes. | Carry a request-scoped learner context through server loaders. For client API chains, return `userId`, pathway, entitlement tier, and country in the first bootstrap response and reuse it server-side through a short-lived context cache keyed by session id. | Removes repeated auth/profile DB pressure from sequential startup paths. |
| Learner profile/pathway lookup | Lesson launcher/detail and flashcard/practice launchers separately resolve learner path, compatible pathways, country, and tier. | Introduce a single `loadLearnerActivityContext(userId)` server helper with 30-60s memory/Redis cache for non-sensitive metadata: tier, country, active pathway ids, measurement preference, and pathway display metadata. | Faster first byte for Lessons, Lesson Detail, Flashcards, Practice, CAT Launch. |
| Readiness calculations | CAT launch calls readiness preflight, then POST `/api/practice-tests` recalculates readiness before creating the session. | Make readiness preflight return a signed or server-cacheable readiness token for pathway/user/version. POST validates freshness and skips recompute when still valid. | Removes one readiness pass from CAT launch. |
| Weak-area calculations | Practice hub and flashcard hub can separately request weak/readiness/performance summaries after mount. | Cache weak-area summaries by `userId:pathwayId:questionBankVersion` with short TTL and invalidate after answer submission. | Reduces post-shell API waterfall and dashboard pressure. |
| Flashcard counts | Launcher inventory and custom-session count paths can recompute category/deck/topic aggregates from live content. | Serve counts from precomputed pathway/category snapshots. Live DB fallback remains only for staff diagnostics or stale cache repair. | Keeps launcher under 1s and prevents aggregate scans during normal learner traffic. |
| Practice/CAT question hydration | Runner fetches full session, question details, saves, question endpoint, adaptive feedback, and completion state from one large client component. | Server bootstrap first question and minimal session state. Lazy-load review, teaching feedback, adaptive post-miss, report card, and completion panels after first question is visible. | Reduces first interactive route work and client render churn. |
| Lesson related study tools | Lesson detail can hydrate related/practice/study settings after the main content. | Keep lesson article/content shell independent. Load related tools below the fold using stale-while-revalidate metadata. | Main lesson content appears faster; related tools no longer block perceived lesson load. |

## Phase 3: Flashcard Session Optimization

### Current Flow

1. Normalize pathway/category/topic filters.
2. Optionally load pathway lessons for virtual flashcards.
3. Query dedicated `flashcard.findMany`.
4. Query question-derived `examQuestion.findMany`.
5. Merge dedicated and virtual cards.
6. Apply category/topic/source/progress filters.
7. Query `flashcardProgress.findMany` for weak/missed/bookmarked states.
8. Query deck/session data through `flashcard-session-dal.server.ts`.
9. Persist or resume session.
10. Hydrate final card pool.

Current pressure:

- 26 Prisma call sites.
- 12 `findMany` call sites.
- Large custom-session builder with multiple branches.
- Progress filters can trigger extra reads after the candidate pool is already assembled.

### Replacement Architecture

| Layer | New responsibility |
| --- | --- |
| `FlashcardPoolSnapshot` | Precomputed pathway/category/topic/deck inventory with card ids, source kind, category, topic, lesson id, question id, and status. Built offline or on publish/revalidate. |
| `FlashcardSessionPlanner` | Pure function. Takes selected systems/topics/source/progress mode and returns candidate ids from snapshot in memory. No DB. |
| `FlashcardProgressOverlay` | Single bounded query for user-specific progress rows only for candidate ids needed for this session. |
| `FlashcardSessionCreate` | One transaction: create/resume session and store selected card ids. |
| `FlashcardHydration` | One bounded `findMany` by selected ids with minimal fields for the first page/batch only. |

### Optimized Startup Target

| Step | Current | Optimized |
| --- | --- | --- |
| Pool discovery | Dedicated flashcard query + question-derived query + lesson virtual path | Snapshot read, zero DB on warm path |
| Progress filtering | One or more progress queries after broad candidate build | One bounded progress overlay query against candidate ids |
| Session persistence | Separate existing/create/load paths | Single upsert/resume transaction |
| Card hydration | Full candidate pool can be hydrated | Hydrate first 20-40 cards; prefetch next batch |

Estimated savings:

- Prisma call sites on startup: **26 -> 3-5**.
- `findMany` startup calls: **12 -> 1-2**.
- Data pulled before first card: **full pool -> first batch only**.
- Expected startup: **under 1 second warm**, **under 1.5 seconds cold** after snapshots are available.

## Phase 4: CAT Session Optimization

### Current Flow

1. CAT launch requests readiness.
2. POST `/api/practice-tests` may recalculate readiness.
3. CAT pool code performs counts and candidate `findMany`.
4. Session persistence stores adaptive state.
5. Runner loads large client component.
6. Runner fetches session.
7. Runner fetches question data and may request adaptive post-miss feedback.
8. Answer flow reloads pool/session/history and persists state.

Current pressure:

- 22 Prisma call sites.
- 8 `findMany` call sites.
- 7 client fetch sites in the runner path.
- 317.5 KB source-transfer proxy.
- 24 effects and 131 render-trigger sites in the shared runner path.

### Replacement Architecture

| Layer | New responsibility |
| --- | --- |
| `CatReadinessSummaryCache` | Cached per `userId:pathwayId:questionVersion`; contains eligible question count, blueprint coverage, and readiness gate. |
| `CatPoolSnapshot` | Cached pathway pool ids grouped by blueprint/category/difficulty. No broad question row fetch on launch. |
| `CatSessionBootstrap` | One endpoint returns session id, first question, progress shell, and timer config. |
| `CatQuestionBatchHydrator` | Hydrates first question plus next 3 candidate ids/questions, not the entire pool. |
| `CatAnswerCommand` | One endpoint records answer, updates adaptive state, and returns next hydrated question. |
| `CatAnalysisLazyLoad` | Analysis/report cards load only after completion, never during startup. |

### Optimized Startup Target

| Step | Current | Optimized |
| --- | --- | --- |
| Readiness | Preflight + create-path recomputation | Preflight token or cached summary reused by POST |
| Pool build | Count + candidate reads on startup | Snapshot ids + bounded first-question hydration |
| Runner | Large all-purpose client file | Thin session shell + lazy panels |
| Answer turn | Reload session/pool/history | Append answer command + return next question |

Estimated savings:

- Prisma call sites on startup: **22 -> 5-7**.
- `findMany` startup calls: **8 -> 2-3**.
- Client fetch startup calls: **7 -> 1-2**.
- Expected startup: **under 2 seconds**, with first question visible before analytics/report/review code loads.

## Phase 5: Practice Test Runner Split Plan

File: `src/components/student/practice-test-runner-client.tsx`

Current:

- 187,364 bytes.
- 10 `useState` call sites.
- 24 `useEffect` call sites.
- 130-131 render-trigger sites depending on route mode.
- Handles standard practice, CAT, timer, confidence tools, flagging, cross-out, unsupported question UI, bowtie/matrix variants, adaptive feedback, teaching review, final study feedback, submission, completion, and retry/error states.

### Why It Is Large

| Responsibility | Evidence |
| --- | --- |
| Session bootstrap and cache | `load` callback and question cache state update many independent state slices. |
| Timer lifecycle | Multiple effects manage hydration recovery, interval updates, timeout submission, and elapsed state. |
| Practice save/submit | Separate save, submit, early finish, answer update, and adaptive miss paths. |
| CAT progression | CAT answer locking, advancing, adaptive feedback, final study feedback, and completion all live in the same file. |
| Question rendering variants | Bowtie, matrix, option ordering, inline teaching, unsupported UI, and tool state are all bundled. |

### Split Without UI Redesign

| Target module | Move from runner | Load strategy |
| --- | --- | --- |
| `PracticeSessionShell.server.tsx` | Initial session metadata, title, mode, pathway surface, timer config | Server component passes minimal props. |
| `PracticeQuestionClient.tsx` | Current question rendering, answer changes, confidence/flag/cross-out controls | Main client chunk. |
| `CatSessionController.tsx` | CAT lock/advance/termination/adaptive state | Dynamic import only for CAT sessions. |
| `PracticeSubmitController.tsx` | Save, submit, early finish, completion transition | Client component loaded with runner shell. |
| `TeachingReviewPanel.tsx` | Teaching review loading and display | Lazy-loaded on demand. |
| `AdaptivePostMissPanel.tsx` | Post-miss remediation call/display | Lazy-loaded after answer commit. |
| `PracticeResultsPanel.tsx` | Final results/report feedback | Lazy-loaded after completion. |
| `QuestionVariantRenderers/*` | Bowtie, matrix, trend, ordered-response renderers | Dynamic import by question type. |

Target:

- Reduce initial runner bundle by **50%+**: 187 KB -> **90 KB or less**.
- Reduce startup effects from **24 -> 8-10** on initial load.
- Keep answer/session behavior unchanged.

## Phase 6: Caching Plan

Do not cache active sessions, submitted answers, in-progress CAT state, or user response payloads.

| Data | Cache? | Scope | TTL / invalidation | Reason |
| --- | --- | --- | --- | --- |
| Lesson metadata | Yes | pathwayId, locale, published version | 15-60 min; invalidate on lesson publish/archive | Static catalog data. |
| Lesson detail shell | Yes | lessonId, locale, measurement system | 15 min; invalidate on lesson update | Main content should not wait on related tools. |
| Question counts | Yes | pathwayId, category, locale, status version | 15-30 min; invalidate on question publish/archive | Used by hubs and readiness gates. |
| Flashcard counts | Yes | pathwayId, category, topic, deck version | 15-30 min; invalidate on flashcard/question publish/archive | Prevents aggregate scans on launcher. |
| Flashcard pool snapshots | Yes | pathwayId, category/topic/source version | 15-30 min or content-versioned | Removes session-start pool scans. |
| Readiness scores | Yes | userId, pathwayId, question version | 5-15 min; invalidate after practice/CAT submission | Expensive but user-specific summary. |
| Weak-area summaries | Yes | userId, pathwayId, content version | 5-15 min; invalidate after question answer/session completion | Prevents repeated weak-area API work. |
| Performance summaries | Yes | userId, pathwayId, day bucket | 15 min; background refresh | Dashboard/report cards can tolerate short staleness. |
| Study plan summaries | Yes | userId, pathwayId | 15 min; invalidate on explicit plan update | Dashboard support data. |
| Active practice session | No | userId/sessionId | N/A | Must reflect current answer state. |
| Active CAT state | No | userId/sessionId | N/A | Adaptive state must be exact. |
| Submitted answers | No | userId/sessionId/questionId | N/A | Compliance and scoring correctness. |

## Highest-Impact Fix Order

| Priority | Fix | Effort | Impact | Expected speed improvement | Why first |
| ---: | --- | --- | --- | --- | --- |
| 1 | Flashcard session pool snapshots + first-batch hydration | Medium | Very High | 50-75% faster flashcard session startup | Removes the largest Prisma count: 26 ops / 12 `findMany`. |
| 2 | Practice/CAT runner split with lazy panels | High | Very High | 35-55% less initial JS and fewer startup effects | Practice/CAT sessions are the largest client bottleneck. |
| 3 | CAT readiness token/cache reused by POST create | Medium | High | 25-40% faster CAT launch | Removes duplicate readiness work between preflight and create. |
| 4 | CAT pool snapshot + bootstrap endpoint returns first question | High | Very High | CAT startup under 2s | Removes broad pool/count startup work and reduces API waterfall. |
| 5 | Request-scoped learner activity context cache | Medium | High | 100-300ms off most protected activity routes | Removes repeated profile/pathway/session metadata reads. |
| 6 | Lesson detail shell-first related tools | Low | Medium | 150-300ms faster perceived lesson load | Main lesson content no longer competes with related study tools. |
| 7 | Dashboard summary cache/background refresh | Medium | Medium | 300-800ms faster dashboard warm load | Reduces repeated analytics/readiness aggregation. |
| 8 | Practice launcher discovery/readiness summary cache | Low | Medium | 150-400ms faster warm launcher | Prevents repeated count/discovery calls after shell. |

## Implementation Guardrails

- Preserve active session correctness over speed. Cache only metadata, counts, summaries, and snapshots.
- Keep entitlements enforced server-side on every API route.
- Add timing assertions before and after each remediation using existing `Server-Timing`, `runWithApiTelemetry`, and Playwright budget tests.
- Do not add schema/index migrations until production `EXPLAIN` confirms the index shape.
- Do not start UI redesign work in this remediation track.

## Verification Plan

1. Record baseline with paid learner state:

```bash
npm run test:e2e:performance-budgets:record
node scripts/learning-activity-performance-audit.mjs
node scripts/production-performance-investigation.mjs
```

2. After each fix, compare:

- First content.
- Worst API duration.
- `Server-Timing: total`.
- Prisma slow-query logs.
- Request count.
- Transferred JS.

3. Certification targets:

- Lesson hub: under 1.5s.
- Lesson detail: under 1s.
- Flashcard launcher: under 1s.
- Flashcard session: under 1s.
- Practice launch/session: under 2s.
- CAT launch/session: under 2s.
- Dashboard: under 1.5s.
- p95 learning activity routes: under 3s.
