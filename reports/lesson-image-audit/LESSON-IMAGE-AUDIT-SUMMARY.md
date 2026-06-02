# Lesson Image Coverage Audit

Generated: 2026-06-01T22:19:17.843Z

## Coverage

| Metric | Value |
| --- | --- |
| Pathways scanned | 1 |
| Marketing-renderable lessons | 801 |
| Lessons with any resolved image | 89 (11.1%) |
| Lessons missing images | 712 |
| Lessons that should have images | 90 |
| Should-have still missing/low quality | 53 |
| Should-have coverage | 41.1% |

## Status breakdown

- **no_image**: 712
- **duplicate_image_candidate**: 80
- **fuzzy_match**: 3
- **fallback_match**: 2
- **low_quality_image**: 2
- **exact_match**: 2

## Priority breakdown (should-have cohort)

- **CRITICAL**: 19
- **HIGH**: 22
- **MEDIUM**: 22
- **LOW**: 738

## Production clusters

- **other**: 650
- **respiratory**: 68
- **med_surg**: 29
- **pharmacology**: 17
- **labs**: 11
- **emergency**: 11
- **cardiac_arrhythmias**: 5
- **procedures**: 5
- **cardiac_ecg**: 2
- **policy_study_skills**: 2
- **anatomy**: 1

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
- `critical-images.md` / `high-priority-images.md` / `medium-priority-images.md` — human production queues
- `image-production-roadmap.csv` / `.json` — full prioritized backlog
- `duplicate-visual-systems.md` — modular reuse opportunities
- `IMAGE-PRODUCTION-ROADMAP.md` — what to create next (executive summary)

## Next steps

1. Produce CRITICAL/HIGH assets in cluster batches (cardiac ECG, respiratory PE, pharm insulin, etc.).
2. Upload to Spaces using `recommendedFilename` (prefer `.webp` / `.avif`).
3. Run `node scripts/sync-lesson-image-inventory.mjs` and re-run this audit.

