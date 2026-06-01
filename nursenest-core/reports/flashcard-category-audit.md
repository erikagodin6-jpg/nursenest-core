# Flashcard Category Failure Audit

Generated: 2026-06-01

## Summary

Users were seeing "There are no flashcards that match that category" even when the category had content. The failure was not a single empty-content issue. It was a false empty state caused by category taxonomy divergence and session serialization behavior.

## Root Cause

1. Taxonomy mismatch / source-of-truth divergence

   The flashcard launcher displays categories from the shared learner body-system hierarchy, while the custom-session builder classified cards through `resolveBuilderCategoryId`. Session filtering compared selected raw category IDs directly against classified builder IDs. That failed for equivalent aliases:

   - `infection_control` selected in the launcher, cards classified as `immune_infectious`
   - `renal_urinary` selected in the launcher, cards classified as `renal_genitourinary`
   - `reproductive_maternal_newborn` selected in the launcher, cards classified as `reproductive_obstetrics`

2. Serialization false empty

   Some categories had matching cards but returned zero usable session cards because custom sessions only accepted strict four-option MCQ payloads. Legacy exam-backed rows with usable front/back flashcard content and incomplete option metadata were discarded. This reproduced on:

   - `fundamentals_safety`: 91 matching cards, 0 returned before fix
   - `musculoskeletal`: 1 matching card, 0 returned before fix

3. Inventory audit stability

   The inventory loader used parameterized `SET LOCAL statement_timeout`, which PostgreSQL rejects. Optional diagnostic counts could also timeout and abort or materially delay the inventory request. These were audit/runtime hardening issues that could turn a diagnostic failure into an inventory failure. Expensive diagnostic counts are now opt-in via `FLASHCARD_INVENTORY_DIAGNOSTIC_COUNTS=1`.

## Files Responsible

- `src/components/flashcards/flashcards-hub-client.tsx`: category selection source and session query parameters.
- `src/lib/learner-study-hub/body-system-data.ts`: canonical body-system mapping used by learner hubs.
- `src/lib/flashcards/build-flashcard-custom-session.ts`: category filtering, category count summaries, session pool generation.
- `src/lib/flashcards/flashcard-builder-taxonomy.ts`: independent card category classifier.
- `src/lib/flashcards/flashcard-study-serialize.ts`: MCQ/plain flashcard serialization boundary.
- `src/lib/flashcards/load-flashcards-exam-inventory.server.ts`: live inventory counts and diagnostic aggregation.

## Content Taxonomy Verification

Flashcards, CAT, Practice Tests, Study Plans, and Weak Areas are intended to converge on the canonical pathway/body-system taxonomy. The defect was that Flashcards displayed the canonical taxonomy but filtered custom sessions against raw builder IDs. The fix normalizes both selected categories and classified cards through `pathwayHubCategoryToCanonical` before counting or filtering.

## Category Inventory Counts

Inventory counts are live content-pool counts from the shared exam/lesson-backed flashcard inventory path. "Published Count" is the pathway matching total. "Final Available" is the expected available session pool after canonical filtering; focused live launch verification confirmed the previously broken categories return cards after the fix.

| Group | Pathway | Published Count | Visible Categories With Cards |
|---|---|---:|---:|
| RN | `ca-rn-nclex-rn` | 6202 | 16 |
| RN | `us-rn-nclex-rn` | 9893 | 16 |
| RPN | `ca-rpn-rex-pn` | 6668 | 16 |
| PN | `us-lpn-nclex-pn` | 6171 | 16 |
| NP | `ca-np-cnple` | 2234 | 19 |
| NP | `us-np-fnp` | 6400 | 16 |
| NP | `us-np-agpcnp` | 3386 | 18 |
| NP | `us-np-pmhnp` | 3079 | 16 |
| NP | `us-np-whnp` | 2722 | 15 |
| NP | `us-np-pnp-pc` | 2621 | 15 |

### RN Canada (`ca-rn-nclex-rn`)

