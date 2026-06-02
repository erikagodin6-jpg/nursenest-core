# NP + Advanced ECG — DigitalOcean Stripe Env Verification
**Date:** 2026-05-12  
**Platform:** DigitalOcean App Platform (not Railway)  
**Verdict:** ✅ **ENV VARS CONFIRMED — CHECKOUT FAIL-CLOSED — DEPLOY READY**

---

## 1. Task

Verify that the NP and Advanced ECG Stripe price env vars:
- are read from the exact correct env var names in production code
- resolve through `process.env` (not hardcoded)
- fail closed with HTTP 400 if a required var is absent
- are documented in the DigitalOcean App Platform spec
- are not referenced via Railway or any other wrong platform

---

## 2. Platform Clarification

**Production platform: DigitalOcean App Platform**

| Spec file | Purpose | Status |
|---|---|---|
| `.do/app-nursenest-core-next.yaml` | **Canonical DO spec** — deployed via `doctl apps update` | ✅ Has all 5 price vars |
| `nursenest-core/.do/app.yaml` | Secondary synced spec | ✅ Has all 5 price vars |
| `nursenest-core/live-app-spec.yaml` | Reference/documentation artifact | ✅ Now documents 5 key stubs |

There is no Railway configuration. Previous reports that mentioned Railway were incorrect. The `do-spec-guard.mjs` validates the canonical `.do/app-nursenest-core-next.yaml` spec on every deployment.

---

## 3. Canonical Env Var Names — Confirmed

### NP Subscription prices (all 4 durations)

| Duration | Env Var Name | Code Source | Price ID in DO |
|---|---|---|---|
| Monthly | `STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION` | `canonicalNursingStripePriceEnvKey("NP","monthly")` | `price_1TAuJ7Fbgp0Ub5P79Kd4k3Lh` |
| 3-month | `STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION` | `canonicalNursingStripePriceEnvKey("NP","3-month")` | `price_1TAuJiFbgp0Ub5P7XIK12Ehi` |
| 6-month | `STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION` | `canonicalNursingStripePriceEnvKey("NP","6-month")` | `price_1TAuK8Fbgp0Ub5P7skiOC7II` |
| Yearly | `STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION` | `canonicalNursingStripePriceEnvKey("NP","yearly")` | `price_1TAuKUFbgp0Ub5P7iEkkFK6U` |

> **Note:** NP yearly uses `1_YEAR_SUBSCRIPTION` — NOT `YEARLY_SUBSCRIPTION` (which is used for RPN). This is pinned in the contract test.

### Advanced ECG add-on (single price, all durations)

| Env Var Name | Code Source | Price ID in DO |
|---|---|---|
| `STRIPE_PRICE_ADVANCED_ECG` | `advancedEcgStripePriceEnvKey(duration)` | `price_1TVo8vFbgp0Ub5P7aTySWrbU` |

Advanced ECG uses a single Stripe price ID for all billing durations (monthly / 3-month / 6-month / yearly). This is intentional — the duration is stored in subscription metadata rather than separate Stripe prices.

---

## 4. Price Resolution Chain — Code Evidence

### NP main checkout (`/api/subscriptions/checkout`)

```
POST body: { tier: "NP", duration: "monthly" }
  → findPriceEntry("CA", "NP", "monthly")
    → priceMap() [lazy-built from eachStripePriceMatrixRow()]
      → canonicalNursingStripePriceEnvKey("NP", "monthly")
        → returns "STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION"
      → resolvePrice("STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION", legacyKey)
        → process.env["STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION"]?.trim()
        → if set: { priceId: "price_1TAuJ7Fbgp0Ub5P79Kd4k3Lh", source: "canonical" }
        → if absent: { priceId: null, source: "missing" }
  → if priceId null: excluded from price map → findPriceEntry returns undefined
  → checkout returns HTTP 400 { code: "STRIPE_PRICE_NOT_CONFIGURED" }
```

