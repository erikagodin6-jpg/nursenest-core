# Ecosystem QA — master program (recurring audit & governance)

**Status:** Operational playbook — complements `.cursor/rules/ecosystem-platform-guardrails.mdc`  
**Audience:** QA, release, engineering, design  
**Goal:** Prove NurseNest behaves as **one cohesive premium adaptive clinical learning ecosystem**, not isolated pages or a thin question bank.

---

## North-star acceptance (Part 10)

The ecosystem is **healthy** only when **all** are true:

| Gate | Evidence |
|------|----------|
| Routes work | Playwright + manual spot checks; no 404 on canonical learner/marketing URLs |
| Themes consistent | Four themes (Aurora/Ocean/Garden/Midnight) — visual QA + screenshot governance |
| Premium systems cohesive | Shared shells/tokens — cohesion audit (Part 3) |
| Adaptive routing works | Paid/adaptive specs + manual verification of weak-area links |
| Report cards integrate | `/app/account/report` surfaces load; no duplicate mastery UIs |
| Entitlements correct | Tier matrix + paid-user entitlements specs |
| No visual drift | Visual QA baselines + drift doc |
| No emergency fallback UI | No learner-visible “something went wrong” shells on happy paths |
| No placeholder copy | i18n audit + homepage/marketing specs |
| Mobile works | `test:e2e:mobile`, release-gate mobile project |
| Screenshots pass review | Canonical set under screenshot governance (Part 9) |
| Content thresholds | Inventory audit flags ecosystems under ~50 meaningful items (planning target) |

---

## Part 1 — Playwright ecosystem audit (mapping)

Run from **`nursenest-core/`** unless noted. Use **`PLAYWRIGHT_SKIP_WEB_SERVER=1`** against staging/production when appropriate.

### 1. Homepage

| Concern | Existing automation | Notes |
|---------|---------------------|--------|
| Premium sections, ECG band, nav | `tests/e2e/public/homepage-premium-quality.spec.ts`, `homepage-production-smoke.spec.ts`, `marketing-header-bands.spec.ts` | Extend specs when new homepage bands ship |
| Theme switching | Add assertions per theme cookie/`data-theme` when stable selectors exist | Capture screenshots manually until automated theme toggle helper exists |
| Mobile / overflow | `playwright.mobile.config.ts`, `homepage-tier-nav-lessons-routing.spec.ts` | Viewport-specific assertions |
| Broken links / raw keys | `playwright.i18n-audit.config.ts`, `marketing-visual-qa-guard.spec.ts` | Flag raw `intl.` keys in DOM |

**Screenshots:** `visual-qa:capture` (route pack) + optional `visual-qa:critical`.

### 2. Lesson hubs

| Concern | Existing automation |
|---------|---------------------|
| Pagination / no giant dumps | `pathway-lessons-hub-premium.spec.ts`, `lesson-hub-performance.spec.ts` |
| Pathway coverage | `playwright.pathways.config.ts`, tier-matrix public smoke |
| Visual drift | `marketing-visual-qa-guard.spec.ts`, pathway hub premium specs |

### 3. ECG

| Concern | Existing automation |
|---------|---------------------|
| Routes / modules | `package.json` → `test:ecg-video-quiz:routes`; ECG module pages under `/app/modules/ecg` |
| Linked learning | Unit/integration: `ecg-linked-learning.test.ts` (extend Playwright when routes stable) |

### 4. Labs

| Concern | Existing automation |
|---------|---------------------|
| Learner surfaces | `learner-surfaces.smoke.spec.ts`, `learning-routes-live-surfaces.spec.ts` |
| Performance bounds | Pathway lesson performance spec |

### 5. Med dosage

| Concern | Existing automation |
|---------|---------------------|
| Paid surfaces | `paid-user-*` specs; report card inset via dashboard specs |

### 6. OSCE

| Concern | Existing automation |
|---------|---------------------|
| Marketing / locale OSCE | Localized exam routes, `clinical-scenarios` config |

### 7. Case studies / branching

| Concern | Existing automation |
|---------|---------------------|
| Clinical scenarios | `test:e2e:clinical-scenarios` (`playwright.clinical-scenarios.config.ts`) |

### 8. Dashboard + report card

| Concern | Existing automation |
|---------|---------------------|
| Report readiness | `analytics-readiness-report-premium.spec.ts`, dashboard fail-soft specs |

### 9. Practice + CAT + flashcards

| Concern | Existing automation |
|---------|---------------------|
| CAT | `paid-user-cat-smoke.spec.ts`, `paid-user-cat-focused-viewport.spec.ts` |
| Flashcards | `flashcards-live-route-tiers.spec.ts`, unit inventory parity |

### Aggregated “ecosystem audit” config

**`playwright.ecosystem-audit.config.ts`** — curated public + learner-smoke bundle (homepage + hubs + learner surfaces + visual guard).  
**Command:** `npm run test:e2e:ecosystem-audit`

### Deploy / full gate

