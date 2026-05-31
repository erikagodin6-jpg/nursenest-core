# Global Duplicate Content Report

## Detection Standard

Any asset with `90%+` similarity to another lesson, question, flashcard, blog, rationale, or clinical pearl requires manual review.

## Surfaces Audited

- Lesson similarity
- Question stem similarity
- Question option similarity
- Rationale similarity
- Flashcard prompt and answer similarity
- Blog section similarity
- Clinical pearl similarity
- Localized content source collisions

## Decision Rules

| Duplicate Type | Default Decision |
| --- | --- |
| Same concept, same explanation | Merge |
| Same keyword, different useful angle | Keep both if distinct |
| Same stem with answer swap | Reject |
| Same rationale template across many questions | Rewrite |
| Same flashcard definition repeated | Merge |
| Same blog scaffold copied across pages | Noindex, merge, or delete |
| Translation accidentally overwrote source language | Quarantine and restore source |

## Manual Review Questions

Reviewers should answer:

- Does this asset teach something meaningfully different?
- Is the learner better served by one stronger resource?
- Is the duplication caused by template generation?
- Does the duplicate distort blueprint or topic coverage counts?
- Is this a localization variant with legitimate regional differences?

## Governance Link

Code-level threshold:

`GLOBAL_DUPLICATE_MANUAL_REVIEW_THRESHOLD = 0.9`

Source:

`src/lib/content-quality/global-content-quality-governance.ts`
