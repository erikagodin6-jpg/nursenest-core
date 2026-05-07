# CAT loading regression — investigation and fix

## Root cause (summary)

1. **Slow / heavy readiness path**: `assessCatPracticeReadinessForPathway` called `fetchCatPracticePool`, which ran `prisma.examQuestion.count` plus a single `findMany` up to 4000 rows with full stems, options, correct answers, and rationales before filtering. That inflated latency on every `/api/practice-tests/cat-readiness` call.

2. **Marketing snapshot drift**: `pathway-question-bank-snapshot` counted adaptive-eligible completes without `validatePracticeCatPool`. Allied hub used `adaptiveEligibleCount > 0` for practiceExamReady.

3. **Staff vs pool**: Readiness API returned synthetic counts for staff without querying the pool; marketing eligibility skipped pool checks for staff.

4. **Direct launch**: No HTTP timeout on readiness/POST; risk of infinite spinner.

5. **Pre-Nursing floor**: Hubs compared to 30 only; in-app uses `catReadinessMinCompletePoolRows` (8 for pre-nursing).

## Validation (this environment)

- `npm run typecheck`: not completed (exit 137 OOM in sandbox).
- `npm run verify:learning-surfaces`: OK.
- `npm run audit:paywall-security`: 12/12 pass.
- Focused tsx tests: cat-direct-launch-session, pathway-marketing-practice-gates, cat.test + flashcards-inventory-cat-pool-parity: pass.

## Truthpack

`.vibecheck/truthpack/` not present in clone; no new routes/env invented.

## Manual spot-check

`/us/rn/nclex-rn`, `/canada/rn/nclex-rn`, `/canada/pn/rex-pn`, one NP pathway.

See git diff for full file list.
