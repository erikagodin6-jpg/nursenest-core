# Performance Remediation Phase 2 Results

Generated: 2026-06-01

## Scope

Implemented latency removal only. No UI redesign, scoring change, CAT logic change, flashcard learning logic change, schema change, or migration was introduced.

## Implemented Changes

### 1. Flashcard Session Startup

Files:

- `src/lib/flashcards/flashcard-pool-snapshot.server.ts`
- `src/lib/flashcards/build-flashcard-custom-session.ts`

Changes:

- Added a server-only `FlashcardPoolSnapshot` runtime cache keyed by pathway.
- Cached merged lesson-derived virtual flashcards and diagnostics for 60 seconds.
- Reused the snapshot in both the count/inventory path and the full custom-session pool path.
- Preserved the existing published-content filters, source filtering, category filtering, topic filtering, progress filtering, entitlement gating, and session return shape.

Before:

- Flashcard session static startup path: 26 Prisma call sites.
- Flashcard session static startup path: 12 `findMany` call sites.
- Lesson-derived virtual flashcard generation could reload pathway lessons twice across inventory and launch flows for the same pathway.

After:

- Warm pathway snapshot removes repeated pathway lesson reads and virtual-card merging from normal session startup.
- Cold path remains behavior-equivalent and falls back to the current content loaders.
- Static source call-site count remains 26/12 because the live fallback and deck/session DAL code still exist, but the hot repeated pathway-virtual pool work is now cached behind one snapshot loader.

### 2. CAT Startup

Files:

- `src/lib/practice-tests/cat-practice-readiness.ts`
- `src/lib/practice-tests/cat-pool.ts`
- `src/lib/practice-tests/cat-session.ts`
- `src/lib/practice-tests/pick-question-ids.ts`

Changes:

- Added `CatReadinessSummaryCache` for CAT readiness preflight results with a 60-second TTL.
- Excluded staff diagnostics from readiness caching so admin diagnostics remain live.
- Hardened CAT pool cache keys to include pathway, selection mode, topics, difficulty range, strictness, question count, and session salt.
- Changed the adaptive CAT pick continuation path to reuse the safe cached CAT pool.
- Changed linear practice question picking to reuse the same safe cached pool path.
- Preserved existing CAT validation, blueprint weighting, adaptive selection, recent-question filtering, answer history, and scoring logic.

Before:

- CAT session static startup path: 22 Prisma call sites.
- CAT session static startup path: 8 `findMany` call sites.
- Readiness preflight could recompute within repeated launch checks.
- Adaptive continuation path bypassed the existing CAT pool cache.

After:

- Warm CAT readiness checks return from process cache.
- Warm CAT pool reads can reuse Redis/content cache without mixing different filter sets.
- Adaptive continuation and linear practice now share the cacheable pool path safely.
- Static source call-site count remains 22/8 because live fallback paths still exist, but warm startup avoids repeated readiness/pool work.

### 3. Practice/CAT Runner Initial Bundle

File:

- `src/components/student/practice-test-runner-client.tsx`

Changes:

- Lazy-loaded non-startup panels:
  - `PostExamAdaptiveReport`
  - `SmartReviewLayout`
  - `StudyPlanFromResults`
  - `PracticeTestTeachingReviewPanel`
  - `PracticeTestStudyLoopNext`
  - `PracticeRationaleFullPanel`
  - `PracticeAdaptivePostMissPanel`
  - `BowtieQuestionRenderer`
- Preserved the current runner shell, question state, answer save/submit flow, timer behavior, CAT progression, and rationale behavior.

Before:

- Runner source proxy: 183 KB in the original plan; current source proxy measured at 199,405 bytes after existing unrelated edits.
- Heavy review/results/adaptive panels were statically imported in the startup chunk.

After:

- Review/results/remediation/question-specialty panels are split behind dynamic imports.
- Initial source file still measures 199,405 bytes because dynamic import call sites remain in the same orchestrator, but the imported panel modules are no longer required in the initial client chunk.

### 4. Learner Context Cache

Files:

- `src/lib/learner/load-learner-activity-context.ts`
- `src/app/(app)/app/(learner)/flashcards/page.tsx`
- `src/app/(app)/app/(learner)/lessons/page.tsx`

Changes:

- Added `loadLearnerActivityContext()` with a 60-second server runtime cache.
- Cached learner pathway, country, tier, allied profession key, and measurement preference.
- Applied it to the flashcard launcher profile bootstrap.
- Applied it to the lesson launcher profile bootstrap.
- Entitlements remain resolved through the existing DB-backed entitlement chain and existing 60-second runtime entitlement cache.

Before:

- Flashcard launcher performed a route-local user profile lookup for `learnerPath`.
- Lesson launcher performed a route-local user profile lookup for `learnerPath`, `alliedProfessionKey`, and `tier`.

After:

- Both routes use the shared learner activity context cache.
- Repeated protected activity navigation within 60 seconds avoids duplicate learner metadata reads.

## Current Metrics

Static audit regenerated with:

```bash
node scripts/learning-activity-performance-audit.mjs
```

Current static source-trace output:

| Area                                    |               Before |                                                                After |
| --------------------------------------- | -------------------: | -------------------------------------------------------------------: |
| Flashcard session Prisma call sites     |                   26 |                                    26 static / fewer warm-path reads |
| Flashcard session `findMany` call sites |                   12 |       12 static / snapshot avoids repeated lesson virtual pool reads |
| CAT session Prisma call sites           |                   22 |                     22 static / readiness and pool warm paths cached |
| CAT session `findMany` call sites       |                    8 |                              8 static / continuation path now cached |
| Practice runner source proxy            | 183 KB plan baseline | 199,405 bytes source / heavy panels lazy-loaded out of initial chunk |
| Flashcard launcher profile lookup       |  route-local DB read |                                     shared 60s learner context cache |
| Lesson launcher profile lookup          |  route-local DB read |                                     shared 60s learner context cache |

## Verification

Passed:

```bash
npx prettier --write <phase2 files>
npx eslint <phase2 files>
npm run typecheck:critical
node scripts/learning-activity-performance-audit.mjs
node scripts/production-performance-investigation.mjs
npm run test:unit:flashcards
npm run test:unit:practice
npm run test:unit:cat
```

ESLint result:

- 0 errors.
- 4 existing `react-hooks/exhaustive-deps` warnings in `practice-test-runner-client.tsx`.

Targeted unit results:

- Flashcards: 5 passed, 0 failed.
- Practice: 14 passed, 0 failed.
- CAT: 135 passed, 0 failed.

Repo-wide checks:

```bash
npm test
```

Result:

- Failed on existing environment/configuration and unrelated contract failures, including missing `DATABASE_URL` in built `.next` route tests, DigitalOcean spec validator expectations, standalone artifact fixture/i18n fixture gaps, pricing env availability, and homepage ecosystem contract drift.

```bash
npm run typecheck
```

Result:

- Failed before reaching these Phase 2 files because `src/lib/learner/smart-study-next-engine.ts` has existing syntax errors at lines 70, 115, and 124.

## Phase 2 Verdict

Phase 2 latency work is implemented for the highest-impact safe paths that can be changed without altering learner behavior or learning logic:

- Flashcard pathway pool snapshot: complete.
- CAT readiness cache: complete.
- Safe CAT pool cache key and reuse: complete.
- Practice/CAT heavy panel lazy-loading: complete.
- Learner activity context cache: complete.

Performance certification remains dependent on authenticated cold/warm Playwright timings and production bundle traces, which were not available in this local shell.
