# Storage policy (enforceable rules)

This policy prevents **filesystem bloat in the deploy/runtime container** (the failure mode seen on previous platforms). It complements `ARCHITECTURE_STORAGE.md` (what lives where).

## Golden rules

1. **No growing production content in Git for routine operations** — questions, flashcards, lessons, blog posts, and large exports belong in **PostgreSQL** or **Spaces**, not in committed JSON/TS dumps under `nursenest-core` except small, intentional seeds.
2. **`public/` is not a CMS** — only tiny fallbacks, small branding, and (until migrated) merged i18n bundles. Any file in `public/` outside `i18n/` must stay **small** (see `npm run storage:check`).
3. **`public/i18n/` is transitional** — merged locale JSON is large by nature. Prefer **`MARKETING_I18N_CDN_BASE`** + objects on Spaces so the container does not ship ~9MB+ of JSON long term.
4. **No production writes into app directories** — diagnostics, exports, and imports must not persist large artifacts under `nursenest-core/` at runtime (see admin i18n diagnostics: no disk write in production unless `ALLOW_DIAGNOSTICS_DISK_WRITE=true`).
5. **Database for structured content** — nursing and allied questions, flashcards, lessons, blog rows, SEO metadata, publish state, tags, tiers. Growth = DB storage billing, not container disk.
6. **Spaces/CDN for media and downloads** — images, PDFs, worksheets, export files, archival blobs. Store **URLs or keys** in DB; serve via CDN or signed URLs.
7. **Bounded queries** — list endpoints and pages use **pagination / limits**; never load entire banks into memory for UI or sitemap (blog sitemap capped; see code).

## What must never return

- Committing **question banks** or **blog bodies** as multi-MB JSON into `public/` or `src/` for production.
- **Import pipelines** that drop production dumps into `nursenest-core/public` or permanent runtime paths (import to **DB**; use temp files only, then delete).
- **Static generation** of unbounded locale × content matrices (already mitigated for programmatic SEO routes; do not regress).

## Verification

- `npm run disk:audit` — largest directories on disk.
- `npm run storage:check` — warnings for oversized `public/` files (strict mode fails on non‑i18n blobs over limit).

See also `docs/CONTENT_WORKFLOWS.md` and `docs/STORAGE_OPERATIONS.md`.
