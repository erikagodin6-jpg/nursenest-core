# Premium Layout Live Gap Audit

Date: 2026-05-13  
Branch: `main` (HEAD `56f5678ee`)  
Investigator: forensic pass — no redesign, proof only

---

## Executive Summary

The premium redesign components **are** on `main` and **are** deployed to production.
The `data-premium-layout-version="2026-05-live-redesign-v1"` shell marker was wired in
commit `a439701d` and verified via production curl + 7-passing Playwright public suite.

However, two gaps remained after that pass:

1. **No component-level proof marker** — the existing marker sits on the layout *shell*,
   not on individual premium components. If a route strips/bypasses the shell the marker
   disappears silently.
2. **`(marketing)/[locale]/layout.tsx` missing marker** — locale-prefixed routes
   (`/canada/login`, `/canada/pricing`, `/canada/signup`, etc.) use a separate layout that
   never received `PremiumLayoutVersionMarker`.

This audit documents the full route → component chain, fixes both gaps, and adds a
component-level Playwright spec.

---

## 1. Live URL → Route → Component Table

| Live URL | Route file | Component rendered | Shell layout | Proof marker before this pass |
|---|---|---|---|---|
| `/` | `(marketing)/(default)/page.tsx` | `HomeRestoredWithDeferredStats` | `(marketing)/(default)/layout.tsx` | `marketing-default` ✅ |
| `/canada/rn/nclex-rn` | `(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx` | `NursingTierHubPage` | same | `marketing-default` ✅ |
| `/canada/pn/rex-pn` | same dynamic route | `NursingTierHubPage` | same | `marketing-default` ✅ |
| `/us/rn/nclex-rn` | same dynamic route | `NursingTierHubPage` | same | `marketing-default` ✅ |
| `/canada/np/cnple` | `(marketing)/(default)/canada/np/cnple/page.tsx` | `AuthorityClusterPageView` | same | `marketing-default` ✅ |
| `/allied/allied-health` | `(marketing)/(default)/allied/allied-health/page.tsx` | `AlliedHealthPathwayHub` | same | `marketing-default` ✅ |
| `/canada/rn/nclex-rn/lessons` | `(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx` | `MarketingLessonsHubCategoryFirstIndex` (default) or `LessonsPageShell` (filtered) | same | `marketing-default` ✅ |
| `/canada/rn/nclex-rn/questions` | `(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx` | `MarketingPracticeQuestionsHubClient` inside inline RSC | same | `marketing-default` ✅ |
| `/canada/rn/nclex-rn/cat` | `(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx` | Inline RSC with `nn-premium-marketing-cat-card` sections | same | `marketing-default` ✅ |
| `/canada/rn/nclex-rn/flashcards` | `(marketing)/(default)/[locale]/[slug]/[examCode]/flashcards/page.tsx` | Inline RSC — simple CTA layout | same | `marketing-default` ✅ |
| `/canada/pricing` | `(marketing)/[locale]/pricing/page.tsx` | Pricing page component | `(marketing)/[locale]/layout.tsx` | ❌ **no marker** |
| `/canada/signup` | `(marketing)/[locale]/signup/page.tsx` | Signup flow | `(marketing)/[locale]/layout.tsx` | ❌ **no marker** |
| `/app/lessons` | `(student)/app/(learner)/lessons/page.tsx` | `LearnerLessonsVirtualList` | `(student)/app/(learner)/layout.tsx` | `learner-shell` ✅ |
| `/app/lessons/[id]` | `(student)/app/(learner)/lessons/[id]/page.tsx` | `PremiumLessonShell` | same | `learner-shell` ✅ |
| `/app/practice-tests` | `(student)/app/(learner)/practice-tests/page.tsx` | `PracticeTestsHubClient` | same | `learner-shell` ✅ |
| `/app/practice-tests/[id]` | `(student)/app/(learner)/practice-tests/[id]/page.tsx` | `ExamSessionShell` + `ActiveStudySession` | same | `learner-shell` ✅ |
| `/app/practice-tests/[id]/results` | `(student)/app/(learner)/practice-tests/[id]/results/page.tsx` | Results page | same | `learner-shell` ✅ |
| `/app/practice-tests/cat-launch` | `(student)/app/(learner)/practice-tests/cat-launch/page.tsx` | CAT launch page | same | `learner-shell` ✅ |
| `/app/flashcards` | `(student)/app/(learner)/flashcards/page.tsx` | `FlashcardsHubClient` | same | `learner-shell` ✅ |
| `/app/flashcards/[deckRef]` | `(student)/app/(learner)/flashcards/[deckRef]/page.tsx` | Flashcard session | same | `learner-shell` ✅ |
| `/modules/ecg` | `modules/ecg/layout.tsx` + `page.tsx` | `EcgModuleHub` | `modules/ecg/layout.tsx` | `ecg-module` ✅ |
| `/modules/ecg-advanced` | `modules/ecg-advanced/layout.tsx` + `page.tsx` | `AdvancedEcgPremiumHub` | `modules/ecg-advanced/layout.tsx` | `advanced-ecg-module` ✅ |

