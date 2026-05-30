# US Launch Readiness Audit
Generated: 2026-05-30 | Evidence-backed findings from live codebase inspection

---

## Methodology

Every finding below is sourced from specific files and line numbers in the production codebase. No placeholder findings. All severity classifications based on revenue impact.

---

## 1. STRIPE CONFIGURATION

### Finding 1.1 — USD Stripe Price IDs not confirmed in env
**Severity: CRITICAL**

**Evidence:**
- `src/lib/pricing/regional-pricing-map.ts:252` — `lookupStripePriceId()` reads `STRIPE_PRICE_US_NURSING_MONTHLY`, `STRIPE_PRICE_US_NURSING_3MONTH`, `STRIPE_PRICE_US_NURSING_6MONTH`, `STRIPE_PRICE_US_NURSING_YEARLY`
- `src/app/api/subscriptions/checkout/route.ts:332–339` — tries regional pricing first; if `stripePriceId` is null, falls through to legacy map
- Fallback canonical keys: `STRIPE_PRICE_NURSENEST_RN_1_MONTH_SUBSCRIPTION`, `STRIPE_PRICE_NURSENEST_RN_3_MONTH_SUBSCRIPTION`, `STRIPE_PRICE_NURSENEST_RN_6_MONTH_SUBSCRIPTION`, `STRIPE_PRICE_NURSENEST_RN_1_YEAR_SUBSCRIPTION` (`src/lib/pricing/display-catalog.ts:213–221`)
- If the existing canonical keys point to CAD Stripe prices, US users get charged in CAD even when they select USD

**Impact:** US checkout will either fail (`STRIPE_PRICE_NOT_CONFIGURED_CODE`) or silently charge in CAD.

**Remediation:**
1. In Stripe Dashboard (USD account or existing account with USD currency), create 4 USD recurring prices for the RN tier:
   - Monthly: $39.99 USD
   - 3-month: $89.99 USD
   - 6-month: $139.99 USD
   - Annual: $199.99 USD
2. Set env vars on production host:
   ```
   STRIPE_PRICE_US_NURSING_MONTHLY=price_...
   STRIPE_PRICE_US_NURSING_3MONTH=price_...
   STRIPE_PRICE_US_NURSING_6MONTH=price_...
   STRIPE_PRICE_US_NURSING_YEARLY=price_...
   ```
3. Repeat for LVN_LPN tier (maps to RPN price key; create separate USD LPN prices)
4. Repeat for NP tier (5 specialty tracks)

---

### Finding 1.2 — Two conflicting env key naming conventions for US prices
**Severity: HIGH**

**Evidence:**
- Regional map uses: `STRIPE_PRICE_US_NURSING_MONTHLY` (`regional-pricing-map.ts:257-260`)
- Canonical map uses: `STRIPE_PRICE_NURSENEST_RN_1_MONTH_SUBSCRIPTION` (`display-catalog.ts:213`)
- Legacy map uses: `STRIPE_PRICE_RN_MONTHLY` (`display-catalog.ts:272`)
- The checkout route at `route.ts:332–352` tries regional first → canonical → legacy. All three can co-exist but only one will actually resolve.

**Impact:** Operator confusion; if wrong key name is set, checkout falls through to the next resolver, potentially picking a CAD price silently.

**Remediation:**
- Document that US uses `STRIPE_PRICE_US_NURSING_*` convention (regional map path)
- Add the admin env diagnostics page at `/admin/diagnostics` to surface which keys are set and which resolver won
- Consider adding a US-specific price config test (see Phase 2)

---

### Finding 1.3 — Trial is 3 days, payment method required on trial start
**Severity: MEDIUM**

**Evidence:**
- `src/lib/pricing/display-catalog.ts`: `export const STRIPE_TRIAL_DAYS = 3;`
- `route.ts:443`: `const trialDays = STRIPE_TRIAL_DAYS;`
- `route.ts:497`: `{ payment_method_collection: "always" }` when trial > 0

**Impact:** 3 days is below the market standard (UWorld: 7 days free trial; Archer: free questions without card). Requiring a payment method immediately raises friction and reduces trial starts.

**Remediation (options):**
- Increase `STRIPE_TRIAL_DAYS` to 7
- Or gate the payment method requirement for 3-day: `payment_method_collection: "if_required"` to allow card-free trial entry

---

### Finding 1.4 — No Stripe Tax configured
**Severity: MEDIUM**

