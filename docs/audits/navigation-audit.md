# Navigation Audit
**Generated:** 2026-05-30  
**Status:** Pre-implementation analysis — no changes made

---

## Summary

The platform has **one canonical navigation system** (`(learner)/layout.tsx`) that is correctly applied to all learner routes. The issues are specific and fixable without architectural changes.

**Overall verdict: Navigation is architecturally sound. Three targeted fixes required.**

---

## System Inventory

### System 1 — Global Learner Shell (CANONICAL — CORRECT)
**File:** `src/app/(app)/app/(learner)/layout.tsx`  
**Used by:** All routes under `/app/*` except `/app/modules/*`  
**Components:** `LearnerShellDesktopStudyLinks`, `LearnerShellMobileBottomNav`, `LearnerShellPathwayPill`, `LearnerShellUserBar`

This is the single correct navigation. It renders on:
- Lessons, Flashcards, Practice Tests, Questions
- Clinical Skills, Labs, Med Calculations
- Pharmacology, Physiology Monitor, Simulation Center
- Account, Profile, Onboarding, Study Plan, Coach

**Status: ✅ No action needed**

---

### System 2 — Account Section Nav (SUB-NAVIGATION — CORRECT)
**File:** `src/app/(app)/app/(learner)/account/layout.tsx`  
**Components:** `LearnerAccountNav` (sidebar), `LearnerAccountShellHeader`

Renders INSIDE the global shell (nested layout pattern). Global nav is fully present above it. This is correct — account settings need their own contextual nav within the shell content area.

**Status: ✅ No action needed**

---

### System 3 — Exam Session Shell (APPROVED SUPPRESSION — CORRECT)
**File:** `src/components/exam/exam-session-shell.tsx`  
**Used by:** `/app/practice-tests/[sessionId]` (active exam sessions only)

The global nav is suppressed via `LearnerExamChromeGate` only during active exam sessions. This is the only approved full-chrome suppression. The mechanism is `isFocusedPracticeTestSessionPath()` — it checks for a session ID in the URL before suppressing.

**Status: ✅ No action needed**

---

### System 4 — Module Shell (LEGACY EXCEPTION — DOCUMENTED)
**File:** `src/components/modules/premium-educational-module-shell.tsx`  
**Used by:** `/app/modules/ecg`, `/app/modules/ecg-interpretation`, `/app/modules/lab-values`, `/app/modules/rt-ventilator`

These routes bypass the global learner shell. They render a custom header (brand logo + back button only). Registered as approved exceptions in `navigation-contract.ts` with pending migration status.

**Status: ⚠️ Known — migration roadmap in docs/navigation-governance-standard.md**

---

## Issues Found

### Issue 1 — Redundant Navigation on Lesson Hub Page
**File:** `src/app/(app)/app/(learner)/lessons/page.tsx`  
**Problem:** The lessons hub renders a pathway selector strip that partially duplicates the pathway pill in the global nav. Users see two pathway-selection affordances.

**Recommendation:** Suppress the in-page pathway strip when the global nav already shows the active pathway. Gate it on `suppressStudyWidgets` flag.

**Effort:** Small — 1 component conditional

---

### Issue 2 — Flashcard Hub Has Its Own Tab Navigation
**File:** `src/app/(app)/app/(learner)/flashcards/` components  
**Problem:** The flashcard hub renders a "Study · Weak · Custom" tab strip that behaves like a secondary navigation layer. Users navigate by clicking these tabs rather than using the global nav.

**Recommendation:** These tabs are fine as a view switcher within the flashcard surface. They should NOT be styled as navigation — rename to "View" selector, not "Navigation". No component changes needed if styling is clarified.

**Effort:** Minimal — CSS label change

---

### Issue 3 — Module Routes Interrupt Navigation Context
**File:** `src/app/(app)/modules/*/layout.tsx` (8 routes)  
**Problem:** Navigating to `/app/modules/ecg` removes the global nav entirely. Users cannot return to other learner features without clicking the "Back" link. There is no pathway context, no study nav, no quick access to other features.

**Recommendation (short term):** Add the full learner nav back to module routes by migrating them under `(app)/app/(learner)/`. Each workstation shell becomes inner chrome, not a nav replacement.  
**Recommendation (long term):** This is documented in the migration roadmap.

**Effort:** Medium — route move + shell restructure per module

---

## Route Coverage Matrix

| Route | Navigation System | Status |
|---|---|---|
| `/app` | Global shell | ✅ |
| `/app/lessons` | Global shell | ✅ |
| `/app/lessons/[id]` | Global shell | ✅ |
| `/app/flashcards` | Global shell + tab switcher | ✅ (tab switcher is view control) |
| `/app/practice-tests` | Global shell | ✅ |
| `/app/practice-tests/[id]` | Focused exam (no global nav) | ✅ Approved |
| `/app/questions` | Global shell | ✅ |
| `/app/clinical-skills` | Global shell + workstation | ✅ |
| `/app/ecg-video-quiz` | Global shell + workstation | ✅ |
| `/app/labs` | Global shell + workstation | ✅ |
| `/app/med-calculations` | Global shell + workstation | ✅ |
| `/app/pharmacology` | Global shell | ✅ |
| `/app/physiology-monitor` | Global shell | ✅ |
| `/app/simulation-center` | Global shell | ✅ |
| `/app/account` | Global shell + account sidebar | ✅ |
| `/app/modules/ecg` | Module shell ONLY | ⚠️ No global nav |
| `/app/modules/ecg-advanced` | Module shell ONLY | ⚠️ No global nav |
| `/app/modules/ecg-interpretation` | Module shell ONLY | ⚠️ No global nav |
| `/app/modules/hemodynamics` | Module shell ONLY | ⚠️ No global nav |
| `/app/modules/lab-values` | Module shell ONLY | ⚠️ No global nav |
| `/app/modules/rt-ventilator` | Module shell ONLY | ⚠️ No global nav |

---

## Recommended Replacement

For the 3 actionable issues:

| Issue | Component | Recommended Replacement | Priority |
|---|---|---|---|
| Lesson hub duplicate pathway selector | Pathway strip in lessons hub | Gate behind `suppressStudyWidgets` | Low |
| Tab nav styling in flashcards | Tab strip labels | Rename from nav to "View" | Low |
| Module routes missing global nav | `PremiumEducationalModuleShell` | Migrate into `(learner)/` shell | Medium |
