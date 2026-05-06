# Local DB script environment setup

Next.js loads `.env*` files for the app runtime, but standalone `node`, `tsx`, and Prisma CLI scripts run outside the Next.js runtime. Those processes must load database environment variables explicitly before importing `PrismaClient` or modules that create the shared Prisma singleton.

Use the centralized script bootstrap for DB scripts:

- `scripts/bootstrap-env.mjs` loads env files in this order without printing secret values:
  1. `nursenest-core/.env.local`
  2. `nursenest-core/.env`
  3. repo root `.env.local`
  4. repo root `.env`
- `DATABASE_URL` is required for DB mutation/audit/generation scripts.
- `DIRECT_URL` is optional; diagnostics report whether it is present.

Safe commands:

```bash
npm run env:check
npm run generate:flashcards:dry
npm run generate:flashcards -- --min=50
npx tsx scripts/normalize-exam-question-exam-values.ts --dry-run
npx tsx scripts/normalize-exam-question-exam-values.ts
```

If `npm run env:check` reports `DATABASE_URL set: no`, export `DATABASE_URL` in the shell or add it to a gitignored env file listed above before running Prisma/DB maintenance scripts.
