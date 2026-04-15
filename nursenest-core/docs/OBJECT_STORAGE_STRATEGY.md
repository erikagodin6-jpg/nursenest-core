# Object storage strategy (large assets)

This document defines **where bytes live**, **how they are accessed**, and **how to migrate and retire** them. It complements:

- `docs/storage-strategy.md` — DigitalOcean Spaces conventions already in use
- `docs/CONTENT_STORAGE_ARCHITECTURE.md` — lesson/question **text** SoT (not blobs in-row)

**Goal:** keep the Git repo for **source code and small, reviewable text**; use **object storage** for large or binary payloads; use **Postgres** for metadata, entitlements, and pointers — never as a blob store for big files.

---

## 1) Storage decision matrix

| Asset class | Typical size | **Git** | **Database** | **Object storage (Spaces)** | Notes |
|-------------|--------------|---------|--------------|-------------------------------|--------|
| Application source, configs, schemas | Small | Yes | No | No | Reviewable diffs only. |
| i18n JSON, content manifests, small fixtures | Small–medium | Yes (with limits) | Optional metadata | No | Keep under team size policy; validate in CI. |
| **Screenshots, hero images, logos (marketing)** | Medium | **No** (generated refs only) | URL string on entities if needed | **Yes** — `screenshots/`, `branding/`, `brand/` | Prefer CDN URL in DB; use `/api/marketing-assets/*` for private-bucket proxy (allowlist). |
| **Admin-uploaded images/PDFs/media** | Medium | No | Canonical **HTTPS URL or key** | **Yes** — `uploads/images|pdfs|media/` | Implemented: `POST /api/admin/storage/upload`. |
| **Exam/question media** (diagrams, audio) | Medium–large | No | **References only** (URLs/keys in JSON), not bytea | **Yes** — `exam-assets/{questionId}/…` | Scale path for 100k+ questions. |
| **Blog / lesson inline images** | Medium | No | URL in content | **Yes** — e.g. `blog/`, pathway inline | Same pattern as marketing. |
| **Large exports** (CSV/JSON/ZIP for ops) | Large | No | Job row: status, **object key**, checksum, expiry | **Yes** — `exports/{jobId}/…` or `exports/{yyyy}/{mm}/…` | Time-bound; delete after download or TTL. |
| **Content import archives** (ZIP, staging blobs) | Large | No | Import job id, **key**, state | **Yes** — `imports/staging/{jobId}/…` | Short TTL; delete after successful import or failure cleanup. |
| **Downloadable PDFs** (guides, syllabi) | Medium–large | No | Product/entitlement + **key** or signed URL policy | **Yes** — `downloads/` or `premium/pdfs/` | Serve via **signed URL** or **auth-checked** API route; avoid public ACL if paywalled. |
| **Admin / analytics reports** | Medium | No | Report metadata, recipient, **key** | **Yes** — `reports/admin/{yyyy}/{mm}/…` | Restrict with role checks; optional expiry. |
| Secrets, API keys | Tiny | **Never** | Encrypted fields if any | No | Env / secret manager only. |

**Rule of thumb:** if it is **binary**, **large**, or **high-churn**, it belongs in **Spaces** (or a future dedicated bucket). If it is **structured text** and part of the curriculum, it belongs in **DB + content pipeline**, with **pointers** to media in Spaces.

---

## 2) Code and environment (current + recommended)

### Implemented today

| Mechanism | Location |
|-----------|----------|
| S3-compatible upload (WebP compression for images) | `src/lib/storage/*`, `putBufferToSpaces` uses **`ACL: public-read`** → objects are **public via CDN** once uploaded. |
| Admin upload API | `POST /api/admin/storage/upload` |
| Marketing CDN / proxy | `src/app/api/marketing-assets/[...path]/route.ts` — **allowlisted** keys only (`screenshots/`, `brand/`, `branding/`, or safe root filenames). |
| URL ↔ key parsing for orphan detection | `src/lib/storage/url-to-object-key.ts`, `collect-db-asset-refs.ts` |
| Ops | `npm run ops:storage-report`, `npm run ops:cleanup-spaces-orphans` |

### Environment variables (reference)

| Variable | Purpose |
|----------|---------|
| `SPACES_KEY`, `SPACES_SECRET` | S3 API credentials |
| `SPACES_BUCKET`, `SPACES_REGION`, `SPACES_ENDPOINT` | Bucket and endpoint |
| `SPACES_EXTRA_PUBLIC_BASES` | Extra URL bases when resolving DB-stored URLs to keys |
| `MAX_UPLOAD_BYTES` | Upload cap |
| `SPACES_LIST_MAX_KEYS` | Cap for list/report/orphan scans |
| `NEXT_PUBLIC_MARKETING_USE_SPACES_PROXY` | If `true`, rewrite marketing image URLs to same-origin proxy (private bucket) |
| `NEXT_PUBLIC_MARKETING_USE_SPACES_PROXY_FALLBACK` | Retry failed direct CDN loads via proxy |

