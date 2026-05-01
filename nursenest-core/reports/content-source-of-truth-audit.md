# Lesson Source-of-Truth Audit

## Canonical pathway lessons

- Canonical write path: `PATCH/POST /api/admin/pathway-lessons/[id]`
- Canonical storage: `pathway_lessons`
- Canonical admin edit route: `/admin/pathway-lessons/[id]`
- Canonical public hub route: `/{locale}/{slug}/{examCode}/lessons`
- Canonical public detail route: `/{locale}/{slug}/{examCode}/lessons/[lessonSlug]`
- Canonical public read path:
  - live normalization: `src/lib/lessons/pathway-lesson-catalog-sync.ts`
  - hub/detail loaders: `src/lib/lessons/pathway-lesson-loader.ts`
  - optional generated snapshot: `src/content/pathway-lessons/generated-indexes/*.json`

## Generated lesson indexes

- Build writer: `scripts/build-normalized-lesson-indexes.runner.mts`
- Build verifier: `scripts/verify-normalized-lesson-indexes.runner.mts`
- Purpose: optional precomputed marketing/cold-path summaries, not the only runtime source
- Rebuild behavior: snapshots refresh on `npm run build:lesson-indexes` or full `npm run build`
- Hidden/orphan risk before this pass:
  - raw lessons could exist in bundled catalogs while `generated-indexes/*.json` exposed zero public lessons for a pathway
  - allied profession routes could exist with no `topicSlugsIn` mapping, falling back to a generic hub

## ContentItem lesson bridge

- Legacy/compatibility write path: `PATCH /api/admin/lessons/[id]`
- Legacy storage: `content_items` with `type = "lesson"`
- Important constraint: linked pathway lessons are blocked from editing here and redirected to `/admin/pathway-lessons/[id]`
- Public impact: content-item lessons are not the canonical source for pathway marketing lesson hubs

## Publish behavior after this pass

- Admin pathway lesson saves write directly to `pathway_lessons`
- Live detail-route revalidation is requested immediately after mutation
- Generated lesson-index snapshots are rebuild-driven and now explicitly reported in the admin UI
- `reports/lesson-normalization-coverage.json` and `reports/lesson-normalization-coverage.md` document which raw lessons are renderable vs excluded and why

## Verification commands

- `npm run build:lesson-indexes` — regenerates `generated-indexes/*.json` + coverage reports; fails if raw>0 and live=0 or >20% unexpected exclusions.
- `npm run verify:lesson-indexes` — compares generated files to live normalization (no stale disk shortcut in verify leg).
- `npm run content:source-of-truth:verify` — coverage gates + lesson index verify.
- `npm run content:source-of-truth:audit` — refreshes this file’s companion checklist timestamps (lightweight).
- `NN_FORCE_PUBLISH_VALID_RAW_LESSONS=1` — optional ops mode to include additional catalog rows that pass minimum safety checks (see `pathway-lesson-force-publish.ts`); collisions get deterministic `__nn-dup-N` slug suffixes.

## Blogs

- See `reports/blog-source-of-truth-audit.md` and `npm run content:report-hidden-blogs`.

## Flashcards / questions

- Learner data remains pathway-scoped; marketing lesson detail pages link to `HUB.flashcards` and `HUB.questionBank` for cross-surface navigation.
