# Educational content overlay imports

Drop JSON manifests or CSV files into `inbox/`, or pass an explicit `--file` / `--dir`.

Imports **only** create/update rows in `educational_translation_overlays`. Canonical English rows (`exam_questions`, `pathway_lessons`, flashcards, etc.) are never modified.

## Commands

```bash
# Dry-run (no DB writes) — requires DATABASE_URL for existence checks
npm run i18n:import:content -- --file tools/i18n/content-import/samples/sample.manifest.json --dry-run

# Filter to one locale when a directory contains multiple
npm run i18n:import:content -- --dir tools/i18n/content-import/inbox --locale fr --dry-run

# Apply (writes DB)
npm run i18n:import:content -- --file tools/i18n/content-import/inbox/my-fr.json

# Overwrite existing PUBLISHED overlays (default: protected)
npm run i18n:import:content -- --file path/to/file.json --force-published
```

## JSON manifest (v1)

Top-level fields:

| Field | Required | Description |
|-------|----------|-------------|
| `locale` | yes | BCP-47 style code (e.g. `fr`) — must be a supported non-`en` marketing locale |
| `items` | yes | Array of overlay rows |

Each item:

| Field | Required | Description |
|-------|----------|-------------|
| `sourceKind` | yes | `EXAM_QUESTION`, `PATHWAY_LESSON`, `FLASHCARD_DECK`, `FLASHCARD`, `FLASHCARD_TAG` |
| `sourceId` | yes | Stable id: question id, `pathwayId:slug`, deck id, card id, tag id |
| `status` | yes | `DRAFT`, `REVIEWED`, `PUBLISHED` |
| `payload` | yes | JSON object — same shape as file overlays under `public/i18n/educational-overlays/<locale>/` |
| `reviewedAt` | no | ISO date string |
| `reviewerNote` | no | Ignored by the DB (documentation only) |

## CSV

Header row (exact):

`sourceKind,sourceId,locale,status,payload_json`

`payload_json` must be a single JSON object (quoted in CSV). Use `questions.csv` sample as a template.

## Safety

- **Duplicate keys** in the same run: last row wins per `(sourceKind, sourceId, locale)`.
- **Published rows**: existing `PUBLISHED` overlays are **not** updated unless `--force-published` is set.
- **Question `options`**: if provided, length must match the canonical English options array (display labels only).
- **Locale**: `en` is rejected for overlays (English stays canonical).

See also `docs/educational-translation-overlays.md` in the app root.
