# Blog hub + article — premium convergence (Figma-first brief)

**Status:** Specification for **design before code**. Do **not** ship a generic marketing blog grid or WordPress-style article template.

**Scope:** Marketing blog surfaces only:

- Hub: `nursenest-core/src/app/(marketing)/(default)/blog/page.tsx`
- Tag/category archives: `.../blog/tag/[tag]/page.tsx`, `.../blog/category/[category]/page.tsx`
- RN hub variant: `.../blog/rn/page.tsx`
- Career-scoped hub: `.../nursing/[careerSlug]/blog/page.tsx`
- Article: `.../blog/[slug]/page.tsx`

**Out of scope:** Admin publishing UI (`/admin/blog`), Prisma/blog pipeline logic changes unless explicitly approved.

---

## Mandatory workflow

| Step | Deliverable |
|------|----------------|
| 1 | Figma: Ocean canonical layout → duplicate Blossom/Midnight (**tokens only** — identical grids/breakpoints) |
| 2 | Exports: **Desktop** Ocean/Blossom/Midnight + **Mobile** Ocean (add mobile Blossom/Midnight if time) |
| 3 | **Post mockup PNGs in chat** → approval |
| 4 | Implementation: components + CSS; preserve SEO schemas, routes, i18n |
| 5 | **Live** screenshots: hub + article × themes; before/after summary |

---

## Part 1 — Current architecture (do not break)

### SEO & structured data (article)

- `BlogPostingJsonLd` — keep required props and URL stability.
- Optional `BlogFaqPageJsonLd` when FAQ items exist.
- `BreadcrumbBar` + `schemaItems` from `blogDisplayCrumbsFromSeo` / `blogIndexBreadcrumbs`.
- Canonical URLs via `safeGenerateMetadata` + `absoluteUrl` patterns.
- **No** JSON-LD duplication or raw JSON in visible HTML (fix leaks in implementation if found—separate QA pass).

### Data & publishing

- List: `getPublishedBlogPostsPage`, `BLOG_LIST_PAGE_SIZE`, ISR `revalidate = 180` on hub.
- Pathophysiology spotlight: `getPathophysiologyBlogHubPosts` (page 1 only) — design may **extend** with more “collection” sections using same list/query patterns.
- Article body: `publicBlogPostHtml` / `blog-public-article-html` — **prose** container; custom shortcodes/callouts may need **CSS** + allowed HTML classes, not ad-hoc new HTML in DB without pipeline review.

### Ecosystem integration (already in code — elevate in UI)

- **Bottom distribution:** `BlogPostDistributionFooter` — related lessons (validated paths), practice hubs, CAT/adaptive links, flashcards, tools (`relatedTools`).
- **Related reading:** `BlogRelatedReadingSection`.
- **Cross-links:** `MarketingStudyCrossLinks` on hub index.

Figma should **design premium shells** around these behaviors—not assume net-new APIs for every rail card.

---

## Part 2 — Blog hub (design intent)

### A. Premium hero

**Today:** Editable H1 + lead (`inline.marketing.blog.index.*`), breadcrumbs, optional `RegionalBlogDiscoveryHint`.

**Design:** Educational library headline (examples align with `blog-index-hero-copy.ts` / `DEFAULT_MARKETING_BLOG_INDEX` — finalize copy via inline/i18n, not hardcoded in components).

Include:

- **Search** — today client filters **only hydrated page posts** (`BlogMarketingPostListClient`). Premium UX may add **server-driven** search later; Figma can show search bar + “browse tags” as primary discovery.
- **Topic pills** — extend beyond current three (`TOPIC_LINKS` in client component); map each pill to a **real** `/blog/tag/...` or `/blog/category/...` slug that exists or will be curated.
- **Trust** — reviewer/medical edit signals belong at **article** level; hub can show “Medically reviewed library” subcopy if approved (copy key).

### B. Content organization

**Primary groupings** (user list): Pathophysiology, Pharmacology, ECG, Labs, NCLEX Strategies, REx-PN Strategies, Clinical Skills, Critical Care, Pediatrics, Mental Health, Maternity, Med-Surg, Prioritization, NGN, Case Studies.

**Implementation reality:** Discovery is tag/category-driven. Designer must align each grouping to:

- A **tag URL** (`/blog/tag/{encodedTag}`), or
- A **category URL** (`/blog/category/{slug}`), or
- A dedicated hub section fed by **query** (engineering adds parallel to pathophysiology spotlight).

Featured rails (“Most studied”, “New this week”, “High-yield”, “Trending RN/RPN/NP”) require **rules**:

- **New this week** — feasible via `createdAt` window on published posts.
- **Trending / Most studied** — need analytics or proxy (e.g. editorial picks)—flag as **phase 2** or “editorial curated list” in CMS.

Figma should label which rails are **MVP (date/editorial)** vs **future (analytics)**.

### C. Card system

**Component:** `BlogPostCard` + `BlogTopicBadge` + `resolveBlogTopicPresentation` (`blog-post-category-visual.ts`).

**Extend visually:** Reading time (needs **derived field** or client estimate), difficulty/high-yield badges (metadata or tags—product rule), pathway chips (from `post.exam` or tags—confirm mapping).

