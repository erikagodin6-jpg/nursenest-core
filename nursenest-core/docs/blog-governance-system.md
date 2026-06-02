# NurseNest blog governance system

Governance adds **measurable scoring**, **publishing protection**, and **audit scripts** without replacing topic gates, pre-publish validation, or `validateBlogPublishQuality`.

## Source files

- **`src/lib/blog/blog-quality-score.ts`** — dimensions, composite score, placeholder/repetition detection, remediation hints, publish recommendation.  
- **`src/lib/blog/publish-generated-blog-article.ts`** — runs governance after existing checks when `blogGovernance !== false` (default on). Logs `safeServerLog("blog-governance", "publish_gate", { outcome, … })`.

## Audits

From **`nursenest-core/`** (or repo root via `npm --prefix nursenest-core`):

- `npm run blog:audit-quality` — drafts / review rows (bounded `findMany`).  
- `npm run blog:audit-published-quality` — published rows (read-only; no rewrites).  

Reports: `reports/blog-audit-drafts-*.md` / `.json` and `reports/blog-audit-published-*` at **repo root** (see `scripts/blog/audit-*.mts`). Aggregates include average composite score, `review_only` / `block` counts, and samples of weakest slugs for trend review.

## Publish-time observability

On generated publish attempts, `publish-generated-blog-article` logs `safeServerLog("blog-governance", "publish_gate", { outcome, …buildGovernanceObservabilityPayload })`: `compositeScore`, `publishRecommendation`, `dimensionMins`, `failCount`, `failSample`. Use log aggregation to track rejection causes and score drift (no DB schema change).

## Thresholds

See **`docs/blog-quality-thresholds.md`**. Canonical copies may also live under repo root **`reports/blog-quality-thresholds.md`** when generated or copied in CI.

## Constraints

No mass rewrites, no URL/slug/SEO mutations from governance, legacy-compatible modes preserved.
