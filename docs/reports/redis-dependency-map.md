# Redis Dependency Map

**Generated:** 2026-06-01  
**Scope:** All production Redis consumers in `src/`

Redis is accessed through two client modules:
- **Primary:** `src/lib/server/redis.ts` → `@upstash/redis` SDK — used by `content-cache.ts` and `cache.ts`
- **Secondary:** `src/lib/cache/redis-content-cache.ts` → native `fetch` (Upstash) or `redis` TCP package — used by `manifest-loader.ts`

Both resolve the same `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` env vars.

---

## 1. Credential Login Rate Limiting

| Field | Value |
|-------|-------|
| **File** | `src/lib/server/credentials-login-rate-limit.ts` |
| **Client** | Primary (`getRedisClient`) |
| **Redis operations** | `INCR`, `EXPIRE`, `DEL` |
| **Keys** | `ratelimit:auth:credentials_login:combo:ip:{ip}:acct:{hash}` |
| **TTL** | 60 s (one fixed window) |
| **Required vs optional** | **Security-critical** |
| **Fallback behavior** | Process-local fixed-window limiter (added this sprint) at 60% of Redis limit, bounded to 2,000 buckets |
| **User impact if Redis unavailable** | Fallback limiter active — brute-force protection continues at reduced threshold; no user-visible change |

---

## 2. Lesson Content Cache

| Field | Value |
|-------|-------|
| **File** | `src/lib/lessons/app-subscriber-lesson-detail-resolve.ts` |
| **Client** | Primary (via `getLessonManifest`, `setLessonManifest`, `incrementReliabilityCounter`) |
| **Redis operations** | `GET`, `SET`, `INCR` |
| **Keys** | `content:lesson:manifest:{lessonId}`, `reliability:lesson:{tier}:{date}` |
| **TTL** | 60 min (lesson manifest), 8 days (reliability counters) |
| **Required vs optional** | Optional |
| **Fallback behavior** | Full DB join on every lesson detail load; reliability counters silently drop (dashboard shows zeros) |
| **User impact if Redis unavailable** | Lesson pages load correctly but slower; admin reliability dashboard shows no data |

---

## 3. Flashcard Hub Inventory Cache

| Field | Value |
|-------|-------|
| **File** | `src/lib/flashcards/build-flashcard-custom-session.ts` |
| **Client** | Primary (via `getFlashcardHubInventory`, `setFlashcardHubInventory`) |
| **Redis operations** | `GET`, `SET` |
| **Keys** | `content:flashcard:hub-inv:{pathwayId}:{tier}:{country}` |
| **TTL** | 30 min |
| **Required vs optional** | Optional |
| **Fallback behavior** | Full DB rebuild of category counts per request (expensive — queries Flashcard + ExamQuestion tables) |
| **User impact if Redis unavailable** | Flashcard hub loads correctly but with higher DB load per page view |

---

## 4. Flashcard Deck Cache

| Field | Value |
|-------|-------|
| **File** | `src/lib/server/content-cache.ts` (exported: `getFlashcardDeck`, `setFlashcardDeck`) |
| **Client** | Primary |
| **Redis operations** | `GET`, `SET` |
| **Keys** | `content:flashcard:deck:{deckId}` |
| **TTL** | 60 min |
| **Required vs optional** | Optional |
| **Fallback behavior** | DB query per flashcard deck access |
| **User impact if Redis unavailable** | Flashcard sessions load correctly; slightly higher DB load |

---

## 5. Adaptive Flashcard Bank Pool Cache

| Field | Value |
|-------|-------|
| **File** | `src/lib/server/content-cache.ts` (exported: `getFlashcardBank`, `setFlashcardBank`) |
| **Client** | Primary |
| **Redis operations** | `GET`, `SET` |
| **Keys** | `content:flashcard:bank:{userId}:{tier}` |
| **TTL** | 60 min |
| **Required vs optional** | Optional |
| **Fallback behavior** | DB query per flashcard session start |
| **User impact if Redis unavailable** | Flashcard sessions start correctly; DB query on every session |

---

## 6. Flashcard Session Recovery Cache

| Field | Value |
|-------|-------|
| **File** | `src/lib/study-content-failover/self-healing-flashcard-session-cache.ts` |
| **Client** | Primary (via `getFlashcardRecoverySession`, `setFlashcardRecoverySession`) |
| **Redis operations** | `GET`, `SET` |
| **Keys** | `content:flashcard:recovery-session:{sessionKey}` |
| **TTL** | 15 min |
| **Required vs optional** | Optional |
| **Fallback behavior** | L1 in-process Map only; sessions lost on process restart or scale-out |
| **User impact if Redis unavailable** | Flashcard session not recovered after deployment; learner restarts session |

