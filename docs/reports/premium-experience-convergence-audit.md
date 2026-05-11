# Premium Experience Convergence Audit

Date: 2026-05-11
Status: Baseline audit for Wave 1 execution

## Truthpack note
The required `.vibecheck/truthpack/` bundle is not present in this workspace clone. Route, funnel, and surface observations below are grounded in the live repo structure, current runtime components, and existing QA reports rather than regenerated truthpack JSON.

## Audit basis
This baseline was derived from:
- `/.cursor/plans/premium_convergence_c75134e3.plan.md`
- `nursenest-core/src/components/marketing/home-restored-client.tsx`
- `nursenest-core/src/components/auth/signup-form.tsx`
- `nursenest-core/src/components/marketing/marketing-login-page.tsx`
- `nursenest-core/src/components/onboarding/trial-onboarding-flow.tsx`
- `nursenest-core/src/components/student/subscription-paywall.tsx`
- `nursenest-core/src/components/student/dashboard/locked-dashboard-overlay.tsx`
- `nursenest-core/src/components/advanced-ecg/advanced-ecg-learner-page.tsx`
- `nursenest-core/src/components/marketing/marketing-for-institutions-premium-client.tsx`
- `nursenest-core/src/lib/observability/posthog-conversion-events.ts`
- `docs/qa-reports/rpn-learner-journey-20260507-1659/QA-REPORT.md`

## Executive summary
The platform already has a stronger premium foundation than a typical audit starting point: the homepage is modular and premium-leaning, login already uses a dedicated trust shell, paywall states include educational value framing, and conversion analytics vocabulary is much more mature than the visible funnel experience suggests.

The main gap is not lack of capability, but lack of convergence. Core commercial surfaces still feel like separate improvements rather than one coordinated premium journey. The most obvious friction remains at signup and onboarding, where the product starts collecting useful context but still introduces avoidable confusion, RN-first defaults, and an account-creation flow that feels more operational than concierge-grade.

## Surface findings
### 1. Homepage and public premium narrative
Current strengths:
- `home-restored-client.tsx` is already organized as a premium stack: hero, screenshots, ECG, pathway showcase, clinical depth, ecosystem, trust, and final CTA.
- The shell already fires a dedicated homepage funnel beacon, which gives Wave 2 a strong instrumentation starting point.
- The overall structure supports premium storytelling better than a generic landing page.

Current risks:
- Value communication is distributed across many deferred sections, which can weaken first-screen clarity for a high-intent learner.
- The architecture suggests strong breadth, but the immediate "why pay now" case may still depend too much on below-the-fold exploration.
- The current premium feel is modular, but not yet tightly sequenced as one dominant acquisition narrative.

Priority:
- Tighten value hierarchy in the hero and early sections before adding new surface complexity.

### 2. Login and auth-entry surfaces
Current strengths:
- `marketing-login-page.tsx` already wraps login in a dedicated premium auth shell with trust reassurance, recovery guidance, and localized message loading.
- This surface feels materially more polished and supportive than a default auth form.

Current risks:
- Login is stronger than signup, so the auth experience is asymmetric.
- Recovery messaging is present, but the overall flow still depends on the learner already understanding the value proposition before arriving.

Priority:
- Use login as the quality bar for signup and onboarding, not as a separate standard.

### 3. Signup flow
Current strengths:
- `signup-form.tsx` already captures useful context like country, tier, exam focus, learner path, study goal, and daily study minutes.
- Conversion instrumentation is present for submit attempts and signup success.
- Error handling and recovery links are more mature than most raw signup forms.

Current risks:
- The form still defaults `tier` to `RN`, which creates a commercial and product-trust risk for non-RN learners.
- The RPN QA report already documented tier/exam leakage and RN-first confusion in the signup controls.
- The form asks for several strategic decisions before account creation, but does not yet feel like a guided premium setup flow.
- The pathway block reads as helpful, but visually still behaves like a dense settings cluster inside the signup form.

Priority:
- Remove silent RN-first bias.
- Reduce cognitive load at account creation.
- Reserve richer personalization for post-account onboarding where the product can explain why each answer matters.

### 4. Onboarding flow
Current strengths:
- `trial-onboarding-flow.tsx` is calm, short, and premium-leaning.
- The flow already has progress, a fast path, and onboarding analytics events.
- The copy avoids hard-sell language and supports a low-friction first-study outcome.

Current risks:
- Current personalization is still shallow: exam goal, exam date, and study style are useful but not enough to deliver the "intelligent premium setup" the program calls for.
- The fast path is good for momentum, but the flow currently does not branch meaningfully for beginner vs advanced, weak-area support, or specialty interest.
- The final CTA promises a study plan, but the surrounding product journey still needs a clearer post-onboarding continuation handoff.

