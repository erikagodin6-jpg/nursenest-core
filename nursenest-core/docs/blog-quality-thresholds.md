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
rg "BLOG_GOVERNANCE_|DIMENSION_WEIGHTS" nursenest-core/src/lib/blog/blog-quality-score.ts
```

(From monorepo root, adjust path if your checkout layout differs.)
