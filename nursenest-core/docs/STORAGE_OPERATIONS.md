# Storage operations checklist

Quick reference for **safe** content and disk operations. Full policy: `STORAGE_POLICY.md`.

## Adding a blog post

1. Prefer **DB**: create/update `BlogPost` (admin UI or script against `DATABASE_URL`).
2. Set **`coverImage`** and inline images to **absolute HTTPS URLs** on your CDN/Spaces bucket.
3. Run **`scripts/import-blog.ts`** only for **bulk migration** from legacy JSON; verify rows in DB, not new files under `public/`.
4. Confirm **`/blog`** list is paginated; no single page loads all posts.

## Adding questions (nursing or allied)

1. Insert via **admin API** or **import script** targeting **`ExamQuestion`** with required fields (`tier`, `exam`, status, etc.).
2. Keep import **sources** off the deploy image (S3, CI artifact, local machine); **results** go to **Postgres only**.
3. Use **admin list** with `page` / `pageSize` — never rely on “load all IDs” in UI.

## Adding allied health content

1. Use same **DB model** and tier/exam columns as nursing where applicable (`ALLIED` tier / exam family).
2. Same pagination and import rules as questions.

## Adding flashcards / lessons

1. **POST** to admin APIs or Prisma in scripts; content lives in **DB**.
2. Attach media via **URL fields** pointing at Spaces.

## Uploading assets (images, PDFs)

1. Upload file to **Spaces** (bucket + key).
2. Store **`https://…cdn…/…`** or key + signer in DB.
3. Optional: **`NEXT_PUBLIC_MARKETING_USE_SPACES_PROXY=true`** for private bucket + **`/api/marketing-assets`** (needs `SPACES_KEY` / `SPACES_SECRET`).

## Cleaning build artifacts (local / CI)

1. **`npm run clean:next`** — removes `.next`.
2. **`npm run build:deploy`** — build + removes **`.next/cache`**.
3. After production install on builders: **`npm prune --omit=dev`** (already in App Platform spec).
4. Remove **`reports/i18n-status.json`** only if safe (regenerated); not required in production.

## Debugging storage growth

1. **`npm run disk:audit`** — see largest dirs (`node_modules`, `.next`, `public/i18n`).
2. **`npm run storage:check`** — flags **oversized** files under `public/` (non‑i18n).
3. Check **`.dockerignore`** / **App Platform `source_dir`** so monorepo `attached_assets/` is not in the Next build context.
4. Review **new** `writeFile` / `appendFile` in `src/app/api` — must not persist large blobs in production paths.

## What not to do

- Commit **multi-MB** JSON question/blog dumps into `nursenest-core` for routine updates.
- Point production **import** output at **`public/`** or permanent paths under the app tree.
- Add **unpaginated** admin endpoints that return entire tables.
