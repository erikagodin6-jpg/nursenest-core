# Lesson Image Coverage Audit

Structured inventory for clinical illustration production: which lessons have images, which should have them, and what to build next.

## Run the audit

From `nursenest-core/`:

```bash
npm run audit:lesson-image-coverage
```

Optional pathway filter:

```bash
npx tsx scripts/lesson-image-coverage-audit.mts --pathway us-rn-nclex-rn
```

Refresh Spaces inventory first (when credentials are available):

```bash
node scripts/sync-lesson-image-inventory.mjs
```

## Outputs

Written to `reports/lesson-image-audit/` at the repo root:

| File | Purpose |
| --- | --- |
| `lesson-image-audit.csv` | Full spreadsheet for producers and PMs |
| `lesson-image-audit.json` | Machine-readable full report + summary |
| `missing-images.json` | Should-have lessons without adequate art |
| `high-priority-images.json` | CRITICAL/HIGH (and top MEDIUM no-image) production queue |
| `duplicate-opportunities.json` | Shared illustration / modular visual systems |
| `LESSON-IMAGE-AUDIT-SUMMARY.md` | Human-readable coverage snapshot |
| `IMAGE-PRODUCTION-ROADMAP.md` | **What to create next** — executive summary |
| `critical-images.md` | CRITICAL production backlog (full lesson cards) |
| `high-priority-images.md` | HIGH production backlog |
| `medium-priority-images.md` | MEDIUM production backlog |
| `duplicate-visual-systems.md` | Shared / modular visual systems |
| `cluster-image-queues.md` | Cluster-batched production tables |
| `image-production-roadmap.csv` | Spreadsheet with rationales + AI prompts |
| `image-production-roadmap.json` | Structured backlog + cluster queues |

## Row fields

Each lesson includes: title, slug, pathway, resolved image status (`exact_match`, `fuzzy_match`, `fallback_match`, `no_image`, `low_quality_image`, `duplicate_image_candidate`), matched inventory filename, fallback source, image quality score, recommended image type, production cluster, SEO/traffic and clinical complexity scores, priority level (`CRITICAL` / `HIGH` / `MEDIUM` / `LOW`), suggested filename (`.webp`), dimensions (1200×750), alt text, Blossom style category, and AI-ready `suggestedImagePrompt`.

## Library layout

Implementation lives under `nursenest-core/src/lib/content/lesson-image-audit/`:

- `build-report.ts` — scans all marketing-renderable catalog lessons
- `visual-necessity.ts` — should-have-image detection
- `image-type-recommendation.ts` — infographic / ECG strip / med chart / etc.
- `priority-scoring.ts` — weighted roadmap scoring
- `duplicate-opportunities.ts` — shared asset grouping
- `resolve-audit-status.ts` — bridges `resolveLessonImage()` to audit status

Image resolution and inventory matching: `resolve-lesson-image.ts`, `lesson-image-inventory-match.ts`.

## Visual style governance

All production queue items use `styleCategory: blossom_clinical_vector` and prompts reference Mint/Blossom premium healthcare SaaS — soft neutrals, vector clinical education, accessible contrast, no stock photography.

## Tests

```bash
node --import tsx --test src/lib/content/lesson-image-audit/lesson-image-audit.test.ts
```

## Future automation (scaffolded)

The audit CLI is the foundation for:

- CI coverage gates (`should-have` missing count)
- Admin dashboards (parse `lesson-image-audit.json` summary)
- Stale inventory detection (re-sync + diff)
- Batch prompt export from `high-priority-images.json`
