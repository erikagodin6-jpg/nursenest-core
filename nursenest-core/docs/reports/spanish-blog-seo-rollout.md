# Spanish-first marketing blog SEO rollout

Generated: 2026-05-11

## Summary

Shipped a **Spanish-first** phase for the guarded multilingual marketing blog overlay: real server-rendered pages at `/{locale}/blog/{slug}` (e.g. `/es/blog/cambios-ecg-hiperpotasemia`), **≥1000-word indexability for `locale=es`**, two **published + quality-reviewed** long-form articles with Spanish-only metadata and FAQ/schema, **seven additional Spanish clusters** registered as **draft** (non-indexable) with distinct English `tl-intl-*` hub slugs, and contract tests aligned with `sitemap-es-blog.xml`.

English URLs under `/blog/{slug}` are unchanged; Spanish indexing still requires the English hub to be marketing-visible (`isBlogPostMetaVisible`).

## Architecture

| Layer | Behavior |
| --- | --- |
| **Routes** | `(marketing)/[locale]/blog/[slug]/page.tsx` — public segment is the localized SEO slug. |
| **Registry** | `src/lib/blog/multilingual-blog-seo-registry.ts`; one row per `(locale, sourceEnglishSlug)`. |
| **Gates** | `evaluateMultilingualBlogIndexability`: `published` + `qualityReviewed` + fields complete + **`multilingualBlogIndexMinWordsForLocale`** (`es` → 1000, others → 800) + locale readiness + visible English source. |
| **Hreflang** | `buildMultilingualBlogHreflangLanguages`: indexable rows emit `es`, `en`, `x-default` when English hub visible. |
| **Sitemap** | `buildMultilingualBlogSitemapXmlForLocale("es")` → `sitemap-es-blog.xml`. |
| **Internal links** | `rewriteBlogHtmlAnchorsForLocale` prefers `/es/blog/...` when a gated overlay exists. |

## Publishing gates

Spanish URLs are indexable only when: `published` ∧ `qualityReviewed` ∧ Spanish slug ∧ full localized metadata ∧ word count ≥ **1000** ∧ locale SEO-eligible ∧ English source visible. Otherwise **noindex** and excluded from the Spanish blog sitemap.

## Implemented clusters

### Published

| Spanish slug | English hub | Notes |
| --- | --- | --- |
| `cambios-ecg-hiperpotasemia` | `tl-intl-electrolyte-k-safety-intl-topic-114` | ~1130 words; FAQ + schema keywords ES |
| `interpretacion-gases-arteriales` | `tl-intl-acid-base-arterial-blood-gas-intl-topic-119` | ~1154 words; replaces older draft slug `interpretacion-gasometria-arterial` |

Bodies: `src/lib/blog/multilingual-blog-seo-spanish-published-bodies.ts`.

### Draft (registry only)

New draft rows: insulin/hypoglycemia (115), respiratory failure / alarms (118), DKA / dosing frame (129), CLABSI / precautions (125), NGN ABC (116), sepsis prioritization (113), AKI lab (120), ACS first hour (117). Plus existing ES drafts (EPOC, juicio del examen, etc.).

## Counts (locale `es`, registry)

- **Published:** 2  
- **Not published (draft/review):** 11  

## Sitemap / hreflang

- Validation run: `sitemap-es-blog.xml` **2** URLs.  
- Hreflang for published pages: `es`, `en`, `x-default` when the English long-tail hub is visible.

## Verification

| Command | Result |
| --- | --- |
| `npm run typecheck:critical` | Pass |
| `npm run sitemap:validate` | Pass |
| `npm run test:homepage` | Pass |
| `npm run test:seo-sitemap` | Pass |

## Risks

- Indexing depends on **English** `tl-intl-*` visibility.  
- **One registry row per English source per locale** — plan merged topics on one hub or use distinct `sourceEnglishSlug` values.  
- Expand draft clusters to ≥1000 words and `qualityReviewed` before publishing.

## Next steps

1. Editorial pass on draft clusters; publish one cluster at a time.  
2. Optional `/es/blog` hub route for Spanish-first navigation (breadcrumb currently links to `/blog`).  
