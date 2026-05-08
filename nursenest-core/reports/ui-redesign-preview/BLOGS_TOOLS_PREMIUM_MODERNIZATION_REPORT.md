# Blogs + Tools ecosystem — premium modernization report

**Date:** 2026-05-08
**Scope:** Visual / shell / loader polish for marketing blog and tools surfaces. **No** schema, route, slug, SEO pipeline, calculation, or analytics changes. Body copy in clinical articles is **not** rewritten in this slice.

This report extends prior slices (`BLOG_REDESIGN_SUMMARY.md`, `TOOLS_FAQ_REDESIGN_SUMMARY.md`, `PREMIUM_LOADING_SYSTEM.md`, `CAT_PREMIUM_MODERNIZATION_REPORT.md`) and consolidates the blog/tool ecosystem against the premium 2026 visual layer in `src/app/premium-redesign-2026.css`.

---

## 1. Surface audit

### Blog

| Surface | Route(s) | Classification | Notes |
|---------|----------|----------------|-------|
| Blog index | `/blog` | **Premium — token + layout** | `nn-premium-blog-index` ambient + spotlight, premium `BlogPostCard` grid |
| Blog index page > 1 | `/blog?page=N` | Premium — tokens | Pagination preserved |
| Blog tag archive | `/blog/tag/[tag]` | **Now premium-shell** | Adopted `nn-premium-blog-index` ambient + `nn-premium-blog-back-link` + premium hero typography |
| Blog category archive | `/blog/category/[category]` | **Now premium-shell** | Same treatment as tag, with eyebrow "Browse by category" |
| Pathophysiology hub spotlight | `/blog` (page 1) | Premium — tokens + layout | `nn-premium-blog-patho-spotlight` band, semantic info tint |
| Article (default) | `/blog/[slug]` | Premium — tokens + layout | `nn-premium-blog-article` topic-aware ambient (`info` / `warning`), prose `max-w-[65ch]`, On-this-page TOC, related reading band, EE-A-T attribution, FAQ JSON-LD when present |
| Article (pathway) | `/{locale}/{slug}/{examCode}/{exam}/blog/[postSlug]`, `/nursing/[careerSlug]/blog/[postSlug]`, `/allied-health/[slug]/blog/[postSlug]` | Inherits article shell | No diff this slice — they share `BlogPostCard` and shared shell components |
| Article (RN sub-index) | `/blog/rn`, `/blog/rn/[slug]` | Inherits | No diff this slice |

### Tools + FAQ

| Surface | Route(s) | Classification | Notes |
|---------|----------|----------------|-------|
| Tools hub (default) | `/tools` | Premium — tokens + layout | `nn-premium-tools-hub` + `nn-tools-marketing-hero` semantic icon tiles |
| Tools hub (locale) | `/[locale]/tools` | Premium — tokens + layout | Same client; locale-aware hrefs |
| Tool detail | `/tools/[slug]`, `/[locale]/tools/[slug]` | Premium — tokens + layout | `ToolsToolShell`, `nn-premium-tools-calculator-wrap` calculator surface, full SEO article body |
| Tool SEO article | inside tool detail | Premium — tokens | Semantic panel hues (cool / warm / positive / muted) — no clinical body rewrite |
| FAQ (default) | `/faq` | Premium — tokens | `FaqLegalMarketingView` now in `nn-premium-faq-card`; product screenshots strip below |
| FAQ (locale) | `/[locale]/faq` | Premium — tokens | Same shell + product screenshots parity |

---

## 2. Strategy: layout vs token-only

