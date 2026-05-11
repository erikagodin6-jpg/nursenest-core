# Conversion Funnel Audit

Date: 2026-05-11
Status: Baseline audit for Wave 2 execution

## Truthpack note
The required `.vibecheck/truthpack/` bundle is not present in this workspace clone. Funnel observations below are cross-checked against current source files, QA reports, and route/component structure rather than truthpack route manifests.

## Funnel scope
This audit covers the current commercial path across:
- homepage and public premium positioning
- pricing and plan understanding
- signup and auth entry
- onboarding and first-study continuation
- paywall and locked states
- specialty add-on commercialization
- institutional credibility surfaces
- conversion and retention instrumentation foundations

## Executive readout
NurseNest already has many of the ingredients of a mature premium funnel: rich homepage modules, plan-specific pricing work, a polished login shell, a short onboarding wizard, premium-leaning locked states, and a broad event vocabulary for funnel analysis.

The main commercial problem is continuity. Learners can encounter a strong premium story on one surface and then a more operational, less trust-optimized experience on the next. The biggest current conversion leak is the signup and onboarding handoff, where the product begins gathering valuable personalization data but still creates avoidable confusion and does not yet fully deliver a concierge-grade commercial setup experience.

## Stage-by-stage audit
### 1. Homepage
Strengths:
- The homepage is already structured as a premium narrative stack in `home-restored-client.tsx`.
- Dedicated funnel homepage events already exist.
- The page suggests breadth, premium polish, and ecosystem depth.

Risks:
- Premium proof and differentiation are spread across many downstream sections.
- The first value explanation can still feel broader than necessary for a ready-to-buy learner.
- The CTA journey is strong, but the "what exactly am I buying" bridge still depends too much on later pages.

Recommendation:
- Strengthen above-the-fold value compression and clarify the immediate next step into pricing or signup.

### 2. Pricing
Strengths:
- `pricing-page-client.tsx` now has stronger tier-scope clarity, allied profession acknowledgement, checkout-redirect handling, and server/client pricing state management.
- The pricing surface already supports better entitlement transparency than before.

Risks:
- Pricing is increasingly clear, but post-pricing continuity into signup/onboarding still needs to feel like one intentional commercial flow.
- Pricing explains scope, but the next stage still risks reintroducing confusion through signup defaults and noisy setup choices.

Recommendation:
- Preserve pricing clarity and make downstream auth/onboarding honor the same scope language.

### 3. Signup
Strengths:
- Conversion analytics are present.
- The form captures strategic personalization inputs.
- Recovery and support paths are more robust than average.

Risks:
- RN-first default tier is a trust and conversion problem.
- Prior QA already documented RPN/PN exam-option confusion and pathway leakage.
- The form currently mixes account creation and too much profile shaping in one moment.

Recommendation:
- Separate essential signup from premium personalization more cleanly.
- Eliminate silent assumptions about learner track.

### 4. Login
Strengths:
- `marketing-login-page.tsx` is polished, localized, and trust-aware.
- Recovery messaging is built into the experience.

Risks:
- Login quality currently exceeds signup quality.
- The auth funnel feels uneven depending on the entry route.

Recommendation:
- Bring signup and onboarding up to login-shell quality.

### 5. Onboarding
Strengths:
- `trial-onboarding-flow.tsx` is short, calm, and instrumented.
- It already supports a fast path and avoids aggressive sales language.

Risks:
- Current personalization depth is not yet sufficient for a truly premium setup experience.
- There is no strong branching for weak areas, confidence, specialty interest, or beginner vs advanced posture.
- The flow completes cleanly, but the downstream first-study handoff still needs to feel more intelligently tailored.

Recommendation:
- Add a small number of higher-value inputs and directly map them into first-study recommendations.

### 6. Paywall and locked states
Strengths:
- `subscription-paywall.tsx` is already strong: educational preview, objections handling, trust framing, sample content, and contextual progress language.
- `locked-dashboard-overlay.tsx` uses aspiration rather than punishment.

Risks:
- The locked dashboard still uses generic, hardcoded premium language that is not yet pathway-aware.
- The funnel lacks a fully coherent post-purchase and upgrade continuation story.
- Some social proof and reassurance lines remain broad rather than precisely scoped.

Recommendation:
- Make locked-state messaging more specific to learner path, scope, and next action.

### 7. Post-purchase / post-upgrade continuation
Strengths:
- The paywall and onboarding surfaces already hint at what comes next.
- Existing analytics and learner dashboard workstreams give a good foundation.

Risks:
- The strongest immediate risk is not checkout mechanics, but what the learner feels right after conversion.
- Thin first-study momentum, skeleton-heavy states, or unclear next actions can create regret even if checkout succeeds.

Recommendation:
- Treat the first five minutes after conversion as part of the commercial funnel, not as a separate product concern.

### 8. Specialty add-ons
Strengths:
- `advanced-ecg-learner-page.tsx` is explicit and honest about add-on scope and eligibility.
- The surface avoids misleading bundle assumptions.

Risks:
- It still needs stronger standalone commercial framing and richer product confidence signals.

Recommendation:
- Keep entitlement honesty, then add curriculum preview depth, proof, and completion framing.

### 9. Institutional sales readiness
Strengths:
- `marketing-for-institutions-premium-client.tsx` already presents a premium, credible institutional story with screenshots and workflow framing.

Risks:
- The surface is stronger as a brand/credibility page than as a qualified lead funnel.
- Demo request and educator next-step mechanics are not yet prominent enough.

Recommendation:
- Add lightweight sales capture and educator-proof scaffolding before heavier enterprise features.

### 10. Analytics maturity
Strengths:
- `posthog-conversion-events.ts` already includes strong event coverage across homepage, pathways, signup, onboarding, paywall, lessons, CAT, conversion, and retention.

Risks:
- The analytics foundation is richer than the currently standardized funnel views.
- Without stronger funnel coherence, the event set will overstate maturity relative to decision usefulness.

Recommendation:
- Standardize a smaller set of commercial dashboards around acquisition, activation, conversion, first-study momentum, and reactivation.

## Highest-risk conversion leaks
1. Signup defaults and cross-tier confusion.
2. Under-personalized onboarding relative to premium brand promise.
3. Incomplete post-purchase / first-study continuity.
4. Locked-state messaging that is premium but not yet sufficiently path-aware.
5. Institutional and specialty pages that are credible, but not yet fully commercialized as conversion systems.

## Immediate execution priorities
1. Remove RN-first bias and noisy pathway leakage in signup.
2. Upgrade onboarding to feel premium, personalized, and clearly useful within five minutes.
3. Align homepage, pricing, paywall, and onboarding language into one consistent commercial story.
4. Make locked states and post-purchase continuation more explicit, supportive, and pathway-specific.
5. Use the existing PostHog vocabulary to build honest funnel and learner-health reporting.

## Success definition for the next implementation wave
A learner should be able to move from homepage to pricing to signup to onboarding to first study action without needing to infer what the product is, what their plan includes, or what to do next. The funnel should feel premium, trustworthy, and clinically serious at every step, not just on isolated hero surfaces.