---

## 7. Flashcard Due-Summary Cache

| Field | Value |
|-------|-------|
| **File** | `src/app/api/flashcards/due-summary/route.ts` |
| **Client** | Primary (via `getFlashcardDueSummary`, `setFlashcardDueSummary`) |
| **Redis operations** | `GET`, `SET` |
| **Keys** | `content:count:flashcard-due-summary:{userId}` |
| **TTL** | 10 min |
| **Required vs optional** | Optional |
| **Fallback behavior** | DB query per due-summary request |
| **User impact if Redis unavailable** | Spaced-repetition queue counts load correctly; slightly higher DB load |

---

## 8. Session Card ID Cache

| Field | Value |
|-------|-------|
| **File** | `src/lib/server/content-cache.ts` (exported: `getSessionCardIds`, `setSessionCardIds`) |
| **Client** | Primary |
| **Redis operations** | `GET`, `SET` |
| **Keys** | `content:count:session-ids:{userId}:{pathwayId}:{sourceKind}:{categories}` |
| **TTL** | 10 min |
| **Required vs optional** | Optional |
| **Fallback behavior** | Re-runs card ID selection query per session |
| **User impact if Redis unavailable** | Flashcard sessions load; DB query on each session build |

---

## 9. Study Queue Counts Cache

| Field | Value |
|-------|-------|
| **File** | `src/lib/flashcards/study-queue-segments.ts` |
| **Client** | Primary (via `getStudyQueueCounts`, `setStudyQueueCounts`) |
| **Redis operations** | `GET`, `SET` |
| **Keys** | `content:count:study-queue-counts:{userId}:{pathwayId}` |
| **TTL** | 10 min |
| **Required vs optional** | Optional |
| **Fallback behavior** | DB query per hub load |
| **User impact if Redis unavailable** | Study queue segment counts load correctly |

---

## 10. Weak-Area Flashcard Inventory Cache

| Field | Value |
|-------|-------|
| **File** | `src/lib/server/content-cache.ts` (exported: `getWeakInventory`, `setWeakInventory`) |
| **Client** | Primary |
| **Redis operations** | `GET`, `SET` |
| **Keys** | `content:count:weak-inv:{userId}:{pathwayId}` |
| **TTL** | 15 min |
| **Required vs optional** | Optional |
| **Fallback behavior** | Full Flashcard + FlashcardProgress scan per request |
| **User impact if Redis unavailable** | Weak-area flashcard mode loads; higher DB cost per session |

---

## 11. CAT Pool Cache

| Field | Value |
|-------|-------|
| **File** | `src/lib/practice-tests/cat-pool.ts` |
| **Client** | Primary (via `getCatPool`, `setCatPool`) |
| **Redis operations** | `GET`, `SET` |
| **Keys** | `content:cat:pool:{userId}:{pathwayId}` |
| **TTL** | 30 min |
| **Required vs optional** | Optional |
| **Fallback behavior** | Full question pool query per CAT session start |
| **User impact if Redis unavailable** | CAT starts correctly; pool build adds ~200–500 ms on first session |

---

## 12. CAT Readiness Cache

| Field | Value |
|-------|-------|
| **File** | `src/lib/practice-tests/cat-practice-readiness.ts` |
| **Client** | Primary (via `getCatReadiness`, `setCatReadiness`) |
| **Redis operations** | `GET`, `SET` |
| **Keys** | `content:cat:readiness:{userId}:{pathwayId}` |
| **TTL** | 10 min |
| **Required vs optional** | Optional |
| **Fallback behavior** | Re-runs readiness scan on every CAT session attempt |
| **User impact if Redis unavailable** | CAT eligibility check works; slightly higher DB load |

---

## 13. Practice Session Recovery Cache

| Field | Value |
|-------|-------|
| **File** | `src/app/api/practice-tests/route.ts` |
| **Client** | Primary (via `setPracticeSessionRecovery`, `getPracticeSessionRecovery`) |
| **Redis operations** | `GET`, `SET` |
| **Keys** | `content:practice:recovery-session:{userId}:{pathwayId}:{mode}` |
| **TTL** | 20 min |
| **Required vs optional** | Optional |
| **Fallback behavior** | Question selection re-runs on session recovery |
| **User impact if Redis unavailable** | Practice sessions start correctly; recovery after interruption re-runs selection |

---

## 14. Manifest Loader (Flashcard Inventory + Lesson Hub)

