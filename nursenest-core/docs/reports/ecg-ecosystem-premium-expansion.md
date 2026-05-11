# Advanced ECG & Telemetry Mastery Premium Expansion

## Product shape

Advanced ECG now behaves as a standalone premium specialty module inside NurseNest rather than an included extension of the base learner plans. The public and learner surfaces were split intentionally:

- Public marketing cluster: `/advanced-ecg`, `/advanced-ecg/telemetry`, `/advanced-ecg/12-lead`, `/advanced-ecg/acls`, `/advanced-ecg/case-studies`, and `/advanced-ecg/pacemaker-rhythms`, plus mirrored `/{locale}` routes for the localized Phase 1 launch.
- Protected learner cluster: `/modules/ecg-advanced` plus the dedicated section tree and pacemaker subtree.
- Legacy `/modules/ecg/advanced/*` routes now redirect into the new learner IA instead of preserving a parallel surface.

The billing model is now a one-time purchase specialty entitlement. Stripe checkout for Advanced ECG uses `mode: "payment"` and persists lifetime access without granting any base subscription expansion.

## Entitlements and learner progression

The entitlement model now preserves the requested hierarchy:

- `advanced_ecg` ownership automatically unlocks the foundational ECG experience.
- Basic ECG access does not unlock Advanced ECG.
- Server-side helpers resolve both the specialty and foundational ECG states from one shared entitlement decision.

This keeps the learner journey coherent: Advanced ECG owners can move from foundational ECG into telemetry, 12-lead, ACLS, and pacemaker sections without buying a second ECG product, but the base RN or NP subscription still does not silently inherit the premium module.

## Dashboard and premium positioning

The learner dashboard now renders a dedicated **Specialty Modules** band above the generic study-mode launcher. The Advanced ECG card has distinct locked and owned states so the module reads like a premium specialty product rather than another included quick-launch tile.

The card messaging intentionally reinforces the product contract:

- separate premium specialty module
- one-time purchase framing
- includes Basic ECG Foundations
- telemetry / ICU / advanced interpretation positioning

## Public marketing cluster and SEO

The public marketing cluster now ships from a shared Advanced ECG marketing surface with default and localized route wrappers. Metadata and hreflang are shaped through the existing marketing alternates helpers so the canonical English routes remain stable while `/{locale}` versions participate in the same cluster.

Sitemap coverage was extended in two places:

- English-default Advanced ECG marketing paths are included in the core public sitemap collector.
- Localized `/{locale}/advanced-ecg/*` paths are emitted from the localized marketing-safe collector.

Learner routes remain under the protected module tree and continue to stay out of public indexing.

## Pacemaker curriculum and fidelity stance

Pacemaker interpretation was expanded as a first-class advanced telemetry lane, but Phase 1 remains intentionally conservative.

The curriculum now carries explicit delivery metadata for pacemaker units:

- `foundations` and `malfunctions` are marked as `curated_static_strip`
- `critical-care` and `cases` are marked as `curated_case_walkthrough`
- every pacemaker unit includes an explicit review requirement and a publish guardrail

The core fidelity decision is:

> Pacemaker learner content is Phase 1 curated-strip only. Generated pacing physiology from the simplified waveform renderer remains internal-only.

This means the product can market pacemaker interpretation and teach it through curated walkthroughs without pretending that the current live-strip renderer is faithful enough to ship advanced device physiology.

## Safety and governance implementation

The ECG governance stack now enforces a specific pacemaker quarantine rule:

- generator-backed paced strips (`paced_rhythm` delivered through `ecg_live_strip`) are treated as internal-only
- those rows no longer become learner-visible even if they were otherwise marked approved
- admin warnings explicitly call out that pacemaker generator output must be replaced with static clinician-reviewed strips before publication

Readiness and admin reporting were extended so the advanced ECG governance view can surface:

- pacemaker inventory count
- generated pacemaker inventory count
- leaked generated pacemaker count
- pacemaker curriculum delivery rules

Publishing is blocked if any generated pacemaker strip becomes learner-visible.

## Verification

Focused verification completed during implementation:

- Advanced ECG checkout and access tests remained green after the lifetime purchase conversion.
- Learner route contract tests passed for the new `/modules/ecg-advanced` tree and legacy redirects.
- Dashboard contract test passed for the Specialty Modules card integration.
- Marketing route and sitemap smoke checks confirmed all six public paths and localized sitemap emission.
- Pacemaker governance smoke checks confirmed generator-backed paced strips resolve to non-learner-visible.

One readiness smoke that touched Prisma-backed ECG inventory could not complete in this workspace because the current connected database does not expose the ECG tables. The no-DB logic checks and targeted unit/contract tests still passed.

## Future roadmap boundary

This rollout does **not** introduce learner-visible generated pacing simulation. Future pacing simulation work should only happen after:

1. stronger pacing-specific waveform validation
2. clearer device-mode fidelity guarantees
3. a dedicated quarantine and publication workflow for paced physiology assets

Until then, pacemaker education stays inside curated static strips, annotated cases, and clinician-reviewed walkthroughs.

## Pacemaker track expansion addendum

The pacemaker lane has now been tightened from a generic sub-track into a dedicated five-part interpretation framework inside Advanced ECG & Telemetry Mastery.

### Structured curriculum

The learner-facing pacemaker teaching model now calls out five distinct sections:

1. **Pacemaker Foundations**: anatomy, pacing modes, sensing, capture, intrinsic rhythm interaction, pacing spikes, atrial versus ventricular pacing, and dual-chamber pacing.
2. **Paced Rhythm Recognition**: atrial paced rhythms, ventricular paced rhythm patterns, AV sequential pacing, demand pacing, and asynchronous pacing.
3. **Pacemaker Malfunctions**: failure to capture, failure to sense, failure to pace, undersensing, oversensing, and pseudomalfunction recognition.
4. **Critical Care Pacemaker Interpretation**: temporary pacing, transcutaneous pacing, transvenous pacing, ICU telemetry monitoring, unstable paced patients, and pacing emergencies.
5. **Advanced Concepts**: fusion beats, pseudofusion, ICD rhythms, CRT / biventricular pacing, and pacemaker-mediated tachycardia.

### Learning experience and telemetry integration

The lane is intentionally framed as an ICU-grade telemetry competency rather than a minor ECG appendix. Pacemaker surfaces now emphasize:

- annotated paced strips
- pacing-spike highlighting
- capture overlays
- step-by-step interpretation
- malfunction callouts
- telemetry scenarios
- case progression

This keeps pacemaker interpretation visually and educationally aligned with the broader telemetry, ACLS, and case-based specialty module rather than isolating it as a disconnected lesson type.

### Fidelity and governance decisions

The safety boundary remains unchanged and explicit:

- no unsupported generated pacing morphologies are marketed as clinically validated
- no inaccurate paced rhythms are exposed to learners
- clinician-reviewed static strips and curated walkthroughs remain the only learner-safe Phase 1 pacing delivery mode
- generated pacing physiology from the simplified waveform renderer stays quarantined, internal-only, and non-publishable

### Public SEO positioning

The public pacemaker marketing page now targets search intent around:

- pacemaker ECG interpretation
- paced rhythm recognition
- telemetry pacemaker strips
- pacemaker malfunction ECG
- ventricular paced rhythm
- ICU telemetry pacing

### Future pacing roadmap

Future pacing simulation work remains roadmap-only. Before any learner-visible simulation is introduced, the module needs stronger pacing-specific waveform validation, explicit device-mode fidelity guarantees, and a dedicated publication workflow for paced assets that can safely distinguish preview, internal, and learner-ready states.
