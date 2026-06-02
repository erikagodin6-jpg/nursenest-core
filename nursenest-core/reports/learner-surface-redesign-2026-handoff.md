# NurseNest learner surface redesign — Figma + implementation handoff (2026)

This handoff links **new Figma placeholders**, **existing code surfaces**, **token mapping**, a **phased implementation plan**, **Playwright mapping**, and **command results**. Inspiration screens are **not** copied; use NurseNest **DM Sans**, **semantic/theme tokens**, and **stable routes**.

## 1. Figma

**File:** https://www.figma.com/design/iYaA7XimpG5p1XI9S7FAaP/NurseNest-Learner-Surfaces-%E2%80%94-Redesign-Spec-2026

Page **"NurseNest learner redesign — frame map"** — 11 placeholder frames (desktop/tablet/mobile dashboard, report desktop+mobile, practice desktop+mobile, CAT exam+results, flashcards, lesson hub) with **code anchor labels** inside each frame (e.g. `[data-nn-learner-dashboard-convergence]`, `[data-nn-qa-practice-rationale-column]`, `[data-cat-exam-root]`).

**Design next steps:** bind Figma color styles to semantic names from `nursenest-core/src/app/semantic-status-tokens.css` and theme palettes; replace placeholder **Inter** with **DM Sans** when installed in Figma.

## 2. Token / component mapping (summary)

| Intent | Tokens / classes | Primary code |
|--------|------------------|--------------|
| Dashboard shell | `.nn-learner-dashboard-convergence`, `--semantic-*` | `src/components/student/learner-dashboard-page-shell.tsx`, `src/app/learner-cockpit-premium.css` |
| Priority / welcome / readiness | `nn-dash-hub-priority-matrix`, `LearnerSurfaceCard`, `PrimaryActionCard` | `src/components/student/learner-dashboard-readiness-next-strip.tsx` |
| Full dashboard IA | `LearnerStudyHome`, `nn-dash-band--*` | `src/components/student/learner-study-home.tsx` |
| Report card | `[data-nn-learner-report-card-convergence]` | `src/app/(student)/app/(learner)/account/_lib/learner-report-card-route.tsx`, `learner-report-card-premium.tsx` |
| Practice rationale | `[data-nn-qa-practice-rationale-column]`, `.nn-practice-exam-runner` | `practice-exam-rationale-panel.tsx`, `practice-test-runner-client.tsx` |
| CAT (no teaching during exam) | `[data-cat-exam-root]`; **zero** `.nn-question-session-rationale` | `tests/e2e/cat/cat-exam-mode-contract.spec.ts` |
| Flashcards MCQ + rationale | `.nn-flashcard-session-layout` | `tests/e2e/paid-user/flashcards-premium-interaction.spec.ts` |
| Lesson hubs (public) | Marketing pathway hubs | `tests/e2e/public/pathway-lessons-hub-premium.spec.ts` (pattern) |

Existing deep-dive specs: `reports/learner-dashboard-redesign-2026-01-figma-first-spec.md`, `reports/cat-practice-exam-redesign-2026-01-figma-first-spec.md`, `reports/flashcards-mcq-redesign-2026-01-figma-first-spec.md`, `reports/lesson-hub-redesign-2026-01-figma-first-spec.md`.

## 3. Implementation plan (after Figma sign-off)

1. **Dashboard** — token-only CSS for emotional hierarchy; keep `resolveEntitlementForPage` and staff vs subscription distinction.  
2. **Report card** — align embedded dashboard strip with account report; CTAs via `withPathwayScopeHref`; export = disabled until API exists.  
3. **Practice** — layout for rationale + coach; modal fields only with backend support.  
4. **CAT** — Midnight density, pause/skeleton; results use existing summary fields.  
5. **Flashcards** — clarify MCQ+rationale in copy; optional distractor blocks when data exists.  
6. **Lesson hubs** — marketing only for public; locked premium; never leak `/app` URLs.

## 4. Playwright mapping (requirements → specs)

| Requirement | Spec file |
|-------------|-----------|
| Dashboard + report hooks | `tests/e2e/learner-surfaces/premium-convergence.visual.spec.ts` |
| Practice rationale | `tests/e2e/practice-exam/linear-premium-shell.spec.ts` |
| CAT no rationale | `tests/e2e/cat/cat-exam-mode-contract.spec.ts` |
| Flashcards | `tests/e2e/paid-user/flashcards-premium-interaction.spec.ts` |
| Themes | `tests/e2e/visual/theme-parity/homepage-theme-parity.spec.ts`, `tests/e2e/public/premium-themes-visual-matrix.spec.ts` |
| Paywall / entitlement | `tests/e2e/paid-user/paid-user-entitlements.spec.ts` |

## 5. Commands run (nursenest-core/)

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | **Pass** |
| `npm run test:homepage` | **Fail** — 3 subtests (site header / marketing chrome contracts; pre-existing) |
| `npm run test:learner-surfaces-contracts` | **Pass** |

**Suggested paid E2E batch (when env ready):**

`npx playwright test -c playwright.config.ts tests/e2e/learner-surfaces/premium-convergence.visual.spec.ts tests/e2e/practice-exam/linear-premium-shell.spec.ts tests/e2e/cat/cat-exam-mode-contract.spec.ts tests/e2e/paid-user/flashcards-premium-interaction.spec.ts`

## 6. Screenshots (Ocean / Blossom / Midnight)

Not captured in this session. Run visual QA after UI implementation; store under `reports/screenshots/learner-redesign/`.

## 7. Inspiration assets (local)

`/.cursor/projects/root-nursenest-core/assets/*.png` — reference only; brand stays NurseNest.

## 8. Truthpack

`.vibecheck/truthpack/` not found in this clone; run `vibecheck truthpack` before tier/copy changes.

## 9. Files changed (this session)

- `nursenest-core/reports/learner-surface-redesign-2026-handoff.md` (this file, via shell)  
- Figma design file key `iYaA7XimpG5p1XI9S7FAaP`  
- No production source edits in this pass
