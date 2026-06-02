# SEO regression guardrails (Phase 8)

**Purpose:** Durable CI/test guardrails for sitemap segmentation, private-route exclusion, canonical/hreflang consistency, breadcrumb JSON-LD, localized SEO labels, and robots sitemap strategy.

**Scope:** Guardrails only. No runtime sitemap routes, robots behavior, canonical/hreflang generation, page routing, entitlement, or sitemap segment list changes.

---

## Files changed

| File | Change |
|---|---|
| `package.json` | Added `seo:guardrails` npm script. |
| `scripts/seo-guardrails.mjs` | New stable CI runner that composes sitemap validation/report plus targeted SEO contract suites. |
| `src/components/seo/breadcrumb-json-ld.test.tsx` | Phase 7/8 guardrail: BreadcrumbList schema shape + private/system/query/hash URL filtering. |
| `src/components/blog/blog-post-distribution-footer.test.tsx` | Phase 7/8 guardrail: public blog footer links remain marketing-safe and app-only actions use login callbacks. |
| `src/lib/lessons/marketing-lesson-path-guard.ts` | Hardened public blog related-lesson guard against `/app`, `/admin`, `/api`, `/seo`, query, and hash paths. |
| `src/lib/lessons/marketing-lesson-path-guard.test.ts` | Contract coverage for the hardened guard. |
| `src/lib/seo/breadcrumb-i18n.test.ts` | Added localized breadcrumb raw-key fallback prevention. |
| `docs/reports/seo-regression-guardrails.md` | This report (also copied at repo root docs path when present). |

---

## Command added

```bash
npm run seo:guardrails
```

Implementation: `node scripts/seo-guardrails.mjs`.

The runner uses explicit test file lists rather than a broad `src/lib/seo/*.test.ts` glob so it can be CI-stable while still covering the required SEO regression surfaces.

---

## What `seo:guardrails` runs

| Step | Command / files | Coverage |
|---|---|---|
| Sitemap validation | `npm run sitemap:validate` | Index children, child XML, public URL validation, duplicate locs, private route exclusion, URL/time budgets. |
| Sitemap report | `npm run sitemap:report` | Refreshes `docs/reports/sitemap-segmentation-validation.md`; lightweight enough for CI in current environment. |
| Robots + sitemap contracts | `src/app/robots.txt/route.test.ts`, `robots-route-source.contract.test.ts`, sitemap index/segment/filter/phase tests | robots index-only strategy; child filenames; sitemap partition ownership; no `/app`/admin/api/query/hash clinical leaks; segment validator contracts. |
| Canonical / hreflang / localized SEO | `marketing-alternates.test.ts`, `exam-pathway-hub-alternates.test.ts`, `localized-seo-readiness.test.ts`, `public-url-validator.test.ts`, `safe-marketing-metadata.test.ts` | Canonical path shape; hreflang consistency; localized readiness policy; public URL validator; safe metadata fallback behavior. |
| Breadcrumb / schema / internal links | `breadcrumb-json-ld.test.tsx`, `blog-post-distribution-footer.test.tsx`, `breadcrumb-i18n.test.ts`, `pathway-breadcrumbs.test.ts`, `marketing-lesson-path-guard.test.ts` | BreadcrumbList validity; JSON-LD private URL filtering; localized breadcrumb labels; pathway breadcrumb canonical alignment; blog footer paywall-safe links. |

---

## Current pass/fail status

| Command | Status |
|---|---|
| `npm run typecheck:critical` | Pass |
| `npm run seo:guardrails` | Pass |
| `npm run sitemap:validate` | Pass |

Latest `seo:guardrails` result: **OK**.

---

## Known exclusions

These are intentionally **not** in `seo:guardrails` yet because the broad `node --import tsx --test src/lib/seo/*.test.ts` run currently includes existing failures unrelated to the new guardrail runner:

| Excluded broad area | Reason |
|---|---|
| `marketing-locale-regional-url-invariants.test.ts` | Existing assertion failure observed in the broad glob (`pathnameHasLocalePrefixBeforeExamCountry allows /us/np/… and /fr/pricing`). Needs focused fix before adding to CI guardrail. |
| `route schema hardening` checks for default/pricing pages | Existing broad-suite failures observed; not introduced by Phase 8. |
| `sitemap-build-safe-mode.test.ts` | Env/build-lifecycle sensitive; previously known failing class. |
| `sitemap-build-skip.test.ts` | Env/build-lifecycle sensitive; previously known failing class. |

The guardrail script still covers sitemap build behavior through live validation/report and targeted segment contracts, while leaving known flaky/failing legacy tests out of the CI-critical path until separately repaired.

---

## Recommended CI placement

1. Run **after install/build preparation** and before deployment promotion:

```bash
npm run typecheck:critical
npm run seo:guardrails
```

2. Keep `npm run sitemap:validate` available as a focused rerun command when debugging sitemap failures (it is also included inside `seo:guardrails`).
3. Add the broad `src/lib/seo/*.test.ts` sweep as a **non-blocking nightly** until known exclusions are fixed; then promote selected files into `seo:guardrails`.
4. On deploy pipelines with constrained DB/network access, set `SITEMAP_VALIDATE_SEGMENT_BUDGET_MS` explicitly if cold collectors are slow but still valid.

---

## Follow-up recommendations

1. Fix the known broad-suite failures and gradually migrate them into `seo:guardrails`.
2. Add HTTP/staging smoke (`verify:sitemap`) as a separate post-deploy job, not a pre-merge unit guardrail.
3. Add browser visual checks for breadcrumb mobile wrapping as a UI QA job rather than a sitemap guardrail.

---

*Phase 8: durable SEO regression guardrails. Runtime routes, robots, canonical/hreflang generation, and sitemap segments were not changed.*