| Field | Value |
|-------|-------|
| **File** | `src/lib/server/manifest-loader.ts` |
| **Client** | **Secondary** (`cacheGet`/`cacheSet` from `redis-content-cache.ts`) |
| **Redis operations** | `GET`, `SET` |
| **Keys** | `manifest:flashcard-inv:{tier}:{country}:{pathway}:v1`, `manifest:lessons:hub:{tier}:{country}:v1`, `manifest:questions:discovery:{tier}:{country}:{pathway}` |
| **TTL** | 60 min (configurable per caller) |
| **Required vs optional** | Optional |
| **Fallback behavior** | Layer 2: reads from filesystem snapshot file. Layer 3 (if snapshot also missing): live DB query |
| **User impact if Redis unavailable** | Content loads from snapshot or DB — no user impact; only increased DB load on cold cache |

---

## 15. OSCE Station Cache

| Field | Value |
|-------|-------|
| **File** | `src/lib/scenarios/osce-stations-resolve.server.ts` |
| **Client** | Primary (via `cacheGet`, `cacheSet` from `content-cache.ts`) |
| **Redis operations** | `GET`, `SET` |
| **Keys** | `content:*` (pattern TBD by the caller) |
| **TTL** | Caller-defined |
| **Required vs optional** | Optional |
| **Fallback behavior** | DB query per OSCE station load |
| **User impact if Redis unavailable** | OSCE stations load correctly |

---

## 16. Reliability Counters (Admin Dashboard)

| Field | Value |
|-------|-------|
| **File** | `src/lib/server/content-cache.ts` (exported: `incrementReliabilityCounter`, `getReliabilityCounters`) |
| **Client** | Primary |
| **Redis operations** | `INCR`, `EXPIRE`, `GET` (multiple keys) |
| **Keys** | `reliability:{surface}:{tier}:{YYYY-MM-DD}` |
| **TTL** | 8 days |
| **Required vs optional** | Optional (admin observability only) |
| **Fallback behavior** | Counters not incremented; `getReliabilityCounters` returns `{}` |
| **User impact if Redis unavailable** | Admin reliability dashboard shows zero counts for all tiers/surfaces; no learner impact |

---

## 17. Flashcard API Route Cache

| Field | Value |
|-------|-------|
| **File** | `src/app/api/flashcards/route.ts` |
| **Client** | **Secondary** (`cacheGet`/`cacheSet` from `redis-content-cache.ts`) |
| **Redis operations** | `GET`, `SET` |
| **Keys** | Caller-defined |
| **TTL** | Caller-defined |
| **Required vs optional** | Optional |
| **Fallback behavior** | Direct DB query |
| **User impact if Redis unavailable** | Flashcards API responds correctly; no DB caching |

---

## Summary: Required vs Optional

| Consumer | Security-critical | Optional | Notes |
|---------|-----------------|---------|-------|
| Credential rate limiting | **Yes** | — | Now has process-local fallback (this sprint) |
| All other consumers | — | **Yes** | Silently degrade to DB queries |

**Only one Redis consumer is security-critical: credential login rate limiting.** Every other consumer is a performance optimization. Redis outages affect DB query load and admin observability, not correctness or security.

---

## User Impact Matrix (Redis Fully Down)

| Surface | Correct? | Slower? | Admin impact |
|---------|---------|--------|-------------|
| Credential login (auth) | ✅ protected | — | No |
| Lesson pages | ✅ | Slightly | No |
| Flashcard hub | ✅ | DB rebuild per load | No |
| Flashcard sessions | ✅ | DB query per start | No |
| Flashcard session recovery | ⚠️ lost on restart | — | No |
| CAT sessions | ✅ | Pool rebuild per start | No |
| Practice sessions | ✅ | Selection re-run on recovery | No |
| Manifest loader (flashcard/lesson/question counts) | ✅ (snapshot fallback) | Only on snapshot miss | No |
| OSCE stations | ✅ | DB query per load | No |
| Reliability dashboard | ✅ (no learner impact) | — | Shows zeros |

---

## Env Vars Summary

| Variable | Used by | Required |
|---------|---------|---------|
| `UPSTASH_REDIS_REST_URL` | `redis.ts` (primary), `redis-content-cache.ts` (secondary) | Security-recommended |
| `UPSTASH_REDIS_REST_TOKEN` | Same | Security-recommended |
| `REDIS_URL` | `redis-content-cache.ts` TCP fallback only | Optional (alternative to Upstash) |
| `NN_RL_FALLBACK_MAX_BUCKETS` | `credentials-login-rate-limit.ts` | Optional (default 2000) |
| `NN_RL_FALLBACK_RATIO` | `credentials-login-rate-limit.ts` | Optional (default 0.6) |
| `NN_CREDENTIALS_RL_COMBO_MAX` | `credentials-login-rate-limit.ts` | Optional (default 80) |
| `NN_CREDENTIALS_RL_STAFF_COMBO_MAX` | `credentials-login-rate-limit.ts` | Optional (default 480) |
