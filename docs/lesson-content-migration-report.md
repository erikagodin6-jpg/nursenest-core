# Lesson Content Migration Report

Generated: 2026-04-29
Mode: APPLIED

## Summary

| Metric | Count |
|--------|-------|
| Total lessons in catalog | 594 |
| Lessons passing depth gate (≥1,200w + ≥6 sections) | **276 (46%)** |
| Was passing before migration | 53 (9%) |
| Net new lessons meeting standard | **+223** |
| Enriched from legacy content | 215 |
| Enriched with structural scaffolding | 326 |
| Duplicate slugs (within pathway) | 0 |
| Placeholder copy detected | 0 |

## Tier Breakdown

| Tier | Passing | Total | % | Avg Words |
|------|---------|-------|---|-----------|
| RN (ca-rn + us-rn) | 150 | 265 | 57% | 1,428w |
| NP (us-np-fnp) | 81 | 91 | 89% | 1,357w |
| RPN/LPN (ca-rpn + us-lpn) | 45 | 198 | 23% | 1,084w |
| New Grad | 0 | 40 | 0% | 843w |

## Source Files

Legacy content mined from client/src/data/lessons/ — 450+ TypeScript files
containing 3,852 lessons with clinical-grade pathophysiology content.

Migration script: scripts/migrate-legacy-lesson-content.py
Matching strategy: Jaccard similarity on normalized title + slug word sets.
Match threshold: 0.35

## Key Enriched Lessons

| Catalog Slug | Before | After | Legacy Source |
|-------------|--------|-------|---------------|
| heart-failure-nursing-priorities-hy | 529w | 2,838w | hf-advanced |
| acute-myocardial-infarction-troponin | 474w | 2,813w | mi-management |
| asthma-status-asthmaticus | 558w | 2,883w | asthma-emergency |
| pulmonary-embolism-clues | 509w | 2,398w | pe-recognition |
| dka-vs-hhs-priorities-hy | 488w | 2,574w | dka-hhs-basics-np |
| increased-icp-positioning | 428w | 2,748w | increased-icp |
| gi-bleed-assessment | 422w | 2,329w | gi-bleed-basics-rpn |

## Remaining Thin Lessons (318)

Run AI upgrade next:
  npm run upgrade:catalog-lessons -- --pathway ca-rpn-rex-pn
  npm run upgrade:catalog-lessons -- --pathway us-lpn-nclex-pn

## Routing Integrity

- All slugs preserved — no route changes
- All preTest/postTest quiz data preserved
- All metadata (tier, topic, bodySystem) preserved
- Live pages continue reading from catalog.json via getCatalogPathwayLessonsSync()

## Verification

  npm run verify:lesson-content-depth
  npm run verify:lesson-content-depth:json
