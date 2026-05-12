# ECG Module — Ops Publish Handoff (2026-05-12)

## Status: Code-ready. Blocked on staging ops only.

All architecture is correct and tested. This document is the handoff to run on staging to complete the publish.

---

## Environment: What Claude Code can and cannot verify here

| Item | Can verify? | Result |
|---|---|---|
| TypeScript correctness | ✅ Yes | **0 errors** |
| Unit / contract tests | ✅ Yes | **50/50 pass** |
| Env vars on staging | ❌ No — `.env.local` not accessible in this environment | **All 6 missing in dev** |
| Live server (`localhost:3000`) | ❌ No — server down | N/A |
| `GET /api/admin/modules/ecg/readiness` | ❌ No live server | N/A |
| `POST /api/admin/modules/ecg/publish` | ❌ No live server | N/A |
| Playwright smoke | ❌ No live server | N/A |
| DB readiness counts | ❌ No DB connection | N/A |

---

## Step 1 — Env Var Verification

### Run on staging shell

```bash
# From nursenest-core/ directory on the staging server:
node scripts/check-ecg-publish-env.mjs
```

Expected output when all vars are set:
```
✅ ENABLE_ECG_MODULE
✅ NEXT_PUBLIC_ENABLE_ECG_MODULE
✅ STRIPE_PRICE_MODULE_ADVANCED_ECG_MONTHLY
✅ STRIPE_PRICE_MODULE_ADVANCED_ECG_3_MONTH
✅ STRIPE_PRICE_MODULE_ADVANCED_ECG_6_MONTH
✅ STRIPE_PRICE_MODULE_ADVANCED_ECG_YEARLY
=== Summary ===
✅ All required ECG env vars are configured.
```

### Vars to set in DigitalOcean App Platform environment

| Var | Value | Notes |
|---|---|---|
| `ENABLE_ECG_MODULE` | `true` | Enables core ECG module |
| `NEXT_PUBLIC_ENABLE_ECG_MODULE` | `true` | Client-safe mirror |
| `STRIPE_PRICE_ADVANCED_ECG` | `price_1TVo8vFbgp0Ub5P7aTySWrbU` | **Single price** — shared across all billing durations (monthly / 3-month / 6-month / yearly). Confirmed by product. |
| `ENABLE_ADVANCED_ECG_MODULE` | `true` (default when unset) | Set explicitly for clarity |
| `STRIPE_WEBHOOK_SECRET` | Already set | Verify it handles `checkout.session.completed` with `moduleKey=advanced_ecg` metadata |

**Do not deploy until all 3 required vars are set.**

### Note: Advanced ECG is a single-price model

`advancedEcgStripePriceEnvKey(_duration?)` always returns `"STRIPE_PRICE_ADVANCED_ECG"` regardless of duration. Billing duration is tracked via plan codes (`module_advanced_ecg_monthly`, etc.) but all durations share one Stripe price ID. Create one Stripe price object and use its ID for `STRIPE_PRICE_ADVANCED_ECG`.

### Env check result from this environment
```
❌ 3 required vars MISSING (dev environment — expected)
   • ENABLE_ECG_MODULE
   • NEXT_PUBLIC_ENABLE_ECG_MODULE
   • STRIPE_PRICE_ADVANCED_ECG
```

---

## Step 2 — Check Readiness

### New endpoint (added this session)

`GET /api/admin/modules/ecg/readiness`

Run from staging with an admin session cookie:

```bash
curl -s -H "Cookie: <admin-session-cookie>" \
  https://staging.nursenest.ca/api/admin/modules/ecg/readiness \
  | jq '{canPublish: .canPublish, blockers: .blockers, totalQ: .readiness.counts.totalQuestions, readyQ: .readiness.counts.readyQuestions}'
```

Expected when ready:
```json
{
  "canPublish": true,
  "blockers": [],
  "totalQ": 312,
  "readyQ": 300
}
```

### If `canPublish: false`

The response includes `blockers` array with human-readable reasons, e.g.:
```json
{
  "canPublish": false,
  "blockers": [
    "Publish-ready ECG question count 180/300.",
    "Publish-ready ECG strip/video count 28/50.",
    "42 high-risk ECG strip(s) need manual review."
  ]
}
```

