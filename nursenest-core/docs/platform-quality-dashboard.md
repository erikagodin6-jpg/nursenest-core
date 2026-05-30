# NurseNest Platform Quality Dashboard

Generated: 2026-05-30

## Executive Snapshot

This pass focused on platform polish areas with the highest expected impact on conversion, retention, upgrade confidence, and long-term scalability. The strongest current foundation is the learner shell: active CAT/exam sessions are now the only learning routes allowed to suppress global NurseNest navigation, while Labs, Medication Math, Clinical Skills, and ECG workstation layouts are converging on the shared `LearningModuleShell` contract.

## Quality Scorecard

| Area | Status | Score | Evidence | Remaining Risk |
| --- | --- | ---: | --- | --- |
| Navigation Consistency | Improved | 86 | `learnerShellFlags()` suppresses full chrome only for `exam-focused`; Playwright suite covers Flashcards, Labs, Medication Math, Clinical Skills, ECG, Pharmacology. | Some legacy non-app module routes still need runtime visual proof under authenticated storage state. |
| Shared Module Architecture | Improved | 84 | `LearningModuleShell` owns shared sidebar/main/card hooks; Labs, Medication Math, Clinical Skills, ECG workstation shells inherit it. | Flashcards, Pharmacology, Simulations, and future modules should gradually adopt the same shell where they use sidebars/card grids. |
| Sidebar Width + Spacing | Improved | 88 | Shared CSS caps sidebar at `clamp(15rem, 18vw, 17rem)` with `clamp(1.5rem, 3vw, 2.5rem)` gap. | Full browser run should confirm every authenticated route at desktop/tablet/mobile. |
| Clickable Card Coverage | Improved | 80 | Labs, Medication Math, and Clinical Skills opt into `data-nn-learning-module-card`. | Pharmacology, simulations, and some nested activity grids should be audited next. |
| Subscription Enforcement | Partially Verified | 78 | Labs, Medication Math, Clinical Skills layouts preserve server redirects; existing paywall tests cover ECG/practice/CAT surfaces. | Needs a single entitlement matrix test covering anonymous, free authenticated, and subscriber states for every module. |
| Title Case Compliance | Improved | 82 | Central `formatDisplayTitle()` exists; title-case Playwright scan covers core public/app routes; Medication Math hero title corrected. | Dynamic content generated outside display helpers still needs incremental adoption. |
| Homepage Value Communication | Strong Foundation | 86 | Homepage ecosystem contracts verify feature breadth, live stats, footer discovery, comparison, counters, institutions, and screenshot sections. | Needs periodic visual review as screenshots and product modules evolve. |
| Screenshot Quality System | Strong Foundation | 85 | `generate-homepage-screenshots.ts`, `marketing-screenshot-generator.ts`, and depth policy contracts require deep learning states and retina PNG output. | Generators require live authenticated QA credentials; assets should be regenerated after major UI changes. |
| Live Content Counts | Improved | 76 | Homepage counters use platform inventory sources; practice-test category cards now render dynamic question counts instead of `Included`. | More hub cards should be scanned for `Included`, `Available`, and `Ready` fallbacks and moved to data-backed counts. |
| Feature Discoverability | Partially Verified | 79 | Homepage and footer discovery expose the full ecosystem; Labs and Medication Math include study-loop links. | Needs broader weak-area remediation links across ECG, pharmacology, simulations, and report cards. |
| Responsive Coverage | Guarded | 80 | New Playwright suite covers desktop/mobile overflow and sidebar dimensions for core modules. | Browser execution should run in CI with authenticated storage state, not only `--list`. |
| Accessibility Coverage | Guarded | 78 | Shared card focus styles and keyboard focus checks are included; cards retain visible CTA affordances. | Needs deeper axe or keyboard traversal pass for nested simulators and advanced activities. |

## Recent Improvements In This Pass

