# Redis Heap Validation

Generated: 2026-06-02T02:45:54Z

## Final Verdict

**CONDITIONAL PASS**

Redis activation is implemented for the identified heap-retaining cache paths, production Redis is reachable, and compile validation passes. The heap leak success criteria are not fully certified yet because the 90-minute post-deploy production simulation has not been run against a deployment containing these changes, and the current production health endpoints do not expose heap used, heap total, cache size, or GC activity.

## What Changed

| Area | Before | After |
| --- | --- | --- |
| Flashcard inventory API | Per-user process `Map` with 2-minute TTL and max 2,000 entries | Redis/snapshot/live manifest path only; no local inventory `Map` |
| Flashcards page bootstrap | Direct live inventory loader during server render | Redis-first manifest loader with snapshot/live fallback |
| Lesson-derived flashcard pool snapshot | Process `Map` per pathway | Redis key `flashcards:pool-snapshot:*` |
| Exam-topic metadata | Process `Map` per pathway containing question metadata | Redis key `flashcards:exam-topic-meta:*` |
| Exam-bank flashcard rows | Process `Map` of pathway/topic/cap row slices | Redis key `flashcards:exam-pool-rows:*` |
| Access-scope memo | Process `Map` of per-user pathway access scope | Redis key with hashed user segment |
| Study plan API | Live plan build per request | Redis-backed learner private cache surface `study-plan-summary` |
| Dashboard analytics snapshots | Next private read cache only | Redis for dashboard analytics surfaces when configured |

## Configuration Evidence

| Check | Result |
| --- | --- |
| DigitalOcean production Redis env vars | Present |
| Upstash REST URL shape | Valid HTTPS URL |
| Upstash REST token | Present |
| Upstash `PING` | HTTP 200 / `PONG` |
| Local Redis values | Keys present but empty |
| Staging Redis values | Not certified; no separate staging app visible |

## Verification Run

| Verification | Result |
| --- | --- |
| `npm run typecheck:critical` | Pass |
| Production `/healthz` | HTTP 200 |
| Search for removed hot-path process caches | No `inventoryCache`, `examPoolRowCache`, `_accessMemoMap`, pool `snapshots` process Map, or `examTopicMetaCache` process Map remains in the edited flashcard hot-path files |

## 90-Minute Simulation Status

The requested 90-minute production simulation was **not completed** in this turn.

Reason:

1. The code changes have not yet been deployed to production, so a production run would measure the old bundle.
2. The exposed production health endpoints currently return liveness/readiness only; they do not expose RSS, heap used, heap total, cache size, or GC activity.
3. DigitalOcean app discovery confirmed production reachability, but no heap/GC sampling endpoint or authenticated runtime metrics feed was available from this shell.

## Measurement Matrix

| Metric | Before Redis | After Redis | Status |
| --- | --- | --- | --- |
| RSS growth over 90 minutes | Not measured in prior report | Not measured post-change | Not certified |
| Heap used growth | Not measured in prior report | Not measured post-change | Not certified |
| Heap total growth | Not measured in prior report | Not measured post-change | Not certified |
| Cache size | In-process hot-path Maps existed by source evidence | Redis keys replace the identified Maps | Source-verified |
| GC activity | Not measured | Not measured | Not certified |
| Restart count | Not measured | Not measured | Not certified |
| Response time | Not measured for post-change deployment | Not measured | Not certified |
| Cache hit rate | Not measured | Not measured | Not certified |

## Required Post-Deploy Certification Run

After deployment, run a 90-minute production-mode simulation with runtime memory diagnostics enabled and sample every 5 minutes:

| Requirement | Needed Evidence |
| --- | --- |
| RSS | Process RSS MB per sample |
| Heap used | `process.memoryUsage().heapUsed` per sample |
| Heap total | `process.memoryUsage().heapTotal` per sample |
| Cache size | Redis key count or namespaced cache sample counts |
| GC activity | Node GC events or heap sawtooth evidence |
| Restart count | DigitalOcean app deployment/runtime restart count |
| Response time | p50/p95/p99 for flashcards, lessons, study plan, dashboard |
| Cache hit rate | Redis hit/miss headers or cache telemetry |

## Success Criteria Status

| Criterion | Status |
| --- | --- |
| RSS growth less than 20% | Not certified |
| No OOM restart | Not certified |
| No continuous heap accumulation | Not certified |
| Redis-backed caching active for target hot paths | Source-verified and typechecked |

## Conclusion

Redis is now the active cache mechanism for the identified flashcard/session/study-plan/dashboard analytics hot paths when configured, and the specific in-process Maps most likely to retain heap under load were removed or bypassed. The memory leak itself is not certified as fixed until the post-deploy 90-minute run records RSS/heap/GC samples from the updated production bundle.
