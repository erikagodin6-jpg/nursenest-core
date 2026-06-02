# Proposed multi-sitemap architecture (PART 2)

## Current state (existing project pattern)

- **Three** dynamic route handlers return **urlset** XML (not sitemapindex):
  - `/sitemap.xml` — merged core + blog + pathway-derived + …
  - `/sitemap-allied.xml`
  - `/sitemap-new-grad.xml`
- `robots.txt` lists all three absolute HTTPS URLs on `CANONICAL_PRODUCTION_ORIGIN`.
- Collectors live in `src/lib/seo/sitemap-static-xml.ts` with documented **50k** spec limit and **48k** pathway cap.

This is already a **light segmentation** for topical/crawl buckets (allied, new grad) while keeping the heavy merge in the primary file.

## Proposed evolution (optional, when volume or ops demand)

### Option A — Sitemap **index** + child urlsets (recommended at scale)

1. Add **`/sitemap-index.xml`** (or `/sitemap_index.xml` — pick one slug; Google accepts both conventions; align with existing kebab style: **`/sitemap-index.xml`**) as `sitemapindex` listing:
   - `sitemap-core.xml` — static marketing + locales + exam hubs + tools + regional + programmatic hubs **without** pathway lesson slug fan-out (or with reduced cap).
   - `sitemap-pathway-lessons.xml` — `collectPathwayLessonSeoUrls` output only.
   - `sitemap-blog.xml` — blog index + posts (`listBlogSitemapEntriesSafe`).
   - `sitemap-programmatic.xml` — pathway topic long-tail + programmatic study SEO + content-backed hubs (all DB-heavy segments).
   - Keep **`sitemap-allied.xml`** and **`sitemap-new-grad.xml`** as today (stable URLs already in Search Console).

2. Update **`robots.txt`** first line of discovery to `Sitemap: …/sitemap-index.xml` **and** optionally keep direct child links for transition (Google supports multiple Sitemap directives).

3. **`proxy.ts`** `isPublicProbeOrCrawlerBypassPath` must include every new pathname.

4. **`revalidatePath`** lists in blog/self-heal must include new routes.

### Option B — Next.js nested `sitemap.ts` (App Router)

- Feasible if migrating from manual XML builders to framework-generated sitemaps; **high refactor risk** vs current `buildSitemapUrlsetFromAbsoluteUrls` + ETag pattern.
- Not recommended as first step: would duplicate filtering logic unless wrapped carefully.

## URL limits

- **50,000** URLs per urlset (sitemap.org protocol).
- **50MB** uncompressed per file (practical limit).
- Keep **`lastmod`** only where cheap and truthful (blog already carries lastmod).
- **Do not** rely on `priority` / `changefreq` for ranking; if added, use **flat policy** (e.g. only `lastmod` for blog + lesson detail) to avoid noise.

## Priority / changefreq policy

- **Default:** omit both (current pattern).
- If product requires: `changefreq` weekly for blog index only; omit elsewhere.

## PART 3–4 — Topical clustering narrative (honest IA)

Segmentation **does not** guarantee Google-side “topic authority” features; it helps **crawl budgeting**, **operational isolation** (DB-heavy pathway generation vs static marketing), and **human clarity** in Search Console.

- **RN / PN / NP / expansion:** Already grouped by URL shape (`/us/rn/...`, programmatic long-tail on default shell). A dedicated `sitemap-pathway-lessons.xml` reinforces “clinical curriculum” as one discoverable bucket for engineers and optionally for crawlers.
- **Allied / New Grad:** Separate urlsets already signal **occupation** and **career-stage** IA without mixing into a single giant file.
- **Blog ↔ lesson:** Co-listing in an index’s children (blog urlset + pathway urlset) signals parallel **content** and **curriculum** surfaces; cross-signals still depend on **on-page** links and quality.

