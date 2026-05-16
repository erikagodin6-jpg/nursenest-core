# Legacy → Next gap map

Generated: **2026-05-16T15:00:54.624Z**

## Top 20 migration priorities

| # | Priority | Status | Category | Title | Action |
|---|----------|--------|----------|-------|--------|
| 1 | critical | not_migrated | lessons | App.tsx | migrate |
| 2 | critical | not_migrated | lessons | admin-routes.tsx | migrate |
| 3 | critical | not_migrated | osce | allied-health-flashcards.ts | migrate |
| 4 | critical | not_migrated | lessons | certification-prep-content.ts | migrate |
| 5 | critical | not_migrated | lessons | use-kill-switches.ts | migrate |
| 6 | critical | not_migrated | lessons | use-trial-status.ts | migrate |
| 7 | critical | not_migrated | lessons | LocaleLink.tsx | migrate |
| 8 | critical | not_migrated | lessons | access.ts | migrate |
| 9 | critical | not_migrated | osce | admin-fetch.ts | migrate |
| 10 | critical | not_migrated | lessons | api-error.ts | migrate |
| 11 | critical | not_migrated | lessons | breadcrumb-builder.ts | migrate |
| 12 | critical | not_migrated | osce | canonical-display.ts | migrate |
| 13 | critical | not_migrated | osce | citation.ts | migrate |
| 14 | critical | not_migrated | lessons | delivery-orchestrator.ts | migrate |
| 15 | critical | not_migrated | osce | difficulty.ts | migrate |
| 16 | critical | not_migrated | lessons | entitlements.ts | migrate |
| 17 | critical | not_migrated | osce | flashcard-cache.ts | migrate |
| 18 | critical | not_migrated | lessons | getI18n.ts | migrate |
| 19 | critical | not_migrated | lessons | i18n-audit-report.md | migrate |
| 20 | critical | not_migrated | osce | i18n.tsx | migrate |

## Quick wins

- Items already on Next with admin APIs: finish **verify** + remove duplicate legacy authoring.
- OSCE: finish DB population + cut legacy fallback once `osce_stations` is authoritative.
- Med math: run `migrate:med-math:*` dry-run, then staged writes per pathway.

## Source-of-truth risks

- Any **learner** route still importing `@legacy-client` without a migration flag.
- Catalog JSON + DB both claiming authority for the same slug.
- Generated blog or lesson indexes not rebuilt after admin publish.

## Paid learner feature gaps

- Legacy-only flows under `client/` with no `nursenest-core/src/app/(student)` equivalent.
- Admin edit surfaces without matching `CONTENT_REGISTRY` verification (see content-source-of-truth).

## SEO opportunities

- Legacy marketing pages not represented in Next `src/app/(marketing)` sitemap manifests.

## Admin publishing gaps

- Content visible on `/app` but no `/admin` + `/api/admin` write path (inventory flags `partially_migrated`).

## Do not regenerate (already exists in Next)

- Pathway lessons authored in **PathwayLesson** + pathway-lesson admin.
- **BlogPost** pipeline for live blogs (regenerate only via controlled jobs).
