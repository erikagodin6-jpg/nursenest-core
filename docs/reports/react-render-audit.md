# React Render Audit

**Generated:** 2026-06-01  
**Scope:** Lessons, Flashcards, Practice, CAT, Dashboard

---

## Executive Summary

Five key student-facing surfaces were audited for unnecessary React renders. The audit identified three components that render 5+ times on page load due to non-batched async state updates, missing `useCallback` on functions passed as props, and missing `React.memo` on pure child components. Optimizations were applied to the three highest-impact files.

---

## Components Rendering >3× Per Page Load

| Component | File | Est. Renders | Primary Cause |
|---|---|---|---|
| `PracticeTestRunnerClient` | `src/features/practice-tests/practice-test-runner-client.tsx` | ~8–12 | 37 useState; `load()` sets 25+ state slices across 3 async waves; countdown timer renders 1/sec |
| `QuestionBankPracticeClient` | `src/features/question-bank/question-bank-practice-client.tsx` | ~6–8 | 32 useState; discovery fetch + batch load sequential; session timer 1/sec; `checkAnswer`/`next`/`prev` not `useCallback` |
| `FlashcardsHubClient` | `src/components/flashcards/flashcards-hub-client.tsx` | ~5–7 | 18 useState; hub prefs load + inventory fetch cascade; inline handlers in mapped children |
| `FlashcardStudyClient` | `src/components/flashcards/flashcard-study-client.tsx` | ~4–5 | 15 useState; card fetch on mount; `DeckStudyLauncher` not memoized; inline onStart/onReturn/onStudyProgress props |
| `ExamPracticeClient` (legacy) | `src/components/student/exam-practice-client.tsx` | ~4–6 | 22 useState; session resume + timer; NOT on any active route |

---

## Detailed Analysis by Surface

### Dashboard

**Verdict: No client render issues.** The dashboard page (`src/app/(app)/app/(learner)/page.tsx`) is a **Next.js Server Component** — it runs once on the server with no client-side re-renders. Client islands (`LockedDashboardOverlay`, `BenchmarkCard`, `ReadinessViewTracker`) are stateless or near-stateless (0–2 `useState` hooks).

| Component | File | Client Renders | Notes |
|---|---|---|---|
| `LearnerStudyHome` | `src/components/student/learner-study-home.tsx` | ~2 | Mount + data hydration |
| `BenchmarkCard` | `src/components/student/dashboard/benchmark-card.tsx` | ~1 | 0 useState, 2 useEffect |
| `LockedDashboardOverlay` | `src/components/student/dashboard/locked-dashboard-overlay.tsx` | ~1 | 0 useState |
| `ReadinessViewTracker` | `src/components/student/dashboard/readiness-view-tracker.tsx` | ~1 | 0 useState |

**No optimizations required.**

---

### Lessons

**Verdict: Server-rendered, no issues.** The lesson detail page (`src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/page.tsx`) is a Next.js Server Component. Client-side components on lesson pages (`LessonsToolbar`, `PathwayLessonPagination`, `PathwayLessonsHubSearch`) are all minimal — 0–3 `useState` hooks with no expensive computations.

**No optimizations required.**

---

### Flashcards

#### `FlashcardStudyClient` — **OPTIMIZED**

**File:** `src/components/flashcards/flashcard-study-client.tsx`

| Issue | Detail |
|---|---|
| `DeckStudyLauncher` not memoized | Re-renders on every `FlashcardStudyClient` state change even when its props haven't changed |
| Inline `onReturn` prop | `() => router.push("/app/flashcards")` — new function reference each render |
| Inline `onStart` prop | Complex multi-setState lambda recreated each render |
| Inline `onStudyProgress` prop | `(s) => saveDeckSessionCheckpoint(...)` recreated each render |
| Inline `onSessionComplete` prop | `() => clearDeckSessionCheckpoint(...)` recreated each render |
| Inline `onNeedMore` prop | `({ loadedCount }) => void prefetchMore(...)` recreated each render |

**Optimizations applied:**
- `DeckStudyLauncher` wrapped in `React.memo`
- `handleReturn`, `handleStart`, `handleStudyProgress`, `handleSessionComplete`, `handleNeedMore` extracted as `useCallback` hooks

**Estimated render reduction:** 4–5 → 3 renders on page load; `DeckStudyLauncher` eliminates all re-renders from parent state changes that don't affect launcher props.

---

#### `FlashcardsHubClient` — **Not modified**

**File:** `src/components/flashcards/flashcards-hub-client.tsx` (1381 lines)

| Issue | Detail |
|---|---|
| 18 `useState` hooks | Hub prefs + inventory fetch + pool preview = 3 async render waves |
| No `React.memo` at top level | Top-level hub; parent (page) renders are infrequent, memo would add overhead without benefit |
| Inline handlers in `<button>` map | `onClick={() => onSelectTopic(topic.id)}` inside `.map()` |

**Recommendation:** Extract topic/system selection handlers into `useCallback`-wrapped dispatchers. Defer until the hub is confirmed as a performance bottleneck — the component owns its subtree and parent re-renders are rare.

---

### Practice

#### `QuestionBankPracticeClient` — **OPTIMIZED**

**File:** `src/features/question-bank/question-bank-practice-client.tsx`

