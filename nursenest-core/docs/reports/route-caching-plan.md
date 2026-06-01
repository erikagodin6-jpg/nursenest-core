# Route Caching Plan

Date: 2026-06-01

## Scope

Audited `src/app` route files and classified route behavior across public marketing, blog, exam hubs, lesson hubs, learner application routes, admin routes, API routes, and runtime health/ops routes.

Route inventory from filesystem:

- Total `page.tsx` + `route.ts` files: 1,027
- Marketing pages: 301
- Learner app pages: 120
- Routes explicitly `force-dynamic`: 402
- Marketing routes with explicit ISR/static cache config: 241

## Route Classification

| Route family | Classification | Cache strategy |
|---|---|---|
| Homepage and general marketing pages | Mostly Static | ISR via segment/page `revalidate`, default marketing layout `revalidate = 300` |
| Public blog index/category/tag/article pages | Mostly Static | ISR: index 180s, category/tag/articles 3600s |
| Blog RSS/feed routes | Mostly Static | Route cache: `force-static`, `revalidate = 3600` |
| Public exam hubs | Mostly Static | ISR: pathway hubs 3600s, supporting exam/resource pages 86400s |
| Public lesson hubs | Mostly Static | ISR: lesson hub pages 86400s, lesson detail pages 3600s |
| Lesson system/topic/category pages | Mostly Static | ISR: system/category URLs 86400s, legacy topic redirect cached |
| Allied health public hubs/pages | Mostly Static | ISR: 1800s-86400s depending on content volatility |
| Static policy/redirect pages | Static | Static route generation where safe |
| Learner dashboard/account pages | User Specific | No route cache; per-request/session data only |
| Learner activity launchers | User Specific | No route cache; use data-level caches only |
| Active study sessions, CAT, practice, flashcard sessions | Session Specific | No route cache |
| Admin pages | Session Specific | `force-dynamic`; no public cache |
| Mutation APIs, Stripe/webhooks, auth, admin APIs | Session Specific | No route cache |
| Health/readiness/runtime probes | Session Specific | `force-dynamic`; no route cache |
| Sitemap routes | Mostly Static | ISR/route cache, 3600s-86400s depending on segment |

## Implemented Changes

| Route | Previous | New |
|---|---|---|
| `/[locale]/[slug]/[examCode]/flashcards` | Dynamic params, no explicit ISR | `revalidate = 86400` |
| `/[locale]/[slug]/[examCode]/lessons/topics/[topicSlug]` | Dynamic params, no explicit ISR | `revalidate = 86400` |
| `/exam-lessons` | Redirect without explicit static config | `dynamic = "force-static"`, `revalidate = false` |
| `/np-specialty/[specialty]` | Redirect without explicit cache config | `dynamic = "force-static"`, `dynamicParams = true`, `revalidate = 86400` |
| `/feed.xml` | `force-dynamic` | `force-static`, `revalidate = 3600` |
| `/rss.xml` | `force-dynamic` | `force-static`, `revalidate = 3600` |

## Existing Cache Coverage Confirmed

| Surface | Current cache config |
|---|---|
| `/` homepage | `revalidate = 300` |
| `/lessons` public hub | `revalidate = 600` |
| `/question-bank` public hub | `revalidate = 600` |
| `/blog` | `revalidate = 180` |
| `/blog/[slug]` | `revalidate = 3600` |
| `/blog/category/[category]` | `revalidate = 3600` |
| `/blog/tag/[tag]` | `revalidate = 3600` |
| Regional blog hubs and articles | `revalidate = 3600` |
| Pathway exam hubs | `revalidate = 3600` |
| Pathway lessons hub | `revalidate = 86400` |
| Pathway lesson detail | `revalidate = 3600` |
| Pathway questions/CAT/pricing/study-resource pages | `revalidate = 86400` |
| Allied health public hubs | `revalidate = 1800` or `86400` |
| Sitemap segments | `revalidate = 3600` or `86400` |
| `robots.txt` | `force-static`, `revalidate = 3600` |

## Load-Time Impact Estimate

These are route-family estimates for cacheable public routes. Authenticated learner routes are intentionally excluded from route caching because they render user-specific or session-specific data.

| Route family | Current load time | Estimated cached load time | Notes |
|---|---:|---:|---|
| Static redirects/policy pages | 40-150ms | 20-80ms | Static route generation removes runtime work |
| Homepage/public marketing pages | 300-900ms | 80-250ms | ISR cache hit avoids repeated layout/content work |
| Public blog index | 600-1500ms | 80-250ms | Existing bounded query still runs on ISR miss only |
| Blog category/tag pages | 700-1800ms | 100-300ms | Count/list queries move to ISR miss path |
| Blog article pages | 350-1000ms | 80-220ms | Article body/meta load runs on ISR miss path |
| Blog RSS/feed | 500-1200ms | 60-180ms | Route cache avoids repeated RSS DB/list build |
| Public exam hubs | 450-1200ms | 80-250ms | Registry/content aggregation runs on ISR miss |
| Public lesson hubs | 900-2500ms | 120-350ms | Heavy lesson aggregation runs on ISR miss |
| Lesson system/category/topic pages | 500-1500ms | 80-250ms | Added missing ISR for legacy topic redirect surface |
| Public allied hubs | 500-1400ms | 100-300ms | Existing ISR retained |

## Non-Cacheable Route Policy

Route cache remains disabled for:

- `/app/**` learner shell routes that depend on auth, entitlements, profile, progress, readiness, or active learner state.
- Active sessions: CAT, practice exams, flashcard study sessions, simulations.
- Admin routes.
- Mutating API routes.
- Billing/webhook/auth routes.
- Health/readiness probes.

These routes should continue to use request-scoped caches, private data caches, and bounded query helpers rather than public route cache.

## Follow-Up Verification

Recommended checks after deploy:

1. Confirm response headers for `/feed.xml`, `/rss.xml`, `/blog`, `/blog/category/NCLEX-RN`, `/lessons`, and a pathway lesson hub show cacheable behavior.
2. Confirm signed-in learner routes still render personalized data and are not publicly cached.
3. Confirm sitemap and feed freshness after blog publication/revalidation events.

