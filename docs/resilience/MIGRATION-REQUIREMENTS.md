# NurseNest Resilience Architecture — Migration Requirements

> **Status:** Planning document — pre-implementation
> **Generated:** 2026-05-28

---

## 1. Database Migrations

**None required.**

The resilience layer is implemented entirely above the ORM. No Prisma schema changes are needed. The `ExamSession`, `FlashcardSession`, and related models are unchanged.

---

## 2. New Environment Variables

### Required for Redis Content Cache (Layer 2)

| Variable | Description | Required | Default |
|---|---|---|---|
| `UPSTASH_REDIS_REST_URL` | HTTP-based Redis endpoint (edge-safe, preferred) | No | — |
| `UPSTASH_REDIS_REST_TOKEN` | Auth token for Upstash | When above is set | — |
| `REDIS_URL` | TCP Redis URL (alternative to Upstash) | No | — |

**Note:** Both variables are already recognized by `getOperationalStartupTraceFields()` as `redisOrKvEnvPresent`. No new env detection logic is needed — just wire the actual content caching.

**Behavior when not set:** Redis content caching is a no-op. Requests proceed directly to PostgreSQL and then snapshots. Zero impact on current production behavior.

### Required for Snapshot Generation (Layer 3)

| Variable | Description | Required | Default |
|---|---|---|---|
| `STUDY_PUBLISHED_SNAPSHOT_DIR` | Absolute path to snapshot output directory | Yes (for snapshots) | Already recognized |
| `CRON_SECRET` | Authorization for cron endpoint | Yes (already in use) | Already in use |

**Note:** `STUDY_PUBLISHED_SNAPSHOT_DIR` is already recognized and consumed by the existing `study-published-snapshot-store.ts`. Only the write side (generation scripts) is new.

### Optional for Enhanced Resilience Monitoring

| Variable | Description | Required | Default |
|---|---|---|---|
| `NN_RESILIENCE_METRICS_ENABLED` | Enable in-memory resilience counter collection | No | `false` |
| `NN_SNAPSHOT_MAX_AGE_HOURS` | Alert threshold: snapshot older than N hours | No | `24` |
| `NN_CAT_RESILIENCE_POOL_DIR` | Override for CAT pool snapshot location | No | `$STUDY_PUBLISHED_SNAPSHOT_DIR/cat` |

---

## 3. Infrastructure Requirements

### Redis (Layer 2)

**Option A — Upstash Redis (Recommended)**
- Serverless, HTTP-based, edge-compatible
- No persistent connection management
- Free tier: 10,000 commands/day; paid tiers scale linearly
- Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to Railway / deployment env

**Option B — Self-hosted Redis**
- Add Redis service to Railway deployment
- Set `REDIS_URL=redis://redis:6379`
- Recommend 256MB instance minimum
- Enable persistence (AOF) for cache durability across restarts

**Option C — No Redis (Phase 1 without cache)**
- Skip Redis entirely in Phase 1
- Deploy snapshot generation only
- Add Redis in Phase 2 once snapshot pipeline is stable

### Snapshot Storage (Layer 3)

**Option A — Filesystem volume (Recommended for Railway)**
- Mount a persistent volume at `/snapshots` in Railway
- Set `STUDY_PUBLISHED_SNAPSHOT_DIR=/snapshots`
- Nightly cron writes here; API reads from same path
- Survives deployments (volume is separate from container)

**Option B — Object Storage (S3 / GCS / DigitalOcean Spaces)**
- Store snapshots in existing DigitalOcean Spaces bucket
- Modify `readStudyPublishedSnapshotFile()` to accept S3-style reads
- More complex but survives instance replacement
- Already have S3 SDK (`@aws-sdk/client-s3`) and GCS (`@google-cloud/storage`) installed

**Option C — Public directory (Simplest)**
- Write to `public/resilience/` in the Next.js app
- Served as static files by Next.js
- Snapshots are publicly accessible (acceptable for non-PII question content)
- No volume required
- **Recommended for initial rollout** — simplest to validate

### Service Worker (Layer 4 — Offline Mode)

- No infrastructure changes required
- `public/sw.js` is served as a static file
- Must be served from the app origin (not a CDN subdomain)
- HTTPS required (already in production)

---

## 4. Deployment Configuration Changes

### Railway (Primary Deployment)

```yaml
# Add to Railway service configuration:
volumes:
  - mountPath: /snapshots
    name: study-snapshots

env:
  STUDY_PUBLISHED_SNAPSHOT_DIR: /snapshots
  UPSTASH_REDIS_REST_URL: ${{ secrets.UPSTASH_REDIS_REST_URL }}
  UPSTASH_REDIS_REST_TOKEN: ${{ secrets.UPSTASH_REDIS_REST_TOKEN }}
```

### Cron Job Registration

Add to Railway cron or external scheduler:

```
# Nightly snapshot generation
0 2 * * *  curl -X POST https://app.nursenest.ca/api/cron/generate-snapshots \
              -H "Authorization: Bearer $CRON_SECRET" \
              -H "Content-Type: application/json"
```

Or wire through the existing `/api/cron/` route infrastructure (already protected by `CRON_SECRET`).

---

## 5. Dependency Audit

### Already Installed — No Action Needed

| Package | Version | Use |
|---|---|---|
| `redis` | `^5.11.0` | Redis content cache client |
| `@aws-sdk/client-s3` | `^3.750.0` | Object storage for snapshots (if needed) |
| `@google-cloud/storage` | `^7.19.0` | GCS for snapshots (if needed) |
| `@tanstack/react-query` | `^5.60.5` | Client-side offline + retry support |

### New Packages — Upstash Option Only

```bash
# If using Upstash HTTP client (instead of raw redis package):
npm install @upstash/redis@^1.34.0
```

The `redis@^5` package works with standard Redis instances. For Upstash, we can use their HTTP API directly via `fetch` (no extra package) or their official client.

### No New Packages Needed If

- Using standard Redis with `REDIS_URL` → `redis@^5` already installed
- Using filesystem snapshots → Node `fs` built-in
- Using IndexedDB → browser built-in, no polyfill for target browsers

---

## 6. Breaking Changes Assessment

| Area | Breaking? | Notes |
|---|---|---|
| API response shape | No | `source_used` field already exists in flashcard route |
| Prisma schema | No | No migrations |
| Auth flow | No | No changes to auth |
| Existing snapshot reads | No | Only adding new surfaces and write scripts |
| CAT session state | No | Resilience mode is additive; normal mode unchanged |
| Entitlements | No | No changes |
| Theme / UI | No | Only new components (banner, offline notice) added |
| TypeScript types | No | Extending existing types, not changing them |

---

## 7. Rollback Plan

Each layer is independently deployable and independently removable:

**Layer 2 (Redis cache) rollback:**
- Unset `UPSTASH_REDIS_REST_URL` / `REDIS_URL`
- `isCacheConfigured()` returns false → cache is a no-op
- Zero code changes required

**Layer 3 (Snapshots) rollback:**
- Unset `STUDY_PUBLISHED_SNAPSHOT_DIR`
- `studyPublishedSnapshotsConfigured()` returns false → snapshots skipped
- Zero code changes required
- Generation scripts can be disabled by removing the cron entry

**CAT resilience mode rollback:**
- Feature flag: `NN_CAT_RESILIENCE_MODE=0` → always use live engine
- Or revert the `cat-engine.ts` change (isolated catch block)

**Service worker rollback:**
- Unregister in `sw-registration.ts` (one-line change)
- Browser clears cache on next visit

**Offline queue rollback:**
- Disable sync call in `sw-registration.ts`
- IndexedDB data persists but is not consumed
