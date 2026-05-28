# NurseNest Resilience Architecture — Data Flow Documentation

> **Status:** Planning document — pre-implementation
> **Generated:** 2026-05-28

---

## Flashcard Session Data Flow

### Normal Path (DB Available, Redis Warm)

```
GET /api/flashcards?page=1
    │
    ├─ 1. Auth check (session cookie → JWT)
    ├─ 2. Entitlement check (requireSubscriberSession)
    ├─ 3. isCacheConfigured() → true
    │      cacheGet("flashcard:list:subscriber:page:1:size:20:locale:en")
    │      → HIT → return JSON (< 100ms)
    │
    └─ Response: { source_used: "cache", ... }
```

### Normal Path (DB Available, Cache Miss)

```
GET /api/flashcards?page=1
    │
    ├─ 1–3. Auth + entitlement + cache miss
    │
    ├─ 4. prisma.flashcard.findMany() via withRetry()
    │      → SUCCESS
    │
    ├─ 5. cacheSet(key, result, ttl=300)  [non-blocking]
    │
    └─ Response: { source_used: "primary", ... }
```

### Degraded Path (DB Down, Redis Warm)

```
GET /api/flashcards?page=1
    │
    ├─ 1–3. Auth + entitlement + cache HIT
    │
    └─ Response: { source_used: "cache", ... }
    (Learner never knows DB is down)
```

### Degraded Path (DB Down, Redis Cold, Snapshot Available)

```
GET /api/flashcards?page=1
    │
    ├─ 1–3. Auth + entitlement + cache MISS
    ├─ 4. prisma.flashcard.findMany() → throws (timeout / connection error)
    │      withRetry() exhausts 3 attempts
    ├─ 5. safeServerLogCritical("api_flashcards", "find_failed")
    ├─ 6. readFlashcardsSubscriberListSnapshot({ tier, country, locale })
    │      → reads STUDY_PUBLISHED_SNAPSHOT_DIR/flashcards/subscriber-list-*.json
    │      → envelope validation passes
    │
    ├─ 7. Emit: critical_study_load_diagnostics {
    │        source_used: "secondary",
    │        snapshot_age_ms: ...,
    │        failover_reason: "primary_db_failed"
    │      }
    │
    └─ Response: { source_used: "secondary", failover_reason: "primary_db_failed", snapshot_age_ms: ... }
    (Learner receives content — no interruption)
```

### Full Failure Path (Nothing Available)

```
GET /api/flashcards?page=1
    │
    ├─ DB down, cache cold, snapshot missing
    │
    ├─ Emit: critical_study_load_diagnostics {
    │        source_used: "none",
    │        final_outcome: "error"
    │      }
    │
    └─ Response: 503 { error: "...", code: "primary_and_snapshot_failed", retryable: true }
    (Client shows: "Temporarily unavailable — retrying...")
    (Service worker returns cached response if available)
```

---

## Lesson Data Flow

### Cache Keys

```
lesson:hub:{pathway}:{locale}                   — lesson hub list
lesson:content:{lessonId}:{locale}              — individual lesson body
lesson:hub:rn:en
lesson:hub:rpn:en
lesson:hub:np:fr
```

### Flow

```
GET /api/lessons?pathway=rn
    │
    ├─ 1. Auth (optional for freemium)
    ├─ 2. cacheGet("lesson:hub:rn:en") → HIT | MISS
    │
    │  [MISS]
    ├─ 3. prisma.pathwayLesson.findMany() via withRetry()
    │      → populate Redis on success
    │
    │  [DB FAILURE]
    ├─ 4. readPathwayLessonsHubSnapshot({ pathway: "rn", locale: "en" })
    │      → reads lessons/rn/hub.json
    │
    └─ Response (one of):
         { source_used: "cache" }
         { source_used: "primary" }
         { source_used: "secondary", snapshot_age_ms: ... }
         503 { retryable: true }
```

---

## Practice Question Data Flow

### Cache Keys

```
practice:pool:{pathway}:{topic}:{difficulty}    — question pool
practice:pool:rn:cardiovascular:mixed
practice:pool:rpn:pharmacology:medium
```

### Flow

```
GET /api/questions?pathway=rn&topic=cardiovascular&count=10
    │
    ├─ 1. Auth + entitlement
    ├─ 2. cacheGet("practice:pool:rn:cardiovascular:mixed")
    │
    │  [MISS]
    ├─ 3. prisma.examQuestion.findMany() via withRetry()
    │      → randomize selection from pool
    │      → cache pool (not selection, to preserve randomness)
    │
    │  [DB FAILURE]
    ├─ 4. readQuestionsSnapshotFile({ pathway: "rn", topic: "cardiovascular" })
    │      → reads questions/rn/cardiovascular/pool.json
    │      → shuffle client-side seed from userId + timestamp
    │
    └─ Response (one of):
         { source_used: "primary" }
         { source_used: "secondary", snapshot_age_ms: ... }
         503 { retryable: true }
```

---

## CAT Exam Data Flow

### Session Lifecycle — Normal Mode

