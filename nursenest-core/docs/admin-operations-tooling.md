# Admin operations tooling

All routes require an **ADMIN** session (same cookie/session as other `/api/admin/*` endpoints). Responses are **JSON only** — designed for scripts, internal dashboards, or browser devtools (no polished UI).

## Primary summary (paginated)

| Tool | Purpose |
|------|---------|
| **`GET /api/admin/operations-dashboard`** | **Single entry point** for day-to-day ops: pathway lesson source + translation gap counts (no slug dumps), question aggregates with **paginated** exam×tier×country slices and topic top list, QA issue counts, import pipeline reminders, derived **recommendations**. |
| **`npm run ops:admin-dashboard`** | Same payload as JSON to stdout (needs `DATABASE_URL`). |

### Query parameters (`operations-dashboard`)

| Param | Default | Max | Meaning |
|-------|---------|-----|---------|
| `pathwayPage` | 1 | — | Page index for registry pathway rows (merged with translation + question match). |
| `pathwayPageSize` | 12 | 50 | Rows per pathway page. |
| `questionCrossTabPage` | 1 | — | Page for `exam_questions` cross-tab slice. |
| `questionCrossTabPageSize` | 30 | 60 | Rows per cross-tab page. |
| `topicTopPage` | 1 | — | Page for published topic histogram. |
| `topicTopPageSize` | 25 | 80 | Topics per page. |

Full cross-tab in the underlying report is capped at **150** rows; the dashboard **never** returns the full table in one response — use page params.

## Detailed diagnostics (still bounded)

| Tool | Purpose |
|------|---------|
| **`GET /api/admin/scalability-report`** | Pathway matrix: DB vs catalog vs empty; question totals by status + top exams (~12). |
| **`GET /api/admin/question-bank-diagnostics`** | Published totals, by exam/status/tier, **capped** exam×tier×country×status cross-tab (150), pathway `contentExamKeys` match counts, top topics (80). |
| **`GET /api/admin/pathway-lesson-translations`** | Translation gaps vs English baseline **with sample missing slugs** (for content authors). |
| **`GET /api/admin/qa`** | Draft counts, empty rationale, duplicate `stem_hash` groups, draft lessons. |
| **`GET /api/admin/gaps`** | Low-coverage topics (SQL `LIMIT`), lesson count, exams per family. |
| **`GET /api/admin/insights`** | Broader aggregate counts. |
| **`GET /api/admin/lessons`** | Paginated admin lesson list (see route for `page` / filters). |
| **`GET /api/admin/questions`** | Paginated admin question list. |

## CLI scripts (no auth; run where `DATABASE_URL` is set)

| Script | Output |
|--------|--------|
| `npm run ops:admin-dashboard` | Full operations dashboard JSON. |
| `npm run ops:pathway-lesson-sources` | Registry pathway DB vs catalog. |
| `npm run ops:pathway-lesson-translations` | Translation gap report with samples. |
| `npm run ops:question-bank-diagnostics` | Question bank coverage. |
| `npm run db:verify-indexes` | Required index names check. |

## Import / seed pipelines (manual)

Documented in `dashboard.tooling.importPipelines` and in code as `ADMIN_IMPORT_PIPELINES`:

- `npm run db:seed-pathway-lessons` → `pathway_lessons` from `catalog.json`.
- `npx tsx scripts/import-nursing-ai-cache.ts --file=... [--apply]` → `exam_questions` / flashcards (dry-run without `--apply`).
- `npm run db:seed` → dev bootstrap (not a full production import).

## What was added for this pass

- **`/api/admin/operations-dashboard`** + **`buildAdminOperationsDashboard`** — merged flags, counts, paginated slices, recommendations.
- **`loadAdminQaIssueSnapshot`** — shared by **`/api/admin/qa`** and the dashboard (no duplicated Prisma logic).
- **`buildPathwayTranslationCompactForPathways`** — translation **counts only** for dashboard rows (full samples remain on `/api/admin/pathway-lesson-translations`).
- **`npm run ops:admin-dashboard`** — offline-style JSON dump.
- This document.

## Learner-facing diagnostics (non-admin)

Subscriber APIs may attach **`diagnostics`** on empty lists (`/api/questions`, `/api/questions/discovery`, `/api/exams/start`) — see code comments there; those are not admin routes.
