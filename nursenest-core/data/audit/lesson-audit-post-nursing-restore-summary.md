# Lesson audit — post–nursing-restore planning

Generated: 2026-04-14T13:57:22.872Z

## Nursing catalog completeness (bundled catalog.json)

| Tier | Total lessons | Public complete | Incomplete |
|------|---------------|-----------------|------------|
| PN | 300 | 148 | 152 |
| RN | 375 | 72 | 303 |
| NP | 161 | 115 | 46 |

## Legacy → current mapping (PN / RN / NP rows only)

- merge_into_existing: 3
- create_missing_current_lesson: 1123
- review_needed: 0
- duplicate_flag: 0

## Pre/post test merge candidates

Count: **0** (catalog row missing pre/post or structurally incomplete while legacy source contains preTest/postTest patterns).

First rows are listed in `lesson-audit-post-nursing-restore.json` as `prePostMergeCandidatesSample`.

## Execution status

- **Content merges applied this run:** 0 (audit only).
- **Schema / auth / routes:** unchanged.
- **External volumes:** not mounted; use repo `client/src/data/lessons` as legacy source of truth here.

## Next batches

1. PN lesson enrichment merges (editorial + `convert-legacy-lesson-to-enrichment.ts`).
2. RN, then NP.
3. Pre/post restoration from candidate list.
4. Layout harmonization (semantic tokens only).
5. Performance guards where loaders exceed safe size.
6. Allied after nursing stabilizes.
