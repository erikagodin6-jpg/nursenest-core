# US Analytics & Revenue Tracking Audit
Generated: 2026-05-30 | Evidence from posthog-conversion-events.ts and apply-stripe-webhook-event.ts

---

## Tracking Infrastructure

**PostHog client:** `src/lib/observability/posthog-client.ts` — `trackClientEvent()`
**PostHog server:** `src/lib/observability/posthog-server.ts` — `captureServerEvent()`
**Revenue alerts:** `notifyRevenueAlert()` in `apply-stripe-webhook-event.ts` — SMS/email only, NOT PostHog

---

## Event Coverage Matrix

### Acquisition Events

| Event | PostHog Key | Where Fired | Status |
|---|---|---|---|
| Homepage viewed | `funnelHomepageViewed` | Marketing homepage | ✅ |
| RN hub viewed | `funnelExamHubViewed` | Exam hub page | ✅ |
| Home hero primary CTA | `marketingHomeHeroPrimaryCta` | Homepage hero | ✅ |
| Home hero secondary CTA | `marketingHomeHeroSecondaryCta` | Homepage hero | ✅ |
| Pathway card click | `marketingHomePathwayCardPrimary` | Homepage | ✅ |
| Pricing CTA click | `conversionCtaClick` | Multiple surfaces | ✅ |
| Question bank landing viewed | `marketingQuestionBankLandingViewed` | /question-bank | ✅ |
| Sample rationale unlock | `marketingSampleRationaleUnlock` | Homepage | ✅ |

### Signup Events

| Event | PostHog Key | Where Fired | Status |
|---|---|---|---|
| Signup form submit attempt | `signupSubmitAttempt` | Signup form | ✅ |
| Signup completed (client) | `signupSuccessClient` | After API 201 | ✅ |
| OAuth provider selected | `authOAuthProviderSelected` | Login/signup page | ✅ |
| Onboarding started | `onboardingStarted` | Onboarding page | ✅ |
| Onboarding completed | `onboardingCompleted` | Onboarding finish | ✅ |
| Onboarding skipped | `onboardingSkipped` | Onboarding skip | ✅ |

### Billing Events

| Event | PostHog Key | Where Fired | Status |
|---|---|---|---|
| Checkout started (client) | `checkoutStarted` | Pricing CTA click | ✅ |
| Checkout session created (server) | via captureServerEvent | `/api/subscriptions/checkout` | ✅ |
| Trial started | `trialStarted` | Webhook — customer.subscription.created | ❌ **MISSING** |
| Trial converted | `trialConverted` | Webhook — invoice.payment_succeeded | ❌ **MISSING** |
| Subscription created / direct | `learnerConversionSubscribed` | Webhook | ✅ |
| Subscription renewed | `funnelSubscriptionRenewed` | Webhook — invoice.payment_succeeded | ✅ |
| Subscription cancelled | *(no PH key)* | Webhook | ❌ **MISSING** |
| Paywall encountered | `paywallEncounter` | Learner app surfaces | ✅ |
| Paywall CTA clicked | `paywallCtaClicked` | Paywall component | ✅ |

### Study Engagement Events

| Event | PostHog Key | Status |
|---|---|---|
| App section viewed | `appSectionView` | ✅ |
| Lesson started | `learnerLessonStarted` | ✅ |
| Lesson completed | `learnerLessonCompleted` | ✅ |
| Question bank session started | `learnerQuestionBankSessionStarted` | ✅ |
| Question bank session completed | `learnerQuestionBankSessionCompleted` | ✅ |
| CAT exam started | `learnerCatExamStarted` | ✅ |
| Practice test started (linear) | `learnerLinearPracticeTestStarted` | ✅ |
| Practice test completed | `learnerPracticeTestSessionCompleted` | ✅ |
| Flashcard reviewed | `flashcardCardReviewed` | ✅ |
| First study progress (any) | `funnelFirstStudyProgress` | ✅ |
| Repeat study day (retention) | `funnelRepeatStudyDay` | ✅ |
| Daily active signal | `dailyActiveSignal` | ✅ |

### Retention Events

| Event | PostHog Key | Status |
|---|---|---|
| User reactivated (24h+ gap) | `userReactivated` | ✅ |
| Engagement nudge clicked | `engagementNudgeClicked` | ✅ |
| Spaced review reminder clicked | `spacedReviewReminderClicked` | ✅ |
| Account deleted | `accountDeleted` | ✅ |

---

## Critical Missing Events: Implementation Plan

### 1. trial_started — PostHog Event

**File:** `src/lib/stripe/apply-stripe-webhook-event.ts`
**Location:** Line 493–516 (after `notifyRevenueAlert({ eventType: "trial_started" })`)

**Add:**
```typescript
// After the notifyRevenueAlert call at line ~515:
void captureServerEvent(analyticsDistinctId(row.userId), PH.trialStarted, {
  tier: updated.planTier != null ? String(updated.planTier) : undefined,
  plan_duration: sub.items?.data?.[0]?.price?.recurring?.interval ?? undefined,
  country: updated.planCountry != null ? String(updated.planCountry) : undefined,
  region: sub.metadata?.region ?? undefined,
  stripe_subscription_id_prefix: sub.id.slice(0, 12),
}).catch(() => {});
```

