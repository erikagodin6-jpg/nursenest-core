# Practice Tests I18n Contract Expansion

## Summary

The Practice Tests hub i18n contract now extracts every `learner.practiceTests.hub.*` and `learner.practiceTests.examFirst.*` key directly from `src/components/student/practice-tests-hub-client.tsx` instead of relying on a small fixed key list.

## Covered Sources

The contract validates all extracted hub and exam-first keys across:

- `tools/i18n/marketing/marketing-en.json`
- `nursenest-core/public/i18n/en/learner.json`
- `client/public/i18n/en.json`
- The merged public English bundle from `loadMergedMarketingMessagesFromNextPublicDir()`

## Assertions

For every extracted key, the test asserts:

- The key exists.
- The value is a non-empty string.
- The value is not the raw dotted key.
- The value is not `humanizedMarketingKeyFallback(key)`.
- The value does not leak a raw `learner.practiceTests.hub.*` or `learner.practiceTests.examFirst.*` dotted path.
- Known humanized fallback labels are blocked, including `Hero Title`, `Cta Cat`, `Builder Headline`, `Review Cta`, `Resume Cta`, and `Study Tools Rail Title`.

## Canonical Copy Replacements

The stricter contract identified English strings that exactly matched the fallback heuristic. These were replaced with authored learner-facing copy so regressions are distinguishable from intentional labels. Examples include:

- `Open Pathway Question Bank` -> `Open the pathway question bank`
- `Add` -> `Add topic`
- `Practice Exam` -> `Timed practice exam`
- `Practice Questions` -> `Guided practice questions`
- `Random` -> `Balanced random mix`
- `Start Practice Exam` -> `Start timed practice exam`
- `Start Practice Questions` -> `Start guided practice set`

`npm run i18n:compile` was run after the canonical copy updates so app and client runtime bundles are aligned.

## Validation Evidence

Focused contract run passed after the copy updates:

- `node --import tsx --test src/lib/practice-tests/question-inventory-audit.test.ts src/lib/i18n/practice-tests-hub-i18n-fallback.contract.test.ts src/lib/exams/cat-engine-blueprint.test.ts`

Result: 22 tests passed, 0 failed.
