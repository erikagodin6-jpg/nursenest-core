# Authenticated QA screenshot matrix

PNG artifacts for **logged-in** learner shells (dashboard, practice hub, flashcards). Follows repo screenshot policy under `docs/screenshots/` (see `docs/screenshots/README.md`).

## Preconditions

1. **Database:** same `DATABASE_URL` as the Next dev server / Playwright `webServer`.
2. **Account:** run `ALLOW_QA_PAID_TEST_RESET=1 npx tsx scripts/qa-paid-test-account-reset.mts` for the email you pass to Playwright (`E2E_PAID_EMAIL` / `QA_PAID_*` / `PLAYWRIGHT_TEST_*`).
3. **Study seed:** `npm run seed:auth-qa` (from `nursenest-core/` package) — optional `AUTH_QA_USER_EMAIL` to target a different learner than `E2E_PAID_*`.
4. **Server:** `npx next dev` on the same origin as `PLAYWRIGHT_BASE_URL` / `BASE_URL`, then `node scripts/qa/wait-for-app-ready.mjs` if you want an explicit HTTP gate.
5. **Auth storage:** `npm run visual-qa:auth` (writes learner storage JSON used by visual QA).

## Capture command

```bash
cd nursenest-core
npm run test:e2e:visual-qa-authenticated-baseline -- --update-snapshots
```

First run creates PNGs beside this README via absolute paths in the spec. **Re-review** images before committing if your `.gitignore` allows PNGs here.

## Matrix (routes × themes × viewports)

| Surface | Route | Themes | Viewports | Auth | Expected seed state |
|--------|--------|--------|-----------|------|----------------------|
| Dashboard | `/app` | ocean, blossom, midnight | desktop 1280×800; ocean only mobile 390×844 | Paid session | Weak/strong topic stats; readiness strip data |
| Practice hub | `/app/practice-tests?pathwayId=us-rn-nclex-rn` | ocean, blossom, midnight | desktop | Paid | Hub chrome; optional CAT entry from seeded sessions |
| Flashcards | `/app/flashcards?pathwayId=us-rn-nclex-rn` | ocean, blossom, midnight | desktop | Paid | Deck `nn-auth-qa-e2e-deck` + image/text cards |

## Env reference

| Variable | Role |
|----------|------|
| `DATABASE_URL` | Prisma + app |
| `E2E_PAID_EMAIL` / `E2E_PAID_PASSWORD` (or QA / PLAYWRIGHT aliases) | Playwright + seed email resolution |
| `AUTH_QA_USER_EMAIL` | Optional override for `seed:auth-qa` only |
| `AUTH_QA_SEED_RESET=1` | Delete tagged seed rows before re-insert |
| `PLAYWRIGHT_BASE_URL` | `wait-for-app-ready` + Playwright |

## Placeholders

If you cannot run a live capture, keep this README and **do not** create ad-hoc folders outside `docs/screenshots/`.
