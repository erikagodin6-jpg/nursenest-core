# Breadcrumb and internal-link SEO audit (Phase 7)

**Purpose:** Verify breadcrumb coverage and SEO internal-link quality across public sitemap families without changing sitemap, robots, canonical, hreflang, routing, or entitlement behavior.

**Inputs read / referenced:**
- `docs/planning/sitemap-architecture-audit-and-roadmap.md`
- `docs/reports/sitemap-segmentation-final-seo-evidence.md`
- `docs/reports/sitemap-production-qa-and-search-console-handoff.md`
- Breadcrumb implementation: `src/lib/seo/breadcrumb-*.ts`, `src/components/seo/breadcrumb-*.tsx`
- Blog distribution linking: `src/components/blog/blog-post-distribution-footer.tsx`

---

## Executive summary

Breadcrumb architecture is centralized and generally healthy: public marketing breadcrumbs use `BreadcrumbBar` (visible UI + JSON-LD), app breadcrumbs use visible-only `BreadcrumbTrail`, and `BreadcrumbJsonLd` filters invalid public URLs before emitting schema. Pathway breadcrumb tests already cover hub, lesson, topic, questions, CAT, pricing, NP alias canonical behavior, and blog post schema tail URLs.

Internal-link QA found one low-risk hardening opportunity in public blog related-lesson links: `BlogPostDistributionFooter` relied on `isPlausibleMarketingLessonDetailPath`, but that guard accepted `/app/lessons/...` because the path shape looked like a lesson detail. The guard now rejects `/app`, `/admin`, `/api`, `/seo`, query, and hash paths. This preserves the intended public-blog behavior: lesson links are marketing/public, and app-only actions go through login callback links.

---

## Page family audit

| Page family | Breadcrumb coverage | JSON-LD coverage | Internal-link QA | Findings |
|---|---|---|---|---|
| Marketing pages | `simpleMarketingBreadcrumbs`, `marketingPricingBreadcrumbs`, `toolsIndexBreadcrumbs`, `caseStudiesBreadcrumbs`, `forInstitutionsBreadcrumbs` provide Home → page trails where used. | `BreadcrumbBar` emits `BreadcrumbJsonLd` for public pages. | Header/hub CTAs are outside this audit; sitemap docs confirm public-only URL policy. | Good. Continue adding route-specific helpers when new marketing pages ship. |
| Pathway hubs | `pathwayOverviewBreadcrumbs` builds Home → country guide → role → pathway hub. | Existing tests verify canonical schema URLs including NP alias handling. | Hubs link to lessons/questions/CAT/pricing via public marketing routes. | Good. Existing tests cover Canada/US role segment correctness. |
| Topic cluster pages | `pathwayTopicClusterBreadcrumbs` shares the same country + role crumbs as pathway hubs. | Existing test checks shared schema lineage with pathway overview. | Hubs and lesson surfaces link through public topic/lesson paths. | Good; browser/mobile visual QA still recommended. |
| Lesson pages | `pathwayLessonDetailBreadcrumbs` builds through pathway and lessons context, with final schema item set to lesson URL. | Existing tests verify lesson-detail schema tail URL. | Lesson detail pages are linked from hubs/topic clusters; public blog related lessons now reject private/system paths. | Hardened in Phase 7 via `marketing-lesson-path-guard`. |
| Blog posts | `blogPostBreadcrumbs` final schema item points to `/blog/{slug}`. | Existing test covers final schema item. | `BlogPostDistributionFooter` links to related lessons, public practice/CAT/flashcard hubs, tools, and login-gated app callbacks. | Hardened: related lesson paths now reject `/app`, `/admin`, `/api`, `/seo`, query, hash. |
| Allied pages | Allied pages use `BreadcrumbBar` on marketing career pages; allied hub paths are public sitemap-owned. | Inherits `BreadcrumbJsonLd` filtering. | Allied CTAs route through public allied hubs/questions. | Good; add route-specific tests when allied page variants expand. |
| New Grad pages | New Grad sitemap segment is registry-owned; breadcrumb expectations documented in Phase 5. | No broad code-level breadcrumb test found in this pass. | Public New Grad paths remain in `sitemap-new-grad.xml`. | Follow-up: add explicit New Grad breadcrumb contract when helper exists or page structure stabilizes. |
| Public clinical module teasers | `/tools` + `/tools/{slug}` helpers support Study tools → tool. | `toolsSlugBreadcrumbs` emits public schema items. | Blog tool links use `/tools/{slug}` via `toolPathForSlug`. | Good. Avoid `/modules/*` and `/app/labs` in public crumbs. |
| Localized public pages | `localizeBreadcrumbResolutionForLocale` localizes labels and URLs for visible crumbs + schema items. | Tests verify `/es` URL rewriting and no raw-key fallback for mapped locale fallbacks. | Locale policy remains sitemap/metadata-owned. | Good. Phase 7 adds no-raw-key test coverage. |

---

## Breadcrumb verification details

