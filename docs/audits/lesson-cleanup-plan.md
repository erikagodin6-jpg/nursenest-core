# Lesson Cleanup Plan
**Generated:** 2026-05-30  
**Status:** Pre-implementation analysis — no changes made

---

## Summary

The lesson architecture is sound. Do NOT redesign it. The existing structure — left nav, progress tracking, clinical illustrations, section flow, previous/next navigation — is correct and should be preserved.

Three specific problems need fixing:
1. Pre/post assessment flow is correct but lacks skip persistence
2. Admin edit controls leak into the learner view (see admin-leakage-audit.md)
3. No marketing clutter found — the bottom zone is correctly educational (retention review)

---

## What Is Already Good — Keep These

### ✅ Left Navigation (Lesson Index)
The left sidebar showing the lesson index, section progress, and previous/next lesson is well-designed. Do not change it.

### ✅ Progress Tracking
Lesson completion tracking, section-level progress, and mastery score display are correct.

### ✅ Clinical Illustrations
`LessonClinicalImageCard` component renders properly and should not be changed.

### ✅ Structured Lesson Sections
The premium layout with `nn-lesson-layout--premium-reading` and the section flow is the correct architecture. Do not redesign.

### ✅ Retention Review Zone
The "Retention & exam readiness" section at the bottom (`nn-lesson-retention-review-zone`) is educational content — clinical pearls, traps, safety priorities, related concepts. This is NOT marketing clutter. It serves a real educational purpose.

### ✅ Related Questions Cross-Link
`loadRelatedExamQuestionStemsForPathwayLesson` loads 3-5 practice questions related to the lesson topic. This is valuable — it connects lessons directly to the question bank. Keep this.

### ✅ Pre-Lesson Assessment (`lesson-pre-assessment-card.tsx`)
The component already has:
- Idle state with "Start Assessment" + **"Skip" button** (line ~30 in the component)
- Running state (interactive quiz)
- Complete state (score + "Begin lesson")
- Skipped state (renders nothing)

The skip functionality already exists. **No architecture change needed.**

---

## Problem 1 — Skip Preference Not Persisted

### Current behaviour
The "Skip" button on pre-lesson assessments is functional during a session. However, if a learner prefers to always skip, they must press Skip on every lesson they open.

### Required behaviour
Add a user preference: `showPreLessonAssessments: boolean` (default ON).

When `showPreLessonAssessments = false`:
- Pre-assessment card renders directly in `skipped` state
- Post-assessment is also skipped
- The lesson opens immediately

### User preference toggle
Location: Account Settings → Study Preferences

```
□ Show pre-lesson readiness checks (recommended)
□ Show post-lesson review questions
```

### Implementation

**New preference field** (no Prisma migration needed — store in `User.studyGoal` JSON or add a lightweight `user_preferences` table):

```typescript
interface LessonAssessmentPreferences {
  showPreLessonAssessment: boolean;   // default true
  showPostLessonAssessment: boolean;  // default true
}
```

**In lesson page:**
```typescript
const prefs = await loadLessonAssessmentPreferences(userId);
const skipPre = !prefs.showPreLessonAssessment;

// Pass to pre-assessment card:
<LessonPreAssessmentCard
  initialState={skipPre ? "skipped" : "idle"}
  // ...
/>
```

**Effort:** Small — 1 preference field + 1 settings toggle + 1 prop change

---

## Problem 2 — Admin Controls in Lesson View

See `admin-leakage-audit.md`. The fix is a "View As User" toggle, not a lesson-specific change.

---

## Problem 3 — Confirmation: No Marketing Clutter Found

Reviewing the lesson detail page carefully:

| Section | Content Type | Keep/Remove |
|---|---|---|
| Lesson body (sections) | Educational content | ✅ Keep |
| Retention review zone | Clinical pearls, traps, recalls | ✅ Keep |
| Related question stems | Practice questions for this topic | ✅ Keep |
| Previous/Next lesson navigation | Navigation | ✅ Keep |
| Pre-assessment card | Diagnostic quiz | ✅ Keep (with skip pref) |
| Post-assessment | Reinforcement questions | ✅ Keep (with skip pref) |
| Staff edit banner | Admin control | Fix via "View As User" |
| Inline edit icons | Admin control | Fix via "View As User" |

**No marketing links, pricing blocks, blog teasers, or promotional content found in the learner lesson page.** The concerns raised may be from the PUBLIC marketing lesson pages at `/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/`, which do have cross-sell content. Those are correct for marketing pages.

---

## Pre/Post Assessment User Flow

### Current flow
```
Open lesson
  ↓
Pre-assessment card (idle state)
  ├── [Start Assessment] → quiz → score → [Begin Lesson]
  └── [Skip] → lesson opens immediately
```

### Required flow (with preference)
```
Open lesson
  ↓
  if (showPreLessonAssessment && hasPretestQuestions)
    Pre-assessment card (idle state)
      ├── [Start Assessment] → quiz → score → [Begin Lesson]
      └── [Skip] → lesson opens immediately
  else
    Lesson opens immediately (assessment in skipped state)
```

---

## Implementation Priority

| Fix | File | Effort | Priority |
|---|---|---|---|
| Add `showPreLessonAssessment` preference | `src/lib/lessons/lesson-assessment-preferences.ts` (new) | Small | P1 |
| Settings UI toggle | `src/app/(app)/app/(learner)/account/` | Small | P1 |
| Connect preference to lesson page | `lessons/[id]/page.tsx` | Trivial | P1 |
| View As User toggle (admin leakage) | See admin-leakage-audit.md | Small | P0 |

---

## What NOT To Change

| Item | Reason |
|---|---|
| Lesson layout structure | Already correct |
| Left navigation | Already correct |
| Progress tracking | Already correct |
| Clinical illustrations | Already correct |
| Retention review zone | Educational content, not clutter |
| Related questions | Valuable cross-link |
| Section flow | Already correct |
| Premium reading layout | Already correct |

---

## Files That Are Fine As-Is

- `src/components/lessons/lesson-clinical-image-card.tsx` — no changes
- `src/components/lessons/lesson-pre-assessment-card.tsx` — skip button already exists
- `src/app/(app)/app/(learner)/lessons/layout.tsx` — minimal, correct
- All lesson CSS files — no changes

---

## Files That Need Changes

| File | Change |
|---|---|
| `src/app/(app)/app/(learner)/account/study-preferences/page.tsx` (new) | Add lesson assessment preferences UI |
| `src/lib/lessons/lesson-assessment-preferences.ts` (new) | Read/write preference |
| `src/app/(app)/app/(learner)/lessons/[id]/page.tsx` | Read preference, pass to pre-assessment card |
| `src/lib/staff/staff-view-mode.ts` (new) | Staff view mode toggle |
