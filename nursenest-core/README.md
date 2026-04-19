# NurseNest Core

Production-focused NurseNest rebuild using Next.js App Router, TypeScript, Tailwind, Prisma, NextAuth, and Stripe.

**Canonical Git remote:** [github.com/erikagodin6-jpg/nursenest-core](https://github.com/erikagodin6-jpg/nursenest-core) — branch `main`. Deploys (e.g. DigitalOcean App Platform) use this repository with **`source_dir: nursenest-core`**. Do not push production work to any other GitHub repo.

## Storage & content (scalability)

Growing content (**questions, flashcards, lessons, blog, media**) must not bloat the **deploy container**. See:

- `ARCHITECTURE_STORAGE.md` — app vs **Postgres** vs **Spaces/CDN**
- `docs/STORAGE_POLICY.md` — enforceable rules
- `docs/CONTENT_WORKFLOWS.md` — how to add blog posts, test banks, media safely
- `docs/STORAGE_OPERATIONS.md` — checklists (imports, uploads, cleanup)

Commands: `npm run disk:audit`, `npm run storage:check` (use `storage:check:strict` in CI).

## Disk & build (avoid ENOSPC)

- **Symptom:** `ENOSPC` while writing `.next` — usually the host volume is nearly full (check with `df -h`).
- **Clean:** `npm run clean:build` removes `.next`, `dist`, `build`, and `out` under this package.
- **Build:** `npm run build` sets `TMPDIR=${TMPDIR:-/tmp}` so Turbopack/Next temp files use a writable path when defaults are tight.
- **Deploy (App Platform):** the Node buildpack runs `npm run build` first; `build:deploy` then verifies the standalone artifact and runs `post-build-prune.mjs` (drops `.next/cache`). For a **single** local command that includes `next build`, use `npm run build:deploy:full`.
- **Monitor:** keep several GB free on the volume that holds the repo and `~/.npm`; prune old `node_modules` copies if needed.

### Build directory & monorepo root

- **Working directory:** Run `npm run build` and `npm run dev` from **`nursenest-core/`** (the directory that contains this `package.json` and `next.config.ts`). A nested clone like `…/nursenest-core/nursenest-core/` is fine as long as commands run from the **inner** app folder that holds `next.config.ts`.
- **Tracing roots:** `next.config.ts` sets `turbopack.root` and `outputFileTracingRoot` to the **parent** of the app package so monorepo/shared imports and lockfile resolution stay consistent (see inline comments there). Do not point those roots only at `nursenest-core` unless you know you are changing the import graph.
- **Deploy:** Keep **`source_dir` / app root** (e.g. DigitalOcean App Platform) set to **`nursenest-core`**, matching local builds.

## Stability-First Architecture

- Route isolation:
  - Marketing: `/`, `/pricing`, `/login`, `/signup`
  - Learner app: `/app/*`
  - Admin: `/admin`
- Server Components by default.
- Server-side entitlement resolver at `src/lib/entitlements/resolve-entitlement.ts`.
- No service worker, no custom bundle caching, no Docker requirement.
- Health endpoint: `/api/health` (degraded-safe if DB unavailable).

## Local Setup

1. Copy environment template:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client:

```bash
npm run db:generate
```

4. Run migrations:

```bash
npm run db:migrate
```

5. Seed sample data (CA/US + RPN/LVN-LPN/RN/NP):

```bash
npm run db:seed
```

6. Start dev server:

```bash
npm run dev
```

## Prisma Models

- `User`
- `Subscription`
- `Category`
- `Lesson`
- `Question`
- `Exam`
- `ExamAttempt`
- `Progress`

## Stripe + Entitlement

- Checkout API: `src/app/api/subscriptions/checkout/route.ts`
- Webhook API: `src/app/api/subscriptions/webhook/route.ts`
- Entitlement is always enforced server-side.
- Grace period status preserves access on delayed webhook updates.

## SEO

- Metadata API configured in `src/app/layout.tsx`.
- `robots.txt` via `src/app/robots.ts`.
- `sitemap.xml` via `src/app/sitemap.ts` with public routes only.

## DigitalOcean App Platform Deployment

This app is designed to deploy directly from GitHub without Docker.

- Build command:

```bash
npm run build
```

- Run command:

```bash
npm start
```

(`package.json` runs the **standalone** server from `.next/standalone/` — required because `next.config.ts` sets `output: "standalone"`. `PORT` is read from the environment, e.g. App Platform `8080`.)

Environment variables to set in DigitalOcean (see also `.env.example`):
- **`DATABASE_URL`** (secret) — DigitalOcean Managed PostgreSQL URI; canonical for Prisma at runtime.
- `AUTH_SECRET`, `AUTH_URL` (Auth.js)
- `NEXT_PUBLIC_APP_URL` (optional)
- Stripe keys as needed

Migrations: run the **Prisma migrate** GitHub Action with repository secret **`DATABASE_URL`** matching App Platform (same database).

## Selective Salvage Summary

See `SALVAGE_AUDIT.md` for exactly what was reused, rewritten, and intentionally discarded.
