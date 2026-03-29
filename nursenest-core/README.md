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

Environment variables to set in DigitalOcean:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Selective Salvage Summary

See `SALVAGE_AUDIT.md` for exactly what was reused, rewritten, and intentionally discarded.
