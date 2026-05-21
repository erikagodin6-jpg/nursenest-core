# Lesson Image Coverage Audit

Generated: 2026-05-21T23:31:08.554Z

## Coverage

| Metric | Value |
| --- | --- |
| Pathways scanned | 9 |
| Marketing-renderable lessons | 3162 |
| Lessons with any resolved image | 359 (11.4%) |
| Lessons missing images | 2803 |
| Lessons that should have images | 318 |
| Should-have still missing/low quality | 183 |
| Should-have coverage | 42.5% |

## Status breakdown

- **no_image**: 2803
- **duplicate_image_candidate**: 324
- **low_quality_image**: 35

## Priority breakdown (should-have cohort)

- **CRITICAL**: 0
- **HIGH**: 57
- **MEDIUM**: 151
- **LOW**: 2954

## Production clusters

- **other**: 1781
- **np_clinical**: 761
- **respiratory**: 264
- **pharmacology**: 111
- **med_surg**: 82
- **emergency**: 53
- **labs**: 38
- **cardiac_arrhythmias**: 19
- **policy_study_skills**: 17
- **anatomy**: 15
- **procedures**: 11
- **cardiac_ecg**: 10

## Visual style governance

- Theme: blossom_mint_blossom
- Premium healthcare SaaS — soft neutral backgrounds, modern vector clinical education, Blossom/Mint palette, accessible contrast, non-stock-photo.
- Avoid: cheesy stock photography; cluttered infographics; oversaturated colors; inconsistent illustration styles; dark muddy overlays

## Output files

- `lesson-image-audit.json` — full row-level audit
- `lesson-image-audit.csv` — spreadsheet import
- `missing-images.json` — production queue (no/low/fuzzy match among should-have)
- `high-priority-images.json` — CRITICAL + HIGH roadmap
- `duplicate-opportunities.json` — shared visual systems / reuse

## Next steps

1. Produce CRITICAL/HIGH assets in cluster batches (cardiac ECG, respiratory PE, pharm insulin, etc.).
2. Upload to Spaces using `recommendedFilename` (prefer `.webp` / `.avif`).
3. Run `node scripts/sync-lesson-image-inventory.mjs` and re-run this audit.

