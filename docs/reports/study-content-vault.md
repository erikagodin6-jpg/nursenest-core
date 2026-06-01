# Study Content Vault — Phase 6

**Implemented:** 2026-06-01  
**Status:** ✅ Export script created; activation requires deployment config

---

## Architecture

The Study Content Vault is a three-tier content storage system that ensures a complete study session can be launched even with the primary database offline.

```
Tier 1 (Primary):    PostgreSQL database
                     Full SRS progress, adaptive state, peer stats
                     
Tier 2 (Secondary):  In-process stale cache (paid-content-stale-cache.ts)
                     36-hour max age; 180 entry cap; process-local
                     Covers: question lists, flashcard deck lists
                     
Tier 3 (Tertiary):   Static file vault (STUDY_PUBLISHED_SNAPSHOT_DIR)
                     JSON files generated nightly by export script
                     Covers: lessons, flashcards, questions, hub bootstraps
```

---

## Vault Export Script

**File:** `scripts/export-study-snapshot-vault.mts`

**Run:**
```bash
npx tsx scripts/export-study-snapshot-vault.mts
```

**Schedule (nightly):**
```bash
# crontab entry
0 2 * * * cd /app && npx tsx scripts/export-study-snapshot-vault.mts 2>&1 >> /var/log/snapshot-vault.log
```

**Output surfaces:**

| Surface | Files Generated | Content |
|---|---|---|
| Flashcard gap-closure (PN) | `flashcards/gap-closure-nclex-pn.json` | 100 flashcard cards |
| Flashcard gap-closure (CNPLE) | `flashcards/gap-closure-cnple.json` | 60 flashcard cards |
| Question bank (PN) | `questions/gap-closure-nclex-pn.json` | 57 questions with rationales |
| Lesson catalog slim (×5 pathways) | `lessons/catalog-slim-{pathway}.json` | Lesson metadata for hub rendering |
| Flashcard hub bootstrap (×6 tiers) | `flashcards/hub-bootstrap-{country}-{tier}.json` | Pathway options for hub init |
| Manifest | `snapshot-manifest.json` | Index of all snapshot files |

---

## Snapshot Format

All snapshots follow the `StudyPublishedSnapshotEnvelope<T>` contract:

```json
{
  "schema": "nursenest.study_snapshot.v1",
  "surface": "flashcard_gap_closure_nclex_pn",
  "version": "20260601",
  "capturedAt": "2026-06-01T02:00:00.000Z",
  "payload": {
    "exam": "NCLEX-PN",
    "cardCount": 100,
    "cards": [...]
  }
}
```

---

## Activation

**1. Generate snapshots:**
```bash
npx tsx scripts/export-study-snapshot-vault.mts
# Output: ./data/snapshots/ (or STUDY_PUBLISHED_SNAPSHOT_DIR if set)
```

**2. Set deployment env var (Railway):**
```
STUDY_PUBLISHED_SNAPSHOT_DIR=/app/data/snapshots
STUDY_FAILOVER_REQUIRED=0  # Set to 1 to force failover mode
```

**3. Verify activation:**
```bash
# Check that snapshot store is configured
curl -I https://app.nursenest.ca/app/lessons | grep X-NurseNest-Content-Fallback
# Should be absent when DB is healthy; present during failover
```

---

## Offline Study Session Verification

With the vault activated and DB offline, a complete study session can be launched:

| Step | Content Source | Status |
|---|---|---|
| Open `/app/lessons` | Snapshot: `lessons-hub/{pathway}/...` | ✅ Available |
| Open a catalog lesson | Static: `catalog.json` via `readFileSync` | ✅ Available |
| Browse flashcard decks | Stale cache or hub bootstrap snapshot | ✅ Available |
| Launch flashcard study | Tertiary: static catalog fallback (Phase 2) | ✅ Available |
| View question bank | Stale cache (subscriber; 36h window) | ✅ Available (if cached) |
| Start practice test | ❌ Requires DB for session creation | ⚠️ Not yet |
| View study plan | ❌ Requires DB for performance data | ⚠️ Not yet |

**Core study loop (lesson → flashcard) is fully offline-capable.**

---

## Planned Enhancements (Next Sprint)

1. **Pre-generated practice exam inventory** — Export `questionIds` arrays for common exam configurations
2. **Shared Redis stale cache** — Replace process-local cache with Redis-backed shared store (eliminates stale miss on instance reroute)
3. **Automatic snapshot push to DigitalOcean Spaces** — Store vault files in object storage for multi-region availability
4. **Snapshot freshness monitoring** — Alert if snapshot age exceeds 25 hours (indicates cron failure)

---

## DigitalOcean Spaces Integration (Roadmap)

```
Export script (nightly)
  → Write to local filesystem (Tier 3)
  → Sync to DO Spaces bucket (Tier 3b)
    SPACES_BUCKET=nursenest-snapshots
    SPACES_REGION=nyc3

Runtime (failover)
  → Try local filesystem
  → If missing: fetch from DO Spaces
  → Cache locally for 5 minutes
```

Implementation: Add `sync-snapshots-to-spaces.mts` script that reads the manifest and uploads each file to the configured Spaces bucket.
