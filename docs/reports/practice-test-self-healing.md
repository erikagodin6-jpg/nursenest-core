# Phase 5B — Practice Test Self-Healing

**Date:** 2026-06-01  
**TypeScript:** 0 errors

---

## Recovery Chain

| Tier | Description | Trigger |
|---|---|---|
| A | Redis question ID cache | On session creation failure, or before expensive re-selection on repeat launch |
| B | Live generation (DB write) | Every new session creation attempt |
| C | Static question fallback (`NCLEX_PN_GAP_QUESTIONS`) | When question fetch fails for individual question |
| D | Hard failure (503) | All tiers exhausted |

---

## Architecture difference from flashcards

Practice test sessions are **DB-persisted entities** (`PracticeTest` row). Unlike flashcard sessions (fully in-memory server side), a practice test requires a database write to exist. Self-healing for practice tests operates at two levels:

1. **Question selection** (expensive): `pickPracticeQuestionIds` / `createCatPracticeTestPayload` — can be cached
2. **Session creation** (DB write): `prisma.practiceTest.create` — cannot be cached; requires DB

**Implication:** If the DB is completely down, new practice test sessions cannot be created. Tier A recovery covers the question selection cost, not the DB write. Tier C covers individual question delivery failures (not session creation).

---

## What was built

### `src/app/api/practice-tests/route.ts`

**CAT session success path** (after `prisma.$transaction` → `created`):
```typescript
void setPracticeSessionRecovery(
  gate.userId,
  pathwayIdForCat,
  d.selectionMode,
  { questionIds: cat.questionIds, config: row.config, cachedAt: ... },
);
void incrementReliabilityCounter("practice", "tier_b");
```

**Linear session success path** (after `prisma.practiceTest.create`):
```typescript
void setPracticeSessionRecovery(
  gate.userId,
  d.pathwayId?.trim() || null,
  d.selectionMode,
  { questionIds: picked.ids, config, cachedAt: ... },
);
void incrementReliabilityCounter("practice", "tier_b");
```

Both writes are **fire-and-forget** — the session creation response is not delayed.

### Cache key structure

`content:practice:recovery-session:{userId}:{pathwayId}:{selectionMode}` (20-min TTL)

The cached value stores:
- `questionIds: string[]` — the selected question IDs
- `config: PracticeTestConfigJson` — the session configuration
- `cachedAt: string` — ISO timestamp for staleness checking

### Existing Tier C (individual question fallback)

`src/lib/study-content-failover/practice-test-question-static-fallback.server.ts` was already built:
- Activates when `GET /api/practice-tests/[id]/question` cannot serve a question from DB
- Returns a representative question from `NCLEX_PN_GAP_QUESTIONS`
- Best-effort topic matching (matches by `topic`, `domain`, `weakAreaTag`)
- Question is marked with `_isFallback: true` — client can display in degraded mode

---

## Recovery coverage

| Failure scenario | Recovery |
|---|---|
| Question selection slow (> 3 s) | Tier A cache available on next attempt within 20 min |
| DB write fails during create | No Tier A recovery — new session cannot be created without DB |
| Question fetch fails mid-session | Tier C (static question fallback) |
| DB completely down | User can resume existing in-progress sessions; cannot create new ones |

---

## Remaining gap

Full session-level offline recovery (when DB is down and no existing session exists) requires serving a pre-built "offline exam" that does not depend on a DB row. This would require:

1. A pre-generated exam payload stored in Redis or Spaces at session-create time
2. A client-side session hydration path that reads from the pre-generated payload
3. A server-side endpoint that serves questions from the pre-generated payload without a DB row

This is the next phase of practice test resilience (Phase 6B).
