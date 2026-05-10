# Sitemap information architecture — full audit

**Workspace:** `/root/nursenest-core` (Next.js app: `nursenest-core/`).  
**Date:** 2026-05-09.  
**Truthpack:** `.vibecheck/truthpack/` (`routes.json`, `ui-pages.json`, `copy.json`) — **not present** in this clone; route inventory is grounded in `nursenest-core/src/app/**`, `nursenest-core/src/lib/seo/**`, and existing contract tests (no invented URLs).

---

## A1 — Sitemap generation locations

| Artifact | Path | Role |
|----------|------|------|
| Merged marketing + blog + pathway-derived URLs | `nursenest-core/src/app/sitemap.xml/route.ts` | `GET` → `collectCoreUrls` + `listBlogSitemapEntriesSafe` → `filterPublicSitemapEntries` → XML urlset |
| Allied-focused urlset | `nursenest-core/src/app/sitemap-allied.xml/route.ts` | `collectAlliedMarketingUrls` only |
| New Grad–focused urlset | `nursenest-core/src/app/sitemap-new-grad.xml/route.ts` | `collectNewGradMarketingUrls` only |
| URL collectors / caps | `nursenest-core/src/lib/seo/sitemap-static-xml.ts` | Core static + async pathway lessons, exam hubs, programmatic study SEO, content-backed study hubs, OSCE/clinical scenario hubs, locales, tools index, etc. |
| Blog slice | `nursenest-core/src/lib/seo/sitemap-blog-xml.ts` | Merged into main sitemap only |
| Public index filter | `nursenest-core/src/lib/seo/sitemap-public-index-filter.ts` | Dedupe + `isEligiblePublicIndexSitemapLoc` + `isValidPublicUrl` |
| Auth noindex paths | `nursenest-core/src/lib/seo/sitemap-marketing-exclusions.ts` | Drops `/login`, `/signup`, … from sitemap |
| Build skip / safe mode | `nursenest-core/src/lib/seo/sitemap-build-skip.ts`, `shouldReduceNonCriticalBuildWork` in `sitemap-static-xml` | DB pathway URLs skipped in some builds |
| Robots + sitemap discovery | `nursenest-core/src/app/robots.txt/route.ts` | Three `Sitemap:` lines (not a sitemap *index* document) |
| Crawler bypass (no auth) | `nursenest-core/src/proxy.ts` — `isPublicProbeOrCrawlerBypassPath` | `/sitemap.xml`, `/sitemap-allied.xml`, `/sitemap-new-grad.xml`, `/robots.txt` |
| Revalidation hooks | `blog-revalidate-publishing.ts`, `self-heal-actions.ts`, `reliability-probes.contract.test.ts` | `revalidatePath` for all three sitemap routes |

**Not used:** `next-sitemap` package pattern not observed; no `sitemap.ts` (App Router metadata sitemap) — generation is **route handlers** returning XML.

**`generateStaticParams`:** Not audited file-by-file; pathway/marketing pages use mixed SSG/ISR/dynamic patterns. Sitemap routes use `force-dynamic`.

**Marketing vs `/app` boundary:** `isValidPublicUrl` in `public-url-validator.ts` blocks `/app`, `/admin`, `/api`, `/seo/`, etc. Learner shell URLs cannot pass the filter.

---

## A2 — Indexable vs noindex patterns

| Mechanism | Where | Behavior |
|-----------|-------|----------|
| **Robots.txt** | `robots.txt/route.ts` | `Disallow: /app/`, `/admin/`, `/internal/`, `/api/`, `/seo/`; per-locale `Disallow: /{code}/` for *incomplete* marketing tiers |
| **Static URL rules** | `public-url-validator.ts` | Same prefixes blocked for sitemaps, hreflang filtering |
| **Locale tier** | `language-readiness.ts` | `full` → sitemap + hreflang + indexable; `partial` → no sitemap, `noindex` via metadata; `incomplete` → disallow + noindex |
| **safeGenerateMetadata** | `safe-marketing-metadata.ts` | Locale robots override; blog route groups can force index |
| **Learner** | `(student)/app/layout.tsx`, `(student)/layout.tsx` | `robots: { index: false, follow: false }` |
| **Flashcards** | `(student)/app/(learner)/flashcards/layout.tsx` | noindex |
| **ECG / lab modules** | `modules/ecg/layout.tsx`, `modules/lab-values/layout.tsx` | `index: false` |
| **Preview** | `(preview)/preview/layout.tsx` | noindex,nofollow |

