# Educational translation overlays (DB)

English remains canonical (`ExamQuestion`, catalog JSON, `Flashcard` rows, etc.). Localized **display** strings attach via `EducationalTranslationOverlay` rows (`PUBLISHED` only at read time).

## Schema

- Model: `EducationalTranslationOverlay` in `prisma/schema.prisma`.
- Unique: `(sourceKind, sourceId, locale)` — one overlay per stable source per locale.
- Status: `DRAFT` | `REVIEWED` | `PUBLISHED` (only `PUBLISHED` is merged for learners).

## `sourceId` conventions

| `sourceKind`     | `sourceId` |
|------------------|------------|
| `EXAM_QUESTION`  | `ExamQuestion.id` |
| `PATHWAY_LESSON` | `pathwayId:slug` (or `slug` if unambiguous with file overlays) |
| `FLASHCARD_DECK` | `FlashcardDeck.id` |
| `FLASHCARD`      | `Flashcard.id` |
| `FLASHCARD_TAG`  | `FlashcardTag.id` |

## Payload JSON shapes

Match file-based overlays under `public/i18n/educational-overlays/<locale>/`:

- Questions: same fields as `QuestionEducationalOverlay` in `educational-content-overlay.ts` (stem, `options` display labels parallel to DB order, rationales, teaching fields). **Grading** still uses canonical DB `options` / `correctAnswer`.
- Pathway lessons: `PathwayLessonEducationalOverlay` (title, sections by id, `preTest` / `postTest` patches; never `correct` index changes from canonical).
- Flashcards: per-row payloads may be flat (`title`/`description` for decks, `front`/`back`/`explanation` for cards, `label` for tags) or nested `decks` / `cards` / `tags` objects — see `educational-translation-db.ts`.

## Merge order

1. Load canonical English content.
2. Apply file overlay from `educational-overlays/<locale>/*.json` (if present).
3. Merge **published** DB overlays on top (DB wins per id).

Helpers: `resolveMergedQuestionOverlayBundle`, `fetchPublishedPathwayLessonOverlayMapSafe`, `resolveMergedFlashcardEducationalBundle` in `src/lib/i18n/educational-translation-db.ts`.

## Bulk import (CLI)

Idempotent upserts: `npm run i18n:import:content -- --file …` (see `tools/i18n/content-import/README.md`). Requires `DATABASE_URL` and the `educational_translation_overlays` table.

## Migrations

Apply SQL migration `prisma/migrations/20260403200000_educational_translation_overlays/migration.sql` (or `prisma migrate deploy` when the shadow DB applies cleanly). If `migrate dev` fails on older history (e.g. P3006), apply the migration SQL manually against Postgres, then `prisma generate`.

## Example read paths

- **Lesson**: `getPathwayLesson` → `applyPathwayLessonEducationalOverlay` with file bundle + `fetchPublishedPathwayLessonOverlayMapSafe(requestedLocale)`.
- **Question API**: `resolveMergedQuestionOverlayBundle(locale)` once per request → `mergeQuestionApiPayload` / `localizeQuestionListForApi`.
- **Flashcards**: `resolveMergedFlashcardEducationalBundle(locale)` → `applyFlashcardDeckOverlay` / `applyFlashcardCardOverlay`.
