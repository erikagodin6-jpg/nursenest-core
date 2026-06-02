# Canonical URL risk surfaces — audit

Each issue: **route**, **SEO risk**, **likely cause**, **SAFE_FOR_AI** vs **DEV_ONLY**, **recommended fix** (documentation or future implementation — **not applied** in this audit).

---

## 1. Global origin and `metadataBase`

| Route | SEO risk | Likely cause | Tag | Recommended fix |
|-------|----------|--------------|-----|-----------------|
| **All absolute URLs** (`absoluteUrl`, sitemaps, JSON-LD `item`) | Wrong host in SERP / GSC mismatch | `NEXT_PUBLIC_APP_URL` unset → `CANONICAL_PRODUCTION_ORIGIN`; or wrong value at **build** for client | **DEV_ONLY** | Deploy checklist: one canonical HTTPS `www` (or chosen) host; rebuild after `NEXT_PUBLIC_*` change |
| **`src/app/layout.tsx`** | OG `url` uses `MARKETING_SITE_ORIGIN` | Same as above | **DEV_ONLY** | Align root `metadataBase` with production property |

---

## 2. NP SEO alias vs core pathway (`np-seo-alias-canonical-policy.ts`)

| Route | SEO risk | Likely cause | Tag | Recommended fix |
|-------|----------|--------------|-----|-----------------|
| `/{country}/np/{alias}` (overview) | Duplicate hub if both alias and core indexed as separate documents | Intentionally **self-canonical** on alias landing | **SAFE_FOR_AI** | Keep policy; internal links should prefer one winner for PageRank |
| `…/lessons`, `…/lessons/{slug}`, `…/questions`, `…/pricing` under alias path | Signals split between alias and core | Subpages **canonicalize to `buildExamPathwayPath`** | **SAFE_FOR_AI** | GSC: preferred domain + canonical already coded; monitor coverage |
| **Open Graph `url`** on NP SEO overview (`page.tsx`) | OG URL differs from subpage canonical tree | Uses `requestUrl` on overview branch | **DEV_ONLY** | Acceptable for landing identity; document for social previews |

---

## 3. Exam pathway lessons hub (`…/lessons`)

| Route | SEO risk | Likely cause | Tag | Recommended fix |
|-------|----------|--------------|-----|-----------------|
| `/(default)/[locale]/[slug]/[examCode]/lessons` with `?q=` | Index bloat | User search | **Low** | Already `robots: { index: false, follow: true }` |
| Same with `topicSlug` / `page` | Near-duplicate pages | Faceted navigation | **Medium** | Canonical includes query string where built — verify only one preferred page per topic |
| **Allied** pathway branch | Wrong country URL indexed as canonical | Canonical **forced** to `buildAlliedGlobalHubPath("lessons")` + query | **Medium** | Ensure redirects from legacy country allied URLs (layout uses `legacyCountryAlliedHealthMarketingRedirectDestination`) |

---

## 4. Pathway lesson detail (`…/lessons/[lessonSlug]`)

| Route | SEO risk | Likely cause | Tag | Recommended fix |
|-------|----------|--------------|-----|-----------------|
| Public **complete** lesson | Soft-404 or thin if `publicComplete` false | Gating / incomplete record | **High** | Editorial + data: `publicComplete` gates indexable metadata |
| **Legacy slug** resolution | Chain redirects / wrong canonical | `loadPathwayLessonSeoMetaWithLegacySlugRedirect` | **DEV_ONLY** | Keep redirect tests; avoid chains >1 hop |
| **JSON-LD `path`** (`pathway-lesson-detail-page-body.tsx`) | Schema URL ≠ canonical | Uses `pathwayLessonPublicDetailPath` vs pathname | **DEV_ONLY** | Periodic diff: schema path must match `alternates.canonical` |

---

## 5. Blog (localized)

| Route | SEO risk | Likely cause | Tag | Recommended fix |
|-------|----------|--------------|-----|-----------------|
| `(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/[postSlug]` | Cross-locale duplicate | Variants + hreflang map | **Medium** | Already builds `languages` from `seo.hreflangEntries`; validate DB rows |
| Hidden / draft posts | Accidental index | Publish gate | **High** | Keep publish pipeline checks |

---

## 6. Internal SEO debug / rewrites

| Route | SEO risk | Likely cause | Tag | Recommended fix |
|-------|----------|--------------|-----|-----------------|
| `/seo/*` | Duplicate with public `/{slug}` | Legacy rewrite targets | **High** if allowed | `robots.txt` **Disallow: /seo/** — keep |

---

## 7. Metadata HTTP validation → fallback

| Route | SEO risk | Likely cause | Tag | Recommended fix |
|-------|----------|--------------|-----|-----------------|
| **Any** `safeGenerateMetadata` consumer | Many URLs share **same generic** title/description | Canonical or hreflang URL returns non-2xx when strict HTTP validation enabled | **High** | Ops: ensure canonical URLs always 200; reduce strict noise in prod if needed |

---

## 8. Summary

**Highest canonical risks:** (1) **environment-driven origin** drift, (2) **NP alias vs core** (by design — needs GSC discipline), (3) **metadata validation fallback** collapsing distinct pages to one generic title, (4) **allied hub consolidation** vs old bookmarks.
