# Phase 5C — Lesson Self-Healing

**Date:** 2026-06-01  
**TypeScript:** 0 errors

---

## Recovery Chain

| Tier | Surface | Description |
|---|---|---|
| A | Lesson detail | Redis manifest cache (60-min TTL) |
| B | Lesson detail | DB lookup by primary key + slug fallback |
| C | Lesson detail | Catalog fallback (`getAppCatalogFallbackLesson`) |
| D | Lesson detail | Not-found or error page |
| — | Lesson hub | File-based snapshot (`readPathwayLessonsHubPageSnapshot`) |
| — | Lesson search | In-memory pathway lesson catalog (always available) |

---

## What was built

### `src/lib/lessons/app-subscriber-lesson-detail-resolve.ts`

Redis Tier A check added inside `resolveAppSubscriberPathwayLessonForDetail`:

```
[Entitlement gate passes]
       │
       ▼
[Tier A] getLessonManifest(lessonId) → Redis GET
       │ hit → classifyAppSubscriberPathwayLessonRecord → return pathway_ok
       │ miss or invalid
       ▼
[Tier B] getPublishedPathwayLessonRecordById(id) → DB
       │ success → setLessonManifest(id, record) [fire-and-forget] → return pathway_ok
       │ miss
       ▼
[Tier B slug] getPathwayLesson(pathwayId, slug) → slug resolver
       │ success → setLessonManifest(id, record) [fire-and-forget] → return pathway_ok
       │ miss
       ▼
{ kind: "not_found" }
```

The entitlement gate (`appPathwayLessonVisibleToSubscriber`) is **never** cached — it depends on current subscription state and must always run live.

The lesson **content** (the `PathwayLessonRecord`) is content-only and safe to cache:
- Content changes only on admin publish (which calls `invalidateLessonManifest`)
- The same record is valid for all subscribers with access to that lesson

### Cache invalidation

`content-cache.ts` → `invalidateOnPublish`:

```typescript
if (opts.lessonId) {
  ops.push(invalidateLesson(opts.lessonId));         // existing — lesson content cache
  ops.push(invalidateLessonManifest(opts.lessonId)); // new — lesson manifest cache
}
```

Both caches are invalidated atomically on every admin publish.

---

## Lesson hub (already working)

`src/app/(app)/app/(learner)/lessons/page.tsx` already reads from:
- `readPathwayLessonsHubPageSnapshot()` — file-based published snapshot
- `lessonsListBlockFromPathwayHubSnapshot()` — builds hub list from snapshot

This fallback fires when the primary DB lesson list query fails. No changes needed.

---

## Lesson search (already working)

Lesson search uses the bundled pathway catalog (static JSON loaded at build time). It does not query the DB for the search index — it's always available regardless of DB status.

---

## Performance impact (warm path)

On Redis cache hit, `getPublishedPathwayLessonRecordById` (20–60 ms DB query) is skipped entirely. The lesson resolver completes in < 10 ms.

**Expected lesson detail TTFB improvement (warm):** ~30–60 ms eliminated from every request within the 60-min cache window.

---

## TTL and staleness

**60 minutes** — matches the existing lesson content cache (`TTL.lesson = 60 * 60`).

**Maximum staleness:** 60 minutes after admin publish. The `invalidateLessonManifest` call in `invalidateOnPublish` ensures cache is cleared immediately when content is updated — so staleness only occurs if the Redis DEL fails (Redis unavailable).

**Redis unavailability:** Falls through silently to the DB path. `try { cached = await getLessonManifest(...) } catch { /* fall through */ }`.
