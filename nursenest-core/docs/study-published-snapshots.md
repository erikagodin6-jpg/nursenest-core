# Study published snapshots (real failover)

Versioned JSON files give a **secondary read path** when the primary database read fails for specific learner/marketing surfaces. Snapshots are **not** a second source of truth for mutable state (for example CAT adaptive rows): they only cover **published, exportable** inventories.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `STUDY_PUBLISHED_SNAPSHOT_DIR` | No (recommended in production when failover is enabled) | Absolute path to a directory mounted read-only at runtime. Contains subfolders `lessons-hub/`, `flashcards/`, `practice-tests/`, `practice-exams/`. |
| `STUDY_FAILOVER_REQUIRED` | No | Set to `1` when production is expected to serve from snapshots during DB incidents. If set without a configured, readable snapshot directory, the app logs a **critical** misconfiguration once per process when a snapshot read is attempted. |
| `STUDY_SNAPSHOT_VERSION` | No | Optional version string written by export scripts (defaults to a time-based value). |

## Mount / deployment

- Mount the snapshot volume (or sync from object storage) at the path referenced by `STUDY_PUBLISHED_SNAPSHOT_DIR`.
- The Node process must have **read** access to the directory tree.
- Export jobs should refresh JSON on every content publish for each **tier × country × locale** (and pathway/page) you need in production.
- Optional root `manifest.json` is updated by export scripts (`lastRefreshedAt`, `lastSurface`) for ops visibility.

## JSON contract

Each file is a `StudyPublishedSnapshotEnvelope` (`schema: "nursenest.study_snapshot.v1"`, `surface`, `version`, `capturedAt`, `payload`). Invalid envelopes are **rejected** (treated as missing).

## Surfaces (current)

| `surface` | Relative path pattern | Used when |
|-----------|----------------------|-----------|
| `pathway_lessons_hub` | `lessons-hub/{pathwayId}/{locale}/p{page}-s{size}-{optsKey}.json` | Marketing / learner lessons hub paging |
| `flashcards_subscriber_list` | `flashcards/subscriber-list-{tier}-{country}-{locale}.json` | `GET /api/flashcards` after DB failure |
| `flashcards_hub_pathway_bootstrap` | `flashcards/hub-bootstrap-{country}-{tier}.json` | `/app/flashcards` pathway bootstrap after DB failure |
| `practice_tests_hub_bootstrap` | `practice-tests/hub-bootstrap-{country}-{tier}.json` | `/app/practice-tests` hub builder bootstrap after DB failure |
| `practice_exams_default` | `practice-exams/default-exam-{country}-{tier}.json` | `resolveDefaultExamForUser` after DB failure |

**Primary-only (explicit errors, no empty fake inventory):**

- `GET /api/practice-tests` user history list: on DB failure returns **503** with `retryable: true` (per-user rows are not exported globally).

## Export commands (publish pipeline)

From `nursenest-core/` with `DATABASE_URL` set:

```bash
export STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-published-snapshots
export STUDY_SNAPSHOT_VERSION="${GIT_SHA:-manual-$(date -u +%Y%m%dT%H%M%SZ)}"

# Lessons hub (example)
npx tsx scripts/study-snapshots/export-pathway-lessons-hub-snapshot.mts <pathwayId> <locale> <page> <pageSize> '[{"q":"","topicSlugsIn":[]}]'

# Flashcards subscriber list (matches GET /api/flashcards page)
npx tsx scripts/study-snapshots/export-flashcards-subscriber-list-snapshot.mts RN_STANDARD US en 1 24

# Flashcards hub pathway bootstrap
npx tsx scripts/study-snapshots/export-flashcards-hub-bootstrap-snapshot.mts RN_STANDARD US

# Practice tests hub bootstrap (optional reference user for default pathway alignment)
npx tsx scripts/study-snapshots/export-practice-tests-hub-bootstrap-snapshot.mts RN_STANDARD US

# Default published exam
npx tsx scripts/study-snapshots/export-practice-exams-default-exam-snapshot.mts US RN_STANDARD
```

## Operations / health

- **GET** `/api/admin/study-published-snapshots/health` (admin session + RBAC): returns directory probe, bounded JSON file scan, newest snapshot age proxy, and missing expected top-level folders.
- Boot logs `study_snapshot_boot_diagnostics` and, when `STUDY_FAILOVER_REQUIRED=1` and the directory is missing or unreadable, `study_snapshot_boot_misconfigured` (critical).
