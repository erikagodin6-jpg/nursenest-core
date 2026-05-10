# NurseNest ecosystem design system — convergence architecture

**Status:** Platform directive — phased adoption  
**Audience:** Product, design (Figma), and engineering  
**Goal:** One cohesive premium adaptive clinical learning ecosystem: shared primitives, semantic tokens, learner shells, and adaptive workflows — without forked mini-apps or duplicate visual systems.

Related internal docs: [`CORE_LEARNING_SYSTEM_MAP.md`](./CORE_LEARNING_SYSTEM_MAP.md), [`planning/subscription-clinical-readiness-ecosystem.md`](./planning/subscription-clinical-readiness-ecosystem.md), [`planning/transfusion-clinical-readiness-ecosystem.md`](./planning/transfusion-clinical-readiness-ecosystem.md), [`planning/transfusion-ecosystem-figma-brief.md`](./planning/transfusion-ecosystem-figma-brief.md), [`planning/clinical-readiness-ecosystem-implementation-directive.md`](./planning/clinical-readiness-ecosystem-implementation-directive.md), [`planning/bls-acls-pals-emergency-readiness-pathways.md`](./planning/bls-acls-pals-emergency-readiness-pathways.md), [`governance/ecosystem-qa-master-program.md`](./governance/ecosystem-qa-master-program.md), [`planning/adaptive-case-study-ecosystem.md`](./planning/adaptive-case-study-ecosystem.md), [`planning/osce-medication-dosage-ecosystem.md`](./planning/osce-medication-dosage-ecosystem.md), [`ecg-module-integration.md`](./ecg-module-integration.md).

**Premium ecosystem audits (inventory, Figma brief, Playwright checklist, expansion):** `reports/premium-clinical-ecosystem-*.md` at repo root (same files under `nursenest-core/reports/`).

**Lab Values** and other verticals are governed by **`.cursor/rules/ecosystem-platform-guardrails.mdc`** (platform-wide): integrated learner surfaces only — no isolated mini-apps; Labs use `/app/labs`, shared shells, and study-loop wiring.

---

## 1. North star

The platform must read as **one product**:

- Same navigation grammar for marketing + learner surfaces (no parallel “ECG nav” or “simulation nav”).
- Same learner hero + section rhythm (`nn-learner-page-hero`, `lv-section`, dashboard sections).
- Same semantic color semantics for status, charts, and mastery (multi-hue, not brand-only bars).
- Themes (**Aurora, Ocean, Garden, Midnight**) change **expression only** (accent, glow, surface tint, chart reads, atmosphere) — not layout, spacing hierarchy, or information architecture.

**Non-goals:** Rewriting stable backend/auth/entitlements; renaming canonical learner URLs; introducing sub-brands.

---

## 2. Authoritative styling layers

| Layer | Location | Rule |
|-------|----------|------|
| Identity / theme palettes | `theme-palettes.css`, `[data-theme]` | Typography and structural colors flow from theme — do not override `:root` in ways that break `[data-theme]`. |
| Semantic status + charts | `semantic-status-tokens.css` | All learner product UI, dashboards, and data viz consume `--semantic-*`, `--semantic-chart-*`, panels, shadows. |
| Learner DS utilities | `styles/learner-ds.css` (e.g. `.lv-card`, `.lv-section`) | Prefer `LearnerSurfaceCard`, `SectionContainer` over ad-hoc bordered divs. |
| Lesson semantic bands | `--lesson-*` aliases in `semantic-status-tokens.css` | Lesson panels stay on rails without raw hex in TSX. |

**Forbidden in components:** Raw `#RRGGBB`, arbitrary box-shadows, one-off gradients not expressed through tokens (see drift audit).

**Allowed:** `color-mix(in srgb, var(--semantic-*) …)`, `var(--semantic-shadow-soft)`, hero washes defined in CSS classes (e.g. `.nn-learner-page-hero`).

---

## 3. Canonical primitive registry

Primitives below are **names for the ecosystem language**. Many already exist under different filenames — convergence means **standardizing on these behaviors** and merging duplicates over time, not inventing twenty new parallel components on day one.

