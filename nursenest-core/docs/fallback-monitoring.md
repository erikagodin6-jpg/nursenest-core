# Fallback and degradation monitoring

This document lists **structured server log events** used when marketing hubs, lessons, CAT coaching, or metadata generation degrade gracefully. Logs use the prefix `[nursenest-core]` and JSON payloads on stderr (visible in Vercel/host logs and log drains).

## Core events

| Event | Scope | Meaning |
|-------|--------|---------|
| `route_render_fallback_used` | `route_fallback` | A single degraded render path was taken (empty snapshot, zero lesson count, hub load failure, CAT coach fallback, etc.). Includes `fallback_type`, optional `pathname`, `pathway_id`, `dependency_name`, `cumulative_fallback_count`. |
| `route_render_heavily_degraded` | `route_fallback` | **Three or more** fallbacks in one RSC request — page may render but multiple subsystems failed. Inspect `fallback_types` and `cumulative_fallback_count`. |
| `hub_data_load_failed` | `exam_pathway_hub` | Optional hub data (snapshots, lessons, topics) failed; UI uses safe defaults. Includes `dependency_name` / `dependency` and `error_message`. |
| `hub_data_load_timeout` | `exam_pathway_hub` | Same as above but task hit the hub optional timeout (~14s). |
| `metadata_generation_failed` | `metadata` | `generateMetadata` threw; `safeGenerateMetadata` returned site fallback. Includes `route_group`, `pathname`, `detail`. |
| `learner_copy_context_mismatch` | `learner_copy` | Heuristic: pathway-scoped copy may reference the wrong country/exam (logged only; does not block render). |
| `invalid_navigation_target_blocked` | (client `console.error` + optional PostHog) | User clicked a hub link that failed pathway URL validation; navigation was prevented. |

### Common `fallback_type` values

- `empty_question_snapshot` — question bank snapshot unavailable or load failed.
- `zero_lesson_count_fallback` — lesson count task failed; count treated as zero.
- `topic_cluster_ui_degraded` — topic cluster list failed; hub shows without clusters.
- `hub_data_load_failed` — explicit dependency failure (see `dependency_name`).
- `lesson_link_mismatch_suppressed` / `cat_coach_fallback` / `cat_coach_enrich_failed` — CAT / study feedback paths (see `src/lib/practice-tests/*`).

## How to interpret volume

- **Spikes in `hub_data_load_failed`** for the same `dependency_name` and `pathway_id` → database, timeout, or upstream cache issue.
- **Steady `route_render_fallback_used` with `empty_question_snapshot`** on many pathways → DB or Prisma connectivity, or snapshot cache errors.
- **`route_render_heavily_degraded` on specific pathnames** → investigate that route’s data dependencies first (often cold DB + parallel optional loads).
- **`metadata_generation_failed`** → bug or bad data in metadata builders; fix the inner `generateMetadata` logic; fallback title/description are generic but safe.

## Thresholds (rule of thumb)

- **Investigate** if `route_render_heavily_degraded` appears more than rarely for production traffic to the same pathname.
- **Investigate** if `hub_data_load_failed` exceeds baseline for `question_snapshot` or `lesson_count` after a deploy or infra change.
- **Single** `route_render_fallback_used` per request is often expected under load (e.g. one optional task timing out).

## Debugging specific flows

### `hub_data_load_failed`

1. Note `dependency_name` (`question_snapshot`, `lesson_count`, `getRelatedPathwayLessons`, `listTopicClusters`, etc.).
2. Check DB health, Prisma errors, and `pathway_question_bank_snapshot` cache (see `pathway-question-bank-snapshot.ts`).
3. Reproduce locally with the same `pathname` and pathway id.

### `pathway_resolution_failed`

Search logs for this string in `resolve-exam-pathway-safe` and related callers — usually invalid or obsolete URL segments; user gets `notFound()` rather than a broken hub.

### Fallback overuse

1. Filter logs for `route_render_heavily_degraded`.
2. Correlate timestamp with deploys, DB incidents, or traffic spikes.
3. Reduce parallel optional work or increase resilience for the dependencies listed in `hub_data_load_failed` for that window.

## Where logs appear

- **Local:** dev server stderr.
- **Vercel / DO:** platform log stream for the Node/Next runtime.
- **Sentry:** only events explicitly wired through `safeServerLogCritical` (most fallback events are stderr-only).

## Extending coverage

- Wrap new `generateMetadata` implementations with `safeGenerateMetadata` from `src/lib/seo/safe-marketing-metadata.ts` and pass a stable `routeGroup`.
- When adding optional server loads for hubs, call `recordRouteRenderFallback` for user-visible fallbacks and log with `hub_data_load_failed` on errors.
