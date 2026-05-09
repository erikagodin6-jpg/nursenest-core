# Ecosystem guardrails rollout (agents & Cursor)

**Date:** 2026-05-09  
**Type:** Governance — documentation and Cursor rules only (no product surface redesign).

## Objective

Permanent guardrails so engineering, Cursor, Figma handoff, and AI-generated UI converge on **one** NurseNest ecosystem: shared primitives, shells, semantic tokens, navigation, adaptive loops, and brand identity — without isolated mini-apps or design drift.

## Files changed

| File | Change |
|------|--------|
| `.cursor/rules/ecosystem-platform-guardrails.mdc` | **Added** — always-applied rule with 10 sections (platform, Labs, ECG, Advanced ECG, simulations, themes, tokens, nav/shell, adaptive learning, brand). |
| `.cursor/rules/lab-values-ecosystem-positioning.mdc` | **Removed** — merged into the platform guardrail file to avoid duplicate/conflicting Lab Values instructions. |
| `AGENTS.md` | **Updated** — new “Platform ecosystem guardrails” section at top with summary + pointers. |
| `docs/ecosystem-design-system-convergence.md` | **Updated** — cross-reference now points to `ecosystem-platform-guardrails.mdc`. |
| `docs/governance/ecosystem-guardrails-rollout.md` | **Added** — this report. |

## Rules added (summary)

1. **Platform** — One ecosystem; shared primitives registry; no vertical mini-apps.  
2. **Lab Values** — Adaptive interpretation via `/app/labs`; reject calculator/reference/spreadsheet UX.  
3. **ECG** — Integrated telemetry learning; shared shells/nav.  
4. **Advanced ECG** — Distinct premium product; separate entitlements; no accidental core bundling.  
5. **Case study / simulation** — Real branching, labs/telemetry/NGN integration; shared shells.  
6. **Themes** — Aurora/Ocean/Garden/Midnight: expression only; no layout forks.  
7. **Tokens** — Semantic/theme tokens; no raw hex in production components (see semantic-color guardrails).  
8. **Navigation + shell** — Single canonical model; preserve routes, i18n, entitlements.  
9. **Adaptive learning** — Linked loops and platform signals; no parallel scoring products.  
10. **Brand** — Logo, wordmark, DM Sans; reject serif/enterprise/gamer/generic SaaS clones.

## Rationale

- **Single source of truth** for ecosystem philosophy reduces conflict between `global-engineering-constraints`, `nursenest-production-governance`, and vertical-specific work.
- **Lab Values** rules were consolidated so Labs edits do not require hunting multiple rule files.
- **Advanced ECG** is called out so entitlement and monetization work stays explicit and reviewable.

## Relationship to existing rules

- **Does not replace:** `global-engineering-constraints.mdc`, `nursenest-production-governance.mdc`, `semantic-color-guardrails.mdc`, `truthpack-first-protocol.mdc`, `rn-lesson-library-safety.mdc`, etc.
- **Complements:** Adds product/ecosystem positioning that those files do not fully spell out.

## Future enforcement strategy

1. **PR review** — Reviewers confirm net-new UI uses tokens/shells per guardrails + semantic-color rules.  
2. **Refactors** — When touching Labs/ECG/simulation surfaces, migrate stragglers toward primitives listed in `docs/ecosystem-design-system-convergence.md`.  
3. **Lint/a11y** — Optionally extend CI grep for raw `#` in `src/components` (allowlisted preview paths).  
4. **Figma** — Align component names with primitive vocabulary in convergence doc.

## Validation

- No conflicting instructions: Advanced ECG separate monetization is **product guardrail** — implementation must follow live truthpack/product specs when they exist; this rule prevents silent bundling mistakes.  
- **Concision:** Single always-applied rule (~90 lines) + short `AGENTS.md` paragraph to limit token noise.

## Subsequent updates

| Date | Change |
|------|--------|
| 2026-05-09 | Added `docs/planning/clinical-readiness-ecosystem-implementation-directive.md` — homepage placement, hub patterns, `/app/account/report`, CAT/flashcards, marketing + subscription positioning, adaptive integration; linked from `ecosystem-platform-guardrails.mdc`, `AGENTS.md`, `docs/ecosystem-design-system-convergence.md`, `subscription-clinical-readiness-ecosystem.md`. |
| 2026-05-09 | Added `docs/planning/bls-acls-pals-emergency-readiness-pathways.md` and `.cursor/rules/bls-acls-pals-emergency-readiness.mdc` — future BLS/ACLS/PALS as integrated emergency-readiness ecosystems; homepage row G + cross-links. |
