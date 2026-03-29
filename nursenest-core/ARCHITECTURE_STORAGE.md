# Storage boundary (runtime scalability)

This document defines **where content and binaries live** so the app container stays small and does not grow with test banks, blog posts, or media.

**Related docs**

| Doc | Purpose |
|-----|---------|
| [docs/STORAGE_POLICY.md](docs/STORAGE_POLICY.md) | Enforceable rules (no repo blobs, no public as CMS, etc.) |
| [docs/CONTENT_WORKFLOWS.md](docs/CONTENT_WORKFLOWS.md) | End-to-end workflows by content type (blog, questions, media, …) |
| [docs/STORAGE_OPERATIONS.md](docs/STORAGE_OPERATIONS.md) | Checklists: add content, clean artifacts, debug growth |

## App container (deploy artifact)

**Keep:** application code, Prisma client, Next.js output, minimal static fallbacks (`public/marketing/hero-fallback.svg`, `public/branding/*` small marks), and optional merged locale JSON under `public/i18n` (or load via `MARKETING_I18N_CDN_BASE`).

**Do not use for:** bulk questions, lessons, blog bodies, allied content, large exports, or multi‑MB media. Those belong in **PostgreSQL** or **DigitalOcean Spaces**.

## PostgreSQL (structured content)

| Domain | Storage |
|--------|---------|
| Users, sessions (JWT claims), entitlements | DB |
| Exam questions, flashcards, lessons (`content_items`), categories, exams | DB |
| Blog posts (HTML/MD body, metadata, tags) | DB |
| Admin/config, background jobs, AI drafts | DB |
| Allied health content | Same tables / tiers as existing content model (`tier`, `exam` columns) |

Growth in these tables **does not increase container disk**; it increases database storage only.

## DigitalOcean Spaces (CDN + private proxy)

| Asset type | Pattern |
|------------|---------|
| Logos, hero images, marketing screenshots | `NEXT_PUBLIC_MARKETING_CDN_BASE` / catalog URLs; optional `/api/marketing-assets/*` with `SPACES_KEY` / `SPACES_SECRET` |
| Blog inline images | Prefer absolute CDN URLs in post body; new uploads should target Spaces (presigned upload or admin pipeline) |
| Downloadable exports, large PDFs/ZIPs | Spaces object keys + signed URLs; never commit to `public/` |

See `src/lib/marketing/spaces-proxy-env.ts` and `next.config.ts` `images.remotePatterns`.

## Repo / CI (not production runtime)

Large folders at **monorepo root** (`attached_assets/`, legacy `client/`, `.local/`, full `.git/`) are **not** part of the DigitalOcean `source_dir: nursenest-core` deploy. They still affect **developer disk**; use `npm run disk:audit` and `.gitignore` patterns.

## Anti-patterns (avoid)

- Writing reports or generated JSON **into the app directory in production** (use DB, Spaces, or ephemeral logging only).
- **Unbounded `findMany`** for public or admin list UIs (use pagination + caps).
- **Build-time static generation** of unbounded route matrices (locale × slug). Programmatic locale routes use ISR (`generateStaticParams` empty + `revalidate`).
- Storing production question/blog dumps as giant JSON **inside** `nursenest-core/public` (use DB + optional CDN for bundles).

## Operational scripts

- `npm run disk:audit` — largest paths under `nursenest-core` and build outputs.
- `npm run storage:check` — warn on oversized `public/` files; `npm run storage:check -- --strict` fails CI if non‑i18n assets exceed 512 KiB.
- `npm run build:deploy` — build then removes `.next/cache` (see `scripts/post-build-prune.mjs`).
- `npm run clean:next` — remove `.next` locally when reclaiming disk.

## Runtime resilience (summary)

- **Homepage** — `/api/public/home-stats` uses **counts** only, not full table scans of content.
- **Sitemaps** — blog URLs capped (50k); static sitemap builders avoid Prisma where possible.
- **Admin** — list routes use **pagination** (questions, lessons, exams, flashcards, drafts).
- **Optional failures** — DB optional reads log and degrade where patterns exist (`safePrismaCount`, blog fallbacks).
