# Unified Nursing + Allied Blog Restoration Report

Date: 2026-04-13

## Scope Completed

- Added allied source-vs-live audit command (`npm run audit:allied-blog-recovery`).
- Extended legacy export to include `published`, `scheduled` (including future), and `draft` rows with status counts.
- Extended `BlogPost` shared schema for profession + locale + translation lifecycle fields.
- Upgraded importer to unified nursing/allied pipeline with profession assignment and full status preservation.
- Updated scheduler/visibility to honor `scheduledAt` alongside `publishAt`.
- Added locale + profession-aware DB query scope and source-locale fallback in blog query layer.
- Added allied locale backfill script with bounded batching, skip-existing logic, and per-locale/per-profession logs.
- Added DB-backed allied blog index/detail routes:
  - `/allied-health/[slug]/blog`
  - `/allied-health/[slug]/blog/[postSlug]`
- Added direct blog CTA from allied profession hub page.

## Runtime Metrics Captured

### Allied source audit (`npm run audit:allied-blog-recovery`)

- Legacy export rows available at run time: `0`
- Paramedic static source rows found: `3`
- MLT static stub rows found: `15`
- Imaging JSON rows found: `3`
- DB estimate at run time:
  - paramedic: `3`
  - mlt: `0`
  - imaging: `0`

### Unified importer (`npm run import:blog`)

- Total unified rows prepared: `21`
- Imported successfully: `0`
- Failed: `21`
- Primary blocker: database schema not migrated (`BlogPost.scheduledAt` missing in DB)

### Allied translation backfill dry-run (`npm run blog:backfill-allied-locales`)

- Apply mode: `false` (dry-run)
- Canonical rows scanned: `3`
- Locales queued: `fr, es, tl, hi, ja, ko, it, el, de`
- Dry-run generated count: `3 per locale` (27 total across sampled posts)
- Schema support at runtime: translation columns not yet present in DB (migration required before `--apply`)

## Acceptance Checklist

- [x] One shared blog engine used for nursing + allied schema/query/import.
- [x] Allied import path implemented with profession-aware assignment and status preservation.
- [x] Scheduled publish flow unified and cron-safe with `scheduledAt`/`publishAt`.
- [x] Locale-aware profession query layer implemented with source-locale fallback.
- [x] Allied translation backfill flow implemented (bounded, skip-existing, logged).
- [x] DB-backed allied blog routes implemented to replace static/stub precedence.
- [ ] Full production data migration applied and rerun imports/backfill in target DB.

## Blocking Items to Clear in Environment

- Apply Prisma migrations to the connected database before data execution:
  - `20260613120000_blogpost_scheduled_at`
  - `20260613123000_blogpost_profession_locale_translation`
- Re-run:
  - `npm run export:blog-json`
  - `npm run import:blog`
  - `npm run blog:backfill-allied-locales -- --apply --max-posts=<batch>`

