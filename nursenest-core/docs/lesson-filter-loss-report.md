# Lesson Filter Loss Report

Date: 2026-05-31

## Manual Catalog Query Evidence

CA RN bundled catalog counts after corrected alias expansion:

| System | Lessons Found |
| --- | ---: |
| Cardiovascular | 66 |
| Respiratory | 50 |
| Neurological | 51 |
| Endocrine | 36 |
| Renal | 97 |
| Gastrointestinal | 74 |
| Mental Health | 9 |
| Pediatrics | 18 |
| Maternity | 56 |

## Filter Chain

1. Pathway filter.
2. Country/tier entitlement filter.
3. Publication filter.
4. Locale filter.
5. Renderability/safety filter.
6. Topic slug filter.

## Filter Loss Before Fix

The topic slug filter was the lossy step. Exact matching removed valid lessons when the requested slug was a UI/system alias instead of the stored lesson slug.

## Filter Loss After Fix

The topic filter now uses candidate expansion:

- `renal` includes `renal-and-urinary` and `fluids-electrolytes-and-acid-base`.
- `maternity` includes `maternal-and-newborn`.
- `mental-health` includes `mental_health`.
- `gastrointestinal` includes `nutrition`.

Entitlement, country, tier, publication, and safety filters remain unchanged.
