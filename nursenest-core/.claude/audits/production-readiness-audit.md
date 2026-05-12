# Production-Readiness Audit — Practice Exam & Lesson Page Redesigns
**Date:** 2026-05-12  
**Branch:** main (working tree)  
**Scope:** RN, RPN, NP/CNPLE, Allied Health — practice exam + lesson hub redesigns

---

## VERDICT: ⛔ BLOCK_PRODUCTION

One critical React hooks violation in the core study session component will cause React to throw in production on every completed study session. This must be fixed before any deploy.

---

## 🔴 CRITICAL ISSUES — BLOCK PRODUCTION

### [C-1] React Hooks violation: keyboard `useEffect` after conditional returns
**File:** `src/components/study/active-study-session.tsx:292`  
**Severity:** CRITICAL — will throw in production  

The keyboard shortcut `useEffect` (lines 292–323) is placed **after three conditional `return` statements** at lines 239, 248, and 255:

```
if (loading) return (...)          ← line 239 — skips useEffect #5
if (!current) return (...)         ← line 248 — skips useEffect #5
if (completed) return (...)        ← line 255 — skips useEffect #5
// ← useEffect #5 (keyboard shortcuts) at line 292
```

When a study session finishes (`completed` transitions from `false` → `true`), React transitions from calling 18 hooks to 17 hooks between renders. React throws:
> **"React has detected a change in the order of Hooks called."**

This fires on **every session completion** — guaranteed to hit production.

**Fix:** Move the keyboard `useEffect` above line 239, add guards inside:
```tsx
useEffect(() => {
  if (loading || !current || completed) return;
  function onKeyDown(e: KeyboardEvent) { ... }
  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [loading, current, completed, ...existingDeps]);
```

---

## 🟠 HIGH ISSUES — Fix Before Staging

### [H-1] SATA questions have no reveal mechanism in flashcard study mode
**Files:** `src/components/flashcards/flashcard-study-question-stack.tsx:132`, `flashcard-sata-answer-list.tsx`  
**Severity:** HIGH — SATA cards are uncompletable in flashcard mode

The `showPlainRevealCta` guard at line 132 reads:
```ts
const showPlainRevealCta = !exam && !sata && !revealed;
```
When a SATA payload is present, `!sata` is `false`, so **no reveal button renders**. The keyboard Space/Enter shortcut also gates on `!current?.examMicroQuestion`, so it won't fire for SATA either. The MCQ auto-reveal fires only via `commitPick` (MCQ-only path).

Result: a SATA card shows checkboxes with the hint "Choose all correct options, then reveal" — but there is no way to trigger reveal. The user is stuck.

**Fix option A:** Add a SATA-specific reveal button after `<FlashcardSataAnswerList>`.  
**Fix option B:** Add an `onSelectionsChange` handler in `FlashcardStudyQuestionStack` that fires `onReveal` when user explicitly selects and submits.

### [H-2] `onStudyProgress` missing from `useEffect` deps
**File:** `src/components/study/active-study-session.tsx:202–204`  
```tsx
useEffect(() => {
  onStudyProgress?.({ index, revealed });
}, [index, revealed]); // ← onStudyProgress missing
```
If `onStudyProgress` is a new function reference on each render (e.g. an inline arrow in the parent), the stale-closure will silently fire callbacks to outdated handlers. Add `onStudyProgress` to the dependency array.

### [H-3] `react-hooks/exhaustive-deps` not enforced on line 203
The ESLint disable comment (`// eslint-disable-next-line react-hooks/exhaustive-deps`) at line 180 suppresses one specific hook, but line 203's missing dep is a separate violation. This suggests the ESLint `rules-of-hooks` or `exhaustive-deps` rule may not be running across this file — which allowed [C-1] to slip through. Verify ESLint config covers `src/components/study/`.

---

## 🟡 MEDIUM ISSUES — Fix Soon

### [M-1] No visible keyboard shortcut affordance for desktop users
**File:** `src/components/study/active-study-session.tsx`  
The keyboard handler supports Space/Enter (reveal), Arrow keys (navigate), 1–4 (rate). No UI hint is shown to desktop users. Without discovery, this premium UX is invisible. A small `Keyboard` icon (already imported at line 18) with a tooltip or help panel would surface these shortcuts.

### [M-2] SATA `useEffect` dep computed inline (lint smell)
**File:** `src/components/flashcards/flashcard-sata-answer-list.tsx:46`  
```tsx
useEffect(() => { setSelected(new Set()); }, [options.map((o) => o.letter).join(",")]);
```
The `options.map().join()` expression works correctly (string comparison), but ESLint's `react-hooks/exhaustive-deps` flags it as an unstable reference. Extract to a stable `const` derived before the effect or use `useMemo`.