**Evidence:**
- No `automatic_tax` field found in `checkout/route.ts` `stripe.checkout.sessions.create()` call
- US has state-level sales tax obligations for digital educational products (varies by state)

**Impact:** Potential compliance exposure in high-volume US states (NY, TX, CA). Low urgency for initial launch but escalates with revenue.

**Remediation:**
- Enable Stripe Tax in Dashboard for US digital products
- Add `automatic_tax: { enabled: true }` to `stripe.checkout.sessions.create()` call at `route.ts:504`

---

### Finding 1.5 — Portal/billing management route exists and is US-compatible
**Severity: INFO (no action needed)**

**Evidence:** `src/app/api/billing/portal/route.ts` exists. The Stripe Customer Portal is currency-agnostic (it reads from the subscription).

**Status: Ready**

---

### Finding 1.6 — Cancel and reactivate routes exist
**Severity: INFO (no action needed)**

**Evidence:**
- `src/app/api/billing/cancel-subscription/route.ts`
- `src/app/api/billing/reactivate-subscription/route.ts`

**Status: Ready** — routes exist, webhook handles `customer.subscription.deleted` at `apply-stripe-webhook-event.ts:1013`

---

## 2. PRICING DISPLAY

### Finding 2.1 — Pricing page may show CAD prices to US visitors
**Severity: CRITICAL**

**Evidence:**
- `src/lib/pricing/display-catalog.ts:89–100`: `LIST_PRICE_MAJOR` contains CAD amounts (RN monthly: $29.99 — matches CAD catalog, not USD $39.99)
- The regional pricing map has USD prices (monthly: $39.99) but they only display if the US cookie/region is set
- If a US visitor arrives without a `nn_global_region=US` cookie, they see CAD prices

**Impact:** US visitors see the wrong currency and prices. Conversion crusher. A $29.99 CAD ≈ $22.09 USD — creates confusion at checkout when charged $39.99 USD.

**Remediation:**
1. Verify geo-detection sets `nn_global_region=US` for US IP addresses in `src/proxy.ts`
2. Ensure the pricing page displays USD prices when region = "us"
3. Add a prominent USD/CAD toggle label so users know which currency they're seeing
4. Test with a US-geolocated browser session

---

### Finding 2.2 — Pricing page has US RN pricing defined
**Severity: INFO**

**Evidence:** `regional-pricing-map.ts` — US nursing monthly: $39.99, 3-month: $89.99, 6-month: $139.99, yearly: $199.99

**Status: Prices defined**, only Stripe product creation and env vars are needed.

---

## 3. CONVERSION FUNNEL

### Finding 3.1 — naBillingScopeAck gate may block US checkout
**Severity: HIGH**

**Evidence:**
- `src/lib/stripe/checkout-na-billing-scope-gate.ts` and `route.ts:270–298`
- The gate returns `true` when an authoritative cookie slug is a "partial" market
- If a US user browses the Canadian hub first (setting `nn_global_region=CA`) then tries to checkout for US, the `CHECKOUT_NA_BILLING_SCOPE_ACK_REQUIRED` error fires with status 400
- The checkout UI must then present an acknowledgment modal before re-submitting with `naBillingScopeAcknowledged: true`

**Impact:** US users who previously visited Canadian marketing pages (common for users who navigate broadly) hit an invisible wall at checkout. If the frontend doesn't handle `CHECKOUT_NA_BILLING_SCOPE_ACK_REQUIRED_CODE`, checkout silently fails.

**Remediation:**
- Audit the billing client-side component to confirm `CHECKOUT_NA_BILLING_SCOPE_ACK_REQUIRED_CODE` is handled and shows the user a re-confirmation step
- Test: Set `nn_global_region=CA` cookie → attempt US RN checkout → verify acknowledgment flow works

---

### Finding 3.2 — Checkout success redirects to /app?checkout=success
**Severity: INFO**

**Evidence:** `route.ts:511` — `success_url: \`${appUrl}/app?checkout=success\``

**Observation:** The learner app layout imports `CheckoutSuccessBanner` at `layout.tsx:38`. This banner fires on `checkout=success` query param. However, there is no confirmed PostHog event for `subscription_created_client` on this page. The banner exists but no conversion event fires from the success redirect.

**Remediation:**
- Add `trackClientEvent(PH.learnerConversionSubscribed, {...})` in `CheckoutSuccessBanner` when `checkout=success` is detected, with a `distinct_id` from the session.

---

### Finding 3.3 — Onboarding correctly routes US users to us-rn-nclex-rn
**Severity: INFO (no action needed)**

