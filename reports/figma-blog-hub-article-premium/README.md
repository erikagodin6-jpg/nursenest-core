# Blog hub + article — premium Figma pass (approval gate)

**Stakeholder workflow:** Figma-first design and PNG exports only. **No application source code was modified** in this pass; Phase 2 implementation happens after approval.

## Figma file

| Item | Value |
|------|--------|
| **URL** | https://www.figma.com/design/8JEYbNJjDD90RuXyI4agxx/NurseNest-%E2%80%94-Blog-Hub-%2B-Article-(Premium) |
| **fileKey** | `8JEYbNJjDD90RuXyI4agxx` |
| **Pages** | `01 Blog Hub`, `02 Article` |

## Frame list (by page)

### `01 Blog Hub`

| Frame name | nodeId | Notes |
|------------|---------|--------|
| `hub-ocean-desktop` | `4:2` | Ocean — canonical auto-layout structure (1440×2600). |
| `hub-blossom-desktop` | `5:2` | Same structure as Ocean; **token-only** warm Blossom page background. |
| `hub-midnight-desktop` | `5:102` | Same structure; **token-only** dark workstation background + inverted text/surfaces. |
| `hub-ocean-mobile` | `5:202` | Ocean mobile width **390**; filter bar may overflow horizontally — refine wrap in a follow-up Figma pass. |

### `02 Article`

| Frame name | nodeId | Notes |
|------------|---------|--------|
| `article-ocean-desktop` | `8:2` | Hero, body callouts (pearl / warning / NGN), learning ecosystem CTAs, end CTA band, **right TOC rail**. |
| `article-ocean-mobile` | `9:2` | Stacked main + TOC/study rail below (mobile study nav pattern). |
| `article-midnight-desktop` | `9:159` | Same structure as Ocean article; Midnight surfaces. |

## PNG export map (this directory)

| PNG file | Source frame | nodeId |
|----------|----------------|--------|
| `hub-ocean-desktop.png` | `hub-ocean-desktop` | `4:2` |
| `hub-blossom-desktop.png` | `hub-blossom-desktop` | `5:2` |
| `blossom-hub-desktop.png` | Duplicate export of Blossom hub (same pixels as `hub-blossom-desktop.png`) | `5:2` |
| `hub-midnight-desktop.png` | `hub-midnight-desktop` | `5:102` |
| `hub-ocean-mobile.png` | `hub-ocean-mobile` | `5:202` |
| `article-ocean-desktop.png` | `article-ocean-desktop` | `8:2` |
| `article-ocean-mobile.png` | `article-ocean-mobile` | `9:2` |
| `article-midnight-desktop.png` | `article-midnight-desktop` | `9:159` |

**Absolute paths (exports):**

- `/root/nursenest-core/reports/figma-blog-hub-article-premium/hub-ocean-desktop.png`
- `/root/nursenest-core/reports/figma-blog-hub-article-premium/hub-blossom-desktop.png`
- `/root/nursenest-core/reports/figma-blog-hub-article-premium/blossom-hub-desktop.png`
- `/root/nursenest-core/reports/figma-blog-hub-article-premium/hub-midnight-desktop.png`
- `/root/nursenest-core/reports/figma-blog-hub-article-premium/hub-ocean-mobile.png`
- `/root/nursenest-core/reports/figma-blog-hub-article-premium/article-ocean-desktop.png`
- `/root/nursenest-core/reports/figma-blog-hub-article-premium/article-ocean-mobile.png`
- `/root/nursenest-core/reports/figma-blog-hub-article-premium/article-midnight-desktop.png`

## Layout / theme convergence (design intent)

- **Ocean** = canonical **one auto-layout system** (spacing, section order, card anatomy, filter strip, pathway rails).
- **Blossom / Midnight** = **identical hierarchy**; only fills, strokes, and typography color tokens change (plus Midnight elevated surfaces).
- **Mobile:** dedicated `hub-ocean-mobile` and `article-ocean-mobile` frames; filter **drawer** is the intended mobile pattern (chips collapse into drawer — note in README; add a dedicated drawer frame in a later pass if stakeholders require a pixel spec).

## Copy / tone

- Frames use **clinical, supportive, exam-ready** copy (no lorem); CTAs reference lessons, flashcards, practice, CAT, labs, OSCE/scenarios, and pathway continuation.
- **Truthpack:** `.vibecheck/truthpack/copy.json` was **not found** in this workspace (`**/truthpack/**/*.json` glob returned no files). Before Phase 2 marketing copy changes, sync truthpack and align strings to verified brand copy.

## Phase 2 — hard constraints (document only; no code in this task)

Preserve without regression:

1. **Structured data:** `BlogPosting`, FAQ, and Breadcrumb JSON-LD.
2. **Canonical URLs** and **metadata** (`generateMetadata`, canonical alternates, OG article type where applicable).
3. **Internal linking** and `applyAutoLinksToHtml` / related-reading filters that respect exam/pathway scope.
4. **i18n** and locale-specific blog index routes.
5. **Publishing pipeline** (`revalidate`, admin publish paths, `safe-blog-queries`, sanitization).
6. **Routing:** stable URLs (`/blog`, `/blog/[slug]`, `/blog/tag/[tag]`, `/blog/category/[category]`, career hubs, localized variants).

**Vision guardrails:** avoid generic WordPress-style templates and flat “sitemap wall” grids; target a **library / knowledge hub** with **semantic multi-hue** cards (align to `semantic-status-tokens.css` in implementation).

## Phase 2 — likely implementation map (discovered paths only)

**Hub / listing**

- `nursenest-core/src/app/(marketing)/(default)/blog/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/blog/rn/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/nursing/[careerSlug]/blog/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/allied-health/[slug]/blog/page.tsx`
- `nursenest-core/src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/page.tsx`
- `nursenest-core/src/components/blog/blog-post-card.tsx`, `blog-marketing-post-list-client.tsx`, `blog-topic-badge.tsx`
- `nursenest-core/src/lib/blog/safe-blog-queries.ts`, `blog-index-hero-copy.ts`, `blog-seo-automation.ts`

**Article / post**

- `nursenest-core/src/app/(marketing)/(default)/blog/[slug]/page.tsx`
- `nursenest-core/src/components/blog/blog-article-toc.tsx`, `blog-related-reading-section.tsx`, `blog-post-distribution-footer.tsx`
- `nursenest-core/src/lib/blog/blog-public-article-html.ts`

**Cross-cutting**

- `nursenest-core/src/components/seo/breadcrumb-bar.tsx`, `nursenest-core/src/lib/seo/*`

## SEO preservation checklist (Phase 2 QA)

- [ ] `BlogPostingJsonLd` correct for headline, dates, canonical.
- [ ] FAQ JSON-LD matches visible FAQ content.
- [ ] Breadcrumb JSON-LD matches `BreadcrumbBar` and URLs.
- [ ] `alternates.canonical` and `openGraph.url` semantically unchanged per slug.
- [ ] `revalidate` / caching policy unchanged unless explicitly approved.
- [ ] Related reading still pathway/exam safe (`filterRelatedBlogReadingForParentExam`).

## Before / after notes

**TBD** post-implementation: `/blog` and `/blog/[slug]` screenshots (desktop + mobile; Ocean / Blossom / Midnight per governance).

## Figma follow-ups (optional)

- Hub mobile: make **card-row** stack or wrap so cards do not clip at 390px width.
- Article desktop: widen **callout** auto-layout frames so body text does not over-wrap in narrow columns.

---

*Verified By VibeCheck ✅* — truthpack `copy.json` not present in workspace; Figma link and repo paths verified via MCP and filesystem.