### [M-3] Exam bottom nav only hides the "Flag" button on mobile (sm:flex)
**Files:** `src/components/exam/cnple-sim-shell.tsx:507`, `nclex-sim-shell.tsx`  
The Flag button in the exam bottom bar uses `hidden ... sm:flex`, so on mobile (< 640px) it's invisible with no alternative. Consider a compact icon-only flag button for mobile, or move flagging to the toolbar.

### [M-4] `cnple-sim-shell.tsx` side panel hidden below `xl:` breakpoint
**File:** `src/components/exam/cnple-sim-shell.tsx:49`  
```tsx
<aside className="hidden w-[22rem] shrink-0 ... xl:block">
```
The Patient Summary panel is invisible on all screens under 1280px (includes most laptops). There is no mobile fallback affordance (no collapsed/expandable drawer). On tablet and laptop breakpoints, this information is silently missing.

---

## 🟢 CONFIRMED SAFE — No Action Required

### Practice Exam: Rationale Gating
**CAT/Simulation Rationale Leak:** ✅ Clean  
- `flashcard-study-question-stack.tsx` correctly gates: `{revealed ? <section>rationale</section> : null}` (line 241)
- SATA rationale correctly gated: `rationaleByLetter={revealed ? sata.rationaleByLetter : []}` (line 219)
- Neither NCLEX nor CNPLE sim shells expose rationale text in DOM before answer

### Theme Compatibility: Blossom / Ocean / Midnight
✅ All reviewed components use CSS custom properties exclusively:
- `var(--semantic-brand)`, `var(--semantic-surface)`, `var(--semantic-border-soft)`, etc.
- No hardcoded `bg-white`, `text-gray-900`, or hex colors in study/exam components
- Theme applies via `data-theme` attribute on `ExamSessionShell` (line 36)

### SEO Integrity
✅ **Lessons hub metadata** (`lessons/page.tsx:220`): `safeGenerateMetadata()` wraps all metadata; returns `alternates.canonical` with absolute URL; `robots: { index: false, follow: true }` correctly set only for search-filtered (`?q=`) pages.