| Command | Purpose |
|---------|---------|
| `npm run qa:release-gate` | Full release gate (guest + paid + mobile projects as configured) |
| `npm run test:e2e:ci-master` | Paid slice (requires credentials in CI) |
| `npm run test:e2e:site-wide-audit` | Broad read-only production audit (`playwright.site-wide-audit.config.ts`) |

---

## Part 2 — Content inventory audit

**Scripts / patterns:** `audit:exam-bank`, lesson inventory docs under `docs/`, `premium-clinical-ecosystem-inventory.md` pattern (tsx counts when `DATABASE_URL` available).

**Recurring outputs:** Use templates in `docs/governance/ecosystem-qa-report-templates/` → copy to `reports/ecosystem-audit/<YYYY-MM-DD>-ecosystem-content-inventory.md`.

**Flag:** Counts under thresholds; missing pathways; duplicate slugs; broken internal links (`link-resolver` / integrity tests).

---

## Part 3 — Ecosystem cohesion audit

**Manual + semi-automated:**

- Grep: raw `#` hex / `rgb(` in `src/components` (allowlist previews).
- Design review: duplicated card/nav/telemetry patterns vs `docs/ecosystem-design-system-convergence.md`.
- Playwright: visual guard + learner-surfaces smoke.

**Template:** `ecosystem-visual-drift-audit.template.md`.

---

## Part 4 — Entitlement + subscription audit

**Automation:** `paid-user-entitlements.spec.ts`, `site-paid-access-contract.spec.ts`, `tier-matrix` config, Advanced ECG separation per `ecosystem-platform-guardrails.mdc`.

**Roles:** anonymous → free → paid → staff (admin specs when env present).

**Template:** `ecosystem-entitlement-audit.template.md`.

---

## Part 5 — Adaptive learning audit

**Automation:** `paid-user-adaptive-question-flow.spec.ts`, dashboard navigation specs, remediation link checks in CAT/practice specs.

**Manual:** Trace weak-area → destination URLs on staging.

**Template:** `ecosystem-adaptive-learning-audit.template.md`.

---

## Part 6 — Mobile + accessibility audit

**Automation:** `test:e2e:mobile`, `paid-user-accessibility.spec.ts`, release-gate mobile project.

**Manual:** Keyboard paths on critical flows; contrast sampling.

**Template:** `ecosystem-mobile-accessibility-audit.template.md`.

---

## Part 7 — Performance + stability audit

**Automation:** `lesson-hub-performance.spec.ts`, `paid-user-performance.spec.ts`, `paid-user-key-pages-performance.spec.ts`, health/release APIs.

**Build:** `npm run build` (CI); route integrity via i18n/release specs.

**Template:** `ecosystem-performance-audit.template.md`.

---

## Part 8 — Required reports (recurring)

Copy templates from `docs/governance/ecosystem-qa-report-templates/` and fill after each audit cycle (seven templates):

1. `ecosystem-qa-audit.template.md` — master functional QA summary  
2. `ecosystem-content-inventory.template.md`  
3. `ecosystem-visual-drift-audit.template.md`  
4. `ecosystem-entitlement-audit.template.md`  
5. `ecosystem-adaptive-learning-audit.template.md`  
6. `ecosystem-mobile-accessibility-audit.template.md`  
7. `ecosystem-performance-audit.template.md`  

Each filled report must record: **failures**, **warnings**, **screenshots** (paths), **affected routes/pathways**, **severity**, **remediation**.

**Storage:** Date-prefixed copies under `reports/ecosystem-audit/` (repo root) or your team’s audit archive — keep outside hot paths if large binaries attach.

---

## Part 9 — Screenshot governance

**Canonical captures:** Homepage, representative lesson hubs, ECG hub, labs hub, med calc, OSCE entry, dashboard/report card, CAT entry, flashcards hub — **desktop + mobile**, **four themes** where feasible.

**Process:** Run `npm run visual-qa:capture` (with learner storage env); archive PNGs with naming convention `NN-<surface>-<theme>-<viewport>.png`; compare releases for drift.

**Regression:** `visual-qa:critical` + stored baselines per `docs/visual-qa.md`.

---

## Part 10 — Cadence (recommended)

| Frequency | Actions |
|-----------|---------|
| **Every PR** (touching learner/marketing UI) | Targeted Playwright for affected surfaces + lint/typecheck |
| **Weekly / pre-release** | `qa:release-gate` or subset; fill master QA report template |
| **Monthly / major** | Full inventory + visual drift + entitlement matrix on staging |
| **Post-incident** | Performance + adaptive audits |

---

## Helper

```bash
cd nursenest-core && npm run qa:ecosystem:matrix
```

Prints ordered commands for the matrix (no tests executed).

---

## Related documents

- `docs/ecosystem-design-system-convergence.md`  
- `docs/governance/ecosystem-guardrails-rollout.md`  
- `docs/planning/clinical-readiness-ecosystem-implementation-directive.md`  
- `nursenest-core/playwright.visual-qa.config.ts` — visual QA capture/critical regression

---

*Master ecosystem QA program — May 2026.*
