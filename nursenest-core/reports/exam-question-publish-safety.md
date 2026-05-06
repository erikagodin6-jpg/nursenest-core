# ExamQuestion draft publish script — safety and learner surfaces

This document describes `scripts/publish-valid-draft-exam-questions.ts`, its modes, and how published rows interact with learner-facing pools.

## Modes

| Mode | Flags | Rationale | Stem | Taxonomy | `correct_answer` |
|------|-------|-----------|------|----------|------------------|
| **Minimal** | _(default)_ | Optional; if present, ≥5 trimmed chars | ≥10 chars | `topic` OR `body_system` | JSON present (non-empty array or non-empty scalar rules) |
| **Minimal + rationale** | `--require-rationale` | Required non-empty (+ ≥5 when trimmed) | ≥10 chars | `topic` OR `body_system` | Same as minimal |
| **Strict** | `--strict` | Required non-empty | Non-empty trimmed | `topic` OR `body_system` OR `nclex_client_needs_category` | `IS NOT NULL` only (legacy gate) |

All modes:

- Only `status` = draft (case-insensitive trim) is updated; published and other statuses are untouched.
- `status` is set to `published` and `published_at` is set if null.
- ECG / video-style formats and `ecg-video` tag are excluded from this script's publish predicate (same list as `EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL` + tag gate in `exam-question-bank-sql.ts`).
- `exam` must be on the publish allowlist (`examQuestionExamPublishAllowlist()`).

## Risk warnings

1. **Minimal + empty rationale** — Allowed by gates. Useful for bank normalization, dangerous if someone assumes every published row is CAT- or rationale-review-ready.
2. **Strict vs minimal `correct_answer`** — Strict uses a weaker DB check than minimal; prefer minimal or `--require-rationale` when JSON answer shape matters.
3. **Primary ineligible reasons** — Dry-run reports a single primary reason per ineligible draft (priority-ordered CASE). Independent diagnostic counts can overlap across criteria.
4. **Volume** — Use `--dry-run` and optionally `--dry-run --json` before apply. JSON omits `wouldUpdateIds` when the eligible count exceeds 200 (see `MAX_WOULD_UPDATE_IDS` in `exam-question-draft-publish-metrics.ts`).

## Learner-surface gating (audit summary)

| Surface | Empty / weak rationale behavior | ECG / video |
|---------|----------------------------------|-------------|
| **CAT / linear practice pool** (`cat-pool.ts`) | `isCompleteCatQuestionRow` requires non-empty rationale after `findMany`; incomplete rows are dropped from the shuffled pool. SQL `where` does not filter rationale, so empty rationale can waste fetch window slots but does not enter the adaptive pool. | `NON_ECG_PRACTICE_EXAM_WHERE` + `generalStudyBankModuleSurfaceWhere()` |
| **Flashcard hub / session SQL** (`flashcard-exam-bank-hub-inventory.ts`) | `FLASHCARD_USABILITY_SQL` does not require rationale; `bankExamQuestionRowToFlashcardStudySelectRow` synthesizes a fallback line when no field reaches ≥8 chars. | Excluded via format list + `ecg-video` tag |
| **Rationale-derived flashcard generation** (`flashcard-generation.ts`) | Requires rationale length ≥20 for that card type — separate path. | N/A |

No selection behavior was changed for this audit: minimal publish does not bypass CAT completeness filtering or ECG isolation.

## Recommended commands

```bash
cd nursenest-core
npx tsx scripts/publish-valid-draft-exam-questions.ts --dry-run
npx tsx scripts/publish-valid-draft-exam-questions.ts --dry-run --json
npx tsx scripts/publish-valid-draft-exam-questions.ts --require-rationale --dry-run
npx tsx scripts/publish-valid-draft-exam-questions.ts --strict --dry-run
```

Apply only after reviewing counts and sample IDs:

```bash
npx tsx scripts/publish-valid-draft-exam-questions.ts --require-rationale
```

## Rollback guidance

There is no automatic unpublish in this script. To roll back mistaken publishes:

1. Identify affected rows (e.g. from `wouldUpdateIds` in a saved JSON dry-run, or `published_at` window + `exam` / `status`).
2. Restore `status = 'draft'` (and optional `published_at = NULL`) via a controlled admin/SQL migration or one-off script only with DBA review.
3. Re-run `--dry-run --json` after rollback to confirm counts.

Prefer `--dry-run --json` output archived next to the apply command in change records.
