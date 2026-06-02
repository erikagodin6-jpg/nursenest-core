# Phase 5D — Reliability Observability

**Date:** 2026-06-01  
**TypeScript:** 0 errors

---

## Architecture

### Counter storage: Redis INCR

Every tier hit increments a Redis key with this format:
```
reliability:{surface}:{tier}:{YYYY-MM-DD}
```

Examples:
```
reliability:flashcard:tier_b:2026-06-01  → 4821  (live generation successes today)
reliability:flashcard:tier_a:2026-06-01  → 312   (cache hits today)
reliability:lesson:tier_a:2026-06-01     → 1908  (lesson Redis manifest hits)
```

**Key TTL**: 8 days — preserves one full week plus buffer for the dashboard.

**Operation**: `INCR` is O(1) and non-blocking. A `void` call fires the counter without waiting for completion. Counter failures are silently swallowed — a Redis outage does not affect session delivery.

---

## Surfaces and tiers tracked

| Surface | Tier A | Tier B | Tier C | Tier D |
|---|---|---|---|---|
| `flashcard` | Session cache hit (pre-check + fallback) | Live generation success | Catalog snapshot served | All tiers exhausted |
| `practice` | (reserved) | Session creation success | (reserved) | (reserved) |
| `lesson` | Redis manifest cache hit | DB lookup success | (reserved) | (reserved) |

---

## Admin dashboard

### URL: `/admin/reliability`

**Displays:**
- 7-day aggregated recovery rate per surface (flashcard, practice, lesson)
- Per-surface: primary success rate, cache recovery rate, snapshot recovery rate, failure rate
- Daily breakdown table for flashcard tier counts
- In-process counter snapshot (resets on deployment)
- Tier legend

### Admin API: `GET /api/admin/reliability-metrics`

Returns JSON with:
```json
{
  "generatedAt": "2026-06-01T22:00:00Z",
  "windowDays": 7,
  "surfaces": {
    "flashcard": {
      "daily": { "2026-06-01": { "tier_a": 312, "tier_b": 4821, ... } },
      "totals": { "tier_a": 1823, "tier_b": 28411, "tier_c": 42, "tier_d_error": 11 },
      "primarySuccessRate": 93.3,
      "cacheRecoveryRate": 5.9,
      "snapshotRecoveryRate": 0.1,
      "failureRate": 0.036
    },
    "practice": { ... },
    "lesson": { ... }
  },
  "inProcessCounters": { "tier_a_precheck_hit": 812, ... }
}
```

---

## Key metrics

| Metric | Target | Alert if |
|---|---|---|
| Flashcard primary success rate | > 85% | < 75% |
| Flashcard failure rate | < 1% | > 3% |
| Lesson cache hit rate | > 30% (warm day) | < 5% (may indicate Redis down) |
| Practice session cache rate | > 10% (repeat users) | — |

---

## Files

| File | Role |
|---|---|
| `src/lib/server/content-cache.ts` | `incrementReliabilityCounter`, `getReliabilityCounters`, `ReliabilitySurface`, `ReliabilityTier` types |
| `src/lib/study-content-failover/self-healing-flashcard-session-cache.ts` | `recordFlashcardReliabilityCounter` (convenience wrapper), in-process `recoveryCounters` |
| `src/app/api/flashcards/custom-session/route.ts` | Increments counter at every flashcard recovery tier |
| `src/lib/lessons/app-subscriber-lesson-detail-resolve.ts` | Increments `lesson:tier_a` and `lesson:tier_b` |
| `src/app/api/practice-tests/route.ts` | Increments `practice:tier_b` on session creation success |
| `src/app/api/admin/reliability-metrics/route.ts` | Admin JSON API — reads 7-day counters |
| `src/app/(admin)/admin/reliability/page.tsx` | Admin dashboard page |
