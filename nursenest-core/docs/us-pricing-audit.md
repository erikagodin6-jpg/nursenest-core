# US Pricing Infrastructure Audit
Generated: 2026-05-30 | Evidence-backed from live codebase

---

## Architecture Overview

The checkout route (`src/app/api/subscriptions/checkout/route.ts`) resolves a Stripe Price ID using a 3-tier fallback:

```
Tier 1 (Regional):  STRIPE_PRICE_US_NURSING_MONTHLY          (regional-pricing-map.ts:257)
Tier 2 (Canonical): STRIPE_PRICE_NURSENEST_RN_1_MONTH_SUBSCRIPTION  (display-catalog.ts:213)
Tier 3 (Legacy):    STRIPE_PRICE_RN_MONTHLY                  (display-catalog.ts:272)
```

Only the first non-null value is used. If all three are null → `STRIPE_PRICE_NOT_CONFIGURED_CODE` error → checkout rejected.

---

## Complete US Stripe Price Requirements

### RN Tier (us-rn-nclex-rn)

| Duration | USD Price | Env Var (Regional — Primary) | Env Var (Canonical — Fallback) |
|---|---|---|---|
| Monthly | $39.99 | `STRIPE_PRICE_US_NURSING_MONTHLY` | `STRIPE_PRICE_NURSENEST_RN_1_MONTH_SUBSCRIPTION` |
| 3-month | $89.99 | `STRIPE_PRICE_US_NURSING_3MONTH` | `STRIPE_PRICE_NURSENEST_RN_3_MONTH_SUBSCRIPTION` |
| 6-month | $139.99 | `STRIPE_PRICE_US_NURSING_6MONTH` | `STRIPE_PRICE_NURSENEST_RN_6_MONTH_SUBSCRIPTION` |
| Annual | $199.99 | `STRIPE_PRICE_US_NURSING_YEARLY` | `STRIPE_PRICE_NURSENEST_RN_1_YEAR_SUBSCRIPTION` |

### LVN/LPN Tier (us-lpn-nclex-pn)

**Source:** `display-catalog.ts:208–214` — LVN_LPN uses the same canonical keys as RPN. For USD, create separate USD prices.

| Duration | USD Price | Env Var (Regional) | Canonical (maps to RPN key) |
|---|---|---|---|
| Monthly | $24.99 | `STRIPE_PRICE_US_NURSING_MONTHLY`* | `STRIPE_PRICE_NURSENEST_RPN_1_MONTH_SUBSCRIPTION` |
| 3-month | $59.99 | `STRIPE_PRICE_US_NURSING_3MONTH`* | `STRIPE_PRICE_NURSENEST_RPN_3_MONTH_SUBSCRIPTION` |
| 6-month | $99.99 | `STRIPE_PRICE_US_NURSING_6MONTH`* | `STRIPE_PRICE_NURSENEST_RPN_6_MONTH_SUBSCRIPTION` |
| Annual | $149.99 | `STRIPE_PRICE_US_NURSING_YEARLY`* | `STRIPE_PRICE_NURSENEST_RPN_YEARLY_SUBSCRIPTION` |

> *NOTE: The regional map uses a single `US_NURSING` key for all nursing tiers. LVN_LPN and RN share the same regional env keys. The actual Stripe price ID should be the LVN/LPN-appropriate USD price, not the RN price. This is a limitation of the current regional map — consider adding `STRIPE_PRICE_US_LVN_LPN_MONTHLY` env keys if pricing differs.

### NP Tier (5 specialty tracks)

Each NP specialty has its own pathway but uses a shared NP price. For US:

| Duration | USD Price | Env Var (Regional) | Canonical |
|---|---|---|---|
| Monthly | $39.99 | `STRIPE_PRICE_US_NURSING_MONTHLY` | `STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION` |
| 3-month | $99.99 | `STRIPE_PRICE_US_NURSING_3MONTH` | `STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION` |
| 6-month | $159.99 | `STRIPE_PRICE_US_NURSING_6MONTH` | `STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION` |
| Annual | $239.99 | `STRIPE_PRICE_US_NURSING_YEARLY` | `STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION` |

### Allied Health (us-allied-core)

All 7 allied careers share the same Stripe price IDs (source: `display-catalog.ts:106–108`):

| Duration | USD Price | Env Var (Regional) | Canonical |
|---|---|---|---|
| Monthly | $24.99 | `STRIPE_PRICE_US_ALLIED_MONTHLY` | `STRIPE_PRICE_NURSENEST_ALLIED_1_MONTH_SUBSCRIPTION` |
| 3-month | $59.99 | `STRIPE_PRICE_US_ALLIED_3MONTH` | `STRIPE_PRICE_NURSENEST_ALLIED_3_MONTH_SUBSCRIPTION` |
| 6-month | $99.99 | `STRIPE_PRICE_US_ALLIED_6MONTH` | `STRIPE_PRICE_NURSENEST_ALLIED_6_MONTH_SUBSCRIPTION` |
| Annual | $149.99 | `STRIPE_PRICE_US_ALLIED_YEARLY` | `STRIPE_PRICE_NURSENEST_ALLIED_1_YEAR_SUBSCRIPTION` |

---

## Currency Detection & Display

### How US users get USD prices (current flow):

1. User arrives at site → `proxy.ts` geo-detects US IP → sets `nn_global_region=US` cookie
2. Marketing pages read cookie → display USD prices from `regional-pricing-map.ts`
3. User clicks checkout → sends `{ region: "us" }` in checkout body
4. `route.ts:233–235` — `resolvedRegion === "us"` → `resolvedCurrency = "USD"` → looks up `STRIPE_PRICE_US_NURSING_MONTHLY`

