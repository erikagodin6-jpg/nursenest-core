# Public marketing lesson render — root cause (targeted pass)

## Summary

Marketing lesson routes resolve a lesson through the same **`normalizeLesson` → `evaluatePathwayLessonStructuralGate`** path as audits. **`structuralQuality.publicComplete`** must be true or the page calls **`notFound()`**.

For **allied bundled** lessons, rows were present in the merged catalog, but **`lessonUsesPremiumStructure` returned true** for any premium-shaped section (`introduction`, `pathophysiology_overview`, …) **without** requiring an author opt-in to the full premium spine (`red_flags` / `related_next_steps` / `tier_specific_relevance` with substantive bodies). That forced **`validatePathwayLessonPremium`**, which bundled allied content cannot pass (word floors, internal links, related refs, clinical scenario in premium sense).

Two additional issues blocked **legacy** public completion once premium was corrected:

1. **SEO description** — bundled builder emitted an **11-word** `seoDescription`, failing the **≥ ~12 word** structural check.
2. **Clinical scenario heuristic** — **`bodyLooksLikeClinicalScenario`** required `\bpatient\b` but not **“patients”**, so some long nursing sections failed the vignette check incorrectly.

## Per sample pathway (post-fix counts from `getEffectiveCatalogLessonsForPathwaySync`)

| Pathway | Effective rows | `publicComplete` (≈ would render publicly) |
|---------|----------------|-------------------------------------------|
| `us-allied-core` | 15 | 15 |
| `us-rn-nclex-rn` | 187 | 37 |
| `us-lpn-nclex-pn` | 150 | 74 |
| `us-np-fnp` | 161 | 115 |

RN/PN/NP: remaining non-rendering rows are predominantly **legacy depth / scenario subscriber checks**, not “missing from merged catalog.” Allied was uniquely blocked by **premium vs legacy mis-routing** plus the two normalization issues above.

## Artifacts

- Machine-readable: `reports/public-lesson-render-root-cause.json`