| Primitive | Role | Current implementation (anchor files / patterns) |
|-----------|------|---------------------------------------------------|
| **ClinicalPanel** | Bounded clinical explanation region | `lab-lesson-page.tsx` `Section`; consider folding into `LearnerSurfaceCard` + shared heading. |
| **SignalCard** | Metric / lab value / rhythm summary tile | Labs hub `TopicCard`; dashboard metric tiles; align borders to `LearnerSurfaceCard` / `.lv-card`. |
| **TelemetryStrip** | Horizontal rhythm/status strip (labs ↔ ECG) | *Partial:* labs content + ECG routes; extract when ECG workstation UI consolidates. |
| **AdaptiveRecommendationRail** | Weak areas + next steps | `learner-adaptive-recommendations-section.tsx` (dashboard). |
| **StudyLoopDock** | Linked lessons / flashcards / practice / CAT / drills | `labs-hub-page.tsx` link row; `practice-test-study-loop-next.tsx`; pathway lesson footers. |
| **SeverityCallout** | Critical / urgent framing | Semantic warning/danger mixes; prioritize tokens over `border-amber-*` except legacy admin preview banners. |
| **ScenarioTimeline** | Evolving case narrative | `clinical-scenarios/clinical-scenario-unfolding-preview.tsx`; scenario modules under `components/scenarios/`. |
| **NGNDecisionPanel** | Judgment / prioritization surface | CAT / NGN flows in practice-tests + pathway lesson quizzes; consolidate duplicated panel chrome. |
| **MasteryProgressBand** | Category / topic mastery | `category-mastery-section.tsx`; readiness widgets; `semanticFillClassForAccuracyPct` for bars. |
| **ClinicalMetricCard** | Readiness / score / snapshot | `dashboard/readiness-score-card.tsx`; report card insets. |
| **LabSignalBand** | Normal / critical lab framing | Lab lesson “Normal range” sections + thresholds from `labs-engine`. |
| **QuestionShell** | Practice question chrome | `practice-question-session-client.tsx`, question bank runners. |
| **ImmersiveExamShell** | Exam-authentic CAT / test chrome | Practice test runner + CAT surfaces sharing paywall + session semantics. |
| **BranchingCaseRail** | Branching simulation sidebar | OSCE / scenario rails (`ScenarioRationalePanel`, branching sim docs in `planning/adaptive-case-study-ecosystem.md`). |
| **ConfidenceSelector** | Self-rated recall | Flashcard stacks (`flashcard-study-*`). |
| **RationaleDrawer** | Coaching rationale reveal | `premium-rationale-panel.tsx`, `question-review-rationale-blocks.tsx`. |
| **ClinicalInsightCard** | Post-session / CAT coaching | `cat-results-coach-panel.tsx`, `post-session-exam-insights.tsx`. |
| **AdaptiveWeaknessPanel** | Weak-topic emphasis | Left column of adaptive recommendations; `FocusTodayStrip` / study-plan API. |

**Existing shared UI entry points:** `components/ui/learner-surface-card.tsx`, `components/ui/section-container.tsx`, `components/ui/study-card.tsx`, `components/ui/action-card.tsx`.

---

## 4. Shared learner shell

The canonical learner **page intro** pattern is CSS class **`.nn-learner-page-hero`** (`semantic-status-tokens.css`): multi-hue radial washes + theme-aware gradients + consistent padding/radius/shadow.

**Used across:** dashboard home, lessons hub, flashcards, practice tests, labs hub/detail, study coach, readiness, CAT insights, med calculations, etc.

**Convergence rule:** New learner surfaces should adopt `.nn-learner-page-hero` unless there is a documented exception (e.g. full-bleed exam mode). Surfaces that still use plain `<header className="space-y-3">` without the hero (e.g. some tool hubs) should migrate for visual parity.

---

## 5. Theme convergence

Themes must **not** change:

- Layout grid, spacing scale, navigation structure, or component hierarchy.

Themes **may** change (via `[data-theme]` / `theme-palettes.css`):

- Accent hue and glow, surface tint, semantic chart expression, atmospheric lighting (e.g. `--hero-gradient-*`, decorative radials in `.nn-learner-page-hero`).

**Flagship roles (product language):**

