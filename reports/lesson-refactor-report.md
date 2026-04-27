# Lesson library refactor (generated)

- **Generated at:** 2026-04-27T10:16:59.437Z
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

## Implementation (code)

- **`lesson-taxonomy.ts`:** Hub layout (`RN_PN_RPN_HUB_CATEGORY_DEFS`, `NP_HUB_CATEGORY_DEFS`), `TOPIC_CLUSTER_GROUP_TITLES`, taxonomy→hub mappers (`mapTaxonomyLeafToRnPnHubCategory`, `mapTaxonomyLeafToNpHubCategory`, `mapTaxonomyLeafToNursingHubCategory`), `clampDisplayTitleToWordBudget`, NP integrated-review titles without `#` (uses clinical area + parenthetical detail), optional `slug` on `premiumizeLessonDisplayTitle` plus `PREMIUM_DISPLAY_TITLE_OVERRIDES_BY_SLUG` for `antihypertensive-combos` vs scoped-gold `med-family-antihypertensives-gold`.
- **`pathway-learning-structure.ts`:** RN/PN/RPN and NP hub `LearningCategory[]` built from those defs (no parallel title/description tables for those hubs).
- **`pathway-lesson-body-system-groups.ts`:** Imports hub mapper from `lesson-taxonomy` (single implementation).
- **`lesson-topic-cluster-registry.ts`:** Group labels from `TOPIC_CLUSTER_GROUP_TITLES`.
- **`pathway-lesson-catalog-sync.ts`:** `getCatalogLessonsRawFromBundledOnly` for tooling; `getCatalogLessonsRaw` prefers `lesson-library.json` when present.
- **`scripts/build-lesson-library.mts`:** Regenerates library + this report.

## Lessons flagged / titles

- NP “Integrated review … #N … FNP” pattern: rewritten to `{area}: {detail}` (no numbered “Review N”).
- Scoped-gold vs catalog collision on **Antihypertensives**: resolved via slug override for `antihypertensive-combos` → **Antihypertensives: Combos** (see `PREMIUM_DISPLAY_TITLE_OVERRIDES_BY_SLUG`).
