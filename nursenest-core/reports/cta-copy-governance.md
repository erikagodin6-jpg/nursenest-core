# CTA Copy Governance

## Summary

NurseNest now has a lightweight CTA copy policy layer for compact action text across marketing, learner, onboarding, pricing, paywall, practice, CAT, signup/login, and generated-content action surfaces. The goal is not to title-case prose. The guardrails apply to CTA-like strings only.

## Policy Rules

Compact CTA/button labels should use Title Case with connector words kept lowercase when they sit between meaningful terms.

Allowed examples:

- `View Plans and Pricing`
- `Start Mixed Practice`
- `Launch CAT Exam`
- `Create Account`
- `Continue to Flashcards`

Rejected examples:

- `create account`
- `View plans and pricing`
- `START PRACTICE TEST`
- `placeholder CTA`
- `click here`
- `learn more about this feature now`

## Acronym Preservation

The centralized policy preserves clinical and product acronyms:

- `RN`
- `RPN`
- `PN`
- `NP`
- `NCLEX`
- `CAT`
- `REx-PN`
- `ECG`
- `EKG`
- `IV`
- `ICU`
- `ATI`
- `CNA`
- `CPR`
- `BLS`
- `ACLS`
- `PALS`
- `NGN`
- `OSCE`

## Connector Words

The policy keeps these words lowercase when they appear between CTA terms:

- `a`
- `an`
- `and`
- `as`
- `at`
- `by`
- `for`
- `from`
- `in`
- `of`
- `on`
- `or`
- `the`
- `to`
- `with`

Examples:

- `Continue to Flashcards`
- `View Plans and Pricing`
- `Join or Sign In`

## Policy API

Canonical source:

- `src/lib/ui/cta-copy-policy.ts`

Helpers:

- `isLikelyCTA(input, context?)`
- `normalizeCTAText(text)`
- `validateCTACasing(text, options?)`
- `containsPlaceholderCTACopy(text)`
- `assertValidCompactCTA(text, options?)`

`normalizeCTAText()` is safe only for compact CTA/button strings. It must not be used on headings, paragraphs, lesson prose, FAQs, or blog article body copy.

## Audit Scope

Script:

- `scripts/audit-cta-copy.mjs`

Command:

- `npm run audit:cta-copy`

The audit scans CTA-like values in:

- `src/app`
- `src/components`
- `src/config`
- `src/lib`
- `src/legacy`
- `scripts/i18n`

It focuses on keys and component contexts such as:

- `cta`
- `ctaText`
- `ctaLabel`
- `buttonText`
- `buttonLabel`
- `actionLabel`
- `linkLabel`
- `launchLabel`
- `primaryAction`
- `secondaryAction`
- pricing/onboarding/paywall action keys
- compact `Button`, `Link`, and CTA-like JSX children

## Excluded Content Categories

The audit intentionally avoids high-false-positive content/prose areas:

- lesson content
- question banks
- blog prose
- educational content pipelines
- generated lesson/source-of-truth content
- test files
- reports/docs
- build output

Variant-like values such as `primary`, `secondary`, `ghost`, `outline`, and `marketing` are ignored because they are style/config values, not CTA copy.

## Strict Mode

Default audit mode is non-blocking:

```bash
npm run audit:cta-copy
```

CI or predeploy can opt into failure mode:

```bash
CTA_AUDIT_STRICT=1 npm run audit:cta-copy
```

## Regression Examples Prevented

The audit includes built-in fixture checks. Current dry-run output confirms these are caught:

- `View plans and pricing` -> `View Plans and Pricing`
- `Choose your occupation track` -> `Choose Your Occupation Track`
- `Start mixed practice (all hubs)` -> `Start Mixed Practice (All Hubs)`
- `Create account` -> `Create Account`
- `START PRACTICE TEST` -> `Start Practice Test`
- `placeholder CTA` -> placeholder rejection
- `click here` -> placeholder/generic CTA rejection

## Validation Results

Commands run:

| Command | Result |
| --- | --- |
| `npm run typecheck:critical` | Pass |
| `npm run test:unit:cta-copy` | Pass |
| `npm run audit:cta-copy` | Pass in dry-run mode; scanned 3,222 files and reported 82 current CTA candidates. |

Additional validation should be recorded in the final implementation handoff.

## Remaining Limitations

- The audit is intentionally conservative and dry-run by default because the current codebase still has existing sentence-case CTA candidates.
- The script does not rewrite files. Normalization is exposed as a helper, but production code should apply it only to compact CTA labels.
- JSX detection is lightweight and intentionally avoids parsing every possible React child shape to keep the command fast and low-risk for CI.
- Non-English localized CTA strings may need locale-specific casing policy before strict mode is applied globally to translated shards.
