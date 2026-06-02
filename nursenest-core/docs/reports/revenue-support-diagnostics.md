# Revenue Support Diagnostics

Generated: 2026-06-02

## Summary

Implemented an admin-only revenue diagnostics panel on the existing user support detail page:

- `/admin/users/[userId]`
- backing API/helper: `loadAdminUserSupportDetail(userId)`

The panel is read-only and inherits the existing server-side admin gate for the support page and support API.

## Files Changed

- `src/lib/admin/load-admin-user-support-detail.ts`
- `src/app/(admin)/admin/users/[userId]/page.tsx`

## Diagnostics Added

### Subscription

The panel now displays:

- subscription status
- plan / plan code
- billing interval
- renewal date
- trial end date

Data source:

- `Subscription.status`
- `Subscription.planCode`
- `Subscription.planTier`
- `Subscription.planDuration`
- `Subscription.currentPeriodEnd`
- `Subscription.trialEnd`

### Stripe

The panel now displays:

- Stripe customer ID
- Stripe subscription ID
- last Stripe webhook claim received
- last successful entitlement sync timestamp

Data source:

- `Subscription.stripeCustomerId`
- `Subscription.stripeSubscriptionId`
- `StripeWebhookEvent.createdAt`
- `Subscription.updatedAt`

Note: `StripeWebhookEvent` currently stores idempotency claim ID and created time only, so the last webhook value is global rather than user-linked unless a related revenue alert row exists.

### Notifications

The panel now displays:

- last subscription-related learner email
- last admin revenue notification
- last admin SMS notification
- provider configuration presence for email and SMS

Data source:

- `EmailNotificationLog`
- `kind = revenue_alert`
- `kind = admin_paid_subscription_sms`
- subscription-like learner notification kinds matched by billing/trial/payment keywords

### Feature Matrix

The panel now displays:

- Lessons
- Flashcards
- Practice Tests
- CAT
- Report Cards
- Study Plans
- Analytics
- ECG
- Labs

Each feature shows:

- `ALLOWED` or `DENIED`
- the exact access rule responsible

Base learner surfaces use:

- `requireSubscriberSession -> getUserAccess.hasPremium`

ECG and Labs include the base learner access rule plus add-on diagnostics:

- Advanced ECG module status, tier eligibility, and add-on plan presence
- Advanced Labs module status, tier eligibility, and add-on plan presence

## Operational Outcome

An administrator can now diagnose the most common revenue-support issues from one screen:

- paid in Stripe but denied in app
- active local subscription row but stale entitlement sync
- missing Stripe IDs
- missing notification provider configuration
- missing admin/SMS notification attempts
- feature denied because base entitlement is absent
- ECG/Labs denied because add-on entitlement is missing or tier/module status blocks it

## Remaining Caveats

- Webhook claims are not currently linked to a user in `StripeWebhookEvent`; exact per-user webhook history depends on revenue alert metadata or subscription updated timestamps.
- Provider configuration is displayed as present/missing only. It does not send a live test notification from the support panel.
- The panel does not mutate subscriptions, trigger Stripe actions, or repair entitlement drift.
