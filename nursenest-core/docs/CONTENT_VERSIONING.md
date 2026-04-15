# Content versioning, import manifests, and rollback

Senior-level model for **exam questions**, **pathway lessons**, and **legacy `content_items`**: traceable edits, **no learner-facing fragility** (hot tables + indexed filters unchanged), optional **rollback** from archived snapshots.

**Source of truth (production):** **Postgres** rows in `exam_questions`, `pathway_lessons`, and `content_items` — not Git, not client bundles. Git holds **validators**, **schemas**, and **thin registries** only (see `docs/CONTENT_STORAGE_ARCHITECTURE.md`).

---

## 1) Target versioning model

| Concept | Implementation |
|--------|----------------|
| **Stable IDs** | `ExamQuestion.id` (UUID); pathway lessons `(pathwayId, slug, locale)` + row `id`; `ContentItem.slug` + `id`. See `src/lib/content-pipeline/stable-ids.ts`. |
| **Revision number** | **Questions / legacy items:** `sourceVersion` (existing). **Pathway lessons:** `contentVersion` (new). Bump on each **published** change or promoted import. |
| **Draft vs published** | Existing string / `ContentStatus` filters (`status`, `publish_at`, `published_at`) — no change to learner `WHERE` clauses. |
| **Publish time + actor** | `publishedAt` / `publishAt` as today; **`publishedByUserId`** (optional FK to `User`) for audit on all three entity types. |
| **Import manifest** | **`content_import_runs`**: one row per ingestion job with `manifest`, `report`, `stats`, `inputSha256`, optional `gitCommitSha`, `triggeredByUserId`. |
| **Superseded archive** | **`content_entity_revisions`**: optional snapshot **before** overwriting live rows (`snapshot` JSON + `snapshotSha256`). Bounded retention via periodic prune (ops), not application logic on every read. |
| **Integrity** | **`contentIntegritySha256`** (`canonicalStringify` + SHA-256) on archived payloads — stable across key order. |

**Performance rule:** Learners still read **`exam_questions` / `pathway_lessons` / `content_items` only** — no join to revision history on hot paths. History is for **audit, compliance, and rollback**.

---

## 2) Schema and code (reference)

| DB | Purpose |
|----|---------|
| `content_import_runs` | Every chunked import or admin batch should `start` + `finish` (see `src/lib/content-pipeline/content-import-run.ts`). |
| `content_entity_revisions` | Row inserted **before** destructive updates when you need rollback (see `src/lib/content-pipeline/content-revision.ts`). |
| `exam_questions.published_by_user_id` | Optional actor. |
| `pathway_lessons.content_version`, `published_at`, `published_by_user_id` | Align pathway rows with versioning semantics. |
| `content_items.published_by_user_id` | Optional actor. |

**Libraries**

- `content-integrity.ts` — canonical JSON + SHA-256.
- `content-import-run.ts` — `startContentImportRun` / `finishContentImportRun`.
- `content-revision.ts` — `archiveExamQuestionRevision`, `archivePathwayLessonRevision`, `archiveContentItemRevision`, `rollbackExamQuestionToArchivedVersion`.

**Diff-friendly workflow (source files):** keep using **JSONL / NDJSON** in CI or Spaces; validate with existing Zod schemas; store **`inputSha256`** on `content_import_runs` when the input is a single blob. For Git-reviewed text, prefer **one record per line** so `git diff` stays meaningful.

---

## 3) Operational workflow

1. **Author / import** — Write draft rows or validate file → chunked upsert (existing safeguards: `import-safeguards.ts`).
2. **Start import run** — `startContentImportRun({ sourceKind: "jsonl", manifest: { path, slice } })` → keep `runId`.
3. **Before mutating published rows** (if rollback required) — `archive*Revision(...)` in the **same transaction** as the update.
4. **Finish import run** — `finishContentImportRun(id, { status: "COMPLETED", report, stats })` or `FAILED` with `errorMessage`.
5. **Publish** — Set `status` + `publishedAt` / `publishAt`, bump `sourceVersion` or `contentVersion`, set `publishedByUserId` when known.
6. **Prune old revisions** (ops) — Delete or archive `content_entity_revisions` older than N months **only** per policy (legal/compliance may require longer retention).

---

## 4) Rollback steps (exam question example)

**Precondition:** A revision row exists for the desired **`version`** (the value of `sourceVersion` **when** that snapshot was taken).

1. In a **maintenance window** or low-traffic slice, open admin tooling / script that calls **`rollbackExamQuestionToArchivedVersion`** with `questionId` and `targetArchivedVersion`.
2. The helper **archives the current live row** first, then applies the snapshot and bumps `sourceVersion` monotonically (rollback is itself a new version).
3. **Verify** the question in staging / read replica: stem, options, rationale, images.
4. **Spot-check** dependent surfaces (practice tests referencing `id`).

For pathway lessons and `content_items`, follow the same pattern using **`archivePathwayLessonRevision` / `archiveContentItemRevision`** and a future `rollback*` helper if you promote it to production ops (mirror the exam-question implementation).

---

## Migration

Apply Prisma migration `20260415140000_content_versioning_import_runs` (or `prisma migrate deploy` in each environment).

---

## Related

- `docs/CONTENT_IMPORT_PIPELINE.md` — ingestion stages.
- `docs/CONTENT_STORAGE_ARCHITECTURE.md` — SoT and scale rules.
- `.cursor/rules/rn-lesson-library-safety.mdc` — do not regress list/detail performance.
