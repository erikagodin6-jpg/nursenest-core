# Sitemap segmentation — Phase 2 report

**Date:** 2026-05-10  
**Scope:** Pathway + localized urlsets, narrowed `/sitemap-lessons.xml` to lesson-detail URLs only, core partitioning, index update.

## Files changed

| Area | Paths |
|------|--------|
| Collectors / helpers | `src/lib/seo/sitemap-static-xml.ts` — `PathwayLessonSitemapSegmentMode`, `collectPathwayLessonDetailSeoUrls`, `collectPathwayLessonHubAndTopicSeoUrls`, `collectPathwaysSegmentUrls`, `collectLocalizedMarketingSegmentUrls`; `CollectCoreUrlsOptions` adds `omitLocalizedMarketingUrls`, `omitExamPathwayAndTopicProgrammaticUrls`; `collectCoreUrls` honors those flags |
| Index + fallbacks | `src/lib/seo/sitemap-index-children.ts` — seven index children; `SITEMAP_FALLBACK_PATHWAYS_PATHS`, `SITEMAP_FALLBACK_LESSON_DETAIL_PATHS`, `SITEMAP_FALLBACK_LOCALIZED_PATHS` |
| Routes | `src/app/sitemap-core.xml/route.ts` — three omit flags; **new** `src/app/sitemap-pathways.xml/route.ts`, `src/app/sitemap-localized.xml/route.ts`; `src/app/sitemap-lessons.xml/route.ts` — details-only collector; `src/app/sitemap.xml/route.ts` — comment |
| Tests | `src/lib/seo/sitemap-index.contract.test.ts`, `src/lib/seo/sitemap-merged-route.test.ts`, **new** `src/lib/seo/sitemap-phase2-segmentation.contract.test.ts` |

## Segment URL counts (representative)

Counts depend on production DB/catalog state and `MAX_PATHWAY_DERIVED_SITEMAP_URLS` / pathway budget.

| Segment | Notes |
|---------|--------|
| **`/sitemap-localized.xml`** | **64** `<loc>` candidates emitted by `collectLocalizedMarketingSegmentUrls` before `filterPublicSitemapEntries` (tier-full locales only). Measured locally via `tsx` against canonical origin. |
| **`/sitemap-pathways.xml`** | Exam hubs (`collectExamPathwayUrls`) + pathway-topic programmatic + `/lessons` + pathway lesson hubs + topic clusters (`segment: "hubs-topics"`). Bounded by shared pathway-derived cap. |
| **`/sitemap-lessons.xml`** | Lesson-detail URLs only (`…/lessons/{slug}`). Same cap/budget as prior merged pathway collector for the detail phase. |
| **`/sitemap-core.xml`** | Default-locale marketing base + questions/topics/tools/expansion/regional + NP practice-test hubs + content-backed study hubs + programmatic study SEO + allied + pre-nursing + OSCE marketing hubs — **without** tier-full locale rows, exam/pathway-topic programmatic rows, or pathway lesson URLs (owned by other segments). |

Blog segment unchanged (`/sitemap-blog.xml`).

## Excluded locales (localized segment)

`sitemap-localized.xml` uses `getSitemapIncludedLocales()` → **`isLocaleSitemapIncluded`** → **tier `full` only** (`language-readiness.ts`).

**Included (non-default, hosted):** `es`, `hi`, `pt`, `tl` (current registry snapshot).

**Excluded (examples):**

| Locale | Reason |
|--------|--------|
| `fr` | Tier **partial** — `sitemapIncluded: false` (noindex; omitted from sitemaps). |
| `ta`, `te`, `bn`, `mr`, `gu`, `zh`, `zh-tw`, `ar`, `ko`, `pa`, `vi`, `ht`, `ur`, `ja`, `fa`, `de`, `th`, `tr`, `id`, `it`, `hu`, `ru` | Tier **incomplete** — not eligible for sitemap inclusion until promoted to full. |

English default routes have no `/{locale}/` prefix and remain in **core**, not the localized urlset.

## Public clinical / learner modules intentionally excluded

No new segments for ECG, labs, CAT, flashcards, OSCE detail drills, NGN, scenarios, or `/app/*`. Existing **marketing** surfaces stay where they already were (e.g. OSCE scenario **hub** URLs remain in core via `collectOsceScenariosMarketingHubUrls` when flags allow). Learner-gated paths remain excluded via `filterPublicSitemapEntries` / `isValidPublicUrl`.

## Tests run

- `npm run typecheck:critical` — **pass**
- Targeted: `src/app/robots.txt/route.test.ts` + `src/lib/seo/sitemap-index.contract.test.ts`, `sitemap-merged-route.test.ts`, `sitemap-segment-dedupe.contract.test.ts`, `sitemap-phase2-segmentation.contract.test.ts`, `sitemap-public-index-filter.test.ts`, `sitemap-marketing-exclusions.test.ts`, `sitemap-locale-prefixed-path-guard.test.ts`, `sitemap-rn-pn-core-pathways.contract.test.ts`, `sitemap-allied.contract.test.ts`, `src/app/sitemap-new-grad.xml/sitemap-new-grad.contract.test.ts` — **pass**

Running the full glob `src/lib/seo/sitemap*.test.ts` also executes **`sitemap-build-safe-mode.test.ts`** and **`sitemap-build-skip.test.ts`**, which depend on build/env flags — **those two may fail outside Next build context** (environment coupling).

## Follow-up — Phase 3 recommendations

1. **Dedupe audit tooling:** optional CI script to fetch each child sitemap in staging/prod and assert disjoint `<loc>` sets (or accept documented overlaps only for allied/new-grad vs core).
2. **Volume telemetry:** log structured counts per segment at generation time for ops dashboards.
3. **Chunked urlsets:** if any single segment approaches ~50k URLs, split into numbered chunks + multiple `<sitemap>` entries in the index (per `sitemap-static-xml.ts` soft limits).
4. **Clinical marketing segments:** add separate urlsets only when public teaser routes and indexability rules are explicitly approved (per roadmap).

## Policy preserved

- **`robots.txt`:** still a single `Sitemap:` line to `/sitemap.xml` (index); unchanged in this phase.
- **hreflang:** not embedded in XML; page metadata unchanged.