| Issue | Detail |
|---|---|
| `checkAnswer` not `useCallback` | Complex async function capturing `current`, `answer`, `pathwayIdFilter`, `graded`, `confidence`, `studySettings` — recreated each render |
| `next` not `useCallback` | Plain `function next()` — new reference each render, passed as `onClick` |
| `prev` not `useCallback` | Same as `next` |
| Session timer fires every 1s | `setSessionElapsedSec` increments every second → re-render per second during session |
| Filter `onChange` handlers inline | `onChange={(e) => setSessionSize(...)}` etc. — new function each render, but on native elements so impact is low |

**Optimizations applied:**
- `checkAnswer` wrapped in `useCallback`
- `next` wrapped in `useCallback`
- `prev` wrapped in `useCallback`

**Estimated render reduction:** Session timer renders unavoidable (by design). `useCallback` wrapping prevents unnecessary child re-renders when parent's timer state changes.

---

#### `ExamPracticeClient` — **Not modified** (legacy, not mounted)

**File:** `src/components/student/exam-practice-client.tsx`

This component is explicitly documented as "Not mounted on any current learner route." Issues documented for future cleanup when the component is re-activated:

| Issue | Detail |
|---|---|
| 22 `useState` hooks | Sequential async state sets on session resume |
| `startExamSession` not `useCallback` | 60-line async function recreated each render |
| `submitExam` not `useCallback` | Same pattern |
| `fetchQuestion` is `useCallback` ✓ | Correctly memoized |
| Inline `setCurrentIndex` / `setAnswers` handlers | `() => setCurrentIndex((i) => Math.max(0, i - 1))` repeated in review panel |

---

### CAT (Computer Adaptive Testing)

CAT sessions run through `PracticeTestRunnerClient` with `catMode = true`. The same component handles both linear and CAT delivery.

#### `PracticeTestRunnerClient` — **OPTIMIZED**

**File:** `src/features/practice-tests/practice-test-runner-client.tsx` (4936 lines)

| Issue | Render Count Impact |
|---|---|
| 37 `useState` hooks | `load()` sets ~25 state values across 3 async waves → 3–5 renders on init |
| Countdown timer effect (`setRemainingSec`) | 1 render/sec for every timed session in CAT or linear exam mode |
| 4 ref-sync `useEffect` hooks | Run on every render but don't trigger further renders (ref writes) |
| `setConfidenceForQuestion` not `useCallback` | Passed as callback via direct call in JSX; new reference each render |
| `toggleFlagForQuestion` not `useCallback` | Same pattern |
| `persistSave` not `useCallback` | Called by other handlers; recreated each render |
| `catAdvance` not `useCallback` | Complex async; captured in `catAdvanceLatestRef.current` |
| `goNext` / `goPrev` not `useCallback` | Navigation handlers passed inline; new reference each render |

**Already correctly memoized in this file:**
- `tx`, `resolveMeasureText`, `logSessionEvent`, `load`, `prefetchQuestionAtIndex`, `submitTest`, `finalizePracticeSessionEarly`, `lockCatExamAnswer`

**Optimizations applied:**
- `setConfidenceForQuestion` wrapped in `useCallback`
- `toggleFlagForQuestion` wrapped in `useCallback`

**Not converted (high dependency complexity, risk of stale closure bugs):**
- `persistSave` — captures `sessionStartMs`, `testId`, `error`; would require `useCallback` deps that change frequently
- `catAdvance` — 200-line async function; captured in `catAdvanceLatestRef.current` for self-referential calls
- `goNext` / `goPrev` — call `catAdvance` and `persistSave`; requires those to be stable first

---

## Optimization Impact Summary

| File | Change | Benefit |
|---|---|---|
| `flashcard-study-client.tsx` | `React.memo(DeckStudyLauncher)` + 5 `useCallback` handlers | Launcher skips re-render on parent state changes |
| `question-bank-practice-client.tsx` | `useCallback` for `checkAnswer`, `next`, `prev` | Stable references prevent child component churn |
| `practice-test-runner-client.tsx` | `useCallback` for `setConfidenceForQuestion`, `toggleFlagForQuestion` | Stable callbacks for confidence / flag UI widgets |

---

## Render Cause Reference

| Pattern | Description | Fix |
|---|---|---|
| **Cascading async state** | Multiple `setState` calls across async microtasks | React 18 batches within `startTransition`; avoid sequential independent `setState` outside batching |
| **Inline JSX handlers** | `onClick={() => fn()}` inside render — new reference each call | `useCallback` for handlers passed to memoized children |
| **Unmemoized child components** | Child re-renders whenever parent renders, even if props unchanged | `React.memo` on pure child components |
| **Timer effects** | `setInterval` → `setState` every N ms | Unavoidable by design; isolate timer state into a separate component if it causes expensive subtree re-renders |
| **Missing `useMemo` on derived data** | Array `.filter()`, `.map()` recomputed each render | `useMemo` when result is passed as stable prop to `React.memo` children |

---

## Non-Issues (Confirmed)

- **Dashboard page**: Server component; no client render budget
- **Lessons page**: Server component; client islands are minimal
- **`DeckStudyLauncher` topic/limit buttons**: Inline handlers inside a memoized component are fine — the component only re-renders when its props change after memoization
- **`ExamSessionShell`**: Wrapper with CSS only; no state; renders once
- **`ExamProgressBar`**: Pure display; 0 state; already stable
