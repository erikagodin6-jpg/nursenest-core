# CAT Category Diversity Taxonomy Fix

## Root Cause

CAT readiness used `validatePracticeCatPool` for strict diversity validation, but its category key came from `categoryKeyForQuestion`, which only considered `bodySystem` and `topic` before falling back to `General`.

This conflicted with the CAT pool calibration gate: `catCalibratedPool` already accepted rows with `nclexClientNeedsCategory` as valid CAT metadata. As a result, complete, adaptive-eligible, NCLEX-tagged rows could pass pool calibration and linear practice gates while still collapsing to `General` during CAT diversity validation.

## Before / After Category Diversity Behavior

Before:

- `bodySystem` present: used as the diversity category.
- `topic` present and `bodySystem` absent: used as the diversity category.
- `nclexClientNeedsCategory` present but both `bodySystem` and `topic` absent: ignored, so the row became `General`.
- Large pools with NCLEX client-needs taxonomy but sparse body-system/topic taxonomy could fail as a single-category pool.

After:

- `bodySystem` remains the preferred diversity source.
- `topic` remains the second diversity source.
- `nclexClientNeedsCategory` is used only as a fallback when both body-system and topic taxonomy are absent.
- Rows missing all three taxonomy fields still collapse to `General`.
- Values are trimmed, lowercased, and whitespace-collapsed before diversity counting to avoid splitting categories by casing or spacing drift.

## Affected Pathways

The fix applies to all CAT pool validation callers, including pathway readiness scans and pathway question-bank snapshots. It is most relevant for NCLEX-style pathways where `nclexClientNeedsCategory` is the canonical blueprint taxonomy and imported rows may not always have body-system/topic taxonomy filled.

The requested inventory audit was run for `us-rn-nclex-rn`; see `reports/question-inventory-us-rn-nclex-rn.json` for the current pathway-specific category source breakdown, rows collapsing to `General`, and rows rescued by the NCLEX fallback.

## Content Remediation Recommendation

Content remediation is still recommended for rows that rely on the fallback. The fallback prevents false CAT-unready states when NCLEX taxonomy is already present, but body-system/topic values still improve learner-facing organization, weak-area labeling, and non-NCLEX practice surfaces.

Rows that still collapse to `General` remain remediation targets because they lack body-system, topic, and NCLEX client-needs taxonomy.

## Validation Quality

This change does not lower CAT readiness requirements:

- Minimum pool sizes are unchanged.
- Difficulty diversity remains required.
- Category diversity remains required.
- Completeness checks are unchanged.
- ECG exclusions are unchanged.
- Module-only exclusions are unchanged.
- CAT calibration still requires difficulty plus at least one taxonomy source.

## Normalization Risk

Normalization intentionally trims, lowercases, and collapses whitespace. That reduces accidental category explosion from strings like `Safe   and Effective Care Environment` versus `safe and effective care environment`.

The main risk is over-broad merging if two taxonomy labels differ only by case or extra spaces but are intended to be distinct. That is acceptable for these category-level diversity checks because CAT readiness should validate meaningful coverage, not string formatting variance.
