# ECG Safety Hardening Pass

Date: 2026-05-11

## Summary

This pass hardens the ECG module so clinically unsupported or insufficiently reviewed ECG content does not become learner-visible or publish-ready by default.

The implementation does **not** try to fake physiologic behavior in the current renderer. Instead, it adds governance metadata, learner-surface filtering, readiness hardening, and explicit quarantine behavior for conduction patterns the deterministic strip engine cannot faithfully model today.

## Schema additions

Added ECG question governance metadata to `prisma/schema.prisma` on `EcgVideoQuestion`:

- `clinicianReviewedAt`
- `clinicianReviewedBy`
- `waveformFidelity`
- `qaStatus`
- `publishSafetyStatus`

Repo migration artifact added:

- `prisma/migrations/20260511031500_add_ecg_question_governance_columns/migration.sql`

### Allowed waveform fidelity values

- `educational_simplified`
- `morphology_approximate`
- `clinician_reviewed`
- `electrophysiology_validated`

### Allowed QA status values

- `pending`
- `internal_review`
- `approved`
- `rejected`
- `quarantined`

### Publish safety status values used in this pass

- `safe`
- `context_required`
- `internal_only`
- `unsafe`

## Quarantined rhythms

These rhythms are now treated as internal-only because the current renderer does not faithfully model the conduction behavior required for safe learner publication:

- `first_degree_av_block`
- `second_degree_type_i_av_block`
- `second_degree_type_ii_av_block`
- `third_degree_av_block`

The templates remain in the system. They are not deleted. They are quarantined from learner visibility and do not count toward publish readiness.

## Readiness logic changes

Readiness now distinguishes between:

- raw ECG inventory present in the database
- ECG content that is actually safe to count as learner-ready

An ECG item only counts as publish-ready when all of the following are true:

- renderable media exists
- `clinicianReviewedAt` exists
- `qaStatus = approved`
- `publishSafetyStatus = safe`
- the rhythm is not quarantined

### Practical effect

- pending generated ECG rows no longer count as ready
- media-less ECG rows no longer count as ready
- quarantined AV block rows no longer count as ready
- publish gates use **ready** ECG counts rather than raw inventory counts

## Learner exposure hardening

The learner question store now filters ECG questions through shared safety governance instead of relying only on tier and mode filters.

That means ECG rows must be:

- clinician reviewed
- QA approved
- publish safe
- renderable
- not quarantined

before they can appear in learner ECG pools or answer flows.

RN/NP gating, premium gating, and CAT exclusion behavior were preserved.

## Admin tooling changes

The ECG admin page now surfaces warnings for:

- approximate waveform fidelity
- contextual-diagnosis rhythms
- missing clinician review metadata
- quarantined conduction-pattern rhythms

This keeps admin publish tooling honest about what is simplified, what is contextual, and what remains internal-only.

## Source behavior changes

### Curated ECG pack

- curated rows now carry explicit clinician and QA metadata
- quarantined rhythms inside the curated pack are marked `qaStatus = quarantined`
- quarantined rhythms are marked `publishSafetyStatus = internal_only`

### Generated ECG rows

- generated rows now default to:
  - `waveformFidelity = educational_simplified`
  - `qaStatus = pending`
  - `publishSafetyStatus = internal_only`

Generated-only rows therefore stay internal until explicit clinical review and approval happen.

### Draft-promoted ECG rows

- draft-promoted ECG questions now default to internal review / internal-only governance instead of being implicitly learner-safe

## Remaining renderer limitations

This pass intentionally avoids pretending the renderer is physiologically accurate where it is not.

Known limitations still present in the deterministic strip engine:

- no faithful prolonged PR interval modeling
- no progressive PR-lengthening visualization before dropped beats
- no proper Mobitz II nonconducted-beat modeling
- no true AV dissociation rendering
- no calibrated paper-speed modeling from `paperSpeed`
- no lead-aware STEMI representation
- no true context-coupled PEA interpretation
- no chamber-specific pacing model
- no electrophysiology-grade amplitude/time calibration

## Tests added or updated

Added or updated tests covering:

- quarantined AV block variants remain internal-only
- learner visibility requires clinician review, QA approval, safe publish status, and media
- publish-ready ECG counts exclude pending, media-less, generated-only, and quarantined rows
- generated defaults remain non-publishable by default
- contract coverage for learner-pool filtering, readiness governance, schema fields, and CAT exclusion

## Verification

Passed:

- `npm run db:generate`
- `node --import tsx --test src/lib/ecg-module/ecg-safety-governance.test.ts`
- `npm run test:ecg-video-quiz`
- `npm run typecheck:critical`

Also checked:

- `ReadLints` on the edited ECG/admin/schema files returned no lint issues

Separate note:

- the broader hidden-module regression suite still reports pre-existing failures outside this safety pass, including public-surface leak checks unrelated to the new ECG QA governance wiring
- I did **not** apply the new Prisma migration against the live database from this session

## Recommended future electrophysiology engine architecture

The next safe step is **not** to keep piling heuristics into the current SVG generator.

Recommended future direction:

1. Introduce a dedicated ECG morphology engine with explicit time-domain modeling for:
   - atrial activity
   - AV conduction timing
   - dropped conduction
   - ventricular escape rhythms
   - paced chamber behavior

2. Separate:
   - rhythm metadata
   - waveform-generation parameters
   - educational safety metadata
   - diagnosis/context requirements

3. Add render-aware validation that measures generated strip features instead of validating metadata alone.

4. Support lead-aware strip definitions for patterns like STEMI and electrolyte changes where single-strip generic rendering is clinically insufficient.

5. Add clinician sign-off workflow tied to immutable waveform versions so learner-visible ECG content can be reviewed against the exact rendered output, not just template metadata.