✅ **CNPLE specialty pages** (geriatrics, mental-health, pediatrics, pharmacology, women's health): All have `generateMetadata` with `canonicaltag`, `openGraph`, and `robots` via `robotsForRegionalMarketingHub("canada")`.

✅ **Sitemap coverage**: All new CNPLE specialty pages included in `CNPLE_SITEMAP_PATHS` (cnple-seo-cluster.ts:337–358) and in `SITEMAP_FALLBACK_PATHS_ALL` (sitemap-index-children.ts:79–84). `sitemap-cnple.xml` route correctly references `CNPLE_SITEMAP_PATHS`.

✅ **No accidental noindex**: Lesson and practice pages are indexable. Only search-query variants are noindexed.

### Hydration Safety
✅ `flashcard-srs-stats-strip.tsx`: Starts with `null` state, fetches in `useEffect` → no SSR/client mismatch.  
✅ `active-study-session.tsx`: All `useState` initial values are deterministic (no `Math.random()`, `Date.now()` in render).  
✅ `flashcard-study-question-stack.tsx`: No hydration-unsafe patterns found.  
✅ All interactive study components correctly marked `"use client"`.

### SATA Interaction (when revealed)
✅ Multi-select toggle works correctly (add/remove from Set, no radio behavior).  
✅ Post-reveal coloring: green for correct+selected, orange for correct+missed, red for incorrect+selected.  
✅ Per-option rationale shown only when `revealed && rat` (line 164).

### Bottom Nav / Sticky Header
✅ **Exam bottom nav**: Both `cnple-sim-shell.tsx:482` and `nclex-sim-shell.tsx:323` use `sticky bottom-0` inside a `min-h-[100dvh]` flex container — correct mobile pattern that respects iOS Safari chrome.  
✅ **Lesson hub bottom nav** (`study-bottom-nav.tsx`): Not fixed/sticky — normal block with top border. No clip risk.  
✅ **Progress strip** (`exam-session-shell.tsx:85`): Correctly clamps `width` to `[0, 100]`, uses `role="progressbar"` with ARIA attributes.

### Keyboard Shortcuts
✅ Space/Enter → reveal (plain cards), Arrow keys → navigate, 1–4 → rate: all wired via `window.addEventListener("keydown", ...)` with proper cleanup on unmount.  
⚠️ But see [C-1] — this effect is in an unconstitutional position.

### Lesson Content Integrity
✅ Lesson hub has robust error handling: `MarketingLessonsHubRetryableErrorShell`, `shouldShowMarketingLessonHubInvariantErrorShell`, pipeline collapse guard — no silent empty-state risk.  
✅ `MarketingHubSmokeDiagnosticsJson` provides diagnostic output for debugging empty pools.

### Performance
✅ Lesson hub uses `force-dynamic` with `revalidate = 86400` and `maxDuration = 60` — appropriate for a DB-backed page.  
✅ `active-study-session.tsx` uses `useMemo` for dedup and pathway derivation; `useCallback` for rating submission.  
✅ ECG image rendering: `clinicalImageUrl` guarded by `startsWith("https://")` check (line 172) — no broken image chrome.

---

## E2E Test Coverage

### Existing specs covering redesigned surfaces
| Surface | Spec | Notes |
|---|---|---|
| Linear practice exam | `practice-exam/linear-premium-shell.spec.ts` | Desktop + mobile viewport |
| Flashcard MCQ/SATA | `flashcards/flashcards-mcq-premium-qa.spec.ts` | 4 pathways: RN/RPN/NP/Allied |
| Lesson flows | `lessons/lesson-flows.spec.ts` | Hub + detail navigation |
| CAT exam contract | `cat/cat-exam-mode-contract.spec.ts` | Mode isolation |
| ECG module | `ecg-module/ecg-module-learn-flow.spec.ts` | ECG rendering |
| Mobile viewports | `mobile/` | Mobile-specific smoke |

### Coverage gaps (no spec exists)
- Bowtie question rendering end-to-end
- CAT rationale non-leak assertion (rationale NOT in DOM pre-answer)
- Confidence selector 4-button interaction under test mode
- CNPLE sim-shell navigation (prev/next, flag, review screen)
- Theme switching (Blossom/Ocean/Midnight) via the theme modal
- Allied health lesson hub (allied-health/[slug]/lessons)
- Long rationale overflow test (> 3000 chars)
- Question navigator jump-to-item

---

## CNPLE New Pages Status

| Page | Route | generateMetadata | Canonical | OG | Sitemap |
|---|---|---|---|---|---|
| cnple-geriatrics | `/cnple-geriatrics` | ✅ | ✅ | ✅ | ✅ |
| cnple-mental-health | `/cnple-mental-health` | ✅ | ✅ | ✅ | ✅ |
| cnple-pediatrics | `/cnple-pediatrics` | ✅ | ✅ | ✅ | ✅ |
| cnple-pharmacology | `/cnple-pharmacology` | ✅ | ✅ | ✅ | ✅ |
| cnple-womens-health | `/cnple-womens-health` | ✅ | ✅ | ✅ | ✅ |
| cnple-flashcards | `/cnple-flashcards` | (not yet confirmed) | — | — | ✅ |
| cnple-differential-diagnosis | `/cnple-differential-diagnosis` | ✅ | ✅ | ✅ | ✅ |

---

## Summary: Priority Fix List

| # | Issue | File | Severity | Est. Fix |
|---|---|---|---|---|
| 1 | Hooks violation — keyboard useEffect after early returns | `active-study-session.tsx:292` | 🔴 CRITICAL | 10 min |
| 2 | SATA no reveal button in flashcard study mode | `flashcard-study-question-stack.tsx:132` | 🟠 HIGH | 30 min |
| 3 | `onStudyProgress` missing from deps | `active-study-session.tsx:203` | 🟠 HIGH | 2 min |
| 4 | ESLint hooks rules not catching violations | CI config | 🟠 HIGH | 15 min |
| 5 | No keyboard shortcut UI affordance | `active-study-session.tsx` | 🟡 MEDIUM | 20 min |
| 6 | Inline map in SATA useEffect deps | `flashcard-sata-answer-list.tsx:46` | 🟡 MEDIUM | 5 min |
| 7 | Flag button hidden on mobile | `cnple-sim-shell.tsx:507` | 🟡 MEDIUM | 15 min |
| 8 | CNPLE patient panel missing on < xl | `cnple-sim-shell.tsx:49` | 🟡 MEDIUM | 30 min |

---

## Final Verdict

```
⛔ BLOCK_PRODUCTION

Fix [C-1] (hooks violation) and [H-1] (SATA reveal) before any deploy.
After fixes: re-run flashcard MCQ and practice-exam E2E specs.
All SEO, theme, hydration, and lesson-page surfaces are clean and ready.
```
