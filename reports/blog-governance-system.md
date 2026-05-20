# NurseNest blog governance system

Governance adds **measurable scoring**, **publishing protection**, and **audit scripts** without replacing topic gates, pre-publish validation, or `validateBlogPublishQuality`.

## Source files

- **`src/lib/blog/blog-quality-score.ts`** — dimensions, composite score, placeholder/repetition detection, remediation hints, publish recommendation.  
- **`src/lib/blog/publish-generated-blog-article.ts`** — runs governance after existing checks when `blogGovernance !== false` (default on). Logs `safeServerLog("blog-governance", "publish_gate", { outcome, … })`.

## Audits

- `npm run blog:audit-quality` — drafts / review rows (bounded `findMany`).  
- `npm run blog:audit-published-quality` — published rows (read-only; no rewrites).  

Reports: `reports/blog-audit-drafts-*.md` and `reports/blog-audit-published-*.md` at **repo root** (see scripts).

## Thresholds

See **`docs/blog-quality-thresholds.md`**.

## Constraints

No mass rewrites, no URL/slug/SEO mutations from governance, legacy-compatible modes preserved.
