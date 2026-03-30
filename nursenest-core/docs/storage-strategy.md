# Scalable storage strategy (DigitalOcean Spaces + Postgres)

## Principles

1. **Blob storage (Spaces)** holds bytes: images, future PDFs, video/audio, generated exports.
2. **Postgres** holds text, metadata, and **canonical HTTPS URLs** (or stable object keys + resolver) — never large binaries in-row.
3. **CDN** serves `https://<bucket>.<region>.cdn.digitaloceanspaces.com/<key>`; the app may proxy via `/api/marketing-assets/*` when configured.

## Object key layout (convention)

| Prefix | Use |
|--------|-----|
| `screenshots/`, `branding/` | Marketing / theme (treat as **protected** in cleanup) |
| `uploads/images/` | Admin / tooling image uploads |
| `uploads/pdfs/` | Documents |
| `uploads/media/` | Other media |
| `replit-export/` | Legacy bulk imports (from existing pipelines) |
| `exam-assets/` | Future per-question media at scale (100k+ rows point here, not at JSON blobs) |
| `blog/` | Future blog imagery if offloaded from `BlogPost.coverImage` URLs |

## Scale (100k+ questions, blog, flashcards)

- **ExamQuestion**: keep `stem` / `rationale` / `options` in DB; put binaries in Spaces under `exam-assets/{questionId}/…` and store **URLs or relative keys** in `images` JSON (small arrays of strings).
- **BlogPost**: `coverImage` remains a URL string; host on `blog/` prefix.
- **Flashcards**: text-only in DB; optional future `imageUrl` should reference Spaces, not bytea.
- **PathwayLesson**: body stays structured JSON (text); inline images should become URLs to Spaces.

## Safeguards (implemented)

- **Upload size cap**: `MAX_UPLOAD_BYTES` (default 5 MiB) enforced before processing.
- **MIME allowlist**: images (`image/jpeg`, `image/png`, `image/webp`) and `application/pdf` for the admin upload route.
- **Image compression**: server resizes (max dimension) and encodes **WebP** before `PutObject` (see `prepareBinaryForSpaces`).
- **`public/` guardrails**: `npm run storage:check` flags large static files that should live on CDN.

### Admin upload API

- **`POST /api/admin/storage/upload`** (admin session only, `multipart/form-data`):
  - Fields: `file` (required), `kind` = `image` | `pdf` | `media` (optional; default `image`).
  - Returns `{ objectKey, publicUrl, contentType, compressed }` for storing in Postgres.
- Implementation: `src/app/api/admin/storage/upload/route.ts`, `src/lib/storage/*`.

## Monitoring

- **`npm run ops:storage-report`**: logs database byte size (total + `exam_questions` / `blog_posts` / `content_items`), row counts, and **sampled** Spaces byte totals under a prefix (cap with `SPACES_LIST_MAX_KEYS`).
- Structured stderr prefix: `[nursenest-core]` for log drains.

## Cleanup

- **`npm run ops:cleanup-spaces-orphans -- --prefix=uploads/`** (dry-run by default): lists objects under prefix, compares to **DB-referenced** URLs/keys (`BlogPost.coverImage`, `ExamQuestion.images`, URLs inside `ContentItem.content`), respects `--protect-prefixes=screenshots/,branding/`.
- Use **`--delete`** only after reviewing machine output; production should run dry-run in CI weekly.

## Environment

| Variable | Purpose |
|----------|---------|
| `SPACES_KEY`, `SPACES_SECRET` | S3 API credentials |
| `SPACES_BUCKET` | Default `nursenest-images` |
| `SPACES_REGION` | Default `tor1` |
| `SPACES_ENDPOINT` | Optional override |
| `SPACES_EXTRA_PUBLIC_BASES` | Comma-separated extra URL bases for URL→key parsing |
| `MAX_UPLOAD_BYTES` | Admin upload limit |
| `SPACES_LIST_MAX_KEYS` | Cap for reporting / orphan scan pagination |

## Reverse proxy

Set platform / nginx **client_max_body_size** (or equivalent) ≥ upload limit so the app receives the full body and can return 413 with a clear message.