**Key files:**
- `src/lib/pricing/display-catalog.ts:214` — `canonicalNursingStripePriceEnvKey("NP", "monthly")` → `"STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION"`
- `src/lib/stripe/pricing-map.ts:44-53` — `resolvePrice()` reads canonical then legacy, returns null if both absent
- `src/lib/stripe/pricing-map.ts:164-175` — `buildPriceMap()` filters out null-priceId rows
- `src/app/api/subscriptions/checkout/route.ts:317-325` — `findPriceEntry()` returns undefined → checkout fails
- `src/app/api/subscriptions/checkout/route.ts:344-365` — HTTP 400 with `STRIPE_PRICE_NOT_CONFIGURED_CODE`

### Advanced ECG checkout (`/api/subscriptions/checkout/advanced-ecg`)

```
POST body: { duration: "monthly" }
  → advancedEcgStripePriceEnvKey("monthly")
    → returns "STRIPE_PRICE_ADVANCED_ECG"
  → process.env["STRIPE_PRICE_ADVANCED_ECG"]?.trim()
  → if absent: HTTP 400 { code: "STRIPE_PRICE_NOT_CONFIGURED" }
```

**Key files:**
- `src/lib/advanced-ecg/advanced-ecg-module-config.ts:37` — always returns `"STRIPE_PRICE_ADVANCED_ECG"` regardless of duration
- `src/app/api/subscriptions/checkout/advanced-ecg/route.ts:108-118` — reads env var, fails closed if absent

---

## 5. Fail-Closed Verification

Both checkout routes return **HTTP 400** with `code: "STRIPE_PRICE_NOT_CONFIGURED"` when a required price env var is absent. Neither route falls back to a default, a hardcoded ID, or a permissive path.

| Scenario | Behavior |
|---|---|
| NP monthly env var set | Checkout proceeds → Stripe session created |
| NP monthly env var absent | HTTP 400 — `STRIPE_PRICE_NOT_CONFIGURED` — no session created |
| Advanced ECG env var set | Checkout proceeds → Stripe session created |
| Advanced ECG env var absent | HTTP 400 — `STRIPE_PRICE_NOT_CONFIGURED` — no session created |
| `STRIPE_SECRET_KEY` absent | HTTP 503 — `STRIPE_UNAVAILABLE` — no session created |

No hardcoded `price_1*` strings exist in checkout source code (verified by contract test).

---

## 6. DigitalOcean App Spec Verification

### Canonical spec: `.do/app-nursenest-core-next.yaml`

All 5 required Stripe price keys are present with their actual values:

```yaml
- key: STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION
  scope: RUN_TIME
  value: price_1TAuJ7Fbgp0Ub5P79Kd4k3Lh

- key: STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION
  scope: RUN_TIME
  value: price_1TAuJiFbgp0Ub5P7XIK12Ehi

- key: STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION
  scope: RUN_TIME
  value: price_1TAuK8Fbgp0Ub5P7skiOC7II

- key: STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION
  scope: RUN_TIME
  value: price_1TAuKUFbgp0Ub5P7iEkkFK6U

- key: STRIPE_PRICE_ADVANCED_ECG
  scope: RUN_TIME
  value: price_1TVo8vFbgp0Ub5P7aTySWrbU
```

> Stripe price IDs (`price_*`) are non-secret public identifiers — Stripe's access control is enforced by `STRIPE_SECRET_KEY`, not by keeping price IDs private.

### DO spec guard: `scripts/do-spec-guard.mjs`

All 5 keys are in `REQUIRED_RUNTIME_ENV_KEYS`. The guard runs against the canonical spec and passes:

```
[do-spec-guard] OK: .do/app-nursenest-core-next.yaml passes all required env protection checks.
```

The guard prevents any `doctl apps update` from accidentally deleting these vars by failing loudly if a required key is absent from the spec.

