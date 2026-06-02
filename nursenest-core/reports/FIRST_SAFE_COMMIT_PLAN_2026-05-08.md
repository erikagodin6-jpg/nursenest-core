# First safe commit plan — 2026-05-08

**Repository:** `/root/nursenest-core`  
**Active app:** `/root/nursenest-core/nursenest-core`  
**Branch:** `main`  

**Constraints honored:** no `git commit`, no `git push`, no new UI work — planning and exact `git add` recipes only.

## Evidence snapshot

| Signal | Value |
|--------|------|
| `git diff --stat` | **303** files changed; ~8634 insertions, ~1432 deletions |
| `git diff --cached` | *(empty)* |
| `git status` | 303 modified tracked paths + **91** untracked |

### Sources merged

- `reports/PRE_COMMIT_STAGING_PLAN_2026-05-08.md` — inventory, duplicate-report warnings, verification table
- `reports/PRE_COMMIT_VERIFICATION_2026-05-08.md` / `nursenest-core/reports/PRE_COMMIT_VERIFICATION_2026-05-08.md` — aligned content; prefer **`nursenest-core/reports/`** for app QA artifacts
- `nursenest-core/reports/ui-redesign-preview/*.md` — canonical redesign set; repo-root `reports/ui-redesign-preview/` is a **partial duplicate** — consolidate before staging both trees

### Verification already run (from `nursenest-core/`)

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | **PASS** |
| `npm run test:homepage` | **PASS** (13 passed, 1 skipped) |
| `npx playwright test -c playwright.release-gate.config.ts --list` | **PASS** — 19 tests, 9 files |

**Note:** Full `npm run build` may exit **137 (OOM)** on low-RAM hosts.

---

## Explicit exclusions (do not stage)

| Category | Paths / globs |
|----------|-----------------|
| Next build output | `.next/` |
| Playwright artifacts | `test-results/`, `playwright-report/` |
| Env / secrets | `.env`, `.env.*`, `*.local` |
| Scratch / pipe logs | `nursenest-core/pw-phase1-out.txt`, `nursenest-core/reports/ui-redesign-preview/pw-learner-smoke.txt`, `nursenest-core/reports/ui-redesign-preview/_write_test2.md` |
| Huge screenshot dumps | `nursenest-core/preview-screenshots/qa-rn-rpn/**`, `nursenest-core/reports/ui-redesign-preview/rn-rpn-playwright-qa/**` *(unless policy requires binaries)* |
| Duplicate report trees | Repo-root `reports/PHASE_6*.md`, `reports/PRE_COMMIT_*.md`, `reports/ui-redesign-preview/**` if duplicate of `nursenest-core/reports/` — pick **one** canonical tree |

---

## Group 1 — Build / release-gate infrastructure

**Exact `git add`:**

```bash
cd /root/nursenest-core

git add package.json nursenest-core/package.json

git add nursenest-core/playwright*.config.ts

git add \
  nursenest-core/scripts/build-normalized-lesson-indexes.runner.mts \
  nursenest-core/scripts/ensure-node-memory.mjs \
  nursenest-core/scripts/run-lesson-indexes-for-build.mjs \
  nursenest-core/scripts/run-next-prod-build.mjs \
  nursenest-core/scripts/validate-release-gate-env.mjs \
  nursenest-core/scripts/verify-normalized-lesson-indexes.runner.mts

git add nursenest-core/docs/RELEASE_QA.md \
        nursenest-core/docs/testing/release-gate-runbook.md

git add nursenest-core/src/instrumentation.ts \
        nursenest-core/src/lib/lessons/pathway-lesson-catalog-sync.ts \
        nursenest-core/src/proxy.ts

git add nursenest-core/src/lib/observability/server-stderr-line.ts

git add nursenest-core/tests/e2e/helpers/e2e-env.ts \
        nursenest-core/tests/e2e/helpers/verify-test-accounts.ts

git add nursenest-core/tests/e2e/setup/auth.setup.ts

git add nursenest-core/tests/e2e/release/
```

**Proposed commit message:**

```
chore(build): harden lesson indexes, release-gate env, and Playwright base URLs

- Lesson index runners + verify fail-fast; prod build memory/timing helpers
- Release QA doc + runbook; validate-release-gate-env improvements
- E2E base URL resolution, auth setup, and release-only Playwright pack
- Instrumentation + proxy touchpoints; pathway catalog sync
- Server stderr observability helper for release diagnostics
```

| | |
|--|--|
| **Risk** | **Low** |
| **Validation already run** | `typecheck:critical`, `test:homepage`, `playwright.release-gate.config.ts --list` |
| **Re-run after commit** | Same three commands from `nursenest-core/` |

---

## Group 2 — Homepage / premium design system

