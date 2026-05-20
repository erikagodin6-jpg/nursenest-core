# Nurse Nest legacy import format

Batch importer: `scripts/import-nurse-nest-legacy.ts` (run from `nursenest-core/`).

## Layout

All top-level folders are **optional**. Missing directories are skipped (no error).

| Folder        | Purpose |
|---------------|---------|
| `lessons/`    | Pathway lessons (JSON array files or `.ndjson`) |
| `questions/`  | Exam questions |
| `blogs/`      | Blog posts |
| `activities/` | Practice pool rows and `lesson_quiz` merges |

## File types

- **`.json`**: a single **JSON array** of objects (streaming via `stream-json-array`).
- **`.ndjson`**: one JSON object per line; blank lines ignored; bad lines skipped (no crash).

## CLI

| Flag | Required | Description |
|------|----------|-------------|
| `--source=/abs/or/rel/path` | **Yes** | Root folder containing the layout above. |
| `--apply` | No | Without it, **dry-run** (counts only; no DB writes). |
| `--batch-size=N` | No | Rows per batch; **capped at 50** (values above 50 are clamped; see run summary). |
| `--checkpoint=/path.json` | No | Resume cursor (default: `data/import-checkpoints/nurse-nest-legacy.json`). |
| `--only=a,b` | No | Subset: `lessons`, `questions`, `blogs`, `activities` (comma-separated). Invalid values fail the run. |
| `--quarantine=/dir` | No | Quarantine log directory (default under `data/import-quarantine/nurse-nest/`). |

### Example commands

```bash
# Dry-run (default): validate + counts, no writes
npx tsx scripts/import-nurse-nest-legacy.ts --source="/path/to/nurse nest"

# Apply writes
npx tsx scripts/import-nurse-nest-legacy.ts --source="/path/to/nurse nest" --apply

# Lessons only, smaller batches, custom checkpoint (resume)
npx tsx scripts/import-nurse-nest-legacy.ts --source="/path/to/nurse nest" --only=lessons --batch-size=25 --checkpoint="./data/import-checkpoints/my-run.json" --apply
```

Checkpoint and quarantine paths are gitignored by convention.

## Lessons

**Required fields** (per record):

- `sections` — non-empty array (lesson body).  
- Resolvable **`pathwayId`** (see below) or enough data to infer track/country.

**Common fields**:

- `title` — defaults to `"Untitled lesson"` if missing.
- `slug` — optional; derived from title + hash if absent.
- `topic`, `topicSlug`, `bodySystem`, `previewSectionCount`, `seoTitle`, `seoDescription`
- `preTest` / `postTest` — optional quiz arrays; merged into DB JSON as `nnLessonPayloadV2` wrapper when present (see below).

**Pathway ID**:

- Explicit: `pathwayId` or `pathway_id`.
- Otherwise **inferred** from track + country (`inferTrackFromRaw` / `inferCountryFromRaw` with defaults RN / US) via `mapTrackAndCountryToExamFields` mapping to internal pathway ids (e.g. RN US → `us-rn-nclex-rn`).

**Dedupe**:

- **Primary**: one row per `(pathwayId, locale, slug)` — existing row → skip (no `--force` overwrite).
- **Secondary**: same pathway + normalized title collision with a **different** slug → quarantine + skip (see `reports/legacy-importer-collision-rules.json`).

## Questions

- Meaningful `stem` (or `question` / `prompt`) — very short stems may be skipped silently.
- Dedupe by **`stemHash`** against DB.

## Blogs

- `title` + `body` (`content` / HTML aliases) required for processing.
- Dedupe / update by **`slug`**.

## Activities

`kind` (aliases: `type`, `activityType`), lowercased:

| Kind | Behavior |
|------|----------|
| `pool`, `practice`, `practice_pool` | Creates / dedupes a pool **exam question** (stem + options). |
| `lesson_quiz`, `lesson-quiz`, `lesson` | Merges quiz **items** into an existing pathway lesson. |

### `lesson_quiz`

| Field | Required | Notes |
|-------|----------|------|
| `pathwayId` / `pathway_id` | Yes* | *Or inferable like lessons. |
| `lessonSlug` / `lesson_slug` / `slug` | Yes | Target lesson slug (normalized). |
| `slot` | No | `pre` (default) or `post` — which quiz array to append to. |
| `items` or `questions` | Yes | Sanitized quiz items (`sanitizeQuizItems`). |

DB shape for lessons uses the catalog helper contract: `unwrapPathwayLessonDbSections` / `sectionsToDbJson` store:

```json
{
  "nnLessonPayloadV2": true,
  "sections": [ ... ],
  "preTest": [ ... ],
  "postTest": [ ... ]
}
```

Merges **append** to existing pre/post arrays without replacing `sections` wholesale; wrong slot selection is avoided by branching on `slot === "post"`.

## Dry-run vs `--apply`

- **Dry-run**: increments insert/update counters as if writes succeeded (for questions/lessons where safe), logs batches, **no** `create`/`update`.
- **`--apply`**: performs Prisma writes; checkpoint advances after each batch.

## Checkpointing

- Checkpoint format: `{ "version": 1, "processedKeys": string[] }`.
- Keys are stable per row: e.g. `lessons:relative/path.json:0`.
- Re-running with the same checkpoint **skips** completed keys → idempotent resume.

## Quarantine

- Per-run log file: `run-<timestamp>.log` in the quarantine directory.
- JSON lines for failures: pathway resolution, missing sections, lesson quiz target missing, **title/slug collision** rows, etc.
- Reason codes for lesson title collisions are documented in `reports/legacy-importer-collision-rules.json`.

## Sample manifest

See `docs/imports/nurse-nest-legacy-manifest.example.json` for a non-normative JSON example of folder roles and record shapes.
