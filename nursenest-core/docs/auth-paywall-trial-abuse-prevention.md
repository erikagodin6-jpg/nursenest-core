# Authentication, Paywall, And Free-Trial Abuse Prevention

Generated: 2026-05-30

## Public Access Model

Visitors can browse high-value discovery surfaces without an account. These pages should explain the platform, show screenshots, show live counts where available, and make the subscription value obvious:

- `/`
- `/pricing`
- `/canada/rn/nclex-rn`
- `/canada/pn/rex-pn`
- `/np`
- `/allied-health`
- `/ecg-telemetry-mastery`
- `/labs-interpretation`
- `/clinical-modules`
- `/cnple-pharmacology`
- `/canada/rn/nclex-rn/flashcards`
- `/canada/rn/nclex-rn/lessons`
- `/canada/rn/nclex-rn/questions`

Visitors may see screenshots, descriptions, learning objectives, feature lists, content counts, difficulty levels, estimated completion times, sample report cards, sample readiness dashboards, and upgrade prompts.

## Premium Launch Boundary

Visitors cannot launch premium learning activities. Launch attempts should resolve to Create Free Account or Sign In, not a silent failure and not a hidden product.

Protected launch surfaces include:

- Flashcards
- Lessons
- Practice Questions
- CAT Exams
- ECG Activities
- Labs Activities
- Medication Math Activities
- Pharmacology Activities
- Clinical Skills Activities
- Simulations
- Readiness Assessments
- Analytics

## Account And Trial Model

Registration creates a Basic Account. Basic accounts can access dashboard previews, study planning previews, limited content previews, and upgrade opportunities. Premium content access requires either an eligible 3-day trial or a paid subscription.

The free trial is 3 days and one trial per person. Abuse prevention uses layered signals, not a single trusted check.

## Trial Eligibility Signals

The trial eligibility engine scores:

- User ID
- Email
- Verified email status
- Disposable email domain
- Hashed device fingerprint
- Previous trial history
- Subscription history
- Stripe email billing history
- Account creation clusters by IP
- Payment history absence as a weak signal

Risk levels:

- Low Risk: verified email, unique device, no prior trial or billing history.
- Medium Risk: shared network or weak account signals, but no direct repeat-trial evidence.
- High Risk: disposable email, prior trial, known device, subscription history, or Stripe billing history.

High-risk accounts lose automatic trial eligibility and may still subscribe.

## Privacy Rules

Device identifiers are stored as hashes only. Fingerprinting is an abuse signal, not a sole enforcement authority. Do not store unnecessary raw browser characteristics or payment details.

## Server-Side Enforcement

Frontend hiding is not a security boundary. Premium content must be protected through:

- API entitlement checks
- Server actions
- Database query filters
- Lesson payload gates
- Question payload gates
- Flashcard payload gates
- Simulation payload gates

Entitlements are DB-backed. Browser query params, checkout redirects, and client state must never grant access by themselves.

## Upgrade Experience

Locked content should show value before asking for payment:

- Included In Your Plan
- Upgrade To Unlock
- Content counts
- Screenshots
- Learning objectives
- Benefits
- Progress or readiness that would unlock

Example:

```text
Included In RN Premium
642 Flashcards
183 Practice Questions
24 Lessons
17 Simulations
Upgrade To Access
```

## Analytics

Track:

- Hub Visits
- Locked Content Clicks
- Trial Activations
- Trial Blocks
- Trial Conversions
- Upgrade Conversions
- Abuse Attempts
- Account Creation Funnel

Trial blocks should feed premium-protection telemetry and admin review queues when thresholds are met.
