# RN Dashboard Launch Hardening Integration

## Purpose

This guide wires the new RN launch-hardening components into the existing dashboard without a broad refactor.

New component file:

```txt
client/src/components/dashboard/rn-launch-hardening-panels.tsx
```

The goal is to improve dashboard hierarchy, mobile clarity, weak-area remediation, and readiness actionability using the current dashboard architecture.

---

# Components Added

```tsx
import {
  RNContextHeader,
  ResumeHero,
  WeakAreasInterventionPanel,
  PrimaryStudyModesGrid,
  ReadinessActionSummary,
  buildWeakAreaActions,
  getReadinessLabel,
} from "@/components/dashboard/rn-launch-hardening-panels";
```

---

# Lowest-Risk Integration Path

## Step 1 — Import Components

Add the import near the other dashboard imports in:

```txt
client/src/pages/dashboard.tsx
```

---

## Step 2 — Derive RN Launch Data

Inside `DashboardPage`, after `visibleWidgets` is defined, derive these values:

```tsx
const activeSession = summary?.continueWhereYouLeftOff?.[0];
const readinessScore = summary?.readiness?.readinessScore || summary?.readiness?.readiness || undefined;
const readinessLabel = getReadinessLabel(readinessScore);
const recommendedAction = summary?.recommendedNextAction;

const weakAreaActions = buildWeakAreaActions(summary?.recommendations || []);

const resumePrimaryAction = activeSession?.resumePath
  ? {
      label: "Resume session",
      href: activeSession.resumePath,
    }
  : recommendedAction?.path
  ? {
      label: recommendedAction.action || "Start recommended practice",
      href: recommendedAction.path,
    }
  : {
      label: "Start 5 practice questions",
      href: "/question-bank",
    };
```

If `summary.recommendations` is not available, use the existing recommendations API data from `WeakTopicsWidget` or leave `weakAreaActions` empty initially.

---

## Step 3 — Place RN Context Header Above Dashboard Header

Recommended placement:

After `<CommandCenter />` and before any first-time/new-user card.

```tsx
<RNContextHeader
  pathway={user?.tier === "rn" ? "RN Exam Pathway" : "Nursing Exam Pathway"}
  readinessLabel={readinessLabel}
  readinessScore={readinessScore}
  currentFocus={weakAreaActions[0]?.title}
  resumeAction={resumePrimaryAction}
/>
```

This gives mobile users immediate context and a resume shortcut.

---

## Step 4 — Add Resume Hero Before Widgets

Place before the widget grid, after the dashboard title/header block.

```tsx
{!summaryLoading && (
  <ResumeHero
    title={activeSession ? "Continue Studying" : "Start Your Next Best Step"}
    subtitle={activeSession?.title || recommendedAction?.description || "A short focused session is the fastest way to build momentum."}
    progressLabel={activeSession?.progress}
    primaryAction={resumePrimaryAction}
    secondaryAction={{ label: "Review weak areas", href: "/exam-readiness" }}
  />
)}
```

Acceptance:
- one primary action
- one secondary max
- no charts in this area
- visible above fold on mobile

---

## Step 5 — Add Weak Areas Panel Immediately After Resume Hero

```tsx
{!summaryLoading && (
  <WeakAreasInterventionPanel areas={weakAreaActions} />
)}
```

If weak areas are not yet available in the dashboard summary, leave this panel empty. It will show a safe empty state telling the learner to complete questions/CAT.

---

## Step 6 — Add Primary Study Modes Grid

Place after Weak Areas and before the existing widget sections.

```tsx
<PrimaryStudyModesGrid />
```

This ensures the four major study paths are visible without forcing the user through scattered widgets.

---

## Step 7 — Add Readiness Action Summary

Place after Primary Study Modes and before existing analytics/progress-heavy widgets.

```tsx
<ReadinessActionSummary
  readinessLabel={readinessLabel}
  readinessScore={readinessScore}
  strongestArea={summary?.readiness?.strongestArea}
  nextFocus={weakAreaActions[0]?.title}
  recommendation={
    weakAreaActions[0]?.action ||
    (recommendedAction?.path
      ? { label: recommendedAction.action || "Start recommended practice", href: recommendedAction.path }
      : undefined)
  }
/>
```

Acceptance:
- readiness has a plain-language label
- learner sees a next action
- charts/details remain secondary

---

# Optional: Hide Duplicate Widgets Outside Editing Mode

Once the launch-hardening panels are added, some old widgets duplicate the same jobs.

Recommended to hide in normal mode only:

```tsx
const launchHardeningDuplicates = new Set([
  "continue_where_left_off",
  "weak_topics",
  "exam_readiness",
  "quick_links",
]);

const visibleWidgets = activeWidgets.filter((w) =>
  w.visible &&
  WIDGET_COMPONENTS[w.widgetType] &&
  !launchHardeningDuplicates.has(w.widgetType)
);
```

Keep these visible while `editing === true` so the user can still customize their dashboard.

This avoids duplicate Resume/Weak Areas/Readiness/Quick Links content fighting with the new hierarchy.

---

# Recommended Final Dashboard Order

```txt
Command Center
RN Context Header
Dashboard Header
Resume Hero
Weak Areas Intervention Panel
Primary Study Modes
Readiness Action Summary
Existing remaining widgets
```

---

# Do Not Do

Do not:
- rebuild `dashboard.tsx`
- rewrite the widget system
- rebuild readiness scoring
- rebuild weak-area recommendations
- create a new routing system
- do a full design-system refactor

This is a wiring task.

---

# Acceptance Checklist

## Desktop

- Resume Hero appears before widget grid
- Weak Areas appear before analytics/progress-heavy sections
- Primary Study Modes appear as four clear paths
- Readiness gives a next action
- duplicate old widgets are hidden or lower-priority

## Mobile

- Context and Resume are visible before deep scrolling
- no horizontal overflow
- primary CTA is at least 44px tall
- weak-area panel does not show more than 3 visible items
- analytics are not first-screen content

## Cost Control

This should be a small integration task, not a rewrite.

Expected time if developer knows the file:

```txt
1–2 hours for integration
1 hour for mobile QA/cleanup
```

Anything larger needs justification tied to a specific broken data shape or route issue.