**Avoid:** Flat monochrome grids; use **semantic** panel tints (`semantic-chart-*`, `semantic-panel-*`) per category family—aligned with `semantic-color-guardrails.mdc` (see repo `.cursor/rules/`).

### D. Filtering + search

**Desktop:** Sticky sub-nav or filter bar; **pathway** toggles (US/CA + RN/RPN/NP) must align with `RegionalBlogDiscoveryHint` and pathway blog routes—no orphan URLs.

**Mobile:** Drawer for filters + chips; preserve **no duplicate content** for SEO (single canonical list URL with query params vs client-only filters—engineering decision after mockups).

---

## Part 3 — Individual article (design intent)

### A. Hero

**Today:** Breadcrumb, back link, topic badge, optional exam line, H1, published date, optional last reviewed, optional cover, `EeatContentAttribution`.

**Upgrade:** Premium title stack, **published vs updated** dates, reading time, high-yield/difficulty markers, optional hero illustration region (asset when `coverImage` exists).

**Tokens:** Replace stray `text-muted-foreground` with `var(--theme-muted-text)` / semantic equivalents where found during implementation.

### B. Body system

**Today:** `nn-premium-blog-prose` + `dangerouslySetInnerHTML` body; clinical summary + key takeaways sections above grid.

**Prose enhancements:** CSS for `blockquote`, tables, callouts—use **semantic** borders/backgrounds (`color-mix` with `--semantic-*`). Optional MD/HTML classes for “Pearl”, “Warning”, “Exam tip” — coordinate with blog HTML whitelist/sanitization (do not introduce unsafe HTML).

### C. Learning ecosystem (critical)

**Already wired:** Distribution footer + related reading + lesson/question/tool relations from publishing package.

**Figma:** Show **study-next rail** and **end-of-article CTA** as first-class surfaces—copy-driven links to lessons, practice, CAT, ECG, labs, OSCE **when post metadata provides them**.

### D. Sidebar / in-page nav

**Today:** `BlogArticleToc` in a **240px** right column beside body (`lg:grid-cols-[minmax(0,65ch)_240px]`).

**Design:** Sticky TOC + optional “Study next” mini-cards in same rail; **mobile:** collapsible TOC + sticky mini-nav pattern (one column stack).

### E. End of article

**Today:** Related reading → distribution footer → APA references → disclaimer → tag footer → `MarketingStudyCrossLinks`.

**Design:** Premium **continuation** module (pathway-colored cards): “Continue studying…”, “Practice…”, “Review ECG…”—reuse distribution semantics; avoid duplicate competing CTAs.

---

## Part 4 — Theme rules

| Theme | Role |
|-------|------|
| **Ocean** | Canonical grid, spacing, section order |
| **Blossom** | Pastel semantic surfaces; **no** layout change |
| **Midnight** | Dark workstation; contrast-first; **restrained** glass; **no** layout change |

All themes: same DOM order for accessibility and SEO.

---

## Part 5 — Technical preservation checklist (implementation phase)

- [ ] `BlogPostingJsonLd` / FAQ JSON-LD unchanged contract
- [ ] Canonical URLs and `alternates`
- [ ] Breadcrumb JSON-LD
- [ ] `revalidate` / on-demand revalidation behavior
- [ ] Inline editable keys for hub hero (`inline.marketing.blog.index.*`)
- [ ] Localization for regional blog indexes (`localizedMarketingBlogIndexCopy`, locale layouts)
- [ ] Internal links use `Link` + marketing locale helpers where applicable
- [ ] No public `/app` leakage beyond approved marketing/teaser patterns
- [ ] Distribution links remain plausible paths (`isPlausibleMarketingLessonDetailPath`, etc.)

---

## Part 6 — Figma frame checklist

| Frame | Contents |
|-------|-----------|
| `Blog / Hub / Desktop / Ocean` | Full hero + discovery + collection sections + card grid + pagination zone |
| `Blog / Hub / Desktop / Blossom` | Token swap |
| `Blog / Hub / Desktop / Midnight` | Token swap |
| `Blog / Hub / Mobile / Ocean` | Sticky search/filter, stacked collections |
| `Blog / Article / Desktop / Ocean` | Hero + attribution + summary/takeaways + two-column body+TOC + related + distribution + end CTA |
| `Blog / Article / Mobile / Ocean` | Collapsible TOC, stacked rails |
| `Blog / Article / Desktop / Midnight` | Contrast proof |

---

## Part 7 — Post-implementation verification

```bash
npm run typecheck:critical
npm run test:homepage   # includes blog/registry contracts where applicable
# Add or extend Playwright for /blog and /blog/[slug] smoke if selectors change materially
```

Deliver **before/after** screenshots and short summaries:

1. Organization / discovery improvements  
2. Ecosystem integration (how rails map to lessons/practice/CAT/tools)  
3. Theme parity notes  

---

## Designer → engineer handoff

1. Figma link + component annotations (spacing, heading levels).  
2. List of tag/category URLs each pill/collection maps to.  
3. Which rails are editorial vs automated (date vs analytics).  
4. Approval screenshot set posted to chat.

**No implementation until steps 1–4 are complete.**