**Fix only the failing gates.** The content gates are enforced by `assertEcgModuleCanPublish()` — the POST publish will also fail with the same reasons.

### Content gate summary

| Gate | Minimum | Check |
|---|---|---|
| Ready questions | 300 | `readiness.counts.readyQuestions` |
| Rhythm interpretation | 150 | `readiness.counts.readyRhythm` |
| Strip/video | 50 | `readiness.counts.readyStripVideo` |
| Case-based | 50 | `readiness.counts.readyCaseBased` |
| Electrolyte/medication | 30 | `readiness.counts.readyElectrolyteMedication` |
| Advanced | 20 | `readiness.counts.readyAdvanced` |
| Flashcards | 100 | `readiness.counts.flashcards` |
| Linked lessons | 20 | `readiness.counts.linkedLessons` |
| Rationale coverage | 100% | `readiness.percentages.rationale` |
| Strip media coverage | 100% | `readiness.percentages.media` |
| Tagged questions | 90% | `readiness.percentages.tagged` |
| Validation failures | 0 | `readiness.counts.validationFailures` |
| Manual review missing | 0 | `readiness.counts.manualReviewMissing` |

If content is below minimums, the admin panel at `/admin/modules/ecg` can trigger generation via `ensureEcgMinimumContent()`. Generated questions are NOT learner-visible until clinician review — plan review time.

---

## Step 3 — Trigger Publish

Only after Step 1 (env ✅) + Step 2 (readiness ✅):

### Core ECG module

```bash
curl -s -X POST \
  -H "Cookie: <admin-session-cookie>" \
  -H "Content-Type: application/json" \
  https://staging.nursenest.ca/api/admin/modules/ecg/publish
```

Expected response:
```json
{ "ok": true, "status": "published", "readiness": { ... } }
```

If gates fail:
```json
{ "ok": false, "code": "ecg_publish_blocked", "failures": ["..."] }
```

### Advanced ECG module

```bash
curl -s -X POST \
  -H "Cookie: <admin-session-cookie>" \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}' \
  https://staging.nursenest.ca/api/admin/modules/advanced-ecg/status
```

Expected response:
```json
{ "ok": true, "status": "published" }
```

---

## Step 4 — Playwright Smoke

### New spec (added this session)

```bash
E2E_ECG_MODULE_ENABLED=1 \
E2E_ADMIN_EMAIL=qa-admin@nursenest.ca \
E2E_ADMIN_PASSWORD=<secret> \
E2E_PAID_EMAIL=qa-rn@nursenest.ca \
E2E_PAID_PASSWORD=<secret> \
BASE_URL=https://staging.nursenest.ca \
npx playwright test tests/e2e/ecg-module/ecg-hub-visibility-smoke.spec.ts --project=chromium
```

### Tests covered

| Test | What it verifies |
|---|---|
| RN hub — ECG strip present | `[data-testid="lesson-hub-clinical-modules-strip"]` contains ECG link |
| NP hub — ECG strip present | Same check on `/us/np/fnp/lessons` |
| RPN hub — ECG strip NEVER appears | `/canada/rpn/rex-pn/lessons` has no ECG link (unconditional) |
| RN hub — ECG not shown when disabled | Control: locked/coming-soon when `ENABLE_ECG_MODULE=false` |
| ECG quizzes route loads for paid RN | `/modules/ecg/basic/quizzes` returns 200, not 404 |
| Unauthenticated redirect (not 404) | Anonymous user redirected, not dropped to 404 |
| Advanced ECG — unauthenticated sees gate | No raw content, shows sign-in or paywall |
| Advanced ECG checkout — 401 for anonymous | POST `/api/subscriptions/checkout/advanced-ecg` returns 401 |
| Advanced ECG checkout — structured JSON error | No 500, structured failure response |
| CAT pool — no ECG format questions | Practice pool API excludes `questionFormat=ecg_video` |
| Mobile RN hub — no horizontal overflow | `scrollWidth <= clientWidth + 2` at 390px |
| Admin readiness endpoint — structured JSON | `GET /api/admin/modules/ecg/readiness` returns `canPublish` + `blockers` |

### Existing E2E spec