- Created a shared learning-module layout contract with stable shell, sidebar, main, mobile-strip, and card hooks.
- Migrated Labs, Medication Math, Clinical Skills, and ECG workstation shells onto the shared shell while preserving their legacy root data hooks.
- Ensured full NurseNest navigation remains visible for learning modules; only active exam/CAT-focused sessions suppress full chrome.
- Added source-level contract coverage for shared shell inheritance, sidebar width, spacing, card behavior, CSS imports, and auth redirect preservation.
- Added Playwright regression coverage for canonical learner navigation, theme controls, title-case regressions, sidebar dimensions, card focus, and mobile overflow.
- Converted practice-test category badges from vague `Included` copy to dynamic `{count} Questions` labels.

## Module Parity Matrix

| Module | Global Nav | Shared Shell | Shared Card Hook | Dynamic Counts | Gating Proof | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| Flashcards | Guarded | Partial | Partial | Partial | Existing + Needs Matrix | High |
| Labs | Guarded | Yes | Yes | Partial | Stronger Than Baseline | High |
| Medication Math | Guarded | Yes | Yes | Partial | Stronger Than Baseline | High |
| ECG | Guarded | Yes for workstation | Partial | Partial | Existing ECG Paywall Tests | High |
| Clinical Skills | Guarded | Yes | Yes | Partial | Stronger Than Baseline | High |
| Pharmacology | Guarded by route suite | Not Yet | Needs Audit | Needs Audit | Needs Matrix | High |
| Simulations | Needs Audit | Not Yet | Needs Audit | Needs Audit | Needs Matrix | High |
| Study Plans | Guarded by learner shell | Not Applicable / Needs Review | Needs Audit | Needs Audit | Needs Matrix | Medium |
| Lessons | Guarded by learner shell | Separate Reading Shell | Partial | Partial | Existing lesson/access checks | Medium |

## Conversion Opportunities

1. Replace remaining vague count labels with live inventory counts across Flashcards, Labs, Medication Math, Clinical Skills, ECG, Pharmacology, hubs, and pricing surfaces.
2. Add a single shared upgrade panel pattern with `Included In Your Plan` and `Upgrade To Unlock` variants backed by the same entitlement reason codes.
3. Add weak-area remediation links from analytics/report cards into Lessons, Flashcards, Questions, Labs, ECG, Pharmacology, and Simulations.
4. Regenerate marketing screenshots after shared shell changes so homepage/pricing assets reflect the cleaner layout.
5. Run the new Playwright module layout suite with authenticated paid and non-subscriber storage states in CI.

## Recommended Next Work Queue

| Rank | Work Item | Impact | Notes |
| ---: | --- | --- | --- |
| 1 | Entitlement Matrix Contract | Revenue Protection | Anonymous, free authenticated, subscriber coverage for every premium module. |
| 2 | Live Count Sweep | Conversion | Remove `Included`, `Available`, and `Ready` where actual counts can be displayed. |
| 3 | Pharmacology + Simulations Shell Audit | Platform Consistency | Bring remaining module grids onto shared shell/card hooks where applicable. |
| 4 | Upgrade Surface Standardization | Subscription Upgrades | Centralize copy, feature counts, plan naming, and CTA behavior. |
| 5 | Screenshot Regeneration Run | Homepage Conversion | Use the existing deep-state Playwright generators with QA paid credentials. |
| 6 | Remediation Link Expansion | Retention | Tie weak areas to targeted cross-module activities. |

## Automation Coverage

- `tests/contracts/global-learning-module-layout.contract.test.ts`
- `tests/e2e/global-learning-module-layout.spec.ts`
- `tests/e2e/title-case-standardization.spec.ts`
- `tests/contracts/homepage-ecosystem-overhaul.contract.test.mjs`
- `tests/contracts/homepage-screenshot-quality.contract.test.ts`
- `tests/contracts/marketing-screenshot-depth.contract.test.ts`

## Current Conclusion

NurseNest is moving toward one cohesive learning ecosystem rather than separate module experiences. The most important structural risk has been reduced by centralizing layout behavior and guarding global navigation. The next highest-impact work is a full entitlement matrix and a data-backed count sweep, because those directly affect trust, conversion clarity, and revenue protection.
