# Subscription Retention, Upgrades, And Chargeback Protection

NurseNest should make paid value visible while keeping billing transparent. Retention should come from trust, progress, fair upgrades, clear reminders, and useful learning momentum, not hidden cancellation friction.

## Subscription Transparency

Required fields:

- Current Plan
- Renewal Date
- Billing Amount
- Next Charge Date
- Subscription Status
- Payment Method

Required surfaces:

- Dashboard
- Account Settings
- Billing Page

The Billing Page remains the source of truth and must show invoices, payment method summary, next invoice amount, renewal date, subscription status, refund policy links, and Stripe management actions.

## Progress-Based Retention

Progress must remain visible through:

- Questions Completed
- Lessons Completed
- Flashcards Mastered
- Readiness Score
- CAT Exams Completed
- ECG Progress
- Clinical Skills Progress
- Medication Math Progress
- Lab Interpretation Progress

The retention message is "What You've Accomplished", not guilt. Use progress, readiness deltas, streaks, and recent activity to remind learners what they would lose access to and what to continue next.

## Subscription Health

Health states:

- Engaged
- At Risk
- Inactive

Signals include recent activity, active study days, readiness improvement, feature adoption, failed payments, and scheduled cancellation. At-risk learners should receive study reminders, progress reports, feature discovery prompts, and billing recovery help when appropriate.

## Feature Discovery

Campaigns should surface unused paid value:

- Try ECG Detective Mode
- Explore Clinical Lab Workstation
- Start Medication Math Practice
- Practice Clinical Skills
- Run A Patient Simulation
- Open Your Study Plan
- Review Readiness Analytics

## Upgrade And Proration

Upgrades must preview proration before applying. Existing subscription management uses Stripe invoice previews and `proration_behavior: "always_invoice"` for immediate upgrades or switches, while downgrades are scheduled at period end without double charging.

Upgrade prompts should include feature counts, screenshots, benefits, and an upgrade CTA for locked ECG, Labs, Simulations, CAT, and Analytics.

## Cancellation Save Flow

Cancellation must remain easy, but thoughtful. Before cancellation, show progress/value context and alternatives:

- Pause subscription
- Switch plan
- Review progress
- Contact support

Do not create dark patterns. The final cancellation control must remain available.

## Chargeback Evidence

Maintain timestamps and immutable evidence for:

- Account Creation
- Email Verification
- Trial Redemption
- Subscription Activation
- Login History
- Usage History
- Feature Usage
- Activity Completion
- Invoice Delivery
- Terms Acceptance

Use `LearnerActivityEvent`, `LearnerActivityAuditSnapshot`, policy acceptance records, subscription history, invoice history, and account activity evidence reports for dispute support.

## Renewal Communications

Send renewal reminders:

- 7 Days Before Renewal
- 3 Days Before Renewal
- Day Of Renewal

Each reminder must include plan, amount, renewal date, cancellation/billing link, and support contact.

## Refund Policy

Refund policy links must be visible on Pricing, Checkout, Billing, Receipts, and Account Settings.

## Win-Back

Cancelled users should hear about meaningful platform improvements: ECG simulators, lab cases, clinical skills, pharmacology, medication math, and readiness tools.

## Referral Guardrails

Rewards require real subscriptions. Referral rewards should not be issued for fake accounts, unverified users, or non-paying trial-only users. Fraud signals remain part of the referral program.

## Revenue Analytics

Track:

- Trial Conversion %
- Monthly Retention %
- Annual Retention %
- Upgrade Rate %
- Cancellation Rate %
- Chargeback Rate %
- Referral Conversion %
- Feature Adoption %
