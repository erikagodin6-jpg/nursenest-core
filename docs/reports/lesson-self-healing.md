# Lesson Self-Healing — Phase 3

**Verified:** 2026-06-01  
**Status:** ✅ Already resilient — verified and documented

---

## Summary

Lessons are the **most resilient surface** on the platform. They are served primarily from static JSON catalog files via `readFileSync` — no database query is required for lesson content delivery. This means DB outages do not block lesson access.

---

## Three-Source Architecture (Already Implemented)

```
User requests a lesson
│
├── Source 1: Static catalog (readFileSync) ───────────────────
│   • catalog.json, np-core-catalog.json, 20+ expansion catalogs
│   • Served via pathway-lesson-catalog-sync.ts
│   • Zero DB dependency — available always
│   • Coverage: All pathway catalog lessons
│
├── Source 2: DB-stored lesson (PathwayLesson table) ──────────
│   • Admin-published or AI-expanded lessons in the database
│   • Wrapped with withDatabaseFallbackTimeout(900ms)
│   • If DB slow/unavailable → falls through to Source 3
│
└── Source 3: Published snapshot (STUDY_PUBLISHED_SNAPSHOT_DIR) ─
    • Pre-generated JSON files written by export jobs
    • Format: StudyPublishedSnapshotEnvelope<T> (versioned)
    • Read by: readPathwayLessonsHubPageSnapshot()
    • Path: lessons-hub/{pathwayId}/{locale}/p{page}-s{size}-{key}.json
```

---

## File Evidence

| File | Role | DB Dependency |
|---|---|---|
| `src/lib/lessons/pathway-lesson-catalog-sync.ts` | Serves catalog lessons via `readFileSync` | None |
| `src/lib/lessons/app-lessons-catalog-fallback.ts` | Maps catalog: URLs to lesson records | None |
| `src/app/(app)/app/(learner)/lessons/page.tsx` | Hub page with `withDatabaseFallbackTimeout` + snapshot fallback | Optional |
| `src/app/(app)/app/(learner)/lessons/[id]/page.tsx` | Detail page with catalog fallback via `parseAppLessonCatalogFallbackId` | Optional |
| `src/lib/study-content-failover/pathway-lessons-hub-snapshot-read.ts` | Reads pre-generated lesson hub snapshots | None |

---

## Failure Scenario Matrix

| Scenario | Lesson Hub | Lesson Detail | Recovery |
|---|---|---|---|
| DB unavailable, snapshot configured | Snapshot served | Catalog lesson served | ✅ Transparent |
| DB unavailable, no snapshot | Catalog lessons served | Catalog lesson served | ✅ Transparent |
| DB slow (>900ms) | Snapshot served (fallback timer fires) | Catalog lesson served | ✅ Transparent |
| Static files corrupted | Deploy artifact is corrupt | Same | ❌ Requires rollback |
| DB unavailable, lesson only in DB (non-catalog) | 404 or hub without that lesson | 404 | ⚠️ Expected — lesson not in catalog |

---

## How Catalog Lesson URLs Work

When a user visits `/app/lessons/catalog:us-lpn-nclex-pn:us-pn-dvt-deep-vein-thrombosis`, the page:

1. Calls `parseAppLessonCatalogFallbackId("catalog:us-lpn-nclex-pn:us-pn-dvt-deep-vein-thrombosis")`
2. Gets `{ pathwayId: "us-lpn-nclex-pn", slug: "us-pn-dvt-deep-vein-thrombosis" }`
3. Calls `getAppCatalogFallbackLesson("us-lpn-nclex-pn", "us-pn-dvt-deep-vein-thrombosis")`
4. Returns the static lesson record — **no DB required**

All 24 gap-closure lessons added in the blueprint batch are reachable via this URL pattern without DB access.

---

## Verification: New Lesson Reachability Without DB

All new lessons can be loaded via their catalog URL:

| Lesson | Catalog URL pattern | DB-free? |
|---|---|---|
| DVT | `catalog:us-lpn-nclex-pn:us-pn-dvt-deep-vein-thrombosis` | ✅ |
| Preeclampsia | `catalog:us-rn-nclex-rn:us-rn-preeclampsia-eclampsia` | ✅ |
| CNPLE Professional | `catalog:ca-np-cnple:np-ca-cnple-professional-accountability-regulatory` | ✅ |

---

## Snapshot Activation

To enable the lesson hub snapshot fallback:

```bash
# Generate snapshots (Phase 6 vault script)
npx tsx scripts/export-study-snapshot-vault.mts

# Set the env var in Railway/deployment
STUDY_PUBLISHED_SNAPSHOT_DIR=/app/data/snapshots
```

Once set, the lesson hub automatically falls back to snapshots when DB queries exceed 900ms.

---

## No Code Changes Required

Lessons are already fully resilient. Phase 3 is verification-only. The snapshot export script (Phase 6) will further strengthen this by pre-generating lesson hub snapshots nightly.
