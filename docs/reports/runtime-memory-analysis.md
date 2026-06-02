# Runtime Memory Analysis

Generated: 2026-06-01

## Evidence Used

- `docs/reports/do-origin-health-investigation.md`
- `docs/reports/origin-capacity-test.md`
- `reports/origin-black-box-recorder/*.jsonl`
- Fresh low-pressure route profile.

## Observations

| Item | Evidence |
| --- | --- |
| Startup / idle | Black-box recorder startup parent RSS ~45-48 MB; child Next runtime RSS around ~44-72 MB during initial boot samples. |
| Warm child runtime | Black-box recorder child runtime samples around ~379-382 MB RSS after route handlers are ready. |
| Under crawl load | Prior crawl at 1,000 URLs / concurrency 12 led to unhealthy upstream and process replacement, with component exit code `128` recorded in the origin investigation. |
| Health behavior | At rest health endpoints return 200. After crawl overload, `/healthz` and `/readyz` returned 504 or timed out. |
| Payload pressure | Fresh public route payloads: homepage 892 KB, lessons 1.59 MB, question bank 1.58 MB, flashcards 1.58 MB, NP route 1.64 MB, localized routes 3.15-3.19 MB, blog detail 1.68 MB. |

## Memory Risk Factors

1. Large public RSC/HTML payloads create repeated serialization and allocation pressure under crawler concurrency.
2. Cold ISR/cache misses across thousands of unique URLs reduce cache reuse and increase concurrent render memory.
3. DB fallbacks and timeouts do not cancel all underlying work, so timed-out requests can leave in-flight Prisma work competing with new requests.
4. Single-instance hosting means a memory or readiness failure creates zero healthy upstreams.

## Heap Configuration

Previous investigation found production was on a 2 GB `basic-s` instance while `NODE_OPTIONS` allowed `--max-old-space-size=4096`. The runtime was updated to clamp old-space via `NODE_MAX_OLD_SPACE_SIZE_MB=768`.

That mitigation reduces OOM risk but does not solve crawl capacity: the recovery test still failed at 500 URLs / concurrency 12.

## Leak Assessment

No definitive memory leak was proven by the current artifacts. The stronger evidence points to saturation:

- High per-route payload size.
- Many cold public URLs hit concurrently.
- Long-running request/render/DB work.
- Single origin instance with no spare capacity.

## Required Measurements Before Certification

- RSS and heap used at startup, idle, and every 10s during 100/500/1,000/2,000 crawl tests.
- GC pause/frequency logs under load.
- In-flight request count and render duration histogram.
- Prisma queue depth and DB pool wait time.
- Container restart count from DigitalOcean during each test window.

## Runtime Verdict

Runtime stability is not certified. The current incident shape is consistent with saturation and possible memory pressure under sustained crawl load, not with a simple broken route.