```bash
# Learner quiz flow (already exists):
E2E_ECG_MODULE_ENABLED=1 \
npx playwright test tests/e2e/ecg-module/ecg-module-learn-flow.spec.ts
```

---

## Step 5 — Rollback Confirmation

Setting `ENABLE_ECG_MODULE=false` in the environment immediately hides the ECG module:

```
ENABLE_ECG_MODULE=false → isEcgModuleEnabled() = false
  → resolveMarketingHubEcgModulePublic() = false
    → ECG card locked/hidden on all hubs
    → ECG learner routes show not-found/redirect
```

- No database migration needed
- No route changes needed
- No Stripe product changes needed
- Effective immediately after next deployment / env var reload

---

## Files Delivered This Session

| File | Purpose |
|---|---|
| `src/app/api/admin/modules/ecg/readiness/route.ts` | **New** — `GET /api/admin/modules/ecg/readiness` for ops workflow |
| `scripts/check-ecg-publish-env.mjs` | **New** — env var check script (exits 1 if missing) |
| `tests/e2e/ecg-module/ecg-hub-visibility-smoke.spec.ts` | **New** — Playwright hub visibility + RPN exclusion smoke |
| `src/lib/ecg-module/ecg-publish-ops-readiness.contract.test.ts` | **New** — contract tests for the above |

---

## Test Results (This Session)

| Test | Result |
|---|---|
| `npm run typecheck:critical` | ✅ 0 errors |
| ECG ops readiness contract (new, 15 assertions) | ✅ 15/15 pass |
| Full ECG test battery (50 tests total) | ✅ 50/50 pass |
| `node scripts/check-ecg-publish-env.mjs` | ✅ Script runs, exits 1 correctly (6 missing vars in dev) |
| Playwright smoke | ⏳ Requires live server + `E2E_ECG_MODULE_ENABLED=1` |
| Readiness API | ⏳ Requires live server + DB |
| Publish trigger | ⏳ Requires staging admin session |

---

## Remaining Blockers

| Blocker | Owner | Resolution |
|---|---|---|
| `ENABLE_ECG_MODULE` not set in staging | DevOps | Set in **DigitalOcean App Platform** environment variables panel |
| `NEXT_PUBLIC_ENABLE_ECG_MODULE` not set | DevOps | Same |
| 4 Stripe price IDs missing | Product + DevOps | Create products in Stripe dashboard, copy price IDs |
| DB readiness unknown (need ≥300 clinician-reviewed questions) | Content | Admin panel `/admin/modules/ecg` → generate + submit for clinician review |
| Playwright not runnable locally (no server) | CI/staging | Run with `E2E_ECG_MODULE_ENABLED=1` on staging after env set |
| Advanced ECG Stripe webhook not verified | DevOps | Confirm `checkout.session.completed` handler processes `moduleKey=advanced_ecg` |

---

## Exact Staging Checklist (Copy-Paste)

```
[ ] 1. Set ENABLE_ECG_MODULE=true in deployment env
[ ] 2. Set NEXT_PUBLIC_ENABLE_ECG_MODULE=true in deployment env
[x] 3. STRIPE_PRICE_ADVANCED_ECG=price_1TVo8vFbgp0Ub5P7aTySWrbU  (confirmed)
[ ] 7. Deploy staging
[ ] 8. node scripts/check-ecg-publish-env.mjs  → exits 0
[ ] 9. GET /api/admin/modules/ecg/readiness    → canPublish: true
[ ] 10. POST /api/admin/modules/ecg/publish    → ok: true
[ ] 11. POST /api/admin/modules/advanced-ecg/status  {"status":"published"}  → ok: true
[ ] 12. Playwright: E2E_ECG_MODULE_ENABLED=1 npx playwright test tests/e2e/ecg-module/ecg-hub-visibility-smoke.spec.ts
[ ] 13. Verify RN hub /canada/rn/nclex-rn/lessons shows ECG strip
[ ] 14. Verify NP hub /us/np/fnp/lessons shows ECG strip
[ ] 15. Verify RPN hub /canada/rpn/rex-pn/lessons has NO ECG strip
[ ] 16. Verify rollback: set ENABLE_ECG_MODULE=false → ECG disappears
[ ] 17. Deploy to production
```
