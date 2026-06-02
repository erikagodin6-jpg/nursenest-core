# Implementation → Figma parity map (premium learner + marketing)

**Purpose:** Governance prep for design–engineering alignment — **not** a redesign brief. Use when opening or updating Figma frames so naming, hooks, and tokens stay traceable to code.

## Conventions

- **Frames:** `{Surface} — {State} — {Theme} — {Viewport}` (e.g. `Flashcards hub — loaded — Ocean — Desktop`).
- **Hooks:** `data-nn-e2e-*` for automation; `nn-*` / `lv-*` for learner shells; semantic vars from `semantic-status-tokens.css` + `[data-theme]` in `theme-palettes.css`.
- **Authority:** Ecosystem primitives in `docs/ecosystem-design-system-convergence.md`; semantic color rules in `.cursor/rules/semantic-color-guardrails.mdc`.

## Surface map (requested columns)

| Component / file area | CSS hooks / classes | Intended Figma frame name | Theme token dependencies | Responsive behaviors | Known visual drift risks |
|------------------------|---------------------|---------------------------|----------------------------|------------------------|---------------------------|
| Study home / dashboard | `#nn-learner-main`, `[data-nn-learner-main]`, `nn-learner-page-hero`, `.lv-*` | `Learner / Dashboard / Study home — hero` | Ocean default; midnight for dense “workstation”; multi-hue KPI bands | Hero stacks first; side rails may collapse on narrow viewports | Recommendation rail order changes with adaptive data; skeleton vs loaded |
| Report card | Account report route shell, semantic card bands | `Learner / Report card — summary` | `--semantic-chart-*`, `--semantic-panel-*` for bands | Tables scroll horizontally; avoid capturing mid-pagination | Empty account vs populated; date/number formatting |
| CAT (marketing) | Pathway hub premium modules (`buildPremiumMarketingModuleCards`) | `Marketing / Hubs / CAT — entry` | Blossom/Garden accents on hubs | Grid 3→2→1 | Pathway-specific tiles (ECG, OSCE) gated by flags |
| CAT (in-app session) | `learner-exam-session-premium.css`, session chrome components | `Learner / CAT — chrome — Midnight` | Midnight density tokens; `--semantic-warning` for timers | Timer + stem chrome tight on 390px | Timer tick animation — use reduced motion in QA |
| Practice hub | `[data-route='practice-tests']`, hub hero stack | `Learner / Practice / Hub` | Brand + info hues for CTAs | Filters may wrap | Pathway query param changes visible modules |
| Practice rationale | Runner split layout / rationale rail in session clients | `Learner / Practice / Rationale split` | Panel cool/warm semantic mixes | Rail becomes drawer or stack on mobile | Late-loading images in stem; markdown spacing |
| Flashcards hub | `[data-nn-e2e-flashcards-hub]`, `[data-nn-e2e-start-review]` | `Learner / Flashcards / Hub` | Panel tokens for deck cards | Full-width study CTA on mobile | KPI tiles when one API side fails (partial empty) |
| Flashcards session / reveal | `flashcard-study-question-stack.tsx`, related `flashcard-*-study-client.tsx` | `Learner / Flashcards / Reveal` | Reveal state uses semantic success/muted | Card stack gestures / max width | Image cards vs text-only; font subset flash |
| Nav / header (marketing + learner) | `site-header.tsx`, `.marketing-unified-dark`, tier strip siblings | `Chrome / Site header — marketing` / `… — learner` | Header band tokens in `globals.css`; role foreground on dark | Mobile drawer vs desktop tier rail | i18n shard delay → raw keys (guarded by contracts) |
| RN lesson hub | `src/app/us/rn/nclex-rn/**` hub clients | `Marketing / Lesson hub — RN NCLEX` | Ocean/Blossom marketing washes | Module grid reflow | Premium module omissions per pathway |
| Allied hub | `src/app/allied/**` | `Marketing / Allied hub — {occupation}` | Warm supportive panels | Occupation picker / stacked CTAs | `alliedProfession` query scoping |
| Weak areas / remediation queue | `flashcard-weak-study-client.tsx` and related weak-queue surfaces | `Learner / Weak areas — queue` | Warning/readiness semantic fills | Narrow columns clip long labels | Empty queue vs active session shell differences |

## Automated visual anchors (code)

| Spec | Notes |
|------|--------|
| `tests/e2e/qa/guest-marketing-visual-baseline.spec.ts` | Guest homepage; ocean / blossom / midnight + mobile ocean |
| `tests/e2e/visual-qa/visual-qa-critical-regression.spec.ts` | `/app`, flashcards hub, practice-tests hub — requires `playwright/.auth/learner-paid.json` |
| `tests/e2e/visual-qa/visual-qa-route-pack.spec.ts` | Full marketing + learner route PNG pack |

## QA data alignment

- See **`docs/qa/deterministic-learner-seed-data.md`** and **`nursenest-core/scripts/seed-screenshot-demo-user.ts`** for screenshot/demo users and env vars.

