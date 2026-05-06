# SEO surface validation audit — NurseNest

**Scope:** Marketing App Router surfaces (canonical, hreflang, sitemaps, robots, metadata, JSON-LD, i18n leakage guards), pathway lessons/blogs indexing posture, learner `/app` (robots-level only). **Audit only** — no canonical or sitemap rewrites applied.

**Primary sources:** `src/lib/seo/*`, `src/app/robots.txt/route.ts`, `src/app/sitemap.xml/route.ts`, `safe-marketing-metadata.ts`, `marketing-alternates.ts`, `exam-pathway-hub-alternates.ts`, pathway lesson pages, blog post marketing route, `marketing-i18n-provider.tsx`, `breadcrumb-i18n.ts`, `np-seo-alias-canonical-policy.ts`.

---

## 1. Executive map (SEO risk areas)

| Area | Mechanism | Risk level | Notes |
|------|------------|------------|-------|
| **Canonical origin** | `NEXT_PUBLIC_APP_URL` → `resolveCanonicalSiteOrigin` / `MARKETING_SITE_ORIGIN` / `metadataBase` | **High** if env wrong at **build** (client `NEXT_PUBLIC_*`) | Align with GSC property |
| **Exam pathway hubs** | `alternates.canonical` + `examPathwayRegionalHreflang` on overview; NP alias policy for subpages | **Medium** | Policy doc: `np-seo-alias-canonical-policy.ts` |
| **Pathway lessons hub & detail** | Canonical on built path; hub `noindex` when internal `q` search | **Medium** | Many URLs omit `alternates.languages` (see hreflang report) |
| **Programmatic / shared localized marketing** | `marketingAlternatesSharedPage` + `marketingHreflangLanguagesForEnPath` | **Low–Medium** | Expansion vs default-only hubs handled in code |
| **Sitemaps** | `/sitemap.xml` (+ allied, new-grad); merge + dedupe; DB fallback | **Medium** on DB outage (minimal urlset) | Never 503 |
| **robots.txt** | Static body; `Disallow` incomplete locales; `/seo/` internal | **Low** | Assertions on sitemap lines |
| **Metadata failures** | `safeGenerateMetadata` → HTTP validate alternates → **generic fallback** | **High** when validation fails | Duplicate weak titles |
| **i18n leakage** | Dev warnings; `humanizedMarketingKeyFallback`; strict throws for programmatic registry | **Medium** in prod if catalog gaps | Blog force-index set |
| **Structured data** | `BreadcrumbJsonLd`, `WebPageJsonLd`, `PathwayLessonMedicalEducationJsonLd` | **Medium** | Must stay aligned with visible crumbs + canonical policy |

---

## 2. Route-class summary

| Route class | Canonical | hreflang | robots | JSON-LD | Indexing readiness |
|-------------|-----------|----------|--------|---------|-------------------|
| `/`, `/pricing`, localized shells | Shared helpers | Full cluster where supported | Tier-based via `safeGenerateMetadata` | Varies | Good |
| `/(marketing)/(default)/[locale]/[slug]/[examCode]` (hub) | NP SEO vs core pathway | Regional record | index,follow | Hub sections | Good |
| `…/lessons` (hub) | Query-aware canonical | **Often absent** | noindex when `q` | — | Good with params |
| `…/lessons/[lessonSlug]` | `absoluteUrl` public path | **Absent** | index when `publicComplete` | Medical lesson schema | **Good** if `publicComplete` |
| `(marketing)/[locale]/…/blog/...` | DB-driven | Variant map | Force index for blog groups | — | Strong |
| `/app/*` | N/A (private study) | N/A | **Disallow** in robots | N/A | Intentionally non-indexed |

---

## 3. Cross-cutting issues (issue table)

| # | Route / system | SEO risk | Likely cause | Tag | Recommended fix |
|---|----------------|----------|--------------|-----|-----------------|
| 1 | Any marketing route using `safeGenerateMetadata` | **Duplicate / weak titles** in SERPs if alternates HTTP validation fails | `validateMetadataAlternatesHttp` failure swaps `FALLBACK_SITE_METADATA` | **DEV_ONLY** | Monitor crawl-surface logs; tighten causes of 4xx on canonical URLs |
| 2 | `NEXT_PUBLIC_APP_URL` ≠ production host | Split signals (GSC, OG, sitemap `loc`) | Mis-set build/runtime env | **DEV_ONLY** | Single runbook: one canonical host; verify on deploy |
| 3 | Pathway lesson / lessons hub | **hreflang gap** vs multilingual blog/programmatic | Country-segment URLs (`us`/`canada`) are not BCP-47 marketing locales | **SAFE_FOR_AI** | Document intentional model; only add hreflang where alternate URLs exist |
| 4 | `q` on lessons hub | Thin / infinite search URLs | Intentional `noindex,follow` | **SAFE_FOR_AI** | Keep; audit internal links that append `q=` |
| 5 | Allied lessons hub canonical | Consolidation to global hub URL | `buildAlliedGlobalHubPath` policy | **SAFE_FOR_AI** | Ensure internal links and GSC annotations match |
| 6 | Programmatic registry | **Build failure** if empty title/desc | `buildProgrammaticMetadata` throws | **DEV_ONLY** | CI on registry |
| 7 | Marketing i18n | Raw keys in HTML | Missing shard / wrong locale tier | **DEV_ONLY** | `i18n:validate` + catalog coverage; prod relies on fallbacks |

---

## 4. Related automated checks

- `src/lib/seo/seo-http-emit-validation.ts` — optional HTTP probe of canonical + hreflang URLs.  
- `src/lib/seo/localized-seo-readiness.test.ts` — policy tests for localized pages.  
- Existing report: `reports/localized-seo-audit.md` (inventory/history in repo).

---

## 5. Acceptance

SEO **risk areas** (canonical origin drift, NP alias tree, pathway lesson vs hub metadata, hreflang scope, sitemap fallback, robots locale rules, metadata fallback, i18n leakage surfaces, structured-data alignment) are **mapped** in this file and the three companion audits.
