# PathwayLesson single source of truth — audit & target architecture

## 1. Current data flow (pre-change inventory)

### ContentItem lessons — created

- `POST /api/admin/lessons` — creates `content_items` rows (`type: "lesson"`).
- `POST /api/admin/lessons/[id]/adapt` — adapts from an existing ContentItem into a new draft.
- `POST /api/admin/lessons/[id]/duplicate` — duplicates a ContentItem lesson.
- `POST /api/admin/lessons/ai-drafts/[id]/promote` — promotes AI draft to `content_items`.
- Content pipeline / batch generators that persist subscriber lessons as ContentItems (see `admin-ai-lesson-batch-step-handler`, `ai-generate-batch`, etc.).
- `prisma/seed.ts` — seed ContentItems.

### PathwayLesson records — created

- Legacy import: `applyLegacyPathwayLessonsImport` (`legacy-pathway-lesson-apply.ts`) — `prisma.pathwayLesson.create`.
- Content pipeline batch / catalog sync paths that upsert `pathway_lessons` (see `pipeline-schema` `PathwayLessonUpsert`, admin content-pipeline batch routes).
- Catalog normalization scripts (outside learner request path).

### Routes that read ContentItem (lessons)

- **Learner** `/app/lessons/[id]` — when `id` is a ContentItem UUID and no PathwayLesson row matches that id (after reorder: PathwayLesson checked first).
- **`/api/lessons`**, **`/api/lessons/progress`** — progress + listing paths for ContentItem lessons.
- **Hub / entitlement helpers** — `app-lessons-hub-row-renderability`, `learner-visible-lesson-scope`, `lesson-progress-resolver`, `topic-remediation-links`, etc.
- **Admin** — `/api/admin/lessons*`, SEO audit, media scan, content quality tools.
- **Other** — `exam-questions/by-ids`, `questions/grade`, etc. (lesson scope checks).

### Routes that read PathwayLesson

- **Marketing** exam pathway lesson detail + hubs — `pathway-lesson-loader`, marketing route segments under `buildExamPathwayPath`.
- **Learner** `/app/lessons/[id]` — when `id` is a `pathway_lessons` primary key (cuid).
- **Learner** `/app/lessons` hub — mixed sources; pathway rows when hub source is pathway.
- **`/api/lessons/progress`** — checks PathwayLesson first by `lessonId`.
- **SEO / linking** — `content-backed-study-resource-hub`, `automatic-internal-links`, `blog-internal-link-verify`, etc.

### Admin surfaces

- **ContentItem editor** — `/admin/lessons`, `/admin/lessons/[id]`, `AdminLessonFormClient` → `/api/admin/lessons`.
- **PathwayLesson editor (new)** — `/admin/pathway-lessons`, `/admin/pathway-lessons/[id]`, `AdminPathwayLessonFormClient` → `/api/admin/pathway-lessons/[id]`.

### Public marketing lesson pages

- Prefer published **`pathway_lessons`** for the active exam pathway, with catalog fallbacks where configured (`pathway-lesson-loader`).

---

## 2. Target architecture

| Surface | Source |
|--------|--------|
| Public marketing lesson URL | `PathwayLesson` (published) + existing catalog fallback policy |
| Learner `/app/lessons/{pathwayLessonId}` | `PathwayLesson` via `resolveAppSubscriberPathwayLessonForDetail` (draft excluded by `getPublishedPathwayLessonRecordById`) |
| Learner `/app/lessons/{contentItemId}` | `ContentItem` only when no PathwayLesson id matches; optional **`pathway-lesson-id:{cuid}`** tag → **permanent redirect** to canonical PathwayLesson id |
| Admin pathway editing | `PATCH /api/admin/pathway-lessons/[id]` (writes `pathway_lessons` only) |
| Admin ContentItem editing | Retained for **non-pathway / legacy** lessons and tooling; **does not** sync into PathwayLesson |

Publishing on PathwayLesson uses existing **`status`** (`ContentStatus`) and **`published_at`** columns — no new schema in this slice.

---

## 3. Compatibility & migration

- **Tag** `pathway-lesson-id:{pathwayLessonRowId}` on a `content_items` lesson steers `/app/lessons/{contentItemUuid}` to the canonical pathway row.
- **Script** `scripts/migrate-content-items-to-pathway-lessons.mjs` — dry-run by default; `--apply=true` performs guarded copies when content is clearly richer and mapping is explicit (`pathway-lesson-id:` or single `pathway-sync:` + slug).

---

## 4. Revalidation

`revalidateSurfacesAfterPathwayLessonMutation` (see `src/lib/admin/revalidate-pathway-lesson-surfaces.ts`) invalidates:

- `/app/lessons`, `/app/lessons/{id}`
- `buildExamPathwayPath(pathway, lessons/{slug})` and `.../lessons` when pathway id resolves
- On indexing-impact saves: `/sitemap.xml`, `CACHE_TAG_PATHWAY_LESSON_INDEX`, per-pathway hub tag

Uses **`buildExamPathwayPath`** only — no hard-coded `/ca` routes.