| Theme | Primary emotional role |
|-------|-------------------------|
| **Midnight** | Immersive simulation / CAT / workstation density |
| **Ocean** | Default calm education / study |
| **Garden** | Supportive, lower-arousal study |
| **Aurora** | Optimistic, elevated marketing + learner harmony |

---

## 6. Duplicate-system audit (initial)

| Pattern | Observation | Direction |
|---------|-------------|-----------|
| **Bordered “card” divs** | Repeated `rounded-xl border border-[var(--semantic-border-soft)]` across labs, ECG video quiz, marketing cards | Route new work through `LearnerSurfaceCard` / `.lv-card` + shared padding tokens. |
| **Learner hero** | Most `/app/*` uses `nn-learner-page-hero`; some secondary hubs use plain headers | Migrate stragglers for one ecosystem rhythm. |
| **Inline gradient styles** | e.g. command center `style={{ background: linear-gradient(...) }}` using vars | Acceptable if vars-only; prefer moving repeated patterns to a CSS class in `semantic-status-tokens.css` to reduce one-offs. |
| **ECG module (`/modules/ecg/*`)** | Admin/hidden preview styling vs learner `/app` ECG experiences | Keep route contracts; align **visual language** with learner shells when those surfaces ship broadly. |
| **Preview / Storybook hex** | `_preview-shared.tsx` uses fixed palettes for isolated preview | Quarantine OK; must not leak into production learner CSS. |
| **Marketing header utilities** | Some `#cbd5e1` / `white` in utility chrome | Consolidate to theme/semantic tokens when touching those files. |

---

## 7. Navigation convergence

- **One primary nav system** per surface type: marketing header/footer, learner app shell — already centralized; do not add parallel headers for ECG, labs, or simulations.
- Cross-links between labs ↔ ECG ↔ scenarios use **standard internal link helpers** and pathway-scoped hrefs (`withPathwayScopeHref`, `buildLabsStudyLinks`, etc.).

---

## 8. Adaptive learning expectations

Capabilities should **compose** across surfaces:

- Linked learning (lesson ↔ flashcards ↔ qbank ↔ CAT) — already wired in labs and dashboard bundles where enabled.
- Weak area detection / continue studying — `LearnerAdaptiveRecommendationsSection`, `FocusTodayStrip`, `/api/study-plan`; expand UI **only** with backing data contracts (no fake metrics).

---

## 9. Validation & drift prevention

**Automated / manual gates:**

1. **Typecheck** — CI package scripts.
2. **Responsive** — Playwright mobile gates include core learner routes (extend when new shells ship).
3. **Theme** — Visual pass: hub + one deep learner flow × 4 themes.
4. **Contrast** — No near-black text on midnight surfaces without verified `--semantic-text-primary` pairing.
5. **Color audit** — Ripgrep for `#[0-9a-fA-F]{3,8}` under `src/components` (allowlisted paths: preview fixtures only).

**Tests to favor:** Existing component tests for tokens where fragile; extend snapshot/a11y only when primitives stabilize.

---

## 10. Deliverables tracking

| Deliverable | Location / owner |
|-------------|------------------|
| Primitive inventory | This doc, §3 |
| Ecosystem architecture | This doc |
| Token / theme convergence | §2, §5 + `semantic-status-tokens.css` |
| Shared shell refactors | Phased PRs per vertical (labs, ECG learner, scenarios) |
| Figma ecosystem file | Design — align component names with §3 registry |
| Screenshots | QA reports under `docs/qa-reports/` per release |
| Production-safe implementation reports | PR descriptions + targeted verification docs |
| Duplicate-system audit | §6 |
| Drift prevention | §9 |

---

## 11. Phased implementation (engineering)

1. **Document & align** — Design uses primitive names from §3; engineering maps refactors to existing anchors first.
2. **Shell sweep** — Migrate straggler pages to `.nn-learner-page-hero` + `LearnerSurfaceCard` where appropriate.
3. **Extract only where duplication is costly** — e.g. shared `TelemetryStrip` when third consumer appears.
4. **Never fork data or routes** — Visual + composition layer only unless product approves API/schema changes.

---

*Last updated from codebase audit — learner shells, `semantic-status-tokens.css`, labs/adaptive/dashboard anchors.*