| Concern | Strategy |
|--------|----------|
| Blog index / tag / category | **Token + layout shell**. Reuse the existing `BlogPostCard` and `nn-premium-blog-index` ambient — surface decisions only |
| Blog article body | **Tokens only**. We do **not** touch the HTML produced by the publishing pipeline. Premium feel comes from the prose container (`max-w-[65ch]`, `nn-premium-blog-prose` line-height + scroll-margin) and the article-level ambient + topic data attribute |
| Tools hub / detail | **Token + layout**. Hub uses `nn-premium-tools-hub-card` w/ semantic icon accents (chart-2/3/4 + warning), detail uses `nn-premium-tools-calculator-wrap` lift |
| Tool calculators | **Tokens only**. Calculation, validation, form, and i18n logic are unchanged |
| FAQ | **Tokens + small layout polish**. Legal markdown body now sits inside `nn-premium-faq-card`; product screenshots section unchanged |
| Loaders | **Component reuse**. Wrapped existing skeletons in `BrandedPageLoader` (leaf identity); added missing `loading.tsx` segments for blog detail, blog category, tools (hub + detail), FAQ (default + locale) |

---

## 3. Files changed (this slice)

| File | Change |
|------|--------|
| `src/app/premium-redesign-2026.css` | `.nn-faq-marketing-root` adds second radial; new `.nn-premium-faq-card` lift + heading rhythm |
| `src/components/legal/faq-legal-marketing-view.tsx` | Legal markdown card adopts `nn-premium-faq-card` |
| `src/components/skeletons/hub-page-skeleton.tsx` | New exports: `ToolsHubPageSkeleton`, `ToolDetailPageSkeleton`, `FaqMarketingPageSkeleton` |
| `src/app/(marketing)/(default)/blog/loading.tsx` | Wraps `BlogIndexPageSkeleton` in `BrandedPageLoader` |
| `src/app/(marketing)/(default)/blog/tag/[tag]/loading.tsx` | Wraps tag skeleton in `BrandedPageLoader` |
| `src/app/(marketing)/(default)/blog/category/[category]/loading.tsx` (new) | Branded loader for category archive |
| `src/app/(marketing)/(default)/blog/[slug]/loading.tsx` (new) | Branded loader using `BlogPostPageSkeleton` |
| `src/app/(marketing)/(default)/tools/loading.tsx` (new) | Branded loader for tools hub |
| `src/app/(marketing)/(default)/tools/[slug]/loading.tsx` (new) | Branded loader for tool detail |
| `src/app/(marketing)/(default)/faq/loading.tsx` (new) | Branded loader for FAQ |
| `src/app/(marketing)/[locale]/faq/loading.tsx` (new) | Locale FAQ branded loader |
| `src/app/(marketing)/[locale]/tools/loading.tsx` (new) | Locale tools hub branded loader |
| `src/app/(marketing)/[locale]/tools/[slug]/loading.tsx` (new) | Locale tool detail branded loader |
| `src/app/(marketing)/(default)/blog/tag/[tag]/page.tsx` | Adopts `nn-premium-blog-index` ambient, premium hero typography, eyebrow "Browse by tag" |
| `src/app/(marketing)/(default)/blog/category/[category]/page.tsx` | Adopts `nn-premium-blog-index` ambient, premium hero typography, eyebrow "Browse by category" |

**Untouched (intentionally):** `src/lib/blog/safe-blog-queries.ts`, `src/lib/blog/blog-publishing-package.ts`, `src/lib/blog/blog-image-workflow.ts`, `src/lib/blog/blog-auto-link-html.ts`, `src/lib/seo/*`, `src/lib/tools/tool-registry.ts`, all calculator components in `src/components/tools/calculators/*`, `src/app/sitemap*.xml`, `src/app/robots.txt`.

---

## 4. Loading integration

Premium loaders use `BrandedPageLoader` (semantic gradient + deferred leaf strip) from `src/components/ui/premium-loader/`. Skeleton children mount immediately; the leaf + caption appears after ~320 ms so fast navigations do not flash brand chrome. All loaders inherit `prefers-reduced-motion` from the loader CSS module.

| Route | Loader composition |
|------|--------------------|
| `/blog` | `BrandedPageLoader -> BlogIndexPageSkeleton` |
| `/blog/tag/[tag]` | `BrandedPageLoader -> BlogIndexPageSkeleton` |
| `/blog/category/[category]` | `BrandedPageLoader -> BlogIndexPageSkeleton` (new file) |
| `/blog/[slug]` | `BrandedPageLoader -> BlogPostPageSkeleton` (new file) |
| `/tools`, `/[locale]/tools` | `BrandedPageLoader -> ToolsHubPageSkeleton` (new) |
| `/tools/[slug]`, `/[locale]/tools/[slug]` | `BrandedPageLoader -> ToolDetailPageSkeleton` (new) |
| `/faq`, `/[locale]/faq` | `BrandedPageLoader -> FaqMarketingPageSkeleton` (new) |