Priority:
- Keep the flow short, but deepen the quality of personalization rather than the number of screens.

### 5. Paywall and locked learner states
Current strengths:
- `subscription-paywall.tsx` is already significantly better than a generic upsell: it includes preview content, objections handling, trust reinforcement, sample exploration links, and context-aware progress language.
- `locked-dashboard-overlay.tsx` frames premium access aspirationally rather than as a dead end.
- These surfaces already align with the product rule of supportive rather than manipulative monetization.

Current risks:
- The locked dashboard copy still uses broad, hardcoded social-proof language rather than pathway-aware or entitlement-aware messaging.
- The dashboard overlay is premium in tone, but it is not yet integrated into a full "what happens next" journey.
- Value is explained well inside the paywall itself, but post-purchase continuity and path-specific upgrade rationale are still incomplete.

Priority:
- Keep the premium educational framing.
- Make the surfaces more pathway-specific and better connected to next actions after purchase or trial start.

### 6. Dashboard and first-study momentum
Current strengths:
- The plan already targets dashboard convergence separately, which is appropriate.
- Existing locked-state work shows the intended command-center direction.

Current risks:
- The prior RPN learner journey report documented empty or skeletal first-paint risk on study surfaces.
- A premium commercial experience cannot hand off from polished conversion pages into thin-loading or ambiguous "what now?" study states.

Priority:
- Dashboard convergence should emphasize one dominant next action and stronger continuity from onboarding answers.

### 7. Specialty commercialization
Current strengths:
- `advanced-ecg-learner-page.tsx` is unusually clear about entitlement boundaries: separate paid module, separate pricing, base subscription requirements, and tier eligibility.
- This is a strong model for honest premium add-on messaging.

Current risks:
- The entitlement explanation is strong, but the surface still feels more like a well-labeled module scaffold than a fully commercialized specialty product.
- The product story needs richer curriculum confidence, progress framing, screenshots, and outcomes messaging.

Priority:
- Keep the current entitlement clarity intact while upgrading perceived standalone product value.

### 8. Institutional credibility
Current strengths:
- `marketing-for-institutions-premium-client.tsx` already has premium hero treatment, workflow framing, trust chips, screenshot carousels, and benefit sections.
- The page looks like a credible commercial surface rather than placeholder enterprise copy.

Current risks:
- The experience is strong at positioning, but still lighter on real operational proof: demo flow, educator next steps, and clearer sales capture progression.
- The page currently markets institutional readiness better than it demonstrates a credible lightweight operational foundation.

Priority:
- Keep the page premium, but introduce cleaner demo-request and educator proof scaffolding before adding heavier enterprise mechanics.

### 9. Analytics readiness
Current strengths:
- `posthog-conversion-events.ts` already defines a broad canonical event vocabulary for homepage, pathways, signup, onboarding, paywall, lessons, practice, CAT, conversion, and retention.
- This gives the program a real analytics foundation rather than a blank slate.

Current risks:
- Instrumentation breadth is ahead of funnel cohesion.
- The remaining work is not "add more events" first; it is align the event vocabulary with the exact commercial states and transitions the learner now experiences.

Priority:
- Normalize dashboard/report usage around a smaller set of actionable commercial and learner-health views.

## Highest-priority execution sequence
1. Fix signup trust and pathway clarity issues first.
2. Upgrade onboarding into a more personalized but still short premium setup.
3. Tighten the homepage -> pricing -> signup -> onboarding story into one premium conversion arc.
4. Make locked/paywall states more pathway-aware and more explicit about post-purchase continuation.
5. Use the existing analytics vocabulary to standardize a real funnel dashboard, rather than expanding tracking breadth immediately.

## Recommended immediate implementation slices
1. Signup refinement:
   - Remove RN-first default behavior.
   - Reduce cross-tier exam leakage.
   - Reframe signup as account creation first, personalization second.
2. Onboarding refinement:
   - Add higher-value personalization inputs with minimal added friction.
   - Improve the "study plan is ready" handoff into the first action.
3. Conversion continuity:
   - Tighten homepage, pricing, paywall, and onboarding copy so they describe the same premium promise.
4. Locked-state coherence:
   - Make upgrade rationale more pathway-aware and less generic.

## Acceptance standard for the next wave
The next implementation wave should make NurseNest feel like one premium commercial system, not a set of independently improved surfaces. The critical success condition is continuity: a learner should understand what they are buying, why it is valuable, what happens after signup, and what to do next once they arrive in the learner experience.
