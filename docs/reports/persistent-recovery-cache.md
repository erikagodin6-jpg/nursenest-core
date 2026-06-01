# Phase 5A — Persistent Recovery Cache

**Date:** 2026-06-01  
**TypeScript:** 0 errors (verified after implementation)

---

## Decision: Upstash Redis

**Evaluated options:**

| Option | Assessment |
|---|---|
| Upstash Redis (INCR + GET/SET) | **Selected** — already configured (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`). No new infrastructure, no new vendor, no additional cost tier. |
| DigitalOcean Managed Redis | Requires provisioning a new service, network peering, and secret rotation. Not justified when Upstash already covers the use case. |
| Spaces-backed snapshot cache | High write latency (~150 ms per PUT vs. < 10 ms Redis SET). Suitable for large payloads but not for per-session recovery data. |
| KV storage (Vercel/Cloudflare) | Not compatible with Railway deployment target. |

---

## Architecture

```
Request → GET /api/flashcards/custom-session
              │
              ▼
     [L1] in-process Map (< 1 ms)
              │ miss
              ▼
     [L2] Upstash Redis (< 10 ms)
              │ hit → populate L1 → serve
              │ miss
              ▼
     [Live generation / Tier B]
              │ success
              ▼
     setSelfHealingSessionCache(key, value)
        │
        ├── L1 Map.set(key, {value, expiresAt: now + 15min})
        └── Redis.set(key, value, ex: 900)  [fire-and-forget]
```

---

## What was built

### `src/lib/server/content-cache.ts` additions

| Function | Purpose |
|---|---|
| `flashcardSessionRecoveryCacheKey(sessionKey)` | Redis key builder: `content:flashcard:recovery-session:{key}` |
| `getFlashcardRecoverySession<T>(sessionKey)` | Redis GET with 15-min TTL |
| `setFlashcardRecoverySession<T>(sessionKey, value)` | Redis SET with 15-min TTL |
| `practiceSessionRecoveryCacheKey(userId, pathwayId, mode)` | Redis key for practice question ID sets |
| `getPracticeSessionRecovery<T>(...)` | Redis GET — question ID set |
| `setPracticeSessionRecovery<T>(...)` | Redis SET, 20-min TTL |
| `lessonManifestRecoveryCacheKey(lessonId)` | Redis key: `content:lesson:manifest:{lessonId}` |
| `getLessonManifest<T>(lessonId)` | Redis GET — full lesson record |
| `setLessonManifest<T>(lessonId, value)` | Redis SET, 60-min TTL |
| `invalidateLessonManifest(lessonId)` | Redis DEL — called on admin publish |
| `incrementReliabilityCounter(surface, tier)` | Redis INCR + EXPIRE for dashboard counters |
| `getReliabilityCounters(surface, daysBack)` | Redis GET per-day counters |

### `src/lib/study-content-failover/self-healing-flashcard-session-cache.ts`

- `getSelfHealingSessionCache` changed to `async` — checks L1 (in-process Map), then L2 (Redis)
- `setSelfHealingSessionCache` — writes both L1 and L2 (Redis fire-and-forget)
- Added `recordFlashcardReliabilityCounter` wrapper for dashboard counter increments
- TTL extended from 3 min → 15 min (all callers updated)

### Route: `src/app/api/flashcards/custom-session/route.ts`

- All `getSelfHealingSessionCache` calls updated to `await`
- Reliability counter increments wired at every tier path

---

## Session composition stored

Each Redis entry stores the complete `BuildFlashcardCustomSessionSuccess` object:

| Field | Contents |
|---|---|
| `summary.pathwayId` | Pathway identifier |
| `summary.selectedCategories` | Body system filter |
| `summary.weakOnly`, etc. | Progress filter flags |
| `summary.mode` | Study mode |
| `summary.returnedCards` | Number of cards served |
| `cards[]` | Full serialized card array (up to 8 initial) |
| `categoryOptions[]` | Builder category breakdown |

**TTL:** 15 minutes — matches in-process L1 TTL.

---

## TTL summary

| Surface | Redis TTL | In-process TTL |
|---|---|---|
| Flashcard session recovery | 15 min | 15 min |
| Practice question ID set | 20 min | N/A (was already Redis-only) |
| Lesson manifest | 60 min | N/A |
| Reliability counters | 8 days | Reset on process restart |

---

## Deployment survival

Previously: session cache lost on every deployment (in-process Map cleared).  
Now: L2 Redis survives deployment, instance restart, and horizontal scale-out.

A user who launched flashcards 12 minutes ago will still get an instant cache hit (Tier A pre-check) after a zero-downtime rolling deployment — their session is in Redis.
