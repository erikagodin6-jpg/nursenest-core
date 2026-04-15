/**
 * Indexability policy (reference only — enforce via `metadata` on each route family).
 *
 * index + follow, in sitemap: marketing home, about, pricing, for-institutions, blog, tools, pre-nursing,
 *   editorial-policy, content-review-policy, programmatic SEO pages, localized marketing mirrors, published blog posts,
 *   exam product hubs (`/us/…`, `/canada/…`) — use `examPathwayRegionalHreflang` + explicit robots; pathway `locale` param is country, not i18n.
 * noindex + follow: login, signup, forgot-password, reset-password, app shell, tag pages with zero posts.
 * noindex + nofollow: admin, API (blocked in robots.txt).
 * Excluded from sitemap: /app/*, /admin/*, /api/*, auth flows, /seo/* (internal rewrite only; disallow in robots).
 */

export {};
