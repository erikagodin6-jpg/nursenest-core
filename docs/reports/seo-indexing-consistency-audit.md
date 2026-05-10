# SEO Indexing Consistency Audit

Date: 2026-05-10

## Scope

Audited the NurseNest public SEO indexing pipeline for consistency across robots.txt, sitemap index and child urlsets, hreflang alternates, canonical generation, locale readiness gating, noindex handling, and auth, learner, admin, internal, preview, module, and tool routes.

The production rule applied here is: any route intentionally excluded from indexing must use page/layout noindex, must stay out of sitemaps, must not appear in hreflang clusters, and must not rely only on robots.txt blocking.

## Root Causes Found

1. Noindex auth pages emitted hreflang alternates. Login, signup, forgot-password, and reset-password pages were correctly marked noindex,follow, and the sitemap filter removed them, but their metadata reused the shared localized marketing alternates helper. That helper emitted full hreflang language clusters, which made excluded utility URLs appear as alternate index candidates.

2. Portuguese SEO readiness was ahead of the requested blocked-locale policy. `pt` was marked full in the language registry, so it leaked into sitemap inclusion, hreflang generation, and localized SEO audit surfaces. The blocked-locale audit set now overrides SEO readiness until Portuguese is explicitly production-ready again.

3. Existing locale readiness tests had drifted from current policy. Some tests still described Tagalog and Hindi as partial sitemap-excluded locales even though current registry state treats them as full SEO locales. The tests were updated to separate full-locale expectations from blocked-locale expectations.

## Routes Fixed

- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/{locale}/login`
- `/{locale}/signup`
- `/{locale}/forgot-password`
- `/{locale}/reset-password`

These routes now keep self canonicals and `noindex,follow`, but no longer emit `alternates.languages` / hreflang clusters.

## Locale Leaks Fixed

Blocked audit locales are now centralized in SEO readiness:

- `it`
- `vi`
- `tr`
- `ur`
- `ko`
- `fa`
- `zh`
- `pa`
- `pt`

For these locales:

- `isLocaleSeoIndexable()` returns false.
- `isLocaleSitemapIncluded()` returns false.
- `isLocaleRobotsPathDisallowed()` returns true.
- `getHreflangEligibleLocales()` excludes them.
- localized SEO audit locale collection excludes them.

## Robots / Noindex Corrections

- `robots.txt` continues to disallow `/app/`, `/admin/`, `/internal/`, `/api/`, `/seo/`, and disabled locale prefixes.
- Blocked locales are now disabled at the SEO readiness layer, so the robots disallow list and noindex metadata policy agree.
- Utility/auth routes remain crawlable and `noindex,follow`; they are not robots-blocked, which lets crawlers see the noindex directive.
- Learner, admin, internal, preview, and legacy module shells already use layout/page noindex and remain out of public sitemap filters.

## Sitemap Corrections

- Localized sitemap segment collection now excludes all blocked audit locales, including `pt`.
- Auth/utility paths continue to be removed by the public sitemap filter.
- Public lesson SEO, blog SEO, segmented sitemap architecture, and public/private separation were preserved.
- Tool sitemap collection remains limited to shipped public `/tools/*` marketing teasers. The requested `first-action-simulator` and `medication-mastery` routes were not present as public route slugs in the current app tree or tool registry, so they do not currently leak into sitemap output.

## Hreflang / Canonical Corrections

- Auth/utility pages now use a noindex utility alternates helper that returns only `{ canonical }`.
- Shared indexable marketing routes continue to use the existing localized canonical and hreflang helper.
- Blocked locales no longer appear in generated hreflang clusters through `getHreflangEligibleLocales()`.
- Canonical URL generation was preserved for public lessons, blog posts, and indexable marketing pages.

## Tests Added / Updated

- `src/lib/seo/sitemap-marketing-exclusions.test.ts`: verifies noindex utility auth pages do not emit hreflang language alternates.
- `src/lib/seo/sitemap-public-index-filter.test.ts`: verifies localized sitemap segment output excludes every blocked audit locale.
- `src/lib/seo/localized-seo-readiness.test.ts`: verifies Portuguese is blocked from sitemap and hreflang until production readiness is restored, and localized SEO audit locale collection does not include `pt`.
- `src/lib/i18n/language-readiness-sitemap.test.ts`: verifies the explicit blocked locale set is excluded from sitemap eligibility.
- `src/lib/i18n/language-readiness-robots.test.ts`: verifies the explicit blocked locale set is robots-disallowed.

## Unresolved SEO Risks

- Google Search Console should be revalidated after deployment because existing indexed-but-blocked URLs may remain in GSC until Google recrawls them.
- Runtime HTML checks should confirm `noindex,follow` is present on deployed auth utility URLs and blocked locale pages, not just in static metadata contracts.
- If `first-action-simulator` or `medication-mastery` are introduced later as public routes, they should be registered explicitly as either indexable public tools or noindex hidden/experimental tools before sitemap inclusion.
- `pt` remains visible in the language registry for product/i18n purposes, but is SEO-blocked by override. Before restoring Portuguese indexing, remove it from `SEO_BLOCKED_LOCALES` only after translation, canonical, sitemap, hreflang, and nav readiness checks pass.
