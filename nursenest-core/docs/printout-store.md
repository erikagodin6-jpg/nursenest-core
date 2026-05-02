# Printout Store (hidden printables)

Admin-managed PDF printables backed by `MediaAsset` rows and object storage (DigitalOcean Spaces). **No file bytes in Postgres** — only metadata and foreign keys to `media_assets`.

## Environment flags

| Variable | Purpose |
|----------|---------|
| `PRINTABLE_STORE_ENABLED` | When `true`/`1`/`yes`, learner APIs under `/api/printables` are active. **Default: unset = disabled.** |
| `NEXT_PUBLIC_PRINTABLE_STORE_ENABLED` | Client/nav hint only; must be used together with server flag for any future public UI. **Does not bypass server checks.** |
| `ADMIN_PRINTABLES_ENABLED` | When learner store is **off**, set to `false` to block admin printables UI/API. When unset, defaults to **on** so admins can prepare content before launch. |

Spaces upload/download requires existing Spaces env vars used elsewhere (`SPACES_*` / project-specific names — see `spaces-config` and `.env.example`).

## Migrations

From the `nursenest-core` app directory (where `prisma/schema.prisma` lives):

```bash
npx prisma validate
npx prisma migrate status
# production / CI:
npx prisma migrate deploy
```

Migration folder: `prisma/migrations/20260515120000_printable_store/`.

## Storage requirements

- Primary file: **PDF** (`MediaAsset.kind = pdf`, `mimeType = application/pdf`). DOCX/Word MIME is rejected at admin create/update/upload and at learner download.
- Thumbnail (optional): **PNG, JPEG, or WebP** (`kind = image` with allowed MIME).
- Binaries live in Spaces; `storageKey` / `publicUrl` on `MediaAsset` are **admin-only** in API responses where needed for tooling — learner JSON list/detail never selects them.

## Uploading a printable (admin)

1. Ensure admin is authorized and `ADMIN_PRINTABLES_ENABLED` is not blocking (see above).
2. Create or pick a `PrintableProduct` via `/admin/printables` (or `POST /api/admin/printables` with `fileAssetId` pointing at an existing approved `MediaAsset`, or use `POST /api/admin/printables/[id]/upload` with `confirmIntent=printable-admin-upload-confirm`).
3. Set pricing mode (`isFree` / `isPremiumIncluded` / paid `priceCents > 0`) consistently — invalid combinations return `400`.
4. Publish when ready (`isPublished`).

## Testing learner download

1. Set `PRINTABLE_STORE_ENABLED=true` in the server environment.
2. Authenticate as a learner with pathway access matching the product (`pathwayId` or `all`/`*`).
3. `GET /api/printables` and `GET /api/printables/[id]` — expect `200` and **no** `storageKey`, bucket, or raw CDN URLs in JSON.
4. `POST /api/printables/[id]/download` — expect `200` with `Content-Disposition: attachment` and PDF body (or `502` if the object is missing in Spaces).

Admin preview: `POST /api/admin/printables/[id]/preview-download` logs `PrintableDownloadEvent` with `source = ADMIN_PREVIEW`.

## Analytics (admin)

- Per product: `GET /api/admin/printables/[id]/analytics` — totals, unique learners (non-null `userId`), by day, by source, last download, **`usersWhoDownloaded`** (admin-only PII: email/name).
- Global: `GET /api/admin/printables/analytics/summary` — `totalDownloads`, `uniqueUsers`, **`downloadsByDay`**, `mostDownloaded`, `downloadsByPathway`, `downloadsBySource`. Optional `from` / `to` query params filter `downloadedAt`.

## Current limitations

- **No paid checkout** in-app; paid SKUs require `PrintableAccess` (purchase/subscription/admin grant) to be created by existing billing or ops flows.
- **No DOCX→PDF pipeline** — Word uploads are rejected until converted offline.
- **No learner marketing/catalog pages** or sitemap entries in this pass — store remains API-first and hidden unless you add UI later.
