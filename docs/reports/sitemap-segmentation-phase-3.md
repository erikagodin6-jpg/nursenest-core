# Sitemap segmentation — Phase 3 report

**Date:** 2026-05-10  
**Scope:** Dedicated `/sitemap-clinical-modules.xml` for approved public clinical/marketing URLs; OSCE/clinical-scenario pathway hubs removed from core (single-owner segment).

## Files changed

| Area | Paths |
|------|--------|
| Collector | **New** `src/lib/seo/clinical-modules-sitemap-urls.ts` — `collectClinicalMarketingToolTeaserUrls`, `collectClinicalModulesSitemapUrls` |
| Core URLs | `src/lib/seo/sitemap-static-xml.ts` — removed `collectOsceScenariosMarketingHubUrls` from `collectCoreUrls` |
| Index + fallback | `src/lib/seo/sitemap-index-children.ts` — added `sitemap-clinical-modules.xml`; **new** `SITEMAP_FALLBACK_CLINICAL_MODULES_PATHS` |
| Route | **New** `src/app/sitemap-clinical-modules.xml/route.ts` |
| Docs in routes | `src/app/sitemap-core.xml/route.ts`, `src/app/sitemap.xml/route.ts` — comments |
| Tests | `sitemap-index.contract.test.ts`, `sitemap-merged-route.test.ts`, `sitemap-phase2-segmentation.contract.test.ts` (hreflang list), **new** `sitemap-phase3-segmentation.contract.test.ts` |

## Clinical module routes included

| Bucket | URLs | Notes |
|--------|------|--------|
| **Marketing tool teasers** | `/tools/med-math`, `/tools/lab-values`, `/tools/electrolyte-abg`, `/tools/iv-infusion`, `/tools/transfusion-safety` | From `TOOL_SLUGS` in `tool-registry.ts` — marketing `/tools/[slug]` shell (indexable via normal metadata pipeline). Represents **labs** + **med-calc** positioning without emitting gated `/app/labs` or `/app/med-calculations`. |
| **OSCE + clinical-scenarios hubs** | `{pathway}/osce`, `{pathway}/clinical-scenarios` per published nursing pathway | From existing `collectOsceScenariosMarketingHubUrls` — **only when env flags allow** (see below). |

With OSCE/clinical flags **off** (typical local dev), the collector emits **5** tool URLs only (`clinicalModulesUrlCount: 5` measured via `tsx` against canonical origin).

## Clinical module routes excluded (and why)

| Surface | Reason |
|---------|--------|
| **`/modules/ecg/*`, `/modules/lab-values/*`** | Entitlement/layout shells use `robots: { index: false }` and/or access gates — **not** treated as public index teasers for sitemap. |
| **`/app/labs`, `/app/med-calculations`, `/app/lab-drills`, CAT, flashcard sessions** | Learner/gated surfaces; fail {@link isValidPublicUrl} blocked prefixes or query-heavy marketing links — **never** listed here. |
| **Standalone NGN / “question format” marketing pages** | No dedicated indexable marketing route exists in-app beyond pathway question banks already covered elsewhere — **not invented** in this PR. |
| **ECG “marketing teaser” under `/modules/ecg`** | Same **noindex** policy as above; **ECG discovery** remains via `/tools/…` and pathway hubs as appropriate, not gated `/modules` shells. |

## Feature flags checked

| Flag | Effect |
|------|--------|
| `NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS === "true"` | Emits `…/osce` hub URLs per pathway (`isOsceScenariosPubliclyEnabled`). |
| `NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS === "true"` | Emits `…/clinical-scenarios` hub URLs (`isClinicalScenariosPubliclyEnabled`). |

Source: `src/lib/scenarios/scenario-marketing-sitemap-urls.ts` (reused unchanged).

## URL counts per segment (reference)

| Segment | Count notes |
|---------|-------------|
| **`/sitemap-clinical-modules.xml`** | **5** tool URLs + **0–2×N** pathway hub URLs when flags on (N = published non-allied pathways). |
| **`/sitemap-core.xml`** | OSCE/scenario URLs **removed** — no duplicate `<loc>` with clinical segment for those hubs. |
| Other segments | Unchanged from Phase 2 partitioning (pathways, lessons, localized, blog, allied, new-grad). |

## Tests run

- `npm run typecheck:critical` — **pass**
- `node --import tsx --test src/app/robots.txt/route.test.ts` + `src/lib/seo/sitemap*.test.ts` — **46 pass / 2 fail** (`sitemap-build-safe-mode.test.ts`, `sitemap-build-skip.test.ts` — env/build coupling; same as Phase 2 note)

Targeted Phase 2 + Phase 3 contract suite (index, merged-route, phase2/phase3 segmentation) — **pass**

## Policy preserved

- **`robots.txt`:** still single `Sitemap:` line to `/sitemap.xml` only.
- **Canonical / hreflang:** no changes to page metadata or alternate logic.

## Follow-up recommendations

1. When a dedicated **indexable** public NGN / question-format landing exists, add its path to `clinical-modules-sitemap-urls.ts` (or a small registry) with product approval.
2. Optional CI: env-matrix job that enables OSCE flags and asserts non-empty OSCE `<loc>` samples in staging.
3. If `/tools/{slug}` overlap with a future “tools-only” sitemap segment, dedupe by single-owner rule.