| Category ID | Category Slug | Flashcard Count | Filtered Count |
|---|---|---:|---:|
| `cardiovascular` | `cardiovascular` | 1097 | 1097 |
| `respiratory` | `respiratory` | 1073 | 1073 |
| `neurological` | `neurological` | 611 | 611 |
| `gastrointestinal` | `gastrointestinal` | 218 | 218 |
| `renal_urinary` | `renal-urinary` | 295 | 295 |
| `endocrine` | `endocrine` | 537 | 537 |
| `reproductive_maternal_newborn` | `reproductive-maternal-newborn` | 29 | 29 |
| `pediatrics` | `pediatrics` | 311 | 311 |
| `pharmacology` | `pharmacology` | 13 | 13 |
| `infection_control` | `infection-control` | 273 | 273 |
| `fundamentals_safety` | `fundamentals-safety` | 92 | 92 |
| `professional_practice` | `professional-practice` | 148 | 148 |
| `REVIEW_REQUIRED` | `review-required` | 735 | 735 |
| `hematology_oncology` | `hematology-oncology` | 204 | 204 |
| `integumentary` | `integumentary` | 98 | 98 |
| `musculoskeletal` | `musculoskeletal` | 19 | 19 |

### RN United States (`us-rn-nclex-rn`)

| Category ID | Category Slug | Flashcard Count | Filtered Count |
|---|---|---:|---:|
| `cardiovascular` | `cardiovascular` | 1402 | 1402 |
| `respiratory` | `respiratory` | 1612 | 1612 |
| `neurological` | `neurological` | 928 | 928 |
| `gastrointestinal` | `gastrointestinal` | 502 | 502 |
| `renal_urinary` | `renal-urinary` | 465 | 465 |
| `endocrine` | `endocrine` | 754 | 754 |
| `reproductive_maternal_newborn` | `reproductive-maternal-newborn` | 32 | 32 |
| `pediatrics` | `pediatrics` | 592 | 592 |
| `pharmacology` | `pharmacology` | 14 | 14 |
| `infection_control` | `infection-control` | 479 | 479 |
| `fundamentals_safety` | `fundamentals-safety` | 93 | 93 |
| `professional_practice` | `professional-practice` | 213 | 213 |
| `REVIEW_REQUIRED` | `review-required` | 1309 | 1309 |
| `hematology_oncology` | `hematology-oncology` | 381 | 381 |
| `integumentary` | `integumentary` | 160 | 160 |
| `musculoskeletal` | `musculoskeletal` | 16 | 16 |

### RPN Canada (`ca-rpn-rex-pn`)

| Category ID | Category Slug | Flashcard Count | Filtered Count |
|---|---|---:|---:|
| `cardiovascular` | `cardiovascular` | 1305 | 1305 |
| `respiratory` | `respiratory` | 1284 | 1284 |
| `neurological` | `neurological` | 613 | 613 |
| `gastrointestinal` | `gastrointestinal` | 291 | 291 |
| `renal_urinary` | `renal-urinary` | 289 | 289 |
| `endocrine` | `endocrine` | 490 | 490 |
| `reproductive_maternal_newborn` | `reproductive-maternal-newborn` | 42 | 42 |
| `pediatrics` | `pediatrics` | 278 | 278 |
| `pharmacology` | `pharmacology` | 18 | 18 |
| `infection_control` | `infection-control` | 182 | 182 |
| `fundamentals_safety` | `fundamentals-safety` | 119 | 119 |
| `professional_practice` | `professional-practice` | 149 | 149 |
| `REVIEW_REQUIRED` | `review-required` | 746 | 746 |
| `hematology_oncology` | `hematology-oncology` | 153 | 153 |
| `integumentary` | `integumentary` | 164 | 164 |
| `musculoskeletal` | `musculoskeletal` | 25 | 25 |

### PN United States (`us-lpn-nclex-pn`)

| Category ID | Category Slug | Flashcard Count | Filtered Count |
|---|---|---:|---:|
| `cardiovascular` | `cardiovascular` | 1003 | 1003 |
| `respiratory` | `respiratory` | 813 | 813 |
| `neurological` | `neurological` | 543 | 543 |
| `gastrointestinal` | `gastrointestinal` | 247 | 247 |
| `renal_urinary` | `renal-urinary` | 273 | 273 |
| `endocrine` | `endocrine` | 556 | 556 |
| `reproductive_maternal_newborn` | `reproductive-maternal-newborn` | 31 | 31 |
| `pediatrics` | `pediatrics` | 244 | 244 |
| `pharmacology` | `pharmacology` | 16 | 16 |
| `infection_control` | `infection-control` | 214 | 214 |
| `fundamentals_safety` | `fundamentals-safety` | 102 | 102 |
| `professional_practice` | `professional-practice` | 168 | 168 |
| `REVIEW_REQUIRED` | `review-required` | 919 | 919 |
| `hematology_oncology` | `hematology-oncology` | 240 | 240 |
| `integumentary` | `integumentary` | 155 | 155 |
| `musculoskeletal` | `musculoskeletal` | 58 | 58 |

