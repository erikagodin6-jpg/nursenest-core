# Local verification & repair — developer handoff

Concise reference for **HTTP smoke checks**, **strict learner verification**, and **local seed data** after the core verification/repair pass (2025–2026).

---

## What was fixed (summary)

- **Exam delivery vs DB:** `POST /api/exam/start` and related routes expect an **`exam_attempts`** table. Some environments only had **`mock_exam_attempts`**. The server now ensures **`exam_attempts`** exists when exam delivery routes register (`server/exam-delivery.ts` + `await registerExamDeliveryRoutes` in `server/routes.ts`).
- **Verify script contract:** Strict mode treats **`422` + `QUESTION_POOL_EMPTY`** on exam start as a coherent empty-pool outcome; admin checks **prime lazy `/api/admin/*` routes** before assertions.
- **Safe mode vs verify:** Core read/write paths used by verify (e.g. **`/api/decks`**, **`/api/exam/`**, flashcard bank/preview, progress) are aligned with safe-mode allowlists where needed (`server/platform-resilience.ts`).
- **Abuse / bot middleware:** Local dev requests can bypass heavy bot/abuse blocks so `curl` and verify scripts are not false-positive blocked.
- **Lesson routes:** Lesson content API routes are mounted so `/api/lessons/*` works for verify.
- **Server isolation:** Server TypeScript build excludes `client/src/**`; guardrails enforce **no static `client/src` imports** under `server/`.

---

## What verification passes today

With a running server, database, and (for learner strict) a valid bearer + user id:

- **Unauthenticated:** `healthz`, `/api/test`, lessons meta/search, sitemap (soft checks where applicable).
- **Strict learner (`VERIFY_STRICT=1` + `VERIFY_BEARER` + optional `VERIFY_USER_ID`, lesson slug, exam template, flashcard deck id):** flashcard preview/bank, deck + cards, progress/usage, dashboard summary, **full mock exam flow** (start → questions → answer → submit) when data exists.

Script: `scripts/verify-core-api.ts` (see env vars in file header).

---

## Local commands (going forward)

| Step | Command | Notes |
|------|---------|--------|
| Schema (Drizzle) | `npm run db:push` | Apply DB schema when migrations/push are part of your workflow. |
| Seed minimal verify data | `npm run seed:local-verify` | Inserts RN template `local-rn-template-01`, published RN exam questions, public smoke deck + cards, optional `flashcard_bank` row. Prints **`VERIFY_FLASHCARD_DECK_ID`**. Requires **`DATABASE_URL`** in `.env`. |
| Dev server | `npm run dev` | Default listen **port 5001** in this project. Restart after pulling server changes (e.g. safe-mode list, route registration). |
| Server typecheck | `npm run check:server` | `tsc --noEmit -p tsconfig.server.json` |
| Guardrails | `npm run check:server:guardrails` | Storage sanity + server/client import isolation + `check:server` |
| API verify (smoke) | `npm run verify:api` | Same as `tsx scripts/verify-core-api.ts`; set env vars as needed. |

---

## How to seed local verify data

1. Ensure `.env` has **`DATABASE_URL`** (and SSL settings your host expects).
2. Run:

   ```bash
   npm run seed:local-verify
   ```

3. Copy from the output:
   - **`VERIFY_EXAM_TEMPLATE_ID=local-rn-template-01`**
   - **`VERIFY_FLASHCARD_DECK_ID=<uuid>`** (stable for the same DB once the deck row exists).

Re-running is idempotent for the template and skips re-seeding exam rows when enough RN published questions already exist.

---

## How to run **strict** learner verify

Use a **real** learner JWT (or Replit/session token the server accepts) and matching **`VERIFY_USER_ID`** when the script checks `/api/progress/:userId` and related routes.

```bash
VERIFY_API_BASE=http://127.0.0.1:5001 \
VERIFY_STRICT=1 \
VERIFY_BEARER="<learner JWT or user token>" \
VERIFY_USER_ID="<uuid matching token sub / user>" \
VERIFY_LESSON_SLUG="<slug from /api/lessons/meta or static index>" \
VERIFY_EXAM_TEMPLATE_ID=local-rn-template-01 \
VERIFY_FLASHCARD_DECK_ID="<uuid from seed output>" \
npx tsx scripts/verify-core-api.ts
```

Optional:

- **`VERIFY_EXPECT_ENTITLED=true|false`** — flashcard-bank entitlement expectation.
- **`VERIFY_ADMIN_BEARER`** — admin checks (primes lazy admin routes; see script comments).

---

## Known caveats

- **Real learner token vs minted token:** Automated runs sometimes mint a JWT with **`ADMIN_JWT_SECRET`** for a DB user. That is **only for local automation**; production-like checks should use tokens issued by your real login/signup flow so claims and session behavior match production.
- **Safe mode / emergency mode:** If global safe mode is on, behavior depends on current allowlists. After changing resilience config, **restart `npm run dev`**.
- **`server/storage.ts`:** Do **not** overwrite or truncate this file; guardrails include **`npm run check:storage`**.
- **Deck UUID:** `VERIFY_FLASHCARD_DECK_ID` is **per database** until you re-seed into a new DB (then copy the new UUID from seed output).

---

## Troubleshooting

### Missing `DATABASE_URL`

- **Symptom:** Seed script throws; server fails to connect.
- **Fix:** Set `DATABASE_URL` in `.env` (and `DB_SSL` if you need to force SSL on/off for local Postgres).

### Port 5001 in use

- **Symptom:** `EADDRINUSE` or verify hits wrong process.
- **Fix:** `lsof -i :5001` (or equivalent), stop the old process, or set `VERIFY_API_BASE` to the port your server actually uses.

### Empty verify data (exam / flashcards)

- **Symptom:** `QUESTION_POOL_EMPTY`, empty flashcard bank, 404 on deck.
- **Fix:** Run **`npm run seed:local-verify`**. Confirm template id **`local-rn-template-01`** and the printed **`VERIFY_FLASHCARD_DECK_ID`**. Run **`npm run db:push`** if schema is behind.

### Auth / token mismatch

- **Symptom:** 401 on learner routes; progress checks fail when **`VERIFY_USER_ID` ≠ token `sub`**.
- **Fix:** Use a token from real **`/api/login`** (or your auth path) and set **`VERIFY_USER_ID`** to that user’s id. Ensure **`ADMIN_JWT_SECRET`** matches between token minting and server if you mint locally.

---

## Related files (reference only)

- `scripts/verify-core-api.ts` — verify entrypoint and env documentation.
- `scripts/seed-local-verify-data.mjs` — minimal DB seed for verify.
- `package.json` scripts: `seed:local-verify`, `verify:api`, `check:server`, `check:server:guardrails`, `db:push`.

No further code changes are required for routine use of this handoff; update this doc if verify contracts or scripts change.