The existing branded leaf identity (`BrandedLeafMark`, `premium-loader.module.css`) is reused — no new icon assets, no Framer Motion, no Lottie. Bundle delta is purely CSS + the small wrapper.

---

## 5. Validation (this run)

| Check | Result |
|-------|--------|
| `npm run typecheck:critical` | **Pass** (149 s, no diagnostics) |
| `npm run test:homepage` | **Pass** — 13 passed, 1 skipped, 14 total |
| `npx playwright test -c playwright.release-gate.config.ts --list` | **Pass** — 19 tests across 9 specs listed cleanly |
| `npx playwright test --list tests/e2e/public/blog-marketing-redesign.spec.ts tests/e2e/public/blog-tag-article-routing.spec.ts tests/e2e/public/tools-faq-marketing.spec.ts` | **Pass** — 8 tests across 3 specs listed cleanly (chromium + webkit) |

**Public surface smokes that exercise this slice when a `BASE_URL` is available:**

- `tests/e2e/public/blog-marketing-redesign.spec.ts` — blog index + tag + category + article + mobile viewport
- `tests/e2e/public/blog-tag-article-routing.spec.ts` — tag -> article routing parity
- `tests/e2e/public/public-blog-caching.spec.ts` — blog cache headers (entitlement integrity)
- `tests/e2e/public/tools-faq-marketing.spec.ts` — `/tools`, `/tools/med-math`, `/faq`, console hygiene, links, mobile overflow
- `tests/e2e/public/branded-loader-smoke.spec.ts` — verifies no `[data-nn-premium-loader]` left mounted after settle

**Pending PW execution:** these specs require a running Next dev server or production `BASE_URL`. Listing succeeds; runtime evidence will be captured the next time `next dev` is up.

---

## 6. Visual references (exact paths)

### `reports/ui-redesign-preview/`

- `nursenest-core/reports/ui-redesign-preview/BLOGS_TOOLS_PREMIUM_MODERNIZATION_REPORT.md` (this file)
- `nursenest-core/reports/ui-redesign-preview/BLOG_REDESIGN_SUMMARY.md`
- `nursenest-core/reports/ui-redesign-preview/TOOLS_FAQ_REDESIGN_SUMMARY.md`
- `nursenest-core/reports/ui-redesign-preview/PREMIUM_LOADING_SYSTEM.md`
- `nursenest-core/reports/ui-redesign-preview/blog-detail-garden-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/blog-index-ocean-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/faq-page-garden-desktop.png`

### `preview-screenshots/`

- `nursenest-core/preview-screenshots/` — folder exists; **no new PNGs captured this run** (Next dev server not started in this session). Existing reference shots (`blog-index-ocean-desktop.png`, `blog-detail-garden-desktop.png`, `faq-page-garden-desktop.png`) remain accurate for visual baseline since edits in this slice are additive token + loader work.

### `docs/qa-reports/`

- *(No matching files in repo at time of report.)*

### `docs/verification-screenshots/`

- *(No matching files in repo at time of report.)*

To regenerate when `next dev` is available:

```
cd nursenest-core
npm run ui-preview:capture
# or, targeted Playwright trace on failure:
BASE_URL=http://localhost:3000 npx playwright test \
  tests/e2e/public/blog-marketing-redesign.spec.ts \
  tests/e2e/public/tools-faq-marketing.spec.ts
```

Recommended capture matrix (palettes already wired): `blog-index`, `blog-detail` (general + pathophysiology + pharmacology — `data-nn-blog-topic`), `tools-hub`, `tools-detail` (med-math), `faq` — desktop + `375` mobile + dark palette (`midnight` or `dark-clinical`).

---

## 7. Stub article surfacing (no rewrites)

