# Bowtie Question Inventory and Expansion

Generated: 2026-05-10

## Summary

Before this expansion, the database had 443 published bowtie-compatible rows, all `exam = NCLEX-RN`, `tier = RN` (392 `Bowtie`, 51 `Trend`).

This implementation added 327 native published `Bowtie` rows:

- RPN / REx-PN: 75
- LVN/LPN / NCLEX-PN: 75
- NP: 75
- New Grad: 50
- Allied: 32
- Pre-Nursing: 20 foundation-style items

After import, total bowtie-compatible rows are 770 across RN plus the new native starter pools.

## Counts By Tier And Exam

| Tier stored | Exam | Bowtie-compatible count | New rows | Target | Remaining gap |
|---|---|---:|---:|---:|---:|
| RN | NCLEX-RN | 443 | 0 | 1000 | 557 |
| rpn | REx-PN | 75 | 75 | 1000 | 925 |
| lvn | NCLEX-PN | 75 | 75 | 1000 | 925 |
| np | NP | 75 | 75 | 1000 | 925 |
| new_grad | New Grad Transition | 50 | 50 | 1000 | 950 |
| allied | ALLIED | 32 | 32 | 1000 | 968 |
| pre_nursing | Pre-Nursing Foundations | 20 | 20 | 1000 | 980 |

## Counts By New Starter System

| Tier | Distribution |
|---|---|
| RPN | 5 each across Cardiovascular, Respiratory, Endocrine, Neurological, Renal/Urinary, Gastrointestinal, Maternal/Newborn, Pediatric, Mental Health, Pharmacology, Infection/Sepsis, Safety/Prioritization, Delegation, Labs/Diagnostics, Fluids/Electrolytes |
| LVN/LPN | 5 each across the same PN-safe 15 systems/categories as RPN |
| NP | 4-5 each across all 16 systems/categories, including ECG/Arrhythmia |
| New Grad | 3-4 each across all 16 systems/categories, including ECG/Arrhythmia |
| Allied | 8 each across Cardiovascular, Respiratory, Labs/Diagnostics, Safety/Prioritization |
| Pre-Nursing | 4 each across Cardiovascular, Respiratory, Endocrine, Renal/Urinary, Labs/Diagnostics |

## Import And Validation Status

- Import path extended: `src/lib/admin/question-bank-bulk-import.ts` now accepts structured `BOWTIE` rows and validates bank IDs, slot labels, correct mappings, rationales, taxonomy fields, and Allied `professionScope`.
- Import scripts added: `scripts/import-bowtie-question-batch.ts`, `scripts/bowtie-starter-batch-data.ts`, and `scripts/refresh-bowtie-starter-batch.ts`.
- Database import: 327 published rows created with validated stem-hash dedupe and refreshed in place after stricter clinical wording validation.
- Renderer support: rows use `questionType = Bowtie`, `options = { format: bowtie, bank, slotLabels, scenario }`, and `correctAnswer = { correctMapping }`.
- Tier casing fix: Prisma and SQL question-access filters now normalize tier comparisons case-insensitively at query boundaries. Existing uppercase RN rows are preserved.

## Clinical QA Notes

The starter batch is original NurseNest-authored content generated from scoped clinical patterns, not copied from external question banks. New rows use pathway-specific framing: RPN/LPN practical nursing scope, NP diagnostic/management reasoning, New Grad escalation and transition-to-practice, Allied respiratory/paramedic/MLT/PTA-appropriate language, and Pre-Nursing foundation reasoning.

These rows are a starter pool and should still receive human clinical review before scaling toward 1000 per tier. The generator includes tests for requested counts, mapping validity, distribution concentration, and Allied nursing-language leakage.

## Unresolved Risks And Gaps

- Full 1000-per-tier target remains incomplete; remaining gaps are listed above.
- CAT inclusion remains conditional until object-shaped bowtie options are fully validated through CAT completeness and adaptive balancing tests.
- RN coverage remains at the original 443 rows and still needs gap-focused RN expansion.
- Allied expansion should stay profession-specific; do not add generic nursing-style Allied bowties.
- Live DB schema differs from the current Prisma schema (`ecg_level` missing), so the dedicated importer uses narrow raw SQL for known existing columns.
