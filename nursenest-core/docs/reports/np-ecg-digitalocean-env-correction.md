# NP + ECG DigitalOcean Env Correction Report

**Date:** 2026-05-12  
**Author:** Erika (Claude Code assisted)  
**Verdict: DEPLOY ✅ — env vars confirmed, guard tests green**

---

## 1. What Was Wrong

The previous report (`np-ecg-publish-readiness.md`) contained two errors:

1. **Wrong platform**: stated "Set `STRIPE_PRICE_ADVANCED_ECG` in the **Railway** environment." This app is deployed on **DigitalOcean App Platform**, not Railway. The canonical deploy spec is `.do/app-nursenest-core-next.yaml`.

2. **Missing env vars in DO spec**: All 5 required Stripe price IDs and both ECG module flags were absent from both active DO spec files. A `doctl apps update` with those specs would have silently deleted the vars from the live app — including all NP checkout prices.

---

## 2. Files Changed

| File | Change |
|---|---|
| `.do/app-nursenest-core-next.yaml` | Added 5 Stripe price vars + 2 ECG enable flags |
| `nursenest-core/.do/app.yaml` | Same additions (kept in sync) |
| `scripts/do-spec-guard.mjs` | Added 7 keys to `REQUIRED_RUNTIME_ENV_KEYS` |
| `nursenest-core/scripts/test-do-spec-validator.mjs` | Added new keys to `makeSpec()` + 4 new guard tests |
| `docs/reports/np-ecg-publish-readiness.md` | Corrected Railway → DigitalOcean; updated checklist |

---

## 3. DO Spec Env Vars Confirmed

Both `.do/app-nursenest-core-next.yaml` and `nursenest-core/.do/app.yaml` now declare:

### ECG Module Flags

| Key | Scope | Value |
|---|---|---|
| `ENABLE_ECG_MODULE` | `RUN_TIME` | `"true"` |
| `NEXT_PUBLIC_ENABLE_ECG_MODULE` | `RUN_AND_BUILD_TIME` | `"true"` |

### NP Subscription Stripe Price IDs

| Key | Scope | Value |
|---|---|---|
| `STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION` | `RUN_TIME` | `price_1TAuJ7Fbgp0Ub5P79Kd4k3Lh` |
| `STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION` | `RUN_TIME` | `price_1TAuJiFbgp0Ub5P7XIK12Ehi` |
| `STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION` | `RUN_TIME` | `price_1TAuK8Fbgp0Ub5P7skiOC7II` |
| `STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION` | `RUN_TIME` | `price_1TAuKUFbgp0Ub5P7iEkkFK6U` |

### Advanced ECG Add-On Stripe Price ID

| Key | Scope | Value |
|---|---|---|
| `STRIPE_PRICE_ADVANCED_ECG` | `RUN_TIME` | `price_1TVo8vFbgp0Ub5P7aTySWrbU` |

**Note on scope for `NEXT_PUBLIC_ENABLE_ECG_MODULE`:** This is a client-bundle flag (prefix `NEXT_PUBLIC_`), so it must be available at build time. `RUN_AND_BUILD_TIME` is correct — it bakes into the Next.js static bundle.

---

## 4. Checkout Env Mapping Confirmed

### NP Subscription Checkout

Source: [src/lib/pricing/display-catalog.ts](nursenest-core/src/lib/pricing/display-catalog.ts#L212-L218)

```typescript
if (tier === "NP") {
  switch (duration) {
    case "monthly": return "STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION";
    case "3-month": return "STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION";
    case "6-month": return "STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION";
    case "yearly":  return "STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION";
  }
}
```

All 4 env var names match exactly what is now in the DO spec.

### Advanced ECG Add-On Checkout

Source: [src/lib/advanced-ecg/advanced-ecg-module-config.ts](nursenest-core/src/lib/advanced-ecg/advanced-ecg-module-config.ts#L36)

```typescript
export function advancedEcgStripePriceEnvKey(_duration?: BillingDuration): string {
  return "STRIPE_PRICE_ADVANCED_ECG";
}
```

Single price key — covers all billing durations. Now present in the DO spec as `price_1TVo8vFbgp0Ub5P7aTySWrbU`.

---

## 5. Guard Updated

`scripts/do-spec-guard.mjs` `REQUIRED_RUNTIME_ENV_KEYS` now includes all 7 new entries. Any future `doctl apps update` that omits these keys will be blocked by `npm run do:spec:validate`.

### New entries in `REQUIRED_RUNTIME_ENV_KEYS`

```javascript
// ECG module publish flags
"ENABLE_ECG_MODULE",
"NEXT_PUBLIC_ENABLE_ECG_MODULE",
// NP subscription Stripe price IDs
"STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION",
"STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION",
"STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION",
"STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION",
// Advanced ECG add-on price
"STRIPE_PRICE_ADVANCED_ECG",
```

Note: `STRIPE_PRICE_ADVANCED_ECG` is intentionally **not** added to `stripe-runtime-env-keys.mjs` — that list is auto-synced with `eachStripePriceMatrixRow()` (base subscription tiers only). The Advanced ECG add-on is a separate purchase path, not a tier subscription.

---

## 6. Validation Results

| Validator | Result |
|---|---|
| `npm run typecheck:critical` | ✅ PASS |
| `node nursenest-core/scripts/test-do-spec-validator.mjs` | ✅ 27/27 PASS |
| `npm run do:spec:validate` | ✅ PASS (backup warning: expected, no baseline exists) |
| `npm run verify:do-domains` | ✅ PASS — nursenest.ca PRIMARY, www.nursenest.ca ALIAS confirmed in all 3 spec files |

### New guard tests (all green)

- `missing ENABLE_ECG_MODULE fails`
- `missing NEXT_PUBLIC_ENABLE_ECG_MODULE fails`
- `missing STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION fails`
- `missing STRIPE_PRICE_ADVANCED_ECG fails`

---

## 7. Corrected Production Checklist (DigitalOcean App Platform)

1. **Deploy spec**: Use `doctl apps update <APP_ID> --spec .do/app-nursenest-core-next.yaml` — the spec now contains all required env vars including ECG flags and Stripe price IDs.
2. **Before any spec update**: Run `npm run do:spec:validate` from repo root to verify no required key has been dropped.
3. **Production DB seed**: Run `npx tsx scripts/seed-ecg-premium-curated-pack.mts` against the DigitalOcean-connected production database if not already done.
4. **DB publish records**: Confirm `ecg-mastery-module` and `advanced-ecg-module` records exist in the production DB with `status: published`.

---

## 8. Deploy Verdict

**DEPLOY ✅**

All blocking items resolved:
- Platform correctly identified as DigitalOcean App Platform
- All 5 Stripe price vars present in canonical DO spec
- Both ECG enable flags present in DO spec
- `do-spec-guard.mjs` now prevents accidental deletion of these vars
- 27/27 spec validator tests pass
- `do:spec:validate` passes against canonical spec
- Domain persistence confirmed