**Why:** Enables trial start → trial end → converted/churned funnel in PostHog. Currently `learnerConversionSubscribed` fires for both trial AND direct, making it impossible to distinguish acquisition channels.

---

### 2. trial_converted — PostHog Event

**File:** `src/lib/stripe/apply-stripe-webhook-event.ts`
**Location:** Line 1258 — `eventType === "trial_converted"` branch

**Add:**
```typescript
if (eventType === "trial_converted") {
  void captureServerEvent(analyticsDistinctId(row.userId), PH.trialConverted, {
    tier: updated.planTier != null ? String(updated.planTier) : undefined,
    country: updated.planCountry != null ? String(updated.planCountry) : undefined,
    region: sub.metadata?.region ?? undefined,
    revenue_usd: (sub.items?.data?.[0]?.price?.unit_amount ?? 0) / 100,
  }).catch(() => {});
}
```

**Why:** Trial→paid conversion rate is the single most important metric for the US launch. Without this event, PostHog cannot compute it.

---

### 3. subscription_cancelled — PostHog Event

**File:** `src/lib/stripe/apply-stripe-webhook-event.ts`
**Location:** Line 1013 — `eventType: "subscription_cancelled"` (already goes to revenue alert)

**Add:**
```typescript
void captureServerEvent(analyticsDistinctId(row.userId), "subscription_cancelled", {
  tier: updated.planTier != null ? String(updated.planTier) : undefined,
  country: updated.planCountry != null ? String(updated.planCountry) : undefined,
  cancellation_reason: typeof sub.cancellation_details?.reason === "string"
    ? sub.cancellation_details.reason
    : undefined,
  days_subscribed: Math.floor(
    (Date.now() - new Date(row.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  ),
}).catch(() => {});
```

**Note:** Add `"subscription_cancelled"` as a named constant in `posthog-conversion-events.ts` before using.

---

## US-Specific Analytics Gaps

### 4. No US market segmentation in existing events

**Issue:** Most PostHog events don't include a `market` or `region` dimension. PostHog segments are typically built from `$geoip_country_code` (auto-enriched), but this is IP-based and won't distinguish a VPN user.

**Recommendation:** Add `region: "us"` or `country: "US"` as a property to the `appSectionView`, `paywallEncounter`, and `learnerConversionSubscribed` events.

**Implementation:** In `src/lib/observability/learner-analytics-context.client.ts`:
```typescript
// Include marketing region in all learner events
const region = readMarketingRegionFromDocument(); // already exists
```

---

### 5. No conversion event on checkout=success redirect

**Issue:** `route.ts:511` redirects to `/app?checkout=success` but no PostHog client event fires on this page arrival. The `learnerConversionSubscribed` event fires from the webhook (async), but the client-side success state is not tracked.

**Implementation:** In `src/components/student/checkout-success-banner.tsx`:
```typescript
useEffect(() => {
  if (typeof window === "undefined") return;
  if (new URLSearchParams(window.location.search).get("checkout") === "success") {
    trackClientEvent("checkout_success_landing", {
      country: /* from session */ undefined,
    });
  }
}, []);
```

---

## Recommended PostHog Funnels to Create (Day 1)

### Funnel 1: US Acquisition Funnel
```
funnelHomepageViewed (filter: $geoip_country_code = US)
  → funnelExamHubViewed
  → signupSubmitAttempt
  → signupSuccessClient
  → onboardingCompleted
  → trialStarted          ← ADD THIS EVENT
  → trialConverted        ← ADD THIS EVENT
  → funnelSubscriptionRenewed
```

### Funnel 2: US Paywall → Checkout
```
paywallEncounter (filter: country = US)
  → paywallCtaClicked
  → checkoutStarted
  → learnerConversionSubscribed
```

### Funnel 3: US Trial Health
```
trialStarted (filter: country = US)
  → funnelFirstStudyProgress
  → funnelRepeatStudyDay
  → trialConverted
```

### Funnel 4: US Churn
```
learnerConversionSubscribed (filter: country = US)
  → subscription_cancelled
  Track: days_subscribed dimension
```

---

## Revenue Tracking Summary

| Metric | Tracked | Source | Action |
|---|---|---|---|
| New US subscribers | ✅ | `learnerConversionSubscribed` | None |
| US trial starts | ❌ | NOT in PostHog | Add `trialStarted` event |
| US trial conversions | ❌ | NOT in PostHog | Add `trialConverted` event |
| US subscription renewals | ✅ | `funnelSubscriptionRenewed` | None |
| US churn | ❌ | NOT in PostHog | Add `subscription_cancelled` |
| US paywall encounters | ✅ | `paywallEncounter` | None |
| US lesson engagement | ✅ | `learnerLessonStarted` | None |
| US CAT exam starts | ✅ | `learnerCatExamStarted` | None |
