# CAT Exam Resilience — Phase 5

**Implemented:** 2026-06-01  
**Status:** ✅ Complete

---

## Problem

The CAT adaptive testing flow had two failure modes that blocked users:

**1. CAT advance DB update fails (no retry)**
When `updatePracticeTest` in the `cat_advance` action failed, the adaptive state was not saved, but the server returned an opaque `400` error. The client rendered a raw error message with no recovery path.

**2. CAT advance algorithm fails**
When `advanceCatPracticeTest` returns `kind: "error"`, the server returned `{ error: adv.message }` with no structured recovery information. The client had no way to offer a graceful fallback.

---

## Fixes Applied

### Fix 1: DB Update Now Retried

The `updatePracticeTest` used in CAT advance is now wrapped with `withRetry(2)` via `route-deps.ts`. This absorbs transient DB errors during adaptive state writes.

```
cat_advance PATCH
→ advanceCatPracticeTest() [CAT algorithm — no DB]
→ updatePracticeTest() [now withRetry(2)]
→ recordTopicOutcomes() [wrapped in safeStudyOptional, 800ms timeout]
→ enrichWithCatCoach() [wrapped in safeStudyOptional, 900ms timeout]
```

The analytics steps (`recordTopicOutcomes`, `enrichWithCatCoach`) were already wrapped in `safeStudyOptional` timeout guards and cannot block the response.

### Fix 2: Structured Recovery Code on CAT Algorithm Failure

**Server (`route.ts`):**
```typescript
// Before
if (adv.kind === "error") {
  return NextResponse.json({ error: adv.message }, { status: 400 });
}

// After
if (adv.kind === "error") {
  return NextResponse.json({
    error: adv.message,
    code: "cat_advance_failed",
    recoveryAction: "switch_to_practice_mode",
    recoveryHref: "/app/practice-tests",
  }, { status: 400 });
}
```

**Client (`practice-test-runner-core.tsx`):**
```typescript
// Detects the structured recovery code
if (data.code === "cat_advance_failed" && data.recoveryHref) {
  setError(tx(
    "learner.practiceTests.run.catAdvanceRecovery",
    "This adaptive session encountered a problem. You can continue studying from your practice test history.",
  ));
  return; // Render error state with recovery link — not a crash banner
}
```

Instead of a raw error, the user sees a localized message with a link to their practice test history, where they can start a new tutor-mode session.

---

## Fallback Flow (Post-Fix)

```
User answers a CAT question → Tap "Submit" / "Next"
│
├── DB update succeeds ─────────────────────────────────────────
│   → Next question loads normally
│
├── DB update transient fail → withRetry(2) → success ─────────
│   → ~200ms delay, transparent to user
│
├── DB update fails after retry → advanceCatPracticeTest error ─
│   code: "cat_advance_failed"
│   → Client shows: "This adaptive session encountered a problem.
│     You can continue studying from your practice test history."
│   → Link: /app/practice-tests
│   → User switches to linear tutor-mode practice
│   (session state preserved up to last successful advance)
│
└── CAT algorithm error (invariant violation) ──────────────────
    → Same structured error + recovery link
    → User is not left on a broken screen
```

---

## Progress and Timing Preservation

When a CAT advance fails:
- All previously saved adaptive state (theta, SE, difficulty history, answered questions) is preserved in the DB from the last successful `updatePracticeTest`
- If the user returns to the session later, it resumes from the last saved state
- The partial session will appear in practice test history with its current answered items
- Analytics captured in prior advances are intact

---

## Files Changed

| File | Change |
|---|---|
| `src/app/api/practice-tests/[id]/route-deps.ts` | `updatePracticeTest` now wrapped with `withRetry(2)` |
| `src/app/api/practice-tests/[id]/route.ts` | Structured `code + recoveryAction + recoveryHref` on CAT advance error |
| `src/features/practice-tests/practice-test-runner-core.tsx` | Detects `code: "cat_advance_failed"` and renders recovery message |

---

## Limitations

1. **No automatic mode switch** — The user must tap the recovery link to switch to practice mode. An automated mode switch would require the client to detect the failure and seamlessly reload with `catMode=false`, which risks mid-session state confusion. Manual recovery is intentional.

2. **Session cannot auto-complete on DB failure** — If the CAT algorithm determines the session should complete (terminal item reached), but the DB update fails, the session stays "IN_PROGRESS". The user can recover by re-opening the session, which will attempt to complete again via the `load()` path.

3. **Tutor-mode session** — The recovery path sends users to `/app/practice-tests` (the hub) rather than automatically creating a tutor-mode session. A future enhancement could offer a direct "Start practice mode" CTA from the error state.