| Requirement | Status | Evidence |
|---|---|---|
| Visible breadcrumb UI where appropriate | Pass by architecture | Public pages use `BreadcrumbBar` → `BreadcrumbTrail`; app routes use `BreadcrumbTrail` only. |
| Valid `BreadcrumbList` JSON-LD | Pass | New test renders `BreadcrumbJsonLd` and asserts `@type: BreadcrumbList` with ordered `ListItem` positions. |
| Canonical URL alignment | Pass for covered route classes | Existing pathway tests verify final schema URLs and NP alias/canonical split. |
| No private `/app` URLs in breadcrumb trails | Pass for JSON-LD | `BreadcrumbJsonLd` filters invalid public URLs; new test rejects `/app`, `/admin`, `/api`, `/seo`, query, hash. Visible app breadcrumbs are UX-only and should not emit schema. |
| Localized labels use approved i18n/fallback strings | Pass for covered labels | New test verifies localized breadcrumb labels do not fall back to raw `breadcrumbs.*` keys. |
| Mobile layout remains readable | Pass by static implementation; needs visual spot-check | `BreadcrumbTrail` uses `flex-wrap`, `min-w-0`, `break-words`, and `overflow-wrap:anywhere`. No browser screenshot was captured in this phase. |

---

## Internal-link findings

| Link class | Finding | Action |
|---|---|---|
| Blog → relevant lessons | Related lesson paths render only when they pass `isPlausibleMarketingLessonDetailPath`. | Hardened guard to reject private/system/query/hash paths. |
| Lessons → hubs | Existing pathway lesson breadcrumb and hub link tests cover hub lineage; no runtime change made. | Keep covered in pathway lesson tests. |
| Hubs → topic clusters / lesson details | Covered by existing route/pathway tests and sitemap partitioning. | Add browser crawl/a11y QA before major hub IA changes. |
| Public teaser pages → marketing/paywall-safe CTAs | Tool links are `/tools/{slug}`; clinical teaser sitemap excludes gated learner surfaces. | No change. |
| Gated learner routes | App-only blog CTAs intentionally go through `/login?callbackUrl=...`; no raw `href="/app/..."` in tested footer. | New test asserts login callback behavior. |

---

## Tests added / updated

| File | Coverage |
|---|---|
| `src/components/seo/breadcrumb-json-ld.test.tsx` | BreadcrumbList schema shape; filters private/system/query/hash URLs from JSON-LD. |
| `src/components/blog/blog-post-distribution-footer.test.tsx` | Public blog footer keeps primary links marketing-safe and gates app-only CTAs through login callback links. |
| `src/lib/lessons/marketing-lesson-path-guard.test.ts` | Accepts public lesson detail paths; rejects private/system/query/hash/hub/topic paths. |
| `src/lib/seo/breadcrumb-i18n.test.ts` | Adds raw-i18n-key fallback prevention for localized breadcrumbs. |



## Verification run (2026-05-10)

| Command | Result |
|---|---|
| `npm run typecheck:critical` | Pass |
| `npm run sitemap:validate` | Pass — 0 duplicate locs, 0 invalid/private locs, 0 errors |
| `node --import tsx --test src/components/seo/breadcrumb-json-ld.test.tsx src/components/blog/blog-post-distribution-footer.test.tsx src/lib/seo/breadcrumb-i18n.test.ts src/lib/seo/pathway-breadcrumbs.test.ts src/lib/lessons/marketing-lesson-path-guard.test.ts` | Pass — 22 tests |
| `node --import tsx --test src/lib/seo/*.test.ts src/app/**/breadcrumb*.test.ts` (expanded through bash globstar) | Fails in existing broad SEO suite: 145 pass / 6 fail. Failures observed in `marketing-locale-regional-url-invariants.test.ts`, `route schema hardening` page checks, `sitemap-build-safe-mode.test.ts`, and `sitemap-build-skip.test.ts`. New Phase 7 breadcrumb/internal-link tests passed separately. |

---

## Risks

1. **Visible breadcrumb coverage is route-by-route.** The model is centralized, but every new marketing shell still needs to choose `BreadcrumbBar` vs `BreadcrumbTrail` intentionally.
2. **Mobile readability needs browser evidence.** Static classes are mobile-safe, but this phase did not capture Playwright screenshots.
3. **Blog related lessons depend on content inputs.** The guard now filters unsafe path shapes, but editorial relevance still depends on generated/admin content quality.
4. **New Grad breadcrumbs need explicit contract coverage** once their public page breadcrumb helper is standardized.

---

## Follow-up recommendations

1. Add browser screenshot coverage for representative breadcrumb trails: pathway hub, topic cluster, lesson detail, blog post, tools teaser, localized page.
2. Add a New Grad breadcrumb contract when the route helper is stable.
3. Add an internal-link crawler job that samples public pages and flags raw `/app/*` anchors unless wrapped by `/login?callbackUrl=` or explicitly approved.
4. Keep sitemap validation and breadcrumb audits separate: sitemap checks discoverability; breadcrumbs/internal links check site graph quality.

---

*Phase 7: breadcrumb + internal-link SEO QA. Sitemap runtime, robots.txt, canonical, hreflang, routing, and entitlement behavior were not changed.*
