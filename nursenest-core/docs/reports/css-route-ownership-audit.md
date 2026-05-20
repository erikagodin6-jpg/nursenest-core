# CSS Route Ownership Audit

**Generated:** 2026-05-13
**Tool:** `scripts/audit-css-route-ownership.mjs`
**Source files audited:** src/app/globals.css, src/app/learner-premium-ds.css

---

## Executive Summary

| Metric | Value |
|---|---|
| Total CSS blocks audited | 638 |
| globals.css size | 185 KB |
| Safe-extractable bytes (learner) | **16 KB** |
| Safe-extractable bytes (marketing) | 8 KB |
| Safe-extractable bytes (admin) | 0 KB |
| Total safe extraction potential | **24 KB** |

### Classification breakdown

| Classification | Blocks | Description |
|---|---|---|
| UNKNOWN | 253 | |
| GLOBAL_REQUIRED | 211 | |
| SHARED_COMPONENT | 70 | |
| LEARNER_ONLY | 61 | |
| MARKETING_ONLY | 43 | |

### Risk breakdown

| Risk Level | Blocks |
|---|---|
| NEEDS_REVIEW | 504 |
| SAFE | 104 |
| HIGH_RISK | 30 |

---

## LEARNER_ONLY — Safe to Extract

These blocks are used exclusively in learner/student route components.
**Recommendation:** Extract to `src/app/styles/learner/learner-global.css`
(already imported by the learner layout — no new imports needed).