---

## A3 — Surface inventory (abbrev.)

- **In merged sitemap:** marketing core, tier-full locale mirrors, exam hubs, pathway lessons/topics/details (capped), blog, programmatic study SEO, content-backed study hubs, OSCE/clinical hubs (flags), pre-nursing, tools index, questions topics, expansion regional URLs when published.
- **Allied / New Grad:** dedicated urlsets plus discovery in `robots.txt`.
- **Never in sitemap:** `/app/*`, `/modules/ecg`, `/modules/lab-values`, auth noindex paths, `/seo/` URLs.

---

## A4 — Policy table (ECG, labs, scenarios, CAT, flashcards, practice)

| Surface | Public sitemap? | Indexing |
|---------|-----------------|----------|
| ECG / lab module routes | No | noindex; server notFound unless preview |
| OSCE / clinical scenario marketing hubs | Yes (if flags) | indexable marketing |
| CAT, flashcards, practice tests (learner) | No | noindex under `/app` |
| Marketing `/practice-exams` | Yes | public |

---

## A5 — hreflang / canonical

- `marketing-alternates.ts`: exam hubs minimal `x-default` + `en-CA`; expansion/locale rules; `filterPublicHreflangRecord`.
- Sitemap strips invalid `/{locale}/us/...` pathway topic prefixes (`stripForbiddenLocalePrefixedPathwayTopics`).
- Residual risk: partial-tier locales vs hreflang clusters — monitor in GSC.

---

## A6 — Volume

- `MAX_PATHWAY_DERIVED_SITEMAP_URLS = 48_000`; soft warn 45k; pathway time budget `SITEMAP_PATHWAY_BUDGET_MS`.

---

## A7 — New Grad fallback

`sitemap-new-grad.xml` fallback uses `/new-grad` but live pages are `/us/new-grad` and `/canada/new-grad` — potential rare 404 in urlset if fallback triggers.

---

## Code references

`nursenest-core/src/app/sitemap.xml/route.ts`, `sitemap-static-xml.ts`, `public-url-validator.ts`, `sitemap-public-index-filter.ts`, `language-readiness.ts`, `marketing-alternates.ts`, `robots.txt/route.ts`.

## A3 expanded — representative surfaces

| Surface | In sitemap today | Should be | Gated |
|---------|------------------|-----------|-------|
| Home, pricing, about, FAQ, legal, contact | Yes | Yes | Public |
| `/blog`, posts | Yes | Yes | `blog-visibility` filters |
| Exam hubs `/{country}/{role}/{exam}` + pricing + questions | Yes | Yes | Public |
| Pathway lesson index, topics, lesson detail (marketing) | Yes (DB, capped) | Yes if indexable | Not `/app` |
| Programmatic `/{slug}` | Partial (registry + questions + case-studies in core) | Align with live routes | `/seo/` disallowed in robots |
| Regional expansion paths | When published | Yes | |
| Content-backed study hubs | Yes (DB, capped) | Yes | Gates in loader |
| Programmatic study `…/study/{slug}` | When eligible | Yes | |
| OSCE / clinical scenario hubs | When flags on | Yes | Public marketing |
| Allied hubs | Yes + dedicated sitemap | Yes | |
| New Grad `/us/new-grad`, `/canada/new-grad`, work areas | Dedicated sitemap | Yes | |
| Locale marketing `/fr/...` | Tier=full only | Yes | Partial omitted |
| Pre-nursing hub + modules | Yes | Yes | Localized overlays in `collectLocaleMarketingUrls` |
| `/tools`, `/tools/{slug}` | In core | Optional split if growth | Public |
| `/questions/{topic}` | Yes | Yes | |
| `/app/*` | **No** | **No** | Auth |
| `/modules/ecg`, lab-values | **No** | **No** | noindex + notFound |
| `/login` etc. | Filtered (except productionSafeStatic) | No | noindex |

## Internal linking (blog ↔ lesson)

Sitemap provides **URL co-listing** only; HTML internal links are out of scope for this audit. Recommendation: preserve topic adjacency (lessons + programmatic study + blog tags) in **on-page** nav without exposing `/app`.