---

## 2. CSS Import Chain Per Surface

### Marketing routes (all `(marketing)/*`)
```
app/layout.tsx
└── app/(marketing)/layout.tsx
    └── app/(marketing)/marketing-styles.css
        ├── premium-redesign-2026.css      (5 843 lines — hubs, hero, study cards)
        └── premium-allied-newgrad-convergence.css
    └── app/globals.css  (via root layout)
        ├── theme-palettes.css
        ├── color-roles.css
        ├── semantic-status-tokens.css
        ├── full-platform-convergence.css
        ├── premium-color-depth-convergence.css
        ├── premium-atmospheric-ecosystem-convergence.css
        ├── premium-mobile-study-experience-audit.css
        └── mobile-ux-standards.css
```

> `premium-redesign-2026.css` was moved from `globals.css` into `marketing-styles.css`
> in commit `d6d47dc5d` (2026-05-13). This was intentional — learner routes were loading
> 248 KB of marketing-only CSS unnecessarily.

### Learner routes (`(student)/app/(learner)/*`)
```
app/(student)/app/(learner)/layout.tsx
├── learner-exam-shell.css          (exam session ambient shell)
├── learner-exam-session-premium.css (CAT + practice premium chrome)
├── learner-flashcard-premium.css    (flashcard session premium)
├── learner-cockpit-premium.css      (dashboard)
├── learner-surface-primitives.css   (surface tone tokens)
├── styles/tokens.css
├── styles/learner-ds.css
└── learner-premium-ds.css          (818 lines — extracted from premium-redesign-2026.css)
```

### ECG module routes
Inherits `globals.css` + `marketing-styles.css` via layout chain. Component CSS classes
come from `premium-redesign-2026.css`.

---

## 3. Feature Flags / Env Vars Affecting Rendering

| Flag | What it gates | Scope |
|---|---|---|
| `ENABLE_ECG_MODULE` / `NEXT_PUBLIC_ENABLE_ECG_MODULE` | ECG module hub at `/modules/ecg` | RUN_TIME / RUN_AND_BUILD_TIME |
| `ENABLE_ADVANCED_ECG_MODULE` | Advanced ECG hub at `/modules/ecg-advanced` | RUN_TIME |
| `isCatExamSimulationFeatureEnabled()` | CAT mode in practice tests hub | runtime check |
| `isDatabaseUrlConfigured()` | Skips DB queries; shows snapshot fallback | runtime |
| `isDegradedMode()` | Emergency minimal chrome | runtime |
| `isNpPremiumConvergencePathway(pathway)` | Shows `NpPremiumHubWorkstation` in hub | per-pathway |

No env vars gate the *visual layout* of hub, lessons, or flashcard pages.

---

## 4. Dead Redesign Files Not Used By Production

