# CAT Taxonomy Consistency Finalization

## Summary

This pass keeps CAT validation strict while aligning category diversity with the same taxonomy policy used by CAT calibration. `categoryKeyForQuestion()` now treats `bodySystem`, `topic`, and `nclexClientNeedsCategory` as the ordered taxonomy sources before falling back to `General`.

## Final Taxonomy Precedence

1. `bodySystem`
2. `topic`
3. `nclexClientNeedsCategory`
4. `General`

Values are trimmed, whitespace-normalized, and lowercased for stable grouping. This avoids treating formatting variants such as `Safe   and Effective Care Environment` as distinct categories.

## Validation Semantics Preserved

The pass does not lower CAT row thresholds, bypass difficulty diversity, bypass category diversity, remove ECG exclusions, or admit module-only rows. Regression coverage now proves:

- NCLEX-only rows contribute diversity when body system and topic are missing.
- Rows with no taxonomy still collapse to `General`.
- Truly single-category pools still fail diversity validation.
- ECG and module-only rows remain excluded from CAT-ready counts.

## Inventory Diagnostics

`npm run audit:question-inventory -- --pathway us-rn-nclex-rn` now exposes taxonomy source breakdown, NCLEX-rescued rows, rows collapsing to `General`, diversity categories, and adaptive-eligible counts via the generated JSON artifact.

Latest local run:

- Published rows: 12,838
- Linear-practice-ready rows: 12,838
- CAT-ready rows: 11,660
- Incomplete rows: 1,127
- CAT pool valid: true
- Category source breakdown: bodySystem 11,617; topic 0; nclexClientNeedsCategory 0; general 43
- Final diversity categories: 95
- Rows collapsing to `General`: 43
- Rows rescued by NCLEX fallback: 0

## Staff Diagnostics

`/api/practice-tests/cat-readiness?diagnostics=staff` now requests optional readiness diagnostics, but the payload is included only when `getStaffSession()` resolves a DB-backed staff/admin session. Normal learner responses do not receive `staffDiagnostics`.

Staff diagnostics include:

- Published count when available
- Practice-ready count
- CAT-ready count
- Validation failure reason
- Category diversity counts

## Residual Risk

The latest RN inventory still has 43 CAT-ready rows with no taxonomy and therefore grouped under `General`. This no longer blocks CAT because the pool has sufficient diversity, but those rows should be tagged over time to improve blueprint explainability.
