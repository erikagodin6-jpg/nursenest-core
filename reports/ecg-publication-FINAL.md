# ECG publication and learner UX — final report

**Date:** 2026-05-09  
**Scope:** Canonical app under `nursenest-core/nursenest-core`.  
**Figma:** N/A for this pass — copy, API semantics, robots metadata, and policy tests only; no new visual system or layout chrome beyond removing the learner-facing "hidden" banner and adding a staff-only preview strip.

---

## Root cause: "Unable to load ECG questions right now"

The client treats **any non-OK response or ok: false JSON** as a hard failure and previously showed a single generic string.

**Server behavior (`getCurrentEcgModuleAccess` + `GET /api/modules/ecg/questions`):**

1. **Module gates:** `ENABLE_ECG_MODULE` must be truthy and internal course `ecg-mastery-module` must be **`published`** (`getEcgModuleStatus`). Otherwise only **admin preview** receives API access; learners get denied.
2. **Learner gates (when published):** Requires a signed-in user, **RN or NP** tier (`canAccessEcgModuleForTier`), **active subscription** (`canonical.hasAccess`), and **no RPN / REx-PN pathway** (`assertNoEcgForRpn`).
3. **All denial paths** previously returned **HTTP 404** with `{ ok: false, code: "not_found", detail: reason }`, so the browser could not distinguish **unauthenticated**, **paywalled**, **wrong tier/pathway**, or **module disabled** — learners only saw the same generic error.

**Inventory:** When access succeeds but **no rows** match `prisma.ecgVideoQuestion` (level/mode/tier/`isPremium`), the API still returns `{ ok: true, items: [] }` and the UI correctly shows *No ECG items are published for this mode yet.* That path was **not** the source of the generic load error.

**Fix applied:** Map denial reasons to **401** (`unauthorized`), **403** (`tier_denied`, `premium_required`), and **404** (`disabled`, `not-admin`), with stable JSON `{ code: "ecg_access_denied", detail }`. The client parses JSON safely and shows **actionable copy** (sign-in, subscription/pathway, environment disabled, or generic retry).

---

## Publication / "hidden" UX

- **Removed** the always-on yellow **Hidden / Admin Preview Only** strip from `EcgModulePage` (learner shell).
- **Added** `EcgModulePublicationNotice` in the ECG layout: shown **only** when access is **`admin-preview`** (staff viewing before publish). Published learners see **no** preview/hidden messaging.
- **`/modules/ecg` layout metadata:** `generateMetadata` sets **noindex** always (subscriber app surface); **`follow: true`** when the module is **enabled and published** so crawlers can discover via in-app links without implying public indexing of gated content. Draft/unpublished keeps **nofollow**. Legacy `/modules/ecg-interpretation` layout unchanged (**noindex, nofollow**).

---

## Pathway gating (existing policy, verified in repo)

- **RN / NP hubs:** ECG tile remains when `pathwayAllowsEcgLinkedLearning` (`exam-pathway-hub-premium-modules.ts` + `ecg-linked-learning.ts`): RN/NP tier only; excludes `rex-pn` and **new-grad** pathway ids.
- **RPN, New Grad, Allied, Pre-Nursing:** Contract and E2E specs continue to assert **no ECG** hub marker where policy requires omission.
- **Server enforcement:** Unchanged — `ecg-module.server.ts` + `assertNoEcgForRpn` + canonical learner access.

---

## SEO / sitemap / hreflang

- **Sitemap / global nav / pricing:** `hidden-module-preview.test.ts` updated so **global** `src/lib/navigation` must not list `/modules/ecg*`, while **pathway hub marketing** may still deep-link to `/modules/ecg/...` (RN/NP policy). ECG app routes remain **out of merged marketing sitemap** collectors per existing SEO tests.
- **No admin route leakage** in this change set.

---

## Commands run (exit codes)

| Command | Exit |
|---------|------|
| `npm run typecheck:critical` | 0 |
| `npm run test:homepage` | 0 |
| `node --import tsx --test src/lib/modules/hidden-module-preview.test.ts src/lib/ecg-module/ecg-module-contract.test.ts` | 0 |
| `node --import tsx --test src/components/exam-pathways/exam-pathway-hub-premium-modules.contract.test.tsx` | 0 |

---

## Files touched

- `src/lib/ecg-module/ecg-module.server.ts` — HTTP status mapping for API denials.
- `src/app/modules/ecg/layout.tsx` — `generateMetadata`, staff preview notice wrapper.
- `src/components/ecg-module/ecg-module-publication-notice.tsx` — **new** staff-only banner.
- `src/components/ecg-module/ecg-module-page.tsx` — removed learner "hidden" banner.
- `src/components/ecg-module/ecg-module-client.tsx` — resilient JSON + reason-specific messages (questions + worksheets).
- `src/lib/modules/hidden-module-preview.test.ts` — robots/nav assertions aligned with published ECG + hub deep links.
- `src/lib/ecg-module/ecg-module-contract.test.ts` — layout metadata expectations.
- `src/components/marketing/allied-health-pathway-hub.tsx` — allied "specialized modules" blurb (no hidden/admin preview phrasing for learners).

---

## Screenshots

Directory prepared: `docs/screenshots/ecg-published/` (with `.gitkeep`). **No PNGs captured** in this run — Playwright + dev server against real published module + credentials was not executed here.

---

## Truthpack

`.vibecheck/truthpack/` was **not present** in this workspace clone; product tiers/routes were taken from existing code and tests only.

---

## Production-publishable?

**Yes, with ops gates unchanged:**

1. Set `ENABLE_ECG_MODULE=true` in the deployment environment.
2. Ensure `InternalCourse` row `ecg-mastery-module` is **`published`** (admin publish flow + readiness checks).
3. Seed or import `ecg_video_questions` (e.g. `scripts/seed-ecg-premium-curated-pack.mts`) so learners do not see empty modes where content is expected.
4. E2E opt-in remains documented: `E2E_ECG_MODULE_ENABLED=1` for `tests/e2e/ecg-module/ecg-module-learn-flow.spec.ts`.

**Blockers for screenshot evidence:** local/staging app + auth + env flags not run in this session.
