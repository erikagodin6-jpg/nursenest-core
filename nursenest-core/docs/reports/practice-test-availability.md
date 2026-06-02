# Practice Test Availability

Generated: 2026-06-02

## Objective

Practice test launch should degrade gracefully. A learner should receive a startable practice-test session whenever there is any usable generated, cached, or pre-generated inventory for the requested pathway.

## Implementation

### 1. Generated Test Cache

Implemented in:

- `src/lib/practice-tests/practice-test-availability.ts`
- `src/app/api/practice-tests/route.ts`

When a linear practice test is generated successfully, the API now writes a 24-hour availability snapshot containing:

- complete generated test question IDs
- answer key
- rationales and teaching metadata
- original config metadata
- pathway, categories, difficulty range, question count, and selection mode

Cache key dimensions:

- `pathwayId`
- normalized `categories`
- `difficultyMin`
- `difficultyMax`
- `questionCount`
- `selectionMode`

TTL:

- `24 hours`

Storage:

- cache layer via `cacheSet`
- local snapshot: `data/practice-test-cache/*.json`
- DigitalOcean Spaces when `SPACES_ENDPOINT`, `SPACES_BUCKET`, `SPACES_KEY`, and `SPACES_SECRET` are configured

### 2. Pre-Generated Exam Bank

Implemented in:

- `scripts/practice-tests/pregenerate-exam-bank.mts`
- package command: `npm run practice-tests:pregenerate-bank`

The background job creates banked exams for:

- RN
- RPN
- PN
- NP

Exam sizes:

- 50 questions
- 100 questions
- 150 questions

Storage:

- local snapshots: `data/practice-test-bank/*.json`
- cache layer
- DigitalOcean Spaces when configured

The generator is pathway-scoped through `studyLinkPathwayId` so fallback exams do not silently mix unrelated pathway pools.

### 3. Runtime Fallback Logic

Practice test creation now follows:

1. Primary: generate from the live eligible pool.
2. Secondary: use a matching 24-hour generated-test cache for shared modes.
3. Tertiary: use a pre-generated pathway exam bank.

Shared generated-cache fallback is enabled for:

- `random`
- `targeted`
- `unseen`

User-specific modes such as weak, missed, or starred do not reuse another learner's generated cache. If their live pool is unavailable, the final pre-generated exam bank is used as a truthful random fallback and the persisted config records `availabilityFallback.source = "pre_generated"`.

### 4. Metrics And Logs

Reliability counters:

- `practice:tier_a`: live generation success
- `practice:tier_b`: generated-cache fallback used
- `practice:tier_c`: pre-generated bank fallback used
- `practice:tier_d_error`: primary generation failure

Server log events:

- `linear_primary_generation_failed`
- `linear_generated_test_cached`
- `linear_availability_cache_hit`
- `linear_availability_cache_rejected`
- `linear_availability_pregenerated_hit`
- `linear_availability_pregenerated_rejected`
- `practice_test_snapshot_spaces_upload_failed`

These support:

- cache hit rate
- fallback usage
- generation failure tracking
- Spaces upload failure visibility

## Failure Recovery Paths

| Failure | Recovery |
| --- | --- |
| Live pool selection fails for shared mode | Try matching generated-test cache |
| Generated cache missing or invalid | Try pre-generated pathway bank |
| User-specific mode pool is empty | Skip shared generated cache, use pathway pre-generated bank |
| Spaces upload fails | Keep local/cache snapshot and log upload failure |
| Snapshot hydrate contract fails | Reject fallback and continue to next recovery path |

## Launch Time Expectations

Before:

- Practice test launch depended only on live question selection and DB creation.
- Pool failures returned `400 pool_too_small`.
- No pre-generated recovery path existed.

After:

- Live generation path remains the primary path.
- Successful shared generated tests are snapshot asynchronously through `safeStudyOptional` with a 1.5s ceiling.
- Cache fallback requires snapshot read plus normal `PracticeTest` row creation.
- Pre-generated fallback requires local snapshot read plus normal `PracticeTest` row creation.

Production before/after latency should be measured from route telemetry after the pregeneration job is run in the target environment. This change adds recovery paths without changing the normal primary selection algorithm.

## Verification

Commands run:

- `npm run typecheck:critical` - passed
- `node --import tsx scripts/practice-tests/pregenerate-exam-bank.mts --help` - passed
- `npm run test:unit:practice` - passed, 14 tests
- `npm run practice-tests:pregenerate-bank` - blocked in this shell because `DATABASE_URL` is not set; the command now exits cleanly and records `blocked_missing_database_url` in `reports/practice-test-availability-pregeneration.json`

## Remaining Operational Step

Run:

```bash
npm run practice-tests:pregenerate-bank
```

Then schedule it as a deploy/cron refresh job so RN, RPN, PN, and NP always have 50-, 100-, and 150-question fallback exams available in the local snapshot layer, cache layer, and Spaces when configured.

The local verification shell did not expose `DATABASE_URL`, so bank population could not complete here. Run the command in the production/deploy environment where Prisma can read the published question pool.
