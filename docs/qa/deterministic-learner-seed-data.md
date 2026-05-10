# Deterministic QA / screenshot learner data

This document ties together **existing** seed and reset tooling so marketing screenshots, Playwright paid suites, and weak-area flows have predictable prerequisites — **without** weakening production validation or inventing parallel auth.

## Required environment variables

| Variable | Used by | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | Prisma (all scripts) | Read/write user, subscription, progress |
| `AUTH_SECRET` or `NEXTAUTH_SECRET` | Next.js / Auth.js | Session signing for local dev and capture login |
| `AUTH_URL` / `NEXTAUTH_URL` | Auth.js (often set by Playwright webServer) | Callback URLs |
| `SCREENSHOT_DEMO_EMAIL` / `SCREENSHOT_DEMO_PASSWORD` | `capture-marketing-screenshots.mjs`, `seed-screenshot-demo-user.ts` | Demo learner login (defaults documented in those files) |
| `SCREENSHOT_DEMO_PATHWAY_ID` | Screenshot seed + slot routes | Pathway for demo subscription (default `ca-rn-nclex-rn`) |
| `E2E_PAID_EMAIL` / `E2E_PAID_PASSWORD` (or `PLAYWRIGHT_TEST_*`) | Paid Playwright, `qa-paid-test-account-reset.mts` | Synthetic subscriber for E2E |
| `ALLOW_QA_PAID_TEST_RESET=1` | `qa-paid-test-account-reset.mts` | Safety gate for DB writes |
| `FLASHCARDS_PREMIUM_E2E_IMAGE_DECK_SLUG` | `flashcards-premium-interaction.spec.ts` | Optional deck with `https` clinical figures for image assertions |

**AI / env validation:** Local `next dev` may still fail fast if your `.env.local` enables strict AI bootstrap. That is **application policy**, not something these QA scripts disable. Supply the keys your branch expects, or use a documented local-only profile — see the Next dev terminal for `[ENV VALIDATION ERROR]` lines.

## Scripts (canonical)

1. **Screenshot demo learner** (entitled subscriber row + demo flags, no schema invention beyond existing models):

   ```bash
   cd nursenest-core
   DATABASE_URL="…" npx tsx scripts/seed-screenshot-demo-user.ts
   ```

2. **Paid Playwright fixture reset** (synthetic Stripe prefix, onboarding-complete fields):

   ```bash
   cd nursenest-core
   ALLOW_QA_PAID_TEST_RESET=1 DATABASE_URL="…" npx tsx scripts/qa-paid-test-account-reset.mts
   ```

3. **App readiness** (before capture or Playwright):

   ```bash
   cd nursenest-core
   npm run wait:app:ready
   ```

4. **Single dev server on port 3000**:

   ```bash
   cd nursenest-core
   npm run dev:next:3000
   ```

## Deterministic content goals (incremental)

| Area | Current source of truth | Next steps (when extending) |
|------|-------------------------|-----------------------------|
| Flashcards | Published decks + `seed-screenshot-demo-user` pathway | Add/curate decks with **image** + **no-image** + weak signals; set `FLASHCARDS_PREMIUM_E2E_IMAGE_DECK_SLUG` in CI secrets |
| Weak areas | Question/flashcard review telemetry in DB | Use QA reset + scripted attempts (existing analytics paths) — avoid one-off production DB assumptions |
| CAT / practice | `qa-paid-test-account-reset` + practice session APIs | Keep using synthetic sessions; document `SCREENSHOT_CAT_SESSION_PATH` overrides in capture JSON |
| ECG / dashboards | Entitled user + seeded progress where models exist | Same DB; extend reset script only with reviewed migrations |

## Screenshot artifact layout

Marketing slot captures default to:

`docs/screenshots/marketing-slot-captures/`

Visual regression baselines (Playwright `toHaveScreenshot` with explicit paths) default to:

`docs/screenshots/visual-regression-baseline/`

Both live under **git root** `docs/screenshots/` (see root `.gitignore` for PNG policy).
