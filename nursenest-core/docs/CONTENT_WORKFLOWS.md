# Content workflows (by type)

Practical **long-term** flows so content scale does not land in the **app container**. UI is unchanged; this defines **where** work happens.

## 1. Blog posts

| Stage | Where |
|-------|--------|
| Create / edit | Admin or scripts against **`BlogPost`** (Prisma); body is **DB text/HTML**, not a file in `public/`. |
| Publish | `published` flag + optional scheduling in DB. |
| Media | **Spaces/CDN URLs** in `body` / `coverImage` (absolute `https://…`). Normalize legacy URLs with existing serializers where applicable. |
| Import | `scripts/import-blog.ts` reads legacy JSON/TS **as input** and **writes rows to Postgres** — it does not add permanent blog payloads to `public/`. |
| List / sitemap | Paginated blog index; blog sitemap query **capped** (see `sitemap-blog-xml.ts`). |

**Do not:** commit new routine blog HTML as giant files in `public/` or `src/`.

## 2. Nursing & allied test banks (questions)

| Stage | Where |
|-------|--------|
| Storage | **`ExamQuestion`** (and related) in Postgres; `tier`, `exam`, tags, status are structured fields. |
| Admin | **`/api/admin/questions`** — paginated `page` / `pageSize` (max 100). |
| Import | Use **idempotent** Prisma upserts in scripts/API; source JSON may live **outside** deploy (CI artifact, signed URL from Spaces), not under `nursenest-core/public`. |
| Learner APIs | Existing routes use filters + limits; extend with same patterns. |

**Do not:** add production question JSON into the repo or `public/` for ongoing operations.

## 3. Flashcards

| Stage | Where |
|-------|--------|
| Storage | **`Flashcard`** table. |
| Admin | **`/api/admin/flashcards`** — paginated list (`page`, `pageSize`, `total`). |
| Media | Long text in DB; **images** → Spaces URLs in fields if added later. |

## 4. Lessons

| Stage | Where |
|-------|--------|
| Storage | **`ContentItem`** (`type: lesson`), JSON body in DB column. |
| Admin | **`/api/admin/lessons`** — paginated. |
| Media | References in content JSON as **HTTPS URLs** to Spaces. |

## 5. SEO / programmatic pages

| Stage | Where |
|-------|--------|
| Registry | Lean config in `programmatic-registry` + ISR for non-default locales (`[locale]/[slug]` avoids huge static matrices). |
| Default locale | Static params for **known slug list** only (`/seo/[slug]`). |

## 6. Translations (marketing UI)

| Stage | Where |
|-------|--------|
| Source of truth | Repo **`tools/i18n/`** + compile pipeline (developer workflow). |
| Runtime | Merged bundles in `public/i18n/*.json` **or** **`MARKETING_I18N_CDN_BASE`** so deploy can omit large JSON. |
| Goal | Avoid **duplicating** huge bundles in multiple deploy paths; one CDN prefix or one copy in image. |

## 7. Images & media (all types)

| Stage | Where |
|-------|--------|
| Upload | Client/server upload to **Spaces** (presigned POST or server-side put); store URL in DB. |
| Serve | **Public CDN** or **`/api/marketing-assets`** with `SPACES_KEY` / `SPACES_SECRET`. |
| Fallback | Small local SVG/PNG only (`public/marketing/`, `public/branding/`). |

## 8. Downloads / exports / imports

| Stage | Where |
|-------|--------|
| User exports | Generate to **temp** or **Spaces**; return signed download link; **do not** accumulate under `public/exports`. |
| Admin export | **`/api/admin/export/content`** — streaming/batch; avoid writing multi-GB files into app root. |
| Imports | Read from stdin, temp file, or Spaces; **write to DB**; delete temp after success. |

## 9. Generated data / AI drafts

| Stage | Where |
|-------|--------|
| Drafts | **`GeneratedQuestionDraft` / `GeneratedFlashcardDraft`** in DB. |
| Promotion | Creates real rows in content tables; no permanent “draft dumps” in `public/`. |