**No clinical body rewrites were performed in this slice.** The repo already enforces stub / placeholder governance through `src/lib/blog/blog-quality-score.ts` and `src/lib/blog/blog-publish-quality-validator.ts`:

- Hard placeholder regexes flagged by governance (excerpt): `\blorem ipsum\b`, `\b\[insert\b`, `\btodo:\b`, `\bplaceholder\b`, `\bTBD\b`, `\{\{...\}\}`, `\bas an ai language model\b`, `\bcontent generation incomplete\b`.
- Composite publish floor: `BLOG_GOVERNANCE_MIN_PUBLISH_SCORE = 52`; repetition floor: `BLOG_GOVERNANCE_REPETITION_BLOCK_BELOW = 28`; minimum internal links: `3`; minimum H2s: `3`.
- The blog index renderer also surfaces `blog_index_below_marketing_minimum_article_rows` via `logPublicContentSurfaceFailure` when fewer than 8 page-1 articles render — a runtime signal for stub backlog.

**To enumerate stub posts at runtime** (read-only, requires DB access): run a `prisma.blogPost.findMany({ select: { slug, title, body, workflowStatus } })` filtered by the placeholder regex set above. The query is intentionally read-only and produces a flagged list without altering posts. Full remediation is outside this UI slice and should go through the existing publish governance + admin flow.

---

## 8. Legacy / follow-up

- **Path-specific blog hubs** (`/nursing/[careerSlug]/blog`, `/allied-health/[slug]/blog`, `/{locale}/{slug}/{examCode}/{exam}/blog`) inherit `BlogPostCard` and the article shell automatically — no extra work needed unless we add a per-pathway hero.
- **`/blog/rn` and `/blog/rn/[slug]`** could share the new ambient class for parity in a follow-up.
- **Calculator deeper polish** (`min-h` lift, sticky result panel on mobile) intentionally deferred to keep this slice tokens-only; no logic touched.
- **Locale legal pages** (`terms`, `privacy`, `refund-policy`) could opt into the new `nn-premium-faq-card` shell for visual continuity.

---

## 9. SEO + publishing integrity

| Channel | Status |
|--------|--------|
| Slugs / route generation | **Unchanged** — `parseInternalLinkPlanJson`, `resolvePublicCanonicalUrl`, `blogDisplayCrumbsFromSeo`, `blogPostSchemaItemsForPublic` untouched |
| `<head>` metadata + alternates | **Unchanged** — `safeGenerateMetadata` and `marketingAlternatesSharedPage` calls preserved |
| JSON-LD (`BlogPostingJsonLd`, `BlogFaqPageJsonLd`, `BreadcrumbJsonLd`, `FaqJsonLd`) | **Unchanged** — same emission paths |
| Sitemap / robots / canonical | **Unchanged** — no edits to `sitemap*.xml`, `robots.txt`, or canonical helpers |
| ISR `revalidate` windows | **Unchanged** (`/blog`: 180 s, `/blog/[slug]`: 3600 s, `/blog/tag|category/*`: 3600 s) |
| Cache headers / publishing pipeline | **Unchanged** — `getPublishedBlogPostsPage`, `getPublishedBlogPostBySlug`, `getPublishedBlogPostsByTagPage`, `getPublishedBlogPostsByCategoryPage` untouched; `withCrawlSurfacePageRender` wrapper preserved |
| Blog publishing governance | **Unchanged** — `blog-quality-score.ts`, `blog-publish-quality-validator.ts`, `blog-pre-publish-validation.ts` untouched |
| Tool registry / calculation logic | **Unchanged** — `isToolSlug`, calculator components, tracking events untouched |

---

## 10. Blockers

1. **Playwright runtime evidence** — listing succeeds; full `npx playwright test ...` runs require `BASE_URL` (a running `next dev` or deployed env). No change to spec coverage; runtime should be captured on the next environment that has the dev server up.
2. **Fresh PNG screenshots** — same dependency as above (`npm run ui-preview:capture`). Existing `preview-screenshots/` baselines remain valid since this slice is additive token + loader work.
3. **Stub post enumeration** — requires read-only DB connection; query above is provided. No body rewrites made.
