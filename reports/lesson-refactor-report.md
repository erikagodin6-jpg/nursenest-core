# Lesson library refactor (generated)

- **Generated at:** 2026-04-27T10:38:56.981Z
- **Source:** bundled `catalog.json` + allied + new-grad + scoped-gold via `getCatalogLessonsRawFromBundledOnly` per pathway.
- **Pathways merged:** us-rn-nclex-rn, ca-rn-nclex-rn, ca-rpn-rex-pn, us-lpn-nclex-pn, us-np-fnp, us-np-agpcnp, us-np-pmhnp, us-np-whnp, us-np-pnp-pc, ca-np-cnple

## Counts

| Metric | Value |
|--------|------:|
| Total lesson rows summed across pathways (before global dedupe) | 1011 |
| Unique slugs in `lesson-library.json` (after) | 485 |
| Rows consolidated by shared slug across pathways | 526 |

## Notes

- Each library row includes `pathwayIds` listing every pathway that referenced that slug.
- `topic` is normalized with `normalizeLessonCategory`; `title` with `premiumizeLessonDisplayTitle` (incl. NP integrated-review rewrite and ≤6-word clamp).
- Runtime loads this file when present; see `getCatalogLessonsRaw` in `pathway-lesson-catalog-sync.ts`.
