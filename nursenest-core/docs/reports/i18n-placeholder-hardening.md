# I18n Placeholder Fallback Hardening

Generated: 2026-05-10

## Summary

The existing placeholder parity path remains the source of truth: `script/merge-marketing-i18n.ts` writes `tools/i18n/reports/placeholder-fallbacks.json`, and `npm run i18n:report-placeholder-fallbacks` now also writes `tools/i18n/reports/placeholder-fallback-audit.json`.

## Current Findings

Latest reporter output:

- Total placeholder fallbacks: 81
- Locales affected: 21
- Critical SEO leakage: 0
- Blocked learner locale candidates: 0

By locale:

- `ar=3`, `de=3`, `es=3`, `fa=5`, `fr=3`, `hi=4`, `ht=5`, `id=3`, `it=4`, `ja=3`, `ko=5`, `pa=4`, `pt=4`, `ru=4`, `th=4`, `tl=3`, `tr=5`, `ur=4`, `vi=4`, `zh=4`, `zh-tw=4`

## Classification

The audit classifies events into:

- `criticalSeoLeakage`: public marketing/hub keys where placeholder fallback could leak English into localized SEO surfaces.
- `blockedLocaleCandidate`: learner-critical keys, currently focused on `learner.practiceTests.*`, `examFirst.*`, and hub learner namespaces.
- `acceptableFallback`: placeholder parity fallbacks that still need translation cleanup but are not currently categorized as public SEO or learner-critical leakage.

## Thresholds

The reporter remains report-only by default. Optional env gates:

- `NN_I18N_PLACEHOLDER_FAIL_THRESHOLD`: fail if total fallback count exceeds the value.
- `NN_I18N_PLACEHOLDER_SEO_FAIL_THRESHOLD`: fail if `criticalSeoLeakage` count exceeds the value.

Both thresholds require non-negative numeric values and only affect the reporter command exit code when set.

## Tests

- `../script/i18n-report-placeholder-fallbacks.test.ts` covers classification and threshold behavior.
- `src/lib/i18n/practice-tests-hub-i18n-fallback.contract.test.ts` guards learner Practice Tests hub copy against humanized fallback strings such as `Hero Title`, `Cta Cat`, and `Builder Headline`.

## Residual Work

The remaining 81 fallbacks should be resolved by fixing locale overlay placeholder names so translated values preserve the same `{{placeholder}}` names as English. No i18n architecture or shard flow was changed.
