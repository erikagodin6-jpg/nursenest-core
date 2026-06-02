# Redis Configuration Audit

Generated: 2026-06-02T02:45:54Z

## Verdict

Redis is configured and reachable in the accessible DigitalOcean production app. Local development is not actively configured because the Redis variables are present but empty. A separate staging app was not discoverable from the current DigitalOcean account/app list, so staging cannot be certified from available evidence.

## Environment Evidence

| Environment | Evidence | Status |
| --- | --- | --- |
| DigitalOcean production | App `nursenest-core-next`, component `web`, `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` present with `RUN_AND_BUILD_TIME` scope. Upstash REST `PING` returned HTTP 200 / `PONG`. | Pass |
| DigitalOcean staging | `doctl apps list` returned only `nursenest-core-next`; no separate staging app was visible. `.do/app.yaml`, `live-app-spec.yaml`, and `live-spec.yaml` do not contain Upstash Redis variables. | Not certified |
| Local development | `.env.local` contains both keys, but values are empty. `.env.example` also contains empty placeholders. `.env.playwright.local` and `.env.playwright.example` do not define them. | Missing active config |

## Safe Parse Results

No Redis token or full URL was printed.

| Source | URL present | Token present | URL parse | Reachability |
| --- | --- | --- | --- | --- |
| DigitalOcean production spec | yes | yes | valid HTTPS Upstash REST URL | `PING` OK |
| `.env.local` | key present | key present | empty value | not configured |
| `.env.example` | key present | key present | empty value | placeholder only |

## Runtime Cache Wiring

The application has two Redis helpers:

| Helper | File | Purpose | Fallback behavior |
| --- | --- | --- | --- |
| `getRedisClient()` | `src/lib/server/redis.ts` | Upstash JSON client and health state | returns `null` when Redis is absent or malformed |
| `cacheGet/cacheSet/cacheDel()` | `src/lib/server/content-cache.ts` | Shared content cache used by manifests and learner caches | no-op when Redis is not configured; no in-memory replacement |

## Changes Applied

| Surface | Change |
| --- | --- |
| Flashcard hub inventory API | Removed the per-user in-process `Map`; route now relies on Redis/snapshot/live manifest loading only. |
| Flashcards learner page bootstrap | Replaced direct live inventory bootstrap with the same Redis-first flashcard inventory manifest loader. |
| Lesson inventories | Confirmed `/api/lessons` already uses `loadWithManifest()` with `lessonManifestKey()`. |
| Pathway inventories | Confirmed shared manifest loader is Redis-first and backfills Redis from snapshots/live builders. |
| Flashcard session pool snapshot | Replaced process `Map` with Redis keys for lesson-derived virtual flashcard pool snapshots. |
| Flashcard exam-topic metadata | Replaced process `Map` with Redis-backed serialized entries. |
| Flashcard exam-bank row slices | Replaced process `Map` with Redis-backed row slices. |
| Flashcard access-scope memo | Replaced short-lived per-user process `Map` with Redis-backed hashed user cache keys. |
| Study plan cache | Wrapped `/api/study-plan` with the existing learner private read cache surface `study-plan-summary`; Redis is used when configured. |
| Analytics snapshots | Dashboard analytics private-read surfaces now use Redis when configured; non-dashboard private reads retain the existing Next cache path to avoid changing server-rendered `Date` object behavior. |

## Verification

| Check | Result |
| --- | --- |
| Production `/healthz` | HTTP 200 |
| Production Redis `PING` | HTTP 200 / `PONG` |
| `npm run typecheck:critical` | Pass |
| Secret exposure | No token or full Redis URL printed in reports |

## Open Items

1. Add actual staging Redis variables once a staging App Platform app/spec is available.
2. Populate local `.env.local` with non-production Upstash credentials if local Redis-backed cache behavior must be tested.
3. Deploy these code changes before running heap validation; the current production health probe only confirms the existing deployment is reachable.