```
POST /api/cat/sessions          → create session, write to DB + Redis
GET  /api/cat/{sessionId}/next  → fetch next question (CAT algorithm)
POST /api/cat/{sessionId}/answer → record answer, update θ estimate
GET  /api/cat/{sessionId}/result → compute final score + analytics
```

### Session Lifecycle — Resilience Mode

```
POST /api/cat/sessions
    │
    ├─ DB write fails
    │
    ├─ selectResiliencePool({ pathway: "rn", userId }) → "rn-pool-b"
    ├─ Load pool from snapshot: cat/rn-pool-b.json
    ├─ Store session in Redis only (TTL 4h)
    │
    └─ Response: { sessionId, mode: "resilience", poolId: "rn-pool-b" }

GET  /api/cat/{sessionId}/next
    │
    ├─ Load session from Redis
    ├─ Sequential pool traversal (no adaptive algorithm)
    └─ Response: { question, mode: "resilience" } → triggers CAT banner

POST /api/cat/{sessionId}/answer
    │
    ├─ Update session in Redis (answered count, score accumulator)
    ├─ Queue answer to IndexedDB for later sync
    └─ Response: { ok, mode: "resilience" }

GET  /api/cat/{sessionId}/result
    │
    ├─ Compute score from fixed-difficulty pool distribution
    ├─ Generate analytics (topic breakdown, difficulty breakdown)
    └─ Response: { score, analytics, mode: "resilience" }
```

### Pool Selection Algorithm

```
function selectResiliencePool(pathway: Pathway, userId: string): PoolId {
  const seed = hashStable(`${pathway}:${userId}:${getISODate()}`);
  const pools = POOL_IDS[pathway]; // ["rn-pool-a", "rn-pool-b", "rn-pool-c"]
  return pools[seed % pools.length];
}
```

---

## Offline / IndexedDB Sync Data Flow

### Offline Study Session

```
Learner goes offline
    │
    ├─ navigator.onLine = false
    ├─ Offline banner shown
    │
    ├─ Service worker intercepts API calls
    │      → Returns cached response from SW cache (network-first → cache fallback)
    │
    ├─ Answer submitted:
    │      POST /api/questions/grade → intercepted by SW
    │      → SW: write to IndexedDB queue
    │      → Queue entry: { type: "answer", payload: {...}, syncedAt: null }
    │
    ├─ Flashcard progress:
    │      POST /api/flashcards/progress → IndexedDB queue
    │
    └─ Lesson completion:
           POST /api/learner/progress → IndexedDB queue
```

### Reconnection and Sync

```
navigator.onLine = true (or periodic check)
    │
    ├─ sync-progress.ts runs:
    │      1. Read all unsynced records from IndexedDB
    │      2. Sort by createdAt (oldest first)
    │      3. For each record:
    │           POST /api/learner/sync-queue { records: [...] }
    │           On 200: mark syncedAt = Date.now()
    │           On 4xx: discard (stale/invalid)
    │           On 5xx: retry with backoff, max 3 attempts
    │      4. Purge synced records older than 7 days
    │
    └─ Offline banner dismissed
```

---

## Snapshot File Format

All snapshot files follow the existing `StudyPublishedSnapshotEnvelope<T>` schema:

```json
{
  "schema": "nursenest.study_snapshot.v1",
  "surface": "questions_practice_pack",
  "version": "2026-05-28T02:00:00Z-sha256:abcd1234",
  "capturedAt": "2026-05-28T02:00:00Z",
  "payload": {
    "pathway": "rn",
    "topic": "cardiovascular",
    "questions": [
      {
        "id": "q_abc123",
        "stem": "...",
        "options": [...],
        "correctIndex": 2,
        "rationale": "...",
        "hint": "...",
        "difficulty": 0.65,
        "topic": "cardiovascular",
        "examFamily": "NCLEX-RN"
      }
    ]
  }
}
```

### CAT Pool File Format

```json
{
  "schema": "nursenest.study_snapshot.v1",
  "surface": "cat_resilience_pool",
  "version": "2026-05-28T02:00:00Z-sha256:efgh5678",
  "capturedAt": "2026-05-28T02:00:00Z",
  "payload": {
    "poolId": "rn-pool-a",
    "pathway": "rn",
    "questionCount": 130,
    "difficultyMean": 0.50,
    "difficultyStdDev": 0.18,
    "topicDistribution": {
      "cardiovascular": 18,
      "pharmacology": 22,
      "respiratory": 15,
      "mental_health": 14,
      "maternal": 12,
      "pediatrics": 13,
      "leadership": 10,
      "other": 26
    },
    "questions": [...]
  }
}
```

---

## Redis Key Namespace

All content cache keys are prefixed with `nn:` to avoid collision with rate-limit keys:

```
nn:fc:list:{tier}:{country}:{locale}:p{page}:s{size}
nn:lesson:hub:{pathway}:{locale}
nn:lesson:content:{lessonId}:{locale}
nn:practice:pool:{pathway}:{topic}
nn:cat:session:{sessionId}
nn:cat:pool:{poolId}
```

Rate limit keys (existing, unchanged):
```
rl:{sha256(logicalKey)}
```