Full table: `docs/storage-strategy.md`.

### Recommended extensions (when you add exports / premium PDFs)

1. **Private objects for paywalled files**  
   - Option A: **Presigned GET** URLs (short TTL) issued only after server-side entitlement check.  
   - Option B: **Authenticated route** streams from S3 (similar to marketing proxy) with **allowlist** or **DB-backed key** per resource.  
   - Avoid relying on `public-read` for premium assets; current admin upload sets public-read — **acceptable for non-sensitive marketing/admin images**; **not** for subscriber-only PDFs.

2. **Prefixes** (convention — align orphan cleanup and lifecycle):

   | Prefix | Use |
   |--------|-----|
   | `exports/` | User or admin export blobs (set **Lifecycle** rule or job-driven delete). |
   | `imports/staging/` | Short-lived import ZIPs; aggressive TTL. |
   | `reports/admin/` | Generated reports; optional TTL. |
   | `premium/` or `downloads/` | Paywalled PDFs — **private ACL** + signed or proxy. |

3. **Lifecycle (bucket policy)**  
   - Configure **DigitalOcean Spaces lifecycle rules** on `imports/staging/` and `exports/` (e.g. delete after 7–30 days unless referenced).  
   - Document exceptions (`screenshots/`, `branding/` — **never** auto-delete without product sign-off).

4. **CDN**  
   - Public marketing assets: `https://<bucket>.<region>.cdn.digitaloceanspaces.com/<key>` (or custom CDN in front).  
   - Do **not** expose raw bucket listing; app surfaces **URLs**, not directory trees.

---

## 3) Access-control model

| Audience | Delivery | How |
|----------|----------|-----|
| **Public marketing** | CDN directly or marketing proxy | Public CDN URL in HTML; if bucket is private, use `/api/marketing-assets/...` (already allowlisted). |
| **Logged-in free users** | Same as public for non-premium assets | No secret URLs in client bundles. |
| **Subscribers / entitled users** | **Signed URL** or **auth route** | Server checks entitlement → presigned GET (e.g. 5–15 min) or stream via server. |
| **Admins** | Admin session + upload API | Existing admin routes; restrict by role. |
| **Background jobs** | Server-only credentials | `SPACES_*` only on server; never in `NEXT_PUBLIC_*`. |

**Avoid:** embedding long-lived secret URLs in client code; exposing **unrestricted** proxy paths to the whole bucket (marketing proxy is **prefix-allowlisted** — keep that pattern).

---

## 4) Migration plan for existing assets

### 4.1 Inventory

1. Run **`npm run storage:check`** (or project equivalent) for large files under `public/` / tracked binaries.  
2. Grep for legacy **`gs://`** or hard-coded bucket URLs; replace with HTTPS or app-relative proxy paths per `docs/storage-strategy.md`.  
3. List DB columns that store URLs (`BlogPost.coverImage`, `ExamQuestion.images`, `ContentItem.content`, etc.) — already collected for orphan cleanup.

### 4.2 Move bytes off Git

1. For each large tracked file: upload to Spaces under the correct **prefix** (see matrix).  
2. Replace references in code/config with **CDN URL** or **`/api/marketing-assets/...`** when using the proxy.  
3. Remove binary from Git: **`git rm`** and ensure **`.gitignore`** covers build/import/output dirs.  
4. If history bloat matters, plan **`git filter-repo`** (or BFG) in a maintenance window — see `docs/HISTORY_REMEDIATION.md` if present.

### 4.3 DB updates

1. Update stored URLs to canonical HTTPS form matching `SPACES_EXTRA_PUBLIC_BASES` / default CDN origin.  
2. For exam/question media, prefer **stable keys** + resolver if you ever change CDN domain.

### 4.4 Cleanup

1. **`npm run ops:cleanup-spaces-orphans -- --prefix=uploads/`** (dry-run first).  
2. Use **`--protect-prefixes=screenshots/,branding/,brand/,replit-export/`** as appropriate.  
3. After imports land under `imports/staging/`, add that prefix to periodic dry-run cleanup once TTL/job confirms deletion.

### 4.5 Verification

1. Spot-check CDN URLs in staging.  
2. Confirm paywalled assets are **not** `public-read` if you introduce private delivery.  
3. Re-run storage report and orphan script after migration.

---

## Summary

- **Git:** code + small text; not large binaries.  
- **DB:** metadata, entitlements, and **pointers** to objects.  
- **Spaces:** all large/media bytes with **clear prefixes**, **lifecycle** for ephemeral data, and **allowlisted or signed** access — never raw bucket browsing.
