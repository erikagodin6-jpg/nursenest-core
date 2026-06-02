# Entitlement / paywall audit (backend pass)

This pass tightens **server-side** tier rules so premium surfaces align with product rules and are harder to bypass via direct URLs.

## Business rules (enforced in `server/paywall-tier-rules.ts`)

| User tier | Lessons (slug tiers) | Nursing flashcard bank (`/api/question-bank/study`) | Nursing `exam_questions` (custom practice) | Allied pool (`allied_questions`) |
|-----------|----------------------|------------------------------------------------------|---------------------------------------------|-----------------------------------|
| free | `free` only | `free` only | _(no practice pool)_ | no |
| rpn | `free`, `rpn` | `free`, `rpn` | `rpn` | no |
| rn | `free`, `rpn`, `rn` | `free`, `rpn`, `rn` | `rpn`, `rn` | no |
| np | `free`, `rpn`, `rn`, `np` | `free`, `rpn`, `rn`, `np` | `rpn`, `rn`, `np` | no |
| allied | `free`, `allied` | _(empty — returns `[]`)_ | _(no nursing rows)_ | yes |
| imaging | `free`, `imaging` | `free`, `imaging` | `imaging` | no |
| full_access / certification_prep / new_grad_toolkit | broad (see code) | `free`, `rpn`, `rn`, `np` | `rpn`, `rn`, `np`, `lvn` | yes |
| admin | all | `free`, `rpn`, `rn`, `np` | no SQL tier filter (full nursing pool) | yes |

**Fixes vs prior behavior**

- **NP lessons** previously omitted `rpn` in the allowlist; NP now receives full nursing ladder (`rpn`, `rn`, `np`).
- **`GET /api/question-bank/study`** previously gave NP only `free` + `np` (missing `rpn`/`rn`); now uses the same ladder as lessons for nursing tiers. **Allied** subscribers get an empty list (this route is nursing CAT flashcards), not a mix of free-tier nursing rows.
- **`POST /api/practice-sessions`** previously merged **all** `exam_questions` with **all** `allied_questions` for every paid tier. **Allied** users now only draw from `allied_questions`. Nursing users get `exam_questions` filtered by **`tier`** (with admin/tester unrestricted). **Bookmarks** are filtered the same way.

## Other changes

- **`resolveEntitlementSync` / `any_premium`:** `allied` and `imaging` are included in `PAID_TIERS` so subscription status matches `requireAnyPaidTier`.

## Files touched

- `server/paywall-tier-rules.ts` — central rules
- `server/lesson-content-api.ts` — lesson allowlist uses shared helper
- `server/routes.ts` — question-bank study uses shared flashcard bank tiers
- `server/premium-study-routes.ts` — practice sessions + `buildQuestionQuery` nursing tier filter
- `server/entitlements.ts` — `PAID_TIERS`
- `scripts/replit-import/nursing-ai-cache-extract.ts` — TS narrowing (unblocks `check:server` via import graph)

## Validation

Run `npm run check:server` after changes.

`tsconfig.server.json` excludes `server/seed-replit-json-imports.ts` so optional Replit import tooling does not pull unfinished `scripts/` graph into the server typecheck.