### NP Pathways

| Pathway | Category ID | Category Slug | Flashcard Count | Filtered Count |
|---|---|---|---:|---:|
| `ca-np-cnple` | `cardiovascular` | `cardiovascular` | 644 | 644 |
| `ca-np-cnple` | `endocrine` | `endocrine` | 384 | 384 |
| `ca-np-cnple` | `neurological` | `neurological` | 357 | 357 |
| `ca-np-cnple` | `renal_genitourinary` | `renal-genitourinary` | 175 | 175 |
| `ca-np-cnple` | `immune_infectious` | `immune-infectious` | 148 | 148 |
| `ca-np-cnple` | `respiratory` | `respiratory` | 378 | 378 |
| `ca-np-cnple` | `REVIEW_REQUIRED` | `review-required` | 293 | 293 |
| `us-np-fnp` | `cardiovascular` | `cardiovascular` | 1420 | 1420 |
| `us-np-fnp` | `respiratory` | `respiratory` | 1056 | 1056 |
| `us-np-fnp` | `neurological` | `neurological` | 663 | 663 |
| `us-np-fnp` | `renal_genitourinary` | `renal-genitourinary` | 343 | 343 |
| `us-np-fnp` | `immune_infectious` | `immune-infectious` | 238 | 238 |
| `us-np-fnp` | `REVIEW_REQUIRED` | `review-required` | 855 | 855 |
| `us-np-agpcnp` | `cardiovascular` | `cardiovascular` | 572 | 572 |
| `us-np-agpcnp` | `endocrine` | `endocrine` | 461 | 461 |
| `us-np-agpcnp` | `respiratory` | `respiratory` | 450 | 450 |
| `us-np-agpcnp` | `neurological` | `neurological` | 382 | 382 |
| `us-np-agpcnp` | `REVIEW_REQUIRED` | `review-required` | 420 | 420 |
| `us-np-pmhnp` | `cardiovascular` | `cardiovascular` | 527 | 527 |
| `us-np-pmhnp` | `neurological` | `neurological` | 455 | 455 |
| `us-np-pmhnp` | `endocrine` | `endocrine` | 411 | 411 |
| `us-np-pmhnp` | `respiratory` | `respiratory` | 369 | 369 |
| `us-np-pmhnp` | `REVIEW_REQUIRED` | `review-required` | 331 | 331 |
| `us-np-whnp` | `cardiovascular` | `cardiovascular` | 371 | 371 |
| `us-np-whnp` | `endocrine` | `endocrine` | 336 | 336 |
| `us-np-whnp` | `neurological` | `neurological` | 310 | 310 |
| `us-np-whnp` | `respiratory` | `respiratory` | 292 | 292 |
| `us-np-whnp` | `REVIEW_REQUIRED` | `review-required` | 435 | 435 |
| `us-np-pnp-pc` | `cardiovascular` | `cardiovascular` | 385 | 385 |
| `us-np-pnp-pc` | `endocrine` | `endocrine` | 332 | 332 |
| `us-np-pnp-pc` | `neurological` | `neurological` | 310 | 310 |
| `us-np-pnp-pc` | `respiratory` | `respiratory` | 299 | 299 |
| `us-np-pnp-pc` | `REVIEW_REQUIRED` | `review-required` | 333 | 333 |

## Broken Categories

Pre-fix:

| Pathway | Category | Matching Cards | Final Session Pool | Root Cause |
|---|---|---:|---:|---|
| `ca-rn-nclex-rn` | `fundamentals_safety` | 91 | 0 | All selected cards failed strict MCQ serialization despite usable front/back content. |
| `ca-rn-nclex-rn` | `musculoskeletal` | 1 | 0 | All selected cards failed strict MCQ serialization despite usable front/back content. |
| Multiple RN/RPN/PN pathways | `infection_control`, `renal_urinary`, `reproductive_maternal_newborn` | >0 | Could filter to 0 | Raw selected category ID did not match canonical classified card ID. |

Post-fix:

No audited visible category has a known false empty condition. Categories with positive inventory now filter through canonical IDs, and legacy/incomplete exam-backed flashcards can render as plain front/back study cards.
