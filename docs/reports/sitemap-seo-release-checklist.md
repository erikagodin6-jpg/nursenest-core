# Sitemap and SEO release checklist (Phase 9)

**Purpose:** Final production signoff checklist and post-launch monitoring plan for the segmented sitemap and SEO guardrail program.

**Scope:** Release/readiness documentation only. This phase does **not** change sitemap runtime routes, `robots.txt`, canonical logic, hreflang logic, routes, or entitlement/paywall behavior.

**References:**
- `docs/planning/sitemap-architecture-audit-and-roadmap.md`
- `docs/reports/sitemap-segmentation-final-seo-evidence.md`
- `docs/reports/sitemap-production-qa-and-search-console-handoff.md`
- `docs/reports/seo-regression-guardrails.md`
- `docs/reports/sitemap-segmentation-validation.md`

---

## 1. Final pre-merge checklist

| Check | Owner | Status / evidence |
|---|---|---|
| `npm run typecheck:critical` passes | Eng | Required before merge. |
| `npm run seo:guardrails` passes | Eng | Required before merge; covers sitemap validation/report, robots, sitemap contracts, canonical/hreflang/localized SEO, breadcrumb/internal-link schema. |
| `npm run sitemap:validate` passes | Eng | Required before merge; expected `Errors 0`, duplicate locs `0`, invalid/private locs `0`. |
| `npm run sitemap:report` refreshes validation evidence | Eng | Required before merge; updates `docs/reports/sitemap-segmentation-validation.md`. |
| No runtime sitemap/robots/canonical/hreflang/page route changes in this phase | Reviewer | Confirm via diff. |
| No `/app`, `/admin`, `/api`, `/seo`, query, or hash sitemap locs | Eng | Covered by validator and guardrails. |
| No duplicate locs across child sitemaps | Eng | Covered by validator. |
| Breadcrumb JSON-LD filters private/system URLs | Eng | Covered by `breadcrumb-json-ld.test.tsx`. |
| Blog related lesson links reject private/system paths | Eng | Covered by `marketing-lesson-path-guard.test.ts` + blog footer test. |
| Known exclusions documented | Reviewer | See §6. |

**Pre-merge go/no-go:** Go when all required commands pass and no reviewer-blocking SEO/runtime concerns remain.

---

## 2. Deploy checklist

| Step | Action | Pass criteria |
|---|---|---|
| D1 | Deploy approved branch to production. | Deployment succeeds without route/runtime errors. |
| D2 | Fetch `https://www.nursenest.ca/robots.txt`. | Exactly one `Sitemap:` line pointing to `https://www.nursenest.ca/sitemap.xml`; private disallows remain. |
| D3 | Fetch `https://www.nursenest.ca/sitemap.xml`. | XML root is `<sitemapindex>`; child locs are canonical-origin sitemap URLs. |
| D4 | Fetch each child sitemap from index. | Every child returns valid XML (`urlset`) and HTTP 200. |
| D5 | Spot-check representative locs from every segment. | Public URLs only; no query/hash; no private route leakage. |
| D6 | Archive post-deploy evidence. | Save logs/screenshots for robots, index, child samples, and validation output. |

---

## 3. Rollback checklist

Use only for a documented production sitemap/SEO incident.

| Step | Action | Notes |
|---|---|---|
| R1 | Revert the deploy commit or restore the last known-good sitemap implementation through normal release process. | Avoid hot-patching production outside review. |
| R2 | Preserve public URL filtering (`filterPublicSitemapEntries`, `isValidPublicUrl`) in any rollback implementation. | Never roll back into private-route leakage. |
| R3 | Verify `robots.txt` after rollback. | `Sitemap:` must point to the actual discovery file being served. |
| R4 | Rerun `npm run seo:guardrails`, `npm run sitemap:validate`, and `npm run sitemap:report`. | Must pass before declaring rollback complete. |
| R5 | Update Search Console sitemap submission only if discovery URL changed. | Current policy uses index-only submission. |
| R6 | Record incident notes and unresolved warnings. | Include failed URLs, timestamps, and remediation owner. |

---

## 4. Search Console submission checklist

| Step | Action | Status / notes |
|---|---|---|
| GSC1 | Submit **only** `https://www.nursenest.ca/sitemap.xml`. | Current policy: robots points to sitemap index; child sitemaps are discovered through index locs. |
| GSC2 | Do **not** bulk-submit child sitemaps unless policy changes. | Avoid redundant operational surface. |
| GSC3 | Record Search Console submission date/time and submitter. | Add to release ticket. |
| GSC4 | Inspect one representative URL from each segment. | Core, blog, pathways, lessons, localized, clinical-modules, allied, new-grad. |
| GSC5 | Monitor submitted vs indexed counts for 7, 14, and 30 days. | Expect lag; investigate large sustained deltas. |
| GSC6 | Monitor excluded/noindex/private route signals. | `/app`, `/admin`, `/api`, `/seo` should not appear as sitemap-submitted public URLs. |

