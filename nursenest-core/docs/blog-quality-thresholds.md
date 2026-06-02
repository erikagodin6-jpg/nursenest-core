# Blog governance thresholds

**Single source of truth:** numeric defaults and weights live only in **`src/lib/blog/blog-quality-score.ts`**.

Look up current values in that file for exports:

- `BLOG_GOVERNANCE_MIN_PUBLISH_SCORE`
- `BLOG_GOVERNANCE_REPETITION_BLOCK_BELOW`
- `BLOG_GOVERNANCE_MIN_INTERNAL_BODY_LINKS`
- `BLOG_GOVERNANCE_MIN_H2_COUNT`
- `DIMENSION_WEIGHTS` (weights sum to **1.0**)

Do **not** duplicate the numeric table here; it drifts from code. For a quick local check:

```bash
# From this package root (`nursenest-core/` where `package.json` lives)
rg "BLOG_GOVERNANCE_|DIMENSION_WEIGHTS" src/lib/blog/blog-quality-score.ts
```

## H2 section similarity (publish gate)

Embedding-free pairwise Jaccard on word sets (length ≥4, stopwords stripped) between **teaching** H2 segments: soft clustering counts pairs above `BLOG_SECTION_JACCARD_SOFT_THRESHOLD`; a **hard block** fires when the single worst pair reaches `BLOG_SECTION_JACCARD_HARD_THRESHOLD` (see exports in `src/lib/blog/blog-content-quality-gate.ts`). Documented here by symbol name only so values stay canonical in TypeScript.