```bash
git add nursenest-core/src/app/globals.css nursenest-core/src/app/premium-redesign-2026.css
git add nursenest-core/src/app/'(marketing)'/'(default)'/layout.tsx nursenest-core/src/app/'(marketing)'/loading.tsx
git add nursenest-core/src/components/marketing/home/
git add nursenest-core/src/components/marketing/pricing-hero.tsx nursenest-core/src/components/marketing/pricing-learner-faq.tsx nursenest-core/src/components/marketing/pricing-page-client.tsx nursenest-core/src/components/marketing/pricing-region-faq.tsx nursenest-core/src/components/marketing/pricing-reliability-faq.tsx
git add nursenest-core/src/components/marketing/marketing-default-layout-chrome-failsafe.tsx
git add nursenest-core/src/components/layout/marketing-header-utility-strip.tsx nursenest-core/src/components/layout/mobile-context-drawer.tsx nursenest-core/src/components/layout/site-header.tsx
git add nursenest-core/src/components/theme/theme-picker.tsx
git add nursenest-core/src/lib/theme/theme-registry.ts nursenest-core/src/lib/theme/marketing-hero-pattern.ts
git add nursenest-core/src/lib/observability/home-perf-diag.ts nursenest-core/src/lib/observability/home-perf-trace.ts nursenest-core/src/lib/observability/layout-stderr-trace.ts nursenest-core/src/lib/observability/nn-home-isolation-flags.ts
```

**Message:** `feat(marketing): premium homepage shell, pricing layout fix, and theme observability`  
**Risk:** Medium — **Re-run:** `npm run test:homepage`

---

## Group 3 — Learner + study surfaces

```bash
git add nursenest-core/styles/learner-ds.css
git add nursenest-core/src/app/'(student)'/app/loading.tsx nursenest-core/src/app/'(student)'/app/'(learner)'/layout.tsx nursenest-core/src/app/'(student)'/app/'(learner)'/loading.tsx
git add nursenest-core/src/app/'(student)'/app/'(learner)'/account/layout.tsx
git add nursenest-core/src/components/student/learner-account-nav.tsx nursenest-core/src/components/student/learner-account-shell-header.tsx nursenest-core/src/components/student/learner-dashboard-page-shell.tsx nursenest-core/src/components/student/learner-readiness-premium.tsx nursenest-core/src/components/student/learner-report-card-premium.tsx nursenest-core/src/components/student/subscription-paywall.tsx
git add nursenest-core/src/components/ui/premium-loader/
git add nursenest-core/src/components/study/active-study-session.tsx nursenest-core/src/components/study/analytics-next-steps.tsx nursenest-core/src/components/study/analytics-performance-report.tsx nursenest-core/src/components/study/category-mastery-section.tsx nursenest-core/src/components/study/flashcard-viewer.tsx nursenest-core/src/components/study/readiness-trend-panel.tsx nursenest-core/src/components/study/study-activity-heatmap.tsx
git add nursenest-core/src/components/study/practice-rationale-full-panel.tsx nursenest-core/src/components/study/practice-test-per-item-rationale.tsx nursenest-core/src/components/study/practice-rationale-full-panel.types.ts
```

**Message:** `feat(learner): premium learner shell, study rhythm surfaces, and branded loaders`  
**Risk:** Medium — **Re-run:** `npm run typecheck:critical`

---

## Group 4 — Lessons / pathway surfaces

```bash
git add nursenest-core/src/app/'(marketing)'/'(default)'/'[locale]'/'[slug]'/'[examCode]'/lessons/
git add nursenest-core/src/components/pathway-lessons/
git add nursenest-core/src/components/lessons/
git add nursenest-core/src/lib/seo/pathway-breadcrumbs.ts
git add nursenest-core/reports/lesson-normalization-coverage.json nursenest-core/reports/lesson-normalization-coverage.md
git add nursenest-core/src/app/'(marketing)'/'(default)'/'[locale]'/'[slug]'/'[examCode]'/questions/page.tsx
```

**Message:** `feat(lessons): pathway hubs, lesson chrome, and normalization evidence`  
**Risk:** Medium–High — **Re-run:** `typecheck:critical`

---

## Group 5 — CAT / practice / flashcards / report analytics