### Critical gap: Cookie not set = CAD prices shown

If the geo-detection fails (VPN, edge cache, cold start) or the cookie expires, the pricing page defaults to CAD display. The user sees $29.99 CAD on the pricing page but would be charged $39.99 USD at checkout — a confusing discrepancy.

**Verification steps:**
```bash
# Test with US cookie set
curl -H "Cookie: nn_global_region=US" https://nursenest.io/pricing
# Verify USD prices appear

# Test without cookie (fallback behavior)
curl https://nursenest.io/pricing
# Should show USD if geo-detection works, or offer toggle
```

---

## Missing Stripe Objects (Complete List)

All of the following must be created in Stripe before US checkout can succeed:

### Recurring Prices Required

```
USD RN Subscription Prices (recurring):
[ ] price_us_rn_monthly    — $39.99 USD/month
[ ] price_us_rn_3month     — $89.99 USD/3months (or interval_count: 3)
[ ] price_us_rn_6month     — $139.99 USD/6months
[ ] price_us_rn_annual     — $199.99 USD/year

USD LPN Subscription Prices:
[ ] price_us_lpn_monthly   — $24.99 USD/month
[ ] price_us_lpn_3month    — $59.99 USD/3months
[ ] price_us_lpn_6month    — $99.99 USD/6months
[ ] price_us_lpn_annual    — $149.99 USD/year

USD NP Subscription Prices:
[ ] price_us_np_monthly    — $39.99 USD/month
[ ] price_us_np_3month     — $99.99 USD/3months
[ ] price_us_np_6month     — $159.99 USD/6months
[ ] price_us_np_annual     — $239.99 USD/year

USD Allied Prices (shared across all 7 careers):
[ ] price_us_allied_monthly — $24.99 USD/month
[ ] price_us_allied_3month  — $59.99 USD/3months
[ ] price_us_allied_6month  — $99.99 USD/6months
[ ] price_us_allied_annual  — $149.99 USD/year
```

**Total: 16 new Stripe Price objects required**

### Stripe Product Required (if not re-using existing)

```
[ ] prod_us_rn        — "NurseNest RN NCLEX-RN Prep (US)"
[ ] prod_us_lpn       — "NurseNest LPN NCLEX-PN Prep (US)"
[ ] prod_us_np        — "NurseNest NP Exam Prep (US)"
[ ] prod_us_allied    — "NurseNest Allied Health (US)"
```

> Alternatively, re-use the existing Canadian products and just add USD prices to them. Stripe supports multiple currencies on a single product.

---

## Subscription Plan Verification

### Monthly plans
- ✅ Architecture supports monthly (interval: `month`, interval_count: 1)
- ❌ USD Stripe Price ID not confirmed

### Quarterly plans (3-month)
- ✅ Architecture supports 3-month (interval: `month`, interval_count: 3)
- ❌ USD Stripe Price ID not confirmed

### Semiannual plans (6-month)
- ✅ Architecture supports 6-month (interval: `month`, interval_count: 6)
- ❌ USD Stripe Price ID not confirmed

### Annual plans
- ✅ Architecture supports annual (interval: `year`, interval_count: 1)
- ❌ USD Stripe Price ID not confirmed

### Trial plans
- ✅ 3-day trial built in (`STRIPE_TRIAL_DAYS = 3`, `display-catalog.ts:170`)
- ✅ Payment method required at trial start (`payment_method_collection: "always"`)
- ⚠️ 3-day trial is below market standard (see Launch Readiness Audit finding 1.3)

---

## Currency Isolation: CAD vs USD

The checkout route correctly isolates CAD and USD billing:

```typescript
// route.ts:234-235
const country = resolvedRegion === "us" ? "US" as const : "CA" as const;
// ...
let resolvedCurrency: string = country === "US" ? "USD" : "CAD";
```

And metadata correctly stamps the region:
```typescript
// route.ts:461-468
if (resolvedRegion === "us") {
  metadata.country = "US";  // ← US subscribers tagged correctly
}
```

This means:
- CAD subscribers get CAD Stripe prices → charged in CAD ✅
- US subscribers will get USD Stripe prices → charged in USD ✅ (once prices are created)
- The subscription row in the DB will correctly record `country: "US"` for US subscribers ✅

---

## Verification Checklist

After creating Stripe prices and setting env vars, verify:

```bash
# 1. Admin diagnostics (if available at this URL)
curl -H "Authorization: Bearer <admin_token>" https://nursenest.io/api/admin/billing/integrity-summary

# 2. Test checkout session creation (test mode)
POST /api/subscriptions/checkout
{
  "tier": "RN",
  "duration": "monthly",
  "region": "us",
  "acceptPolicies": true,
  "policyVersion": "<current_version>"
}
# Expected: { "url": "https://checkout.stripe.com/...", "sessionId": "cs_test_..." }
# If: { "code": "STRIPE_PRICE_NOT_CONFIGURED" } → env vars not set correctly

# 3. Verify currency in returned session
# Check Stripe Dashboard: session should show USD currency
```

---

## Geolocation & Currency Detection Summary

| Signal | Source | US Handling | CA Handling |
|---|---|---|---|
| `nn_global_region` cookie | proxy.ts geo-detection | `US` | `CA` |
| Checkout body `region` field | Client sends `region: "us"` | `"us"` | `"canada"` |
| `nn_co_region_ctx` cookie | HMAC-signed stamp | US hub pages | CA hub pages |
| Authoritative region resolution | `collectAuthoritativeCheckoutGlobalRegionSlugs()` | Prefers most specific | Prefers most specific |
| Final currency | `resolvedCurrency = country === "US" ? "USD" : "CAD"` | USD | CAD |