**Evidence:** `src/lib/onboarding/resolve-default-pathway-for-onboarding.ts:26` — `us ? "us-rn-nclex-rn" : "ca-rn-nclex-rn"`. The pathway has `status: "active"` (confirmed in `PATHWAY_LAUNCH_APPROVED`), so `assignablePathwayId()` returns it correctly.

**Status: Ready**

---

### Finding 3.4 — US RN signup flow E2E test exists
**Severity: INFO**

**Evidence:** `tests/e2e/rn-student-signup-flow.spec.ts:39` — `US RN` variant with `seedUsMarketingCookie`, hub path `/us/rn/nclex-rn`, country `US`

**Gap:** The test covers signup → learner shell but does NOT test checkout, trial start, or subscription. See Phase 3 for the new funnel test.

---

## 4. EMAIL NOTIFICATIONS

### Finding 4.1 — Trial started email exists via revenue alert system
**Severity: INFO (no action needed)**

**Evidence:** `apply-stripe-webhook-event.ts:493–516` — `notifyRevenueAlert({ eventType: "trial_started" })` fires on `customer.subscription.created` when `status === "trialing"`. This sends admin email/SMS but customer-facing trial start email depends on Stripe's built-in email configuration.

**Gap:** Verify Stripe is configured to send `trial will end` reminder emails 3 days before trial expires (Stripe Dashboard → Billing → Subscriptions → Email notifications). NurseNest does not send its own trial reminder email.

**Remediation:**
- Enable Stripe built-in "Your trial ends in X days" email
- Or build a server-side trial reminder (cron job 24h before trial end) — see Reliability section

---

### Finding 4.2 — Subscription cancelled notification fires correctly
**Severity: INFO (no action needed)**

**Evidence:** `apply-stripe-webhook-event.ts:1013` — `eventType: "subscription_cancelled"` revenue alert fires.

---

## 5. USER ONBOARDING EXPERIENCE

### Finding 5.1 — Onboarding step exists but requires QA for US-specific copy
**Severity: MEDIUM**

**Evidence:** `tests/e2e/rn-student-signup-flow.spec.ts:130–134` — onboarding detected at `/app/onboarding`, test clicks `getByTestId("onboarding-exam-goal-rn")` and `getByTestId("onboarding-start-studying-now")`

**Gap:** US-specific copy in onboarding (e.g., "NCLEX-RN" vs generic "RN exam") needs visual QA. The test confirms the flow works but doesn't assert US-specific content.

**Remediation:**
- QA run: sign up with `country: US` → confirm onboarding shows "NCLEX-RN" language, not "REx-PN" or generic
- Add assertion in e2e test for `/nclex-rn` or `NCLEX` on the onboarding screen

---

### Finding 5.2 — Dashboard shows paywall for free users (correct)
**Severity: INFO**

**Evidence:** `rn-student-signup-flow.spec.ts:161–167` — test confirms "subscription required" heading and pricing link appear on `/app/questions` for free users. This is correct behavior.

---

## 6. MOBILE EXPERIENCE

### Finding 6.1 — Mobile bottom nav exists
**Severity: INFO**

**Evidence:** `LearnerShellMobileBottomNav` in `learner-shell-primary-nav.tsx` renders a fixed bottom nav with all study links. No US-specific issues.

### Finding 6.2 — No mobile checkout e2e test
**Severity: MEDIUM**

**Gap:** No mobile viewport Playwright test for the checkout flow. Mobile accounts for ~55–65% of initial signups in comparable SaaS products.

**Remediation:** Add `{ width: 390, height: 844 }` viewport variant in the new funnel test (Phase 3).

---

## 7. ANALYTICS COVERAGE

### Finding 7.1 — trial_started is NOT a PostHog event
**Severity: HIGH**

**Evidence:**
- `apply-stripe-webhook-event.ts:501` — `eventType: "trial_started"` goes to `notifyRevenueAlert()` (revenue alert SMS/email), NOT to `captureServerEvent()`
- `posthog-conversion-events.ts:203` — `trialStarted: "trial_started"` key EXISTS in the PH object but is not fired from the webhook
- The only PostHog event from checkout/subscription created: `learnerConversionSubscribed` at line 742 (which fires for both trial and direct)

**Impact:** Cannot distinguish trial starts from direct purchases in PostHog funnels. Cannot measure trial→paid conversion rate.