```bash
git add nursenest-core/src/app/'(marketing)'/'(default)'/'[locale]'/'[slug]'/'[examCode]'/cat/page.tsx
git add nursenest-core/src/app/'(student)'/app/'(learner)'/practice-tests/
git add nursenest-core/src/app/'(student)'/app/'(learner)'/flashcards/
git add nursenest-core/src/app/'(student)'/app/'(learner)'/lessons/'[id]'/
git add nursenest-core/src/components/student/cat-direct-launch-client.tsx nursenest-core/src/components/student/cat-live-transparency-strip.tsx nursenest-core/src/components/student/cat-results-coach-section.tsx nursenest-core/src/components/student/pathway-cat-session-start-client.tsx
git add nursenest-core/src/components/student/practice-exam/
git add nursenest-core/src/components/student/practice-test-runner-client.tsx nursenest-core/src/components/student/practice-test-runner/
git add nursenest-core/src/components/student/practice-tests-hub-client.tsx
git add nursenest-core/src/components/flashcards/
git add nursenest-core/src/components/study/cat-rationale-panel.tsx nursenest-core/src/components/study/cat-readiness-hero.tsx
git add nursenest-core/src/app/'(student)'/app/'(learner)'/account/analytics/analytics-detail-client.tsx
git add nursenest-core/src/components/ecg-module/ecg-module-page.tsx
```

**Message:** `feat(study): CAT, practice exams, flashcards, and analytics detail premium pass`  
**Risk:** High — **Re-run:** `typecheck:critical`; targeted Playwright when env available

---

## Group 6 — Blogs / tools / allied / new-grad

```bash
git add nursenest-core/src/app/'(marketing)'/'(default)'/blog/
git add nursenest-core/src/app/'(marketing)'/'(default)'/tools/
git add nursenest-core/src/app/'(marketing)'/'[locale]'/tools/
git add nursenest-core/src/app/'(marketing)'/'(default)'/allied-health/page.tsx nursenest-core/src/app/'(marketing)'/'(default)'/allied/
git add nursenest-core/src/app/'(marketing)'/'(default)'/canada/new-grad/ nursenest-core/src/app/'(marketing)'/'(default)'/us/new-grad/
git add nursenest-core/src/app/'(marketing)'/'[locale]'/faq/
git add nursenest-core/src/components/blog/
git add nursenest-core/src/components/marketing/allied-health-hub-content.tsx nursenest-core/src/components/marketing/allied-health-pathway-hub.tsx
git add nursenest-core/src/components/marketing/new-grad-marketing-landing.tsx nursenest-core/src/components/marketing/new-grad-work-area-hub.tsx
git add nursenest-core/src/components/marketing/nursing-tier-hub-page.tsx
git add nursenest-core/src/components/marketing/faq-product-screenshots-section.tsx
git add nursenest-core/src/components/legal/faq-legal-marketing-view.tsx nursenest-core/src/components/legal/legal-markdown-body.tsx
git add nursenest-core/src/components/tools/
git add nursenest-core/src/lib/blog/safe-blog-queries.ts
git add nursenest-core/src/lib/blog/blog-post-category-visual.ts nursenest-core/src/lib/blog/blog-post-category-visual.test.ts
git add nursenest-core/src/components/marketing/new-grad/
```

**Message:** `feat(marketing): blogs, tools, allied, and new-grad premium refresh`  
**Risk:** Medium

---

## Group 7 — Tests / docs / reports / i18n

After Group 1 is committed, `git add nursenest-core/tests/e2e/` stages the remaining specs (release pack already on main).

```bash
git add nursenest-core/tests/e2e/
git add nursenest-core/docs/
git add nursenest-core/reports/
git reset HEAD -- nursenest-core/reports/ui-redesign-preview/_write_test2.md nursenest-core/reports/ui-redesign-preview/pw-learner-smoke.txt 2>/dev/null || true
# If large binaries were staged: git reset HEAD -- nursenest-core/reports/ui-redesign-preview/rn-rpn-playwright-qa/

git add client/public/i18n/
git add nursenest-core/public/i18n/
git add tools/i18n/

git add nursenest-core/src/lib/i18n/marketing-message-keys.generated.ts
git add nursenest-core/src/lib/theme/theme-registry.public-marketing.contract.test.ts
git add nursenest-core/src/components/skeletons/hub-page-skeleton.tsx
```

**Message:** `test(i18n): shard updates, marketing keys, e2e breadth, and QA reports`  
**Risk:** Low–Medium — **Re-run:** `typecheck:critical`, `npm run test:homepage`

**Duplicate reports:** consolidate repo-root `reports/` vs `nursenest-core/reports/` before adding root copies.

---

## Group 8 — Curated screenshots only *(optional)*

```bash
git add nursenest-core/preview-screenshots/README.md \
        nursenest-core/preview-screenshots/CAPTURE_INSTRUCTIONS.md \
        nursenest-core/preview-screenshots/.gitkeep
```

**Message:** `docs(qa): preview screenshot capture instructions`  
**Risk:** Low

---

## Recommended first commit *(Group 1 only)*

Use the **Group 1** `git add` block at the top.

**Verify immediately after committing:**

```bash
cd /root/nursenest-core/nursenest-core
npm run typecheck:critical
npm run test:homepage
npx playwright test -c playwright.release-gate.config.ts --list
```
