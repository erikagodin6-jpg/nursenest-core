# Multilingual blog SEO implementation

## Architecture summary

### Existing English blog (unchanged)

- Public URLs remain **`/blog/{slug}`** via `(marketing)/(default)/blog/[slug]/page.tsx`.
- Sources merge **Postgres + bundled static corpus + long-tail MD** through `@/lib/blog/safe-blog-queries` (`getPublishedBlogPostBySlug`, `getMergedBlogSitemapSlugRows`, etc.).
- Sitemap slice **`/sitemap-blog.xml`** lists English `/blog` URLs only.

### Pathway localized blog (unchanged)

- Separate product surface: **`/:locale/:region/:profession/:exam/blog/:postSlug`** with Prisma-backed `safe-localized-blog-queries` and `blog-seo-localized.ts`.
- Segment parameter overload differs from flat **`/{locale}/blog/...`**.

### New guarded marketing-locale blog overlay

- **Code-first registry** in `src/lib/blog/multilingual-blog-seo-registry.ts` keyed by `(locale, localizedSlug)` with **`sourceEnglishSlug`** for the English `/blog/{slug}` hub.
- Public URLs: **`/{fr|es}/blog/{nativeSlug}`** via `(marketing)/[locale]/blog/[localizedSlug]/page.tsx`.
- **No client-side translation** for SEO — titles, meta, body, FAQ, and schema come from registry entries.
- **Fail-closed indexing**: **`published` + `qualityReviewed` + locale tier + word-count floor + English source visible** (`evaluateMultilingualBlogIndexability`).
- **French (`fr`)** tier **partial** → `language-readiness` keeps **`noindex`** and blocks tier-full sitemap inclusion until promotion to **full**.
- **Spanish (`es`)** tier **full** → can index when gates pass; seeds remain draft/review.

## Indexing rules

| Gate | Effect |
|------|--------|
| `status !== published` | `noindex`, not in sitemap |
| `qualityReviewed === false` | `noindex`, not in sitemap |
| Missing localized slug / title / meta / H1 / body | `noindex` |
| Word count below **800** (`MULTILINGUAL_BLOG_INDEX_MIN_WORDS`) | `noindex` |
| Locale not SEO-indexable | `noindex` |
| Locale not sitemap-included | omitted from localized blog sitemap |
| English source not visible | `noindex`, cluster omits English alternate |

## Sitemap / hreflang

- **`/sitemap-fr-blog.xml`** / **`/sitemap-es-blog.xml`** — only passing URLs after async English checks.
- Empty lists emit minimal urlset (shared helper behavior).
- **`/sitemap.xml`** references both via `SITEMAP_INDEX_CHILD_FILENAMES`.
- **Hreflang** — self always; peers + `en` only when indexable; `x-default` prefers English canonical when visible.

## Seed status

| Locale | Rows | Notes |
|--------|------|-------|
| `fr` | 6 | All **draft** |
| `es` | 6 | Draft/review scaffolding |

Includes native SEO demo slugs **`modifications-ecg-hyperkaliemie`** / **`cambios-ecg-hiperpotasemia`** mapped to electrolyte long-tail English source.

## Files touched

- `src/lib/blog/multilingual-blog-seo-types.ts`
- `src/lib/blog/multilingual-blog-seo-constants.ts`
- `src/lib/blog/multilingual-blog-seo-registry.ts`
- `src/lib/blog/multilingual-blog-seo-gates.ts`
- `src/lib/blog/multilingual-blog-seo-resolve.ts`
- `src/lib/blog/multilingual-blog-seo-hreflang.ts`
- `src/lib/blog/multilingual-blog-seo-links.ts`
- `src/app/(marketing)/[locale]/blog/[localizedSlug]/page.tsx`
- `src/components/seo/seo-json-ld.tsx`
- `src/lib/seo/sitemap-multilingual-blog-xml.ts`
- `src/app/sitemap-fr-blog.xml/route.ts`
- `src/app/sitemap-es-blog.xml/route.ts`
- `src/lib/seo/sitemap-index-children.ts`
- `src/lib/seo/sitemap-segment-validator.ts`
- `src/lib/blog/multilingual-blog-seo.contract.test.ts`
- `package.json` (`test:seo-sitemap`)

## Commands run

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | Pass |
| `npm run sitemap:validate` | Pass |
| `npm run test:homepage` | Pass |
| `npm run test:seo-sitemap` | Pass |

## Risks / next steps

1. Migrate registry to **DB/CMS** when volume grows; keep gate helpers as single source of truth.
2. Promote **`fr`** to **full** before expecting FR SERP exposure.
3. Optional **`/[locale]/blog`** hub page — back link currently targets **`/blog`**.