**Remediation:** In `apply-stripe-webhook-event.ts`, after `notifyRevenueAlert({ eventType: "trial_started" })`, add:
```typescript
void captureServerEvent(analyticsDistinctId(userId), PH.trialStarted, {
  tier: updated.planTier != null ? String(updated.planTier) : undefined,
  duration: sub.items?.data?.[0]?.price?.recurring?.interval ?? undefined,
  country: updated.planCountry != null ? String(updated.planCountry) : undefined,
}).catch(() => {});
```

---

### Finding 7.2 — trial_converted is NOT a PostHog event
**Severity: HIGH**

**Evidence:** `apply-stripe-webhook-event.ts:1258` — `eventType === "trial_converted"` goes to `notifyRevenueAlert()` only. Not captured in PostHog.

**Remediation:** Same pattern as 7.1 — add `captureServerEvent(userId, PH.trialConverted, {...})` in the trial_converted branch.

---

### Finding 7.3 — subscription_cancelled is NOT a PostHog event
**Severity: MEDIUM**

**Evidence:** `apply-stripe-webhook-event.ts:1013` — fires `notifyRevenueAlert({ eventType: "subscription_cancelled" })` but no PostHog event.

**Remediation:** Add `captureServerEvent()` call on subscription cancelled event for churn analysis.

---

### Finding 7.4 — All study events ARE tracked
**Severity: INFO (no action needed)**

Events confirmed in `posthog-conversion-events.ts`:
- ✅ `learnerLessonStarted` / `learnerLessonCompleted`
- ✅ `learnerCatExamStarted`
- ✅ `learnerLinearPracticeTestStarted`
- ✅ `learnerQuestionBankSessionStarted`
- ✅ `flashcardCardReviewed`
- ✅ `appSectionView` with `appSectionFromPathname()`
- ✅ `paywallEncounter` / `paywallCtaClicked`
- ✅ `onboardingStarted` / `onboardingCompleted`

---

## 8. RELIABILITY

### Finding 8.1 — Webhook idempotency is properly implemented
**Severity: INFO (no action needed)**

**Evidence:** `src/lib/stripe/stripe-webhook-idempotency.ts` — claim-first model via DB insert, `releaseStripeWebhookEventClaim()` on failure allows Stripe retry. Duplicate detection at `route.ts:164`.

---

### Finding 8.2 — Checkout has no retry logic for Stripe API failures
**Severity: MEDIUM**

**Evidence:** `route.ts:504` — `stripe.checkout.sessions.create()` is called once; if it throws, the 503 error is returned immediately. No retry with exponential backoff.

**Impact:** Transient Stripe API errors (rare but documented) permanently fail a checkout session that the user must restart.

**Remediation:**
- Wrap `stripe.checkout.sessions.create()` in a retry with 1 retry after 500ms for `StripeAPIError` with status 500/503
- Or use Stripe's built-in idempotency keys (`idempotencyKey` option) so re-submitting the same form doesn't double-charge

---

## 9. REMEDIATION PRIORITY SUMMARY

| # | Finding | Severity | Effort | Day |
|---|---|---|---|---|
| 1.1 | Create USD Stripe prices + set env vars | **CRITICAL** | 3h | Day 1 |
| 2.1 | Verify USD prices shown to US visitors | **CRITICAL** | 2h | Day 1 |
| 3.1 | Test + verify naBillingScopeAck gate for US users | **HIGH** | 2h | Day 2 |
| 7.1 | Add trialStarted PostHog event | **HIGH** | 1h | Day 2 |
| 7.2 | Add trialConverted PostHog event | **HIGH** | 1h | Day 2 |
| 1.2 | Document + test env key resolution order | **HIGH** | 2h | Day 2 |
| 1.3 | Evaluate trial length vs competitors | **MEDIUM** | 1h | Day 3 |
| 3.2 | Add client-side conversion event on checkout=success | **MEDIUM** | 1h | Day 3 |
| 5.1 | QA US onboarding copy | **MEDIUM** | 2h | Day 3 |
| 6.2 | Add mobile viewport to funnel tests | **MEDIUM** | 2h | Day 4 |
| 7.3 | Add subscriptionCancelled PostHog event | **MEDIUM** | 1h | Day 4 |
| 8.2 | Add Stripe API retry for checkout | **MEDIUM** | 2h | Day 5 |
| 1.4 | Enable Stripe Tax | **MEDIUM** | 2h | Day 7 |
| 4.1 | Configure trial reminder emails in Stripe | **MEDIUM** | 1h | Day 3 |