### Reference artifact: `nursenest-core/live-app-spec.yaml`

This file is an incomplete documentation artifact, **not** a deployed spec. The 5 Stripe price keys have been added as `type: SECRET` stubs (key + scope only, no value). The canonical spec `.do/app-nursenest-core-next.yaml` is what is actually deployed.

---

## 7. Files Changed This Task

| File | Change | Reason |
|---|---|---|
| `nursenest-core/live-app-spec.yaml` | Added 5 Stripe price key stubs (`type: SECRET`) | Documents required secrets in this reference artifact |
| `src/lib/stripe/np-ecg-stripe-env-names.contract.test.ts` | **New** — 27-assertion contract test | Pins exact env var names, fail-closed behavior, DO spec presence, no hardcoded IDs |

---

## 8. No-Code-Change Confirmation

The following were already correct before this task and required **no changes**:

| Item | Status |
|---|---|
| `canonicalNursingStripePriceEnvKey("NP", "monthly")` returns correct name | ✅ Already correct |
| `canonicalNursingStripePriceEnvKey("NP", "yearly")` returns `1_YEAR_SUBSCRIPTION` | ✅ Already correct |
| `advancedEcgStripePriceEnvKey()` returns `STRIPE_PRICE_ADVANCED_ECG` | ✅ Already correct |
| NP checkout fails closed when env var absent (HTTP 400) | ✅ Already correct |
| Advanced ECG checkout fails closed (HTTP 400) | ✅ Already correct |
| `.do/app-nursenest-core-next.yaml` has all 5 price vars | ✅ Already set (previous session) |
| `scripts/do-spec-guard.mjs` validates all 5 keys | ✅ Already in guard (previous session) |
| No Railway references in checkout or pricing code | ✅ Never existed |
| No hardcoded `price_1*` strings in checkout source | ✅ Confirmed by contract test |

---

## 9. Test Results

| Suite | Tests | Result |
|---|---|---|
| `np-ecg-stripe-env-names.contract.test.ts` (new) | 27 | ✅ 27/27 pass |
| `stripe-pricing-env-matrix.test.ts` | 5 | ✅ 5/5 pass |
| `pricing-map.shared-allied-lookup.test.ts` | 7 | ✅ 7/7 pass |
| `pricing-map.na-country-ambiguity.test.ts` | 6 | ✅ 6/6 pass |
| `stripe-webhook-signature-contract.test.ts` | 4 | ✅ 4/4 pass |
| `stripe-webhook-policy.test.ts` | 4 | ✅ 4/4 pass |
| `ecg-module-config.test.ts` | 7 | ✅ 7/7 pass |
| `cnple-routes.test.ts` | 60 | ✅ 60/60 pass |
| `cnple-publish-state.contract.test.ts` | 45 | ✅ 45/45 pass |
| `typecheck:critical` | — | ✅ Clean |
| `do-spec-guard.mjs` (canonical spec) | — | ✅ Passes |

**Total: 165 tests pass. 0 failures. typecheck:critical clean.**

---

## 10. Entitlement Tests

`mobile-style-subscriber-api.contract.test.ts` has 3 pre-existing failures unrelated to this task (requires a DB mock using `spyOn` on an undefined method — a test infrastructure issue confirmed pre-existing by stash check). These failures exist on `main` before any of our changes.

---

## 11. Deploy Verdict

**✅ CLEARED — no action required on Stripe env vars.**

The 5 required Stripe price IDs are:
- Set in the canonical DO App Platform spec (`.do/app-nursenest-core-next.yaml`)
- Read from `process.env` via exact canonical key names at checkout request time
- Protected by the DO spec guard (prevents accidental deletion on spec update)
- Guarded by a new contract test that pins the exact names and fail-closed behavior
- Not hardcoded anywhere in application source code

---

*Generated 2026-05-12 — NurseNest Engineering*  
*Platform: DigitalOcean App Platform. No Railway dependency.*
