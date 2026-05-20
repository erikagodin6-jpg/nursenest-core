# RN Practice Tests Hub i18n Fallback Audit

Date: 2026-05-10

## Files Audited

- `src/components/student/practice-tests-hub-client.tsx`
- `src/app/(student)/app/(learner)/practice-tests/page.tsx`
- `src/app/(student)/app/layout.tsx`
- `src/lib/learner/learner-marketing-server.ts`
- `src/lib/marketing-i18n/marketing-i18n-shard-groups.ts`
- `src/components/i18n/marketing-i18n-provider.tsx`
- `src/lib/marketing-i18n/marketing-message-value-policy.ts`
- `tools/i18n/marketing/marketing-en.json`
- `nursenest-core/public/i18n/en/learner.json`
- `client/public/i18n/en.json`
- `src/lib/i18n/marketing-message-keys.generated.ts`

## Findings

The learner Practice Tests hub is an interactive client component that calls `useMarketingI18n()` and reads `learner.practiceTests.*` keys from the app layout's `MarketingI18nProvider`. The server page's `getLearnerMarketingBundle()` is not the source for the interactive hub copy.

The full component audit found that the high-visibility fallback labels reported by QA were covered by canonical source entries from prior work, but the component still had nearby missing keys that could fall through the same provider fallback path:

- `learner.practiceTests.hub.rationalesShortLabel`
- `learner.practiceTests.hub.rowAbandoned`
- `learner.practiceTests.hub.rowInProgress`
- `learner.practiceTests.hub.rowUntitled`

## Keys Added

- `learner.practiceTests.hub.rationalesShortLabel`: `Rationales`
- `learner.practiceTests.hub.rowAbandoned`: `Abandoned`
- `learner.practiceTests.hub.rowInProgress`: `In progress`
- `learner.practiceTests.hub.rowUntitled`: `Untitled practice session`

## Polished Copy Updated

- `learner.practiceTests.examFirst.heroTitle`: `Practice for your exam`
- `learner.practiceTests.examFirst.heroSubtitle`: `Build confidence with focused practice sets, CAT-style exams, rationales, and review tools matched to your nursing pathway.`
- `learner.practiceTests.examFirst.ctaCat`: `Start CAT exam`
- `learner.practiceTests.examFirst.ctaCatSublabel`: `Adaptive exam-style practice`
- `learner.practiceTests.examFirst.ctaCustom`: `Build a focused set`
- `learner.practiceTests.examFirst.studyToolsRailTitle`: `Study tools`
- `learner.practiceTests.examFirst.studyToolsRailIntro`: `Use focused review tools to strengthen weak areas before your next attempt.`
- `learner.practiceTests.hub.builderHeadline`: `Build a focused practice set`
- `learner.practiceTests.hub.builderIntro`: `Choose CAT, exam mode, or guided practice, then narrow by category, question count, difficulty, and rationale timing.`

Existing confirmed keys:

- `learner.practiceTests.hub.resumeCta`: `Resume`
- `learner.practiceTests.hub.reviewCta`: `Review`
- `learner.practiceTests.hub.rowQuestionCount`: `{{count}} questions`

## Generated Shards Updated

`npm run i18n:compile` updated runtime/generated i18n outputs, including:

- `nursenest-core/public/i18n/en/learner.json`
- `client/public/i18n/en.json`
- `src/lib/i18n/marketing-message-keys.generated.ts`
- `tools/i18n/marketing/locale/marketing-*.json`
- `tools/i18n/reports/placeholder-fallbacks.json`

The generated key catalog includes `learner.practiceTests.hub.rationalesShortLabel`, `learner.practiceTests.hub.rowInProgress`, and `learner.practiceTests.examFirst.heroTitle`.

## Tests Added

- `src/lib/i18n/practice-tests-hub-i18n-fallback.contract.test.ts`
  - Extracts `learner.practiceTests.examFirst.*` and `learner.practiceTests.hub.*` keys from `practice-tests-hub-client.tsx`.
  - Verifies all extracted keys exist in `marketing-en.json`.
  - Verifies all extracted keys compile into `nursenest-core/public/i18n/en/learner.json` and `client/public/i18n/en.json`.
  - Fails if known fallback-sensitive labels resolve to humanized key text like `Hero Title`, `Cta Cat`, `Builder Headline`, `Resume Cta`, `Review Cta`, or `Study Tools Rail Title`.

- `tests/e2e/practice-tests-hub-i18n.spec.ts`
  - Visits `/app/practice-tests?pathwayId=us-rn-nclex-rn` after logging in with the existing paid QA credential helper.
  - Asserts the known fallback labels are not visible.
  - Asserts polished copy such as `Practice for your exam`, `Start CAT exam`, `Build a focused practice set`, and `Study tools` is visible.
  - Skips when paid QA credentials are not configured.

## Validation Commands Run

Passed:

```bash
npm run i18n:compile
node --import tsx --test src/lib/i18n/practice-tests-hub-i18n-fallback.contract.test.ts
node -e '<runtime shard verification for app learner shard and client EN bundle>'
npm run typecheck:critical
npx playwright test tests/e2e/practice-tests-hub*.spec.ts --project=chromium
```

Playwright outcome: command completed successfully with one skipped test because paid QA credentials were not configured and no saved paid auth state existed in this checkout.

Requested broad globs were run and still fail on unrelated pre-existing tests:

```bash
node --import tsx --test src/lib/i18n/*.test.ts
node --import tsx --test src/lib/marketing-i18n/*.test.ts
```

Observed unrelated failures include Hindi/Tagalog readiness assertions, an older `public/i18n/en.json` path assumption, production chrome snapshot parity, metadata fallback assertions, and marketing chrome cache policy assertions. The new Practice Tests hub fallback contract passes independently.

## Remaining Locale Risk

The English runtime learner shard is protected. Non-English locale overlay files were aligned by the compile pipeline, but `tools/i18n/reports/placeholder-fallbacks.json` still reports placeholder fallback coverage in several non-English locales. That is existing locale-completion risk, not a blocker for the English RN learner hub fallback labels addressed here.