| Selector | Source | Lines | Size | Risk | Recommendation |
|---|---|---|---|---|---|
| `.nn-learner-ds-ambient` | learner-premium-ds.css | 13–21 | 0.7KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-practice-exam-runner .nn-practice-exam-rati...` | learner-premium-ds.css | 264–275 | 0.7KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-premium-cat-section` | learner-premium-ds.css | 65–79 | 0.6KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-premium-flashcard-nav-btn` | learner-premium-ds.css | 461–476 | 0.6KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-premium-cat-direct-card` | learner-premium-ds.css | 133–146 | 0.6KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-premium-cat-section::before` | learner-premium-ds.css | 81–92 | 0.5KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-learner-dashboard-hero::after` | learner-premium-ds.css | 29–40 | 0.5KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-flashcard-kbd` | learner-premium-ds.css | 714–725 | 0.5KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-premium-flashcard-completion` | learner-premium-ds.css | 450–459 | 0.5KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-practice-exam-runner .nn-premium-practice-e...` | learner-premium-ds.css | 287–295 | 0.5KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-premium-flashcard-session-header` | learner-premium-ds.css | 439–448 | 0.4KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-cat-exam-chrome .nn-cat-top-bar__progress-fill` | learner-premium-ds.css | 198–206 | 0.4KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-practice-exam-runner.nn-cat-exam-chrome:not...` | learner-premium-ds.css | 257–262 | 0.4KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-practice-exam-runner` | learner-premium-ds.css | 247–255 | 0.4KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-premium-cat-direct-card::before` | learner-premium-ds.css | 148–158 | 0.4KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-premium-cat-tools-rail` | learner-premium-ds.css | 99–109 | 0.4KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-tab-pill[aria-selected="true"]` | globals.css | 2217–2225 | 0.4KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-chip[aria-pressed="true"]` | globals.css | 2181–2189 | 0.3KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-skeleton-shimmer::after` | globals.css | 3972–3984 | 0.3KB | SAFE | EXTRACT_TO_LEARNER |
| `html[data-theme] .nn-exam-session.nn-exam-sessi...` | globals.css | 4090–4096 | 0.3KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-premium-practice-hub-hero::after` | learner-premium-ds.css | 324–336 | 0.3KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-chip:hover:not([data-selected="true"]):not(...` | globals.css | 2169–2173 | 0.3KB | SAFE | EXTRACT_TO_LEARNER |
| `html[data-theme="deep-twilight"] .nn-qopt-surfa...` | globals.css | 3905–3909 | 0.3KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-chip` | globals.css | 2155–2166 | 0.3KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-premium-cat-rationale-head` | learner-premium-ds.css | 111–118 | 0.3KB | SAFE | EXTRACT_TO_LEARNER |
| `html[data-theme="midnight"] .nn-flashcard-rail-...` | learner-premium-ds.css | 709–712 | 0.3KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-practice-exam-runner .nn-practice-exam-prog...` | learner-premium-ds.css | 277–280 | 0.2KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-tab-pill:hover` | globals.css | 2209–2213 | 0.2KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-card-cool` | globals.css | 3752–3757 | 0.2KB | SAFE | EXTRACT_TO_LEARNER |
| `.nn-premium-flashcard-nav-btn:hover:not(:disabled)` | learner-premium-ds.css | 478–481 | 0.2KB | SAFE | EXTRACT_TO_LEARNER |
| *(31 more…)* | | | | | |


---

## MARKETING_ONLY — Safe to Extract

These blocks are used exclusively in marketing route components.
**Recommendation:** Extract to `src/app/styles/marketing/marketing-global.css`
(already imported by the marketing layout).

| Selector | Source | Lines | Size | Risk | Recommendation |
|---|---|---|---|---|---|
| `.nn-premium-marketing-cat-card` | learner-premium-ds.css | 209–222 | 0.5KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-premium-marketing-cat-card::before` | learner-premium-ds.css | 224–234 | 0.4KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-premium-marketing-cat-card.nn-premium-marke...` | learner-premium-ds.css | 348–356 | 0.4KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-ui-btn--primary:hover:not(:disabled):not([a...` | globals.css | 962–968 | 0.3KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-ui-btn--secondary:hover:not(:disabled):not(...` | globals.css | 979–984 | 0.3KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-footer-link` | globals.css | 2060–2068 | 0.3KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-card--locked` | globals.css | 4075–4080 | 0.3KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-ui-btn--ghost:hover:not(:disabled):not([ari...` | globals.css | 993–997 | 0.3KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-ui-btn--primary:active:not(:disabled):not([...` | globals.css | 969–973 | 0.2KB | SAFE | EXTRACT_TO_MARKETING |
| `html[data-theme="deep-twilight"] .nn-ui-btn--de...` | globals.css | 1010–1014 | 0.2KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-ui-btn--link` | globals.css | 1021–1029 | 0.2KB | SAFE | EXTRACT_TO_MARKETING |
| `html[data-theme] .nn-marketing-trust-strip` | globals.css | 2099–2105 | 0.2KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-ui-progress` | globals.css | 1068–1076 | 0.2KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-ui-btn--destructive` | globals.css | 1001–1005 | 0.2KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-ui-badge` | globals.css | 1034–1042 | 0.2KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-ui-badge--success` | globals.css | 1057–1061 | 0.2KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-premium-allied-module-card` | learner-premium-ds.css | 367–371 | 0.2KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-premium-allied-module-card:hover` | learner-premium-ds.css | 373–376 | 0.2KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-surface-elevated` | globals.css | 2147–2152 | 0.2KB | SAFE | EXTRACT_TO_MARKETING |
| `.nn-ui-btn--secondary` | globals.css | 974–978 | 0.2KB | SAFE | EXTRACT_TO_MARKETING |
| *(23 more…)* | | | | | |


---

## ADMIN_ONLY — Safe to Extract

| Selector | Source | Lines | Size | Risk | Recommendation |
|---|---|---|---|---|---|


---

## SHARED_COMPONENT — Keep in globals (review before moving)

These blocks are used across multiple route types or in shared layout components.
Do NOT extract without a full cascade-order analysis.

| Selector | Source | Lines | Size | Risk | Recommendation |
|---|---|---|---|---|---|
| `.nn-header-logo-row` | globals.css | 1922–1954 | 1.6KB | HIGH_RISK | KEEP_IN_GLOBALS |
| `.nn-header-utility-dark` | globals.css | 1903–1919 | 0.9KB | HIGH_RISK | KEEP_IN_GLOBALS |
| `.nn-btn-primary` | globals.css | 2281–2298 | 0.9KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-header-logo-row > .nn-header-nav-row` | globals.css | 2017–2032 | 0.9KB | HIGH_RISK | KEEP_IN_GLOBALS |
| `.nn-btn-secondary` | globals.css | 2372–2385 | 0.8KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-header-nav-row` | globals.css | 1993–2007 | 0.8KB | HIGH_RISK | KEEP_IN_GLOBALS |
| `.nn-header-dark-surface` | globals.css | 1976–1989 | 0.7KB | HIGH_RISK | KEEP_IN_GLOBALS |
| `.nn-lesson-article-flow .nn-lesson-section-card...` | globals.css | 3629–3638 | 0.7KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-lesson-article-flow .nn-lesson-section-card...` | globals.css | 3618–3627 | 0.7KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-header-tier-pill` | globals.css | 1696–1710 | 0.5KB | HIGH_RISK | KEEP_IN_GLOBALS |
| `.nn-header-account-trigger` | globals.css | 1718–1734 | 0.5KB | HIGH_RISK | KEEP_IN_GLOBALS |
| `.nn-btn-primary:hover:not(:disabled):not([aria-...` | globals.css | 2339–2346 | 0.4KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-btn-primary:active:not(:disabled):not([aria...` | globals.css | 2348–2355 | 0.4KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-lesson-article-flow::before` | globals.css | 3569–3580 | 0.4KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-card` | globals.css | 915–925 | 0.4KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-cat-exam-chrome.nn-cat-adaptive-exam-session` | learner-premium-ds.css | 120–125 | 0.4KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `html[data-theme] .nn-marketing-surface` | globals.css | 1262–1270 | 0.4KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-header-nav` | globals.css | 1860–1870 | 0.4KB | HIGH_RISK | KEEP_IN_GLOBALS |
| `.nn-brand-hero-logo-slot img.nn-brand-hero-logo` | globals.css | 878–892 | 0.4KB | HIGH_RISK | KEEP_IN_GLOBALS |
| `.nn-btn-secondary:hover:not(:disabled):not([ari...` | globals.css | 2387–2393 | 0.3KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| *(50 more…)* | | | | | |


---

## GLOBAL_REQUIRED — Must stay in globals.css

These are design system foundations: CSS custom properties (:root), theme tokens
([data-theme]), html/body resets, @keyframes, and Tailwind @layer blocks.
**Do not extract.**

| Selector | Source | Lines | Size | Risk | Recommendation |
|---|---|---|---|---|---|
| `@media (max-width: 768px)` | globals.css | 5470–5584 | 2.7KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| `@media (min-width: 1024px)` | globals.css | 2640–2715 | 2.4KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| `@media (min-width: 1024px)` | globals.css | 4621–4692 | 2.2KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| `@media (prefers-reduced-motion: reduce)` | globals.css | 1634–1686 | 1.7KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| `@media (max-height: 900px)` | globals.css | 4468–4523 | 1.5KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| `@media (min-width: 1180px)` | globals.css | 5206–5237 | 1KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| `@media (max-height: 768px)` | globals.css | 4526–4555 | 0.8KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| `@media (max-width: 639.98px)` | globals.css | 4561–4600 | 0.8KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| `@layer utilities` | globals.css | 746–811 | 0.8KB | HIGH_RISK | KEEP_IN_GLOBALS |
| `@media (min-width: 1024px)` | globals.css | 3373–3393 | 0.8KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| `@media (min-width: 1024px)` | globals.css | 1755–1791 | 0.7KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| `@media (prefers-reduced-motion: no-preference)` | globals.css | 2114–2128 | 0.6KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| `@media (prefers-reduced-motion: reduce)` | globals.css | 2555–2580 | 0.6KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| `@media (prefers-reduced-motion: no-preference)` | globals.css | 3640–3648 | 0.6KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| `@media (min-width: 1280px)` | globals.css | 3338–3355 | 0.5KB | NEEDS_REVIEW | KEEP_IN_GLOBALS |
| *(196 more…)* | | | | | |


---

## UNKNOWN — Requires manual review

Not found in current TSX grep. May be applied dynamically (string interpolation,
class generation) or may be legacy/unused. Manual review required before any action.

| Selector | Source | Lines | Size | Risk | Recommendation |
|---|---|---|---|---|---|
| `html[data-theme]` | globals.css | 84–434 | 14KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `html[data-theme="apex"]` | globals.css | 461–604 | 8KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `@theme inline` | globals.css | 606–744 | 6.4KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-nav-popup` | globals.css | 2043–2053 | 0.8KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-dashboard-empty-cta` | globals.css | 4184–4203 | 0.8KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-button-primary-pastel` | globals.css | 1605–1620 | 0.7KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-button-primary` | globals.css | 2301–2316 | 0.6KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-lesson-quick-summary` | globals.css | 3215–3224 | 0.6KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-flashcard-hero-surface` | learner-premium-ds.css | 731–742 | 0.6KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `html[data-theme="midnight"] .nn-flashcard-hero-...` | learner-premium-ds.css | 688–698 | 0.5KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-premium-flashcard-session-root::before` | learner-premium-ds.css | 395–406 | 0.5KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-home-pathways-band .nn-home-pathway-card[da...` | globals.css | 1463–1474 | 0.5KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-home-pathways-band .nn-home-pathway-card[da...` | globals.css | 1437–1448 | 0.5KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-home-pathways-band .nn-home-pathway-card[da...` | globals.css | 1450–1461 | 0.5KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| `.nn-home-pathways-band .nn-home-pathway-card[da...` | globals.css | 1424–1435 | 0.5KB | NEEDS_REVIEW | KEEP_IN_GLOBALS_PENDING_REVIEW |
| *(238 more…)* | | | | | |


---

## Extraction Plan

### Phase 2A — Immediate (SAFE, high confidence)

The following globals.css line ranges have been verified LEARNER_ONLY:

| Range | Lines | Est. KB | Description | Destination |
|---|---|---|---|---|
| 4231–4412 | 182 | ~4 KB | CAT exam session + qbank skeleton | learner-global.css |
| 4818–4952 | 135 | ~3 KB | CAT results + practice viewport | learner-global.css |
| 4953–5013 | 61 | ~1 KB | Smart review screen | learner-global.css |
| 5014–5178 | 165 | ~4 KB | Adaptive study plan | learner-global.css |
| **Total** | **543** | **~12 KB** | | |

### Phase 2B — Planned (NEEDS_REVIEW, require selector-level audit)

| Section | Lines | Risk | Blocker |
|---|---|---|---|
| dark-header/nav (1869–3148) | 1280 | NEEDS_REVIEW | Mixed shared/learner nav chrome |
| card-variants (3722–4230) | 509 | NEEDS_REVIEW | .nn-card-interactive used in marketing |
| premium-gate (5179–6614) | 1436 | NEEDS_REVIEW | Mixed upgrade prompts + shared components |
| preamble shared primitives (0–1868) | 1869 | NEEDS_REVIEW | HTML/body + tokens + mixed UI |

### Phase 2C — Blocked (HIGH_RISK, do not extract)

| Reason | Affected selectors |
|---|---|
| Used in shared layout (header/nav) | .nn-header-*, .nn-nav-*, .nn-brand-* |
| :root custom properties | All CSS var(--*) definitions |
| [data-theme] blocks | Theme palette tokens |
| @keyframes | Animation definitions |
| @layer (Tailwind) | Utility layer registrations |

---

## Notes on Build Memory Pressure

The root CSS graph currently traverses these imports from `globals.css`:
`@import "tailwindcss"`, theme-palettes.css (72KB), semantic-status-tokens.css (52KB),
plus 8 other files. Each import increases the CSS dependency graph that Turbopack
must track. Reducing `globals.css` by 12–40 KB via safe extraction will decrease
graph breadth and peak RSS during CSS compilation.

See `docs/reports/build-memory-pressure-audit.md` for full build graph analysis.