**None found.** Every premium component in the codebase has an active import path from a
live route. The worktrees (`premium-convergence-baseline`, `np-100-launch`,
`rpn-launch-readiness`) diverged from `main` before several hub components were added.
Their CSS diffs (extra `globals.css` imports) were superseded by the `d6d47dc5d`
marketing/learner CSS split on `main`.

Worktree status:

| Worktree | Branch commits ahead of main | Outstanding delta |
|---|---|---|
| `premium-convergence-baseline` | 1 (`a60bc0420 hjhkhjkhkjkh`) | CSS import ordering only; content unchanged vs main |
| `np-100-launch` | 1 (`4be3be358 kjhkhjjkhkh`) | Hub Figma screenshots in docs only |
| `rpn-launch-readiness` | 1 (`9e5463c36 kjljjkljkj`) | QA process docs only |

**These worktrees do not contain unreleased redesign component code.**

---

## 5. Deployment Path Verification

| Check | Result |
|---|---|
| DO deploy branch | `main` (`NN_BUILD_BRANCH=main` in `app-nursenest-core-next.yaml`) |
| `deploy_on_push` | `true` |
| Current HEAD | `56f5678ee` |
| Proof marker wired in | `a439701d` (commit: `fix(ui): wire live premium redesign proof markers`) |
| Production curl proof | `curl -s https://www.nursenest.ca/ \| grep data-premium-layout-version` returned marker at deploy `2b30d716` |
| Production screenshots | 14 screenshots in `test-results/live-redesign-deployment-proof/` (2026-05-13 11:22–11:24) |
| `(marketing)/[locale]/layout.tsx` marker | ❌ **missing** — fixed in this pass |
| Component-level markers | ❌ **missing** — added in this pass |

---

## 6. Gaps Fixed In This Pass

### Gap A — `(marketing)/[locale]/layout.tsx` missing marker
Locale-prefixed routes (`/canada/pricing`, `/canada/signup`, `/canada/login`, etc.) go
through `(marketing)/[locale]/layout.tsx`, which did not have `PremiumLayoutVersionMarker`.
**Fix:** added `<PremiumLayoutVersionMarker surface="marketing-locale" />`.

### Gap B — No component-level proof markers
The shell marker proves the *layout* loaded. It does not prove the *premium component*
rendered. **Fix:** added `data-premium-layout-version="2026-05-tests-hubs-v1"` on the
root element of each key redesigned component:

| Component | File | Attribute location |
|---|---|---|
| `NursingTierHubPage` | `components/marketing/nursing-tier-hub-page.tsx` | root hub `div` |
| `AlliedHealthPathwayHub` | `components/marketing/allied-health-pathway-hub.tsx` | root hub `div` |
| `LessonsPageShell` | `components/pathway-lessons/lessons-page-shell.tsx` | root `section` |
| `PathwayCatEntryPage` | `(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx` | root `div` |
| `PathwayFlashcardsPage` | `(marketing)/(default)/[locale]/[slug]/[examCode]/flashcards/page.tsx` | root wrapper `div` |
| `ExamPathwayQuestionsHubPage` | `(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx` | root `div` |

---

## 7. Playwright Proof

Spec: `tests/e2e/premium-tests-hubs-proof.spec.ts`

Asserts per URL:
- `data-premium-layout-version="2026-05-tests-hubs-v1"` present on a *component* element
- `data-premium-layout-version="2026-05-live-redesign-v1"` present on the *shell*
- No `[data-legacy-layout]`, `[data-old-layout]`, `.legacy-layout` selectors
- Primary CTA is visible
- No horizontal overflow at 1440 px and 375 px
- Desktop + mobile screenshots captured

Run against production:
```bash
BASE_URL=https://www.nursenest.ca npx playwright test tests/e2e/premium-tests-hubs-proof.spec.ts --project=chromium
```

---

## 8. No Routing Fixes Required

Every live URL already resolves to its intended premium component. The route files on
`main` are correct. The only wiring fixes needed were the two proof-marker gaps above.