---

## 5. Post-launch monitoring checklist

| Area | What to monitor | Healthy signal | Escalate when |
|---|---|---|---|
| Submitted vs indexed counts | GSC sitemap report by sitemap index/child | Counts stabilize over time; expected lag for new/low-value URLs. | Large sustained gap on high-value segments after normal recrawl window. |
| Crawl errors | GSC pages + server logs | No widespread 404/5xx for sitemap locs. | Any child sitemap fetch failure; repeated 5xx; unexpected 404 clusters. |
| Excluded URLs | GSC excluded/noindex reports | Partial/disabled locales and auth/noindex surfaces behave as expected. | Public sitemap locs are excluded due to unexpected noindex/canonical mismatch. |
| Duplicate canonical warnings | GSC canonical report | Few/no new duplicate canonical warnings from segmentation. | New warnings cluster around pathway/localized/programmatic routes. |
| Alternate/hreflang warnings | GSC international targeting / URL Inspection | Alternates align with page metadata; no fake locale-prefixed pathway URLs. | Hreflang points to non-indexable, wrong-origin, or non-routed URLs. |
| Private route leakage | GSC URL examples, logs, sitemap validator | Zero `/app`, `/admin`, `/api`, `/seo` sitemap locs. | Any private route appears as sitemap-submitted or public BreadcrumbList item. |
| Sitemap fetch errors | GSC sitemap status | `/sitemap.xml` and children fetch successfully. | “Couldn’t fetch,” invalid XML, wrong content type, or stale child URLs. |
| Segment URL count drift | `npm run sitemap:report` snapshots | Counts grow within expected content volume; no segment near 40k warning. | Sudden spikes/drops; any segment approaches 40k/48k guardrail. |
| Blog/lesson lastmod freshness | `sitemap-blog.xml`, lesson segment sample | Blog posts include current `lastmod`; lesson detail freshness follows collector policy. | Stale blog lastmod after publishing; lesson details disappear unexpectedly. |

Suggested cadence:
- **Day 0:** production fetch checks + Search Console submission.
- **Day 1–2:** sitemap fetch status + private leakage check.
- **Day 7:** submitted/indexed trend review.
- **Day 14/30:** canonical/hreflang/excluded URL review and segment count drift review.

---

## 6. Known exclusions

These are documented in `docs/reports/seo-regression-guardrails.md` and should not block this release if the focused guardrail script passes:

| Exclusion | Reason / next action |
|---|---|
| Broad `src/lib/seo/*.test.ts` sweep | Includes known unrelated failures; keep as non-blocking/nightly until repaired. |
| `marketing-locale-regional-url-invariants.test.ts` | Existing assertion failure in broad suite; fix separately, then promote into `seo:guardrails`. |
| Route schema hardening page checks | Existing broad-suite failures for default/pricing pages; repair separately. |
| `sitemap-build-safe-mode.test.ts` / `sitemap-build-skip.test.ts` | Env/build-lifecycle sensitive; keep outside critical guardrail until stabilized. |
| Browser breadcrumb/mobile screenshots | Not part of CLI guardrail; run in visual QA when UI presentation changes. |

---

## 7. Future sitemap phases

| Future phase | Description |
|---|---|
| HTTP/live-origin smoke | Add post-deploy job around `verify:sitemap` or equivalent with `BASE_URL=https://www.nursenest.ca`. |
| Orphan route diff | Compare sitemap loc set vs public route inventory/GSC exports to find missing or stale public URLs. |
| Segment split reviews | Revisit `sitemap-questions.xml`, flashcards, ECG/labs only after public marketing route policy is approved and disjoint ownership rules are defined. |
| Breadcrumb visual QA | Add Playwright screenshots for desktop/mobile breadcrumb wrap on pathway, lesson, blog, localized, and tools pages. |
| GSC trend automation | Store Search Console submitted/indexed/excluded counts by segment over time. |

---

## 8. Final go/no-go status

**Go, pending deploy evidence capture.**

Current command status should be recorded below before merge/deploy:

| Command | Expected release status |
|---|---|
| `npm run typecheck:critical` | Pass |
| `npm run seo:guardrails` | Pass |
| `npm run sitemap:validate` | Pass |
| `npm run sitemap:report` | Pass |

Post-deploy production fetch and Search Console submission remain operator tasks, not local code checks.

---

*Phase 9: final release checklist and post-launch monitoring plan. No runtime behavior changes.*
