# Release safety checks

Commands and scripts that catch config drift, broken marketing routes, and unsafe data shapes **before** production deploys. They do not change product URLs, CAT math, or scoring.

**Runtime E2E / health / paid-access gate:** see **[`RELEASE_QA.md`](./RELEASE_QA.md)** (`npm run qa:release-gate`). **Post-deploy smoke / user journeys:** **[`release-verification.md`](./release-verification.md)** (`npm run qa:verify:production`).

## Recommended pre-push / pre-deploy

```bash
cd nursenest-core
npm run validate:release
```

This runs, in order:

1. **`npm run typecheck`** — TypeScript compile without emit.
2. **`npm run validate:content`** — Registry + marketing hub path + English `nav.examStrip.*` keys + duplicate pathway routes (see below).
3. **`npm run validate:programmatic-seo`** — Programmatic SEO registry consistency.
4. **`npm run validate:exam-guardrails`** — Pathway-scoped catalog slices vs cross-country terminology (see `scripts/validate-exam-content-guardrails.mjs`).
5. **`npm run test:release-safety`** — Route integrity (exam hubs, CAT entry links), hub fallback shapes, `PracticeTest.config` boundary parsing, route fallback tracker smoke, production i18n missing-key fallback.
6. **`npm run test:internal-links-audit`** — Validator unit tests for internal path rules.

## Individual scripts

| Command | What it checks | Blocking? |
|--------|----------------|------------|
| `validate:content` | `EXAM_PATHWAYS` id uniqueness, duplicate `country/role/exam` routes, `buildExamPathwayPath` well-formed hubs, `marketingExamPrepHubs` + `publicMarketingCatHrefForOffering`, required English nav strip keys, forbidden `mock exam` phrasing under `nav.examStrip.*` | **Yes** — exits 1 on failure |
| `validate:exam-guardrails` | Pathway-scoped lesson catalog JSON vs forbidden cross-exam phrases | **Yes** — exits 1 on violation |
| `test:marketing-exam-hub-smoke` | HTTP smoke + degraded markers against a **running** server (`MARKETING_HUB_SMOKE_BASE`) | Optional CI / manual |
| `audit:internal-links` / `audit:lesson-links` | Broader link audits (may need DB or server) | Operational |

## Runtime protections (not re-run by `validate:release`)

- **`parsePracticeTestConfigAtBoundary`** — Zod validation when reading `PracticeTest.config` from APIs and key server pages; invalid JSON logs `practice_test_config_invalid` and merges safe defaults.
- **`loadMarketingExamHubOptionalBlocks` / `loadPathwayLessonsHubAggregates`** — Per-task timeouts (~14s) with `hub_data_load_timeout` / `hub_data_load_failed` logs; failures fall back to empty inventory / snapshots.
- **`withDatabaseFallbackTimeout`** — Optional structured logs (`database_read_timeout` / `database_read_error`) when `logCtx` is passed (e.g. pathway lesson DB calls).
- **`filterHubListItemsForSafeSlugs`** — Drops pathway lesson list rows that fail `pathwayLessonHasRenderableHubSlug`; logs `pathway_lesson_hub_slug_unsafe`.
- **`safeGenerateMetadata`** (`src/lib/seo/safe-marketing-metadata.ts`) — Wraps `generateMetadata` implementations so resolver errors return a generic title/description and log `metadata_generation_failed` (includes `route_group`). Exam hub routes use distinct `routeGroup` labels (e.g. `marketing.exam_hub.lessons`).
- **`recordRouteRenderFallback`** — Per-request degraded render accounting; emits `route_render_fallback_used` and `route_render_heavily_degraded` when many fallbacks stack. See **`docs/fallback-monitoring.md`**.
- **`formatMarketingMessage`** — In production, missing keys return a short humanized fallback and emit a structured JSON line to stderr for log drains; dev still shows `[missing:…]`.
- **`trackClientEvent`** — No-ops on the server and when `NEXT_PUBLIC_POSTHOG_KEY` is unset.

## What failures mean

- **`validate:content`**: Fix registry duplicates, broken hub hrefs, or missing/invalid English nav keys before shipping. These are **blocking** for consistent exam navigation.
- **`test:release-safety`**: A failure usually means a new link bypassed `marketing-exam-navigation` helpers, or a config schema regression.
- **`test:internal-links-audit`**: Validator rules or allowed patterns need updating if you intentionally add new route shapes.

## Safe degradation vs must-fix

| Situation | Policy |
|-----------|--------|
| Hub optional block timeout / DB fallback | **Degraded** — page should still render with empty counts; investigate if frequent. |
| Invalid persisted `PracticeTest.config` | **Logged** — session loads with safe defaults; investigate data corruption. |
| Quarantined lesson slug | **Degraded** — card hidden; fix content row. |
| Missing i18n key (production) | **Degraded** — humanized placeholder; fix translation bundle. |

## Related docs

- `docs/fallback-monitoring.md` — Fallback and degradation log events, thresholds, debugging.
- `docs/internal-link-audit.md` — Internal link audit philosophy.
- `docs/i18n-architecture.md` — Marketing locale and bundle build.
